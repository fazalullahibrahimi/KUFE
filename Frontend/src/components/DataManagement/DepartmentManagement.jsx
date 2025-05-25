
import React from "react"
import { useState, useEffect } from "react"
import { Plus, Save, Layers } from "lucide-react"
import Table from "../common/Table"
import Modal from "../common/Modal"
import FormField from "../common/FormField"

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([])
  const [faculties, setFaculties] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentDepartment, setCurrentDepartment] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mission: "",
    vision: "",
    values: "",
    faculty: "",
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
    fetchDepartments()
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
        setFaculties(result.data.faculties)
      } else {
        console.error("Failed to fetch faculties:", result.message)
      }
    } catch (error) {
      console.error("Error fetching faculties:", error)
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
      // Set some default departments if API fails
      setDepartments([
        {
          _id: "1",
          name: "Accounting",
          description:
            "The Department of Accounting prepares students for careers in financial accounting, managerial accounting, auditing, and taxation through theoretical and practical education.",
          mission: "To provide excellence in accounting education and research that prepares students for successful careers in the accounting profession.",
          vision: "To be a leading department in accounting education, recognized for innovation, integrity, and impact in the global business community.",
          values: "Integrity, Excellence, Innovation, Professional Ethics, and Continuous Learning.",
          faculty: "60a1c2b3d4e5f6a7b8c9d0e1",
        },
        {
          _id: "2",
          name: "Computer Science",
          description:
            "The Department of Computer Science offers programs in software development, artificial intelligence, data science, and cybersecurity.",
          mission: "To advance the field of computer science through cutting-edge research and education, preparing students to be leaders in technology.",
          vision: "To be a premier computer science department that shapes the future of technology and digital innovation.",
          values: "Innovation, Collaboration, Technical Excellence, Ethical Computing, and Lifelong Learning.",
          faculty: "60a1c2b3d4e5f6a7b8c9d0e2",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Find faculty name by ID
  const getFacultyNameById = (facultyId) => {
    const faculty = faculties.find((f) => f._id === facultyId)
    return faculty ? faculty.name : facultyId
  }

  // Table columns configuration
  const columns = [
    {
      header: "Department Name",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3">
            <Layers size={16} />
          </div>
          <p className="font-medium text-gray-800">{row.name}</p>
        </div>
      ),
    },
    {
      header: "Description",
      accessor: "description",
      render: (row) => <p className="truncate max-w-md">{row.description}</p>,
    },
    {
      header: "Faculty",
      accessor: "faculty",
      render: (row) => <p>{getFacultyNameById(row.faculty)}</p>,
    },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAddDepartment = async () => {
    try {
      setIsLoading(true)

      const response = await fetch("http://127.0.0.1:4400/api/v1/departments/", {
        method: "POST",
        headers: createAuthHeaders(),
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.status === "success") {
        // Refresh departments list
        fetchDepartments()
        setIsAddModalOpen(false)
        resetForm()
      } else {
        alert(`Failed to create department: ${result.message}`)
      }
    } catch (error) {
      console.error("Error creating department:", error)
      alert("Failed to create department. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditDepartment = async () => {
    try {
      setIsLoading(true)

      const response = await fetch(`http://127.0.0.1:4400/api/v1/departments/${currentDepartment._id}`, {
        method: "PATCH",
        headers: createAuthHeaders(),
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.status === "success") {
        // Refresh departments list
        fetchDepartments()
        setIsEditModalOpen(false)
      } else {
        alert(`Failed to update department: ${result.message}`)
      }
    } catch (error) {
      console.error("Error updating department:", error)
      alert("Failed to update department. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDepartment = async (department) => {
    if (window.confirm(`Are you sure you want to delete "${department.name}"?`)) {
      try {
        setIsLoading(true)

        // Try a different approach - send a DELETE request with the department ID in the body
        const response = await fetch(`http://127.0.0.1:4400/api/v1/departments/${department._id}`, {
          method: "DELETE",
          headers: createAuthHeaders(),
          // Add body with ID to help backend identify what to delete
          body: JSON.stringify({ id: department._id }),
        })

        const result = await response.json()

        if (result.status === "success") {
          // Update the departments list by removing the deleted department
          setDepartments((prevDepartments) => prevDepartments.filter((dep) => dep._id !== department._id))
          alert("Department deleted successfully")
        } else {
          // Try alternative approach if the first one fails
          const alternativeResponse = await fetch(`http://127.0.0.1:4400/api/v1/departments/delete/${department._id}`, {
            method: "POST", // Some APIs use POST for delete operations
            headers: createAuthHeaders(),
          })

          const alternativeResult = await alternativeResponse.json()

          if (alternativeResult.status === "success") {
            setDepartments((prevDepartments) => prevDepartments.filter((dep) => dep._id !== department._id))
            alert("Department deleted successfully")
          } else {
            alert(`Failed to delete department: ${result.message || alternativeResult.message}`)
          }
        }
      } catch (error) {
        console.error("Error deleting department:", error)
        alert("Failed to delete department. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const openEditModal = (department) => {
    setCurrentDepartment(department)
    setFormData({
      name: department.name,
      description: department.description,
      mission: department.mission || "",
      vision: department.vision || "",
      values: department.values || "",
      faculty: department.faculty,
    })
    setIsEditModalOpen(true)
  }

  const openViewModal = (department) => {
    setCurrentDepartment(department)
    setIsViewModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      mission: "",
      vision: "",
      values: "",
      faculty: "",
    })
  }

  // Check if user is authenticated
  const checkAuthentication = () => {
    const token = getAuthToken()
    if (!token) {
      alert("You are not logged in. Please log in to manage departments.")
      // Redirect to login page or show login modal
      // window.location.href = '/login';
      return false
    }
    return true
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Department Management</h2>
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
          Add New Department
        </button>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-[#004B87] bg-opacity-10 flex items-center justify-center mr-4">
            <span className="text-[#004B87] font-bold">{departments.length}</span>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Departments</p>
            <p className="text-lg font-semibold text-gray-800">{departments.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-[#F4B400] bg-opacity-10 flex items-center justify-center mr-4">
            <span className="text-[#F4B400] font-bold">{faculties.length}</span>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Faculties</p>
            <p className="text-lg font-semibold text-gray-800">{faculties.length}</p>
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

      {/* Department Table */}
      <Table
        columns={columns}
        data={departments}
        actions={true}
        onView={(department) => {
          if (checkAuthentication()) {
            openViewModal(department)
          }
        }}
        onEdit={(department) => {
          if (checkAuthentication()) {
            openEditModal(department)
          }
        }}
        onDelete={(department) => {
          if (checkAuthentication()) {
            handleDeleteDepartment(department)
          }
        }}
      />

      {/* Add Department Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Department">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleAddDepartment()
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField
              label="Department Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
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
              label="Values"
              name="values"
              type="textarea"
              value={formData.values}
              onChange={handleInputChange}
              required
            />

            {/* Faculty Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Faculty</label>
              <select
                name="faculty"
                value={formData.faculty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a Faculty</option>
                {faculties.map((faculty) => (
                  <option key={faculty._id} value={faculty._id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            </div>
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
              {isLoading ? "Saving..." : "Save Department"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Department Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Department">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleEditDepartment()
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField
              label="Department Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
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
              label="Values"
              name="values"
              type="textarea"
              value={formData.values}
              onChange={handleInputChange}
              required
            />

            {/* Faculty Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Faculty</label>
              <select
                name="faculty"
                value={formData.faculty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a Faculty</option>
                {faculties.map((faculty) => (
                  <option key={faculty._id} value={faculty._id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            </div>
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
              {isLoading ? "Updating..." : "Update Department"}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Department Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Department Details">
        {currentDepartment && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentDepartment.name}</h3>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Description</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{currentDepartment.description}</p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Mission</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{currentDepartment.mission || "No mission statement available"}</p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Vision</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{currentDepartment.vision || "No vision statement available"}</p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Values</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{currentDepartment.values || "No values statement available"}</p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Faculty</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-800">{getFacultyNameById(currentDepartment.faculty)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DepartmentManagement
