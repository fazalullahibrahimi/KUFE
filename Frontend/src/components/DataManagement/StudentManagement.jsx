import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Plus, Save, Upload, Users, GraduationCap, MapPin, Calendar,
  TrendingUp, Activity, Eye, Edit, Target, Award, Building2, Clock,
  BarChart3, PieChart, Settings, Star, CheckCircle, UserCheck
} from "lucide-react";
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
    <div className='space-y-8'>
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
                <Users className="h-8 w-8 text-[#F4B400]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-[#F4B400] to-white bg-clip-text text-transparent">
                  Student Management
                </h1>
                <p className="text-white/90 text-lg">Manage student enrollment and records</p>
              </div>
            </div>
            <div className="flex items-center text-white/70">
              <div className="w-2 h-2 bg-[#F4B400] rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">Student registry • {students.length} enrolled students</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="text-right mb-3 sm:mb-0">
              <div className="text-2xl font-bold text-[#F4B400]">{students.length}</div>
              <div className="text-white/60 text-sm">Total Students</div>
            </div>
            <button
              className="group bg-white/20 hover:bg-[#F4B400] px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-[#F4B400] hover:scale-105 hover:shadow-xl flex items-center"
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              disabled={isLoading}
            >
              <Plus className="h-5 w-5 mr-2 transition-all duration-300 group-hover:text-[#004B87] text-white" />
              <span className="font-medium transition-all duration-300 group-hover:text-[#004B87] text-white">
                Add New Student
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Student Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students Card */}
        <div className="group bg-gradient-to-br from-[#004B87] to-[#1D3D6F] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">Total Students</p>
              </div>
              <p className="text-3xl font-bold text-white">{students.length}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
                <span className="text-green-300 text-xs">+25% this year</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-[#F4B400]">{students.length}</span>
            </div>
          </div>
        </div>

        {/* Male Students Card */}
        <div className="group bg-gradient-to-br from-[#F4B400] to-[#E6A200] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#004B87] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">Male Students</p>
              </div>
              <p className="text-3xl font-bold text-white">{students.filter((student) => student.gender === "Male").length}</p>
              <div className="flex items-center mt-2">
                <Award className="h-4 w-4 text-white/70 mr-1" />
                <span className="text-white/70 text-xs">{students.length > 0 ? Math.round((students.filter(s => s.gender === "Male").length / students.length) * 100) : 0}% of total</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{students.filter((student) => student.gender === "Male").length}</span>
            </div>
          </div>
        </div>

        {/* Female Students Card */}
        <div className="group bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">Female Students</p>
              </div>
              <p className="text-3xl font-bold text-white">{students.filter((student) => student.gender === "Female").length}</p>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 text-green-200 mr-1" />
                <span className="text-green-200 text-xs">{students.length > 0 ? Math.round((students.filter(s => s.gender === "Female").length / students.length) * 100) : 0}% of total</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{students.filter((student) => student.gender === "Female").length}</span>
            </div>
          </div>
        </div>

        {/* Active Students Card */}
        <div className="group bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
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
                <p className="text-white/80 text-sm font-medium">Active Students</p>
              </div>
              <p className="text-3xl font-bold text-white">{students.filter((student) => student.status === "active").length}</p>
              <div className="flex items-center mt-2">
                <Activity className="h-4 w-4 text-purple-200 mr-1" />
                <span className="text-purple-200 text-xs">Currently enrolled</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{students.filter((student) => student.status === "active").length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Enrollment Years */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#EC4899] to-[#DB2777] p-2 rounded-lg mr-3">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Enrollment Years</h3>
            </div>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {[...new Set(students.map(s => s.enrollment_year))].sort((a, b) => b - a).slice(0, 4).map((year, index) => {
              const count = students.filter(s => s.enrollment_year === year).length;
              const percentage = students.length > 0 ? ((count / students.length) * 100).toFixed(1) : 0;
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{year}</span>
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

        {/* Geographic Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#06B6D4] to-[#0891B2] p-2 rounded-lg mr-3">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Geographic Distribution</h3>
            </div>
            <Building2 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {[...new Set(students.map(s => s.address?.city).filter(Boolean))].slice(0, 4).map((city, index) => {
              const count = students.filter(s => s.address?.city === city).length;
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{city}</span>
                  <span className="text-lg font-bold text-[#06B6D4]">{count}</span>
                </div>
              );
            })}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Cities</span>
              <span className="text-lg font-bold text-[#06B6D4]">
                {new Set(students.map(s => s.address?.city).filter(Boolean)).size}
              </span>
            </div>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] p-2 rounded-lg mr-3">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Department Distribution</h3>
            </div>
            <Settings className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {departments.slice(0, 3).map((dept, index) => {
              const count = students.filter(s => {
                const deptId = typeof s.department_id === 'object' ? s.department_id._id : s.department_id;
                return deptId === dept._id;
              }).length;
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{dept.name}</span>
                  <span className="text-lg font-bold text-[#F59E0B]">{count}</span>
                </div>
              );
            })}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Departments</span>
              <span className="text-lg font-bold text-[#F59E0B]">{departments.length}</span>
            </div>
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
