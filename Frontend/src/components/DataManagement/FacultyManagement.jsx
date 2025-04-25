import React from "react"
import { useState, useEffect } from "react"
import { Plus, Save, Building } from "lucide-react"
import Table from "../common/Table"
import Modal from "../common/Modal"
import FormField from "../common/FormField"

const FacultyManagement = () => {
  const [faculties, setFaculties] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentFaculty, setCurrentFaculty] = useState(null)
  const [facultyCount, setFacultyCount] = useState(0)

  const [formData, setFormData] = useState({
    name: "",
    overview: "",
    mission: "",
    vision: "",
    history: "",
  })

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token") || ""
  }

  // Create headers with authentication
  const createAuthHeaders = () => {
    const token = getAuthToken()
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  // Fetch faculties when component mounts
  useEffect(() => {
    fetchFaculties()
    fetchFacultyCount()
  }, [])

  // Fetch faculties from API
  const fetchFaculties = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("http://127.0.0.1:4400/api/v1/faculty/", {
        headers: createAuthHeaders(),
      })
      const result = await response.json()

      if (result.status === "success") {
        setFaculties(result.data.faculties || [])
      } else {
        console.error("Failed to fetch faculties:", result.message)
        // Set sample data if API fails
        setFaculties([
          {
            _id: "1",
            name: "Faculty Computer Science",
            overview:
              "The Faculty of Computer Science provides high-quality education and research opportunities in the field of computing and information technology.",
            mission:
              "To develop innovative and skilled professionals in the field of computer science through quality education and research.",
            vision:
              "To be a leading institution in computer science education and research, fostering technological advancements for societal benefits.",
            history:
              "Established in 2005, the faculty has grown to become a center of excellence, offering undergraduate and postgraduate programs in computer science.",
          },
          {
            _id: "2",
            name: "Faculty of Economics",
            overview:
              "The Faculty of Economics offers comprehensive education in economic theory, policy, and analysis to prepare students for careers in business and government.",
            mission:
              "To educate students in economic principles and their application to real-world problems, fostering critical thinking and analytical skills.",
            vision:
              "To be recognized as a premier institution for economic education and research, contributing to economic development and policy formation.",
            history:
              "Founded in 1998, the faculty has established itself as a leading center for economic studies in the region.",
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching faculties:", error)
    } finally {
      setIsLoading(false)
    }
  }


  const fetchFacultyCount = async () => {
    try {
      const response = await fetch("http://127.0.0.1:4400/api/v1/faculty/count", {
        headers: createAuthHeaders(),
      })
      const result = await response.json()
      console.log(result.data.count);
      if (result.status === "success" && result.data?.count !== undefined) {
        setFacultyCount(result.data.count)
      } else {
        console.error("Failed to fetch faculty count:", result.message)
      }
    } catch (error) {
      console.error("Error fetching faculty count:", error)
    }
  }


  // Table columns configuration
  const columns = [
    {
      header: "Faculty Name",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3">
            <Building size={16} />
          </div>
          <p className="font-medium text-gray-800">{row.name}</p>
        </div>
      ),
    },
    {
      header: "Overview",
      accessor: "overview",
      render: (row) => <p className="truncate max-w-md">{row.overview}</p>,
    },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAddFaculty = async () => {
    try {
      setIsLoading(true)

      const response = await fetch("http://127.0.0.1:4400/api/v1/faculty/", {
        method: "POST",
        headers: createAuthHeaders(),
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.status === "success") {
        // Add the new faculty to the state
        setFaculties([...faculties, result.data.faculty])
        setIsAddModalOpen(false)
        resetForm()
        alert("Faculty created successfully")
      } else {
        alert(`Failed to create faculty: ${result.message}`)
      }
    } catch (error) {
      console.error("Error creating faculty:", error)
      alert("Failed to create faculty. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditFaculty = async () => {
    try {
      setIsLoading(true)

      const response = await fetch(`http://127.0.0.1:4400/api/v1/faculty/${currentFaculty._id}`, {
        method: "PATCH",
        headers: createAuthHeaders(),
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.status === "success") {
        // Update the faculty in the state
        setFaculties(faculties.map((faculty) => (faculty._id === currentFaculty._id ? result.data.faculty : faculty)))
        setIsEditModalOpen(false)
        alert("Faculty updated successfully")
      } else {
        alert(`Failed to update faculty: ${result.message}`)
      }
    } catch (error) {
      console.error("Error updating faculty:", error)
      alert("Failed to update faculty. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteFaculty = async (faculty) => {
    if (window.confirm(`Are you sure you want to delete "${faculty.name}"?`)) {
      try {
        setIsLoading(true)

        const response = await fetch(`http://127.0.0.1:4400/api/v1/faculty/${faculty._id}`, {
          method: "DELETE",
          headers: createAuthHeaders(),
        })

        const result = await response.json()

        if (result.status === "success") {
          // Remove the faculty from the state
          setFaculties(faculties.filter((f) => f._id !== faculty._id))
          alert("Faculty deleted successfully")
        } else {
          alert(`Failed to delete faculty: ${result.message}`)
        }
      } catch (error) {
        console.error("Error deleting faculty:", error)
        alert("Failed to delete faculty. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const openEditModal = (faculty) => {
    setCurrentFaculty(faculty)
    setFormData({
      name: faculty.name,
      overview: faculty.overview,
      mission: faculty.mission,
      vision: faculty.vision,
      history: faculty.history,
    })
    setIsEditModalOpen(true)
  }

  const openViewModal = (faculty) => {
    setCurrentFaculty(faculty)
    setIsViewModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      overview: "",
      mission: "",
      vision: "",
      history: "",
    })
  }

  // Check if user is authenticated
  const checkAuthentication = () => {
    const token = getAuthToken()
    if (!token) {
      alert("You are not logged in. Please log in to manage faculties.")
      // Redirect to login page or show login modal
      // window.location.href = '/login';
      return false
    }
    return true
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Faculty Management</h2>
        <button
          className="flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
          onClick={() => {
            if (checkAuthentication()) {
              resetForm()
              setIsAddModalOpen(true)
            }
          }}
          disabled={isLoading}
        >
          <Plus size={18} className="mr-2" />
          Add New Faculty
        </button>
      </div>

      {/* Faculty Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-[#004B87] bg-opacity-10 flex items-center justify-center mr-4">
          <span className="text-[#004B87] font-bold">{facultyCount}</span>

          </div>
          <div>
            <p className="text-gray-800 text-sm">Total Faculties</p>
            <p className="text-lg font-semibold text-gray-800">{facultyCount}</p>
          </div>
        </div>
      </div>

      {/* Authentication Status */}
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-sm">
          Authentication Status:{" "}
          {getAuthToken() ? (
            <span className="text-green-600 font-medium">Authenticated</span>
          ) : (
            <span className="text-red-600 font-medium">Not Authenticated</span>
          )}
        </p>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading...</p>
        </div>
      )}

      {/* Faculty Table */}
      <Table
        columns={columns}
        data={faculties}
        actions={true}
        onView={(faculty) => {
          if (checkAuthentication()) {
            openViewModal(faculty)
          }
        }}
        onEdit={(faculty) => {
          if (checkAuthentication()) {
            openEditModal(faculty)
          }
        }}
        onDelete={(faculty) => {
          if (checkAuthentication()) {
            handleDeleteFaculty(faculty)
          }
        }}
      />

      {/* Add Faculty Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Faculty" size="lg">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleAddFaculty()
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField label="Faculty Name" name="name" value={formData.name} onChange={handleInputChange} required />
            <FormField
              label="Overview"
              name="overview"
              type="textarea"
              value={formData.overview}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Mission"
              name="mission"
              type="textarea"
              value={formData.mission}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Vision"
              name="vision"
              type="textarea"
              value={formData.vision}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="History"
              name="history"
              type="textarea"
              value={formData.history}
              onChange={handleInputChange}
              required
            />
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
              {isLoading ? "Saving..." : "Save Faculty"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Faculty Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Faculty" size="lg">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleEditFaculty()
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField label="Faculty Name" name="name" value={formData.name} onChange={handleInputChange} required />
            <FormField
              label="Overview"
              name="overview"
              type="textarea"
              value={formData.overview}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Mission"
              name="mission"
              type="textarea"
              value={formData.mission}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Vision"
              name="vision"
              type="textarea"
              value={formData.vision}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="History"
              name="history"
              type="textarea"
              value={formData.history}
              onChange={handleInputChange}
              required
            />
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
              {isLoading ? "Updating..." : "Update Faculty"}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Faculty Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Faculty Details" size="lg">
        {currentFaculty && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentFaculty.name}</h3>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Overview</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{currentFaculty.overview}</p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Mission</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{currentFaculty.mission}</p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Vision</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{currentFaculty.vision}</p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">History</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{currentFaculty.history}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default FacultyManagement
