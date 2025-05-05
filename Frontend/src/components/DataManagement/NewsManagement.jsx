import React from "react"
import { useState, useEffect, useRef } from "react"
import { Plus, Save, Newspaper, ImageIcon } from "lucide-react"
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">News Management</h2>
        <button
          className="flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
          onClick={() => {
            resetForm()
            setIsAddModalOpen(true)
          }}
        >
          <Plus size={18} className="mr-2" />
          Add News Article
        </button>
      </div>

      {/* News Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-[#004B87] bg-opacity-10 flex items-center justify-center mr-4">
            <span className="text-[#004B87] font-bold">{news.length}</span>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Articles</p>
            <p className="text-lg font-semibold text-gray-800">{news.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-[#F4B400] bg-opacity-10 flex items-center justify-center mr-4">
            <span className="text-[#F4B400] font-bold">
              {
                news.filter((item) => new Date(item.publish_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                  .length
              }
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Last 7 Days</p>
            <p className="text-lg font-semibold text-gray-800"> {
                news.filter((item) => new Date(item.publish_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                  .length
              }</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-500 bg-opacity-10 flex items-center justify-center mr-4">
            <span className="text-green-500 font-bold">{new Set(news.map((item) => item.category)).size}</span>
          </div>
          <div>
            <p className="text-gray-500 text-sm">News Categories</p>
            <p className="text-lg font-semibold text-gray-800">{new Set(news.map((item) => item.category)).size}</p>
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
