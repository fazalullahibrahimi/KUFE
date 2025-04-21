import React from "react";

import { useState } from "react";
import { Plus, Save, MessageSquare, ImportIcon } from "lucide-react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import FormField from "../common/FormField";

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Introduction to Artificial Intelligence Workshop",
      content:
        "Join us for a comprehensive workshop on AI covering machine learning, neural networks, and real-world applications.",
      publish_date: "2025-04-18T09:00:00Z",
      expiry_date: "2025-05-18T23:59:59Z",
      category: "workshop",
      faculty_id: "661f10d8f5b5ec23b87a9c1e",
      is_featured: true,
      status: "published",
    },
    {
      id: 2,
      title: "Midterm Exams Schedule Announced",
      content:
        "The midterm examination schedule for Spring 2025 has been published. Please check your respective department for details.",
      publish_date: "2025-04-15T10:30:00Z",
      expiry_date: "2025-04-30T23:59:59Z",
      category: "academic",
      faculty_id: "661f10d8f5b5ec23b87a9c1e",
      is_featured: false,
      status: "published",
    },
    {
      id: 3,
      title: "New Research Grant Opportunities",
      content:
        "The Ministry of Higher Education has announced new research grants for faculty members. Application deadline is May 15th.",
      publish_date: "2025-04-12T08:00:00Z",
      expiry_date: "2025-05-15T23:59:59Z",
      category: "opportunity",
      faculty_id: "661f10d8f5b5ec23b87a9c1e",
      is_featured: true,
      status: "published",
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    publish_date: "",
    expiry_date: "",
    category: "",
    faculty_id: "",
    is_featured: false,
    status: "draft",
  });

  // Table columns configuration
  const columns = [
    {
      header: "Title",
      accessor: "title",
      render: (row) => (
        <div className='flex items-center'>
          <div className='w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3'>
            <MessageSquare size={16} />
          </div>
          <div>
            <p className='font-medium text-gray-800'>{row.title}</p>
            <p className='text-xs text-gray-500'>{row.category}</p>
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
      header: "Expiry Date",
      accessor: "expiry_date",
      render: (row) => formatDate(row.expiry_date),
    },
    {
      header: "Featured",
      accessor: "is_featured",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.is_featured
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.is_featured ? "Featured" : "Regular"}
        </span>
      ),
    },
    {
      header: "Status",
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
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddAnnouncement = () => {
    const newAnnouncement = {
      id: announcements.length + 1,
      ...formData,
    };

    setAnnouncements([...announcements, newAnnouncement]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditAnnouncement = () => {
    const updatedAnnouncements = announcements.map((announcement) =>
      announcement.id === currentAnnouncement.id
        ? { ...announcement, ...formData }
        : announcement
    );

    setAnnouncements(updatedAnnouncements);
    setIsEditModalOpen(false);
  };

  const handleDeleteAnnouncement = (announcement) => {
    if (
      window.confirm(`Are you sure you want to delete "${announcement.title}"?`)
    ) {
      setAnnouncements(announcements.filter((a) => a.id !== announcement.id));
    }
  };

  const openEditModal = (announcement) => {
    setCurrentAnnouncement(announcement);
    setFormData(announcement);
    setIsEditModalOpen(true);
  };

  const openViewModal = (announcement) => {
    setCurrentAnnouncement(announcement);
    setIsViewModalOpen(true);
  };

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
          Announcement Management
        </h2>
        <button
          className='flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
        >
          <Plus size={18} className='mr-2' />
          Add New Announcement
        </button>
      </div>

      {/* Announcement Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-[#004B87] bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-[#004B87] font-bold'>
              {announcements.length}
            </span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Total Announcements</p>
            <p className='text-lg font-semibold text-gray-800'>
              Published Items
            </p>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-[#F4B400] bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-[#F4B400] font-bold'>
              {announcements.filter((item) => item.is_featured).length}
            </span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Featured Items</p>
            <p className='text-lg font-semibold text-gray-800'>
              Highlighted Announcements
            </p>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-green-500 bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-green-500 font-bold'>
              {new Set(announcements.map((item) => item.category)).size}
            </span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Categories</p>
            <p className='text-lg font-semibold text-gray-800'>
              Announcement Types
            </p>
          </div>
        </div>
      </div>

      {/* Announcements Table */}
      <Table
        columns={columns}
        data={announcements}
        actions={true}
        onView={openViewModal}
        onEdit={openEditModal}
        onDelete={handleDeleteAnnouncement}
      />

      {/* Add Announcement Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title='Add New Announcement'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddAnnouncement();
          }}
        >
          <div className='grid grid-cols-1 gap-4'>
            <FormField
              label='Title'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Content'
              name='content'
              type='textarea'
              value={formData.content}
              onChange={handleInputChange}
              required
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label='Publish Date'
                name='publish_date'
                type='datetime-local'
                value={
                  formData.publish_date
                    ? formatDateForInput(formData.publish_date)
                    : ""
                }
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Expiry Date'
                name='expiry_date'
                type='datetime-local'
                value={
                  formData.expiry_date
                    ? formatDateForInput(formData.expiry_date)
                    : ""
                }
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Category'
                name='category'
                type='select'
                value={formData.category}
                onChange={handleInputChange}
                options={[
                  { value: "academic", label: "Academic" },
                  { value: "event", label: "Event" },
                  { value: "workshop", label: "Workshop" },
                  { value: "opportunity", label: "Opportunity" },
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
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='is_featured'
                name='is_featured'
                checked={formData.is_featured}
                onChange={handleInputChange}
                className='h-4 w-4 text-[#004B87] focus:ring-[#004B87] border-gray-300 rounded'
              />
              <label
                htmlFor='is_featured'
                className='text-sm font-medium text-gray-700'
              >
                Feature this announcement
              </label>
            </div>
            <FormField
              label='Status'
              name='status'
              type='select'
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
              Save Announcement
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Announcement Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title='Edit Announcement'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditAnnouncement();
          }}
        >
          <div className='grid grid-cols-1 gap-4'>
            <FormField
              label='Title'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Content'
              name='content'
              type='textarea'
              value={formData.content}
              onChange={handleInputChange}
              required
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label='Publish Date'
                name='publish_date'
                type='datetime-local'
                value={
                  formData.publish_date
                    ? formatDateForInput(formData.publish_date)
                    : ""
                }
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Expiry Date'
                name='expiry_date'
                type='datetime-local'
                value={
                  formData.expiry_date
                    ? formatDateForInput(formData.expiry_date)
                    : ""
                }
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Category'
                name='category'
                type='select'
                value={formData.category}
                onChange={handleInputChange}
                options={[
                  { value: "academic", label: "Academic" },
                  { value: "event", label: "Event" },
                  { value: "workshop", label: "Workshop" },
                  { value: "opportunity", label: "Opportunity" },
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
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='is_featured_edit'
                name='is_featured'
                checked={formData.is_featured}
                onChange={handleInputChange}
                className='h-4 w-4 text-[#004B87] focus:ring-[#004B87] border-gray-300 rounded'
              />
              <label
                htmlFor='is_featured_edit'
                className='text-sm font-medium text-gray-700'
              >
                Feature this announcement
              </label>
            </div>
            <FormField
              label='Status'
              name='status'
              type='select'
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
              Update Announcement
            </button>
          </div>
        </form>
      </Modal>

      {/* View Announcement Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title='Announcement Details'
        size='lg'
      >
        {currentAnnouncement && (
          <div className='space-y-6'>
            <div className='bg-blue-50 p-6 rounded-lg'>
              <div className='flex justify-between items-start'>
                <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                  {currentAnnouncement.title}
                </h3>
                {currentAnnouncement.is_featured && (
                  <span className='px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm'>
                    Featured
                  </span>
                )}
              </div>
              <div className='flex flex-wrap gap-2 mb-4'>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentAnnouncement.category === "academic"
                      ? "bg-blue-100 text-blue-800"
                      : currentAnnouncement.category === "event"
                      ? "bg-purple-100 text-purple-800"
                      : currentAnnouncement.category === "workshop"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {currentAnnouncement.category.charAt(0).toUpperCase() +
                    currentAnnouncement.category.slice(1)}
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
                  {currentAnnouncement.status.charAt(0).toUpperCase() +
                    currentAnnouncement.status.slice(1)}
                </span>
              </div>
            </div>

            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-2'>
                Content
              </h4>
              <div className='bg-white border border-gray-200 p-6 rounded-md'>
                <p className='text-gray-700 whitespace-pre-line'>
                  {currentAnnouncement.content}
                </p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h4 className='text-lg font-medium text-gray-800 mb-2'>
                  Publication Period
                </h4>
                <div className='bg-gray-50 p-4 rounded-md'>
                  <p className='text-sm font-medium text-gray-500'>
                    Publish Date
                  </p>
                  <p className='text-gray-800 mb-2'>
                    {formatDate(currentAnnouncement.publish_date)}
                  </p>
                  <p className='text-sm font-medium text-gray-500'>
                    Expiry Date
                  </p>
                  <p className='text-gray-800'>
                    {formatDate(currentAnnouncement.expiry_date)}
                  </p>
                </div>
              </div>
              <div>
                <h4 className='text-lg font-medium text-gray-800 mb-2'>
                  Faculty
                </h4>
                <div className='bg-gray-50 p-4 rounded-md'>
                  <p className='text-gray-800'>
                    Faculty ID: {currentAnnouncement.faculty_id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AnnouncementManagement;
