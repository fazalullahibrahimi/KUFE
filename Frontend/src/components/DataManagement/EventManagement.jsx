import React from "react"
import { useState, useEffect, useRef } from "react"
import { Plus, Save, Calendar, ImageIcon } from "lucide-react"
import Table from "../common/Table"
import Modal from "../common/Modal"
import FormField from "../common/FormField"

const EventManagement = () => {
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
      header: "Title",
      accessor: "title",
      render: (row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3">
            <Calendar size={16} />
          </div>
          <div>
            <p className="font-medium text-gray-800">{row.title}</p>
            <p className="text-xs text-gray-500">{row.type}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Date",
      accessor: "date",
      render: (row) => formatDate(row.date),
    },
    { header: "Location", accessor: "location" },
    {
      header: "Type",
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
          {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
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
              src={`http://127.0.0.1:4400/uploads/${row.image}`}
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
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
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
      setImagePreview(`http://127.0.0.1:4400/uploads/${event.image}`)
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Event Management</h2>
        <button
          className="flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors"
          onClick={() => {
            resetForm()
            setIsAddModalOpen(true)
          }}
        >
          <Plus size={18} className="mr-2" />
          Add New Event
        </button>
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-[#004B87] bg-opacity-10 flex items-center justify-center mr-4">
            <span className="text-[#004B87] font-bold">{events.length}</span>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Events</p>
            <p className="text-lg font-semibold text-gray-800">Scheduled Events</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-[#F4B400] bg-opacity-10 flex items-center justify-center mr-4">
            <span className="text-[#F4B400] font-bold">
              {events.filter((event) => new Date(event.date) > new Date()).length}
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Upcoming Events</p>
            <p className="text-lg font-semibold text-gray-800">Future Schedule</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-500 bg-opacity-10 flex items-center justify-center mr-4">
            <span className="text-green-500 font-bold">{new Set(events.map((event) => event.type)).size}</span>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Event Types</p>
            <p className="text-lg font-semibold text-gray-800">Categories</p>
          </div>
        </div>
      </div>

      {/* Event Table */}
      {isLoading ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p>Loading events...</p>
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
          <p>No events found. Add your first event.</p>
        </div>
      )}

      {/* Add Event Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Event">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleAddEvent()
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField label="Event Title" name="title" value={formData.title} onChange={handleInputChange} required />
            <FormField
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Date and Time"
                name="date"
                type="datetime-local"
                value={formData.date ? formatDateForInput(formData.date) : ""}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Event Type"
                name="type"
                type="select"
                value={formData.type}
                onChange={handleInputChange}
                options={[
                  { value: "seminar", label: "Seminar" },
                  { value: "conference", label: "Conference" },
                  { value: "lecture", label: "Lecture" },
                  { value: "workshop", label: "Workshop" },
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
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
              Save Event
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Event Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Event">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleEditEvent()
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField label="Event Title" name="title" value={formData.title} onChange={handleInputChange} required />
            <FormField
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Date and Time"
                name="date"
                type="datetime-local"
                value={formData.date ? formatDateForInput(formData.date) : ""}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Event Type"
                name="type"
                type="select"
                value={formData.type}
                onChange={handleInputChange}
                options={[
                  { value: "seminar", label: "Seminar" },
                  { value: "conference", label: "Conference" },
                  { value: "lecture", label: "Lecture" },
                  { value: "workshop", label: "Workshop" },
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
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
              Update Event
            </button>
          </div>
        </form>
      </Modal>

      {/* View Event Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Event Details">
        {currentEvent && (
          <div className="space-y-6">
            {/* Event Image */}
            {currentEvent.image && (
              <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
                <img
                  src={`http://127.0.0.1:4400/uploads/${currentEvent.image}`}
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
                  {currentEvent.type.charAt(0).toUpperCase() + currentEvent.type.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">Date & Time</h4>
                <div className="bg-gray-50 p-4 rounded-md flex items-center">
                  <Calendar size={20} className="text-[#004B87] mr-3" />
                  <p className="text-gray-800">{formatDate(currentEvent.date)}</p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">Location</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-800">{currentEvent.location}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Description</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{currentEvent.description}</p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Faculty</h4>
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
