import React from "react"
import { useState, useEffect, useCallback } from "react"
import { useParams, Link } from "react-router-dom"
import { Clock, BookOpen, Calendar, FileText, AlertCircle, RefreshCw } from "lucide-react"
import axios from "axios"

// API configuration
const API_URL = "http://127.0.0.1:4400/api/v1/courses"
const API_TIMEOUT = 10000 // 10 seconds timeout

const CourseDetailPage = () => {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [department, setDepartment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  // Create axios instance with timeout
  const axiosInstance = axios.create({
    timeout: API_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
      // Add auth token if needed
      ...(localStorage.getItem("token") && {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }),
    },
  })

  // Fetch course details function
  const fetchCourseDetails = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log(`Fetching course details from: ${API_URL}/${id} (Attempt ${retryCount + 1})`)

      // Fetch course details from API
      const response = await axiosInstance.get(`${API_URL}/${id}`)
      console.log("API Response:", response)

      // Check if response has data
      if (response.data) {
        // Handle different response structures
        let courseData = null

        if (response.data.success && response.data.data) {
          // Standard success response with data
          courseData = response.data.data
        } else if (response.data._id) {
          // Direct object response
          courseData = response.data
        }

        if (courseData && typeof courseData === "object") {
          console.log("Course data received:", courseData)
          setCourse(courseData)

          // Set department info if available
          if (courseData.department_id) {
            setDepartment({
              name: `Department ${courseData.department_id.substring(0, 5)}`,
            })
          }
        } else {
          console.error("Unexpected data format:", response.data)
          setError("Received data is not in the expected format")
        }
      } else {
        console.error("No data in response")
        setError("No data received from the server")
      }
    } catch (err) {
      console.error("Error fetching course details:", err)

      // Detailed error handling
      let errorMessage = "Failed to fetch course details"

      if (err.response) {
        // Server responded with an error status
        console.error("Error response data:", err.response.data)
        console.error("Error response status:", err.response.status)

        if (err.response.status === 401) {
          errorMessage = "Authentication required. Please log in."
        } else if (err.response.status === 403) {
          errorMessage = "You don't have permission to access this course."
        } else if (err.response.status === 404) {
          errorMessage = "Course not found. It may have been deleted or never existed."
        } else {
          errorMessage = `Server error: ${err.response.status} - ${err.response.data?.message || err.message}`
        }
      } else if (err.request) {
        // No response received
        console.error("No response received:", err.request)
        if (err.code === "ECONNABORTED") {
          errorMessage = "Request timed out. The server took too long to respond."
        } else {
          errorMessage = "No response from server. Please check if the API server is running."
        }
      } else {
        // Request setup error
        console.error("Request setup error:", err.message)
        errorMessage = `Request error: ${err.message}`
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [id, retryCount])

  // Initial data fetch
  useEffect(() => {
    fetchCourseDetails()
  }, [fetchCourseDetails])

  // Handle retry
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md p-6 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3 mt-0.5" />
            <div>
              <h1 className="text-xl font-bold mb-3 text-red-700">Course Not Found</h1>
              <p className="text-red-600 mb-4">
                {error || "The course you're looking for doesn't exist or has been removed."}
              </p>

              <div className="bg-white p-4 rounded border border-red-100 mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Troubleshooting Tips:</h3>
                <ul className="list-disc text-sm text-gray-600 pl-5 space-y-1">
                  <li>Check if your API server is running</li>
                  <li>
                    Verify the course ID is correct: <code className="bg-gray-100 px-1 py-0.5 rounded">{id}</code>
                  </li>
                  <li>Check browser console for CORS errors</li>
                  <li>Ensure you have the correct permissions</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </button>
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  Back to Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success state - render course details
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted py-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col gap-4">
            <Link to="/courses" className="text-sm text-muted-foreground hover:underline mb-2 inline-block">
              ← Back to Courses
            </Link>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {course.code}
            </div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{course.name}</h1>
              <button
                onClick={handleRetry}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {department && (
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
                  {department.name}
                </span>
              )}
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
                {course.credits} Credits
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Course Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {course.description || "No description available for this course."}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
              <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                <li>Understand fundamental principles and theories related to {course.name}</li>
                <li>Develop analytical skills to evaluate problems and policies in this field</li>
                <li>Apply concepts to real-world situations and case studies</li>
                <li>Enhance critical thinking and problem-solving abilities</li>
                <li>Develop effective communication skills for presenting analyses</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Module 1: Introduction to {course.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Overview of key concepts and principles</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Module 2: Theoretical Frameworks</h3>
                  <p className="text-sm text-muted-foreground mt-1">Analysis of major theories and models</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Module 3: Applications and Case Studies</h3>
                  <p className="text-sm text-muted-foreground mt-1">Practical applications of theoretical concepts</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Module 4: Current Issues and Trends</h3>
                  <p className="text-sm text-muted-foreground mt-1">Analysis of contemporary challenges</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="border rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Course Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Course Code</h3>
                    <p className="text-muted-foreground">{course.code}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Credit Hours</h3>
                    <p className="text-muted-foreground">{course.credits} hours</p>
                  </div>
                </div>

                {department && (
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Department</h3>
                      <p className="text-muted-foreground">{department.name}</p>
                    </div>
                  </div>
                )}

                {course.createdAt && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Added On</h3>
                      <p className="text-muted-foreground">{new Date(course.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                    Enroll in Course
                  </button>
                </div>

                <div className="pt-2">
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">
                    Download Syllabus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailPage
