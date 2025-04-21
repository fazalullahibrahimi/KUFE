import React from "react";

import { useState } from "react";
import { Plus, Save, Building } from "lucide-react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import FormField from "../common/FormField";

const FacultyManagement = () => {
  const [faculties, setFaculties] = useState([
    {
      id: 1,
      name: "Faculty Computer Science",
      overview:
        "The Faculty of Computer Science provides high-quality education and research opportunities in the field of computing and information technology.",
      mission:
        "To develop innovative and skilled professionals in the field of computer science through quality education and research.",
      vision:
        "To be a leading institution in computer science education and research, fostering technological advancements for societal benefits.",
      history:
        "Established in 2005, the faculty has grown to become a center of excellence, offering undergraduate and postgraduate programs in computer science.",
    },
    {
      id: 2,
      name: "Faculty of Economics",
      overview:
        "The Faculty of Economics offers comprehensive education in economic theory, policy, and analysis to prepare students for careers in business and government.",
      mission:
        "To educate students in economic principles and their application to real-world problems, fostering critical thinking and analytical skills.",
      vision:
        "To be recognized as a premier institution for economic education and research, contributing to economic development and policy formation.",
      history:
        "Founded in 1998, the faculty has established itself as a leading center for economic studies in the region.",
    },
    {
      id: 3,
      name: "Faculty of Engineering",
      overview:
        "The Faculty of Engineering provides education in various engineering disciplines, preparing students for careers in design, construction, and innovation.",
      mission:
        "To train engineers who can solve complex problems and contribute to technological advancement through practical and theoretical knowledge.",
      vision:
        "To be at the forefront of engineering education and research, producing graduates who lead innovation and sustainable development.",
      history:
        "Established in 2000, the faculty has expanded to include departments in civil, electrical, and mechanical engineering.",
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    overview: "",
    mission: "",
    vision: "",
    history: "",
  });

  // Table columns configuration
  const columns = [
    {
      header: "Faculty Name",
      accessor: "name",
      render: (row) => (
        <div className='flex items-center'>
          <div className='w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3'>
            <Building size={16} />
          </div>
          <p className='font-medium text-gray-800'>{row.name}</p>
        </div>
      ),
    },
    {
      header: "Overview",
      accessor: "overview",
      render: (row) => <p className='truncate max-w-md'>{row.overview}</p>,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddFaculty = () => {
    const newFaculty = {
      id: faculties.length + 1,
      ...formData,
    };

    setFaculties([...faculties, newFaculty]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditFaculty = () => {
    const updatedFaculties = faculties.map((faculty) =>
      faculty.id === currentFaculty.id ? { ...faculty, ...formData } : faculty
    );

    setFaculties(updatedFaculties);
    setIsEditModalOpen(false);
  };

  const handleDeleteFaculty = (faculty) => {
    if (window.confirm(`Are you sure you want to delete "${faculty.name}"?`)) {
      setFaculties(faculties.filter((f) => f.id !== faculty.id));
    }
  };

  const openEditModal = (faculty) => {
    setCurrentFaculty(faculty);
    setFormData(faculty);
    setIsEditModalOpen(true);
  };

  const openViewModal = (faculty) => {
    setCurrentFaculty(faculty);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      overview: "",
      mission: "",
      vision: "",
      history: "",
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold text-gray-800'>
          Faculty Management
        </h2>
        <button
          className='flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
        >
          <Plus size={18} className='mr-2' />
          Add New Faculty
        </button>
      </div>

      {/* Faculty Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-[#004B87] bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-[#004B87] font-bold'>{faculties.length}</span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Total Faculties</p>
            <p className='text-lg font-semibold text-gray-800'>
              Academic Units
            </p>
          </div>
        </div>
      </div>

      {/* Faculty Table */}
      <Table
        columns={columns}
        data={faculties}
        actions={true}
        onView={openViewModal}
        onEdit={openEditModal}
        onDelete={handleDeleteFaculty}
      />

      {/* Add Faculty Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title='Add New Faculty'
        size='lg'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddFaculty();
          }}
        >
          <div className='grid grid-cols-1 gap-4'>
            <FormField
              label='Faculty Name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Overview'
              name='overview'
              type='textarea'
              value={formData.overview}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Mission'
              name='mission'
              type='textarea'
              value={formData.mission}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Vision'
              name='vision'
              type='textarea'
              value={formData.vision}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='History'
              name='history'
              type='textarea'
              value={formData.history}
              onChange={handleInputChange}
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
              Save Faculty
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Faculty Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title='Edit Faculty'
        size='lg'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditFaculty();
          }}
        >
          <div className='grid grid-cols-1 gap-4'>
            <FormField
              label='Faculty Name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Overview'
              name='overview'
              type='textarea'
              value={formData.overview}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Mission'
              name='mission'
              type='textarea'
              value={formData.mission}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Vision'
              name='vision'
              type='textarea'
              value={formData.vision}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='History'
              name='history'
              type='textarea'
              value={formData.history}
              onChange={handleInputChange}
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
              Update Faculty
            </button>
          </div>
        </form>
      </Modal>

      {/* View Faculty Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title='Faculty Details'
        size='lg'
      >
        {currentFaculty && (
          <div className='space-y-6'>
            <div className='bg-blue-50 p-6 rounded-lg'>
              <h3 className='text-2xl font-bold text-gray-800 mb-4'>
                {currentFaculty.name}
              </h3>
            </div>

            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-2'>
                Overview
              </h4>
              <p className='text-gray-700 bg-gray-50 p-4 rounded-md'>
                {currentFaculty.overview}
              </p>
            </div>

            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-2'>
                Mission
              </h4>
              <p className='text-gray-700 bg-gray-50 p-4 rounded-md'>
                {currentFaculty.mission}
              </p>
            </div>

            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-2'>Vision</h4>
              <p className='text-gray-700 bg-gray-50 p-4 rounded-md'>
                {currentFaculty.vision}
              </p>
            </div>

            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-2'>
                History
              </h4>
              <p className='text-gray-700 bg-gray-50 p-4 rounded-md'>
                {currentFaculty.history}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FacultyManagement;
