import React from "react";
import { useState } from "react";
import { Plus, Save, FileText } from "lucide-react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import FormField from "../common/FormField";

const ResearchManagement = () => {
  const [researches, setResearches] = useState([
    {
      id: 1,
      title: "Machine Learning Applications in Renewable Energy Forecasting",
      abstract:
        "This research explores the use of machine learning models to predict renewable energy output such as solar and wind, improving energy grid efficiency.",
      publication_date: "2025-04-18T00:00:00.000Z",
      file_path: "/uploads/research/ml-renewable-energy.pdf",
      pages: 18,
      category: "Energy and Environment",
      status: "accepted",
      authors: ["Dr. Ahmad Ahmadi", "Dr. Sarah Johnson"],
    },
    {
      id: 2,
      title: "Economic Impact of Agricultural Development in Kandahar",
      abstract:
        "This study analyzes the economic effects of agricultural development initiatives in Kandahar province, focusing on job creation and GDP growth.",
      publication_date: "2025-04-10T00:00:00.000Z",
      file_path: "/uploads/research/kandahar-agriculture.pdf",
      pages: 24,
      category: "Economics",
      status: "accepted",
      authors: ["Dr. Ahmad Ahmadi", "Dr. Sarah Johnson"],
    },
    {
      id: 3,
      title: "Financial Market Analysis: Trends and Opportunities",
      abstract:
        "An examination of current financial market trends with a focus on emerging markets and investment opportunities in developing economies.",
      publication_date: "2025-03-28T00:00:00.000Z",
      file_path: "/uploads/research/financial-markets.pdf",
      pages: 32,
      category: "Finance",
      status: "accepted",
      authors: ["Prof. Mohammad Karimi"],
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentResearch, setCurrentResearch] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    publication_date: "",
    file_path: "",
    pages: "",
    category: "",
    status: "pending",
    authors: "",
  });

  // Table columns configuration
  const columns = [
    {
      header: "Title",
      accessor: "title",
      render: (row) => (
        <div className='flex items-center'>
          <div className='w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3'>
            <FileText size={16} />
          </div>
          <div>
            <p className='font-medium text-gray-800'>{row.title}</p>
            <p className='text-xs text-gray-500'>{row.category}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Publication Date",
      accessor: "publication_date",
      render: (row) => formatDate(row.publication_date),
    },
    {
      header: "Pages",
      accessor: "pages",
    },
    {
      header: "Status",
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
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
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

  const handleAddResearch = () => {
    // Convert authors from string to array
    const authors = formData.authors
      ? formData.authors.split(",").map((item) => item.trim())
      : [];

    const newResearch = {
      id: researches.length + 1,
      ...formData,
      authors,
    };

    setResearches([...researches, newResearch]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditResearch = () => {
    // Convert authors from string to array if it's a string
    const authors =
      typeof formData.authors === "string"
        ? formData.authors.split(",").map((item) => item.trim())
        : formData.authors;

    const updatedResearches = researches.map((research) =>
      research.id === currentResearch.id
        ? { ...research, ...formData, authors }
        : research
    );

    setResearches(updatedResearches);
    setIsEditModalOpen(false);
  };

  const handleDeleteResearch = (research) => {
    if (
      window.confirm(`Are you sure you want to delete "${research.title}"?`)
    ) {
      setResearches(researches.filter((r) => r.id !== research.id));
    }
  };

  const openEditModal = (research) => {
    // Convert authors array to string for form
    const researchData = {
      ...research,
      authors: Array.isArray(research.authors)
        ? research.authors.join(", ")
        : research.authors,
    };

    setCurrentResearch(research);
    setFormData(researchData);
    setIsEditModalOpen(true);
  };

  const openViewModal = (research) => {
    setCurrentResearch(research);
    setIsViewModalOpen(true);
  };

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
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format date for input field
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold text-gray-800'>
          Research Management
        </h2>
        <button
          className='flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
        >
          <Plus size={18} className='mr-2' />
          Add New Research
        </button>
      </div>

      {/* Research Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-[#004B87] bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-[#004B87] font-bold'>
              {researches.length}
            </span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Total Publications</p>
            <p className='text-lg font-semibold text-gray-800'>
              Research Papers
            </p>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-[#F4B400] bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-[#F4B400] font-bold'>
              {
                researches.filter((research) => research.status === "accepted")
                  .length
              }
            </span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Accepted Papers</p>
            <p className='text-lg font-semibold text-gray-800'>
              Published Research
            </p>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-green-500 bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-green-500 font-bold'>
              {new Set(researches.flatMap((research) => research.authors)).size}
            </span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Unique Authors</p>
            <p className='text-lg font-semibold text-gray-800'>Contributors</p>
          </div>
        </div>
      </div>

      {/* Research Table */}
      <Table
        columns={columns}
        data={researches}
        actions={true}
        onView={openViewModal}
        onEdit={openEditModal}
        onDelete={handleDeleteResearch}
      />

      {/* Add Research Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title='Add New Research'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddResearch();
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
              label='Abstract'
              name='abstract'
              type='textarea'
              value={formData.abstract}
              onChange={handleInputChange}
              required
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label='Publication Date'
                name='publication_date'
                type='date'
                value={
                  formData.publication_date
                    ? formatDateForInput(formData.publication_date)
                    : ""
                }
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Pages'
                name='pages'
                type='number'
                value={formData.pages}
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Category'
                name='category'
                value={formData.category}
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Status'
                name='status'
                type='select'
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
                label='File Path'
                name='file_path'
                value={formData.file_path}
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Authors (comma separated)'
                name='authors'
                value={formData.authors}
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
              Save Research
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Research Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title='Edit Research'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditResearch();
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
              label='Abstract'
              name='abstract'
              type='textarea'
              value={formData.abstract}
              onChange={handleInputChange}
              required
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label='Publication Date'
                name='publication_date'
                type='date'
                value={
                  formData.publication_date
                    ? formatDateForInput(formData.publication_date)
                    : ""
                }
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Pages'
                name='pages'
                type='number'
                value={formData.pages}
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Category'
                name='category'
                value={formData.category}
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Status'
                name='status'
                type='select'
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
                label='File Path'
                name='file_path'
                value={formData.file_path}
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Authors (comma separated)'
                name='authors'
                value={formData.authors}
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
              Update Research
            </button>
          </div>
        </form>
      </Modal>

      {/* View Research Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title='Research Details'
        size='lg'
      >
        {currentResearch && (
          <div className='space-y-6'>
            <div className='bg-blue-50 p-6 rounded-lg'>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                {currentResearch.title}
              </h3>
              <div className='flex flex-wrap gap-2 mb-4'>
                <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'>
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
                  {currentResearch.status.charAt(0).toUpperCase() +
                    currentResearch.status.slice(1)}
                </span>
              </div>
              <p className='text-sm text-gray-500'>
                Published on {formatDate(currentResearch.publication_date)} •{" "}
                {currentResearch.pages} pages
              </p>
            </div>

            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-2'>
                Abstract
              </h4>
              <p className='text-gray-700 bg-gray-50 p-4 rounded-md'>
                {currentResearch.abstract}
              </p>
            </div>

            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-2'>
                Authors
              </h4>
              <div className='flex flex-wrap gap-2'>
                {Array.isArray(currentResearch.authors) ? (
                  currentResearch.authors.map((author, index) => (
                    <span
                      key={index}
                      className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'
                    >
                      {author}
                    </span>
                  ))
                ) : (
                  <span className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'>
                    {currentResearch.authors}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-2'>File</h4>
              <div className='bg-gray-50 p-4 rounded-md flex items-center'>
                <div className='w-10 h-10 bg-blue-100 text-blue-800 rounded-md flex items-center justify-center mr-3'>
                  <FileText size={20} />
                </div>
                <div>
                  <p className='font-medium text-gray-800'>
                    Research Paper PDF
                  </p>
                  <p className='text-sm text-gray-500'>
                    {currentResearch.file_path}
                  </p>
                </div>
                <button className='ml-auto px-3 py-1 bg-[#004B87] text-white rounded-md text-sm'>
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ResearchManagement;
