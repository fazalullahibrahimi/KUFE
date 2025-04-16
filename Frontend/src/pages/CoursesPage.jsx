// import React from "react";
// import { useState, useEffect } from "react";
// import { Search, Filter, ChevronDown } from "lucide-react";
// import CourseCard from "../components/courses/CourseCard";
// import CourseFilter from "../components/courses/CourseFilter";
// import CourseDetail from "../components/courses/CourseDetail";

// export default function CoursesPage() {
//   const [courses, setCourses] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showFilters, setShowFilters] = useState(false);
//   const [activeFilters, setActiveFilters] = useState({
//     department: "all",
//     semester: "all",
//     level: "all",
//   });

//   // Fetch courses data
//   useEffect(() => {
//     // In a real application, this would be an API call
//     const fetchCourses = async () => {
//       setIsLoading(true);
//       try {
//         // Simulating API call with timeout
//         setTimeout(() => {
//           setCourses(sampleCourses);
//           setFilteredCourses(sampleCourses);
//           setIsLoading(false);
//         }, 1000);
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//         setIsLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   // Handle search and filtering
//   useEffect(() => {
//     let results = courses;

//     // Apply search filter
//     if (searchTerm) {
//       results = results.filter(
//         (course) =>
//           course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           course.code.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Apply department filter
//     if (activeFilters.department !== "all") {
//       results = results.filter(
//         (course) => course.department === activeFilters.department
//       );
//     }

//     // Apply semester filter
//     if (activeFilters.semester !== "all") {
//       results = results.filter(
//         (course) => course.semester === activeFilters.semester
//       );
//     }

//     // Apply level filter
//     if (activeFilters.level !== "all") {
//       results = results.filter(
//         (course) => course.level === activeFilters.level
//       );
//     }

//     setFilteredCourses(results);
//   }, [searchTerm, activeFilters, courses]);

//   const handleCourseClick = (course) => {
//     setSelectedCourse(course);
//   };

//   const handleBackClick = () => {
//     setSelectedCourse(null);
//   };

//   const handleFilterChange = (filterType, value) => {
//     setActiveFilters((prev) => ({
//       ...prev,
//       [filterType]: value,
//     }));
//   };

//   return (
//     <div className='min-h-screen bg-[#F9F9F9]'>
//       {/* Header */}
//       <div className='bg-[#004B87] text-white py-8'>
//         <div className='container mx-auto px-4'>
//           <h1 className='text-3xl md:text-4xl font-bold font-[Poppins]'>
//             Course Catalog
//           </h1>
//           <p className='mt-2 text-lg font-[Roboto] opacity-90'>
//             Browse and search through our comprehensive list of courses
//           </p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className='container mx-auto px-4 py-8'>
//         {selectedCourse ? (
//           <CourseDetail course={selectedCourse} onBackClick={handleBackClick} />
//         ) : (
//           <>
//             {/* Search and Filter Bar */}
//             <div className='mb-8 bg-white rounded-lg shadow-md p-4'>
//               <div className='flex flex-col md:flex-row gap-4'>
//                 <div className='relative flex-grow'>
//                   <Search
//                     className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
//                     size={20}
//                   />
//                   <input
//                     type='text'
//                     placeholder='Search courses by title, instructor, or code...'
//                     className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] font-[Roboto]'
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
//                 <button
//                   className='flex items-center gap-2 bg-[#F4B400] text-[#333333] px-4 py-2 rounded-md font-medium hover:bg-[#e5a800] transition-colors font-[Roboto]'
//                   onClick={() => setShowFilters(!showFilters)}
//                 >
//                   <Filter size={20} />
//                   Filters
//                   <ChevronDown
//                     size={16}
//                     className={`transition-transform ${
//                       showFilters ? "rotate-180" : ""
//                     }`}
//                   />
//                 </button>
//               </div>

//               {/* Filters */}
//               {showFilters && (
//                 <CourseFilter
//                   activeFilters={activeFilters}
//                   onFilterChange={handleFilterChange}
//                 />
//               )}
//             </div>

//             {/* Results Stats */}
//             <div className='mb-4 flex justify-between items-center'>
//               <p className='text-[#333333] font-[Roboto]'>
//                 Showing {filteredCourses.length} of {courses.length} courses
//               </p>
//               <div className='flex items-center gap-2'>
//                 <span className='text-sm text-gray-500 font-[Roboto]'>
//                   Sort by:
//                 </span>
//                 <select className='border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#004B87] font-[Roboto]'>
//                   <option value='title'>Title (A-Z)</option>
//                   <option value='code'>Course Code</option>
//                   <option value='semester'>Semester</option>
//                 </select>
//               </div>
//             </div>

