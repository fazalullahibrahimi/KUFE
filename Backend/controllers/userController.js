const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler.js");
const validateMongoDBId = require("../utils/validateMongoDBId.js");
const generateToken = require("../utils/generateToken.js");
const Email = require("../utils/email.js");
const getAll = require("./handleFactory.js");

const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const Joi = require("joi");
const NotificationService = require("../services/notificationService");

// Multer and image processing setup remains the same
// Configure Multer Storage in memory
const multerStorage = multer.memoryStorage();

// Filter to ensure only images are uploaded
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Not an image! Please upload only images.", false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Middleware to handle single image file upload with name 'image'
const uploadUserPhoto = upload.single("image");

// Define the validation schema
const userValidationSchema = Joi.object({
  fullName: Joi.string().min(3).required().messages({
    "string.base": `"fullName" should be a type of 'text'`,
    "string.empty": `"fullName" cannot be an empty field`,
    "string.min": `"fullName" should have a minimum length of {#limit}`,
    "any.required": `"fullName" is a required field`,
  }),
  email: Joi.string().email().required().messages({
    "string.base": `"email" should be a type of 'text'`,
    "string.empty": `"email" cannot be an empty field`,
    "string.email": `"email" must be a valid email`,
    "any.required": `"email" is a required field`,
  }),
  password: Joi.string().min(8).required().messages({
    "string.base": `"password" should be a type of 'text'`,
    "string.empty": `"password" cannot be an empty field`,
    "string.min": `"password" should have a minimum length of {#limit}`,
    "any.required": `"password" is a required field`,
  }),
  role: Joi.string()
    .valid("admin", "teacher", "student", "committeeMember")
    .default("student"),
  image: Joi.string().allow(null).optional().messages({
    "string.base": `"image" should be a type of 'text'`,
  }),
}).default({ image: "default-user.jpg" }); // Set default image

// Define the validation schema for contact
const contactValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": `"name" should be a type of 'text'`,
    "string.empty": `"name" cannot be an empty field`,
    "any.required": `"name" is a required field`,
  }),

  email: Joi.string().email().required().messages({
    "string.base": `"email" should be a type of 'text'`,
    "string.empty": `"email" cannot be an empty field`,
    "string.email": `"email" must be a valid email`,
    "any.required": `"email" is a required field`,
  }),

  message: Joi.string().required().messages({
    "string.base": `"message" should be a type of 'text'`,
    "string.empty": `"message" cannot be an empty field`,
    "any.required": `"message" is a required field`,
  }),
});

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { error } = userValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      success: false,
      message: error.details[0].message,
    });
  }

  const { fullName, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(409).send({
      success: false,
      message: "User already exists",
    });
  }

  // Check if trying to create admin account when one already exists
  if (role === "admin") {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(403).send({
        success: false,
        message: "Admin account already exists. Only one admin account is allowed for system security.",
      });
    }
  }

  const newUser = new User({
    fullName,
    email,
    password,
    role,
    image: req.file ? req.file.filename : "default-user.jpg",
    isVerified: false, // Set as unverified by default
  });

  try {
    await newUser.save();

    // Generate verification token and OTP
    const verificationToken = newUser.createEmailVerificationToken();
    await newUser.save({ validateBeforeSave: false });

    // Generate OTP (6-digit number)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP hash in the database
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    newUser.verifyEmailToken = hashedOtp;
    newUser.verifyEmailTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await newUser.save({ validateBeforeSave: false });

    // Create verification URL (for link-based verification alternative)
    const verificationURL = `${req.protocol}://${req.get(
      "host"
    )}/api/users/verify-email/${verificationToken}`;

    // Send verification email with OTP
    try {
      await new Email(newUser, verificationURL).sendVerificationOTP(otp);

      // Create notification for admins about new user registration
      try {
        await NotificationService.notifyUserRegistration(newUser);
      } catch (notificationError) {
        console.error('Error creating registration notification:', notificationError);
        // Don't fail the registration if notification fails
      }

      res.status(201).json({
        success: true,
        message:
          "User registered successfully! Please check your email for verification OTP.",
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          image: newUser.image,
          isVerified: newUser.isVerified,
        },
      });
    } catch (error) {
      // If email sending fails, reset verification tokens
      newUser.verifyEmailToken = undefined;
      newUser.verifyEmailTokenExpires = undefined;
      await newUser.save({ validateBeforeSave: false });

      return res.status(500).send({
        success: false,
        message: "Error sending verification email. Please try again later.",
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error saving user",
      error: error.message,
    });
  }
});

