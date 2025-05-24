import React from "react";
import { useState, useEffect, useRef } from "react";
import { Plus, Save, Upload } from "lucide-react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import FormField from "../common/FormField";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    department_id: "",
    student_id_number: "",
    enrollment_year: new Date().getFullYear(),
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
    profile_image: null,
  });

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token") || "";
  };

  // Create headers with authentication
  const createAuthHeaders = (includeContentType = true) => {
    const token = getAuthToken();
    return includeContentType
      ? {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      : {
          Authorization: `Bearer ${token}`,
        };
  };

  // Fetch students and departments when component mounts
  useEffect(() => {
    fetchStudents();
    fetchDepartments();
  }, []);

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:4400/api/v1/students/", {
        headers: createAuthHeaders(),
      });

      const result = await response.json();
      console.log("Students data:", result.data.students);

      // Log department info for debugging
      if (result.data && result.data.students) {
        result.data.students.forEach((student) => {
          console.log(
            `Student ${student.name} department:`,
            student.department_id
          );
        });
      }

      if (result.status === "success") {
        setStudents(result.data.students || []);
      } else {
        console.error("Failed to fetch students:", result.message);
        // Set sample data if API fails
        setStudents([
          {
            _id: "1",
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
            _id: "2",
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
        ]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch departments from API
  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://127.0.0.1:4400/api/v1/departments/",
        {
          headers: createAuthHeaders(),
        }
      );
      const result = await response.json();

      if (result.status === "success") {
        setDepartments(result.data.departments || []);
      } else {
        console.error("Failed to fetch departments:", result.message);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get department name by ID - Fixed to handle both string IDs and object references
  const getDepartmentNameById = (departmentId) => {
    if (!departmentId) return "Unknown Department";

    // If departmentId is an object with a name property (populated department)
    if (typeof departmentId === "object" && departmentId !== null) {
      return departmentId.name || "Unknown Department";
    }

    // If departmentId is a string (department ID reference)
    const department = departments.find((dept) => dept._id === departmentId);
    return department ? department.name : String(departmentId);
  };

  // Table columns configuration
  const columns = [
    {
      header: "Student",
      accessor: "name",
      render: (row) => (
        <div className='flex items-center'>
          <div className='w-8 h-8 rounded-full bg-gray-200 mr-3 overflow-hidden'>
            {row.profile_image ? (
              <img
                src={`http://localhost:4400/public/img/students/${row.profile_image}`}
                alt={row.name}
                className='w-full h-full object-cover'
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `/placeholder.svg?height=32&width=32&text=${row.name.charAt(
                    0
                  )}`;
                }}
              />
            ) : (
              <img
                src={`/placeholder.svg?height=32&width=32&text=${row.name.charAt(
                  0
                )}`}
                alt={row.name}
                className='w-full h-full object-cover'
              />
            )}
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
      header: "Department",
      accessor: "department_id",
      render: (row) => {
        // Ensure we're returning a string, not an object
        const deptName = getDepartmentNameById(row.department_id);
        return (
          <span>{typeof deptName === "string" ? deptName : "Unknown"}</span>
        );
      },
    },
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
          {row.status && typeof row.status === "string"
            ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
            : "Unknown"}
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profile_image: file,
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddStudent = async () => {
    try {
      setIsLoading(true);

      // Create FormData object for file upload
      const studentFormData = new FormData();

      // Add all form fields to FormData except address and profile_image
      Object.keys(formData).forEach((key) => {
        if (key !== "address" && key !== "profile_image") {
          studentFormData.append(key, formData[key]);
        }
      });

      // Handle nested address object - try different formats to ensure compatibility with backend
      // Format 1: Using bracket notation for nested objects
      studentFormData.append("address[street]", formData.address.street);
      studentFormData.append("address[city]", formData.address.city);
      studentFormData.append("address[country]", formData.address.country);

      // Format 2: Using flat keys (many backends expect this format)
      studentFormData.append("street", formData.address.street);
      studentFormData.append("city", formData.address.city);
      studentFormData.append("country", formData.address.country);

      // Add file if it exists - try with field name 'image' which is commonly used
      if (formData.profile_image instanceof File) {
        studentFormData.append("image", formData.profile_image);
      }

      // Log the FormData entries for debugging
      for (const pair of studentFormData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await fetch("http://localhost:4400/api/v1/students/", {
        method: "POST",
        headers: createAuthHeaders(false), // Don't include Content-Type for FormData
        body: studentFormData,
      });

      const result = await response.json();

      if (result.status === "success") {
        // Instead of just refreshing the list, add the new student to the state with department info
        if (result.data && result.data.student) {
          // Create a new student object with the department ID properly set
          const newStudent = {
            ...result.data.student,
            // Ensure department_id is a string if it's an object
            department_id:
              result.data.student.department_id &&
              typeof result.data.student.department_id === "object"
                ? result.data.student.department_id._id
                : result.data.student.department_id,
          };

          // Add the new student to the state
          setStudents((prevStudents) => [...prevStudents, newStudent]);
        } else {
          // If the API doesn't return the created student, fetch all students
          fetchStudents();
        }

        setIsAddModalOpen(false);
        resetForm();
        alert("Student added successfully");
      } else {
        alert(`Failed to create student: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating student:", error);
      alert("Failed to create student. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStudent = async () => {
    try {
      setIsLoading(true);

      // Create FormData object for file upload
      const studentFormData = new FormData();

      // Add all form fields to FormData except address and profile_image
      Object.keys(formData).forEach((key) => {
        if (key !== "address" && key !== "profile_image") {
          studentFormData.append(key, formData[key]);
        }
      });

      // Handle nested address object - try different formats to ensure compatibility with backend
      // Format 1: Using bracket notation for nested objects
      studentFormData.append("address[street]", formData.address.street);
      studentFormData.append("address[city]", formData.address.city);
      studentFormData.append("address[country]", formData.address.country);

      // Format 2: Using flat keys (many backends expect this format)
      studentFormData.append("street", formData.address.street);
      studentFormData.append("city", formData.address.city);
      studentFormData.append("country", formData.address.country);

      // Add file if it's a new file - try with field name 'image'
      if (formData.profile_image instanceof File) {
        studentFormData.append("image", formData.profile_image);
      }

      const response = await fetch(
        `http://localhost:4400/api/v1/students/${currentStudent._id}`,
        {
          method: "PATCH",
          headers: createAuthHeaders(false), // Don't include Content-Type for FormData
          body: studentFormData,
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        // Update the student in the state directly instead of refetching all students
        if (result.data && result.data.student) {
          setStudents((prevStudents) =>
            prevStudents.map((student) =>
              student._id === currentStudent._id ? result.data.student : student
            )
          );
        } else {
          // If the API doesn't return the updated student, fetch all students
          fetchStudents();
        }

        setIsEditModalOpen(false);
        alert("Student updated successfully");
      } else {
        alert(`Failed to update student: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      try {
        setIsLoading(true);

        const response = await fetch(
          `http://localhost:4400/api/v1/students/${student._id}`,
          {
            method: "DELETE",
            headers: createAuthHeaders(),
          }
        );

        const result = await response.json();

        if (result.status === "success") {
          // Update students state by filtering out the deleted student
          setStudents(students.filter((s) => s._id !== student._id));
          alert("Student deleted successfully");
        } else {
          alert(`Failed to delete student: ${result.message}`);
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const openEditModal = (student) => {
    setCurrentStudent(student);

    // Fix profile image preview
    if (student.profile_image) {
      setImagePreview(
        `http://localhost:4400/public/img/students/${student.profile_image}`
      );
    } else {
      setImagePreview(
        `/placeholder.svg?height=128&width=128&text=${student.name.charAt(0)}`
      );
    }

    const address = student.address || { street: "", city: "", country: "" };

    setFormData({
      ...student,
      department_id:
        typeof student.department_id === "object"
          ? student.department_id._id
          : student.department_id,
      address: {
        street: address.street || "",
        city: address.city || "",
        country: address.country || "",
      },
      profile_image: null, // prevent sending old filename as a File
    });

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
      enrollment_year: new Date().getFullYear(),
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
      profile_image: null,
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
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
          disabled={isLoading}
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
              {students.length}
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
              {" "}
              {students.filter((student) => student.gender === "Male").length}
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
              {students.filter((student) => student.gender === "Female").length}
            </p>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className='text-center py-4'>
          <p className='text-gray-600'>Loading...</p>
        </div>
      )}

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

            {/* Department Dropdown */}
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-medium mb-2'>
                Department
              </label>
              <select
                name='department_id'
                value={formData.department_id}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              >
                <option value=''>Select a Department</option>
                {departments.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

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

            {/* Profile Image Upload */}
            <div className='mb-4 col-span-2'>
              <label className='block text-gray-700 text-sm font-medium mb-2'>
                Profile Image
              </label>
              <div className='flex items-center space-x-4'>
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept='image/*'
                  className='hidden'
                  id='profile-image-upload'
                />
                <label
                  htmlFor='profile-image-upload'
                  className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer flex items-center'
                >
                  <Upload size={18} className='mr-2' />
                  Choose Image
                </label>
                {imagePreview && (
                  <div className='w-16 h-16 rounded-full overflow-hidden border border-gray-300'>
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt='Profile Preview'
                      className='w-full h-full object-cover'
                    />
                  </div>
                )}
              </div>
            </div>
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
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
              disabled={isLoading}
            >
              <Save size={18} className='inline mr-2' />
              {isLoading ? "Saving..." : "Save Student"}
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

            {/* Department Dropdown */}
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-medium mb-2'>
                Department
              </label>
              <select
                name='department_id'
                value={formData.department_id}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              >
                <option value=''>Select a Department</option>
                {departments.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

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

            {/* Profile Image Upload */}
            <div className='mb-4 col-span-2'>
              <label className='block text-gray-700 text-sm font-medium mb-2'>
                Profile Image
              </label>
              <div className='flex items-center space-x-4'>
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept='image/*'
                  className='hidden'
                  id='profile-image-edit'
                />
                <label
                  htmlFor='profile-image-edit'
                  className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer flex items-center'
                >
                  <Upload size={18} className='mr-2' />
                  {formData.profile_image ? "Change Image" : "Choose Image"}
                </label>
                {imagePreview && (
                  <div className='w-16 h-16 rounded-full overflow-hidden border border-gray-300'>
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt='Profile Preview'
                      className='w-full h-full object-cover'
                    />
                  </div>
                )}
              </div>
            </div>
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
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
              disabled={isLoading}
            >
              <Save size={18} className='inline mr-2' />
              {isLoading ? "Updating..." : "Update Student"}
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
                    {/* Using placeholder instead of server URL to avoid CORS issues */}
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
                    {currentStudent.status &&
                    typeof currentStudent.status === "string"
                      ? currentStudent.status.charAt(0).toUpperCase() +
                        currentStudent.status.slice(1)
                      : "Unknown"}
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
                      Department
                    </p>
                    <p className='text-gray-800'>
                      {typeof getDepartmentNameById(
                        currentStudent.department_id
                      ) === "string"
                        ? getDepartmentNameById(currentStudent.department_id)
                        : "Unknown Department"}
                    </p>
                  </div>
                </div>

                <h3 className='text-lg font-medium text-gray-800 mt-6 mb-4'>
                  Address
                </h3>
                <div className='bg-gray-50 p-4 rounded-md'>
                  <p className='text-gray-800'>
                    {currentStudent.address &&
                    typeof currentStudent.address === "object" ? (
                      <>
                        {currentStudent.address.street || ""},{" "}
                        {currentStudent.address.city || ""},{" "}
                        {currentStudent.address.country || ""}
                      </>
                    ) : (
                      "No address information available"
                    )}
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
