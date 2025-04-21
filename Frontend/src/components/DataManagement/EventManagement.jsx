import React from "react";

import { useState } from "react";
import { Plus, Save, Calendar } from "lucide-react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import FormField from "../common/FormField";

const EventManagement = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Ecconomic Faculty information",
      description:
        "A seminar exploring the latest trends in data science, including big data analytics, AI-powered insights, and machine learning applications.",
      date: "2024-08-05T14:00:00.000Z",
      location: "Science Hall, Lecture Room 3",
      type: "seminar",
      faculty_id: "67dc13bb658e8f78f98dcf3e",
    },
    {
      id: 2,
      title: "Economics Research Symposium",
      description:
        "Faculty of Economics will host the annual research symposium. All students and faculty members are encouraged to attend.",
      date: "2025-04-25T10:00:00.000Z",
      location: "Main Auditorium",
      type: "conference",
      faculty_id: "67dc13bb658e8f78f98dcf3e",
    },
    {
      id: 3,
      title: "Guest Lecture: International Trade",
      description:
        "A special lecture on international trade policies and their impact on developing economies.",
      date: "2025-05-02T14:00:00.000Z",
      location: "Room 201",
      type: "lecture",
      faculty_id: "67dc13bb658e8f78f98dcf3e",
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    type: "",
    faculty_id: "",
  });

  // Table columns configuration
  const columns = [
    {
      header: "Title",
      accessor: "title",
      render: (row) => (
        <div className='flex items-center'>
          <div className='w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3'>
            <Calendar size={16} />
          </div>
          <div>
            <p className='font-medium text-gray-800'>{row.title}</p>
            <p className='text-xs text-gray-500'>{row.type}</p>
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
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddEvent = () => {
    const newEvent = {
      id: events.length + 1,
      ...formData,
    };

    setEvents([...events, newEvent]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditEvent = () => {
    const updatedEvents = events.map((event) =>
      event.id === currentEvent.id ? { ...event, ...formData } : event
    );

    setEvents(updatedEvents);
    setIsEditModalOpen(false);
  };

  const handleDeleteEvent = (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      setEvents(events.filter((e) => e.id !== event.id));
    }
  };

  const openEditModal = (event) => {
    setCurrentEvent(event);
    setFormData(event);
    setIsEditModalOpen(true);
  };

  const openViewModal = (event) => {
    setCurrentEvent(event);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      type: "",
      faculty_id: "",
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date for input field
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold text-gray-800'>
          Event Management
        </h2>
        <button
          className='flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
        >
          <Plus size={18} className='mr-2' />
          Add New Event
        </button>
      </div>

      {/* Event Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-[#004B87] bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-[#004B87] font-bold'>{events.length}</span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Total Events</p>
            <p className='text-lg font-semibold text-gray-800'>
              Scheduled Events
            </p>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-[#F4B400] bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-[#F4B400] font-bold'>
              {
                events.filter((event) => new Date(event.date) > new Date())
                  .length
              }
            </span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Upcoming Events</p>
            <p className='text-lg font-semibold text-gray-800'>
              Future Schedule
            </p>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-green-500 bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-green-500 font-bold'>
              {new Set(events.map((event) => event.type)).size}
            </span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Event Types</p>
            <p className='text-lg font-semibold text-gray-800'>Categories</p>
          </div>
        </div>
      </div>

      {/* Event Table */}
      <Table
        columns={columns}
        data={events}
        actions={true}
        onView={openViewModal}
        onEdit={openEditModal}
        onDelete={handleDeleteEvent}
      />

      {/* Add Event Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title='Add New Event'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddEvent();
          }}
        >
          <div className='grid grid-cols-1 gap-4'>
            <FormField
              label='Event Title'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Description'
              name='description'
              type='textarea'
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label='Date and Time'
                name='date'
                type='datetime-local'
                value={formData.date ? formatDateForInput(formData.date) : ""}
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Location'
                name='location'
                value={formData.location}
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Event Type'
                name='type'
                type='select'
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
                label='Faculty ID'
                name='faculty_id'
                value={formData.faculty_id}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className='mt-6 flex justify-end space-x-3'>
            <button
              type='button'
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
            >
              <Save size={18} className='inline mr-2' />
              Save Event
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title='Edit Event'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditEvent();
          }}
        >
          <div className='grid grid-cols-1 gap-4'>
            <FormField
              label='Event Title'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Description'
              name='description'
              type='textarea'
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label='Date and Time'
                name='date'
                type='datetime-local'
                value={formData.date ? formatDateForInput(formData.date) : ""}
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Location'
                name='location'
                value={formData.location}
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Event Type'
                name='type'
                type='select'
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
                label='Faculty ID'
                name='faculty_id'
                value={formData.faculty_id}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className='mt-6 flex justify-end space-x-3'>
            <button
              type='button'
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
            >
              <Save size={18} className='inline mr-2' />
              Update Event
            </button>
          </div>
        </form>
      </Modal>

      {/* View Event Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title='Event Details'
      >
        {currentEvent && (
          <div className='space-y-6'>
            <div className='bg-blue-50 p-6 rounded-lg'>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                {currentEvent.title}
              </h3>
              <div className='flex flex-wrap gap-2 mb-4'>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentEvent.type === "seminar"
                      ? "bg-blue-100 text-blue-800"
                      : currentEvent.type === "conference"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {currentEvent.type.charAt(0).toUpperCase() +
                    currentEvent.type.slice(1)}
                </span>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h4 className='text-lg font-medium text-gray-800 mb-2'>
                  Date & Time
                </h4>
                <div className='bg-gray-50 p-4 rounded-md flex items-center'>
                  <Calendar size={20} className='text-[#004B87] mr-3' />
                  <p className='text-gray-800'>
                    {formatDate(currentEvent.date)}
                  </p>
                </div>
              </div>
              <div>
                <h4 className='text-lg font-medium text-gray-800 mb-2'>
                  Location
                </h4>
                <div className='bg-gray-50 p-4 rounded-md'>
                  <p className='text-gray-800'>{currentEvent.location}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-2'>
                Description
              </h4>
              <p className='text-gray-700 bg-gray-50 p-4 rounded-md'>
                {currentEvent.description}
              </p>
            </div>

            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-2'>
                Faculty
              </h4>
              <div className='bg-gray-50 p-4 rounded-md'>
                <p className='text-gray-800'>
                  Faculty ID: {currentEvent.faculty_id}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventManagement;
