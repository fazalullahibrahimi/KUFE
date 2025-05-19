
const Research = require("../models/Research");
const asyncHandler = require("express-async-handler");
const CommitteeMember = require("../models/CommitteeMember");
const Email = require("../utils/email"); // ✅ import your Email class
require("dotenv").config(); // Ensure you load .env values
const path = require("path");
const fs = require("fs");

const researchUpload = asyncHandler(async (req, res) => {
  try {
    console.log("Request body:", req.body)
    console.log("Request file:", req.file)

    const { title, abstract, category } = req.body

    if (!title || !abstract || !category) {
      return res.status(400).json({
        status: "fail",
        message: "Title, abstract, and category are required",
      })
    }

    // Handle file upload
    let filePath = ""
    if (req.file) {
      // Ensure uploads directory exists
      const uploadDir = path.join(__dirname, "../uploads/research")
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      filePath = `/uploads/research/${req.file.filename}`
      console.log("File saved at:", filePath)
    } else {
      console.log("No file uploaded")
      // Make file optional for testing
      filePath = "/uploads/research/default.pdf"
    }

    // Parse authors
    let authors = req.body.authors
    if (typeof authors === "string") {
      try {
        authors = JSON.parse(authors)
      } catch (e) {
        console.log("Error parsing authors:", e)
        authors = req.user ? [req.user.name] : [authors]
      }
    } else if (!authors) {
      authors = req.user ? [req.user.name] : []
    }

    // Parse keywords
    let keywords = req.body.keywords
    if (typeof keywords === "string") {
      try {
        keywords = JSON.parse(keywords)
      } catch (e) {
        console.log("Error parsing keywords:", e)
        keywords = keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      }
    }

    // Create the research document
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
    })

    console.log("Research created:", newResearch)

    // Assign reviewer from same department
    if (newResearch.department_id) {
      const committee = await CommitteeMember.find({
        department: newResearch.department_id,
      })

      console.log(`Found ${committee.length} committee members for department ${newResearch.department_id}`)

      if (committee.length > 0) {
        const randomReviewer = committee[Math.floor(Math.random() * committee.length)]
        console.log("Selected reviewer:", randomReviewer)

        // Store both _id and userId._id to ensure we can find the reviewer later
        newResearch.reviewer_id = randomReviewer._id
        await newResearch.save()
        console.log("Updated research with reviewer:", newResearch)

        // Send email notification
        const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000/"
        const reviewLink = `${CLIENT_URL}/review/${newResearch._id}`

        try {
          const email = new Email(randomReviewer, reviewLink)

          const message = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #2c3e50;">New Research Assigned to You</h2>
              <p>Dear ${randomReviewer.fullName || randomReviewer.name || "Reviewer"},</p>
              <p>You have been assigned a new research submission to review:</p>
              <ul>
                <li><strong>Title:</strong> ${newResearch.title}</li>
                <li><strong>Submitted by:</strong> ${newResearch.student_name}</li>
                <li><strong>Department:</strong> ${newResearch.department_name}</li>
              </ul>
              <p>Please log in and review the submission at the link below:</p>
              <p style="text-align:center;">
                <a href="${reviewLink}" style="display:inline-block;padding:10px 20px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:5px;">Review Research</a>
              </p>
              <p>Thank you,<br>Kandahar University Faculty of Economic</p>
            </div>
          `

          await email.send("researchAssigned", "New Research Assigned to You", message)
          console.log("Email sent successfully to reviewer")
        } catch (emailErr) {
          console.error("Error sending email to reviewer:", emailErr.message)
          // Log but don't fail research creation if email fails
        }
      }
    }

    // Final response
    res.status(201).json({
      status: "success",
      data: {
        research: newResearch,
      },
    })
  } catch (error) {
    console.error("Error in researchUpload:", error)
    res.status(500).json({
      status: "error",
      message: error.message || "An error occurred while uploading research",
    })
  }
})


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

    // Update review data
    research.status = status;
    research.reviewer_comments = reviewer_comments;
    research.reviewer_id = req.user.id;
    research.review_date = review_date || new Date();
    await research.save();

    console.log("Research updated:", research);

    // Send email to student
    const student = research.student_id;
    if (student && student.email) {
      const emailInstance = new Email(student, "https://localhost:5173/studenSubmit");

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

      await emailInstance.send("reviewUpdate", "Your Research Review Status Has Been Updated", content);
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
      message: error.message || "An error occurred while updating the research review",
    });
  }
});




// @desc    Get all published research
const getPublishedResearch = asyncHandler(async (req, res) => {
  const research = await Research.find({ status: "accepted" }).sort({ createdAt: -1 });
  res.status(200).json({ status: "success", results: research.length, data: { research } });
});

// @desc    Get all research (admin only)
const getAllResearch = asyncHandler(async (req, res) => {
  const research = await Research.find().sort({ createdAt: -1 });
  res.status(200).json({ status: "success", results: research.length, data: { research } });
});

// @desc    Get research by ID
const getSingleResearch = asyncHandler(async (req, res) => {
  const research = await Research.findById(req.params.id);
  if (!research) return res.status(404).json({ status: "fail", message: "Research not found" });

  res.status(200).json({ status: "success", data: { research } });
});

// @desc    Create new research
const createResearch = asyncHandler(async (req, res) => {
  const { title, abstract, category } = req.body;
  if (!title || !abstract || !category) {
    return res.status(400).json({ status: "fail", message: "Title, abstract, and category are required" });
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
      keywords = keywords.split(",").map(k => k.trim()).filter(Boolean);
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
  if (!research) return res.status(404).json({ status: "fail", message: "Research not found" });

  const userIsOwner = req.user && research.student_id?.toString() === req.user._id.toString();
  const isAdmin = req.user?.role === "admin";
  const canManage = req.user?.role === "faculty" && req.user.permissions?.includes("manage_research");

  if (!userIsOwner && !isAdmin && !canManage) {
    return res.status(403).json({ status: "fail", message: "Not authorized to update this research" });
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
      req.body.keywords = req.body.keywords.split(",").map(k => k.trim()).filter(Boolean);
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
  if (!research) return res.status(404).json({ status: "fail", message: "Research not found" });

  if (research.file_path?.startsWith("/uploads/")) {
    const filePath = path.join(__dirname, "..", "public", research.file_path);
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
      console.error("File deletion failed:", err.message);
    }
  }

  await research.deleteOne();
  res.status(200).json({ status: "success", message: "Research deleted successfully" });
});

// @desc    Get research by status
const getResearchByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const validStatuses = ["pending", "accepted", "rejected", "all"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ status: "fail", message: "Invalid status value." });
  }

  const query = status === "all" ? {} : { status };
  const research = await Research.find(query).sort({ createdAt: -1 });

  res.status(200).json({ status: "success", results: research.length, data: { research } });
});

// @desc    Review research
const reviewResearch = asyncHandler(async (req, res) => {
  const { status, reviewer_comments } = req.body;
  const validStatuses = ["pending", "accepted", "rejected"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ status: "fail", message: "Invalid status value." });
  }

  const research = await Research.findByIdAndUpdate(
    req.params.id,
    {
      status,
      reviewer_comments,
      reviewer_id: req.user?._id || req.body.reviewer_id,
      review_date: new Date(),
    },
    { new: true, runValidators: true }
  );

  if (!research) return res.status(404).json({ status: "fail", message: "Research not found" });

  res.status(200).json({ status: "success", data: { research } });
});

// @desc    Get research by student ID
const getResearchByStudent = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const research = await Research.find({ student_id }).sort({ createdAt: -1 });

  res.status(200).json({ status: "success", results: research.length, data: { research } });
});


const getResearchByDepartment = asyncHandler(async (req, res) => {
  const { department_id } = req.params
  const research = await Research.find({ department_id }).sort({ createdAt: -1 })

  res.status(200).json({
    status: "success",
    results: research.length,
    data: {
      research,
    },
  })
})

// @desc    Search research submissions
// @route   GET /api/v1/research/search
// @access  Public
const searchResearch = asyncHandler(async (req, res) => {
  const { query } = req.query

  if (!query) {
    res.status(400)
    throw new Error("Search query is required")
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
  }).sort({ createdAt: -1 })

  res.status(200).json({
    status: "success",
    results: research.length,
    data: {
      research,
    },
  })
})

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
};
