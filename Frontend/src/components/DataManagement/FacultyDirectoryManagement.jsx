import React from "react";

import { useState, useEffect } from "react";
import {
  Plus,
  Save,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  X,
  List,
  LayoutGrid,
} from "lucide-react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import FormField from "../common/FormField";

const FacultyDirectoryManagement = () => {
  // Sample faculty data (would be fetched from API in production)
  const [facultyMembers, setFacultyMembers] = useState([
    {
      id: 1,
      name: "Dr. Ahmad Ahmadi",
      position: "Professor",
      department_id: "60a1c2b3d4e5f6a7b8c9d0e1",
      department_name: "Economics",
      contact_info: {
        email: "ahmad.ahmadi@kufe.edu",
        phone: "+93 70 123 4567",
        office: "Main Building, Room 201",
      },
      profile: {
        bio: "Dr. Ahmad Ahmadi is a professor of Economics with over 15 years of experience in research and teaching. His work focuses on macroeconomic policy and development economics in emerging markets. He has published extensively in international journals and has served as a consultant for various international organizations.",
        education: [
          {
            degree: "PhD in Economics",
            institution: "University of Oxford",
            year: 2008,
          },
          {
            degree: "Master's in Economics",
            institution: "Kabul University",
            year: 2003,
          },
          {
            degree: "Bachelor's in Economics",
            institution: "Kabul University",
            year: 2001,
          },
        ],
        research_interests: [
          "Macroeconomics",
          "Development Economics",
          "International Trade",
        ],
        publications: [
          "Economic Growth in Developing Nations (2022)",
          "Fiscal Policy and Inflation: A Case Study (2020)",
          "International Trade Patterns in Central Asia (2018)",
        ],
      },
      image: "ahmad-ahmadi.jpg",
      featured: true,
      status: "active",
    },
    {
      id: 2,
      name: "Dr. Fatima Noori",
      position: "Associate Professor",
      department_id: "60a1c2b3d4e5f6a7b8c9d0e2",
      department_name: "Computer Science",
      contact_info: {
        email: "fatima.noori@kufe.edu",
        phone: "+93 70 234 5678",
        office: "Science Building, Room 105",
      },
      profile: {
        bio: "Dr. Fatima Noori specializes in Computer Science with a focus on artificial intelligence and machine learning. She leads the AI Research Lab at KUFE and has developed several innovative algorithms for data analysis and pattern recognition. Her work has been recognized with multiple awards and grants.",
        education: [
          {
            degree: "PhD in Computer Science",
            institution: "Stanford University",
            year: 2012,
          },
          {
            degree: "Master's in Computer Science",
            institution: "Kabul University",
            year: 2007,
          },
          {
            degree: "Bachelor's in Computer Science",
            institution: "Kabul University",
            year: 2005,
          },
        ],
        research_interests: [
          "Artificial Intelligence",
          "Machine Learning",
          "Data Science",
        ],
        publications: [
          "Neural Networks for Natural Language Processing (2023)",
          "Machine Learning Applications in Healthcare (2021)",
          "Data Mining Techniques for Educational Data (2019)",
        ],
      },
      image: "fatima-noori.jpg",
      featured: true,
      status: "active",
    },
    {
      id: 3,
      name: "Prof. Mohammad Karimi",
      position: "Assistant Professor",
      department_id: "60a1c2b3d4e5f6a7b8c9d0e3",
      department_name: "Finance",
      contact_info: {
        email: "mohammad.karimi@kufe.edu",
        phone: "+93 70 345 6789",
        office: "Business Building, Room 302",
      },
      profile: {
        bio: "Prof. Mohammad Karimi is an expert in Finance and Banking with extensive industry experience. Before joining academia, he worked for 10 years in the banking sector, holding senior positions in risk management and investment analysis. His practical knowledge enriches his teaching and research.",
        education: [
          {
            degree: "PhD in Finance",
            institution: "London School of Economics",
            year: 2015,
          },
          {
            degree: "MBA",
            institution: "American University of Afghanistan",
            year: 2010,
          },
          {
            degree: "Bachelor's in Business Administration",
            institution: "Kabul University",
            year: 2005,
          },
        ],
        research_interests: [
          "Banking",
          "Financial Markets",
          "Investment Analysis",
        ],
        publications: [
          "Risk Management in Islamic Banking (2022)",
          "Investment Strategies in Emerging Markets (2020)",
          "Financial Inclusion in Developing Economies (2018)",
        ],
      },
      image: "mohammad-karimi.jpg",
      featured: false,
      status: "active",
    },
    {
      id: 4,
      name: "Dr. Sarah Johnson",
      position: "Visiting Professor",
      department_id: "60a1c2b3d4e5f6a7b8c9d0e1",
      department_name: "Economics",
      contact_info: {
        email: "sarah.johnson@kufe.edu",
        phone: "+93 70 456 7890",
        office: "Main Building, Room 205",
      },
      profile: {
        bio: "Dr. Sarah Johnson is a visiting professor from the University of Cambridge, specializing in international economics and trade policy. She brings a global perspective to KUFE and is involved in collaborative research projects with local faculty members.",
        education: [
          {
            degree: "PhD in Economics",
            institution: "University of Cambridge",
            year: 2010,
          },
          {
            degree: "Master's in International Economics",
            institution: "London School of Economics",
            year: 2006,
          },
          {
            degree: "Bachelor's in Economics",
            institution: "University of Manchester",
            year: 2004,
          },
        ],
        research_interests: [
          "International Economics",
          "Trade Policy",
          "Economic Development",
        ],
        publications: [
          "Global Trade Patterns and Economic Growth (2021)",
          "Trade Agreements and Their Impact on Developing Nations (2019)",
          "Economic Integration in South Asia (2017)",
        ],
      },
      image: "sarah-johnson.jpg",
      featured: false,
      status: "active",
    },
    {
      id: 5,
      name: "Dr. Ali Hassan",
      position: "Associate Professor",
      department_id: "60a1c2b3d4e5f6a7b8c9d0e4",
      department_name: "Mathematics",
      contact_info: {
        email: "ali.hassan@kufe.edu",
        phone: "+93 70 567 8901",
        office: "Science Building, Room 203",
      },
      profile: {
        bio: "Dr. Ali Hassan specializes in applied mathematics and statistical modeling. His research focuses on developing mathematical models for solving real-world problems in economics, engineering, and environmental science. He is passionate about making mathematics accessible and relevant to students.",
        education: [
          {
            degree: "PhD in Applied Mathematics",
            institution: "ETH Zurich",
            year: 2013,
          },
          {
            degree: "Master's in Mathematics",
            institution: "Technical University of Munich",
            year: 2009,
          },
          {
            degree: "Bachelor's in Mathematics",
            institution: "Kabul University",
            year: 2007,
          },
        ],
        research_interests: [
          "Applied Mathematics",
          "Statistical Modeling",
          "Mathematical Economics",
        ],
        publications: [
          "Mathematical Models for Economic Forecasting (2022)",
          "Statistical Analysis of Environmental Data (2020)",
          "Optimization Techniques in Resource Allocation (2018)",
        ],
      },
      image: "ali-hassan.jpg",
      featured: false,
      status: "active",
    },
  ]);

  // State for management interface
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState(null);
  const [activeTab, setActiveTab] = useState("management"); // management or preview
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department_id: "",
    department_name: "",
    contact_info: {
      email: "",
      phone: "",
      office: "",
    },
    profile: {
      bio: "",
      education: [
        {
          degree: "",
          institution: "",
          year: "",
        },
      ],
      research_interests: [],
      publications: [],
    },
    image: "default-faculty.jpg",
    featured: false,
    status: "active",
  });

  // State for directory preview
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedFacultyPreview, setSelectedFacultyPreview] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Get unique departments and positions for filters
  const departments = [
    ...new Set(facultyMembers.map((faculty) => faculty.department_name)),
  ].sort();
  const positions = [
    ...new Set(facultyMembers.map((faculty) => faculty.position)),
  ].sort();

  // Table columns configuration for management view
  const columns = [
    {
      header: "Faculty Member",
      accessor: "name",
      render: (row) => (
        <div className='flex items-center'>
          <div className='w-10 h-10 rounded-full overflow-hidden mr-3'>
            <img
              src={`/placeholder.svg?height=40&width=40&text=${row.name.charAt(
                0
              )}`}
              alt={row.name}
              className='w-full h-full object-cover'
            />
          </div>
          <div>
            <p className='font-medium text-gray-800'>{row.name}</p>
            <p className='text-xs text-gray-500'>{row.position}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Department",
      accessor: "department_name",
    },
    {
      header: "Contact",
      accessor: "contact_info",
      render: (row) => (
        <div>
          <p className='text-sm text-gray-800'>{row.contact_info.email}</p>
          <p className='text-xs text-gray-500'>{row.contact_info.phone}</p>
        </div>
      ),
    },
    {
      header: "Featured",
      accessor: "featured",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.featured
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.featured ? "Featured" : "Standard"}
        </span>
      ),
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

  // Filter faculty members for preview
  useEffect(() => {
    let result = facultyMembers.filter(
      (faculty) => faculty.status === "active"
    );

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (faculty) =>
          faculty.name.toLowerCase().includes(term) ||
          faculty.department_name.toLowerCase().includes(term) ||
          faculty.position.toLowerCase().includes(term) ||
          faculty.profile.research_interests.some((interest) =>
            interest.toLowerCase().includes(term)
          )
      );
    }

    // Apply department filter
    if (selectedDepartment !== "all") {
      result = result.filter(
        (faculty) => faculty.department_name === selectedDepartment
      );
    }

    // Apply position filter
    if (selectedPosition !== "all") {
      result = result.filter(
        (faculty) => faculty.position === selectedPosition
      );
    }

    setFilteredFaculty(result);
  }, [searchTerm, selectedDepartment, selectedPosition, facultyMembers]);

  // Form handling functions
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle nested fields
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle education array changes
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.profile.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: field === "year" ? Number(value) : value,
    };

    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        education: updatedEducation,
      },
    });
  };

  // Add new education entry
  const addEducation = () => {
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        education: [
          ...formData.profile.education,
          {
            degree: "",
            institution: "",
            year: "",
          },
        ],
      },
    });
  };

  // Remove education entry
  const removeEducation = (index) => {
    const updatedEducation = [...formData.profile.education];
    updatedEducation.splice(index, 1);

    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        education: updatedEducation,
      },
    });
  };

  // Handle publications array changes
  const handlePublicationsChange = (e) => {
    const publications = e.target.value
      .split("\n")
      .filter((item) => item.trim() !== "");
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        publications,
      },
    });
  };

  // Handle research interests (comma-separated string to array)
  const handleResearchInterestsChange = (e) => {
    const interests = e.target.value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        research_interests: interests,
      },
    });
  };

  // CRUD operations
  const handleAddFaculty = () => {
    const newFaculty = {
      id: facultyMembers.length + 1,
      ...formData,
    };

    setFacultyMembers([...facultyMembers, newFaculty]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditFaculty = () => {
    const updatedFacultyMembers = facultyMembers.map((member) =>
      member.id === currentFaculty.id ? { ...member, ...formData } : member
    );

    setFacultyMembers(updatedFacultyMembers);
    setIsEditModalOpen(false);
  };

  const handleDeleteFaculty = (faculty) => {
    if (window.confirm(`Are you sure you want to delete ${faculty.name}?`)) {
      setFacultyMembers(facultyMembers.filter((m) => m.id !== faculty.id));
    }
  };

  const openEditModal = (faculty) => {
    // Convert research interests array to comma-separated string for the form
    const facultyData = {
      ...faculty,
      profile: {
        ...faculty.profile,
        research_interests: faculty.profile.research_interests.join(", "),
      },
    };

    setCurrentFaculty(faculty);
    setFormData(facultyData);
    setIsEditModalOpen(true);
  };

  const openViewModal = (faculty) => {
    setCurrentFaculty(faculty);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      department_id: "",
      department_name: "",
      contact_info: {
        email: "",
        phone: "",
        office: "",
      },
      profile: {
        bio: "",
        education: [
          {
            degree: "",
            institution: "",
            year: "",
          },
        ],
        research_interests: [],
        publications: [],
      },
      image: "default-faculty.jpg",
      featured: false,
      status: "active",
    });
  };

  // Preview functions
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("all");
    setSelectedPosition("all");
  };

  const openProfileModal = (faculty) => {
    setSelectedFacultyPreview(faculty);
    setIsProfileModalOpen(true);
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold text-gray-800'>
          Faculty Directory Management
        </h2>
        <div className='flex space-x-2'>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "management"
                ? "bg-[#004B87] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab("management")}
          >
            Management
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "preview"
                ? "bg-[#004B87] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab("preview")}
          >
            Directory Preview
          </button>
        </div>
      </div>

      {activeTab === "management" ? (
        <>
          {/* Management View */}
          <div className='flex justify-between items-center'>
            <div className='flex items-center space-x-2'>
              <h3 className='text-lg font-medium text-gray-800'>
                Faculty Members
              </h3>
              <span className='bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs'>
                {facultyMembers.length} total
              </span>
            </div>
            <button
              className='flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
            >
              <Plus size={18} className='mr-2' />
              Add New Faculty Member
            </button>
          </div>

          {/* Faculty Stats */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <div className='bg-white rounded-lg shadow p-6 flex items-center'>
              <div className='w-12 h-12 rounded-full bg-[#004B87] bg-opacity-10 flex items-center justify-center mr-4'>
                <span className='text-[#004B87] font-bold'>
                  {facultyMembers.length}
                </span>
              </div>
              <div>
                <p className='text-gray-500 text-sm'>Total Faculty</p>
                <p className='text-lg font-semibold text-gray-800'>
                  Academic Staff
                </p>
              </div>
            </div>

            <div className='bg-white rounded-lg shadow p-6 flex items-center'>
              <div className='w-12 h-12 rounded-full bg-[#F4B400] bg-opacity-10 flex items-center justify-center mr-4'>
                <span className='text-[#F4B400] font-bold'>
                  {facultyMembers.filter((member) => member.featured).length}
                </span>
              </div>
              <div>
                <p className='text-gray-500 text-sm'>Featured</p>
                <p className='text-lg font-semibold text-gray-800'>
                  Highlighted Faculty
                </p>
              </div>
            </div>

            <div className='bg-white rounded-lg shadow p-6 flex items-center'>
              <div className='w-12 h-12 rounded-full bg-green-500 bg-opacity-10 flex items-center justify-center mr-4'>
                <span className='text-green-500 font-bold'>
                  {
                    facultyMembers.filter(
                      (member) => member.status === "active"
                    ).length
                  }
                </span>
              </div>
              <div>
                <p className='text-gray-500 text-sm'>Active</p>
                <p className='text-lg font-semibold text-gray-800'>
                  Published Profiles
                </p>
              </div>
            </div>

            <div className='bg-white rounded-lg shadow p-6 flex items-center'>
              <div className='w-12 h-12 rounded-full bg-purple-500 bg-opacity-10 flex items-center justify-center mr-4'>
                <span className='text-purple-500 font-bold'>
                  {
                    new Set(
                      facultyMembers.map((member) => member.department_name)
                    ).size
                  }
                </span>
              </div>
              <div>
                <p className='text-gray-500 text-sm'>Departments</p>
                <p className='text-lg font-semibold text-gray-800'>
                  Academic Units
                </p>
              </div>
            </div>
          </div>

          {/* Faculty Table */}
          <Table
            columns={columns}
            data={facultyMembers}
            actions={true}
            onView={openViewModal}
            onEdit={openEditModal}
            onDelete={handleDeleteFaculty}
          />
        </>
      ) : (
        <>
          {/* Directory Preview */}
          <div className='bg-white rounded-lg shadow p-6 mb-6'>
            <h3 className='text-lg font-medium text-gray-800 mb-4'>
              Directory Preview
            </h3>
            <p className='text-gray-600 mb-4'>
              This is a preview of how the faculty directory will appear to
              users. Only active faculty members are displayed.
            </p>

            {/* Search and Filter Section */}
            <div className='flex flex-col md:flex-row gap-4 mb-6'>
              <div className='relative flex-grow'>
                <Search
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                  size={20}
                />
                <input
                  type='text'
                  placeholder='Search by name, department, position, or research interest'
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87]'
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className='relative'>
                <button
                  className='flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors'
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter size={20} />
                  <span>Filters</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isFilterOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isFilterOpen && (
                  <div className='absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10 p-4'>
                    <div className='mb-4'>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Department
                      </label>
                      <select
                        className='w-full p-2 border border-gray-300 rounded-md'
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                      >
                        <option value='all'>All Departments</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='mb-4'>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Position
                      </label>
                      <select
                        className='w-full p-2 border border-gray-300 rounded-md'
                        value={selectedPosition}
                        onChange={(e) => setSelectedPosition(e.target.value)}
                      >
                        <option value='all'>All Positions</option>
                        {positions.map((pos) => (
                          <option key={pos} value={pos}>
                            {pos}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='flex justify-between'>
                      <button
                        className='text-sm text-gray-600 hover:text-gray-900'
                        onClick={clearFilters}
                      >
                        Clear filters
                      </button>
                      <button
                        className='text-sm bg-[#004B87] text-white px-3 py-1 rounded-md hover:bg-[#003a6a]'
                        onClick={() => setIsFilterOpen(false)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className='flex gap-2'>
                <button
                  className={`px-3 py-2 rounded-md ${
                    viewMode === "grid"
                      ? "bg-[#004B87] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  className={`px-3 py-2 rounded-md ${
                    viewMode === "list"
                      ? "bg-[#004B87] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Active filters */}
            {(selectedDepartment !== "all" ||
              selectedPosition !== "all" ||
              searchTerm) && (
              <div className='mb-6 flex flex-wrap gap-2'>
                {searchTerm && (
                  <div className='flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm'>
                    <span>Search: {searchTerm}</span>
                    <button className='ml-2' onClick={() => setSearchTerm("")}>
                      <X size={14} />
                    </button>
                  </div>
                )}
                {selectedDepartment !== "all" && (
                  <div className='flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm'>
                    <span>Department: {selectedDepartment}</span>
                    <button
                      className='ml-2'
                      onClick={() => setSelectedDepartment("all")}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                {selectedPosition !== "all" && (
                  <div className='flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm'>
                    <span>Position: {selectedPosition}</span>
                    <button
                      className='ml-2'
                      onClick={() => setSelectedPosition("all")}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <button
                  className='text-sm text-[#004B87] hover:underline'
                  onClick={clearFilters}
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results Section */}
            <div className='mb-4'>
              <h3 className='text-lg font-medium text-gray-800'>
                {filteredFaculty.length}{" "}
                {filteredFaculty.length === 1
                  ? "Faculty Member"
                  : "Faculty Members"}
              </h3>
            </div>

            {filteredFaculty.length === 0 ? (
              <div className='bg-gray-50 rounded-lg p-8 text-center'>
                <p className='text-gray-600 mb-4'>
                  No faculty members found matching your criteria.
                </p>
                <button
                  className='text-[#004B87] hover:underline'
                  onClick={clearFilters}
                >
                  Clear all filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredFaculty.map((faculty) => (
                  <div
                    key={faculty.id}
                    className='bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow cursor-pointer'
                    onClick={() => openProfileModal(faculty)}
                  >
                    <div className='h-48 bg-gray-200 relative'>
                      <img
                        src={`/placeholder.svg?height=192&width=384&text=${faculty.name.charAt(
                          0
                        )}`}
                        alt={faculty.name}
                        className='w-full h-full object-cover'
                      />
                      {faculty.featured && (
                        <div className='absolute top-2 right-2 bg-yellow-400 text-yellow-800 px-2 py-1 rounded-md text-xs font-medium'>
                          Featured
                        </div>
                      )}
                      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4'>
                        <h3 className='text-white font-bold text-lg'>
                          {faculty.name}
                        </h3>
                        <p className='text-white text-sm opacity-90'>
                          {faculty.position}
                        </p>
                      </div>
                    </div>
                    <div className='p-4'>
                      <p className='text-[#004B87] font-medium'>
                        {faculty.department_name}
                      </p>
                      <p className='text-gray-600 text-sm mt-1'>
                        {faculty.contact_info.email}
                      </p>
                      <div className='mt-3 flex flex-wrap gap-1'>
                        {faculty.profile.research_interests
                          .slice(0, 3)
                          .map((interest, index) => (
                            <span
                              key={index}
                              className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'
                            >
                              {interest}
                            </span>
                          ))}
                        {faculty.profile.research_interests.length > 3 && (
                          <span className='px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs'>
                            +{faculty.profile.research_interests.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='space-y-4'>
                {filteredFaculty.map((faculty) => (
                  <div
                    key={faculty.id}
                    className='bg-white rounded-lg shadow-sm border p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow cursor-pointer'
                    onClick={() => openProfileModal(faculty)}
                  >
                    <div className='w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0 relative'>
                      <img
                        src={`/placeholder.svg?height=128&width=128&text=${faculty.name.charAt(
                          0
                        )}`}
                        alt={faculty.name}
                        className='w-full h-full object-cover'
                      />
                      {faculty.featured && (
                        <div className='absolute bottom-0 right-0 bg-yellow-400 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium'>
                          Featured
                        </div>
                      )}
                    </div>
                    <div className='flex-grow'>
                      <h3 className='text-xl font-bold text-gray-800'>
                        {faculty.name}
                      </h3>
                      <p className='text-gray-600'>{faculty.position}</p>
                      <p className='text-[#004B87] font-medium mt-1'>
                        {faculty.department_name}
                      </p>
                      <p className='text-gray-600 text-sm mt-1'>
                        {faculty.contact_info.email}
                      </p>
                      <div className='mt-3 flex flex-wrap gap-1'>
                        {faculty.profile.research_interests.map(
                          (interest, index) => (
                            <span
                              key={index}
                              className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'
                            >
                              {interest}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Faculty Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title='Add New Faculty Member'
        size='lg'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddFaculty();
          }}
        >
          <div className='grid grid-cols-1 gap-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label='Full Name'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Position'
                name='position'
                type='select'
                value={formData.position}
                onChange={handleInputChange}
                options={[
                  { value: "Professor", label: "Professor" },
                  {
                    value: "Associate Professor",
                    label: "Associate Professor",
                  },
                  {
                    value: "Assistant Professor",
                    label: "Assistant Professor",
                  },
                  { value: "Lecturer", label: "Lecturer" },
                  { value: "Instructor", label: "Instructor" },
                  { value: "Visiting Professor", label: "Visiting Professor" },
                ]}
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
                label='Department Name'
                name='department_name'
                value={formData.department_name}
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Profile Image'
                name='image'
                value={formData.image}
                onChange={handleInputChange}
                placeholder='Image filename'
              />
              <div className='flex flex-col space-y-2'>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    id='featured'
                    name='featured'
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className='h-4 w-4 text-[#004B87] focus:ring-[#004B87] border-gray-300 rounded'
                  />
                  <label
                    htmlFor='featured'
                    className='text-sm font-medium text-gray-700'
                  >
                    Feature this faculty member
                  </label>
                </div>
                <FormField
                  label='Status'
                  name='status'
                  type='select'
                  value={formData.status}
                  onChange={handleInputChange}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                  required
                />
              </div>
            </div>

            <h3 className='font-medium text-gray-800 border-b pb-2'>
              Contact Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                label='Email'
                name='contact_info.email'
                type='email'
                value={formData.contact_info.email}
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Phone'
                name='contact_info.phone'
                value={formData.contact_info.phone}
                onChange={handleInputChange}
              />
              <FormField
                label='Office'
                name='contact_info.office'
                value={formData.contact_info.office}
                onChange={handleInputChange}
              />
            </div>

            <h3 className='font-medium text-gray-800 border-b pb-2'>Profile</h3>
            <FormField
              label='Biography'
              name='profile.bio'
              type='textarea'
              value={formData.profile.bio}
              onChange={handleInputChange}
            />

            <div>
              <div className='flex justify-between items-center mb-2'>
                <h4 className='font-medium text-gray-800'>Education</h4>
                <button
                  type='button'
                  className='text-sm px-2 py-1 bg-[#004B87] text-white rounded-md'
                  onClick={addEducation}
                >
                  Add Education
                </button>
              </div>

              {formData.profile.education.map((edu, index) => (
                <div
                  key={index}
                  className='grid grid-cols-1 md:grid-cols-7 gap-4 mb-4 p-3 border rounded-md'
                >
                  <div className='md:col-span-3'>
                    <FormField
                      label='Degree'
                      value={edu.degree}
                      onChange={(e) =>
                        handleEducationChange(index, "degree", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className='md:col-span-3'>
                    <FormField
                      label='Institution'
                      value={edu.institution}
                      onChange={(e) =>
                        handleEducationChange(
                          index,
                          "institution",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                  <div className='md:col-span-1 flex flex-col'>
                    <FormField
                      label='Year'
                      type='number'
                      value={edu.year}
                      onChange={(e) =>
                        handleEducationChange(index, "year", e.target.value)
                      }
                      required
                    />
                    {formData.profile.education.length > 1 && (
                      <button
                        type='button'
                        className='mt-2 text-red-600 hover:text-red-800 self-end'
                        onClick={() => removeEducation(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <FormField
              label='Research Interests (comma separated)'
              name='research_interests'
              value={
                Array.isArray(formData.profile.research_interests)
                  ? formData.profile.research_interests.join(", ")
                  : formData.profile.research_interests
              }
              onChange={handleResearchInterestsChange}
            />

            <FormField
              label='Publications (one per line)'
              name='publications'
              type='textarea'
              value={
                Array.isArray(formData.profile.publications)
                  ? formData.profile.publications.join("\n")
                  : formData.profile.publications
              }
              onChange={handlePublicationsChange}
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
              Save Faculty Member
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Faculty Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title='Edit Faculty Member'
        size='lg'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditFaculty();
          }}
        >
          <div className='grid grid-cols-1 gap-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label='Full Name'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Position'
                name='position'
                type='select'
                value={formData.position}
                onChange={handleInputChange}
                options={[
                  { value: "Professor", label: "Professor" },
                  {
                    value: "Associate Professor",
                    label: "Associate Professor",
                  },
                  {
                    value: "Assistant Professor",
                    label: "Assistant Professor",
                  },
                  { value: "Lecturer", label: "Lecturer" },
                  { value: "Instructor", label: "Instructor" },
                  { value: "Visiting Professor", label: "Visiting Professor" },
                ]}
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
                label='Department Name'
                name='department_name'
                value={formData.department_name}
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Profile Image'
                name='image'
                value={formData.image}
                onChange={handleInputChange}
                placeholder='Image filename'
              />
              <div className='flex flex-col space-y-2'>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    id='featured_edit'
                    name='featured'
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className='h-4 w-4 text-[#004B87] focus:ring-[#004B87] border-gray-300 rounded'
                  />
                  <label
                    htmlFor='featured_edit'
                    className='text-sm font-medium text-gray-700'
                  >
                    Feature this faculty member
                  </label>
                </div>
                <FormField
                  label='Status'
                  name='status'
                  type='select'
                  value={formData.status}
                  onChange={handleInputChange}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                  required
                />
              </div>
            </div>

            <h3 className='font-medium text-gray-800 border-b pb-2'>
              Contact Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                label='Email'
                name='contact_info.email'
                type='email'
                value={formData.contact_info.email}
                onChange={handleInputChange}
                required
              />
              <FormField
                label='Phone'
                name='contact_info.phone'
                value={formData.contact_info.phone}
                onChange={handleInputChange}
              />
              <FormField
                label='Office'
                name='contact_info.office'
                value={formData.contact_info.office}
                onChange={handleInputChange}
              />
            </div>

            <h3 className='font-medium text-gray-800 border-b pb-2'>Profile</h3>
            <FormField
              label='Biography'
              name='profile.bio'
              type='textarea'
              value={formData.profile.bio}
              onChange={handleInputChange}
            />

            <div>
              <div className='flex justify-between items-center mb-2'>
                <h4 className='font-medium text-gray-800'>Education</h4>
                <button
                  type='button'
                  className='text-sm px-2 py-1 bg-[#004B87] text-white rounded-md'
                  onClick={addEducation}
                >
                  Add Education
                </button>
              </div>

              {formData.profile.education.map((edu, index) => (
                <div
                  key={index}
                  className='grid grid-cols-1 md:grid-cols-7 gap-4 mb-4 p-3 border rounded-md'
                >
                  <div className='md:col-span-3'>
                    <FormField
                      label='Degree'
                      value={edu.degree}
                      onChange={(e) =>
                        handleEducationChange(index, "degree", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className='md:col-span-3'>
                    <FormField
                      label='Institution'
                      value={edu.institution}
                      onChange={(e) =>
                        handleEducationChange(
                          index,
                          "institution",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                  <div className='md:col-span-1 flex flex-col'>
                    <FormField
                      label='Year'
                      type='number'
                      value={edu.year}
                      onChange={(e) =>
                        handleEducationChange(index, "year", e.target.value)
                      }
                      required
                    />
                    {formData.profile.education.length > 1 && (
                      <button
                        type='button'
                        className='mt-2 text-red-600 hover:text-red-800 self-end'
                        onClick={() => removeEducation(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <FormField
              label='Research Interests (comma separated)'
              name='research_interests'
              value={
                Array.isArray(formData.profile.research_interests)
                  ? formData.profile.research_interests.join(", ")
                  : formData.profile.research_interests
              }
              onChange={handleResearchInterestsChange}
            />

            <FormField
              label='Publications (one per line)'
              name='publications'
              type='textarea'
              value={
                Array.isArray(formData.profile.publications)
                  ? formData.profile.publications.join("\n")
                  : formData.profile.publications
              }
              onChange={handlePublicationsChange}
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
              Update Faculty Member
            </button>
          </div>
        </form>
      </Modal>

      {/* View Faculty Modal (Management) */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title='Faculty Member Details'
        size='lg'
      >
        {currentFaculty && (
          <div className='space-y-6'>
            <div className='flex flex-col md:flex-row gap-6'>
              <div className='md:w-1/3'>
                <div className='bg-gray-100 rounded-lg p-4 flex flex-col items-center'>
                  <div className='w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-4'>
                    <img
                      src={`/placeholder.svg?height=128&width=128&text=${currentFaculty.name.charAt(
                        0
                      )}`}
                      alt={currentFaculty.name}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <h3 className='text-xl font-bold text-gray-800'>
                    {currentFaculty.name}
                  </h3>
                  <p className='text-sm text-gray-500 mb-2'>
                    {currentFaculty.position}
                  </p>
                  <p className='text-[#004B87] font-medium'>
                    {currentFaculty.department_name}
                  </p>
                  <div className='flex flex-wrap justify-center gap-1 mt-3'>
                    {currentFaculty.profile.research_interests.map(
                      (interest, index) => (
                        <span
                          key={index}
                          className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'
                        >
                          {interest}
                        </span>
                      )
                    )}
                  </div>
                  <div className='mt-4 flex gap-2'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        currentFaculty.featured
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {currentFaculty.featured ? "Featured" : "Standard"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        currentFaculty.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {currentFaculty.status.charAt(0).toUpperCase() +
                        currentFaculty.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className='md:w-2/3'>
                <h3 className='text-lg font-medium text-gray-800 mb-4'>
                  Contact Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Email</p>
                    <p className='text-gray-800'>
                      {currentFaculty.contact_info.email}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Phone</p>
                    <p className='text-gray-800'>
                      {currentFaculty.contact_info.phone}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Office</p>
                    <p className='text-gray-800'>
                      {currentFaculty.contact_info.office}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>
                      Department ID
                    </p>
                    <p className='text-gray-800'>
                      {currentFaculty.department_id}
                    </p>
                  </div>
                </div>

                <h3 className='text-lg font-medium text-gray-800 mb-2'>
                  Biography
                </h3>
                <p className='text-gray-700 bg-gray-50 p-4 rounded-md mb-6'>
                  {currentFaculty.profile.bio}
                </p>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-medium text-gray-800 mb-4'>
                Education
              </h3>
              <div className='space-y-4'>
                {currentFaculty.profile.education.map((edu, index) => (
                  <div key={index} className='bg-gray-50 p-4 rounded-md'>
                    <div className='flex justify-between'>
                      <div>
                        <p className='font-medium text-gray-800'>
                          {edu.degree}
                        </p>
                        <p className='text-gray-600'>{edu.institution}</p>
                      </div>
                      <div className='bg-[#004B87] text-white px-3 py-1 rounded-md text-sm h-fit'>
                        {edu.year}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {currentFaculty.profile.publications &&
              currentFaculty.profile.publications.length > 0 && (
                <div>
                  <h3 className='text-lg font-medium text-gray-800 mb-4'>
                    Publications
                  </h3>
                  <div className='bg-gray-50 p-4 rounded-md'>
                    <ul className='list-disc pl-5 space-y-2'>
                      {currentFaculty.profile.publications.map(
                        (publication, index) => (
                          <li key={index} className='text-gray-700'>
                            {publication}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              )}
          </div>
        )}
      </Modal>

      {/* Faculty Profile Modal (Preview) */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title='Faculty Profile'
        size='lg'
      >
        {selectedFacultyPreview && (
          <div className='space-y-6'>
            <div className='flex flex-col md:flex-row gap-6'>
              <div className='md:w-1/3'>
                <div className='bg-gray-100 rounded-lg p-4 flex flex-col items-center'>
                  <div className='w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-4'>
                    <img
                      src={`/placeholder.svg?height=128&width=128&text=${selectedFacultyPreview.name.charAt(
                        0
                      )}`}
                      alt={selectedFacultyPreview.name}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <h3 className='text-xl font-bold text-gray-800'>
                    {selectedFacultyPreview.name}
                  </h3>
                  <p className='text-sm text-gray-500 mb-2'>
                    {selectedFacultyPreview.position}
                  </p>
                  <p className='text-[#004B87] font-medium'>
                    {selectedFacultyPreview.department_name}
                  </p>
                  <div className='flex flex-wrap justify-center gap-1 mt-3'>
                    {selectedFacultyPreview.profile.research_interests.map(
                      (interest, index) => (
                        <span
                          key={index}
                          className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'
                        >
                          {interest}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className='md:w-2/3'>
                <h3 className='text-lg font-medium text-gray-800 mb-4'>
                  Contact Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Email</p>
                    <p className='text-gray-800'>
                      {selectedFacultyPreview.contact_info.email}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Phone</p>
                    <p className='text-gray-800'>
                      {selectedFacultyPreview.contact_info.phone}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Office</p>
                    <p className='text-gray-800'>
                      {selectedFacultyPreview.contact_info.office}
                    </p>
                  </div>
                </div>

                <h3 className='text-lg font-medium text-gray-800 mb-2'>
                  Biography
                </h3>
                <p className='text-gray-700 bg-gray-50 p-4 rounded-md mb-6'>
                  {selectedFacultyPreview.profile.bio}
                </p>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-medium text-gray-800 mb-4'>
                Education
              </h3>
              <div className='space-y-4'>
                {selectedFacultyPreview.profile.education.map((edu, index) => (
                  <div key={index} className='bg-gray-50 p-4 rounded-md'>
                    <div className='flex justify-between'>
                      <div>
                        <p className='font-medium text-gray-800'>
                          {edu.degree}
                        </p>
                        <p className='text-gray-600'>{edu.institution}</p>
                      </div>
                      <div className='bg-[#004B87] text-white px-3 py-1 rounded-md text-sm h-fit'>
                        {edu.year}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedFacultyPreview.profile.publications &&
              selectedFacultyPreview.profile.publications.length > 0 && (
                <div>
                  <h3 className='text-lg font-medium text-gray-800 mb-4'>
                    Publications
                  </h3>
                  <div className='bg-gray-50 p-4 rounded-md'>
                    <ul className='list-disc pl-5 space-y-2'>
                      {selectedFacultyPreview.profile.publications.map(
                        (publication, index) => (
                          <li key={index} className='text-gray-700'>
                            {publication}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FacultyDirectoryManagement;