//             {/* Course Listings */}
//             {isLoading ? (
//               <div className='flex justify-center items-center h-64'>
//                 <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#004B87]'></div>
//               </div>
//             ) : filteredCourses.length > 0 ? (
//               <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
//                 {filteredCourses.map((course) => (
//                   <CourseCard
//                     key={course.id}
//                     course={course}
//                     onClick={() => handleCourseClick(course)}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className='text-center py-12'>
//                 <div className='text-5xl mb-4'>🔍</div>
//                 <h3 className='text-xl font-semibold mb-2 font-[Poppins] text-[#333333]'>
//                   No courses found
//                 </h3>
//                 <p className='text-gray-500 font-[Roboto]'>
//                   Try adjusting your search or filters to find what you're
//                   looking for.
//                 </p>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// // Sample data for demonstration
// const sampleCourses = [
//   {
//     id: 1,
//     code: "ECON101",
//     title: "Principles of Microeconomics",
//     instructor: "Dr. Ahmad Ahmadi",
//     department: "Economics",
//     semester: "Fall",
//     level: "Undergraduate",
//     credits: 3,
//     description:
//       "This course introduces students to the principles of microeconomics, focusing on the behavior of individuals and firms in making decisions regarding the allocation of limited resources.",
//     schedule: "Monday, Wednesday 10:00 AM - 11:30 AM",
//     location: "Room 203, Economics Building",
//     materials: [
//       { id: 1, title: "Course Syllabus", type: "pdf", size: "420 KB" },
//       { id: 2, title: "Lecture Notes Week 1", type: "pdf", size: "1.2 MB" },
//       { id: 3, title: "Assignment 1", type: "docx", size: "350 KB" },
//     ],
//     prerequisites: ["None"],
//     image: "/placeholder.svg?height=200&width=300",
//   },
//   {
//     id: 2,
//     code: "ECON201",
//     title: "Macroeconomic Theory",
//     instructor: "Prof. Sarah Johnson",
//     department: "Economics",
//     semester: "Spring",
//     level: "Undergraduate",
//     credits: 4,
//     description:
//       "This course examines the economy as a whole, including topics such as economic growth, inflation, unemployment, and monetary and fiscal policy.",
//     schedule: "Tuesday, Thursday 1:00 PM - 2:30 PM",
//     location: "Room 105, Economics Building",
//     materials: [
//       { id: 1, title: "Course Syllabus", type: "pdf", size: "380 KB" },
//       { id: 2, title: "Macroeconomics Textbook", type: "pdf", size: "15.7 MB" },
//     ],
//     prerequisites: ["ECON101"],
//     image: "/placeholder.svg?height=200&width=300",
//   },
//   {
//     id: 3,
//     code: "FIN301",
//     title: "Financial Management",
//     instructor: "Dr. Mohammad Karimi",
//     department: "Finance",
//     semester: "Fall",
//     level: "Undergraduate",
//     credits: 3,
//     description:
//       "This course provides an introduction to the theory, methods, and concepts of business finance, with an emphasis on financial decision-making.",
//     schedule: "Monday, Wednesday, Friday 9:00 AM - 10:00 AM",
//     location: "Room 302, Business Building",
//     materials: [
//       { id: 1, title: "Course Syllabus", type: "pdf", size: "450 KB" },
//       {
//         id: 2,
//         title: "Financial Calculator Guide",
//         type: "pdf",
//         size: "2.3 MB",
//       },
//     ],
//     prerequisites: ["ECON101", "ACCT201"],
//     image: "/placeholder.svg?height=200&width=300",
//   },
//   {
//     id: 4,
//     code: "STAT202",
//     title: "Business Statistics",
//     instructor: "Prof. Fatima Ahmadi",
//     department: "Statistics",
//     semester: "Spring",
//     level: "Undergraduate",
//     credits: 3,
//     description:
//       "This course covers statistical concepts and methods useful in analyzing business and economic data, including probability, sampling, estimation, and hypothesis testing.",
//     schedule: "Tuesday, Thursday 10:00 AM - 11:30 AM",
//     location: "Room 201, Mathematics Building",
//     materials: [
//       { id: 1, title: "Course Syllabus", type: "pdf", size: "320 KB" },
//       { id: 2, title: "Statistical Tables", type: "pdf", size: "1.5 MB" },
//       { id: 3, title: "Practice Problems", type: "pdf", size: "2.1 MB" },
//     ],
//     prerequisites: ["MATH101"],
//     image: "/placeholder.svg?height=200&width=300",
//   },
//   {
//     id: 5,
//     code: "ECON405",
//     title: "International Economics",
//     instructor: "Dr. John Smith",
//     department: "Economics",
//     semester: "Fall",
//     level: "Graduate",
//     credits: 4,
//     description:
//       "This course examines international trade theory and policy, balance of payments, foreign exchange markets, and international monetary systems.",
//     schedule: "Monday, Wednesday 2:00 PM - 3:30 PM",
//     location: "Room 405, Economics Building",
//     materials: [
//       { id: 1, title: "Course Syllabus", type: "pdf", size: "410 KB" },
//       {
//         id: 2,
//         title: "International Trade Models",
//         type: "pptx",
//         size: "5.3 MB",
//       },
//     ],
//     prerequisites: ["ECON201", "ECON301"],
//     image: "/placeholder.svg?height=200&width=300",
//   },
//   {
//     id: 6,
//     code: "MGT301",
//     title: "Principles of Management",
//     instructor: "Prof. Zahra Noori",
//     department: "Management",
//     semester: "Spring",
//     level: "Undergraduate",
//     credits: 3,
//     description:
//       "This course introduces students to the fundamental concepts of management, including planning, organizing, leading, and controlling.",
//     schedule: "Tuesday, Thursday 3:00 PM - 4:30 PM",
//     location: "Room 203, Business Building",
//     materials: [
//       { id: 1, title: "Course Syllabus", type: "pdf", size: "380 KB" },
//       { id: 2, title: "Case Studies", type: "pdf", size: "3.2 MB" },
//     ],
//     prerequisites: ["None"],
//     image: "/placeholder.svg?height=200&width=300",
//   },
// ];



