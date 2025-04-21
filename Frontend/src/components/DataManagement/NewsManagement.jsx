import React from "react";

import { useState } from "react";
import { Plus, Save, Newspaper } from "lucide-react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import FormField from "../common/FormField";

const NewsManagement = () => {
  const [news, setNews] = useState([
    {
      id: 1,
      title: "New Research Breakthrough in AI",
      content:
        "The Faculty of Computer Science has achieved a significant milestone in artificial intelligence research, introducing a new deep learning model that enhances predictive accuracy.",
      publish_date: "2024-03-20T12:00:00.000Z",
      category: "research",
      faculty_id: "67dc6ac61bb58f204cd0e395",
    },
    {
      id: 2,
      title: "University Announces New Scholarship Program",
      content:
        "The university administration has announced a new scholarship program for outstanding students in all faculties, providing financial support for tuition and living expenses.",
      publish_date: "2024-04-05T09:30:00.000Z",
      category: "announcement",
      faculty_id: "67dc6ac61bb58f204cd0e395",
    },
    {
      id: 3,
      title: "Faculty of Economics Hosts International Conference",
      content:
        "The Faculty of Economics successfully hosted an international conference on sustainable economic development, with participants from over 15 countries.",
      publish_date: "2024-04-12T14:00:00.000Z",
      category: "event",
      faculty_id: "67dc6ac61bb58f204cd0e395",
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    publish_date: "",
    category: "",
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
            <Newspaper size={16} />
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
      header: "Category",
      accessor: "category",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.category === "research"
              ? "bg-blue-100 text-blue-800"
              : row.category === "announcement"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.category.charAt(0).toUpperCase() + row.category.slice(1)}
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

  const handleAddNews = () => {
    const newNews = {
      id: news.length + 1,
      ...formData,
    };

    setNews([...news, newNews]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditNews = () => {
    const updatedNews = news.map((item) =>
      item.id === currentNews.id ? { ...item, ...formData } : item
    );

    setNews(updatedNews);
    setIsEditModalOpen(false);
  };

  const handleDeleteNews = (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      setNews(news.filter((n) => n.id !== item.id));
    }
  };

  const openEditModal = (item) => {
    setCurrentNews(item);
    setFormData(item);
    setIsEditModalOpen(true);
  };

  const openViewModal = (item) => {
    setCurrentNews(item);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      publish_date: "",
      category: "",
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
        <h2 className='text-xl font-semibold text-gray-800'>News Management</h2>
        <button
          className='flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
        >
          <Plus size={18} className='mr-2' />
          Add News Article
        </button>
      </div>

      {/* News Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-[#004B87] bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-[#004B87] font-bold'>{news.length}</span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Total Articles</p>
            <p className='text-lg font-semibold text-gray-800'>News Items</p>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-[#F4B400] bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-[#F4B400] font-bold'>
              {
                news.filter(
                  (item) =>
                    new Date(item.publish_date) >
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length
              }
            </span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Last 7 Days</p>
            <p className='text-lg font-semibold text-gray-800'>Recent News</p>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-green-500 bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-green-500 font-bold'>
              {new Set(news.map((item) => item.category)).size}
            </span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>News Categories</p>
            <p className='text-lg font-semibold text-gray-800'>Categories</p>
          </div>
        </div>
      </div>

      {/* News Table */}
      <Table
        columns={columns}
        data={news}
        actions={true}
        onView={openViewModal}
        onEdit={openEditModal}
        onDelete={handleDeleteNews}
      />

      {/* Add News Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title='Add News Article'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddNews();
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
                label='Category'
                name='category'
                type='select'
                value={formData.category}
                onChange={handleInputChange}
                options={[
                  { value: "research", label: "Research" },
                  { value: "announcement", label: "Announcement" },
                  { value: "event", label: "Event" },
                  { value: "achievement", label: "Achievement" },
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
              Publish News
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit News Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title='Edit News Article'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditNews();
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
                label='Category'
                name='category'
                type='select'
                value={formData.category}
                onChange={handleInputChange}
                options={[
                  { value: "research", label: "Research" },
                  { value: "announcement", label: "Announcement" },
                  { value: "event", label: "Event" },
                  { value: "achievement", label: "Achievement" },
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
              Update News
            </button>
          </div>
        </form>
      </Modal>

      {/* View News Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title='News Article'
        size='lg'
      >
        {currentNews && (
          <div className='space-y-6'>
            <div className='bg-blue-50 p-6 rounded-lg'>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                {currentNews.title}
              </h3>
              <div className='flex flex-wrap gap-2 mb-4'>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentNews.category === "research"
                      ? "bg-blue-100 text-blue-800"
                      : currentNews.category === "announcement"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {currentNews.category.charAt(0).toUpperCase() +
                    currentNews.category.slice(1)}
                </span>
              </div>
              <p className='text-sm text-gray-500'>
                Published on {formatDate(currentNews.publish_date)}
              </p>
            </div>

            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-2'>
                Content
              </h4>
              <div className='bg-white border border-gray-200 p-6 rounded-md'>
                <p className='text-gray-700 whitespace-pre-line'>
                  {currentNews.content}
                </p>
              </div>
            </div>

            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-2'>
                Faculty
              </h4>
              <div className='bg-gray-50 p-4 rounded-md'>
                <p className='text-gray-800'>
                  Faculty ID: {currentNews.faculty_id}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NewsManagement;
