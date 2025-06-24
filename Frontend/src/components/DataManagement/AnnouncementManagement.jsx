import React from "react"
import { useState, useEffect } from "react"
import {
  Plus, Save, MessageSquare, Megaphone, Star, Calendar, Clock,
  TrendingUp, Activity, Eye, Edit, Target, Award, Users, BarChart3,
  PieChart, Settings, Bell, CheckCircle, AlertCircle, Archive
} from "lucide-react"
import Table from "../common/Table"
import Modal from "../common/Modal"
import FormField from "../common/FormField"
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const AnnouncementManagement = () => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ps' || language === 'dr';

  const [announcements, setAnnouncements] = useState([])
  const [faculties, setFaculties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    publish_date: "",
    expiry_date: "",
    category: "",
    faculty_id: "",
    is_featured: false,
    status: "draft",
  })

  // Get auth token from local storage
  const getAuthToken = () => {
    return localStorage.getItem("token")
  }

  // Create headers with auth token
  const createHeaders = (includeContentType = true) => {
    const token = getAuthToken()
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
    }

    if (includeContentType) {
      headers["Content-Type"] = "application/json"
    }

    return headers
  }

  // Fetch announcements from API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("http://127.0.0.1:4400/api/v1/announcement/", {
          headers: createHeaders(),
        })
        const data = await response.json()
        console.log("API Response:", data)

        if (data.success && data.data) {
          setAnnouncements(data.data)
        } else {
          console.error("Unexpected API response structure:", data)
          setAnnouncements([])
        }
      } catch (error) {
        console.error("Error fetching announcements:", error)
        setAnnouncements([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

  // Fetch faculties from API
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch("http://127.0.0.1:4400/api/v1/faculty/", {
          headers: createHeaders(),
        })
        const data = await response.json()
        console.log("Faculty API Response:", data)

        if (data.status === "success" && data.data && data.data.faculties) {
          setFaculties(data.data.faculties)
        } else {
          console.error("Unexpected faculty API response structure:", data)
          setFaculties([])
        }
      } catch (error) {
        console.error("Error fetching faculties:", error)
        setFaculties([])
      }
    }

    fetchFaculties()
  }, [])

  // Table columns configuration
  const columns = [
    {
      header: t("announcementTitle"),
      accessor: "title",
      render: (row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3">
            <MessageSquare size={16} />
          </div>
          <div>
            <p className="font-medium text-gray-800">{row.title}</p>
            <p className="text-xs text-gray-500">{t(row.category)}</p>
          </div>
        </div>
      ),
    },
    {
      header: t("publishDate"),
      accessor: "publish_date",
      render: (row) => formatDate(row.publish_date),
    },
    {
      header: t("expiryDate"),
      accessor: "expiry_date",
      render: (row) => formatDate(row.expiry_date),
    },
    {
      header: t("featured"),
      accessor: "is_featured",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.is_featured ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.is_featured ? t("featured") : t("regular")}
        </span>
      ),
    },
    {
      header: t("status"),
      accessor: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.status === "published"
              ? "bg-green-100 text-green-800"
              : row.status === "draft"
                ? "bg-gray-100 text-gray-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {t(row.status)}
        </span>
      ),
    },
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleAddAnnouncement = async () => {
    try {
      const response = await fetch("http://127.0.0.1:4400/api/v1/announcement/", {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh the announcements list
        const refreshResponse = await fetch("http://127.0.0.1:4400/api/v1/announcement/", {
          headers: createHeaders(),
        })
        const refreshData = await refreshResponse.json()

        if (refreshData.success && refreshData.data) {
          setAnnouncements(refreshData.data)
        }

        setIsAddModalOpen(false)
        resetForm()
      } else {
        console.error("Error adding announcement:", data)
        alert("Failed to add announcement. Please try again.")
      }
    } catch (error) {
      console.error("Error adding announcement:", error)
      alert("Failed to add announcement. Please try again.")
    }
  }

  const handleEditAnnouncement = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:4400/api/v1/announcement/${currentAnnouncement._id}`, {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh the announcements list
        const refreshResponse = await fetch("http://127.0.0.1:4400/api/v1/announcement/", {
          headers: createHeaders(),
        })
        const refreshData = await refreshResponse.json()

        if (refreshData.success && refreshData.data) {
          setAnnouncements(refreshData.data)
        }

        setIsEditModalOpen(false)
        resetForm()
      } else {
        console.error("Error updating announcement:", data)
        alert("Failed to update announcement. Please try again.")
      }
    } catch (error) {
      console.error("Error updating announcement:", error)
      alert("Failed to update announcement. Please try again.")
    }
  }

  const handleDeleteAnnouncement = async (announcement) => {
    if (window.confirm(`Are you sure you want to delete "${announcement.title}"?`)) {
      try {
        const response = await fetch(`http://127.0.0.1:4400/api/v1/announcement/${announcement._id}`, {
          method: "DELETE",
          headers: createHeaders(),
        })

        const data = await response.json()

        if (data.success) {
          // Refresh the announcements list
          const refreshResponse = await fetch("http://127.0.0.1:4400/api/v1/announcement/", {
            headers: createHeaders(),
          })
          const refreshData = await refreshResponse.json()

          if (refreshData.success && refreshData.data) {
            setAnnouncements(refreshData.data)
          } else {
            // If refresh fails, just remove the deleted item from the current state
            setAnnouncements(announcements.filter((a) => a._id !== announcement._id))
          }
        } else {
          console.error("Error deleting announcement:", data)
          alert("Failed to delete announcement. Please try again.")
        }
      } catch (error) {
        console.error("Error deleting announcement:", error)
        alert("Failed to delete announcement. Please try again.")
      }
    }
  }

  const openEditModal = (announcement) => {
    setCurrentAnnouncement(announcement)
    setFormData({
      title: announcement.title || "",
      content: announcement.content || "",
      publish_date: announcement.publish_date || "",
      expiry_date: announcement.expiry_date || "",
      category: announcement.category || "",
      faculty_id: announcement.faculty_id || "",
      is_featured: announcement.is_featured || false,
      status: announcement.status || "draft",
    })
    setIsEditModalOpen(true)
  }

  const openViewModal = (announcement) => {
    setCurrentAnnouncement(announcement)
    setIsViewModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      publish_date: "",
      expiry_date: "",
      category: "",
      faculty_id: "",
      is_featured: false,
      status: "draft",
    })
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Format date for input field
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16)
  }

  // Get faculty name by ID
  const getFacultyNameById = (id) => {
    const faculty = faculties.find((f) => f._id === id)
    return faculty ? faculty.name : `Faculty ID: ${id}`
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
                <Megaphone className="h-8 w-8 text-[#F4B400]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-[#F4B400] to-white bg-clip-text text-transparent">
                  {t("announcementManagement")}
                </h1>
                <p className="text-white/90 text-lg">{t("createAndManageAnnouncements")}</p>
              </div>
            </div>
            <div className="flex items-center text-white/70">
              <div className="w-2 h-2 bg-[#F4B400] rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">{t("communicationHub")} • {announcements.length} {t("totalAnnouncements")}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="text-right mb-3 sm:mb-0">
              <div className="text-2xl font-bold text-[#F4B400]">{announcements.length}</div>
              <div className="text-white/60 text-sm">{t("totalAnnouncements")}</div>
            </div>
            <button
              className="group bg-white/20 hover:bg-[#F4B400] px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-[#F4B400] hover:scale-105 hover:shadow-xl flex items-center"
              onClick={() => {
                resetForm()
                setIsAddModalOpen(true)
              }}
            >
              <Plus className="h-5 w-5 mr-2 transition-all duration-300 group-hover:text-[#004B87] text-white" />
              <span className="font-medium transition-all duration-300 group-hover:text-[#004B87] text-white">
                {t("addAnnouncement")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Announcement Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Announcements Card */}
        <div className="group bg-gradient-to-br from-[#004B87] to-[#1D3D6F] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Megaphone className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">{t("totalAnnouncements")}</p>
              </div>
              <p className="text-3xl font-bold text-white">{announcements.length}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
                <span className="text-green-300 text-xs">{t("thisMonth")}</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-[#F4B400]">{announcements.length}</span>
            </div>
          </div>
        </div>

        {/* Featured Announcements Card */}
        <div className="group bg-gradient-to-br from-[#F4B400] to-[#E6A200] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#004B87] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">{t("featuredItems")}</p>
              </div>
              <p className="text-3xl font-bold text-white">{announcements.filter((item) => item.is_featured).length}</p>
              <div className="flex items-center mt-2">
                <Award className="h-4 w-4 text-white/70 mr-1" />
                <span className="text-white/70 text-xs">{t("priorityAnnouncements")}</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{announcements.filter((item) => item.is_featured).length}</span>
            </div>
          </div>
        </div>

        {/* Published Announcements Card */}
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
                <p className="text-white/80 text-sm font-medium">{t("published")}</p>
              </div>
              <p className="text-3xl font-bold text-white">{announcements.filter((item) => item.status === "published").length}</p>
              <div className="flex items-center mt-2">
                <Activity className="h-4 w-4 text-green-200 mr-1" />
                <span className="text-green-200 text-xs">{t("liveAnnouncements")}</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{announcements.filter((item) => item.status === "published").length}</span>
            </div>
          </div>
        </div>

        {/* Categories Card */}
        <div className="group bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">{t("announcementsByCategory")}</p>
              </div>
              <p className="text-3xl font-bold text-white">{new Set(announcements.map((item) => item.category)).size}</p>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 text-purple-200 mr-1" />
                <span className="text-purple-200 text-xs">{t("contentTypes")}</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{new Set(announcements.map((item) => item.category)).size}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#EC4899] to-[#DB2777] p-2 rounded-lg mr-3">
                <PieChart className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t("announcementsByStatus")}</h3>
            </div>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("published")}</span>
              <span className="text-lg font-bold text-[#10B981]">
                {announcements.filter(a => a.status === "published").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("draft")}</span>
              <span className="text-lg font-bold text-[#F59E0B]">
                {announcements.filter(a => a.status === "draft").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("archived")}</span>
              <span className="text-lg font-bold text-[#6B7280]">
                {announcements.filter(a => a.status === "archived").length}
              </span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#06B6D4] to-[#0891B2] p-2 rounded-lg mr-3">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t("announcementsByCategory")}</h3>
            </div>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {[...new Set(announcements.map(a => a.category))].slice(0, 4).map((category, index) => {
              const count = announcements.filter(a => a.category === category).length;
              const percentage = ((count / announcements.length) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{t(category)}</span>
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

        {/* Timing Analytics */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] p-2 rounded-lg mr-3">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t("timingAnalytics")}</h3>
            </div>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("activeNow")}</span>
              <span className="text-lg font-bold text-[#10B981]">
                {announcements.filter(a => {
                  const now = new Date();
                  const publishDate = new Date(a.publish_date);
                  const expiryDate = new Date(a.expiry_date);
                  return publishDate <= now && now <= expiryDate && a.status === "published";
                }).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("upcoming")}</span>
              <span className="text-lg font-bold text-[#F59E0B]">
                {announcements.filter(a => new Date(a.publish_date) > new Date()).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("expired")}</span>
              <span className="text-lg font-bold text-[#EF4444]">
                {announcements.filter(a => new Date(a.expiry_date) < new Date()).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements Table */}
      {isLoading ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p>{t("loadingAnnouncements")}</p>
        </div>
      ) : announcements.length > 0 ? (
        <Table
          columns={columns}
          data={announcements}
          actions={true}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={handleDeleteAnnouncement}
        />
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p>{t("noAnnouncementsFound")}. {t("addFirstAnnouncement")}.</p>
        </div>
      )}

      {/* Add Announcement Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t("addAnnouncement")}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleAddAnnouncement()
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField label={t("announcementTitle")} name="title" value={formData.title} onChange={handleInputChange} required />
            <FormField
              label={t("content")}
              name="content"
              type="textarea"
              value={formData.content}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={t("publishDate")}
                name="publish_date"
                type="datetime-local"
                value={formData.publish_date ? formatDateForInput(formData.publish_date) : ""}
                onChange={handleInputChange}
                required
              />
              <FormField
                label={t("expiryDate")}
                name="expiry_date"
                type="datetime-local"
                value={formData.expiry_date ? formatDateForInput(formData.expiry_date) : ""}
                onChange={handleInputChange}
                required
              />
              <FormField
                label={t("category")}
                name="category"
                type="select"
                value={formData.category}
                onChange={handleInputChange}
                options={[
                  { value: "academic", label: t("academic") },
                  { value: "workshop", label: t("workshop") },
                  { value: "seminar", label: t("seminar") },
                  { value: "other", label: t("other") },
                ]}
                required
              />
              <FormField
                label={t("faculty")}
                name="faculty_id"
                type="select"
                value={formData.faculty_id}
                onChange={handleInputChange}
                options={faculties.map((faculty) => ({
                  value: faculty._id,
                  label: faculty.name,
                }))}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#004B87] focus:ring-[#004B87] border-gray-300 rounded"
              />
              <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                {t("featured")} {t("announcementTitle")}
              </label>
            </div>
            <FormField
              label={t("status")}
              name="status"
              type="select"
              value={formData.status}
              onChange={handleInputChange}
              options={[
                { value: "draft", label: t("draft") },
                { value: "published", label: t("published") },
                { value: "archived", label: t("archived") },
              ]}
              required
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={() => setIsAddModalOpen(false)}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
            >
              <Save size={18} className="inline mr-2" />
              {t("save")} {t("announcementTitle")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Announcement Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Announcement">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleEditAnnouncement()
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField label="Title" name="title" value={formData.title} onChange={handleInputChange} required />
            <FormField
              label="Content"
              name="content"
              type="textarea"
              value={formData.content}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Publish Date"
                name="publish_date"
                type="datetime-local"
                value={formData.publish_date ? formatDateForInput(formData.publish_date) : ""}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Expiry Date"
                name="expiry_date"
                type="datetime-local"
                value={formData.expiry_date ? formatDateForInput(formData.expiry_date) : ""}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Category"
                name="category"
                type="select"
                value={formData.category}
                onChange={handleInputChange}
                options={[
                  { value: "academic", label: "Academic" },
                  { value: "workshop", label: "Workshop" },
                  { value: "seminar", label: "Seminar" },
                  { value: "other", label: "Other" },
                ]}
                required
              />
              <FormField
                label="Faculty"
                name="faculty_id"
                type="select"
                value={formData.faculty_id}
                onChange={handleInputChange}
                options={faculties.map((faculty) => ({
                  value: faculty._id,
                  label: faculty.name,
                }))}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_featured_edit"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#004B87] focus:ring-[#004B87] border-gray-300 rounded"
              />
              <label htmlFor="is_featured_edit" className="text-sm font-medium text-gray-700">
                Feature this announcement
              </label>
            </div>
            <FormField
              label="Status"
              name="status"
              type="select"
              value={formData.status}
              onChange={handleInputChange}
              options={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
                { value: "archived", label: "Archived" },
              ]}
              required
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
            >
              <Save size={18} className="inline mr-2" />
              Update Announcement
            </button>
          </div>
        </form>
      </Modal>

      {/* View Announcement Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Announcement Details" size="lg">
        {currentAnnouncement && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentAnnouncement.title}</h3>
                {currentAnnouncement.is_featured && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Featured</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentAnnouncement.category === "academic"
                      ? "bg-blue-100 text-blue-800"
                      : currentAnnouncement.category === "workshop"
                        ? "bg-green-100 text-green-800"
                        : currentAnnouncement.category === "seminar"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {currentAnnouncement.category.charAt(0).toUpperCase() + currentAnnouncement.category.slice(1)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentAnnouncement.status === "published"
                      ? "bg-green-100 text-green-800"
                      : currentAnnouncement.status === "draft"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentAnnouncement.status.charAt(0).toUpperCase() + currentAnnouncement.status.slice(1)}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Content</h4>
              <div className="bg-white border border-gray-200 p-6 rounded-md">
                <p className="text-gray-700 whitespace-pre-line">{currentAnnouncement.content}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">Publication Period</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-500">Publish Date</p>
                  <p className="text-gray-800 mb-2">{formatDate(currentAnnouncement.publish_date)}</p>
                  <p className="text-sm font-medium text-gray-500">Expiry Date</p>
                  <p className="text-gray-800">{formatDate(currentAnnouncement.expiry_date)}</p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">Faculty</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-800">{getFacultyNameById(currentAnnouncement.faculty_id)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AnnouncementManagement
