import React from "react"
import { useState, useEffect } from "react"
import {
  Plus, Save, FileText, BookOpen, Award, Users, Calendar, Clock,
  TrendingUp, Activity, Eye, Edit, Target, Star, CheckCircle,
  BarChart3, PieChart, Settings, Building2
} from "lucide-react"
import Table from "../common/Table"
import Modal from "../common/Modal"
import FormField from "../common/FormField"
import { useLanguage } from '../../contexts/LanguageContext';

const ResearchManagement = () => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ps' || language === 'dr';

  const [researches, setResearches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentResearch, setCurrentResearch] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    publication_date: "",
    file_path: "",
    pages: "",
    category: "",
    status: "pending",
    authors: "",
  })

  // Get auth token from local storage
  const getAuthToken = () => {
    return localStorage.getItem("token")
  }

  // Create headers with auth token
  const createHeaders = () => {
    const token = getAuthToken()
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    }
  }

  // Fetch researches from API
  useEffect(() => {
    const fetchResearches = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("http://localhost:4400/api/v1/research/", {
          headers: createHeaders(),
        })
        const data = await response.json()
        console.log("API Response:", data)

        if (data.status === "success" && data.data && data.data.research) {
          setResearches(data.data.research)
        } else {
          console.error("Unexpected API response structure:", data)
          setResearches([])
        }
      } catch (error) {
        console.error("Error fetching researches:", error)
        setResearches([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchResearches()
  }, [])

  // Table columns configuration
  const columns = [
    {
      header: t("researchTitle"),
      accessor: "title",
      render: (row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3">
            <FileText size={16} />
          </div>
          <div>
            <p className="font-medium text-gray-800">{row.title}</p>
            <p className="text-xs text-gray-500">{row.category}</p>
          </div>
        </div>
      ),
    },
    {
      header: t("publicationDate"),
      accessor: "publication_date",
      render: (row) => formatDate(row.publication_date),
    },
    {
      header: t("researchPages"),
      accessor: "pages",
    },
    {
      header: t("researchStatus"),
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
          {t(row.status)}
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

  const handleAddResearch = async () => {
    try {
      // Convert authors from string to array
      const authors = formData.authors ? formData.authors.split(",").map((item) => item.trim()) : []

      const payload = {
        ...formData,
        authors,
        pages: Number.parseInt(formData.pages, 10) || 0,
      }

      const response = await fetch("http://127.0.0.1:4400/api/v1/research/", {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.status === "success") {
        // Refresh the research list
        const refreshResponse = await fetch("http://127.0.0.1:4400/api/v1/research/", {
          headers: createHeaders(),
        })
        const refreshData = await refreshResponse.json()

        if (refreshData.status === "success" && refreshData.data && refreshData.data.research) {
          setResearches(refreshData.data.research)
        }

        setIsAddModalOpen(false)
        resetForm()
      } else {
        console.error("Error adding research:", data)
        alert("Failed to add research. Please try again.")
      }
    } catch (error) {
      console.error("Error adding research:", error)
      alert("Failed to add research. Please try again.")
    }
  }

  const handleEditResearch = async () => {
    try {
      // Convert authors from string to array if it's a string
      const authors =
        typeof formData.authors === "string" ? formData.authors.split(",").map((item) => item.trim()) : formData.authors

      const payload = {
        ...formData,
        authors,
        pages: Number.parseInt(formData.pages, 10) || 0,
      }

      const response = await fetch(`http://127.0.0.1:4400/api/v1/research/${currentResearch._id}`, {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.status === "success") {
        // Refresh the research list
        const refreshResponse = await fetch("http://127.0.0.1:4400/api/v1/research/", {
          headers: createHeaders(),
        })
        const refreshData = await refreshResponse.json()

        if (refreshData.status === "success" && refreshData.data && refreshData.data.research) {
          setResearches(refreshData.data.research)
        }

        setIsEditModalOpen(false)
      } else {
        console.error("Error updating research:", data)
        alert("Failed to update research. Please try again.")
      }
    } catch (error) {
      console.error("Error updating research:", error)
      alert("Failed to update research. Please try again.")
    }
  }

  const handleDeleteResearch = async (research) => {
    if (window.confirm(t('confirmDeleteResearch'))) {
      try {
        const response = await fetch(`http://127.0.0.1:4400/api/v1/research/${research._id}`, {
          method: "DELETE",
          headers: createHeaders(),
        })

        const data = await response.json()

        if (data.status === "success") {
          // Refresh the research list
          const refreshResponse = await fetch("http://127.0.0.1:4400/api/v1/research/", {
            headers: createHeaders(),
          })
          const refreshData = await refreshResponse.json()

          if (refreshData.status === "success" && refreshData.data && refreshData.data.research) {
            setResearches(refreshData.data.research)
          } else {
            // If refresh fails, just remove the deleted item from the current state
            setResearches(researches.filter((r) => r._id !== research._id))
          }
        } else {
          console.error("Error deleting research:", data)
          alert("Failed to delete research. Please try again.")
        }
      } catch (error) {
        console.error("Error deleting research:", error)
        alert("Failed to delete research. Please try again.")
      }
    }
  }

  const openEditModal = (research) => {
    // Convert authors array to string for form
    const researchData = {
      ...research,
      authors: Array.isArray(research.authors) ? research.authors.join(", ") : research.authors,
    }

    setCurrentResearch(research)
    setFormData(researchData)
    setIsEditModalOpen(true)
  }

  const openViewModal = (research) => {
    setCurrentResearch(research)
    setIsViewModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      abstract: "",
      publication_date: "",
      file_path: "",
      pages: "",
      category: "",
      status: "pending",
      authors: "",
    })
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format date for input field
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  // Count unique authors
  const countUniqueAuthors = () => {
    const allAuthors = researches.flatMap((research) =>
      Array.isArray(research.authors) ? research.authors : [research.authors],
    )
    return new Set(allAuthors.filter((author) => author)).size
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
                  {t("researchManagement")}
                </h1>
                <p className="text-white/90 text-lg">{t("manageResearchPublications")}</p>
              </div>
            </div>
            <div className="flex items-center text-white/70">
              <div className="w-2 h-2 bg-[#F4B400] rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">{t("researchPortfolio")} • {researches.length} {t("totalPublications")}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="text-right mb-3 sm:mb-0">
              <div className="text-2xl font-bold text-[#F4B400]">{researches.length}</div>
              <div className="text-white/60 text-sm">{t("totalPublications")}</div>
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
                {t("addNewResearch")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Research Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Publications Card */}
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
                <p className="text-white/80 text-sm font-medium">{t("totalPublications")}</p>
              </div>
              <p className="text-3xl font-bold text-white">{researches.length}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
                <span className="text-green-300 text-xs">{t("thisYear")}</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-[#F4B400]">{researches.length}</span>
            </div>
          </div>
        </div>

        {/* Accepted Papers Card */}
        <div className="group bg-gradient-to-br from-[#F4B400] to-[#E6A200] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#004B87] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">{t("acceptedPapers")}</p>
              </div>
              <p className="text-3xl font-bold text-white">{researches.filter((research) => research.status === "accepted").length}</p>
              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 text-white/70 mr-1" />
                <span className="text-white/70 text-xs">{t("highQualityResearch")}</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{researches.filter((research) => research.status === "accepted").length}</span>
            </div>
          </div>
        </div>

        {/* Unique Authors Card */}
        <div className="group bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">{t("uniqueAuthors")}</p>
              </div>
              <p className="text-3xl font-bold text-white">{countUniqueAuthors()}</p>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 text-green-200 mr-1" />
                <span className="text-green-200 text-xs">{t("researchCommunity")}</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{countUniqueAuthors()}</span>
            </div>
          </div>
        </div>

        {/* Research Categories Card */}
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
                <p className="text-white/80 text-sm font-medium">{t("researchAreas")}</p>
              </div>
              <p className="text-3xl font-bold text-white">{new Set(researches.map(r => r.category).filter(Boolean)).size}</p>
              <div className="flex items-center mt-2">
                <Activity className="h-4 w-4 text-purple-200 mr-1" />
                <span className="text-purple-200 text-xs">{t("diverseFields")}</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{new Set(researches.map(r => r.category).filter(Boolean)).size}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Research Status Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#EC4899] to-[#DB2777] p-2 rounded-lg mr-3">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t("researchStatusDistribution")}</h3>
            </div>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {['accepted', 'pending', 'rejected'].map((status, index) => {
              const count = researches.filter(r => r.status === status).length;
              const percentage = researches.length > 0 ? ((count / researches.length) * 100).toFixed(1) : 0;
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{t(status)}</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-gradient-to-r from-[#EC4899] to-[#DB2777] h-2 rounded-full"
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

        {/* Publication Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#06B6D4] to-[#0891B2] p-2 rounded-lg mr-3">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t("publicationTimeline")}</h3>
            </div>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Year</span>
              <span className="text-lg font-bold text-[#06B6D4]">
                {researches.filter(r => new Date(r.publication_date).getFullYear() === new Date().getFullYear()).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Year</span>
              <span className="text-lg font-bold text-[#06B6D4]">
                {researches.filter(r => new Date(r.publication_date).getFullYear() === new Date().getFullYear() - 1).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Pages</span>
              <span className="text-lg font-bold text-[#06B6D4]">
                {researches.reduce((sum, r) => sum + (parseInt(r.pages) || 0), 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Research Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] p-2 rounded-lg mr-3">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t("researchAreas")}</h3>
            </div>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {[...new Set(researches.map(r => r.category))].filter(Boolean).slice(0, 3).map((category, index) => {
              const count = researches.filter(r => r.category === category).length;
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{category}</span>
                  <span className="text-lg font-bold text-[#F59E0B]">{count}</span>
                </div>
              );
            })}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Categories</span>
              <span className="text-lg font-bold text-[#F59E0B]">
                {new Set(researches.map(r => r.category).filter(Boolean)).size}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Research Table */}
      {isLoading ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p>{t("loadingResearch")}</p>
        </div>
      ) : researches.length > 0 ? (
        <Table
          columns={columns}
          data={researches}
          actions={true}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={handleDeleteResearch}
        />
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p>{t("noResearchFound")}. {t("addFirstResearch")}.</p>
        </div>
      )}

      {/* Add Research Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t("addNewResearch")}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleAddResearch()
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField label="Title" name="title" value={formData.title} onChange={handleInputChange} required />
            <FormField
              label="Abstract"
              name="abstract"
              type="textarea"
              value={formData.abstract}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Publication Date"
                name="publication_date"
                type="date"
                value={formData.publication_date ? formatDateForInput(formData.publication_date) : ""}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Pages"
                name="pages"
                type="number"
                value={formData.pages}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Status"
                name="status"
                type="select"
                value={formData.status}
                onChange={handleInputChange}
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "accepted", label: "Accepted" },
                  { value: "rejected", label: "Rejected" },
                ]}
                required
              />

              <FormField
                label="Authors (comma separated)"
                name="authors"
                value={formData.authors}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
            >
              <Save size={18} className="inline mr-2" />
              Save Research
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Research Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Research">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleEditResearch()
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField label="Title" name="title" value={formData.title} onChange={handleInputChange} required />
            <FormField
              label="Abstract"
              name="abstract"
              type="textarea"
              value={formData.abstract}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Publication Date"
                name="publication_date"
                type="date"
                value={formData.publication_date ? formatDateForInput(formData.publication_date) : ""}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Pages"
                name="pages"
                type="number"
                value={formData.pages}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Status"
                name="status"
                type="select"
                value={formData.status}
                onChange={handleInputChange}
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "accepted", label: "Accepted" },
                  { value: "rejected", label: "Rejected" },
                ]}
                required
              />

              <FormField
                label="Authors (comma separated)"
                name="authors"
                value={formData.authors}
                onChange={handleInputChange}
                required
              />
            </div>
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
              Update Research
            </button>
          </div>
        </form>
      </Modal>

      {/* View Research Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Research Details" size="lg">
        {currentResearch && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentResearch.title}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {currentResearch.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentResearch.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : currentResearch.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {currentResearch.status.charAt(0).toUpperCase() + currentResearch.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Published on {formatDate(currentResearch.publication_date)} • {currentResearch.pages} pages
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Abstract</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{currentResearch.abstract}</p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Authors</h4>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(currentResearch.authors) ? (
                  currentResearch.authors.map((author, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {author}
                    </span>
                  ))
                ) : (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {currentResearch.authors}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">File</h4>
              <div className="bg-gray-50 p-4 rounded-md flex items-center">
                <div className="w-10 h-10 bg-blue-100 text-blue-800 rounded-md flex items-center justify-center mr-3">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Research Paper PDF</p>
                  <p className="text-sm text-gray-500">{currentResearch.file_path || "No file path available"}</p>
                </div>
                {currentResearch.file_path && (
                  <button className="ml-auto px-3 py-1 bg-[#004B87] text-white rounded-md text-sm">Download</button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ResearchManagement
