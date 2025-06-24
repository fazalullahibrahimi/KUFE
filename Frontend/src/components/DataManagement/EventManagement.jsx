import React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Plus, Save, Calendar, ImageIcon, Clock, MapPin, Users, Star,
  TrendingUp, Activity, Eye, Edit, Target, Award, CheckCircle,
  BarChart3, PieChart, Settings, Building2
} from "lucide-react"
import Table from "../common/Table"
import Modal from "../common/Modal"
import FormField from "../common/FormField"
import { useLanguage } from '../../contexts/LanguageContext';

const EventManagement = () => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ps' || language === 'dr';

  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentEvent, setCurrentEvent] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const [faculties, setFaculties] = useState([])


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    type: "",
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


  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("http://127.0.0.1:4400/api/v1/events/", {
          headers: createHeaders(),
        })
        const data = await response.json()
        console.log("API Response:", data)

        if (data.status === "success" && data.data && data.data.events) {
          setEvents(data.data.events)
        } else {
          console.error("Unexpected API response structure:", data)
          setEvents([])
        }
      } catch (error) {
        console.error("Error fetching events:", error)
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
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
      header: t("eventTitle"),
      accessor: "title",
      render: (row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3">
            <Calendar size={16} />
          </div>
          <div>
            <p className="font-medium text-gray-800">{row.title}</p>
            <p className="text-xs text-gray-500">{t(row.type)}</p>
          </div>
        </div>
      ),
    },
    {
      header: t("eventDate"),
      accessor: "date",
      render: (row) => formatDate(row.date),
    },
    { header: t("eventLocation"), accessor: "location" },
    {
      header: t("eventType"),
      accessor: "type",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.type === "seminar"
              ? "bg-blue-100 text-blue-800"
              : row.type === "conference"
                ? "bg-purple-100 text-purple-800"
                : "bg-green-100 text-green-800"
          }`}
        >
          {t(row.type)}
        </span>
      ),
    },
    {
      header: t("eventImage"),
      accessor: "image",
      render: (row) => (
        <div className="flex items-center">
          {row.image ? (
            <img
              src={`http://localhost:4400/public/img/event/${row.image}`}
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

  const handleAddEvent = async () => {
    try {
      const eventData = new FormData()

      // Add all form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key !== "image" || formData[key] === null) {
          eventData.append(key, formData[key])
        }
      })

      // Add image if selected
      if (selectedImage) {
        eventData.append("image", selectedImage)
      }

      const response = await fetch("http://127.0.0.1:4400/api/v1/events/", {
        method: "POST",
        headers: {
          Authorization: createHeaders().Authorization,
        },
        body: eventData,
      })

      const data = await response.json()

      if (data.status === "success") {
        // Refresh the events list
        const refreshResponse = await fetch("http://127.0.0.1:4400/api/v1/events/", {
          headers: createHeaders(),
        })
        const refreshData = await refreshResponse.json()

        if (refreshData.status === "success" && refreshData.data && refreshData.data.events) {
          setEvents(refreshData.data.events)
        }

        setIsAddModalOpen(false)
        resetForm()
      } else {
        console.error("Error adding event:", data)
        alert("Failed to add event. Please try again.")
      }
    } catch (error) {
      console.error("Error adding event:", error)
      alert("Failed to add event. Please try again.")
    }
  }

  const handleEditEvent = async () => {
    try {
      const eventData = new FormData()

      // Add all form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key !== "image" || formData[key] === null) {
          eventData.append(key, formData[key])
        }
      })

      // Add image if selected
      if (selectedImage) {
        eventData.append("image", selectedImage)
      }

      const response = await fetch(`http://127.0.0.1:4400/api/v1/events/${currentEvent._id}`, {
        method: "PATCH",
        headers: {
          Authorization: createHeaders().Authorization,
        },
        body: eventData,
      })

      const data = await response.json()

      if (data.status === "success") {
        // Refresh the events list
        const refreshResponse = await fetch("http://127.0.0.1:4400/api/v1/events/", {
          headers: createHeaders(),
        })
        const refreshData = await refreshResponse.json()

        if (refreshData.status === "success" && refreshData.data && refreshData.data.events) {
          setEvents(refreshData.data.events)
        }

        setIsEditModalOpen(false)
        resetForm()
      } else {
        console.error("Error updating event:", data)
        alert("Failed to update event. Please try again.")
      }
    } catch (error) {
      console.error("Error updating event:", error)
      alert("Failed to update event. Please try again.")
    }
  }

  const handleDeleteEvent = async (event) => {
    if (window.confirm(t('confirmDeleteEvent'))) {
      try {
        const response = await fetch(`http://127.0.0.1:4400/api/v1/events/${event._id}`, {
          method: "DELETE",
          headers: createHeaders(),
        })

        const data = await response.json()

        if (data.status === "success") {
          // Refresh the events list
          const refreshResponse = await fetch("http://127.0.0.1:4400/api/v1/events/", {
            headers: createHeaders(),
          })
          const refreshData = await refreshResponse.json()

          if (refreshData.status === "success" && refreshData.data && refreshData.data.events) {
            setEvents(refreshData.data.events)
          } else {
            // If refresh fails, just remove the deleted item from the current state
            setEvents(events.filter((e) => e._id !== event._id))
          }
        } else {
          console.error("Error deleting event:", data)
          alert("Failed to delete event. Please try again.")
        }
      } catch (error) {
        console.error("Error deleting event:", error)
        alert("Failed to delete event. Please try again.")
      }
    }
  }

  const openEditModal = (event) => {
    setCurrentEvent(event)
    setFormData({
      title: event.title || "",
      description: event.description || "",
      date: event.date || "",
      location: event.location || "",
      type: event.type || "",
      faculty_id: event.faculty_id || "",
    })

    // Set image preview if available
    if (event.image) {
      setImagePreview(`http://localhost:4400/public/img/event/${event.image}`)
    } else {
      setImagePreview(null)
    }

    setSelectedImage(null)
    setIsEditModalOpen(true)
  }

  const openViewModal = (event) => {
    setCurrentEvent(event)
    setIsViewModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      type: "",
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
                <Calendar className="h-8 w-8 text-[#F4B400]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-[#F4B400] to-white bg-clip-text text-transparent">
                  {t("eventsManagement")}
                </h1>
                <p className="text-white/90 text-lg">{t("manageEvents")}</p>
              </div>
            </div>
            <div className="flex items-center text-white/70">
              <div className="w-2 h-2 bg-[#F4B400] rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">{t("eventPortfolio")} • {events.length} {t("totalEvents")}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="text-right mb-3 sm:mb-0">
              <div className="text-2xl font-bold text-[#F4B400]">{events.length}</div>
              <div className="text-white/60 text-sm">{t("totalEvents")}</div>
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
                {t("addNewEvent")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Event Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Events Card */}
        <div className="group bg-gradient-to-br from-[#004B87] to-[#1D3D6F] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">{t("totalEvents")}</p>
              </div>
              <p className="text-3xl font-bold text-white">{events.length}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
                <span className="text-green-300 text-xs">{t("thisYear")}</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-[#F4B400]">{events.length}</span>
            </div>
          </div>
        </div>

        {/* Upcoming Events Card */}
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
                <p className="text-white/80 text-sm font-medium">{t("upcomingEvents")}</p>
              </div>
              <p className="text-3xl font-bold text-white">{events.filter((event) => new Date(event.date) > new Date()).length}</p>
              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 text-white/70 mr-1" />
                <span className="text-white/70 text-xs">{t("eventSchedule")}</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{events.filter((event) => new Date(event.date) > new Date()).length}</span>
            </div>
          </div>
        </div>

        {/* Event Types Card */}
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
                <p className="text-white/80 text-sm font-medium">{t("eventsByType")}</p>
              </div>
              <p className="text-3xl font-bold text-white">{new Set(events.map((event) => event.type)).size}</p>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 text-green-200 mr-1" />
                <span className="text-green-200 text-xs">{t("diverseFields")}</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{new Set(events.map((event) => event.type)).size}</span>
            </div>
          </div>
        </div>

        {/* Locations Card */}
        <div className="group bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">{t("eventsByLocation")}</p>
              </div>
              <p className="text-3xl font-bold text-white">{new Set(events.map((event) => event.location)).size}</p>
              <div className="flex items-center mt-2">
                <Building2 className="h-4 w-4 text-purple-200 mr-1" />
                <span className="text-purple-200 text-xs">{t("eventCapacity")}</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{new Set(events.map((event) => event.location)).size}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Event Types Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#EC4899] to-[#DB2777] p-2 rounded-lg mr-3">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t("eventsByType")}</h3>
            </div>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {[...new Set(events.map(e => e.type))].filter(Boolean).slice(0, 4).map((type, index) => {
              const count = events.filter(e => e.type === type).length;
              const percentage = events.length > 0 ? ((count / events.length) * 100).toFixed(1) : 0;
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{t(type)}</span>
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

        {/* Event Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#06B6D4] to-[#0891B2] p-2 rounded-lg mr-3">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t("eventSchedule")}</h3>
            </div>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("pastEvents")}</span>
              <span className="text-lg font-bold text-[#06B6D4]">
                {events.filter(e => new Date(e.date) < new Date()).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("thisMonth")}</span>
              <span className="text-lg font-bold text-[#06B6D4]">
                {events.filter(e => {
                  const eventDate = new Date(e.date);
                  const now = new Date();
                  return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
                }).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("nextMonth")}</span>
              <span className="text-lg font-bold text-[#06B6D4]">
                {events.filter(e => {
                  const eventDate = new Date(e.date);
                  const nextMonth = new Date();
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  return eventDate.getMonth() === nextMonth.getMonth() && eventDate.getFullYear() === nextMonth.getFullYear();
                }).length}
              </span>
            </div>
          </div>
        </div>

        {/* Event Locations */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] p-2 rounded-lg mr-3">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t("popularLocations")}</h3>
            </div>
            <Settings className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {[...new Set(events.map(e => e.location))].filter(Boolean).slice(0, 4).map((location, index) => {
              const count = events.filter(e => e.location === location).length;
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{location}</span>
                  <span className="text-lg font-bold text-[#F59E0B]">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Table */}
      {isLoading ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p>{t("loadingEvents")}</p>
        </div>
      ) : events.length > 0 ? (
        <Table
          columns={columns}
          data={events}
          actions={true}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={handleDeleteEvent}
        />
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p>{t("noEventsFound")}. {t("addFirstEvent")}.</p>
        </div>
      )}

      {/* Add Event Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t("addNewEvent")}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleAddEvent()
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField label={t("eventTitle")} name="title" value={formData.title} onChange={handleInputChange} required />
            <FormField
              label={t("eventDescription")}
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={t("eventDate")}
                name="date"
                type="datetime-local"
                value={formData.date ? formatDateForInput(formData.date) : ""}
                onChange={handleInputChange}
                required
              />
              <FormField
                label={t("eventLocation")}
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
              <FormField
                label={t("eventType")}
                name="type"
                type="select"
                value={formData.type}
                onChange={handleInputChange}
                options={[
                  { value: "seminar", label: t("seminar") },
                  { value: "conference", label: t("conference") },
                  { value: "lecture", label: "Lecture" },
                  { value: "workshop", label: t("workshop") },
                  { value: "other", label: t("other") },
                ]}
                required
              />
              <FormField
                label={t("eventFaculty")}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("eventImage")}</label>
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
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
            >
              <Save size={18} className="inline mr-2" />
              {t("saveEvent")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Event Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={t("editEvent")}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleEditEvent()
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField label={t("eventTitle")} name="title" value={formData.title} onChange={handleInputChange} required />
            <FormField
              label={t("eventDescription")}
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={t("eventDate")}
                name="date"
                type="datetime-local"
                value={formData.date ? formatDateForInput(formData.date) : ""}
                onChange={handleInputChange}
                required
              />
              <FormField
                label={t("eventLocation")}
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
              <FormField
                label={t("eventType")}
                name="type"
                type="select"
                value={formData.type}
                onChange={handleInputChange}
                options={[
                  { value: "seminar", label: t("seminar") },
                  { value: "conference", label: t("conference") },
                  { value: "lecture", label: "Lecture" },
                  { value: "workshop", label: t("workshop") },
                  { value: "other", label: t("other") },
                ]}
                required
              />
              <FormField
                label={t("eventFaculty")}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("eventImage")}</label>
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
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
            >
              <Save size={18} className="inline mr-2" />
              {t("updateEvent")}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Event Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={t("eventDetails")}>
        {currentEvent && (
          <div className="space-y-6">
            {/* Event Image */}
            {currentEvent.image && (
              <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
                <img
                  src={`http://localhost:4400/public/img/event/${currentEvent.image}`}
                  alt={currentEvent.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "https://via.placeholder.com/400x200?text=No+Image"
                  }}
                />
              </div>
            )}

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentEvent.title}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentEvent.type === "seminar"
                      ? "bg-blue-100 text-blue-800"
                      : currentEvent.type === "conference"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {t(currentEvent.type)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">{t("eventDate")}</h4>
                <div className="bg-gray-50 p-4 rounded-md flex items-center">
                  <Calendar size={20} className="text-[#004B87] mr-3" />
                  <p className="text-gray-800">{formatDate(currentEvent.date)}</p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">{t("eventLocation")}</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-800">{currentEvent.location}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">{t("eventDescription")}</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{currentEvent.description}</p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">{t("eventFaculty")}</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-800">
                  {faculties.find((f) => f._id === currentEvent.faculty_id)?.name ||
                    `Faculty ID: ${currentEvent.faculty_id}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default EventManagement
