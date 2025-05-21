const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const { errorHandler } = require("./middleware/errorHandler");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

// Load env vars
dotenv.config();

const mongoose = require("mongoose");
mongoose.set("strictPopulate", false);

// Route files
const userRoutes = require("./routes/userRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const researchRoutes = require("./routes/researchRoutes");
const newsRoutes = require("./routes/newsRoutes");
const eventRoutes = require("./routes/eventRoutes");
const announcement = require("./routes/announcementsRoute");
const contact = require("./routes/contactRoute");
const semesterRoutes = require("./routes/semesterRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const committeeMemberRoutes = require("./routes/committeeMemberRoutes");
const app = express();
app.use("/public", express.static(path.join(__dirname, "public")));
// Security headereventRoutess
app.use(helmet());
// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 180,
  message: "Too many requests. Please slow down.",
});
app.use("/api", limiter);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests from these origins
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5175",
      ];

      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);

// Compress responses
app.use(compression());

// Mount routers
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/faculty", facultyRoutes);
app.use("/api/v1/departments", departmentRoutes);
app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/research", researchRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/announcement", announcement);
app.use("/api/v1/contact", contact);
app.use("/api/v1/semesters", semesterRoutes);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/committee-members", committeeMemberRoutes);

// Error handler middleware
app.use(errorHandler);

module.exports = app;
