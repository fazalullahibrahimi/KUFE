
import React from "react"
import { useState, useEffect } from "react"
import {
  Plus,
  Save,
  FileText,
  Check,
  X,
  AlertTriangle,
  Filter,
  ChevronDown,
  Download,
  Eye,
  MessageSquare,
} from "lucide-react"
import Modal from "../components/common/Modal"
import FormField from "../components/common/FormField"

const StudentResearchSubmission = () => {
  // State for research submissions
  const [researchSubmissions, setResearchSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get token from local storage
  const getToken = () => {
    return localStorage.getItem("token") || ""
  }

  // API base URL
  const API_BASE_URL = "http://localhost:4400/api/v1"

  // Fetch research submissions with auth token
  useEffect(() => {
    const fetchResearchSubmissions = async () => {
      try {
        setLoading(true)
        const token = getToken()
        const response = await fetch(`${API_BASE_URL}/research/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        console.log("Research submissions data:", data)

        if (data && data.status === "success" && Array.isArray(data.data?.research)) {
          setResearchSubmissions(data.data.research)
        } else if (Array.isArray(data)) {
          setResearchSubmissions(data)
        } else {
          console.error("Unexpected research data structure:", data)
          setError("Invalid data format received from server")
        }
      } catch (error) {
        console.error("Error fetching research submissions:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchResearchSubmissions()
  }, [])

  // State for committee members
  const [committeeMembers, setCommitteeMembers] = useState([])

  useEffect(() => {
    const fetchCommitteeMembers = async () => {
      try {
        const token = getToken()
        const response = await fetch(`${API_BASE_URL}/committee-members/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        console.log("Committee members data:", data)

        if (data && data.status === "success" && Array.isArray(data.data?.committeeMembers)) {
          setCommitteeMembers(data.data.committeeMembers)
        } else if (Array.isArray(data)) {
          setCommitteeMembers(data)
        } else {
          console.error("Unexpected committee members data structure:", data)
        }
      } catch (error) {
        console.error("Error fetching committee members:", error)
      }
    }

    fetchCommitteeMembers()
  }, [])

  // State for students
  const [students, setStudents] = useState([])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = getToken()
        const response = await fetch(`${API_BASE_URL}/students/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()

        if (data && data.status === "success" && Array.isArray(data.data?.students)) {
          setStudents(data.data.students)
        }
      } catch (error) {
        console.error("Error fetching students:", error)
      }
    }

    fetchStudents()
  }, [])

  // State for UI
  const [activeTab, setActiveTab] = useState("student") // student, committee, or admin
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentSubmission, setCurrentSubmission] = useState(null)
  const [filteredSubmissions, setFilteredSubmissions] = useState([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentsList, setDepartmentsList] = useState([])

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = getToken()
        const response = await fetch(`${API_BASE_URL}/departments/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        console.log("Departments data:", data)

        if (data && data.status === "success" && Array.isArray(data.data?.departments)) {
          setDepartmentsList(data.data.departments)
        } else {
          console.error("Unexpected departments data structure:", data)
        }
      } catch (error) {
        console.error("Error fetching departments:", error)
      }
    }

    fetchDepartments()
  }, [])

  // Form data for new submission
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    student_id: "",
    student_name: "",
    department_id: "",
    department_name: "",
    file_path: "",
    keywords: "",
  })

  // Update formData when students are loaded
  useEffect(() => {
    if (students.length > 0) {
      const student = students[0]
      setFormData((prevData) => ({
        ...prevData,
        student_id: student.student_id_number || "",
        student_name: student.name || "",
        department_id: student.department_id?._id || "",
        department_name: student.department_id?.name || "",
      }))
    }
  }, [students])

  // Get current user info from local storage
  const getCurrentUser = () => {
    try {
      const userString = localStorage.getItem("user")
      if (!userString) return null
      return JSON.parse(userString)
    } catch (error) {
      console.error("Error parsing user from localStorage:", error)
      return null
    }
  }

  // Form data for review - now dynamically set based on current user
  const [reviewData, setReviewData] = useState(() => {
    const currentUser = getCurrentUser()
    return {
      status: "pending",
      reviewer_comments: "",
      reviewer_id: currentUser?.id || currentUser?._id || "",
    }
  })

  // Filter submissions based on active tab, status, department, and search term
  useEffect(() => {
    if (loading) return

    let result = [...researchSubmissions]
    const currentUser = getCurrentUser()

    // Filter based on active tab and current user role
    if (activeTab === "student" && currentUser) {
      // Filter by the logged-in student's ID
      result = result.filter(
        (submission) =>
          submission.student_id === currentUser.student_id_number || submission.student_id === currentUser.id,
      )
    } else if (activeTab === "committee" && currentUser) {
      // Filter by the logged-in committee member's department
      result = result.filter(
        (submission) =>
          submission.department_id === currentUser.department_id ||
          submission.department_name === currentUser.department?.name,
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((submission) => submission.status === statusFilter)
    }

    // Apply department filter
    if (departmentFilter !== "all") {
      result = result.filter(
        (submission) =>
          submission.department_id === departmentFilter || submission.department_name === departmentFilter,
      )
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (submission) =>
          (submission.title && submission.title.toLowerCase().includes(term)) ||
          (submission.abstract && submission.abstract.toLowerCase().includes(term)) ||
          (submission.student_name && submission.student_name.toLowerCase().includes(term)) ||
          (submission.keywords &&
            Array.isArray(submission.keywords) &&
            submission.keywords.some((keyword) => keyword.toLowerCase().includes(term))),
      )
    }

    setFilteredSubmissions(result)
  }, [researchSubmissions, activeTab, statusFilter, departmentFilter, searchTerm, loading])

  // Table columns configuration
  const studentColumns = [
    {
      header: "Title",
      accessor: "title",
      render: (row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3">
            <FileText size={16} />
          </div>
          <div>
            <p className="font-medium text-gray-800">{row.title}</p>
            <p className="text-xs text-gray-500">Submitted: {formatDate(row.submission_date || row.createdAt)}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Keywords",
      accessor: "keywords",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(row.keywords) ? (
            row.keywords.map((keyword, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {keyword}
              </span>
            ))
          ) : (
            <span className="text-gray-500">No keywords</span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.status === "accepted"
              ? "bg-green-100 text-green-800"
              : row.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : "Pending"}
        </span>
      ),
    },
  ]

  const committeeColumns = [
    {
      header: "Title",
      accessor: "title",
      render: (row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3">
            <FileText size={16} />
          </div>
          <div>
            <p className="font-medium text-gray-800">{row.title}</p>
            <p className="text-xs text-gray-500">Submitted by: {row.student_name}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Department",
      accessor: "department_name",
    },
    {
      header: "Submission Date",
      accessor: "submission_date",
      render: (row) => formatDate(row.submission_date || row.createdAt),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.status === "accepted"
              ? "bg-green-100 text-green-800"
              : row.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : "Pending"}
        </span>
      ),
    },
  ]

  const adminColumns = [
    {
      header: "Title",
      accessor: "title",
      render: (row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3">
            <FileText size={16} />
          </div>
          <div>
            <p className="font-medium text-gray-800">{row.title}</p>
            <p className="text-xs text-gray-500">Submitted by: {row.student_name}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Department",
      accessor: "department_name",
    },
    {
      header: "Submission Date",
      accessor: "submission_date",
      render: (row) => formatDate(row.submission_date || row.createdAt),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.status === "accepted"
              ? "bg-green-100 text-green-800"
              : row.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : "Pending"}
        </span>
      ),
    },
    {
      header: "Reviewer",
      accessor: "reviewer_id",
      render: (row) => {
        if (!row.reviewer_id) return <span className="text-gray-400">Not assigned</span>
    
        const reviewer = committeeMembers.find(
          (member) =>
            String(member.userId?._id) === String(row.reviewer_id) ||
            String(member._id) === String(row.reviewer_id)
        )
    
        return reviewer?.userId?.fullName
          ? reviewer.userId.fullName
          : <span className="text-gray-400">Unknown</span>
      }
    }
    
    
  ]

  // Form handling functions
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleReviewChange = (e) => {
    const { name, value } = e.target
    setReviewData({
      ...reviewData,
      [name]: value,
    })
  }

  const handleKeywordsChange = (e) => {
    const keywords = e.target.value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "")
    setFormData({
      ...formData,
      keywords,
    })
  }

  // CRUD operations with auth token
  const handleSubmitResearch = async () => {
    try {
      const keywordsArray =
        typeof formData.keywords === "string"
          ? formData.keywords.split(",").map((keyword) => keyword.trim())
          : formData.keywords
  
      const payload = {
        title: formData.title?.trim(),
        abstract: formData.abstract?.trim(),
        category: formData.category?.trim() || "General", // <-- Ensure 'category' is sent
        publication_date: formData.publication_date || new Date().toISOString(), // Optional fallback
        pages: formData.pages || 1, // Optional fallback if not provided
        authors: formData.authors || [formData.student_name || "Unknown"], // authors are required
        student_id: /^[0-9a-fA-F]{24}$/.test(formData.student_id) ? formData.student_id : undefined,
        student_name: formData.student_name,
        department_id: formData.department_id,
        department_name: formData.department_name,
        file_path: formData.file_path || "/uploads/research/default.pdf",
        keywords: keywordsArray,
        status: "pending",
        submission_date: new Date().toISOString(),
      }
  
      console.log("Submitting research with payload:", payload)
  
      const token = getToken()
      const response = await fetch(`${API_BASE_URL}/research/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        console.error("API error:", errorData)
        throw new Error(`Failed to submit research: ${errorData.message || response.statusText}`)
      }
  
      const data = await response.json()
      console.log("Research submitted successfully:", data)
  
      // Refresh the research submissions list
      const refreshResponse = await fetch(`${API_BASE_URL}/research/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!refreshResponse.ok) {
        throw new Error(`Failed to refresh data: ${refreshResponse.statusText}`)
      }
  
      const refreshData = await refreshResponse.json()
      if (refreshData && refreshData.status === "success" && Array.isArray(refreshData.data?.research)) {
        setResearchSubmissions(refreshData.data.research)
      } else if (Array.isArray(refreshData)) {
        setResearchSubmissions(refreshData)
      }
  
      setIsSubmitModalOpen(false)
      resetForm()
      alert("Research submitted successfully!")
    } catch (error) {
      console.error("Error submitting research:", error)
      alert(`Failed to submit research: ${error.message}. Please try again.`)
    }
  }
  

  const handleReviewSubmission = async () => {
    try {
      const payload = {
        status: reviewData.status,
        reviewer_comments: reviewData.reviewer_comments,
        reviewer_id: reviewData.reviewer_id,
        review_date: new Date().toISOString(),
      }

      const token = getToken()
      const submissionId = currentSubmission._id || currentSubmission.id
      console.log(submissionId)

      const response = await fetch(`${API_BASE_URL}/research/${submissionId}/review`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to update research status: ${errorData.message || response.statusText}`)
      }

      // Refresh the research submissions list
      const refreshResponse = await fetch(`${API_BASE_URL}/research/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const refreshData = await refreshResponse.json()
      if (refreshData && refreshData.status === "success" && Array.isArray(refreshData.data?.research)) {
        setResearchSubmissions(refreshData.data.research)
      } else if (Array.isArray(refreshData)) {
        setResearchSubmissions(refreshData)
      }

      setIsReviewModalOpen(false)
      resetReviewForm()
      alert("Review submitted successfully!")
    } catch (error) {
      console.error("Error updating research status:", error)
      alert(`Failed to update research status: ${error.message}. Please try again.`)
    }
  }

  const openReviewModal = (submission) => {
    setCurrentSubmission(submission)

    // Get current user for reviewer_id
    const currentUser = getCurrentUser()
    const reviewerId = currentUser?.id || currentUser?._id || submission.reviewer_id || ""

    setReviewData({
      status: submission.status || "pending",
      reviewer_comments: submission.reviewer_comments || "",
      reviewer_id: reviewerId,
    })

    setIsReviewModalOpen(true)
  }

  const openViewModal = (submission) => {
    setCurrentSubmission(submission)
    setIsViewModalOpen(true)
  }

  const resetForm = () => {
    if (students.length > 0) {
      const student = students[0]
      setFormData({
        title: "",
        abstract: "",
        student_id: student.student_id_number || "",
        student_name: student.name || "",
        department_id: student.department_id?._id || "",
        department_name: student.department_id?.name || "",
        file_path: "",
        keywords: "",
      })
    } else {
      setFormData({
        title: "",
        abstract: "",
        student_id: "",
        student_name: "",
        department_id: "",
        department_name: "",
        file_path: "",
        keywords: "",
      })
    }
  }

  const resetReviewForm = () => {
    const currentUser = getCurrentUser()
    setReviewData({
      status: "pending",
      reviewer_comments: "",
      reviewer_id: currentUser?.id || currentUser?._id || "",
    })
  }

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  const getStatusCounts = () => {
    const counts = {
      pending: researchSubmissions.filter((submission) => submission.status === "pending" || !submission.status).length,
      accepted: researchSubmissions.filter((submission) => submission.status === "accepted").length,
      rejected: researchSubmissions.filter((submission) => submission.status === "rejected").length,
    }
    return counts
  }

  const statusCounts = getStatusCounts()

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#004B87]"></div>
        <p className="ml-4 text-lg text-gray-600">Loading submissions...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 my-4">
        <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
        <p>{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Research Paper Submissions</h2>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "student" ? "bg-[#004B87] text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab("student")}
          >
            Student View
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "committee" ? "bg-[#004B87] text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab("committee")}
          >
            Committee View
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "admin" ? "bg-[#004B87] text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab("admin")}
          >
            Admin View
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-[#004B87] bg-opacity-10 flex items-center justify-center mr-4">
            <span className="text-[#004B87] font-bold">{researchSubmissions.length}</span>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Submissions</p>
            <p className="text-lg font-semibold text-gray-800">{researchSubmissions.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-yellow-500 bg-opacity-10 flex items-center justify-center mr-4">
            <span className="text-yellow-500 font-bold">{statusCounts.pending}</span>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Pending Review</p>
            <p className="text-lg font-semibold text-gray-800">{statusCounts.pending}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-500 bg-opacity-10 flex items-center justify-center mr-4">
            <span className="text-green-500 font-bold">{statusCounts.accepted}</span>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Accepted</p>
            <p className="text-lg font-semibold text-gray-800">{statusCounts.accepted}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-red-500 bg-opacity-10 flex items-center justify-center mr-4">
            <span className="text-red-500 font-bold">{statusCounts.rejected}</span>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Rejected</p>
            <p className="text-lg font-semibold text-gray-800">{statusCounts.rejected}</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by title, abstract, or keywords..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={18} />
              <span>Filters</span>
              <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="all">All Departments</option>
                    {departmentsList.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between">
                  <button
                    className="text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => {
                      setStatusFilter("all")
                      setDepartmentFilter("all")
                    }}
                  >
                    Clear filters
                  </button>
                  <button
                    className="text-sm bg-[#004B87] text-white px-3 py-1 rounded-md hover:bg-[#003a6a]"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {activeTab === "student" && (
            <button
              className="flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
              onClick={() => {
                resetForm()
                setIsSubmitModalOpen(true)
              }}
            >
              <Plus size={18} className="mr-2" />
              Submit Research
            </button>
          )}
        </div>
      </div>

      {/* Research Submissions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="p-8 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No research submissions found</h3>
            <p className="text-gray-600 mb-4">
              {activeTab === "student"
                ? "You haven't submitted any research papers yet."
                : "No submissions match your current filters."}
            </p>
            {activeTab === "student" && (
              <button
                className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
                onClick={() => {
                  resetForm()
                  setIsSubmitModalOpen(true)
                }}
              >
                Submit Your First Research Paper
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {(activeTab === "student"
                    ? studentColumns
                    : activeTab === "committee"
                      ? committeeColumns
                      : adminColumns
                  ).map((column, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.header}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission._id || submission.id} className="hover:bg-gray-50">
                    {(activeTab === "student"
                      ? studentColumns
                      : activeTab === "committee"
                        ? committeeColumns
                        : adminColumns
                    ).map((column, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                        {column.render ? column.render(submission) : submission[column.accessor]}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => openViewModal(submission)}
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {activeTab === "committee" && (submission.status === "pending" || !submission.status) && (
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() => openReviewModal(submission)}
                            title="Review Submission"
                          >
                            <MessageSquare size={18} />
                          </button>
                        )}
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          onClick={() => {
                            // In a real app, this would download the file
                            alert(`Downloading: ${submission.file_path || "research paper"}`)
                          }}
                          title="Download Paper"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submit Research Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Research Paper"
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmitResearch()
          }}
        >
          <div className="grid grid-cols-1 gap-6">
            <FormField label="Paper Title" name="title" value={formData.title} onChange={handleInputChange} required />
            <FormField
              label="Abstract"
              name="abstract"
              type="textarea"
              value={formData.abstract}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <select
                  name="student_id"
                  value={formData.student_id}
                  onChange={(e) => {
                    const selectedStudent = students.find((s) => s._id === e.target.value)
                    console.log("Selected student:", selectedStudent)
                    setFormData({
                      ...formData,
                      student_id: selectedStudent?._id || "",
                      student_name: selectedStudent?.name || "",
                      department_id: selectedStudent?.department_id?._id || "",
                      department_name: selectedStudent?.department_id?.name || "",
                    })
                    
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name} ({student.student_id_number})
                    </option>

                  ))}
                </select>
              </div>
              <FormField
                label="Student Name"
                name="student_name"
                value={formData.student_name}
                onChange={handleInputChange}
                disabled
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={(e) => {
                    const selectedDept = departmentsList.find((dept) => dept._id === e.target.value)
                    setFormData({
                      ...formData,
                      department_id: e.target.value,
                      department_name: selectedDept ? selectedDept.name : "",
                    })
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Department</option>
                  {departmentsList.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <FormField
                label="Keywords (comma separated)"
                name="keywords"
                value={formData.keywords}
                onChange={handleKeywordsChange}
                required
                placeholder="e.g. Climate Change, Agriculture, Sustainability"
              />
            </div>
            <div className="border border-dashed border-gray-300 rounded-lg p-6">
              <div className="flex flex-col items-center justify-center">
                <FileText size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">Upload Research Paper</h3>
                <p className="text-gray-500 text-sm mb-4 text-center">
                  Upload your research paper in PDF format. Maximum file size: 10MB
                </p>
                <input
                  type="file"
                  id="file_upload"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => {
                    // In a real app, this would handle file upload
                    setFormData({
                      ...formData,
                      file_path: e.target.files[0]?.name || "",
                    })
                  }}
                />
                <label
                  htmlFor="file_upload"
                  className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors cursor-pointer"
                >
                  Select File
                </label>
                {formData.file_path && (
                  <div className="mt-4 flex items-center">
                    <FileText size={16} className="text-[#004B87] mr-2" />
                    <span className="text-sm">{formData.file_path}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle size={20} className="text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Important Information</h4>
                  <p className="text-sm text-blue-600">
                    Your submission will be reviewed by the research committee. You will be notified once a decision has
                    been made. Please ensure your paper follows the university's research guidelines.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setIsSubmitModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
              >
                <Save size={18} className="inline mr-2" />
                Submit Research
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Review Submission Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Review Research Submission"
        size="lg"
      >
        {currentSubmission && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleReviewSubmission()
            }}
          >
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">{currentSubmission.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Submitted by {currentSubmission.student_name} on{" "}
                  {formatDate(currentSubmission.submission_date || currentSubmission.createdAt)}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {Array.isArray(currentSubmission.keywords) ? (
                    currentSubmission.keywords.map((keyword, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No keywords</span>
                  )}
                </div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Abstract</h4>
                <p className="text-sm text-gray-600">{currentSubmission.abstract}</p>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800">Review Decision</h3>
                <div className="flex items-center">
                  <a
                    href="#"
                    className="text-[#004B87] hover:underline text-sm flex items-center"
                    onClick={(e) => {
                      e.preventDefault()
                      // In a real app, this would download the file
                      alert(`Downloading: ${currentSubmission.file_path || "research paper"}`)
                    }}
                  >
                    <Download size={16} className="mr-1" />
                    Download Paper
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review Status</label>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="status_pending"
                        name="status"
                        value="pending"
                        checked={reviewData.status === "pending"}
                        onChange={handleReviewChange}
                        className="h-4 w-4 text-[#004B87] focus:ring-[#004B87] border-gray-300"
                      />
                      <label htmlFor="status_pending" className="ml-2 text-sm text-gray-700">
                        Pending (More Review Needed)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="status_accepted"
                        name="status"
                        value="accepted"
                        checked={reviewData.status === "accepted"}
                        onChange={handleReviewChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <label htmlFor="status_accepted" className="ml-2 text-sm text-gray-700">
                        Accept
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="status_rejected"
                        name="status"
                        value="rejected"
                        checked={reviewData.status === "rejected"}
                        onChange={handleReviewChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <label htmlFor="status_rejected" className="ml-2 text-sm text-gray-700">
                        Reject
                      </label>
                    </div>
                  </div>
                </div>

                <FormField
                  label="Reviewer Comments"
                  name="reviewer_comments"
                  type="textarea"
                  value={reviewData.reviewer_comments}
                  onChange={handleReviewChange}
                  placeholder="Provide detailed feedback on the research paper..."
                  required
                />

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle size={20} className="text-yellow-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Review Guidelines</h4>
                      <p className="text-sm text-yellow-600">
                        Please provide constructive feedback to help the student improve their research. If rejecting,
                        clearly explain the reasons and suggest improvements. Your review will be visible to the
                        student.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsReviewModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md text-white flex items-center ${
                    reviewData.status === "accepted"
                      ? "bg-green-600 hover:bg-green-700"
                      : reviewData.status === "rejected"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-[#004B87] hover:bg-[#003a6a]"
                  }`}
                >
                  {reviewData.status === "accepted" ? (
                    <Check size={18} className="mr-2" />
                  ) : reviewData.status === "rejected" ? (
                    <X size={18} className="mr-2" />
                  ) : (
                    <Save size={18} className="mr-2" />
                  )}
                  Submit Review
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* View Submission Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Research Paper Details"
        size="lg"
      >
        {currentSubmission && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentSubmission.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentSubmission.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : currentSubmission.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {currentSubmission.status
                    ? currentSubmission.status.charAt(0).toUpperCase() + currentSubmission.status.slice(1)
                    : "Pending"}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Submitted by {currentSubmission.student_name} on{" "}
                {formatDate(currentSubmission.submission_date || currentSubmission.createdAt)}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(currentSubmission.keywords) ? (
                  currentSubmission.keywords.map((keyword, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No keywords</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Abstract</h4>
              <div className="bg-white border border-gray-200 p-6 rounded-md">
                <p className="text-gray-700">{currentSubmission.abstract}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-800">Research Paper</h4>
              <button
                className="flex items-center text-[#004B87] hover:underline"
                onClick={() => {
                  // In a real app, this would download the file
                  alert(`Downloading: ${currentSubmission.file_path || "research paper"}`)
                }}
              >
                <Download size={18} className="mr-2" />
                Download Paper
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-md flex items-center">
              <div className="w-10 h-10 bg-blue-100 text-blue-800 rounded-md flex items-center justify-center mr-3">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-800">Research Paper PDF</p>
                <p className="text-sm text-gray-500">
                  {currentSubmission.file_path
                    ? currentSubmission.file_path.split("/").pop()
                    : "Research Paper Document"}
                </p>
              </div>
            </div>

            {(currentSubmission.status === "accepted" || currentSubmission.status === "rejected") && (
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">Review Feedback</h4>
                <div
                  className={`p-6 rounded-md ${currentSubmission.status === "accepted" ? "bg-green-50" : "bg-red-50"}`}
                >
                  <div className="flex items-start">
                    {currentSubmission.status === "accepted" ? (
                      <Check size={20} className="text-green-500 mr-3 mt-0.5" />
                    ) : (
                      <X size={20} className="text-red-500 mr-3 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm text-gray-700 mb-2">
                        Reviewed on {currentSubmission.review_date ? formatDate(currentSubmission.review_date) : "N/A"}
                      </p>
                      <p className="text-gray-700">{currentSubmission.reviewer_comments || "No comments provided."}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default StudentResearchSubmission
