import React from "react";
import { useState, useEffect } from "react";
import {
  Search, Plus, Users, Award, CheckCircle, Building2,
  TrendingUp, Activity, Eye, Edit, Target, Star,
  BarChart3, PieChart, Settings, Calendar, Clock, UserCheck
} from "lucide-react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import FormField from "../common/FormField";
import { useLanguage } from "../../contexts/LanguageContext";

const CommitteeMemberManagement = () => {
  const { t } = useLanguage();
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    userId: "",
    department: "",
    academicRank: "",
    committeePosition: "",
    email: "",
    phoneNumber: "",
  });

  // Get auth token from local storage
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Create headers with auth token
  const createHeaders = () => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // Fetch committee members, departments and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const headers = createHeaders();

        // Fetch users
        const usersResponse = await fetch(
          "http://localhost:4400/api/v1/user/justNameOfComiteeMembers",
          {
            headers,
          }
        );
        const usersData = await usersResponse.json();
        console.log("Users data:", usersData);
        setUsers(usersData);

        // Fetch departments
        const departmentsResponse = await fetch(
          "http://localhost:4400/api/v1/departments/",
          {
            headers,
          }
        );
        const departmentsData = await departmentsResponse.json();
        console.log("Departments data:", departmentsData);
        setDepartments(departmentsData.data.departments);

        // Fetch committee members
        try {
          const committeeMembersResponse = await fetch(
            "http://127.0.0.1:4400/api/v1/committee-members/",
            {
              headers,
            }
          );
          const committeeMembersData = await committeeMembersResponse.json();
          console.log("Committee members data:", committeeMembersData);

          if (
            committeeMembersData &&
            committeeMembersData.data &&
            committeeMembersData.data.committeeMembers &&
            Array.isArray(committeeMembersData.data.committeeMembers)
          ) {
            setCommitteeMembers(committeeMembersData.data.committeeMembers);
          } else if (
            committeeMembersData &&
            committeeMembersData.data &&
            Array.isArray(committeeMembersData.data)
          ) {
            setCommitteeMembers(committeeMembersData.data);
          } else {
            console.warn(
              "Committee members data structure is not as expected:",
              committeeMembersData
            );
            setCommitteeMembers([]);
          }
        } catch (error) {
          console.error("Error fetching committee members:", error);
          setCommitteeMembers([]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};

    if (!formData.userId) errors.userId = "User is required";
    if (!formData.department) errors.department = "Department is required";
    if (!formData.academicRank)
      errors.academicRank = "Academic rank is required";
    if (!formData.committeePosition)
      errors.committeePosition = "Committee position is required";

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\+?\d{10,15}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number (10-15 digits)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      userId: "",
      department: "",
      academicRank: "",
      committeePosition: "",
      email: "",
      phoneNumber: "",
    });
    setFormErrors({});
  };

  // Handle add committee member
  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch(
        "http://127.0.0.1:4400/api/v1/committee-members/",
        {
          method: "POST",
          headers: createHeaders(),
          body: JSON.stringify({
            userId: formData.userId,
            department: formData.department,
            academicRank: formData.academicRank,
            committeePosition: formData.committeePosition,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Add member response:", data);

        // Refresh the committee members list
        const refreshResponse = await fetch(
          "http://127.0.0.1:4400/api/v1/committee-members/",
          {
            headers: createHeaders(),
          }
        );
        const refreshData = await refreshResponse.json();

        if (
          refreshData &&
          refreshData.data &&
          refreshData.data.committeeMembers &&
          Array.isArray(refreshData.data.committeeMembers)
        ) {
          setCommitteeMembers(refreshData.data.committeeMembers);
        } else if (
          refreshData &&
          refreshData.data &&
          Array.isArray(refreshData.data)
        ) {
          setCommitteeMembers(refreshData.data);
        }

        setIsAddModalOpen(false);
        resetForm();
      } else {
        const errorData = await response.json();
        console.error("Error adding committee member:", errorData);
      }
    } catch (error) {
      console.error("Error adding committee member:", error);
    }
  };

  // Handle edit committee member
  const handleEditMember = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:4400/api/v1/committee-members/${selectedMember._id}`,
        {
          method: "PATCH",
          headers: createHeaders(),
          body: JSON.stringify({
            userId: formData.userId,
            department: formData.department,
            academicRank: formData.academicRank,
            committeePosition: formData.committeePosition,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
          }),
        }
      );

      if (response.ok) {
        // Refresh the committee members list
        const refreshResponse = await fetch(
          "http://127.0.0.1:4400/api/v1/committee-members/",
          {
            headers: createHeaders(),
          }
        );
        const refreshData = await refreshResponse.json();

        if (
          refreshData &&
          refreshData.data &&
          refreshData.data.committeeMembers &&
          Array.isArray(refreshData.data.committeeMembers)
        ) {
          setCommitteeMembers(refreshData.data.committeeMembers);
        } else if (
          refreshData &&
          refreshData.data &&
          Array.isArray(refreshData.data)
        ) {
          setCommitteeMembers(refreshData.data);
        }

        setIsEditModalOpen(false);
        resetForm();
      } else {
        const errorData = await response.json();
        console.error("Error updating committee member:", errorData);
      }
    } catch (error) {
      console.error("Error updating committee member:", error);
    }
  };

  // Handle delete committee member
  const handleDeleteMember = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:4400/api/v1/committee-members/${selectedMember._id}`,
        {
          method: "DELETE",
          headers: createHeaders(),
        }
      );

      if (response.ok) {
        // Refresh the committee members list
        const refreshResponse = await fetch(
          "http://127.0.0.1:4400/api/v1/committee-members/",
          {
            headers: createHeaders(),
          }
        );
        const refreshData = await refreshResponse.json();

        if (
          refreshData &&
          refreshData.data &&
          refreshData.data.committeeMembers &&
          Array.isArray(refreshData.data.committeeMembers)
        ) {
          setCommitteeMembers(refreshData.data.committeeMembers);
        } else if (
          refreshData &&
          refreshData.data &&
          Array.isArray(refreshData.data)
        ) {
          setCommitteeMembers(refreshData.data);
        }

        setIsDeleteModalOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Error deleting committee member:", errorData);
      }
    } catch (error) {
      console.error("Error deleting committee member:", error);
    }
  };

  // Open edit modal and populate form
  const openEditModal = (member) => {
    console.log("Opening edit modal with member:", member);

    // Store the selected member
    setSelectedMember(member);

    // Get the user ID from the member
    let userId = "";
    if (
      member.userId &&
      typeof member.userId === "object" &&
      member.userId._id
    ) {
      userId = member.userId._id;
    } else if (typeof member.userId === "string") {
      userId = member.userId;
    }

    // Get the department ID from the member
    let departmentId = "";
    if (
      member.department &&
      typeof member.department === "object" &&
      member.department._id
    ) {
      departmentId = member.department._id;
    } else if (typeof member.department === "string") {
      departmentId = member.department;
    }

    console.log(
      "Setting form data with userId:",
      userId,
      "and departmentId:",
      departmentId
    );

    // Set the form data
    setFormData({
      userId: userId,
      department: departmentId,
      academicRank: member.academicRank || "",
      committeePosition: member.committeePosition || "",
      email: member.email || "",
      phoneNumber: member.phoneNumber || "",
    });

    setIsEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (member) => {
    setSelectedMember(member);
    setIsViewModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (member) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  // Filter committee members based on search term
  const filteredMembers = Array.isArray(committeeMembers)
    ? committeeMembers.filter((member) => {
        const searchString = searchTerm.toLowerCase();
        return (
          (member.userId?.fullName || "")
            .toLowerCase()
            .includes(searchString) ||
          (member.email || "").toLowerCase().includes(searchString) ||
          (member.academicRank || "").toLowerCase().includes(searchString) ||
          (member.committeePosition || "")
            .toLowerCase()
            .includes(searchString) ||
          (member.department?.name || "").toLowerCase().includes(searchString)
        );
      })
    : [];

  // Table columns configuration
  const columns = [
    {
      header: "Name",
      accessor: "userId.fullName",
      render: (row) => row.userId?.fullName || "N/A",
    },
    {
      header: "Department",
      accessor: "department.name",
      render: (row) => row.department?.name || "N/A",
    },
    {
      header: "Academic Rank",
      accessor: "academicRank",
    },
    {
      header: "Committee Position",
      accessor: "committeePosition",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Phone",
      accessor: "phoneNumber",
    },
  ];

  // Debug function to check if a user is selected in the dropdown
  const debugUserSelection = () => {
    console.log("Current formData.userId:", formData.userId);
    console.log("Available users:", users);
    const selectedUser = users.find((user) => user._id === formData.userId);
    console.log("Selected user:", selectedUser);
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
                  {t("Committee Member Management")}
                </h1>
                <p className="text-white/90 text-lg">{t("Manage committee members, their roles, and contact information")}</p>
              </div>
            </div>
            <div className="flex items-center text-white/70">
              <div className="w-2 h-2 bg-[#F4B400] rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">Committee governance • {committeeMembers.length} members</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="text-right mb-3 sm:mb-0">
              <div className="text-2xl font-bold text-[#F4B400]">{committeeMembers.length}</div>
              <div className="text-white/60 text-sm">Total Members</div>
            </div>
            <button
              className="group bg-white/20 hover:bg-[#F4B400] px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-[#F4B400] hover:scale-105 hover:shadow-xl flex items-center"
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
            >
              <Plus className="h-5 w-5 mr-2 transition-all duration-300 group-hover:text-[#004B87] text-white" />
              <span className="font-medium transition-all duration-300 group-hover:text-[#004B87] text-white">
                {t("Add Committee Member")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Committee Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Members Card */}
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
                <p className="text-white/80 text-sm font-medium">Total Members</p>
              </div>
              <p className="text-3xl font-bold text-white">{committeeMembers.length}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
                <span className="text-green-300 text-xs">+10% this year</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-[#F4B400]">{committeeMembers.length}</span>
            </div>
          </div>
        </div>

        {/* Academic Ranks Card */}
        <div className="group bg-gradient-to-br from-[#F4B400] to-[#E6A200] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#004B87] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">Academic Ranks</p>
              </div>
              <p className="text-3xl font-bold text-white">{new Set(committeeMembers.map(m => m.academicRank)).size}</p>
              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 text-white/70 mr-1" />
                <span className="text-white/70 text-xs">Diverse expertise</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{new Set(committeeMembers.map(m => m.academicRank)).size}</span>
            </div>
          </div>
        </div>

        {/* Committee Positions Card */}
        <div className="group bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
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
                <p className="text-white/80 text-sm font-medium">Committee Positions</p>
              </div>
              <p className="text-3xl font-bold text-white">{new Set(committeeMembers.map(m => m.committeePosition)).size}</p>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 text-green-200 mr-1" />
                <span className="text-green-200 text-xs">Leadership roles</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{new Set(committeeMembers.map(m => m.committeePosition)).size}</span>
            </div>
          </div>
        </div>

        {/* Departments Card */}
        <div className="group bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">Departments</p>
              </div>
              <p className="text-3xl font-bold text-white">{new Set(committeeMembers.map(m => m.department?.name).filter(Boolean)).size}</p>
              <div className="flex items-center mt-2">
                <Activity className="h-4 w-4 text-purple-200 mr-1" />
                <span className="text-purple-200 text-xs">Cross-departmental</span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{new Set(committeeMembers.map(m => m.department?.name).filter(Boolean)).size}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Academic Rank Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#EC4899] to-[#DB2777] p-2 rounded-lg mr-3">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Academic Ranks</h3>
            </div>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {[...new Set(committeeMembers.map(m => m.academicRank))].filter(Boolean).slice(0, 4).map((rank, index) => {
              const count = committeeMembers.filter(m => m.academicRank === rank).length;
              const percentage = committeeMembers.length > 0 ? ((count / committeeMembers.length) * 100).toFixed(1) : 0;
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{rank}</span>
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

        {/* Committee Positions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#06B6D4] to-[#0891B2] p-2 rounded-lg mr-3">
                <PieChart className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Committee Positions</h3>
            </div>
            <UserCheck className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {[...new Set(committeeMembers.map(m => m.committeePosition))].filter(Boolean).slice(0, 4).map((position, index) => {
              const count = committeeMembers.filter(m => m.committeePosition === position).length;
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{position}</span>
                  <span className="text-lg font-bold text-[#06B6D4]">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] p-2 rounded-lg mr-3">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Contact Coverage</h3>
            </div>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">With Email</span>
              <span className="text-lg font-bold text-[#F59E0B]">
                {committeeMembers.filter(m => m.email).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">With Phone</span>
              <span className="text-lg font-bold text-[#F59E0B]">
                {committeeMembers.filter(m => m.phoneNumber).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Complete Profiles</span>
              <span className="text-lg font-bold text-[#F59E0B]">
                {committeeMembers.filter(m => m.email && m.phoneNumber && m.academicRank && m.committeePosition).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
          <div className='relative w-full md:w-96'>
            <input
              type='text'
              placeholder={t("Search committee members...")}
              className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent transition-all duration-300'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className='absolute left-3 top-3.5 text-gray-400' size={18} />
          </div>
        </div>

        {/* Committee Members Table */}
        {isLoading ? (
          <div className='bg-white p-8 rounded-lg shadow text-center'>
            <p>{t("Loading committee members...")}</p>
          </div>
        ) : filteredMembers.length > 0 ? (
          <Table
            columns={columns}
            data={filteredMembers}
            actions={true}
            onView={openViewModal}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        ) : (
          <div className='bg-white p-8 rounded-lg shadow text-center'>
            <p>
              {searchTerm
                ? t("No committee members found matching your search.")
                : t(
                    "No committee members found. Add your first committee member."
                  )}
            </p>
          </div>
        )}
      </div>

      {/* Add Committee Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={t("Add Committee Member")}
      >
        <form onSubmit={handleAddMember}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              label={t("User")}
              name='userId'
              type='select'
              value={formData.userId}
              onChange={handleInputChange}
              options={users.map((user) => ({
                value: user._id,
                label: user.fullName,
              }))}
              required
              error={formErrors.userId}
            />
            <FormField
              label={t("Department")}
              name='department'
              type='select'
              value={formData.department}
              onChange={handleInputChange}
              options={departments.map((dept) => ({
                value: dept._id,
                label: dept.name,
              }))}
              required
              error={formErrors.department}
            />
            <FormField
              label={t("Academic Rank")}
              name='academicRank'
              type='text'
              value={formData.academicRank}
              onChange={handleInputChange}
              placeholder='Enter academic rank'
              required
              error={formErrors.academicRank}
            />
            <FormField
              label={t("Committee Position")}
              name='committeePosition'
              type='text'
              value={formData.committeePosition}
              onChange={handleInputChange}
              placeholder='Enter committee position'
              required
              error={formErrors.committeePosition}
            />
            <FormField
              label={t("Email")}
              name='email'
              type='email'
              value={formData.email}
              onChange={handleInputChange}
              placeholder='example@university.edu'
              required
              error={formErrors.email}
            />
            <FormField
              label={t("Phone Number")}
              name='phoneNumber'
              type='tel'
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder='+1234567890'
              required
              error={formErrors.phoneNumber}
            />
          </div>
          <div className='flex justify-end gap-3 mt-6'>
            <button
              type='button'
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              onClick={() => setIsAddModalOpen(false)}
            >
              {t("Cancel")}
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003b6a]'
            >
              {t("Add Committee Member")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Committee Member Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={t("Edit Committee Member")}
        onOpen={debugUserSelection} // Debug when modal opens
      >
        <form onSubmit={handleEditMember}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              label={t("User")}
              name='userId'
              type='select'
              value={formData.userId}
              onChange={handleInputChange}
              options={users.map((user) => ({
                value: user._id,
                label: user.fullName,
              }))}
              required
              error={formErrors.userId}
            />
            <FormField
              label={t("Department")}
              name='department'
              type='select'
              value={formData.department}
              onChange={handleInputChange}
              options={departments.map((dept) => ({
                value: dept._id,
                label: dept.name,
              }))}
              required
              error={formErrors.department}
            />
            <FormField
              label={t("Academic Rank")}
              name='academicRank'
              type='text'
              value={formData.academicRank}
              onChange={handleInputChange}
              placeholder='Enter academic rank'
              required
              error={formErrors.academicRank}
            />
            <FormField
              label={t("Committee Position")}
              name='committeePosition'
              type='text'
              value={formData.committeePosition}
              onChange={handleInputChange}
              placeholder='Enter committee position'
              required
              error={formErrors.committeePosition}
            />
            <FormField
              label={t("Email")}
              name='email'
              type='email'
              value={formData.email}
              onChange={handleInputChange}
              placeholder='example@university.edu'
              required
              error={formErrors.email}
            />
            <FormField
              label={t("Phone Number")}
              name='phoneNumber'
              type='tel'
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder='+1234567890'
              required
              error={formErrors.phoneNumber}
            />
          </div>
          <div className='flex justify-end gap-3 mt-6'>
            <button
              type='button'
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              onClick={() => setIsEditModalOpen(false)}
            >
              {t("Cancel")}
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003b6a]'
            >
              {t("Update Committee Member")}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Committee Member Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={t("Committee Member Details")}
      >
        {selectedMember && (
          <div className='space-y-4'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-medium text-lg mb-2'>
                {selectedMember.userId?.fullName || "N/A"}
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-500'>{t("Department")}</p>
                  <p>{selectedMember.department?.name || "N/A"}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>{t("Academic Rank")}</p>
                  <p>{selectedMember.academicRank}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>
                    {t("Committee Position")}
                  </p>
                  <p>{selectedMember.committeePosition}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>{t("Email")}</p>
                  <p>{selectedMember.email}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>{t("Phone Number")}</p>
                  <p>{selectedMember.phoneNumber}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>{t("Member Since")}</p>
                  <p>
                    {new Date(selectedMember.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className='flex justify-end'>
              <button
                className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
                onClick={() => setIsViewModalOpen(false)}
              >
                {t("Close")}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t("Confirm Deletion")}
      >
        <div className='p-4'>
          <p className='mb-4'>
            {t("Are you sure you want to delete this committee member?")}
            {selectedMember && (
              <span className='font-medium'>
                {" "}
                {selectedMember.userId?.fullName || t("This member")}
              </span>
            )}
            ?
          </p>
          <p className='text-red-500 mb-4'>
            {t("This action cannot be undone.")}
          </p>
          <div className='flex justify-end gap-3'>
            <button
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              onClick={() => setIsDeleteModalOpen(false)}
            >
              {t("Cancel")}
            </button>
            <button
              className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
              onClick={handleDeleteMember}
            >
              {t("Delete")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CommitteeMemberManagement;