import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, ChevronDown } from "lucide-react";
import CourseCard from "../components/courses/CourseCard";
import CourseFilter from "../components/courses/CourseFilter";
import CourseDetail from "../components/courses/CourseDetail";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    department: "all",
    semester: "all",
    level: "all",
  });

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://127.0.0.1:4400/api/v1/courses/");
        
        const courseData = Array.isArray(response.data?.data?.courses) ? response.data.data.courses : [];

          console.log(courseData)// Ensure courseData is an array
        console.log(courseData);
        setCourses(courseData);
        setFilteredCourses(courseData);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]); // Handle errors by setting empty array
        setFilteredCourses([]); // Ensure filtered courses are also empty
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let results = [...courses];

    if (searchTerm) {
      results = results.filter((course) =>
        course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilters.department !== "all") {
      results = results.filter(
        (course) =>
          course.department_id?.name?.toLowerCase() ===
          activeFilters.department.toLowerCase()
      );
    }

    if (activeFilters.semester !== "all") {
      results = results.filter(
        (course) =>
          course.semester?.toLowerCase() ===
          activeFilters.semester.toLowerCase()
      );
    }

    if (activeFilters.level !== "all") {
      results = results.filter(
        (course) =>
          course.level?.toLowerCase() === activeFilters.level.toLowerCase()
      );
    }

    setFilteredCourses(results);
  }, [searchTerm, activeFilters, courses]);

  const handleCourseClick = (course) => setSelectedCourse(course);
  const handleBackClick = () => setSelectedCourse(null);
  const handleFilterChange = (filterType, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <div className="bg-[#004B87] text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold font-[Poppins]">
            Course Catalog
          </h1>
          <p className="mt-2 text-lg font-[Roboto] opacity-90">
            Browse and search through our comprehensive list of courses
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {selectedCourse ? (
          <CourseDetail course={selectedCourse} onBackClick={handleBackClick} />
        ) : (
          <>
            {/* Search & Filter */}
            <div className="mb-8 bg-white rounded-lg shadow-md p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search courses by title, instructor, or code..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] font-[Roboto]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  className="flex items-center gap-2 bg-[#F4B400] text-[#333333] px-4 py-2 rounded-md font-medium hover:bg-[#e5a800] transition-colors font-[Roboto]"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={20} />
                  Filters
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {showFilters && (
                <CourseFilter
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                />
              )}
            </div>

            {/* Results Info */}
            <div className="mb-4 flex justify-between items-center">
              <p className="text-[#333333] font-[Roboto]">
                Showing {filteredCourses.length} of {courses.length} courses
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-[Roboto]">
                  Sort by:
                </span>
                <select className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#004B87] font-[Roboto]">
                  <option value="title">Title (A-Z)</option>
                  <option value="code">Course Code</option>
                  <option value="semester">Semester</option>
                </select>
              </div>
            </div>

            {/* Courses Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#004B87]"></div>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course._id || course.id}
                    course={course}
                    onClick={() => handleCourseClick(course)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2 font-[Poppins] text-[#333333]">
                  No courses found
                </h3>
                <p className="text-gray-500 font-[Roboto]">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
