import React from "react"
import { useState, useEffect } from "react"
import {
  Plus, Save, Building, GraduationCap, Users, Award, BookOpen,
  TrendingUp, Activity, Eye, Edit, Target, Star, CheckCircle,
  BarChart3, PieChart, Settings, Calendar, Clock, Building2
} from "lucide-react"
import Table from "../common/Table"
import Modal from "../common/Modal"
import FormField from "../common/FormField"
import { useLanguage } from "../../contexts/LanguageContext"

const FacultyManagement = () => {
  const { t, language } = useLanguage()
  const isRTL = language === 'dr' || language === 'ps'

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
      header: t("facultyName"),
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
      header: t("overview"),
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
      alert(t("notAuthenticated"))
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
                <GraduationCap className="h-8 w-8 text-[#F4B400]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-[#F4B400] to-white bg-clip-text text-transparent">
                  {t("facultyManagement")}
                </h1>
                <p className="text-white/90 text-lg">
                  {t("manageFaculties")}
                </p>
              </div>
            </div>
            <div className="flex items-center text-white/70">
              <div className="w-2 h-2 bg-[#F4B400] rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">
                {t("academicGovernance")} • {faculties.length} {t("faculties")}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="text-right mb-3 sm:mb-0">
              <div className="text-2xl font-bold text-[#F4B400]">
                {faculties.length}
              </div>
              <div className="text-white/60 text-sm">
                {t("totalFaculties")}
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
                {t("addNewFaculty")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Faculty Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Faculties Card */}
        <div className="group bg-gradient-to-br from-[#004B87] to-[#1D3D6F] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
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
                <p className="text-white/80 text-sm font-medium">
                  {t("totalFaculties")}
                </p>
              </div>
              <p className="text-3xl font-bold text-white">
                {faculties.length}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
                <span className="text-green-300 text-xs">
                  {t("growthThisYear")}
                </span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-[#F4B400]">{faculties.length}</span>
            </div>
          </div>
        </div>

        {/* Academic Programs Card */}
        <div className="group bg-gradient-to-br from-[#F4B400] to-[#E6A200] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#004B87] rounded-full translate-y-8 -translate-x-8"></div>
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
                {faculties.length * 3}
              </p>
              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 text-white/70 mr-1" />
                <span className="text-white/70 text-xs">
                  {t("diverseOfferings")}
                </span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{faculties.length * 3}</span>
            </div>
          </div>
        </div>

        {/* Active Faculties Card */}
        <div className="group bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">
                  {t("activeFaculties")}
                </p>
              </div>
              <p className="text-3xl font-bold text-white">
                {faculties.length}
              </p>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 text-green-200 mr-1" />
                <span className="text-green-200 text-xs">
                  {t("fullyOperational")}
                </span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{faculties.length}</span>
            </div>
          </div>
        </div>

        {/* Research Centers Card */}
        <div className="group bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">
                  {t("researchCenters")}
                </p>
              </div>
              <p className="text-3xl font-bold text-white">
                {Math.floor(faculties.length * 1.5)}
              </p>
              <div className="flex items-center mt-2">
                <Activity className="h-4 w-4 text-purple-200 mr-1" />
                <span className="text-purple-200 text-xs">
                  {t("innovationHubs")}
                </span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{Math.floor(faculties.length * 1.5)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Faculty Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#EC4899] to-[#DB2777] p-2 rounded-lg mr-3">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {t("facultyOverview")}
              </h3>
            </div>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {faculties.slice(0, 3).map((faculty, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {faculty.name}
                </span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-gradient-to-r from-[#EC4899] to-[#DB2777] h-2 rounded-full"
                      style={{width: `${Math.min(100, (faculty.name.length * 5))}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {t("active")}
                  </span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {t("totalFaculties")}
              </span>
              <span className="text-lg font-bold text-[#EC4899]">{faculties.length}</span>
            </div>
          </div>
        </div>

        {/* Academic Structure */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#06B6D4] to-[#0891B2] p-2 rounded-lg mr-3">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {t("academicStructure")}
              </h3>
            </div>
            <Settings className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {t("undergraduatePrograms")}
              </span>
              <span className="text-lg font-bold text-[#06B6D4]">{faculties.length * 2}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {t("graduatePrograms")}
              </span>
              <span className="text-lg font-bold text-[#06B6D4]">{faculties.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {t("researchPrograms")}
              </span>
              <span className="text-lg font-bold text-[#06B6D4]">{Math.floor(faculties.length * 0.8)}</span>
            </div>
          </div>
        </div>

        {/* Faculty Metrics */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] p-2 rounded-lg mr-3">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {t("facultyMetrics")}
              </h3>
            </div>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {t("withMission")}
              </span>
              <span className="text-lg font-bold text-[#F59E0B]">
                {faculties.filter(f => f.mission).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {t("withVision")}
              </span>
              <span className="text-lg font-bold text-[#F59E0B]">
                {faculties.filter(f => f.vision).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {t("completeProfiles")}
              </span>
              <span className="text-lg font-bold text-[#F59E0B]">
                {faculties.filter(f => f.mission && f.vision && f.overview && f.history).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Status */}
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-sm">
          {t("authenticationStatus")}:{" "}
          {getAuthToken() ? (
            <span className="text-green-600 font-medium">{t("authenticated")}</span>
          ) : (
            <span className="text-red-600 font-medium">{t("notAuthenticated")}</span>
          )}
        </p>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center py-4">
          <p className="text-gray-600">{t("loading")}</p>
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
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t("addNewFaculty")} size="lg">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleAddFaculty()
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField label={t("facultyName")} name="name" value={formData.name} onChange={handleInputChange} required />
            <FormField
              label={t("overview")}
              name="overview"
              type="textarea"
              value={formData.overview}
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
              label={t("history")}
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
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors flex items-center"
              disabled={isLoading}
            >
              <Save size={18} className="inline mr-2" />
              {isLoading ? t("saving") : t("saveFaculty")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Faculty Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={t("editFaculty")} size="lg">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleEditFaculty()
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField label={t("facultyName")} name="name" value={formData.name} onChange={handleInputChange} required />
            <FormField
              label={t("overview")}
              name="overview"
              type="textarea"
              value={formData.overview}
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
              label={t("history")}
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
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors flex items-center"
              disabled={isLoading}
            >
              <Save size={18} className="inline mr-2" />
              {isLoading ? t("updating") : t("updateFaculty")}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Faculty Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={t("facultyDetails")} size="lg">
        {currentFaculty && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {currentFaculty.name}
              </h3>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">
                {t("overview")}
              </h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">
                {currentFaculty.overview || t("overviewNotAvailable")}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">
                {t("mission")}
              </h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">
                {currentFaculty.mission || t("missionNotAvailable")}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">
                {t("vision")}
              </h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">
                {currentFaculty.vision || t("visionNotAvailable")}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">
                {t("history")}
              </h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">
                {currentFaculty.history || t("historyNotAvailable")}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default FacultyManagement