const loginValidationSchema = Joi.object({
  email: Joi.string()
    .email() // Valid email format
    .required()
    .messages({
      "string.base": `"email" should be a type of 'text'`,
      "string.empty": `"email" cannot be an empty field`,
      "string.email": `"email" must be a valid email`,
      "any.required": `"email" is a required field`,
    }),

  password: Joi.string()
    .min(8) // Minimum length of 8 characters
    .required()
    .messages({
      "string.base": `"password" should be a type of 'text'`,
      "string.empty": `"password" cannot be an empty field`,
      "string.min": `"password" should have a minimum length of {#limit}`,
      "any.required": `"password" is a required field`,
    }),
});

// Login user - Updated to check for email verification
const loginUser = asyncHandler(async (req, res) => {
  // Validate the request body
  const { error } = loginValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      success: false,
      message: error.details[0].message,
    });
  }

  const { email, password } = req.body;

  const existingUser = await User.findOne({ email }).select("+password");

  if (!existingUser) {
    return res.status(401).send({
      success: false,
      message: "Email or password is incorrect!",
    });
  }

  // Check if user's email is verified
  if (!existingUser.isVerified) {
    return res.status(403).send({
      success: false,
      message: "Please verify your email before logging in.",
      needsVerification: true,
      userId: existingUser._id,
    });
  }

  // Check password
  if (await existingUser.correctPassword(password, existingUser.password)) {
    const token = generateToken(existingUser._id);

    // If user is a committee member, get their committee member ID
    let committeeId = null;
    let departmentId = null;

    if (existingUser.role === "committeeMember") {
      try {
        // Import CommitteeMember model
        const CommitteeMember = require("../models/CommitteeMember");

        // Find committee member record
        const committeeMember = await CommitteeMember.findOne({
          userId: existingUser._id,
        });

        if (committeeMember) {
          committeeId = committeeMember._id;
          departmentId = committeeMember.department;
        }
      } catch (error) {
        console.error("Error fetching committee member details:", error);
      }
    }

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        _id: existingUser._id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        role: existingUser.role,
        image: existingUser.image,
        token,
        committeeId: committeeId,
        department_id: departmentId,
      },
    });
  } else {
    return res.status(401).send({
      success: false,
      message: "Email or password is incorrect!",
    });
  }
});

// Verify email with OTP
const verifyEmailWithOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Please provide both email and OTP.",
    });
  }

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "No user found with this email.",
    });
  }

  if (user.isVerified) {
    return res.status(400).json({
      success: false,
      message: "Email already verified. Please login.",
    });
  }

  // Hash the received OTP
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  // Compare OTPs
  if (
    user.verifyEmailToken !== hashedOtp ||
    user.verifyEmailTokenExpires < Date.now()
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP. Please request a new one.",
    });
  }

  // Set user as verified
  user.isVerified = true;
  user.verifyEmailToken = undefined;
  user.verifyEmailTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  // Create notification for admins about email verification
  try {
    await NotificationService.notifyAllAdmins({
      title: 'User Email Verified',
      message: `${user.fullName} has successfully verified their email address`,
      type: 'user_registration',
      priority: 'low',
      data: { userId: user._id, action: 'email_verified' }
    });
  } catch (notificationError) {
    console.error('Error creating verification notification:', notificationError);
  }

  res.status(200).json({
    success: true,
    message: "Email verified successfully! You can now login.",
  });
});

