const Research = require("../models/Research");
const asyncHandler = require("express-async-handler");
const CommitteeMember = require("../models/CommitteeMember");
const Email = require("../utils/email"); // ✅ import your Email class
require("dotenv").config(); // Ensure you load .env values
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// ----------- Multer Storage Config -----------
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/uploads/research");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `file-${uniqueSuffix}${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  // Accept all file types — customize if needed
  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadFile = upload.single("file");

const processUploadedFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  req.filePath = `/uploads/research/${req.file.filename}`;
  next();
};

// ----------- Main Upload Handler -----------
const researchUpload = asyncHandler(async (req, res) => {
  const { title, abstract, category, publication_date, pages, status } =
    req.body;

  if (!title || !abstract || !category) {
    return res.status(400).json({
      status: "fail",
      message: "Title, abstract, and category are required",
    });
  }

  let filePath = req.filePath || "/uploads/research/default.pdf";

  // Parse authors
  let authors = req.body.authors;
  if (typeof authors === "string") {
    try {
      authors = JSON.parse(authors);
    } catch {
      authors = authors.split(",").map((a) => a.trim());
    }
  } else if (!authors) {
    authors = req.user?.name ? [req.user.name] : [];
  }

  // Parse keywords
  let keywords = req.body.keywords;
  if (typeof keywords === "string") {
    try {
      keywords = JSON.parse(keywords);
    } catch {
      keywords = keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
    }
  }

  const newResearch = await Research.create({
    title,
    abstract,
    publication_date: publication_date
      ? new Date(publication_date)
      : new Date(),
    file_path: filePath,
    pages: parseInt(pages) || 1,
    category,
    status: status || "pending",
    authors,
    student_id: req.body.student_id || req.user?._id || null,
    student_name: req.body.student_name || req.user?.name || null,
    department_id: req.body.department_id || null,
    department_name: req.body.department_name || null,
    keywords: keywords || [],
    reviewer_comments: "",
    reviewer_id: null,
    review_date: null,
  });

  // Assign reviewer
  if (newResearch.department_id) {
    try {
      // Find committee members from the same department
      const committeeMembers = await CommitteeMember.find({
        department: newResearch.department_id,
      }).populate("userId");

      if (committeeMembers.length > 0) {
        // Get committee members with their current assignment count
        const committeeWithAssignmentCounts = await Promise.all(
          committeeMembers.map(async (member) => {
            const assignmentCount = await Research.countDocuments({
              reviewer_id: member._id,
              status: "pending",
            });
            return {
              member,
              assignmentCount,
            };
          })
        );

        // Sort by assignment count (ascending) to distribute workload evenly
        committeeWithAssignmentCounts.sort(
          (a, b) => a.assignmentCount - b.assignmentCount
        );

        // Select the committee member with the least current assignments
        const selectedReviewer = committeeWithAssignmentCounts[0].member;

        // Assign the reviewer
        newResearch.reviewer_id = selectedReviewer._id;
        await newResearch.save();

        // Prepare email notification
        const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5175";
        const reviewLink = `${CLIENT_URL}/committee-research`;

        try {
          // Get reviewer name from user data if available
          const reviewerName =
            selectedReviewer.userId?.name ||
            selectedReviewer.userId?.fullName ||
            selectedReviewer.email.split("@")[0] ||
            "Reviewer";

          const email = new Email(selectedReviewer, reviewLink);
          const message = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #2c3e50;">New Research Assigned to You</h2>
              <p>Dear ${reviewerName},</p>
              <p>You have been assigned a new research submission to review:</p>
              <ul>
                <li><strong>Title:</strong> ${newResearch.title}</li>
                <li><strong>Submitted by:</strong> ${newResearch.student_name}</li>
                <li><strong>Department:</strong> ${newResearch.department_name}</li>
              </ul>
              <p style="text-align:center;">
                <a href="${reviewLink}" style="display:inline-block;padding:10px 20px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:5px;">Review Research</a>
              </p>
              <p>Thank you,<br>Kandahar University Faculty of Economic</p>
            </div>
          `;
          await email.send(
            "researchAssigned",
            "New Research Assigned to You",
            message
          );
        } catch (emailErr) {
          console.error("Error sending email to reviewer:", emailErr.message);
        }
      } else {
        console.log(
          `No committee members found for department ID: ${newResearch.department_id}`
        );
      }
    } catch (error) {
      console.error("Error assigning reviewer:", error.message);
    }
  }

  res.status(201).json({
    status: "success",
    data: { research: newResearch },
  });
});

const updateResearchReview = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewer_comments, review_date } = req.body;

    // Validation
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "Research ID is required",
      });
    }

    if (!status || !reviewer_comments) {
      return res.status(400).json({
        status: "fail",
        message: "Status and reviewer comments are required",
      });
    }

    // Fetch research and populate student
    const research = await Research.findById(id).populate("student_id");
    if (!research) {
      return res.status(404).json({
        status: "fail",
        message: "Research not found",
      });
    }

    // Check if the committee member is authorized to review this research
    // Either they must be from the same department or they must be assigned as the reviewer
    const committeeUser = req.user;

    // Get committee member details to check department
    const committeeMember = await CommitteeMember.findOne({
      userId: committeeUser._id,
    });

    if (!committeeMember) {
      return res.status(403).json({
        status: "fail",
        message: "You are not registered as a committee member",
      });
    }

    // Check if this user is assigned as the reviewer
    // Compare both the committee member ID and the user ID for flexibility
    const isAssignedReviewer =
      research.reviewer_id &&
      (research.reviewer_id.toString() === committeeMember._id.toString() ||
        research.reviewer_id.toString() === committeeUser._id.toString());

    // Log for debugging
    console.log("Review authorization check:", {
      research_id: research._id,
      research_reviewer_id: research.reviewer_id,
      committee_member_id: committeeMember._id,
      user_id: committeeUser._id,
      isAssignedReviewer: isAssignedReviewer,
    });

    const isFromSameDepartment =
      research.department_id &&
      committeeMember.department &&
      research.department_id.toString() ===
        committeeMember.department.toString();

    if (!isAssignedReviewer && !isFromSameDepartment) {
      return res.status(403).json({
        status: "fail",
        message:
          "You can only review research papers from your department or assigned to you",
      });
    }

    // Update review data
    research.status = status;
    research.reviewer_comments = reviewer_comments;
    // Use the committee member ID as the reviewer ID, not the user ID
    research.reviewer_id = committeeMember._id;
    research.review_date = review_date || new Date();
    await research.save();

    console.log("Research updated:", research);

    // Send email to student
    const student = research.student_id;
    if (student && student.email) {
      const emailInstance = new Email(
        student,
        "https://localhost:5173/studenSubmit"
      );

      const content = `
        <div style="font-family: Arial, sans-serif;">
          <h2>Research Review Status Updated</h2>
          <p>Dear ${student.fullName || "Student"},</p>
          <p>Your research has been reviewed and updated. Below are the details:</p>
          <ul>
            <li><strong>Status:</strong> ${status}</li>
            <li><strong>Reviewer Comments:</strong> ${reviewer_comments}</li>
          </ul>
          <p>Best regards,<br/>Kandahar University Faculty of Economic</p>
        </div>
      `;

      await emailInstance.send(
        "reviewUpdate",
        "Your Research Review Status Has Been Updated",
        content
      );
    }

    // Respond to client
    res.status(200).json({
      status: "success",
      data: {
        research,
      },
    });
  } catch (error) {
    console.error("Error in updateResearchReview:", error);
    res.status(500).json({
      status: "error",
      message:
        error.message || "An error occurred while updating the research review",
    });
  }
});

// @desc    Get all published research
const getPublishedResearch = asyncHandler(async (_, res) => {
  const research = await Research.find({ status: "accepted" }).sort({
    createdAt: -1,
  });
  res
    .status(200)
    .json({ status: "success", results: research.length, data: { research } });
});

// @desc    Get all research (admin only)
const getAllResearch = asyncHandler(async (_, res) => {
  const research = await Research.find().sort({ createdAt: -1 });
  res
    .status(200)
    .json({ status: "success", results: research.length, data: { research } });
});

// @desc    Get research by ID
const getSingleResearch = asyncHandler(async (req, res) => {
  const research = await Research.findById(req.params.id);
  if (!research)
    return res
      .status(404)
      .json({ status: "fail", message: "Research not found" });

  res.status(200).json({ status: "success", data: { research } });
});

// @desc    Create new research
const createResearch = asyncHandler(async (req, res) => {
  const { title, abstract, category } = req.body;
  if (!title || !abstract || !category) {
    return res.status(400).json({
      status: "fail",
      message: "Title, abstract, and category are required",
    });
  }

  let filePath = req.file ? `/uploads/research/${req.file.filename}` : "";

  let authors = req.body.authors;
  if (typeof authors === "string") {
    try {
      authors = JSON.parse(authors);
    } catch {
      authors = req.user ? [req.user.name] : [authors];
    }
  } else if (!authors) {
    authors = req.user ? [req.user.name] : [];
  }

  let keywords = req.body.keywords;
  if (typeof keywords === "string") {
    try {
      keywords = JSON.parse(keywords);
    } catch {
      keywords = keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
    }
  }

  const newResearch = await Research.create({
    title,
    abstract,
    publication_date: req.body.publication_date || new Date(),
    file_path: filePath,
    pages: req.body.pages || 1,
    category,
    status: req.body.status || "pending",
    authors,
    student_id: req.body.student_id || req.user?._id || null,
    student_name: req.body.student_name || req.user?.name || null,
    department_id: req.body.department_id || null,
    department_name: req.body.department_name || null,
    keywords: keywords || [],
    reviewer_comments: "",
    reviewer_id: null,
    review_date: null,
  });

  res.status(201).json({ status: "success", data: { research: newResearch } });
});

// @desc    Update research
const updateResearch = asyncHandler(async (req, res) => {
  const research = await Research.findById(req.params.id);
  if (!research)
    return res
      .status(404)
      .json({ status: "fail", message: "Research not found" });

  const userIsOwner =
    req.user && research.student_id?.toString() === req.user._id.toString();
  const isAdmin = req.user?.role === "admin";
  const canManage =
    req.user?.role === "faculty" &&
    req.user.permissions?.includes("manage_research");

  if (!userIsOwner && !isAdmin && !canManage) {
    return res.status(403).json({
      status: "fail",
      message: "Not authorized to update this research",
    });
  }

  if (req.file) {
    if (research.file_path?.startsWith("/uploads/")) {
      const oldPath = path.join(__dirname, "..", "public", research.file_path);
      try {
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      } catch (err) {
        console.error("Failed to delete old file:", err.message);
      }
    }
    req.body.file_path = `/uploads/research/${req.file.filename}`;
  }

  if (typeof req.body.authors === "string") {
    try {
      req.body.authors = JSON.parse(req.body.authors);
    } catch {
      req.body.authors = [req.body.authors];
    }
  }

  if (typeof req.body.keywords === "string") {
    try {
      req.body.keywords = JSON.parse(req.body.keywords);
    } catch {
      req.body.keywords = req.body.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
    }
  }

  const updated = await Research.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: "success", data: { research: updated } });
});

// @desc    Delete research
const deleteResearch = asyncHandler(async (req, res) => {
  const research = await Research.findById(req.params.id);
  if (!research)
    return res
      .status(404)
      .json({ status: "fail", message: "Research not found" });

  if (research.file_path?.startsWith("/uploads/")) {
    const filePath = path.join(__dirname, "..", "public", research.file_path);
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
      console.error("File deletion failed:", err.message);
    }
  }

  await research.deleteOne();
  res
    .status(200)
    .json({ status: "success", message: "Research deleted successfully" });
});

// @desc    Get research by status
const getResearchByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const validStatuses = ["pending", "accepted", "rejected", "all"];
  if (!validStatuses.includes(status)) {
    return res
      .status(400)
      .json({ status: "fail", message: "Invalid status value." });
  }

  const query = status === "all" ? {} : { status };
  const research = await Research.find(query).sort({ createdAt: -1 });

  res
    .status(200)
    .json({ status: "success", results: research.length, data: { research } });
});

// @desc    Review research
const reviewResearch = asyncHandler(async (req, res) => {
  const { status, reviewer_comments } = req.body;
  const validStatuses = ["pending", "accepted", "rejected"];

  if (!validStatuses.includes(status)) {
    return res
      .status(400)
      .json({ status: "fail", message: "Invalid status value." });
  }

  // First find the research to check authorization
  const research = await Research.findById(req.params.id);
  if (!research) {
    return res
      .status(404)
      .json({ status: "fail", message: "Research not found" });
  }

  // Check if the committee member is authorized to review this research
  // Either they must be from the same department or they must be assigned as the reviewer
  const committeeUser = req.user;

  // Get committee member details to check department
  const committeeMember = await CommitteeMember.findOne({
    userId: committeeUser._id,
  });

  if (!committeeMember) {
    return res.status(403).json({
      status: "fail",
      message: "You are not registered as a committee member",
    });
  }

  // Check if this user is assigned as the reviewer
  // Compare both the committee member ID and the user ID for flexibility
  const isAssignedReviewer =
    research.reviewer_id &&
    (research.reviewer_id.toString() === committeeMember._id.toString() ||
      research.reviewer_id.toString() === committeeUser._id.toString());

  // Log for debugging
  console.log("Review authorization check (reviewResearch):", {
    research_id: research._id,
    research_reviewer_id: research.reviewer_id,
    committee_member_id: committeeMember._id,
    user_id: committeeUser._id,
    isAssignedReviewer: isAssignedReviewer,
  });

  const isFromSameDepartment =
    research.department_id &&
    committeeMember.department &&
    research.department_id.toString() === committeeMember.department.toString();

  if (!isAssignedReviewer && !isFromSameDepartment) {
    return res.status(403).json({
      status: "fail",
      message:
        "You can only review research papers from your department or assigned to you",
    });
  }

  // Update the research with review information
  const updatedResearch = await Research.findByIdAndUpdate(
    req.params.id,
    {
      status,
      reviewer_comments,
      // Use the committee member ID as the reviewer ID, not the user ID
      reviewer_id: committeeMember._id,
      review_date: new Date(),
    },
    { new: true, runValidators: true }
  );

  res
    .status(200)
    .json({ status: "success", data: { research: updatedResearch } });
});

// @desc    Get research by student ID
const getResearchByStudent = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const research = await Research.find({ student_id }).sort({ createdAt: -1 });

  res
    .status(200)
    .json({ status: "success", results: research.length, data: { research } });
});

const getResearchByDepartment = asyncHandler(async (req, res) => {
  const { department_id } = req.params;
  const research = await Research.find({ department_id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    status: "success",
    results: research.length,
    data: {
      research,
    },
  });
});

// @desc    Search research submissions
// @route   GET /api/v1/research/search
// @access  Public
const searchResearch = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    res.status(400);
    throw new Error("Search query is required");
  }

  const research = await Research.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { abstract: { $regex: query, $options: "i" } },
      { authors: { $in: [new RegExp(query, "i")] } },
      { keywords: { $in: [new RegExp(query, "i")] } },
      { student_name: { $regex: query, $options: "i" } },
      { department_name: { $regex: query, $options: "i" } },
    ],
  }).sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: research.length,
    data: {
      research,
    },
  });
});

module.exports = {
  getPublishedResearch,
  getAllResearch,
  getSingleResearch,
  createResearch,
  updateResearch,
  deleteResearch,
  getResearchByStatus,
  reviewResearch,
  getResearchByStudent,
  getResearchByDepartment,
  searchResearch,
  researchUpload,
  updateResearchReview,
  uploadFile,
  processUploadedFile,
};
