import React from "react";

import { useState } from "react";
import {
  BarChart,
  FileText,
  Globe,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Users,
  BookOpen,
  Bell,
  Plus,
  X,
  Save,
  Trash2,
  Edit,
} from "lucide-react";
// import "../styles/Dashboard.css";
import Logo from "../../public/KufeLogo.jpeg";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("courses");
  const [language, setLanguage] = useState("en");
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Course form state
  const [courseForm, setCourseForm] = useState({
    courseCode: "",
    courseName: "",
    creditHours: "",
    instructor: "",
    department: "",
    semester: "",
    description: "",
  });

  // Courses state (simulating database)
  const [courses, setCourses] = useState([
    {
      id: 1,
      courseCode: "ECO101",
      courseName: "Principles of Economics",
      creditHours: 3,
      instructor: "Dr. Ahmad Ahmadi",
      department: "Economics",
      semester: "Fall 2025",
      description: "Introduction to basic economic principles and theories.",
      enrolledStudents: 45,
      status: "Active",
    },
    {
      id: 2,
      courseCode: "FIN201",
      courseName: "Financial Management",
      creditHours: 4,
      instructor: "Prof. Mohammad Karimi",
      department: "Finance",
      semester: "Fall 2025",
      description: "Study of financial planning, analysis, and management.",
      enrolledStudents: 38,
      status: "Active",
    },
    {
      id: 3,
      courseCode: "BUS301",
      courseName: "Business Ethics",
      creditHours: 3,
      instructor: "Dr. Fatima Noori",
      department: "Business",
      semester: "Fall 2025",
      description: "Ethical principles and moral issues in business practices.",
      enrolledStudents: 42,
      status: "Active",
    },
  ]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseForm({
      ...courseForm,
      [name]: value,
    });
  };

  const resetCourseForm = () => {
    setCourseForm({
      courseCode: "",
      courseName: "",
      creditHours: "",
      instructor: "",
      department: "",
      semester: "",
      description: "",
    });
  };

  const handleAddCourse = (e) => {
    e.preventDefault();

    // Simulate sending to database
    const newCourse = {
      id: courses.length + 1,
      ...courseForm,
      enrolledStudents: 0,
      status: "Active",
    };

    setCourses([...courses, newCourse]);
    setIsAddCourseModalOpen(false);
    resetCourseForm();

    // Show success message (in a real app, you'd use a proper notification system)
    alert("Course added successfully!");
  };

  const handleEditCourse = (e) => {
    e.preventDefault();

    // Update the course in our "database"
    const updatedCourses = courses.map((course) =>
      course.id === editingCourse.id ? { ...course, ...courseForm } : course
    );

    setCourses(updatedCourses);
    setIsEditCourseModalOpen(false);
    resetCourseForm();

    // Show success message
    alert("Course updated successfully!");
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      // Filter out the deleted course
      const updatedCourses = courses.filter((course) => course.id !== courseId);
      setCourses(updatedCourses);

      // Show success message
      alert("Course deleted successfully!");
    }
  };

  const openEditCourseModal = (course) => {
    setEditingCourse(course);
    setCourseForm({
      courseCode: course.courseCode,
      courseName: course.courseName,
      creditHours: course.creditHours,
      instructor: course.instructor,
      department: course.department,
      semester: course.semester,
      description: course.description,
    });
    setIsEditCourseModalOpen(true);
  };

  const languages = {
    en: "English",
    ps: "پښتو",
    dr: "دری",
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-[#004B87] text-white transition-all duration-300 flex flex-col z-10`}
      >
        <div className='flex items-center p-4 border-b border-opacity-10 border-white'>
          <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3'>
            <img src={Logo} alt='KUFE Logo' className='w-8 h-8' />
          </div>
          <h2 className={`text-xl font-bold ${!isSidebarOpen && "hidden"}`}>
            KUFE
          </h2>
        </div>

        <div className='flex-1 py-4 overflow-y-auto'>
          <div
            className={`flex items-center px-4 py-3 ${
              activeTab === "dashboard"
                ? "bg-white text-sky-700 bg-opacity-20 border-l-4 border-[#F4B400]"
                : "hover:bg-white text-sky-700 hover:bg-opacity-10"
            } cursor-pointer`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Home size={20} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>
              Dashboard
            </span>
          </div>

          <div
            className={`flex items-center px-4 py-3 ${
              activeTab === "faculty"
                ? "bg-white bg-opacity-20 text-sky-700 border-l-4 border-[#F4B400]"
                : "hover:bg-white text-sky-700 hover:bg-opacity-10"
            } cursor-pointer`}
            onClick={() => setActiveTab("faculty")}
          >
            <Users size={20} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>
              Faculty
            </span>
          </div>

          <div
            className={`flex items-center px-4 py-3 ${
              activeTab === "students"
                ? "bg-white bg-opacity-20 text-sky-700 border-l-4 border-[#F4B400]"
                : "hover:bg-white text-sky-700 hover:bg-opacity-10"
            } cursor-pointer`}
            onClick={() => setActiveTab("students")}
          >
            <GraduationCap size={20} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>
              Students
            </span>
          </div>

          <div
            className={`flex items-center px-4 py-3 ${
              activeTab === "courses"
                ? "bg-white bg-opacity-20 text-sky-700 border-l-4 border-[#F4B400]"
                : "hover:bg-white text-sky-700 hover:bg-opacity-10"
            } cursor-pointer`}
            onClick={() => setActiveTab("courses")}
          >
            <BookOpen size={20} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>
              Courses
            </span>
          </div>

          <div
            className={`flex items-center px-4 py-3 ${
              activeTab === "marks"
                ? "bg-white bg-opacity-20 text-sky-700 border-l-4 border-[#F4B400]"
                : "hover:bg-white text-sky-700 hover:bg-opacity-10"
            } cursor-pointer`}
            onClick={() => {
              setActiveTab("marks");
              window.location.href = "/teachermarks";
            }}
          >
            <FileText size={20} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>
              Marks Management
            </span>
          </div>

          <div
            className={`flex items-center px-4 py-3 ${
              activeTab === "research"
                ? "bg-white bg-opacity-20 text-sky-700 border-l-4 border-[#F4B400]"
                : "hover:bg-white text-sky-700 hover:bg-opacity-10"
            } cursor-pointer`}
            onClick={() => setActiveTab("research")}
          >
            <FileText size={20} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>
              Research
            </span>
          </div>

          <div
            className={`flex items-center px-4 py-3 ${
              activeTab === "announcements"
                ? "bg-white bg-opacity-20 text-sky-700 border-l-4 border-[#F4B400]"
                : "hover:bg-white text-sky-600 hover:bg-opacity-10"
            } cursor-pointer`}
            onClick={() => setActiveTab("announcements")}
          >
            <MessageSquare size={20} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>
              Announcements
            </span>
          </div>

          <div
            className={`flex items-center px-4 py-3 ${
              activeTab === "analytics"
                ? "bg-white bg-opacity-20 text-sky-700 border-l-4 border-[#F4B400]"
                : "hover:bg-white text-sky-700 hover:bg-opacity-10"
            } cursor-pointer`}
            onClick={() => setActiveTab("analytics")}
          >
            <BarChart size={20} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>
              Analytics
            </span>
          </div>

          <div
            className={`flex items-center px-4 py-3 ${
              activeTab === "settings"
                ? "bg-white  text-sky-700 bg-opacity-20 border-l-4 border-[#F4B400]"
                : "hover:bg-white  text-sky-700 hover:bg-opacity-10"
            } cursor-pointer`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={20} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>
              Settings
            </span>
          </div>
        </div>

        <div className='p-4 border-t border-opacity-10 border-white'>
          <div className='flex items-center px-4 py-3 hover:bg-white hover:text-sky-700  hover:bg-opacity-10 cursor-pointer'>
            <LogOut size={20} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <div className='bg-white shadow-sm z-10 flex justify-between items-center p-4'>
          <div className='flex items-center'>
            <button
              className='p-1 rounded-full hover:bg-gray-100 focus:outline-none'
              onClick={toggleSidebar}
            >
              <Menu size={24} className='text-gray-700' />
            </button>
            <h1 className='ml-4 text-2xl font-bold text-gray-800'>
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "faculty" && "Faculty Management"}
              {activeTab === "students" && "Student Management"}
              {activeTab === "courses" && "Course Management"}
              {activeTab === "marks" && "Marks Management"}
              {activeTab === "research" && "Research Publications"}
              {activeTab === "announcements" && "Announcements"}
              {activeTab === "analytics" && "Analytics"}
              {activeTab === "settings" && "Settings"}
            </h1>
          </div>

          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <Search
                size={20}
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
              />
              <input
                type='text'
                placeholder='Search...'
                className='pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent'
              />
            </div>

            <div className='flex items-center space-x-2'>
              <Globe size={20} className='text-gray-700' />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent'
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className='relative'>
              <Bell size={20} className='text-gray-700 cursor-pointer' />
              <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                3
              </span>
            </div>

            <div className='flex items-center space-x-3 cursor-pointer'>
              <img
                src='/placeholder.svg?height=40&width=40'
                alt='User'
                className='w-10 h-10 rounded-full'
              />
              <div className='hidden md:block'>
                <p className='text-sm font-medium text-gray-800'>Admin User</p>
                <p className='text-xs text-gray-500'>Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          {activeTab === "research" && (
            <div className='space-y-6'>
              <div className='flex justify-between items-center'>
                <h2 className='text-xl font-semibold text-gray-800'>
                  Research Management
                </h2>
                <a
                  href='/admin-research'
                  className='flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
                >
                  <FileText size={18} className='mr-2' />
                  View All Research Submissions
                </a>
              </div>

              {/* Research Stats Cards */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-white rounded-lg shadow p-6 flex items-center'>
                  <div className='w-12 h-12 rounded-full bg-[#004B87] bg-opacity-10 flex items-center justify-center mr-4'>
                    <FileText size={24} className='text-[#004B87]' />
                  </div>
                  <div>
                    <p className='text-gray-500 text-sm'>Total Submissions</p>
                    <p className='text-2xl font-bold text-gray-800'>24</p>
                  </div>
                </div>

                <div className='bg-white rounded-lg shadow p-6 flex items-center'>
                  <div className='w-12 h-12 rounded-full bg-green-500 bg-opacity-10 flex items-center justify-center mr-4'>
                    <Check size={24} className='text-green-500' />
                  </div>
                  <div>
                    <p className='text-gray-500 text-sm'>Accepted</p>
                    <p className='text-2xl font-bold text-gray-800'>12</p>
                  </div>
                </div>

                <div className='bg-white rounded-lg shadow p-6 flex items-center'>
                  <div className='w-12 h-12 rounded-full bg-yellow-500 bg-opacity-10 flex items-center justify-center mr-4'>
                    <AlertTriangle size={24} className='text-yellow-500' />
                  </div>
                  <div>
                    <p className='text-gray-500 text-sm'>Pending Review</p>
                    <p className='text-2xl font-bold text-gray-800'>8</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className='bg-white rounded-lg shadow p-6'>
                <h3 className='text-lg font-medium text-gray-800 mb-4'>
                  Research Management
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <a
                    href='/admin-research'
                    className='flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50'
                  >
                    <div className='w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3'>
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className='font-medium text-gray-800'>
                        View All Submissions
                      </p>
                      <p className='text-sm text-gray-500'>
                        Access all research submissions
                      </p>
                    </div>
                  </a>

                  <a
                    href='/committee-research'
                    className='flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50'
                  >
                    <div className='w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3'>
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <p className='font-medium text-gray-800'>
                        Committee View
                      </p>
                      <p className='text-sm text-gray-500'>
                        Department-specific submissions
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div className='space-y-6'>
              <div className='flex justify-between items-center'>
                <h2 className='text-xl font-semibold text-gray-800'>
                  Course Management
                </h2>
                <button
                  className='flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
                  onClick={() => setIsAddCourseModalOpen(true)}
                >
                  <Plus size={18} className='mr-2' />
                  Add New Course
                </button>
              </div>

              {/* Course Stats */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-white rounded-lg shadow p-6 flex items-center'>
                  <div className='w-12 h-12 rounded-full bg-[#004B87] bg-opacity-10 flex items-center justify-center mr-4'>
                    <BookOpen size={24} className='text-[#004B87]' />
                  </div>
                  <div>
                    <p className='text-gray-500 text-sm'>Total Courses</p>
                    <p className='text-2xl font-bold text-gray-800'>
                      {courses.length}
                    </p>
                  </div>
                </div>

                <div className='bg-white rounded-lg shadow p-6 flex items-center'>
                  <div className='w-12 h-12 rounded-full bg-[#F4B400] bg-opacity-10 flex items-center justify-center mr-4'>
                    <Users size={24} className='text-[#F4B400]' />
                  </div>
                  <div>
                    <p className='text-gray-500 text-sm'>Active Instructors</p>
                    <p className='text-2xl font-bold text-gray-800'>12</p>
                  </div>
                </div>

                <div className='bg-white rounded-lg shadow p-6 flex items-center'>
                  <div className='w-12 h-12 rounded-full bg-green-500 bg-opacity-10 flex items-center justify-center mr-4'>
                    <GraduationCap size={24} className='text-green-500' />
                  </div>
                  <div>
                    <p className='text-gray-500 text-sm'>Enrolled Students</p>
                    <p className='text-2xl font-bold text-gray-800'>
                      {courses.reduce(
                        (total, course) =>
                          total + (course.enrolledStudents || 0),
                        0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Table */}
              <div className='bg-white rounded-lg shadow overflow-hidden'>
                <div className='p-4 border-b border-gray-200'>
                  <h3 className='text-lg font-medium text-gray-800'>
                    Course List
                  </h3>
                </div>
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Course Code
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Course Name
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Credit Hours
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Instructor
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Department
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Semester
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Students
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Status
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {courses.map((course) => (
                        <tr key={course.id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                            {course.courseCode}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {course.courseName}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {course.creditHours}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {course.instructor}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {course.department}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {course.semester}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {course.enrolledStudents}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
                              {course.status}
                            </span>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            <div className='flex space-x-2'>
                              <button
                                className='text-blue-600 hover:text-blue-900'
                                onClick={() => openEditCourseModal(course)}
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                className='text-red-600 hover:text-red-900'
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "courses" && (
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-xl font-semibold text-gray-800 mb-4'>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Page
              </h2>
              <p className='text-gray-600'>
                This is the {activeTab} page. Please select "Courses" from the
                sidebar to manage courses.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Course Modal */}
      {isAddCourseModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg w-full max-w-2xl'>
            <div className='flex justify-between items-center p-6 border-b border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Add New Course
              </h2>
              <button
                className='text-gray-500 hover:text-gray-700'
                onClick={() => {
                  setIsAddCourseModalOpen(false);
                  resetCourseForm();
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddCourse} className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Course Code
                  </label>
                  <input
                    type='text'
                    name='courseCode'
                    value={courseForm.courseCode}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Course Name
                  </label>
                  <input
                    type='text'
                    name='courseName'
                    value={courseForm.courseName}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Credit Hours
                  </label>
                  <input
                    type='number'
                    name='creditHours'
                    value={courseForm.creditHours}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Instructor
                  </label>
                  <input
                    type='text'
                    name='instructor'
                    value={courseForm.instructor}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Department
                  </label>
                  <select
                    name='department'
                    value={courseForm.department}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent'
                    required
                  >
                    <option value=''>Select Department</option>
                    <option value='Economics'>Economics</option>
                    <option value='Finance'>Finance</option>
                    <option value='Business'>Business</option>
                    <option value='Management'>Management</option>
                    <option value='Accounting'>Accounting</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Semester
                  </label>
                  <select
                    name='semester'
                    value={courseForm.semester}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent'
                    required
                  >
                    <option value=''>Select Semester</option>
                    <option value='Fall 2025'>Fall 2025</option>
                    <option value='Spring 2026'>Spring 2026</option>
                    <option value='Summer 2026'>Summer 2026</option>
                  </select>
                </div>
              </div>

              <div className='mt-6'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Course Description
                </label>
                <textarea
                  name='description'
                  value={courseForm.description}
                  onChange={handleInputChange}
                  rows='4'
                  className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent'
                  required
                ></textarea>
              </div>

              <div className='mt-6 flex justify-end space-x-3'>
                <button
                  type='button'
                  className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                  onClick={() => {
                    setIsAddCourseModalOpen(false);
                    resetCourseForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
                >
                  <Save size={18} className='inline mr-2' />
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {isEditCourseModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg w-full max-w-2xl'>
            <div className='flex justify-between items-center p-6 border-b border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Edit Course
              </h2>
              <button
                className='text-gray-500 hover:text-gray-700'
                onClick={() => {
                  setIsEditCourseModalOpen(false);
                  resetCourseForm();
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditCourse} className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Course Code
                  </label>
                  <input
                    type='text'
                    name='courseCode'
                    value={courseForm.courseCode}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Course Name
                  </label>
                  <input
                    type='text'
                    name='courseName'
                    value={courseForm.courseName}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Credit Hours
                  </label>
                  <input
                    type='number'
                    name='creditHours'
                    value={courseForm.creditHours}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Instructor
                  </label>
                  <input
                    type='text'
                    name='instructor'
                    value={courseForm.instructor}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Department
                  </label>
                  <select
                    name='department'
                    value={courseForm.department}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent'
                    required
                  >
                    <option value=''>Select Department</option>
                    <option value='Economics'>Economics</option>
                    <option value='Finance'>Finance</option>
                    <option value='Business'>Business</option>
                    <option value='Management'>Management</option>
                    <option value='Accounting'>Accounting</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Semester
                  </label>
                  <select
                    name='semester'
                    value={courseForm.semester}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent'
                    required
                  >
                    <option value=''>Select Semester</option>
                    <option value='Fall 2025'>Fall 2025</option>
                    <option value='Spring 2026'>Spring 2026</option>
                    <option value='Summer 2026'>Summer 2026</option>
                  </select>
                </div>
              </div>

              <div className='mt-6'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Course Description
                </label>
                <textarea
                  name='description'
                  value={courseForm.description}
                  onChange={handleInputChange}
                  rows='4'
                  className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent'
                  required
                ></textarea>
              </div>

              <div className='mt-6 flex justify-end space-x-3'>
                <button
                  type='button'
                  className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                  onClick={() => {
                    setIsEditCourseModalOpen(false);
                    resetCourseForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
                >
                  <Save size={18} className='inline mr-2' />
                  Update Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
