import React, { useState, useEffect, useCallback } from "react"
import CoursesList from "../components/CoursesList"
import CoursesHeader from "../components/CoursesHeader"
import CoursesFilter from "../components/CoursesFilter"
import axios from "axios"
import { AlertCircle, RefreshCw } from "lucide-react"

const API_URL = "http://127.0.0.1:4400/api/v1/courses"
const API_TIMEOUT = 10000

// Axios instance outside the component to avoid recreation
const axiosInstance = axios.create({
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    ...(localStorage.getItem("token") && {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    }),
  },
})

const CoursesPage = () => {
  const [courses, setCourses] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filteredCourses, setFilteredCourses] = useState([])
  const [retryCount, setRetryCount] = useState(0)
  const [filters, setFilters] = useState({
    department: "",
    searchQuery: "",
  })

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.get(API_URL)
      console.log(response.data.data)
      let data = []

      if (response.data?.success && Array.isArray(response.data.data)) {
        data = response.data.data
      } else if (Array.isArray(response.data)) {
        data = response.data
      } else if (response.data?.data && typeof response.data.data === "object") {
        data = Object.values(response.data.data)
      }

      if (data.length === 0) {
        setError("No courses found. Please check again later.")
        setCourses([])
        return
      }

      setCourses(data)
      setFilteredCourses(data)

      const uniqueDepartments = [
        ...new Set(data.filter((c) => c.department_id).map((c) => c.department_id)),
      ]

      setDepartments(
        uniqueDepartments.map((id) => ({
          _id: id,
          name: `Department ${id?.substring(0, 5) || ""}`,
        }))
      )
    } catch (err) {
      let errorMsg = "Failed to fetch courses."

      if (err.response) {
        if (err.response.status === 401) errorMsg = "Unauthorized. Please log in."
        else if (err.response.status === 403) errorMsg = "Access denied."
        else if (err.response.status === 404) errorMsg = "Courses endpoint not found."
        else errorMsg = `Server error: ${err.response.status}`
      } else if (err.request) {
        errorMsg = err.code === "ECONNABORTED"
          ? "Request timed out."
          : "No response from server."
      } else {
        errorMsg = err.message
      }

      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [retryCount])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  useEffect(() => {
    if (!courses.length) return

    let result = [...courses]

    if (filters.department) {
      result = result.filter((course) => course.department_id === filters.department)
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter(
        (course) =>
          course.name?.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query) ||
          course.code?.toLowerCase().includes(query)
      )
    }

    setFilteredCourses(result)
  }, [filters, courses])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({ department: "", searchQuery: "" })
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <CoursesHeader />
        <div className="container px-4 py-8 mx-auto">
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-red-700 mb-2">Error</h2>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-white hover:bg-primary/90 px-4 py-2"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!filteredCourses.length) {
    return (
      <div className="min-h-screen bg-background">
        <CoursesHeader />
        <div className="container px-4 py-8 mx-auto">
          <div className="text-center">
            <h3 className="text-xl font-medium mb-2">No Courses Available</h3>
            <p className="text-gray-500 mb-4">No courses match your filters.</p>
            <button
              onClick={clearFilters}
              className="bg-muted text-sm px-4 py-2 rounded hover:bg-muted/80"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <CoursesHeader />
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">All Courses</h2>
          <button
            onClick={handleRetry}
            className="inline-flex items-center rounded-md bg-primary text-white hover:bg-primary/90 px-4 py-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
        <CoursesFilter
          departments={departments}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={clearFilters}
        />
        <CoursesList courses={filteredCourses} />
      </div>
    </div>
  )
}

export default CoursesPage
