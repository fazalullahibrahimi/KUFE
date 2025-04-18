import React from "react";
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ArrowLeft,
  Book,
  Clock,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    department: "all",
    semester: "all",
    level: "all",
  });

  // Fetch courses data - preserving the existing API structure
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          "http://127.0.0.1:4400/api/v1/courses/"
        );

        const courseData = Array.isArray(response.data?.data?.courses)
          ? response.data.data.courses
          : [];
        setTimeout(() => {
          setCourses(courseData);
          setFilteredCourses(courseData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let results = courses;

    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply department filter
    if (activeFilters.department !== "all") {
      results = results.filter(
        (course) => course.department === activeFilters.department
      );
    }

    // Apply semester filter
    if (activeFilters.semester !== "all") {
      results = results.filter(
        (course) => course.semester === activeFilters.semester
      );
    }

    // Apply level filter
    if (activeFilters.level !== "all") {
      results = results.filter(
        (course) => course.level === activeFilters.level
      );
    }

    setFilteredCourses(results);
  }, [searchTerm, activeFilters, courses]);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleBackClick = () => {
    setSelectedCourse(null);
  };

  const handleFilterChange = (filterType, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  return (
    <div className='min-h-screen bg-[#E8ECEF]'>
      <Navbar />
      {/* Header */}
      <div className='relative bg-[#1D3D6F] text-white pt-12'>
        <div className='container mx-auto px-4 py-10 md:py-16'>
          <div className='flex justify-between items-center'>
            <div className='max-w-2xl'>
              <h1 className='text-3xl md:text-5xl font-bold tracking-tight mb-2 text-white'>
                Course Catalog
              </h1>
              <p className='mt-2 text-white text-lg md:text-xl opacity-90'>
                Browse and search through our comprehensive list of courses
              </p>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className='absolute pt-12 bottom-0 left-0 right-0 h-12 overflow-hidden'>
          <svg
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
            className='absolute bottom-0 left-0 w-full h-full text-[#E8ECEF] fill-current'
          >
            <path d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0z'></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-8'>
        {selectedCourse ? (
          <CourseDetail course={selectedCourse} onBackClick={handleBackClick} />
        ) : (
          <>
            {/* Search and Filter Bar */}
            <div className='mb-8 bg-white rounded-lg shadow-md p-6 -mt-8 relative z-10'>
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='relative flex-grow'>
                  <Search
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                    size={20}
                  />
                  <input
                    type='text'
                    placeholder='Search courses by title, instructor, or code...'
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3D6F]'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  className='flex items-center gap-2 bg-[#F7B500] text-[#1D3D6F] px-4 py-3 rounded-lg font-medium hover:bg-[#F7B500]/90 transition-colors'
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={20} />
                  Filters
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Filters */}
              {showFilters && (
                <CourseFilter
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                />
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6'>
                <p className='font-medium'>Error</p>
                <p>{error}</p>
              </div>
            )}

            {/* Results Stats */}
            <div className='mb-4 flex justify-between items-center'>
              <p className='text-[#1D3D6F]'>
                Showing {filteredCourses.length} of {courses.length} courses
              </p>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-[#1D3D6F]'>Sort by:</span>
                <select className='border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D3D6F]'>
                  <option value='title'>Title (A-Z)</option>
                  <option value='code'>Course Code</option>
                  <option value='semester'>Semester</option>
                </select>
              </div>
            </div>

            {/* Course Listings */}
            {isLoading ? (
              <div className='flex justify-center items-center h-64'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1D3D6F]'></div>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={() => handleCourseClick(course)}
                  />
                ))}
              </div>
            ) : (
              <div className='text-center py-12 bg-white rounded-lg shadow-md'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4'>
                  <Search className='h-8 w-8' />
                </div>
                <h3 className='text-xl font-semibold mb-2 text-[#1D3D6F]'>
                  No courses found
                </h3>
                <p className='text-gray-500 mb-6'>
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveFilters({
                      department: "all",
                      semester: "all",
                      level: "all",
                    });
                  }}
                  className='bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] font-medium py-2 px-6 rounded-lg transition'
                >
                  Reset filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Featured Programs Section */}
      {!selectedCourse &&
        !isLoading &&
        !error &&
        filteredCourses.length > 0 && (
          <div className='container mx-auto px-4 py-8 mt-8'>
            <h2 className='text-2xl font-bold text-[#1D3D6F] mb-6'>
              Featured Programs
            </h2>
            <div className='bg-white rounded-lg shadow-md overflow-hidden'>
              <div className='bg-[#1D3D6F] p-6 text-white'>
                <h3 className='text-xl font-semibold mb-2'>
                  Academic Excellence
                </h3>
                <p className='opacity-90'>
                  Explore our specialized academic programs designed to prepare
                  you for success in your career
                </p>
              </div>
              <div className='p-6'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  {[
                    {
                      title: "Bachelor of Economics",
                      description:
                        "A comprehensive program covering micro and macroeconomics, econometrics, and development economics.",
                      icon: <Book className='h-8 w-8 text-[#1D3D6F]' />,
                    },
                    {
                      title: "Master of Finance",
                      description:
                        "Advanced studies in financial management, investment analysis, and international finance.",
                      icon: <Users className='h-8 w-8 text-[#1D3D6F]' />,
                    },
                    {
                      title: "Business Administration",
                      description:
                        "Learn essential business skills including management, marketing, and entrepreneurship.",
                      icon: <Calendar className='h-8 w-8 text-[#1D3D6F]' />,
                    },
                  ].map((program, index) => (
                    <div
                      key={index}
                      className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition'
                    >
                      <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E8ECEF] mb-4'>
                        {program.icon}
                      </div>
                      <h4 className='font-medium text-[#1D3D6F] mb-2'>
                        {program.title}
                      </h4>
                      <p className='text-sm text-gray-600 mb-3'>
                        {program.description}
                      </p>
                      <a
                        href='#'
                        className='text-sm font-medium text-[#1D3D6F] hover:text-[#F7B500] transition flex items-center'
                      >
                        Learn more <span className='ml-1'>→</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Registration CTA */}
      {!selectedCourse && !isLoading && (
        <div className='container mx-auto px-4 py-8 mt-4 mb-12'>
          <div className='bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] rounded-lg shadow-lg overflow-hidden'>
            <div className='p-8 md:p-10 text-white'>
              <div className='flex flex-col md:flex-row items-center justify-between'>
                <div className='mb-6 md:mb-0 md:mr-6'>
                  <h2 className='text-2xl font-bold mb-3'>
                    Ready to Register?
                  </h2>
                  <p className='opacity-90 max-w-xl'>
                    Enrollment for the upcoming semester is now open. Secure
                    your spot in our courses today.
                  </p>
                </div>
                <button className='bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] font-bold py-3 px-6 rounded-lg transition shadow-md'>
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// Course Filter Component
function CourseFilter({ activeFilters, onFilterChange }) {
  return (
    <div className='mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4'>
      <div>
        <label className='block text-sm font-medium text-[#1D3D6F] mb-1'>
          Department
        </label>
        <select
          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1D3D6F]'
          value={activeFilters.department}
          onChange={(e) => onFilterChange("department", e.target.value)}
        >
          <option value='all'>All Departments</option>
          <option value='Economics'>Economics</option>
          <option value='Finance'>Finance</option>
          <option value='Management'>Management</option>
          <option value='Statistics'>Statistics</option>
        </select>
      </div>
      <div>
        <label className='block text-sm font-medium text-[#1D3D6F] mb-1'>
          Semester
        </label>
        <select
          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1D3D6F]'
          value={activeFilters.semester}
          onChange={(e) => onFilterChange("semester", e.target.value)}
        >
          <option value='all'>All Semesters</option>
          <option value='Fall'>Fall</option>
          <option value='Spring'>Spring</option>
          <option value='Summer'>Summer</option>
        </select>
      </div>
      <div>
        <label className='block text-sm font-medium text-[#1D3D6F] mb-1'>
          Level
        </label>
        <select
          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1D3D6F]'
          value={activeFilters.level}
          onChange={(e) => onFilterChange("level", e.target.value)}
        >
          <option value='all'>All Levels</option>
          <option value='Undergraduate'>Undergraduate</option>
          <option value='Graduate'>Graduate</option>
        </select>
      </div>
    </div>
  );
}

// Course Card Component
function CourseCard({ course, onClick }) {
  return (
    <div
      className='bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow'
      onClick={() => onClick(course)}
    >
      <div className='h-40 bg-[#1D3D6F] relative'>
        <img
          src={course.image || "/placeholder.svg?height=200&width=300"}
          alt={course.title}
          className='w-full h-full object-cover opacity-50'
        />
        <div className='absolute top-0 left-0 w-full h-full p-4 flex flex-col justify-between'>
          <div className='flex justify-between'>
            <span className='bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-2 py-1 rounded-md'>
              {course.department}
            </span>
            <span className='bg-white text-[#1D3D6F] text-xs font-bold px-2 py-1 rounded-md'>
              {course.code}
            </span>
          </div>
          <h3 className='text-white text-xl font-semibold line-clamp-2'>
            {course.title}
          </h3>
        </div>
      </div>
      <div className='p-4'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-sm text-gray-500'>
            {course.semester} Semester
          </span>
          <span className='text-sm text-gray-500'>
            {course.credits} Credits
          </span>
        </div>
        <p className='text-[#1D3D6F] font-medium mb-2'>{course.instructor}</p>
        <p className='text-gray-600 text-sm line-clamp-2 mb-3'>
          {course.description}
        </p>
        <div className='flex justify-between items-center'>
          <span className='text-xs bg-[#E8ECEF] text-[#1D3D6F] px-2 py-1 rounded-full'>
            {course.level}
          </span>
          <button className='text-[#1D3D6F] text-sm font-medium hover:text-[#F7B500] transition-colors'>
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}

// Course Detail Component
function CourseDetail({ course, onBackClick }) {
  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      <div className='bg-[#1D3D6F] text-white p-6'>
        <button
          onClick={onBackClick}
          className='mb-4 flex items-center text-white hover:text-[#F7B500] transition-colors'
        >
          <ArrowLeft className='mr-2 h-4 w-4' /> Back to Courses
        </button>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <span className='bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-2 py-1 rounded-md'>
                {course.department}
              </span>
              <span className='bg-white text-[#1D3D6F] text-xs font-bold px-2 py-1 rounded-md'>
                {course.code}
              </span>
              <span className='bg-[#E8ECEF] text-[#1D3D6F] text-xs font-bold px-2 py-1 rounded-md'>
                {course.level}
              </span>
            </div>
            <h1 className='text-2xl md:text-3xl font-bold'>{course.title}</h1>
            <p className='mt-2 text-white opacity-90'>
              Instructor: {course.instructor}
            </p>
          </div>
          <div className='bg-[#2C4F85] px-4 py-2 rounded-lg text-center'>
            <p className='text-sm opacity-80'>Credits</p>
            <p className='text-2xl font-bold'>{course.credits}</p>
          </div>
        </div>
      </div>

      <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='md:col-span-2'>
            <h2 className='text-xl font-semibold mb-4 text-[#1D3D6F]'>
              Course Description
            </h2>
            <p className='text-gray-700 mb-6'>{course.description}</p>

            <h2 className='text-xl font-semibold mb-4 text-[#1D3D6F]'>
              Prerequisites
            </h2>
            {course.prerequisites.length > 0 ? (
              <ul className='list-disc pl-5 mb-6 text-gray-700'>
                {course.prerequisites.map((prereq, index) => (
                  <li key={index}>{prereq}</li>
                ))}
              </ul>
            ) : (
              <p className='text-gray-700 mb-6'>No prerequisites required.</p>
            )}

            <h2 className='text-xl font-semibold mb-4 text-[#1D3D6F]'>
              Course Materials
            </h2>
            <div className='bg-[#E8ECEF] rounded-lg p-4 mb-6'>
              <ul className='divide-y divide-gray-300'>
                {course.materials.map((material) => (
                  <li
                    key={material.id}
                    className='py-3 flex justify-between items-center'
                  >
                    <div className='flex items-center'>
                      <div className='bg-[#1D3D6F] text-white p-2 rounded-md mr-3 uppercase text-xs'>
                        {material.type}
                      </div>
                      <span className='text-[#1D3D6F]'>{material.title}</span>
                    </div>
                    <div className='flex items-center'>
                      <span className='text-xs text-gray-500 mr-3'>
                        {material.size}
                      </span>
                      <button className='text-[#1D3D6F] hover:text-[#F7B500] transition-colors'>
                        Download
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className='bg-[#E8ECEF] rounded-lg p-4 mb-6'>
              <h2 className='text-lg font-semibold mb-3 text-[#1D3D6F]'>
                Course Information
              </h2>
              <ul className='space-y-3'>
                <li className='flex justify-between'>
                  <span className='text-gray-600'>Department:</span>
                  <span className='font-medium text-[#1D3D6F]'>
                    {course.department}
                  </span>
                </li>
                <li className='flex justify-between'>
                  <span className='text-gray-600'>Semester:</span>
                  <span className='font-medium text-[#1D3D6F]'>
                    {course.semester}
                  </span>
                </li>
                <li className='flex justify-between'>
                  <span className='text-gray-600'>Level:</span>
                  <span className='font-medium text-[#1D3D6F]'>
                    {course.level}
                  </span>
                </li>
                <li className='flex justify-between'>
                  <span className='text-gray-600'>Credits:</span>
                  <span className='font-medium text-[#1D3D6F]'>
                    {course.credits}
                  </span>
                </li>
              </ul>
            </div>

            <div className='bg-[#E8ECEF] rounded-lg p-4 mb-6'>
              <h2 className='text-lg font-semibold mb-3 text-[#1D3D6F]'>
                Schedule
              </h2>
              <div className='space-y-3'>
                <div className='flex items-center'>
                  <Calendar className='h-5 w-5 mr-2 text-[#1D3D6F]' />
                  <span className='text-gray-700'>{course.schedule}</span>
                </div>
                <div className='flex items-center'>
                  <MapPin className='h-5 w-5 mr-2 text-[#1D3D6F]' />
                  <span className='text-gray-700'>{course.location}</span>
                </div>
                <div className='flex items-center'>
                  <Clock className='h-5 w-5 mr-2 text-[#1D3D6F]' />
                  <span className='text-gray-700'>Duration: 16 weeks</span>
                </div>
              </div>
            </div>

            <button className='w-full bg-[#F7B500] text-[#1D3D6F] py-3 rounded-lg font-medium hover:bg-[#F7B500]/90 transition-colors'>
              Register for Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sample data for demonstration - preserved from the original implementation
const sampleCourses = [
  {
    id: 1,
    code: "ECON101",
    title: "Principles of Microeconomics",
    instructor: "Dr. Ahmad Ahmadi",
    department: "Economics",
    semester: "Fall",
    level: "Undergraduate",
    credits: 3,
    description:
      "This course introduces students to the principles of microeconomics, focusing on the behavior of individuals and firms in making decisions regarding the allocation of limited resources.",
    schedule: "Monday, Wednesday 10:00 AM - 11:30 AM",
    location: "Room 203, Economics Building",
    materials: [
      { id: 1, title: "Course Syllabus", type: "pdf", size: "420 KB" },
      { id: 2, title: "Lecture Notes Week 1", type: "pdf", size: "1.2 MB" },
      { id: 3, title: "Assignment 1", type: "docx", size: "350 KB" },
    ],
    prerequisites: ["None"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    code: "ECON201",
    title: "Macroeconomic Theory",
    instructor: "Prof. Sarah Johnson",
    department: "Economics",
    semester: "Spring",
    level: "Undergraduate",
    credits: 4,
    description:
      "This course examines the economy as a whole, including topics such as economic growth, inflation, unemployment, and monetary and fiscal policy.",
    schedule: "Tuesday, Thursday 1:00 PM - 2:30 PM",
    location: "Room 105, Economics Building",
    materials: [
      { id: 1, title: "Course Syllabus", type: "pdf", size: "380 KB" },
      { id: 2, title: "Macroeconomics Textbook", type: "pdf", size: "15.7 MB" },
    ],
    prerequisites: ["ECON101"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    code: "FIN301",
    title: "Financial Management",
    instructor: "Dr. Mohammad Karimi",
    department: "Finance",
    semester: "Fall",
    level: "Undergraduate",
    credits: 3,
    description:
      "This course provides an introduction to the theory, methods, and concepts of business finance, with an emphasis on financial decision-making.",
    schedule: "Monday, Wednesday, Friday 9:00 AM - 10:00 AM",
    location: "Room 302, Business Building",
    materials: [
      { id: 1, title: "Course Syllabus", type: "pdf", size: "450 KB" },
      {
        id: 2,
        title: "Financial Calculator Guide",
        type: "pdf",
        size: "2.3 MB",
      },
    ],
    prerequisites: ["ECON101", "ACCT201"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    code: "STAT202",
    title: "Business Statistics",
    instructor: "Prof. Fatima Ahmadi",
    department: "Statistics",
    semester: "Spring",
    level: "Undergraduate",
    credits: 3,
    description:
      "This course covers statistical concepts and methods useful in analyzing business and economic data, including probability, sampling, estimation, and hypothesis testing.",
    schedule: "Tuesday, Thursday 10:00 AM - 11:30 AM",
    location: "Room 201, Mathematics Building",
    materials: [
      { id: 1, title: "Course Syllabus", type: "pdf", size: "320 KB" },
      { id: 2, title: "Statistical Tables", type: "pdf", size: "1.5 MB" },
      { id: 3, title: "Practice Problems", type: "pdf", size: "2.1 MB" },
    ],
    prerequisites: ["MATH101"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    code: "ECON405",
    title: "International Economics",
    instructor: "Dr. John Smith",
    department: "Economics",
    semester: "Fall",
    level: "Graduate",
    credits: 4,
    description:
      "This course examines international trade theory and policy, balance of payments, foreign exchange markets, and international monetary systems.",
    schedule: "Monday, Wednesday 2:00 PM - 3:30 PM",
    location: "Room 405, Economics Building",
    materials: [
      { id: 1, title: "Course Syllabus", type: "pdf", size: "410 KB" },
      {
        id: 2,
        title: "International Trade Models",
        type: "pptx",
        size: "5.3 MB",
      },
    ],
    prerequisites: ["ECON201", "ECON301"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    code: "MGT301",
    title: "Principles of Management",
    instructor: "Prof. Zahra Noori",
    department: "Management",
    semester: "Spring",
    level: "Undergraduate",
    credits: 3,
    description:
      "This course introduces students to the fundamental concepts of management, including planning, organizing, leading, and controlling.",
    schedule: "Tuesday, Thursday 3:00 PM - 4:30 PM",
    location: "Room 203, Business Building",
    materials: [
      { id: 1, title: "Course Syllabus", type: "pdf", size: "380 KB" },
      { id: 2, title: "Case Studies", type: "pdf", size: "3.2 MB" },
    ],
    prerequisites: ["None"],
    image: "/placeholder.svg?height=200&width=300",
  },
];
