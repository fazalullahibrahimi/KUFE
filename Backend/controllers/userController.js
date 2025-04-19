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
const Joi = require('joi');

// Multer and image processing setup remains the same
// Configure Multer Storage in memory
const multerStorage = multer.memoryStorage();

// Filter to ensure only images are uploaded
const multerFilter = (req, file, cb) => {

  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Not an image! Please upload only images.", false);
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Not an image! Please upload only images.', false);
  }
};}

// Multer upload configuration
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Middleware to handle single image file upload with name 'image'

const uploadUserPhoto = upload.single("image");



// Define the validation schema
const userValidationSchema = Joi.object({
  fullName: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.base': `"fullName" should be a type of 'text'`,
      'string.empty': `"fullName" cannot be an empty field`,
      'string.min': `"fullName" should have a minimum length of {#limit}`,
      'any.required': `"fullName" is a required field`
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': `"email" should be a type of 'text'`,
      'string.empty': `"email" cannot be an empty field`,
      'string.email': `"email" must be a valid email`,
      'any.required': `"email" is a required field`
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.base': `"password" should be a type of 'text'`,
      'string.empty': `"password" cannot be an empty field`,
      'string.min': `"password" should have a minimum length of {#limit}`,
      'any.required': `"password" is a required field`
    }),
  role: Joi.string()
    .valid('admin', 'faculty', 'student')
    .default('student'),
  image: Joi.string()
    .allow(null)
    .optional()
    .messages({
      'string.base': `"image" should be a type of 'text'`,
    })
}).default({ image: 'default-user.jpg' }); // Set default image

// Define the validation schema for contact
const contactValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'string.base': `"name" should be a type of 'text'`,
      'string.empty': `"name" cannot be an empty field`,
      'any.required': `"name" is a required field`
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': `"email" should be a type of 'text'`,
      'string.empty': `"email" cannot be an empty field`,
      'string.email': `"email" must be a valid email`,
      'any.required': `"email" is a required field`
    }),

  message: Joi.string()
    .required()
    .messages({
      'string.base': `"message" should be a type of 'text'`,
      'string.empty': `"message" cannot be an empty field`,
      'any.required': `"message" is a required field`
    })
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

  const newUser = new User({
    fullName,
    email,
    password,
    role,
    image: req.file ? req.file.filename : "default-user.jpg",
  });

  try {
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "New User Added Successfully",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image,
      },
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error saving user",
    });
  }
});

// Add a contact to the user's contacts
const addContact = asyncHandler(async (req, res) => {
  const { _id } = req.user; 
  validateMongoDBId(_id);

  const { error } = contactValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).send({
      success: false,
      message: error.details[0].message,
    });
  }

  const { name, email, message } = req.body;

  const user = await User.findById(_id);
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found",
    });
  }

  // Push the new contact to the user's contacts array
  user.contacts.push({ name, email, message });
  await user.save();

  res.status(201).json({
    status: 'success',
    message: 'Contact added successfully',
    contact: { name, email, message },
  });
});

// Get all contacts for the user
const getAllContacts = asyncHandler(async (req, res) => {
  const { _id } = req.user; // Get user ID from request
  validateMongoDBId(_id);

  const user = await User.findById(_id).select('contacts');
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      contacts: user.contacts,
    },
  });
});


// Update a contact in the user's contacts
const updateContact = asyncHandler(async (req, res) => {
  const { _id } = req.user; // Get user ID from request
  validateMongoDBId(_id);

  const { contactId } = req.params; // Get contact ID from params
  const { error } = contactValidationSchema.validate(req.body); // Validate input
  if (error) {
    return res.status(400).send({
      success: false,
      message: error.details[0].message,
    });
  }

  const user = await User.findById(_id);
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found",
    });
  }

  const contact = user.contacts.id(contactId); // Find the contact by ID
  if (!contact) {
    return res.status(404).send({
      success: false,
      message: "Contact not found",
    });
  }

  // Update contact details
  contact.name = req.body.name;
  contact.email = req.body.email;
  contact.message = req.body.message;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Contact updated successfully',
    contact,
  });
});

// Remove a contact from the user's contacts
const removeContact = asyncHandler(async (req, res) => {
  const { _id } = req.user; // Get user ID from request
  validateMongoDBId(_id);

  const { contactId } = req.params; // Get contact ID from params

  const user = await User.findById(_id);
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found",
    });
  }

  const contact = user.contacts.id(contactId); // Find the contact by ID
  if (!contact) {
    return res.status(404).send({
      success: false,
      message: "Contact not found",
    });
  }

  contact.remove(); // Remove the contact
  await user.save();

  res.status(204).json({
    status: 'success',
    message: 'Contact removed successfully',
  });
});




const loginValidationSchema = Joi.object({
  email: Joi.string()
    .email() // Valid email format
    .required()
    .messages({
      'string.base': `"email" should be a type of 'text'`,
      'string.empty': `"email" cannot be an empty field`,
      'string.email': `"email" must be a valid email`,
      'any.required': `"email" is a required field`
    }),
  
  password: Joi.string()
    .min(8) // Minimum length of 8 characters
    .required()
    .messages({
      'string.base': `"password" should be a type of 'text'`,
      'string.empty': `"password" cannot be an empty field`,
      'string.min': `"password" should have a minimum length of {#limit}`,
      'any.required': `"password" is a required field`
    })
});


const resizeUserPhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const dir = path.join(__dirname, '../.././frontend/public/img/users');
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (error) {
      console.error('Error creating image directory:', error);
      return res.status(500).send({
        success:false,
        message:"Failed to create image directory"
      })
      
    }
  }

  const filename = `user-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}.jpeg`;
  req.file.filename = filename;

  try {
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(path.join(dir, filename));
  } catch (error) {
    console.error('Error processing image:', error);
    return res.status(500).send({
      success:false,
      message:"Error processing image"
    })
   
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
  ).select('-password');

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});


// Login user
const loginUser = asyncHandler(async (req, res) => {
  // Validate the request body
  const { error } = loginValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      success: false,
      message: error.details[0].message, // Return the first validation error message
    });
  }

  const { email, password } = req.body;

  const existingUser = await User.findOne({ email }).select("+password");

  if (
    existingUser &&
    (await existingUser.correctPassword(password, existingUser.password))
  ) {
    const token = generateToken(existingUser._id); // Generate the token without setting a cookie
    res.status(200).json({
      success: true, // Change to true on successful login
      message: "Logged in successfully",
      user: {
        _id: existingUser._id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        role: existingUser.role,
        token, // Return the token in the response
      },
    });
  } else {
    return res.status(401).send({
      success: false,
      message: "Email or password is incorrect!",
    });
  }
});
// Other functions like logoutCurrentUser, getAllUsers, findUserByID remain similar
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
      success:false,
      message :"User not found."
    })
  }
});
// Update User By Id (only admin can)
const updateUserValidationSchema = Joi.object({
  fullName: Joi.string()
    .min(4) // At least 4 characters long
    .optional()
    .messages({
      'string.base': `"fullName" should be a type of 'text'`,
      'string.min': `"fullName" should have a minimum length of {#limit}`,
    }),

  email: Joi.string()
    .email() // Valid email format
    .optional()
    .messages({
      'string.base': `"email" should be a type of 'text'`,
      'string.email': `"email" must be a valid email`,
    }),

  role: Joi.string()
    .valid('user', 'admin', 'guide') // Enum validation
    .optional()
    .messages({
      'string.base': `"role" should be a type of 'text'`,
      'any.only': `"role" must be one of [user, admin, guide]`,
    })
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
      success:false,
      message:"User not found!"
    })
  }
});

// Update current user profile
const updateProfileValidationSchema = Joi.object({
  fullName: Joi.string()
    .min(4) // At least 4 characters long
    .optional()
    .messages({
      'string.base': `"fullName" should be a type of 'text'`,
      'string.min': `"fullName" should have a minimum length of {#limit}`,
    }),

  email: Joi.string()
    .email() // Valid email format
    .optional()
    .messages({
      'string.base': `"email" should be a type of 'text'`,
      'string.email': `"email" must be a valid email`,
    })
});
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDBId(_id);

  // Validate the request body
  const { error } = updateProfileValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      success: false,
      message: error.details[0].message, // Return the first validation error message
    });
  }

  const { fullName, email } = req.body;

  const user = await User.findById(_id);

  if (user) {
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;

    const updatedUser = await user.save();

    res.json({
      success: true,
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    return res.status(404).json({
      success:false,
      message:"User not found"
    })
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
      success:false,
      message:"User not found"
    })
  }
});

const deleteUserByID = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDBId(id);

  const user = await User.findById({ _id: id });
  if (user) {
    if (user.isAdmin) {

      return res.status(400).json({
        success:false,
        message:"Cannot delete user as admin!"
      })
  
    }

    await User.deleteOne({ _id: user._id });
    res.status(204).json({ message: "User removed successfully" });
  } else {
    return res.status(404).json({
      success:false,
      message:"User not found!"
    })
  }
});


const updatePassword = asyncHandler(async (req, res, next) => {
  const { _id } = req.user; // User's ID from authentication middleware
  validateMongoDBId(_id);

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).send({
      success:false,
      message:"Current and new password are required"
    })
   
  }

  // 1) Get user from the database
  const user = await User.findById(_id);

  if (!user) {
    return res.status(404).send({
      success:false,
      message:"User not found"
    })
  
  }

  // 2) Validate current password
  const isMatch = await user.isPasswordValid(currentPassword); // Compare with hashed password
  if (!isMatch) {
    return res.status(401).send({
      success:false,
      message:"Your current password is incorrect"
    })
   
  }

  // 3) Update to new password
  user.password = newPassword; // This should trigger hashing in Mongoose middleware
  await user.save();

  // 4) Respond with success message
  res.status(200).json({
    status: 'success',
    message: 'Your password was updated successfully',
  });
});






const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on POSTed email

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send({
      success:false,
      message:"There is no user with this email address."
    })
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
      status: 'success',
      message: 'Token sent to email go to email and click of sending link!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.error(err);
    return res.status(500).send({
      success:false,
      message:"There was an error sending the email. Try again later!"
    })
 
  }  
});


const resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token is invalid or expired
  if (!user) {
    return res.status(400).send({
      success: false,
      message: "Token is invalid or has expired!"
    });
  }

  // 3) Check if passwords match
  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).send({
      success: false,
      message: "Passwords do not match!"
    });
  }

  // 4) Set new password
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 5) Send success response
  res.status(200).json({
    status: 'success',
    message: 'Your password was reset successfully',
  });
});



// Remove functions related to doctors and percentages

module.exports = {
  registerUser,
  loginUser,
  logoutCurrentUser,
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

  addContact, 
  getAllContacts,
  removeContact,
  updateContact
};
