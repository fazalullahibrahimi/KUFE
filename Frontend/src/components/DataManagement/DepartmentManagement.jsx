
import React from "react"
import { useState, useEffect } from "react"
import {
  Plus, Save, Layers, Building2, Users, GraduationCap, BookOpen,
  TrendingUp, Activity, Eye, Edit, Target, Award, MapPin, Calendar,
  BarChart3, PieChart, LineChart, Settings
} from "lucide-react"
import Table from "../common/Table"
import Modal from "../common/Modal"
import FormField from "../common/FormField"
import { useLanguage } from "../../contexts/LanguageContext"

const DepartmentManagement = () => {
  const { t, isRTL, language } = useLanguage();
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
      header: t("departmentName"),
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
      header: t("description"),
      accessor: "description",
      render: (row) => <p className="truncate max-w-md">{row.description}</p>,
    },
    {
      header: t("faculty"),
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
        alert(`${t("errorOccurred")}: ${result.message}`)
      }
    } catch (error) {
      console.error("Error creating department:", error)
      alert(t("errorOccurred"))
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
        alert(`${t("errorOccurred")}: ${result.message}`)
      }
    } catch (error) {
      console.error("Error updating department:", error)
      alert(t("errorOccurred"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDepartment = async (department) => {
    if (window.confirm(`${t("confirmDelete")} "${department.name}"?`)) {
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
          alert(t("deleteSuccess"))
        } else {
          // Try alternative approach if the first one fails
          const alternativeResponse = await fetch(`http://127.0.0.1:4400/api/v1/departments/delete/${department._id}`, {
            method: "POST", // Some APIs use POST for delete operations
            headers: createAuthHeaders(),
          })

          const alternativeResult = await alternativeResponse.json()

          if (alternativeResult.status === "success") {
            setDepartments((prevDepartments) => prevDepartments.filter((dep) => dep._id !== department._id))
            alert(t("deleteSuccess"))
          } else {
            alert(`${t("errorOccurred")}: ${result.message || alternativeResult.message}`)
          }
        }
      } catch (error) {
        console.error("Error deleting department:", error)
        alert(t("errorOccurred"))
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
      alert(t("errorOccurred"))
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
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30 mr-4">
                <Building2 className="h-8 w-8 text-[#F4B400]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-[#F4B400] to-white bg-clip-text text-transparent">
                  {t("departmentManagement")}
                </h1>
                <p className="text-white/90 text-lg">
                  {t("organizeManageDepartments")}
                </p>
              </div>
            </div>
            <div className="flex items-center text-white/70">
              <div className="w-2 h-2 bg-[#F4B400] rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">
                {t("organizeManageDepartments")} • {departments.length} {t("departments")}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="text-right mb-3 sm:mb-0">
              <div className="text-2xl font-bold text-[#F4B400]">
                {departments.length}
              </div>
              <div className="text-white/60 text-sm">
                {t("totalDepartments")}
              </div>
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
                {t("addNewDepartment")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Department Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Departments Card */}
        <div className="group bg-gradient-to-br from-[#004B87] to-[#1D3D6F] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
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
                <p className="text-white/80 text-sm font-medium">
                  {t("totalDepartments")}
                </p>
              </div>
              <p className="text-3xl font-bold text-white">
                {departments.length}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
                <span className="text-green-300 text-xs">
                  {t("thisYear")}
                </span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-[#F4B400]">{departments.length}</span>
            </div>
          </div>
        </div>

        {/* Faculties Card */}
        <div className="group bg-gradient-to-br from-[#F4B400] to-[#E6A200] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#004B87] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">
                  {t("totalFaculty")}
                </p>
              </div>
              <p className="text-3xl font-bold text-white">
                {faculties.length}
              </p>
              <div className="flex items-center mt-2">
                <Award className="h-4 w-4 text-white/70 mr-1" />
                <span className="text-white/70 text-xs">
                  {t("academicDivisions")}
                </span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{faculties.length}</span>
            </div>
          </div>
        </div>

        {/* Active Departments Card */}
        <div className="group bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">
                  {t("activeDepartments")}
                </p>
              </div>
              <p className="text-3xl font-bold text-white">
                {departments.length}
              </p>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 text-green-200 mr-1" />
                <span className="text-green-200 text-xs">
                  {t("fullyOperational")}
                </span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{departments.length}</span>
            </div>
          </div>
        </div>

        {/* Programs Card */}
        <div className="group bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
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
                <p className="text-white/80 text-sm font-medium">
                  {t("academicPrograms")}
                </p>
              </div>
              <p className="text-3xl font-bold text-white">
                {departments.length * 3}
              </p>
              <div className="flex items-center mt-2">
                <Calendar className="h-4 w-4 text-purple-200 mr-1" />
                <span className="text-purple-200 text-xs">
                  {t("degreePrograms")}
                </span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{departments.length * 3}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Department Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#EC4899] to-[#DB2777] p-2 rounded-lg mr-3">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t("departmentOverview")}</h3>
            </div>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("withMissionStatement")}</span>
              <span className="text-lg font-bold text-[#EC4899]">
                {departments.filter(d => d.mission).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("withVisionStatement")}</span>
              <span className="text-lg font-bold text-[#EC4899]">
                {departments.filter(d => d.vision).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("withValues")}</span>
              <span className="text-lg font-bold text-[#EC4899]">
                {departments.filter(d => d.values).length}
              </span>
            </div>
          </div>
        </div>

        {/* Faculty Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#06B6D4] to-[#0891B2] p-2 rounded-lg mr-3">
                <PieChart className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t("facultyDistribution")}</h3>
            </div>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("departmentsPerFaculty")}</span>
              <span className="text-lg font-bold text-[#06B6D4]">
                {faculties.length > 0 ? Math.round(departments.length / faculties.length * 10) / 10 : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("largestFaculty")}</span>
              <span className="text-lg font-bold text-[#06B6D4]">
                {faculties.length > 0 ? Math.ceil(departments.length / faculties.length) : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("coverageRate")}</span>
              <span className="text-lg font-bold text-[#06B6D4]">100%</span>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] p-2 rounded-lg mr-3">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t("systemStatus")}</h3>
            </div>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("authentication")}</span>
              <span className={`text-lg font-bold ${getAuthToken() ? 'text-green-500' : 'text-red-500'}`}>
                {getAuthToken() ? t("active") : t("inactive")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("dataSync")}</span>
              <span className="text-lg font-bold text-[#F59E0B]">{t("live")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("lastUpdate")}</span>
              <span className="text-lg font-bold text-[#F59E0B]">{t("now")}</span>
            </div>
          </div>
        </div>
      </div>



      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center py-4">
          <p className="text-gray-600">{t("loading")}</p>
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
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t("addNewDepartment")}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleAddDepartment()
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField
              label={t("departmentName")}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <FormField
              label={t("description")}
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <FormField
              label={t("mission")}
              name="mission"
              type="textarea"
              value={formData.mission}
              onChange={handleInputChange}
              required
            />
            <FormField
              label={t("vision")}
              name="vision"
              type="textarea"
              value={formData.vision}
              onChange={handleInputChange}
              required
            />
            <FormField
              label={t("values")}
              name="values"
              type="textarea"
              value={formData.values}
              onChange={handleInputChange}
              required
            />

            {/* Faculty Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">{t("faculty")}</label>
              <select
                name="faculty"
                value={formData.faculty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">{t("selectFaculty")}</option>
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
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors flex items-center"
              disabled={isLoading}
            >
              <Save size={18} className="inline mr-2" />
              {isLoading ? t("loading") : t("addDepartment")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Department Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={t("editDepartment")}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleEditDepartment()
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField
              label={t("departmentName")}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <FormField
              label={t("description")}
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <FormField
              label={t("mission")}
              name="mission"
              type="textarea"
              value={formData.mission}
              onChange={handleInputChange}
              required
            />
            <FormField
              label={t("vision")}
              name="vision"
              type="textarea"
              value={formData.vision}
              onChange={handleInputChange}
              required
            />
            <FormField
              label={t("values")}
              name="values"
              type="textarea"
              value={formData.values}
              onChange={handleInputChange}
              required
            />

            {/* Faculty Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">{t("faculty")}</label>
              <select
                name="faculty"
                value={formData.faculty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">{t("selectFaculty")}</option>
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
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors flex items-center"
              disabled={isLoading}
            >
              <Save size={18} className="inline mr-2" />
              {isLoading ? t("loading") : t("editDepartment")}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Department Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={t("departmentDetails")}>
        {currentDepartment && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentDepartment.name}</h3>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">{t("description")}</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{currentDepartment.description}</p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">{t("mission")}</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{currentDepartment.mission || t("missionNotAvailable")}</p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">{t("vision")}</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{currentDepartment.vision || t("visionNotAvailable")}</p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">{t("values")}</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{currentDepartment.values || t("valuesNotAvailable")}</p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">{t("faculty")}</h4>
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
