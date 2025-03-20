const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const { errorHandler } = require("./middleware/errorHandler")
const path = require("path")

// Load env vars
dotenv.config()

// Route files
const userRoutes = require("./routes/userRoutes")
const facultyRoutes = require("./routes/facultyRoutes")
const departmentRoutes = require("./routes/departmentRoutes")
const facultyMemberRoutes = require("./routes/facultyMemberRoutes")
const teacherRoutes = require("./routes/teacherRoutes")
const studentRoutes = require("./routes/studentRoutes")
const courseRoutes = require("./routes/courseRoutes")
const courseOfferingRoutes = require("./routes/courseOfferingRoutes")
const enrollmentRoutes = require("./routes/enrollmentRoutes")
const researchRoutes = require("./routes/researchRoutes")
const eventRoutes = require("./routes/eventRoutes")
const newsRoutes = require("./routes/newsRoutes")
const resourceRoutes = require("./routes/resourceRoutes")

const app = express()

// Body parser
app.use(express.json())

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Security headers
app.use(helmet())


app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);

// Compress responses
app.use(compression())

// Set static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

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
app.use(errorHandler)

module.exports = app

