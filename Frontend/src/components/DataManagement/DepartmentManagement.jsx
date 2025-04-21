import React from "react";

import { useState } from "react";
import { Plus, Save, Layers } from "lucide-react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import FormField from "../common/FormField";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Accounting",
      description:
        "The Department of Accounting prepares students for careers in financial accounting, managerial accounting, auditing, and taxation through theoretical and practical education.",
      faculty: "60a1c2b3d4e5f6a7b8c9d0e1",
    },
    {
      id: 2,
      name: "Computer Science",
      description:
        "The Department of Computer Science offers programs in software development, artificial intelligence, data science, and cybersecurity.",
      faculty: "60a1c2b3d4e5f6a7b8c9d0e2",
    },
    {
      id: 3,
      name: "Economics",
      description:
        "The Department of Economics provides education in microeconomics, macroeconomics, international economics, and economic development.",
      faculty: "60a1c2b3d4e5f6a7b8c9d0e3",
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    faculty: "",
  });

  // Table columns configuration
  const columns = [
    {
      header: "Department Name",
      accessor: "name",
      render: (row) => (
        <div className='flex items-center'>
          <div className='w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3'>
            <Layers size={16} />
          </div>
          <p className='font-medium text-gray-800'>{row.name}</p>
        </div>
      ),
    },
    {
      header: "Description",
      accessor: "description",
      render: (row) => <p className='truncate max-w-md'>{row.description}</p>,
    },
    { header: "Faculty ID", accessor: "faculty" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddDepartment = () => {
    const newDepartment = {
      id: departments.length + 1,
      ...formData,
    };

    setDepartments([...departments, newDepartment]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditDepartment = () => {
    const updatedDepartments = departments.map((department) =>
      department.id === currentDepartment.id
        ? { ...department, ...formData }
        : department
    );

    setDepartments(updatedDepartments);
    setIsEditModalOpen(false);
  };

  const handleDeleteDepartment = (department) => {
    if (
      window.confirm(`Are you sure you want to delete "${department.name}"?`)
    ) {
      setDepartments(departments.filter((d) => d.id !== department.id));
    }
  };

  const openEditModal = (department) => {
    setCurrentDepartment(department);
    setFormData(department);
    setIsEditModalOpen(true);
  };

  const openViewModal = (department) => {
    setCurrentDepartment(department);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      faculty: "",
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold text-gray-800'>
          Department Management
        </h2>
        <button
          className='flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
        >
          <Plus size={18} className='mr-2' />
          Add New Department
        </button>
      </div>

      {/* Department Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-[#004B87] bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-[#004B87] font-bold'>
              {departments.length}
            </span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Total Departments</p>
            <p className='text-lg font-semibold text-gray-800'>
              Academic Departments
            </p>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-[#F4B400] bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-[#F4B400] font-bold'>
              {
                new Set(departments.map((department) => department.faculty))
                  .size
              }
            </span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Faculties</p>
            <p className='text-lg font-semibold text-gray-800'>
              Parent Faculties
            </p>
          </div>
        </div>
      </div>

      {/* Department Table */}
      <Table
        columns={columns}
        data={departments}
        actions={true}
        onView={openViewModal}
        onEdit={openEditModal}
        onDelete={handleDeleteDepartment}
      />

      {/* Add Department Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title='Add New Department'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddDepartment();
          }}
        >
          <div className='grid grid-cols-1 gap-4'>
            <FormField
              label='Department Name'
              name='name'
              value={formData.name}
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
            <FormField
              label='Faculty ID'
              name='faculty'
              value={formData.faculty}
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
              Save Department
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Department Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title='Edit Department'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditDepartment();
          }}
        >
          <div className='grid grid-cols-1 gap-4'>
            <FormField
              label='Department Name'
              name='name'
              value={formData.name}
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
            <FormField
              label='Faculty ID'
              name='faculty'
              value={formData.faculty}
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
              Update Department
            </button>
          </div>
        </form>
      </Modal>

      {/* View Department Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title='Department Details'
      >
        {currentDepartment && (
          <div className='space-y-6'>
            <div className='bg-blue-50 p-6 rounded-lg'>
              <h3 className='text-2xl font-bold text-gray-800 mb-4'>
                {currentDepartment.name}
              </h3>
            </div>

            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-2'>
                Description
              </h4>
              <p className='text-gray-700 bg-gray-50 p-4 rounded-md'>
                {currentDepartment.description}
              </p>
            </div>

            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-2'>
                Faculty
              </h4>
              <div className='bg-gray-50 p-4 rounded-md'>
                <p className='text-gray-800'>
                  Faculty ID: {currentDepartment.faculty}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DepartmentManagement;
