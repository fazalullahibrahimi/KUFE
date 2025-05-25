
import React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Plus, Save, Upload, BookOpen, FileText, GraduationCap, Users,
  TrendingUp, Activity, Eye, Edit, Target, Award, Calendar, Clock,
  BarChart3, PieChart, Settings, Star, CheckCircle, Building2
} from "lucide-react"
import Table from "../common/Table"
import Modal from "../common/Modal"
import FormField from "../common/FormField"

const CourseManagement = () => {
  const [courses, setCourses] = useState([])
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentCourse, setCurrentCourse] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    credits: "",
    department_id: "",
    instructor: "",
    semester: "Fall",
    level: "Undergraduate",
    schedule: "",
    location: "",
    prerequisites: [],
    materials: [],
    image: null,
  })

  // State for managing course materials
  const [materialForm, setMaterialForm] = useState({
    id: 1,
    title: "",
    type: "pdf",
    size: "",
  })
  const [showMaterialForm, setShowMaterialForm] = useState(false)

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token") || ""
  }

  // Create headers with authentication
  const createAuthHeaders = (includeContentType = true) => {
    const token = getAuthToken()
    return includeContentType
      ? {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      : {
          Authorization: `Bearer ${token}`,
        }
  }

  // Fetch courses and departments when component mounts
  useEffect(() => {
    fetchCourses()
    fetchDepartments()
  }, [])

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("http://127.0.0.1:4400/api/v1/courses/", {
        headers: createAuthHeaders(),
      })
      const result = await response.json()

      if (result.status === "success") {
        setCourses(result.data.courses || [])
      } else {
        console.error("Failed to fetch courses:", result.message)
        // Set sample data if API fails
        setCourses([
          {
            _id: "1",
            code: "STAT303",
            name: "Applied Statistics",
            description:
              "Covers statistical methods including hypothesis testing, regression analysis, and statistical computing using R and Python.",
            credits: 4,
            department_id: "67de9a869c45e2657b66b78f",
            instructor: "Dr. Michael Lee",
            semester: "Summer",
            level: "Graduate",
            schedule: "Mon/Wed 3:00 PM - 5:00 PM",
            location: "Room 310, Statistics Dept",
            materials: [
              {
                id: 1,
                title: "Course Syllabus",
                type: "pdf",
                size: "420KB",
              },
              {
                id: 2,
                title: "Regression Module",
                type: "docx",
                size: "1MB",
              },
            ],
            prerequisites: ["Intro to Statistics", "Calculus I"],
            image: "Kandahar_Economic.jpg",
            status: "Active",
          },
          {
            _id: "2",
            code: "ECO101",
            name: "Principles of Economics",
            description: "Introduction to basic economic principles and theories.",
            credits: 3,
            department_id: "67de9a869c45e2657b66b78f",
            instructor: "Dr. Ahmad Ahmadi",
            semester: "Fall",
            level: "Undergraduate",
            schedule: "Tue/Thu 10:00 AM - 11:30 AM",
            location: "Room 101, Economics Dept",
            materials: [],
            prerequisites: [],
            image: "economics_101.jpg",
            status: "Active",
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch departments from API
  const fetchDepartments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("http://127.0.0.1:4400/api/v1/departments/", {
        headers: createAuthHeaders(),
      })
      const result = await response.json()

      if (result.status === "success") {
        setDepartments(result.data.departments || [])
      } else {
        console.error("Failed to fetch departments:", result.message)
      }
    } catch (error) {
      console.error("Error fetching departments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get department name by ID
  const getDepartmentNameById = (departmentId) => {
    if (!departmentId) return "Unknown Department"

    // If departmentId is an object with a name property (populated department)
    if (typeof departmentId === "object" && departmentId !== null) {
      return departmentId.name || "Unknown Department"
    }

    // If departmentId is a string ID, look up the department
    const department = departments.find((dept) => dept._id === departmentId)
    return department ? department.name : String(departmentId)
  }

  // Table columns configuration
  const columns = [
    {
      header: "Course",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
            {row.image ? (
              <img
                src={`http://127.0.0.1:4400/public/img/courses/${row.image}`}
                alt={row.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = `/placeholder.svg?height=40&width=40&text=${row.name.charAt(0)}`
                }}
              />
            ) : (
              <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-md">
                <BookOpen size={16} className="text-blue-600" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-800">{row.name}</p>
            <p className="text-xs text-gray-500">{row.code}</p>
          </div>
        </div>
      ),
    },
    { header: "Credits", accessor: "credits" },
    { header: "Instructor", accessor: "instructor" },
    { header: "Semester", accessor: "semester" },
    { header: "Level", accessor: "level" },
    {
      header: "Department",
      accessor: "department_id",
      render: (row) => <span>{getDepartmentNameById(row.department_id)}</span>,
    },
    {
      header: "Materials",
      accessor: "materials",
      render: (row) => (
        <span className="text-gray-700">
          {row.materials && row.materials.length > 0 ? `${row.materials.length} items` : "None"}
        </span>
      ),
    },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        image: file,
      })

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle material form input changes
  const handleMaterialInputChange = (e) => {
    const { name, value } = e.target
    setMaterialForm({
      ...materialForm,
      [name]: value,
    })
  }

  // Add material to the course
  const handleAddMaterial = () => {
    if (!materialForm.title || !materialForm.size) {
      alert("Please fill in all material fields")
      return
    }

    // Add the new material to the form data
    const newMaterials = [...formData.materials, { ...materialForm }]

    // Update the form data with the new materials array
    setFormData({
      ...formData,
      materials: newMaterials,
    })

    // Reset the material form with an incremented ID
    setMaterialForm({
      id: materialForm.id + 1,
      title: "",
      type: "pdf",
      size: "",
    })

    // Hide the material form
    setShowMaterialForm(false)
  }

  // Remove a material from the course
  const handleRemoveMaterial = (materialId) => {
    const updatedMaterials = formData.materials.filter((material) => material.id !== materialId)
    setFormData({
      ...formData,
      materials: updatedMaterials,
    })
  }

  // Handle prerequisites input
  const handlePrerequisitesChange = (e) => {
    const prerequisites = e.target.value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "")
    setFormData({
      ...formData,
      prerequisites,
    })
  }

  // Updated handleAddCourse function to match the Mongoose schema
  const handleAddCourse = async () => {
    try {
      setIsLoading(true)

      // Check if all required fields are present
      const requiredFields = [
        "code",
        "name",
        "description",
        "credits",
        "department_id",
        "instructor",
        "semester",
        "level",
        "schedule",
        "location",
      ]

      const missingFields = requiredFields.filter((field) => !formData[field])
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(", ")}`)
        setIsLoading(false)
        return
      }

      // Ensure credits is a number
      const creditsValue = Number.parseInt(formData.credits, 10)
      if (isNaN(creditsValue)) {
        alert("Credits must be a valid number")
        setIsLoading(false)
        return
      }

      // If we have an image, use FormData to send both course data and image in one request
      if (formData.image instanceof File) {
        const courseFormData = new FormData()

        // Add all the course data fields
        courseFormData.append("code", formData.code)
        courseFormData.append("name", formData.name)
        courseFormData.append("description", formData.description)
        courseFormData.append("credits", creditsValue)
        courseFormData.append("department_id", formData.department_id)
        courseFormData.append("instructor", formData.instructor)
        courseFormData.append("semester", formData.semester)
        courseFormData.append("level", formData.level)
        courseFormData.append("schedule", formData.schedule)
        courseFormData.append("location", formData.location)


        // Add prerequisites as JSON string
        courseFormData.append("prerequisites", JSON.stringify(formData.prerequisites))

        // Add materials as JSON string
        courseFormData.append("materials", JSON.stringify(formData.materials))

        // Add the image file - try different field names that the backend might expect
        courseFormData.append("image", formData.image)

        console.log("Sending course data with image as FormData")

        // Send the FormData to create the course with image
        const response = await fetch("http://127.0.0.1:4400/api/v1/courses/", {
          method: "POST",
          headers: createAuthHeaders(false), // Don't include Content-Type for FormData
          body: courseFormData,
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("API Error:", response.status, errorText)
          throw new Error(`API error: ${response.status} - ${errorText}`)
        }

        const result = await response.json()

        if (result.status === "success") {
          // Refresh the courses list
          fetchCourses()
          setIsAddModalOpen(false)
          resetForm()
          alert("Course created successfully with image")
        } else {
          alert(`Failed to create course: ${result.message}`)
        }
      } else {
        // No image, just send the JSON data
        const jsonData = {
          code: formData.code,
          name: formData.name,
          description: formData.description,
          credits: creditsValue,
          department_id: formData.department_id,
          instructor: formData.instructor,
          semester: formData.semester,
          level: formData.level,
          schedule: formData.schedule,
          location: formData.location,
          prerequisites: formData.prerequisites,
          materials: formData.materials,
        }

        console.log("Sending course data as JSON:", jsonData)

        const response = await fetch("http://127.0.0.1:4400/api/v1/courses/", {
          method: "POST",
          headers: createAuthHeaders(),
          body: JSON.stringify(jsonData),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("API Error:", response.status, errorText)
          throw new Error(`API error: ${response.status} - ${errorText}`)
        }

        const result = await response.json()

        if (result.status === "success") {
          // Refresh the courses list
          fetchCourses()
          setIsAddModalOpen(false)
          resetForm()
          alert("Course created successfully")
        } else {
          alert(`Failed to create course: ${result.message}`)
        }
      }
    } catch (error) {
      console.error("Error creating course:", error)
      alert(`Failed to create course: ${error.message}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  // Updated handleEditCourse function to match the Mongoose schema
  const handleEditCourse = async () => {
    try {
      setIsLoading(true)

      // Check if all required fields are present
      const requiredFields = [
        "code",
        "name",
        "description",
        "credits",
        "department_id",
        "instructor",
        "semester",
        "level",
        "schedule",
        "location",
      ]

      const missingFields = requiredFields.filter((field) => !formData[field])
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(", ")}`)
        setIsLoading(false)
        return
      }

      // Ensure credits is a number
      const creditsValue = Number.parseInt(formData.credits, 10)
      if (isNaN(creditsValue)) {
        alert("Credits must be a valid number")
        setIsLoading(false)
        return
      }

      // If we have a new image file, use FormData to send both course data and image
      if (formData.image instanceof File) {
        const courseFormData = new FormData()

        // Add all the course data fields
        courseFormData.append("code", formData.code)
        courseFormData.append("name", formData.name)
        courseFormData.append("description", formData.description)
        courseFormData.append("credits", creditsValue)
        courseFormData.append("department_id", formData.department_id)
        courseFormData.append("instructor", formData.instructor)
        courseFormData.append("semester", formData.semester)
        courseFormData.append("level", formData.level)
        courseFormData.append("schedule", formData.schedule)
        courseFormData.append("location", formData.location)

        // Add prerequisites as JSON string
        courseFormData.append("prerequisites", JSON.stringify(formData.prerequisites))

        // Add materials as JSON string
        courseFormData.append("materials", JSON.stringify(formData.materials))

        // Add the image file - try different field names that the backend might expect
        courseFormData.append("image", formData.image)
        console.log("Sending course update with image as FormData")

        // Send the FormData to update the course with image
        const response = await fetch(`http://127.0.0.1:4400/api/v1/courses/${currentCourse._id}`, {
          method: "PATCH",
          headers: createAuthHeaders(false), // Don't include Content-Type for FormData
          body: courseFormData,
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("API Error:", response.status, errorText)
          throw new Error(`API error: ${response.status} - ${errorText}`)
        }

        const result = await response.json()

        if (result.status === "success") {
          // Refresh the courses list
          fetchCourses()
          setIsEditModalOpen(false)
          alert("Course updated successfully with new image")
        } else {
          alert(`Failed to update course: ${result.message}`)
        }
      } else {
        // No new image, just send the JSON data
        const jsonData = {
          code: formData.code,
          name: formData.name,
          description: formData.description,
          credits: creditsValue,
          department_id: formData.department_id,
          instructor: formData.instructor,
          semester: formData.semester,
          level: formData.level,
          schedule: formData.schedule,
          location: formData.location,
          prerequisites: formData.prerequisites,
          materials: formData.materials,
        }

        console.log("Sending course update data as JSON:", jsonData)

        const response = await fetch(`http://127.0.0.1:4400/api/v1/courses/${currentCourse._id}`, {
          method: "PATCH",
          headers: createAuthHeaders(),
          body: JSON.stringify(jsonData),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("API Error:", response.status, errorText)
          throw new Error(`API error: ${response.status} - ${errorText}`)
        }

        const result = await response.json()

        if (result.status === "success") {
          // Refresh the courses list
          fetchCourses()
          setIsEditModalOpen(false)
          alert("Course updated successfully")
        } else {
          alert(`Failed to update course: ${result.message}`)
        }
      }
    } catch (error) {
      console.error("Error updating course:", error)
      alert(`Failed to update course: ${error.message}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCourse = async (course) => {
    if (window.confirm(`Are you sure you want to delete ${course.name}?`)) {
      try {
        setIsLoading(true)

        const response = await fetch(`http://127.0.0.1:4400/api/v1/courses/${course._id}`, {
          method: "DELETE",
          headers: createAuthHeaders(),
        })

        const result = await response.json()

        if (result.status === "success") {
          // Remove the course from the state
          setCourses(courses.filter((c) => c._id !== course._id))
          alert("Course deleted successfully")
        } else {
          alert(`Failed to delete course: ${result.message}`)
        }
      } catch (error) {
        console.error("Error deleting course:", error)
        alert("Failed to delete course. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const openEditModal = (course) => {
    setCurrentCourse(course)

    // Reset image preview
    setImagePreview(course.image ? `http://127.0.0.1:4400/public/img/course/${course.image}` : null)

    // Extract the department_id correctly
    let departmentId = course.department_id
    if (typeof departmentId === "object" && departmentId !== null && departmentId._id) {
      departmentId = departmentId._id
    }

    // Set the next material ID based on existing materials
    let nextMaterialId = 1
    if (course.materials && course.materials.length > 0) {
      const maxId = Math.max(...course.materials.map((m) => m.id))
      nextMaterialId = maxId + 1
    }

    setMaterialForm({
      id: nextMaterialId,
      title: "",
      type: "pdf",
      size: "",
    })

    // Set form data with the course data
    const courseData = {
      ...course,
      department_id: departmentId,
      // Don't set image as a File object when editing
      image: course.image || null,
    }

    console.log("Setting form data for edit:", courseData)
    setFormData(courseData)
    setIsEditModalOpen(true)
  }

  const openViewModal = (course) => {
    setCurrentCourse(course)
    setIsViewModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      credits: "",
      department_id: "",
      instructor: "",
      semester: "Fall",
      level: "Undergraduate",
      schedule: "",
      location: "",
      prerequisites: [],
      materials: [],
      image: null,
    })
    setMaterialForm({
      id: 1,
      title: "",
      type: "pdf",
      size: "",
    })
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Check if user is authenticated
  const checkAuthentication = () => {
    const token = getAuthToken()
    if (!token) {
      alert("You are not logged in. Please log in to manage courses.")
      // Redirect to login page or show login modal
      // window.location.href = '/login';
      return false
    }
    return true
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative bg-gradient-to-br from-[#004B87] via-[#1D3D6F] to-[#2C4F85] rounded-3xl p-8 text-white overflow-hidden shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4B400] rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#16A085] rounded-full translate-y-32 -translate-x-32 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-ping delay-2000"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4 border border-white/30">
                <BookOpen className="h-8 w-8 text-[#F4B400]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-[#F4B400] to-white bg-clip-text text-transparent">
                  Course Management
                </h1>
                <p className="text-white/90 text-lg">Manage academic courses and curriculum</p>
              </div>
            </div>
            <div className="flex items-center text-white/70">
              <div className="w-2 h-2 bg-[#F4B400] rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">Academic catalog • {courses.length} courses</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="text-right mb-3 sm:mb-0">
              <div className="text-2xl font-bold text-[#F4B400]">{courses.length}</div>
              <div className="text-white/60 text-sm">Total Courses</div>
            </div>
            <button
              className="group bg-white/20 hover:bg-[#F4B400] px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-[#F4B400] hover:scale-105 hover:shadow-xl flex items-center"
              onClick={() => {
                if (checkAuthentication()) {
                  resetForm()
                  setIsAddModalOpen(true)
                }
              }}
              disabled={isLoading}
            >
              <Plus className="h-5 w-5 mr-2 transition-all duration-300 group-hover:text-[#004B87] text-white" />
              <span className="font-medium transition-all duration-300 group-hover:text-[#004B87] text-white">
                Add New Course
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Course Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Courses Card */}
        <div className="group bg-gradient-to-br from-[#004B87] to-[#1D3D6F] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">Total Courses</p>
              </div>
              <p className="text-3xl font-bold text-white">{courses.length}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
                <span className="text-green-300 text-xs">+20% this semester</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-[#F4B400]">{courses.length}</span>
            </div>
          </div>
        </div>

        {/* Instructors Card */}
        <div className="group bg-gradient-to-br from-[#F4B400] to-[#E6A200] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#004B87] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">Unique Instructors</p>
              </div>
              <p className="text-3xl font-bold text-white">{new Set(courses.map((course) => course.instructor)).size}</p>
              <div className="flex items-center mt-2">
                <Award className="h-4 w-4 text-white/70 mr-1" />
                <span className="text-white/70 text-xs">Teaching faculty</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{new Set(courses.map((course) => course.instructor)).size}</span>
            </div>
          </div>
        </div>

        {/* Total Credits Card */}
        <div className="group bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">Total Credits</p>
              </div>
              <p className="text-3xl font-bold text-white">{courses.reduce((total, course) => total + Number.parseInt(course.credits || 0), 0)}</p>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 text-green-200 mr-1" />
                <span className="text-green-200 text-xs">Academic hours</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{courses.reduce((total, course) => total + Number.parseInt(course.credits || 0), 0)}</span>
            </div>
          </div>
        </div>

        {/* Departments Card */}
        <div className="group bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">Departments</p>
              </div>
              <p className="text-3xl font-bold text-white">{departments.length}</p>
              <div className="flex items-center mt-2">
                <Activity className="h-4 w-4 text-purple-200 mr-1" />
                <span className="text-purple-200 text-xs">Academic units</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{departments.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Course Levels */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#EC4899] to-[#DB2777] p-2 rounded-lg mr-3">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Course Levels</h3>
            </div>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Undergraduate</span>
              <span className="text-lg font-bold text-[#EC4899]">
                {courses.filter(c => c.level === "Undergraduate").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Graduate</span>
              <span className="text-lg font-bold text-[#EC4899]">
                {courses.filter(c => c.level === "Graduate").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Credits</span>
              <span className="text-lg font-bold text-[#EC4899]">
                {courses.length > 0 ? Math.round((courses.reduce((total, course) => total + Number.parseInt(course.credits || 0), 0) / courses.length) * 10) / 10 : 0}
              </span>
            </div>
          </div>
        </div>

        {/* Semester Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#06B6D4] to-[#0891B2] p-2 rounded-lg mr-3">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Semester Distribution</h3>
            </div>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {["Fall", "Spring", "Summer"].map((semester, index) => {
              const count = courses.filter(c => c.semester === semester).length;
              const percentage = courses.length > 0 ? ((count / courses.length) * 100).toFixed(1) : 0;
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{semester}</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-gradient-to-r from-[#06B6D4] to-[#0891B2] h-2 rounded-full"
                        style={{width: `${percentage}%`}}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Course Materials */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] p-2 rounded-lg mr-3">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Course Materials</h3>
            </div>
            <Settings className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">With Materials</span>
              <span className="text-lg font-bold text-[#F59E0B]">
                {courses.filter(c => c.materials && c.materials.length > 0).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Materials</span>
              <span className="text-lg font-bold text-[#F59E0B]">
                {courses.reduce((total, c) => total + (c.materials ? c.materials.length : 0), 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auth Status</span>
              <span className={`text-lg font-bold ${getAuthToken() ? 'text-green-500' : 'text-red-500'}`}>
                {getAuthToken() ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading...</p>
        </div>
      )}

      {/* Course Table */}
      <Table
        columns={columns}
        data={courses}
        actions={true}
        onView={(course) => {
          if (checkAuthentication()) {
            openViewModal(course)
          }
        }}
        onEdit={(course) => {
          if (checkAuthentication()) {
            openEditModal(course)
          }
        }}
        onDelete={(course) => {
          if (checkAuthentication()) {
            handleDeleteCourse(course)
          }
        }}
      />

      {/* Add Course Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Course">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleAddCourse()
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Course Code" name="code" value={formData.code} onChange={handleInputChange} required />
            <FormField label="Course Name" name="name" value={formData.name} onChange={handleInputChange} required />
            <FormField
              label="Credits"
              name="credits"
              type="number"
              value={formData.credits}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleInputChange}
              required
            />

            {/* Department Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Department</label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a Department</option>
                {departments.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Semester"
              name="semester"
              type="select"
              value={formData.semester}
              onChange={handleInputChange}
              options={[
                { value: "Fall", label: "Fall" },
                { value: "Spring", label: "Spring" },
                { value: "Summer", label: "Summer" },
              ]}
              required
            />
            <FormField
              label="Level"
              name="level"
              type="select"
              value={formData.level}
              onChange={handleInputChange}
              options={[
                { value: "Undergraduate", label: "Undergraduate" },
                { value: "Graduate", label: "Graduate" },
              ]}
              required
            />
            <FormField
              label="Schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />

            {/* Prerequisites */}
            <div className="mb-4 col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-2">Prerequisites (comma separated)</label>
              <input
                type="text"
                value={formData.prerequisites.join(", ")}
                onChange={handlePrerequisitesChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Intro to Statistics, Calculus I"
              />
            </div>

            {/* Course Image Upload */}
            <div className="mb-4 col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-2">Course Image</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="course-image-upload"
                />
                <label
                  htmlFor="course-image-upload"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer flex items-center"
                >
                  <Upload size={18} className="mr-2" />
                  Choose Image
                </label>
                {(imagePreview || (formData.image && typeof formData.image === "string")) && (
              <div className="w-16 h-16 overflow-hidden border border-gray-300 rounded-md">
                <img
                  src={
                    imagePreview ||
                    `http://127.0.0.1:4400/public/courses/${formData.image}`
                  }
                  alt="Course Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/placeholder.svg?height=64&width=64&text=C"
                  }}
                />
              </div>
                     )}

              </div>
            </div>
          </div>

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleInputChange}
            required
          />

          {/* Course Materials Section */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Course Materials</h3>
              <button
                type="button"
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center text-sm"
                onClick={() => setShowMaterialForm(true)}
              >
                <Plus size={16} className="mr-1" />
                Add Material
              </button>
            </div>

            {/* Materials List */}
            {formData.materials.length > 0 ? (
              <div className="space-y-2 mb-4">
                {formData.materials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <FileText size={14} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{material.title}</p>
                        <p className="text-xs text-gray-500">
                          {material.type} • {material.size}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveMaterial(material.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-4">No materials added yet.</p>
            )}

            {/* Material Form */}
            {showMaterialForm && (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Material</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-700 text-xs font-medium mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={materialForm.title}
                      onChange={handleMaterialInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="e.g. Course Syllabus"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-medium mb-1">Type</label>
                    <select
                      name="type"
                      value={materialForm.type}
                      onChange={handleMaterialInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="pdf">PDF</option>
                      <option value="docx">DOCX</option>
                      <option value="ppt">PPT</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-medium mb-1">Size</label>
                    <input
                      type="text"
                      name="size"
                      value={materialForm.size}
                      onChange={handleMaterialInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="e.g. 1.2MB"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-3 space-x-2">
                  <button
                    type="button"
                    className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                    onClick={() => setShowMaterialForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] text-sm"
                    onClick={handleAddMaterial}
                  >
                    Add Material
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
              disabled={isLoading}
            >
              <Save size={18} className="inline mr-2" />
              {isLoading ? "Saving..." : "Save Course"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Course">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleEditCourse()
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Course Code" name="code" value={formData.code} onChange={handleInputChange} required />
            <FormField label="Course Name" name="name" value={formData.name} onChange={handleInputChange} required />
            <FormField
              label="Credits"
              name="credits"
              type="number"
              value={formData.credits}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleInputChange}
              required
            />

            {/* Department Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Department</label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a Department</option>
                {departments.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Semester"
              name="semester"
              type="select"
              value={formData.semester}
              onChange={handleInputChange}
              options={[
                { value: "Fall", label: "Fall" },
                { value: "Spring", label: "Spring" },
                { value: "Summer", label: "Summer" },
              ]}
              required
            />
            <FormField
              label="Level"
              name="level"
              type="select"
              value={formData.level}
              onChange={handleInputChange}
              options={[
                { value: "Undergraduate", label: "Undergraduate" },
                { value: "Graduate", label: "Graduate" },
              ]}
              required
            />
            <FormField
              label="Schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />

            {/* Prerequisites */}
            <div className="mb-4 col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-2">Prerequisites (comma separated)</label>
              <input
                type="text"
                value={formData.prerequisites.join(", ")}
                onChange={handlePrerequisitesChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Intro to Statistics, Calculus I"
              />
            </div>

            {/* Course Image Upload */}
            <div className="mb-4 col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-2">Course Image</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="course-image-edit"
                />
                <label
                  htmlFor="course-image-edit"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer flex items-center"
                >
                  <Upload size={18} className="mr-2" />
                  {formData.image ? "Change Image" : "Choose Image"}
                </label>
                {(imagePreview || formData.image) && (
                  <div className="w-16 h-16 overflow-hidden border border-gray-300">
                    <img
                      src={
                        imagePreview ||
                        (formData.image && typeof formData.image === "string"
                          ? `http://127.0.0.1:4400/public/img/courses/${formData.image}`
                          : null)
                      }
                      alt="Course Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = `/placeholder.svg?height=64&width=64&text=${formData.name.charAt(0)}`
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleInputChange}
            required
          />

          {/* Course Materials Section */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Course Materials</h3>
              <button
                type="button"
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center text-sm"
                onClick={() => setShowMaterialForm(true)}
              >
                <Plus size={16} className="mr-1" />
                Add Material
              </button>
            </div>

            {/* Materials List */}
            {formData.materials && formData.materials.length > 0 ? (
              <div className="space-y-2 mb-4">
                {formData.materials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <FileText size={14} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{material.title}</p>
                        <p className="text-xs text-gray-500">
                          {material.type} • {material.size}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveMaterial(material.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-4">No materials added yet.</p>
            )}

            {/* Material Form */}
            {showMaterialForm && (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Material</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-700 text-xs font-medium mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={materialForm.title}
                      onChange={handleMaterialInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="e.g. Course Syllabus"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-medium mb-1">Type</label>
                    <select
                      name="type"
                      value={materialForm.type}
                      onChange={handleMaterialInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="pdf">PDF</option>
                      <option value="docx">DOCX</option>
                      <option value="ppt">PPT</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs font-medium mb-1">Size</label>
                    <input
                      type="text"
                      name="size"
                      value={materialForm.size}
                      onChange={handleMaterialInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="e.g. 1.2MB"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-3 space-x-2">
                  <button
                    type="button"
                    className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                    onClick={() => setShowMaterialForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] text-sm"
                    onClick={handleAddMaterial}
                  >
                    Add Material
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
              disabled={isLoading}
            >
              <Save size={18} className="inline mr-2" />
              {isLoading ? "Updating..." : "Update Course"}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Course Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Course Details">
        {currentCourse && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                {currentCourse.image ? (
                  <img
                    src={`http://127.0.0.1:4400/public/img/courses/${currentCourse.image}`}
                    alt={currentCourse.name}
                    className="w-full h-auto rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = `/placeholder.svg?height=200&width=300&text=${currentCourse.name}`
                    }}
                  />
                ) : (
                  <img
                    src={`/placeholder.svg?height=200&width=300&text=${currentCourse.name}`}
                    alt={currentCourse.name}
                    className="w-full h-auto rounded-lg"
                  />
                )}
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-gray-800">{currentCourse.name}</h3>
                <p className="text-sm text-gray-500 mb-2">Code: {currentCourse.code}</p>
                <p className="text-gray-700 mb-4">{currentCourse.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Credits</p>
                    <p className="text-gray-800">{currentCourse.credits}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Instructor</p>
                    <p className="text-gray-800">{currentCourse.instructor}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Semester</p>
                    <p className="text-gray-800">{currentCourse.semester}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Level</p>
                    <p className="text-gray-800">{currentCourse.level}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Schedule</p>
                    <p className="text-gray-800">{currentCourse.schedule}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-gray-800">{currentCourse.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Department</p>
                    <p className="text-gray-800">{getDepartmentNameById(currentCourse.department_id)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Prerequisites</h4>
              {currentCourse.prerequisites && currentCourse.prerequisites.length > 0 ? (
                <ul className="list-disc pl-5">
                  {Array.isArray(currentCourse.prerequisites) ? (
                    currentCourse.prerequisites.map((prereq, index) => (
                      <li key={index} className="text-gray-700">
                        {prereq}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-700">{currentCourse.prerequisites}</li>
                  )}
                </ul>
              ) : (
                <p className="text-gray-700">No prerequisites</p>
              )}
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Course Materials</h4>
              {currentCourse.materials && currentCourse.materials.length > 0 ? (
                <div className="space-y-2">
                  {currentCourse.materials.map((material, index) => (
                    <div key={index} className="flex items-center p-2 border rounded-md">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-medium">{material.type}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{material.title}</p>
                        <p className="text-xs text-gray-500">{material.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700">No materials available</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default CourseManagement
