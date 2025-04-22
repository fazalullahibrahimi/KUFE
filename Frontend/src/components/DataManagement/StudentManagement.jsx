import React from "react";

import { useState } from "react";
import { Plus, Save } from "lucide-react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import FormField from "../common/FormField";

const StudentManagement = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Zahra Ahmadi",
      department_id: "67de9a5e9c45e2657b66b789",
      student_id_number: "CS20230",
      enrollment_year: 2023,
      date_of_birth: "2004-03-12T00:00:00.000Z",
      gender: "Female",
      email: "zahra.ahmadi@exae.com",
      phone: "+93770012345",
      address: {
        street: "Darulaman Road",
        city: "Kabul",
        country: "Afghanistan",
      },
      status: "active",
      profile_image: "zahra-profile.jpg",
    },
    {
      id: 2,
      name: "Ahmad Rahimi",
      department_id: "67de9a5e9c45e2657b66b789",
      student_id_number: "CS20231",
      enrollment_year: 2023,
      date_of_birth: "2003-05-20T00:00:00.000Z",
      gender: "Male",
      email: "ahmad.rahimi@exae.com",
      phone: "+93770023456",
      address: {
        street: "Karte Char",
        city: "Kabul",
        country: "Afghanistan",
      },
      status: "active",
      profile_image: "ahmad-profile.jpg",
    },
    {
      id: 3,
      name: "Fatima Noori",
      department_id: "67de9a5e9c45e2657b66b790",
      student_id_number: "BUS20229",
      enrollment_year: 2022,
      date_of_birth: "2004-11-05T00:00:00.000Z",
      gender: "Female",
      email: "fatima.noori@exae.com",
      phone: "+93770034567",
      address: {
        street: "Shahr-e-Naw",
        city: "Kabul",
        country: "Afghanistan",
      },
      status: "active",
      profile_image: "fatima-profile.jpg",
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    department_id: "",
    student_id_number: "",
    enrollment_year: "",
    date_of_birth: "",
    gender: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      country: "",
    },
    status: "active",
    profile_image: "",
  });

  // Table columns configuration
  const columns = [
    {
      header: "Student",
      accessor: "name",
      render: (row) => (
        <div className='flex items-center'>
          <div className='w-8 h-8 rounded-full bg-gray-200 mr-3 overflow-hidden'>
            <img
              src={`/placeholder.svg?height=32&width=32&text=${row.name.charAt(
                0
              )}`}
              alt={row.name}
              className='w-full h-full object-cover'
            />
          </div>
          <div>
            <p className='font-medium text-gray-800'>{row.name}</p>
            <p className='text-xs text-gray-500'>{row.student_id_number}</p>
          </div>
        </div>
      ),
    },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    {
      header: "Enrollment Year",
      accessor: "enrollment_year",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested address fields
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAddStudent = () => {
    const newStudent = {
      id: students.length + 1,
      ...formData,
    };

    setStudents([...students, newStudent]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditStudent = () => {
    const updatedStudents = students.map((student) =>
      student.id === currentStudent.id ? { ...student, ...formData } : student
    );

    setStudents(updatedStudents);
    setIsEditModalOpen(false);
  };

  const handleDeleteStudent = (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      setStudents(students.filter((s) => s.id !== student.id));
    }
  };

  const openEditModal = (student) => {
    setCurrentStudent(student);
    setFormData(student);
    setIsEditModalOpen(true);
  };

  const openViewModal = (student) => {
    setCurrentStudent(student);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      department_id: "",
      student_id_number: "",
      enrollment_year: "",
      date_of_birth: "",
      gender: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        country: "",
      },
      status: "active",
      profile_image: "",
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
          Student Management
        </h2>
        <button
          className='flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
        >
          <Plus size={18} className='mr-2' />
          Add New Student
        </button>
      </div>

      {/* Student Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-[#004B87] bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-[#004B87] font-bold'>{students.length}</span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Total Students</p>
            <p className='text-lg font-semibold text-gray-800'>
              Enrolled Students
            </p>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-[#F4B400] bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-[#F4B400] font-bold'>
              {students.filter((student) => student.gender === "Male").length}
            </span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Male Students</p>
            <p className='text-lg font-semibold text-gray-800'>
              Gender Distribution
            </p>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-green-500 bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-green-500 font-bold'>
              {students.filter((student) => student.gender === "Female").length}
            </span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Female Students</p>
            <p className='text-lg font-semibold text-gray-800'>
              Gender Distribution
            </p>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <Table
        columns={columns}
        data={students}
        actions={true}
        onView={openViewModal}
        onEdit={openEditModal}
        onDelete={handleDeleteStudent}
      />

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title='Add New Student'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddStudent();
          }}
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              label='Full Name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Student ID Number'
              name='student_id_number'
              value={formData.student_id_number}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Department ID'
              name='department_id'
              value={formData.department_id}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Enrollment Year'
              name='enrollment_year'
              type='number'
              value={formData.enrollment_year}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Date of Birth'
              name='date_of_birth'
              type='date'
              value={
                formData.date_of_birth
                  ? formatDateForInput(formData.date_of_birth)
                  : ""
              }
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Gender'
              name='gender'
              type='select'
              value={formData.gender}
              onChange={handleInputChange}
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ]}
              required
            />
            <FormField
              label='Email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Phone'
              name='phone'
              value={formData.phone}
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
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "suspended", label: "Suspended" },
              ]}
              required
            />
            <FormField
              label='Profile Image'
              name='profile_image'
              value={formData.profile_image}
              onChange={handleInputChange}
            />
          </div>

          <h3 className='font-medium text-gray-800 mt-4 mb-2'>
            Address Information
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <FormField
              label='Street'
              name='address.street'
              value={formData.address.street}
              onChange={handleInputChange}
            />
            <FormField
              label='City'
              name='address.city'
              value={formData.address.city}
              onChange={handleInputChange}
            />
            <FormField
              label='Country'
              name='address.country'
              value={formData.address.country}
              onChange={handleInputChange}
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
              Save Student
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title='Edit Student'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditStudent();
          }}
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              label='Full Name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Student ID Number'
              name='student_id_number'
              value={formData.student_id_number}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Department ID'
              name='department_id'
              value={formData.department_id}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Enrollment Year'
              name='enrollment_year'
              type='number'
              value={formData.enrollment_year}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Date of Birth'
              name='date_of_birth'
              type='date'
              value={
                formData.date_of_birth
                  ? formatDateForInput(formData.date_of_birth)
                  : ""
              }
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Gender'
              name='gender'
              type='select'
              value={formData.gender}
              onChange={handleInputChange}
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ]}
              required
            />
            <FormField
              label='Email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Phone'
              name='phone'
              value={formData.phone}
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
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "suspended", label: "Suspended" },
              ]}
              required
            />
            <FormField
              label='Profile Image'
              name='profile_image'
              value={formData.profile_image}
              onChange={handleInputChange}
            />
          </div>

          <h3 className='font-medium text-gray-800 mt-4 mb-2'>
            Address Information
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <FormField
              label='Street'
              name='address.street'
              value={formData.address.street}
              onChange={handleInputChange}
            />
            <FormField
              label='City'
              name='address.city'
              value={formData.address.city}
              onChange={handleInputChange}
            />
            <FormField
              label='Country'
              name='address.country'
              value={formData.address.country}
              onChange={handleInputChange}
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
              Update Student
            </button>
          </div>
        </form>
      </Modal>

      {/* View Student Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title='Student Details'
      >
        {currentStudent && (
          <div className='space-y-4'>
            <div className='flex flex-col md:flex-row gap-6'>
              <div className='md:w-1/3'>
                <div className='bg-gray-100 rounded-lg p-4 flex flex-col items-center'>
                  <div className='w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-4'>
                    <img
                      src={`/placeholder.svg?height=128&width=128&text=${currentStudent.name.charAt(
                        0
                      )}`}
                      alt={currentStudent.name}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <h3 className='text-xl font-bold text-gray-800'>
                    {currentStudent.name}
                  </h3>
                  <p className='text-sm text-gray-500 mb-2'>
                    {currentStudent.student_id_number}
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      currentStudent.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {currentStudent.status.charAt(0).toUpperCase() +
                      currentStudent.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className='md:w-2/3'>
                <h3 className='text-lg font-medium text-gray-800 mb-4'>
                  Personal Information
                </h3>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>
                      Date of Birth
                    </p>
                    <p className='text-gray-800'>
                      {formatDate(currentStudent.date_of_birth)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Gender</p>
                    <p className='text-gray-800'>{currentStudent.gender}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Email</p>
                    <p className='text-gray-800'>{currentStudent.email}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Phone</p>
                    <p className='text-gray-800'>{currentStudent.phone}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>
                      Enrollment Year
                    </p>
                    <p className='text-gray-800'>
                      {currentStudent.enrollment_year}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>
                      Department ID
                    </p>
                    <p className='text-gray-800'>
                      {currentStudent.department_id}
                    </p>
                  </div>
                </div>

                <h3 className='text-lg font-medium text-gray-800 mt-6 mb-4'>
                  Address
                </h3>
                <div className='bg-gray-50 p-4 rounded-md'>
                  <p className='text-gray-800'>
                    {currentStudent.address.street},{" "}
                    {currentStudent.address.city},{" "}
                    {currentStudent.address.country}
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

export default StudentManagement;
