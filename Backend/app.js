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

// Route files
const userRoutes = require("./routes/userRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const facultyMemberRoutes = require("./routes/facultyMemberRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const courseOfferingRoutes = require("./routes/courseOfferingRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const researchRoutes = require("./routes/researchRoutes");
const newsRoutes = require("./routes/newsRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const eventRoutes = require("./routes/eventRoutes");
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
    origin: "http://localhost:5174", // Frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);

// Compress responses
app.use(compression());


// Mount routers
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/faculty", facultyRoutes)
app.use("/api/v1/departments", departmentRoutes)
app.use("//v1/faculty-members", facultyMemberRoutes)
app.use("//v1/teachers", teacherRoutes)
app.use("/api/v1/students", studentRoutes)
app.use("/api/v1/courses", courseRoutes)
app.use("/api/v1/course-offerings", courseOfferingRoutes)
app.use("/api/v1/enrollments", enrollmentRoutes)
app.use("/api/v1/research", researchRoutes)
app.use("/api/v1/events", eventRoutes)
app.use("/api/v1/news", newsRoutes)
app.use("/api/v1/resources", resourceRoutes)

// Error handler middleware
app.use(errorHandler);

module.exports = app;

