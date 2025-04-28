import React from "react";

import { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import Modal from "../components/common/Modal";

const FacultyDirectory = () => {
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
      },
      image: "ahmad-ahmadi.jpg",
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
      },
      image: "fatima-noori.jpg",
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
      },
      image: "mohammad-karimi.jpg",
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
      },
      image: "sarah-johnson.jpg",
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
      },
      image: "ali-hassan.jpg",
    },
    {
      id: 6,
      name: "Prof. Maryam Ahmadzai",
      position: "Lecturer",
      department_id: "60a1c2b3d4e5f6a7b8c9d0e3",
      department_name: "Finance",
      contact_info: {
        email: "maryam.ahmadzai@kufe.edu",
        phone: "+93 70 678 9012",
        office: "Business Building, Room 310",
      },
      profile: {
        bio: "Prof. Maryam Ahmadzai teaches courses in corporate finance and financial accounting. She combines academic knowledge with practical insights gained from her experience as a financial consultant. She is dedicated to preparing students for successful careers in the financial sector.",
        education: [
          {
            degree: "Master's in Finance",
            institution: "INSEAD",
            year: 2016,
          },
          {
            degree: "Bachelor's in Accounting",
            institution: "Kabul University",
            year: 2012,
          },
        ],
        research_interests: [
          "Corporate Finance",
          "Financial Accounting",
          "Islamic Finance",
        ],
      },
      image: "maryam-ahmadzai.jpg",
    },
  ]);

  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Get unique departments and positions for filters
  const departments = [
    ...new Set(facultyMembers.map((faculty) => faculty.department_name)),
  ].sort();

  const positions = [
    ...new Set(facultyMembers.map((faculty) => faculty.position)),
  ].sort();

  // Filter faculty members based on search term and filters
  useEffect(() => {
    let result = facultyMembers;

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("all");
    setSelectedPosition("all");
  };

  const openProfileModal = (faculty) => {
    setSelectedFaculty(faculty);
    setIsProfileModalOpen(true);
  };

  return (
    <div className='min-h-screen bg-gray-50 pb-10'>
      {/* Hero Section */}
      <div className='bg-[#004B87] text-white py-16 px-4'>
        <div className='container mx-auto max-w-6xl'>
          <h1 className='text-3xl md:text-4xl font-bold mb-4'>
            Faculty Directory
          </h1>
          <p className='text-lg md:text-xl opacity-90 max-w-3xl'>
            Meet our distinguished faculty members who are dedicated to
            excellence in teaching, research, and service.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className='container mx-auto max-w-6xl px-4 -mt-8'>
        <div className='bg-white rounded-lg shadow-lg p-6'>
          <div className='flex flex-col md:flex-row gap-4'>
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
                Grid
              </button>
              <button
                className={`px-3 py-2 rounded-md ${
                  viewMode === "list"
                    ? "bg-[#004B87] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setViewMode("list")}
              >
                List
              </button>
            </div>
          </div>

          {/* Active filters */}
          {(selectedDepartment !== "all" ||
            selectedPosition !== "all" ||
            searchTerm) && (
            <div className='mt-4 flex flex-wrap gap-2'>
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
        </div>
      </div>

      {/* Results Section */}
      <div className='container mx-auto max-w-6xl px-4 mt-8'>
        <div className='mb-4 flex justify-between items-center'>
          <h2 className='text-xl font-semibold text-gray-800'>
            {filteredFaculty.length}{" "}
            {filteredFaculty.length === 1
              ? "Faculty Member"
              : "Faculty Members"}
          </h2>
        </div>

        {filteredFaculty.length === 0 ? (
          <div className='bg-white rounded-lg shadow p-8 text-center'>
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
                className='bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer'
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
                className='bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow cursor-pointer'
                onClick={() => openProfileModal(faculty)}
              >
                <div className='w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0'>
                  <img
                    src={`/placeholder.svg?height=128&width=128&text=${faculty.name.charAt(
                      0
                    )}`}
                    alt={faculty.name}
                    className='w-full h-full object-cover'
                  />
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

      {/* Faculty Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title='Faculty Profile'
        size='lg'
      >
        {selectedFaculty && (
          <div className='space-y-6'>
            <div className='flex flex-col md:flex-row gap-6'>
              <div className='md:w-1/3'>
                <div className='bg-gray-100 rounded-lg p-4 flex flex-col items-center'>
                  <div className='w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-4'>
                    <img
                      src={`/placeholder.svg?height=128&width=128&text=${selectedFaculty.name.charAt(
                        0
                      )}`}
                      alt={selectedFaculty.name}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <h3 className='text-xl font-bold text-gray-800'>
                    {selectedFaculty.name}
                  </h3>
                  <p className='text-sm text-gray-500 mb-2'>
                    {selectedFaculty.position}
                  </p>
                  <p className='text-[#004B87] font-medium'>
                    {selectedFaculty.department_name}
                  </p>
                  <div className='flex flex-wrap justify-center gap-1 mt-3'>
                    {selectedFaculty.profile.research_interests.map(
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
                      {selectedFaculty.contact_info.email}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Phone</p>
                    <p className='text-gray-800'>
                      {selectedFaculty.contact_info.phone}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Office</p>
                    <p className='text-gray-800'>
                      {selectedFaculty.contact_info.office}
                    </p>
                  </div>
                </div>

                <h3 className='text-lg font-medium text-gray-800 mb-2'>
                  Biography
                </h3>
                <p className='text-gray-700 bg-gray-50 p-4 rounded-md mb-6'>
                  {selectedFaculty.profile.bio}
                </p>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-medium text-gray-800 mb-4'>
                Education
              </h3>
              <div className='space-y-4'>
                {selectedFaculty.profile.education.map((edu, index) => (
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
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FacultyDirectory;
