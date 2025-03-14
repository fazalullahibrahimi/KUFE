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

// Enable CORS
app.use(cors())

// Compress responses
app.use(compression())

// Set static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Mount routers
app.use("/api/users", userRoutes)
app.use("/api/faculty", facultyRoutes)
app.use("/api/departments", departmentRoutes)
app.use("/api/faculty-members", facultyMemberRoutes)
app.use("/api/teachers", teacherRoutes)
app.use("/api/students", studentRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/course-offerings", courseOfferingRoutes)
app.use("/api/enrollments", enrollmentRoutes)
app.use("/api/research", researchRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/news", newsRoutes)
app.use("/api/resources", resourceRoutes)

// Error handler middleware
app.use(errorHandler)

module.exports = app

