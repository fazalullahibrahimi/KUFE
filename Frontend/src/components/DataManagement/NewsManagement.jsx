import React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Plus, Save, Newspaper, ImageIcon, Eye, Star, Calendar, Clock,
  TrendingUp, Activity, Target, Award, CheckCircle,
  BarChart3, PieChart, Settings, Building2, Users
} from "lucide-react"
import Table from "../common/Table"
import Modal from "../common/Modal"
import FormField from "../common/FormField"

const NewsManagement = () => {
  const [news, setNews] = useState([])
  const [faculties, setFaculties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentNews, setCurrentNews] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    publish_date: "",
    category: "",
    faculty_id: "",
    image: null,
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

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("http://127.0.0.1:4400/api/v1/news/", {
          headers: createHeaders(),
        })
        const data = await response.json()
        console.log("API Response:", data)

        if (data.status === "success" && data.data && data.data.news) {
          setNews(data.data.news)
        } else {
          console.error("Unexpected API response structure:", data)
          setNews([])
        }
      } catch (error) {
        console.error("Error fetching news:", error)
        setNews([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
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
      header: "Title",
      accessor: "title",
      render: (row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3">
            <Newspaper size={16} />
          </div>
          <div>
            <p className="font-medium text-gray-800">{row.title}</p>
            <p className="text-xs text-gray-500">{row.category}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Publish Date",
      accessor: "publish_date",
      render: (row) => formatDate(row.publish_date),
    },
    {
      header: "Category",
      accessor: "category",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.category === "research"
              ? "bg-blue-100 text-blue-800"
              : row.category === "announcements"
                ? "bg-green-100 text-green-800"
                : row.category === "events"
                  ? "bg-yellow-100 text-yellow-800"
                  : row.category === "academic"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.category.charAt(0).toUpperCase() + row.category.slice(1)}
        </span>
      ),
    },
    {
      header: "Image",
      accessor: "image",
      render: (row) => (
        <div className="flex items-center">
          {row.image ? (
            <img
              src={`http://localhost:4400/public/img/news//${row.image}`}
              alt={row.title}
              className="w-10 h-10 object-cover rounded-md"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "https://via.placeholder.com/40?text=No+Image"
              }}
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
              <ImageIcon size={16} className="text-gray-500" />
            </div>
          )}
        </div>
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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
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

  const handleAddNews = async () => {
    try {
      const newsData = new FormData()

      // Add all form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key !== "image" || formData[key] === null) {
          newsData.append(key, formData[key])
        }
      })

      // Add image if selected
      if (selectedImage) {
        newsData.append("image", selectedImage)
      }

      const response = await fetch("http://127.0.0.1:4400/api/v1/news/", {
        method: "POST",
        headers: {
          Authorization: createHeaders().Authorization,
        },
        body: newsData,
      })

      const data = await response.json()

      if (data.status === "success") {
        // Refresh the news list
        const refreshResponse = await fetch("http://127.0.0.1:4400/api/v1/news/", {
          headers: createHeaders(),
        })
        const refreshData = await refreshResponse.json()

        if (refreshData.status === "success" && refreshData.data && refreshData.data.news) {
          setNews(refreshData.data.news)
        }

        setIsAddModalOpen(false)
        resetForm()
      } else {
        console.error("Error adding news:", data)
        alert("Failed to add news. Please try again.")
      }
    } catch (error) {
      console.error("Error adding news:", error)
      alert("Failed to add news. Please try again.")
    }
  }

  const handleEditNews = async () => {
    try {
      const newsData = new FormData()

      // Add all form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key !== "image" || formData[key] === null) {
          newsData.append(key, formData[key])
        }
      })

      // Add image if selected
      if (selectedImage) {
        newsData.append("image", selectedImage)
      }

      const response = await fetch(`http://127.0.0.1:4400/api/v1/news/${currentNews._id}`, {
        method: "PATCH",
        headers: {
          Authorization: createHeaders().Authorization,
        },
        body: newsData,
      })

      const data = await response.json()

      if (data.status === "success") {
        // Refresh the news list
        const refreshResponse = await fetch("http://127.0.0.1:4400/api/v1/news/", {
          headers: createHeaders(),
        })
        const refreshData = await refreshResponse.json()

        if (refreshData.status === "success" && refreshData.data && refreshData.data.news) {
          setNews(refreshData.data.news)
        }

        setIsEditModalOpen(false)
        resetForm()
      } else {
        console.error("Error updating news:", data)
        alert("Failed to update news. Please try again.")
      }
    } catch (error) {
      console.error("Error updating news:", error)
      alert("Failed to update news. Please try again.")
    }
  }

  const handleDeleteNews = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      try {
        const response = await fetch(`http://127.0.0.1:4400/api/v1/news/${item._id}`, {
          method: "DELETE",
          headers: createHeaders(),
        })

        const data = await response.json()

        if (data.status === "success") {
          // Refresh the news list
          const refreshResponse = await fetch("http://127.0.0.1:4400/api/v1/news/", {
            headers: createHeaders(),
          })
          const refreshData = await refreshResponse.json()

          if (refreshData.status === "success" && refreshData.data && refreshData.data.news) {
            setNews(refreshData.data.news)
          } else {
            // If refresh fails, just remove the deleted item from the current state
            setNews(news.filter((n) => n._id !== item._id))
          }
        } else {
          console.error("Error deleting news:", data)
          alert("Failed to delete news. Please try again.")
        }
      } catch (error) {
        console.error("Error deleting news:", error)
        alert("Failed to delete news. Please try again.")
      }
    }
  }

  const openEditModal = (item) => {
    setCurrentNews(item)
    setFormData({
      title: item.title || "",
      content: item.content || "",
      publish_date: item.publish_date || "",
      category: item.category || "",
      faculty_id: item.faculty_id || "",
    })

    // Set image preview if available
    if (item.image) {
      setImagePreview(`http://localhost:4400/public/img/news//${item.image}`)
    } else {
      setImagePreview(null)
    }

    setSelectedImage(null)
    setIsEditModalOpen(true)
  }

  const openViewModal = (item) => {
    setCurrentNews(item)
    setIsViewModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      publish_date: "",
      category: "",
      faculty_id: "",
    })
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
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
                <Newspaper className="h-8 w-8 text-[#F4B400]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-[#F4B400] to-white bg-clip-text text-transparent">
                  News Management
                </h1>
                <p className="text-white/90 text-lg">Manage university news and announcements</p>
              </div>
            </div>
            <div className="flex items-center text-white/70">
              <div className="w-2 h-2 bg-[#F4B400] rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">News publishing • {news.length} articles</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="text-right mb-3 sm:mb-0">
              <div className="text-2xl font-bold text-[#F4B400]">{news.length}</div>
              <div className="text-white/60 text-sm">Total Articles</div>
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
                Add News Article
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced News Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Articles Card */}
        <div className="group bg-gradient-to-br from-[#004B87] to-[#1D3D6F] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Newspaper className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">Total Articles</p>
              </div>
              <p className="text-3xl font-bold text-white">{news.length}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
                <span className="text-green-300 text-xs">+22% this month</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-[#F4B400]">{news.length}</span>
            </div>
          </div>
        </div>

        {/* Recent Articles Card */}
        <div className="group bg-gradient-to-br from-[#F4B400] to-[#E6A200] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#004B87] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">Last 7 Days</p>
              </div>
              <p className="text-3xl font-bold text-white">{news.filter((item) => new Date(item.publish_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</p>
              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 text-white/70 mr-1" />
                <span className="text-white/70 text-xs">Recent activity</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{news.filter((item) => new Date(item.publish_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</span>
            </div>
          </div>
        </div>

        {/* Categories Card */}
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
                <p className="text-white/80 text-sm font-medium">Categories</p>
              </div>
              <p className="text-3xl font-bold text-white">{new Set(news.map((item) => item.category)).size}</p>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 text-green-200 mr-1" />
                <span className="text-green-200 text-xs">Content types</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{new Set(news.map((item) => item.category)).size}</span>
            </div>
          </div>
        </div>

        {/* Published Articles Card */}
        <div className="group bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">Published</p>
              </div>
              <p className="text-3xl font-bold text-white">{news.filter(item => new Date(item.publish_date) <= new Date()).length}</p>
              <div className="flex items-center mt-2">
                <Activity className="h-4 w-4 text-purple-200 mr-1" />
                <span className="text-purple-200 text-xs">Live articles</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{news.filter(item => new Date(item.publish_date) <= new Date()).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#EC4899] to-[#DB2777] p-2 rounded-lg mr-3">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Category Distribution</h3>
            </div>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {[...new Set(news.map(n => n.category))].filter(Boolean).slice(0, 4).map((category, index) => {
              const count = news.filter(n => n.category === category).length;
              const percentage = news.length > 0 ? ((count / news.length) * 100).toFixed(1) : 0;
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{category}</span>
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

        {/* Publishing Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#06B6D4] to-[#0891B2] p-2 rounded-lg mr-3">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Publishing Timeline</h3>
            </div>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Week</span>
              <span className="text-lg font-bold text-[#06B6D4]">
                {news.filter(n => new Date(n.publish_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="text-lg font-bold text-[#06B6D4]">
                {news.filter(n => {
                  const publishDate = new Date(n.publish_date);
                  const now = new Date();
                  return publishDate.getMonth() === now.getMonth() && publishDate.getFullYear() === now.getFullYear();
                }).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Scheduled</span>
              <span className="text-lg font-bold text-[#06B6D4]">
                {news.filter(n => new Date(n.publish_date) > new Date()).length}
              </span>
            </div>
          </div>
        </div>

        {/* Content Metrics */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] p-2 rounded-lg mr-3">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Content Metrics</h3>
            </div>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">With Images</span>
              <span className="text-lg font-bold text-[#F59E0B]">
                {news.filter(n => n.image).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Categories</span>
              <span className="text-lg font-bold text-[#F59E0B]">
                {new Set(news.map(n => n.category)).size}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg per Month</span>
              <span className="text-lg font-bold text-[#F59E0B]">
                {news.length > 0 ? Math.round(news.length / Math.max(1, new Set(news.map(n => new Date(n.publish_date).getMonth())).size)) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* News Table */}
      {isLoading ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p>Loading news articles...</p>
        </div>
      ) : news.length > 0 ? (
        <Table
          columns={columns}
          data={news}
          actions={true}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={handleDeleteNews}
        />
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p>No news articles found. Add your first news article.</p>
        </div>
      )}

      {/* Add News Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add News Article">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleAddNews()
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
                label="Category"
                name="category"
                type="select"
                value={formData.category}
                onChange={handleInputChange}
                options={[
                  { value: "academic", label: "Academic" },
                  { value: "events", label: "Events" },
                  { value: "announcements", label: "Announcements" },
                  { value: "research", label: "Research" },
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

            {/* Image Upload */}
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">News Image</label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>
                </div>
                {imagePreview && (
                  <div className="h-20 w-20 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
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
              Publish News
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit News Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit News Article">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleEditNews()
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
                label="Category"
                name="category"
                type="select"
                value={formData.category}
                onChange={handleInputChange}
                options={[
                  { value: "academic", label: "Academic" },
                  { value: "events", label: "Events" },
                  { value: "announcements", label: "Announcements" },
                  { value: "research", label: "Research" },
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

            {/* Image Upload */}
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">News Image</label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>
                </div>
                {imagePreview && (
                  <div className="h-20 w-20 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
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
              Update News
            </button>
          </div>
        </form>
      </Modal>

      {/* View News Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="News Article" size="lg">
        {currentNews && (
          <div className="space-y-6">
            {/* News Image */}
            {currentNews.image && (
              <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
                <img
                  src={`http://localhost:4400/public/img/news/${currentNews.image}`}
                  alt={currentNews.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "https://via.placeholder.com/400x200?text=No+Image"
                  }}
                />
              </div>
            )}

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentNews.title}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentNews.category === "research"
                      ? "bg-blue-100 text-blue-800"
                      : currentNews.category === "announcements"
                        ? "bg-green-100 text-green-800"
                        : currentNews.category === "events"
                          ? "bg-yellow-100 text-yellow-800"
                          : currentNews.category === "academic"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {currentNews.category.charAt(0).toUpperCase() + currentNews.category.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-500">Published on {formatDate(currentNews.publish_date)}</p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Content</h4>
              <div className="bg-white border border-gray-200 p-6 rounded-md">
                <p className="text-gray-700 whitespace-pre-line">{currentNews.content}</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Faculty</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-800">{getFacultyNameById(currentNews.faculty_id)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default NewsManagement