// Verify email with token (alternative link-based method)
const verifyEmail = asyncHandler(async (req, res) => {
  // 1. Get token from params
  const emailToken = req.params.token;

  // 2. Hash the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(emailToken)
    .digest("hex");

  // 3. Find user with the token
  const user = await User.findOne({
    verifyEmailToken: hashedToken,
    verifyEmailTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired verification link",
    });
  }

  // 4. Update user verification status
  user.isVerified = true;
  user.verifyEmailToken = undefined;
  user.verifyEmailTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  // 5. Generate JWT token for auto-login
  const authToken = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: "Email verified successfully!",
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      image: user.image,
      token: authToken,
    },
  });
});

// Resend verification OTP
const resendVerificationOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({
      success: false,
      message: "Please provide your email",
    });
  }

  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found",
    });
  }

  if (user.isVerified) {
    return res.status(400).send({
      success: false,
      message: "Email already verified",
    });
  }

  // Generate new verification token
  const verificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Generate OTP (6-digit number)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP hash
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  user.verifyEmailToken = hashedOtp;
  user.verifyEmailTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  // Create verification URL (for link-based verification alternative)
  const verificationURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/verify-email/${verificationToken}`;

  try {
    await new Email(user, verificationURL).sendVerificationOTP(otp);

    res.status(200).json({
      success: true,
      message: "Verification OTP sent successfully!",
    });
  } catch (error) {
    user.verifyEmailToken = undefined;
    user.verifyEmailTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).send({
      success: false,
      message: "Error sending verification email. Please try again later.",
    });
  }
});

const resizeUserPhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const dir = path.join(__dirname, ".././public/img/users");
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (error) {
      console.error("Error creating image directory:", error);
      return res.status(500).send({
        success: false,
        message: "Failed to create image directory",
      });
    }
  }

  const filename = `user-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}.jpeg`;
  req.file.filename = filename;

  try {
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(path.join(dir, filename));
  } catch (error) {
    console.error("Error processing image:", error);
    return res.status(500).send({
      success: false,
      message: "Error processing image",
    });
  }

  next();
});

const updateUserPhoto = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      image: req.file.filename,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// Other functions remain the same
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

const getCurrentUserProfile = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDBId(_id);

  const user = await User.findById({ _id });
  if (user) {
    res.status(200).json({
      status: "success",
      data: {
        _id: user._id,
        FullName: user.fullName,
        email: user.email,
        image: user.image,
        role: user.role,
      },
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }
});

// Update User By Id (only admin can)
const updateUserValidationSchema = Joi.object({
  fullName: Joi.string()
    .min(4) // At least 4 characters long
    .optional()
    .messages({
      "string.base": `"fullName" should be a type of 'text'`,
      "string.min": `"fullName" should have a minimum length of {#limit}`,
    }),

  email: Joi.string()
    .email() // Valid email format
    .optional()
    .messages({
      "string.base": `"email" should be a type of 'text'`,
      "string.email": `"email" must be a valid email`,
    }),

  role: Joi.string()
    .valid("user", "admin", "guide") // Enum validation
    .optional()
    .messages({
      "string.base": `"role" should be a type of 'text'`,
      "any.only": `"role" must be one of [user, admin, guide]`,
    }),
});

const updateUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);

  // Validate the request body
  const { error } = updateUserValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      success: false,
      message: error.details[0].message, // Return the first validation error message
    });
  }

  const { fullName, email, role } = req.body;

  const user = await User.findById(id);

  if (user) {
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.role = role || user.role;

    const updatedUser = await user.save();
    res.status(200).json({
      success: true,
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "User not found!",
    });
  }
});

// Update current user profile
const updateProfileValidationSchema = Joi.object({
  fullName: Joi.string()
    .min(4)
    .optional()
    .messages({
      "string.base": `"fullName" should be a type of 'text'`,
      "string.min": `"fullName" should have a minimum length of {#limit}`,
    }),

  FullName: Joi.string()
    .min(4)
    .optional()
    .messages({
      "string.base": `"FullName" should be a type of 'text'`,
      "string.min": `"FullName" should have a minimum length of {#limit}`,
    }),

  email: Joi.string()
    .email()
    .optional()
    .messages({
      "string.base": `"email" should be a type of 'text'`,
      "string.email": `"email" must be a valid email`,
    }),

  image: Joi.string()
    .optional()
    .allow(null)
    .messages({
      "string.base": `"image" should be a type of 'text'`,
    }),
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDBId(_id);

  // Validate the request body
  const { error } = updateProfileValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      success: false,
      message: error.details[0].message,
    });
  }

  const { fullName, FullName, email } = req.body;

  const user = await User.findById(_id);

  if (user) {
    // Use either fullName or FullName, whichever is provided
    user.fullName = fullName || FullName || user.fullName;
    user.email = email || user.email;
    
    // Update image if a new one was uploaded
    if (req.file) {
      user.image = req.file.filename;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        user: {
          _id: updatedUser._id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          image: updatedUser.image,
          role: updatedUser.role,
        }
      }
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
});

const getAllUsers = getAll(User);

const findUserByID = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDBId(id);

  const user = await User.findById({ _id: id });

  if (user) {
    res.status(200).json(user);
  } else {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
});

const deleteUserByID = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDBId(id);

  const user = await User.findById({ _id: id });
  if (user) {
    if (user.isAdmin) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete user as admin!",
      });
    }

    await User.deleteOne({ _id: user._id });
    res.status(204).json({ message: "User removed successfully" });
  } else {
    return res.status(404).json({
      success: false,
      message: "User not found!",
    });
  }
});

// Check if admin exists (public endpoint for registration form)
const checkAdminExists = asyncHandler(async (req, res) => {
  const adminExists = await User.findOne({ role: "admin" });

  res.status(200).json({
    success: true,
    adminExists: !!adminExists,
  });
});

const updatePassword = asyncHandler(async (req, res, next) => {
  const { _id } = req.user; // User's ID from authentication middleware
  validateMongoDBId(_id);

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).send({
      success: false,
      message: "Current and new password are required",
    });
  }

  // 1) Get user from the database
  const user = await User.findById(_id);

  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found",
    });
  }

  // 2) Validate current password
  const isMatch = await user.isPasswordValid(currentPassword); // Compare with hashed password
  if (!isMatch) {
    return res.status(401).send({
      success: false,
      message: "Your current password is incorrect",
    });
  }

  // 3) Update to new password
  user.password = newPassword; // This should trigger hashing in Mongoose middleware
  await user.save();

  // 4) Respond with success message
  res.status(200).json({
    status: "success",
    message: "Your password was updated successfully",
  });
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on POSTed email

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "There is no user with this email address.",
    });
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    // Use frontend URL for the reset link
    const resetURL = `http://localhost:5173/resetPassword/${resetToken}`;

    // Send the reset URL to the user
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email go to email and click of sending link!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.error(err);
    return res.status(500).send({
      success: false,
      message: "There was an error sending the email. Try again later!",
    });
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token is invalid or expired
  if (!user) {
    return res.status(400).send({
      success: false,
      message: "Token is invalid or has expired!",
    });
  }

  // 3) Check if passwords match
  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).send({
      success: false,
      message: "Passwords do not match!",
    });
  }

  // 4) Set new password
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 5) Send success response
  res.status(200).json({
    status: "success",
    message: "Your password was reset successfully",
  });
});

const getAllCommitteeMembers = async (req, res) => {
  try {
    const committeeMembers = await User.find({
      role: "committeeMember",
    }).select("fullName");
    res.status(200).json(committeeMembers);
  } catch (error) {
    console.error("Error fetching committee members:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  registerUser,
  loginUser,
  logoutCurrentUser,
  getAllCommitteeMembers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  getAllUsers,
  findUserByID,
  updateUserById,
  deleteUserByID,
  uploadUserPhoto,
  resizeUserPhoto,
  updateUserPhoto,
  updatePassword,
  forgotPassword,
  resetPassword,
  // New email verification methods
  verifyEmailWithOTP,
  verifyEmail,
  resendVerificationOTP,
  checkAdminExists,
};
