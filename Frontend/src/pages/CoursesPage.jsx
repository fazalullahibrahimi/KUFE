/* eslint-disable no-unused-vars */
import React from "react";
import { useState, useEffect, useRef } from "react";
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
  GraduationCap,
  BookOpen,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Star,
  FileText,
  Grid3X3,
  ListFilter,
  User,
  Download,
  Award,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Modal from "../components/common/Modal";
import axios from "axios";
import { useLanguage } from "../contexts/LanguageContext";

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
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortOption, setSortOption] = useState("title");
  const [animatedElements, setAnimatedElements] = useState([]);

  // Modal states for Featured Academic Programs
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const { t, language, direction } = useLanguage();

  const observerRef = useRef(null);

  // Initialize intersection observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedElements((prev) => [...prev, entry.target.id]);
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Observe elements
  useEffect(() => {
    const sections = document.querySelectorAll(".animate-on-scroll");
    sections.forEach((section) => {
      if (observerRef.current && !animatedElements.includes(section.id)) {
        observerRef.current.observe(section);
      }
    });
  }, [animatedElements, courses]);

  // Fetch courses data
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
        console.log(courseData);
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
  }, [language]);

  // Handle search and filtering
  useEffect(() => {
    let results = courses;

    // Apply tab filter
    if (activeTab === "featured") {
      results = results.filter((course) => course.featured);
    } else if (activeTab === "popular") {
      results = results.filter((course) => course.popular);
    }

    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (course) =>
          course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.code?.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Apply sorting
    results = [...results].sort((a, b) => {
      if (sortOption === "title") {
        return (a.name || "").localeCompare(b.name || "");
      } else if (sortOption === "code") {
        return (a.code || "").localeCompare(b.code || "");
      } else if (sortOption === "credits") {
        return (b.credits || 0) - (a.credits || 0);
      } else if (sortOption === "semester") {
        const semesterOrder = { Fall: 1, Spring: 2, Summer: 3 };
        return (
          (semesterOrder[a.semester] || 0) - (semesterOrder[b.semester] || 0)
        );
      }
      return 0;
    });

    setFilteredCourses(results);
  }, [searchTerm, activeFilters, courses, activeTab, sortOption]);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const resetFilters = () => {
    setSearchTerm("");
    setActiveFilters({
      department: "all",
      semester: "all",
      level: "all",
    });
    setActiveTab("all");
  };

  // Handler functions for Featured Academic Programs
  const handleProgramReadMore = (program) => {
    setSelectedProgram(program);
    setShowProgramModal(true);
  };

  const closeProgramModal = () => {
    setShowProgramModal(false);
    setSelectedProgram(null);
  };



  // Handler functions for hero section buttons
  const handleBrowseCourses = () => {
    // Scroll to the course list section
    const courseListElement = document.getElementById('course-list');
    if (courseListElement) {
      courseListElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // If no courses loaded yet, scroll to course filters
      const courseFiltersElement = document.getElementById('course-filters');
      if (courseFiltersElement) {
        courseFiltersElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleViewPrograms = () => {
    // Scroll to the featured programs section
    const featuredProgramsElement = document.getElementById('featured-programs');
    if (featuredProgramsElement) {
      featuredProgramsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // If featured programs not visible, show them by resetting filters
      setActiveTab('all');
      setSearchTerm('');
      setActiveFilters({
        department: "all",
        semester: "all",
        level: "all",
      });
      // Then scroll after a short delay
      setTimeout(() => {
        const element = document.getElementById('featured-programs');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  };

  // Quick Registration functionality
  const [quickRegData, setQuickRegData] = useState({
    studentId: '',
    semester: 'fall'
  });

  const handleQuickRegistration = (e) => {
    e.preventDefault();

    if (!quickRegData.studentId.trim()) {
      alert('Please enter your Student ID');
      return;
    }

    // Create registration information modal/alert
    const registrationInfo = `
COURSE REGISTRATION INFORMATION

Student ID: ${quickRegData.studentId}
Selected Semester: ${quickRegData.semester === 'fall' ? 'Fall 2023' : quickRegData.semester === 'spring' ? 'Spring 2024' : 'Summer 2024'}

NEXT STEPS:
1. Visit the Student Portal at: portal.kufe.edu.af
2. Log in with your student credentials
3. Navigate to "Course Registration" section
4. Select your courses for the semester
5. Submit your registration

IMPORTANT NOTES:
• Registration deadlines must be observed
• Prerequisites must be completed
• Consult with your academic advisor
• Payment of fees required before registration

CONTACT SUPPORT:
Email: registrar@kufe.edu.af
Phone: +93 (0) 30 222 0100
Office: Student Services Building, Room 101

Would you like to open the Student Portal now?
`;

    const openPortal = confirm(registrationInfo);

    if (openPortal) {
      // Open student portal in new tab
      window.open('https://portal.kufe.edu.af', '_blank');
    }

    // Reset form
    setQuickRegData({
      studentId: '',
      semester: 'fall'
    });
  };

  // Handler functions for course detail downloads
  const handleDownloadSyllabus = (course) => {
    if (!course) return;

    const syllabusContent = `
FACULTY OF ECONOMICS - KANDAHAR UNIVERSITY
COURSE SYLLABUS

Course Code: ${course.code || 'N/A'}
Course Title: ${course.name || 'N/A'}
Instructor: ${course.instructor || 'N/A'}
Credits: ${course.credits || 'N/A'}
Semester: ${course.semester || 'N/A'}
Level: ${course.level || 'N/A'}
Department: ${course.department_id?.name || 'Economics'}

COURSE DESCRIPTION
${course.description || 'Course description not available.'}

LEARNING OBJECTIVES
Upon successful completion of this course, students will be able to:
• Understand key theoretical concepts in the field
• Apply analytical methods to real-world problems
• Develop critical thinking and problem-solving skills
• Communicate findings effectively through written and oral presentations
• Work collaboratively in team-based projects

COURSE OUTLINE
Week 1-2: Introduction and Fundamentals
Week 3-4: Core Concepts and Theories
Week 5-6: Practical Applications
Week 7-8: Case Studies and Analysis
Week 9-10: Advanced Topics
Week 11-12: Research and Projects
Week 13-14: Review and Assessment
Week 15-16: Final Examinations

ASSESSMENT METHODS
• Midterm Examination: 30%
• Final Examination: 40%
• Assignments and Projects: 20%
• Class Participation: 10%

REQUIRED TEXTBOOKS
• Primary textbook will be announced in class
• Additional readings will be provided
• Access to online resources and databases

PREREQUISITES
${course.prerequisites && course.prerequisites.length > 0
  ? course.prerequisites.join(', ')
  : 'No specific prerequisites required'}

ATTENDANCE POLICY
Regular attendance is mandatory. Students are expected to attend all classes.
More than 3 unexcused absences may result in course failure.

CONTACT INFORMATION
Instructor: ${course.instructor || 'TBA'}
Office Hours: To be announced
Email: Contact through department office
Department: Faculty of Economics

Generated on: ${new Date().toLocaleDateString()}
`;

    const blob = new Blob([syllabusContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${course.code || 'Course'}_Syllabus.txt`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alert(`Syllabus for ${course.name} downloaded successfully!`);
  };



  const handleDownloadBrochure = () => {
    if (!selectedProgram) return;

    // Show loading state
    const downloadBtn = document.querySelector('[data-brochure-btn]');
    const originalText = downloadBtn?.textContent;
    if (downloadBtn) {
      downloadBtn.textContent = 'Downloading...';
      downloadBtn.disabled = true;
    }

    // Map program titles to brochure file names (updated to .md files)
    const brochureFiles = {
      "Bachelor in Economics": "/brochures/Bachelor_in_Economics_Brochure.md",
      "Master in Finance": "/brochures/Master_in_Finance_Brochure.md",
      "Business Administration": "/brochures/Business_Administration_Brochure.md"
    };

    const brochureUrl = brochureFiles[selectedProgram.title];

    if (brochureUrl) {
      try {
        // Download the comprehensive brochure file
        const link = document.createElement('a');
        link.href = brochureUrl;
        link.download = `${selectedProgram.title.replace(/\s+/g, '_')}_Brochure.md`;
        link.style.display = 'none';
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Reset button and show success message
        setTimeout(() => {
          if (downloadBtn) {
            downloadBtn.textContent = originalText || 'Download Brochure';
            downloadBtn.disabled = false;
          }

          const successMessage = `
✅ ${selectedProgram.title} Brochure Downloaded Successfully!

📋 Your comprehensive program brochure includes:
• Complete program overview and curriculum
• Mission, Vision, and Values
• Career opportunities and salary information
• Admission requirements and deadlines
• Faculty profiles and expertise
• Facilities and resources
• Financial aid and scholarship options
• Contact information and important dates

📁 Check your Downloads folder for the file.
📧 For questions, contact: admissions@kufe.edu.af
          `;

          alert(successMessage);
        }, 1000);

      } catch (error) {
        console.error('Error downloading brochure:', error);

        // Reset button on error
        if (downloadBtn) {
          downloadBtn.textContent = originalText || 'Download Brochure';
          downloadBtn.disabled = false;
        }

        alert(`Error downloading brochure. Please try again or contact support at admissions@kufe.edu.af`);
      }
    } else {
      // Reset button if no file found
      if (downloadBtn) {
        downloadBtn.textContent = originalText || 'Download Brochure';
        downloadBtn.disabled = false;
      }

      alert(`Brochure for ${selectedProgram.title} is not available. Please contact admissions@kufe.edu.af for more information.`);
    }
  };

  return (
    <div dir={direction} className='min-h-screen bg-[#F5F7FA]'>
      <Navbar />

      {/* Hero Section */}
      <div className='relative bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white pt-16'>
        <div className='absolute inset-0 opacity-30 bg-[#1D3D6F]'>
          {/* Pattern overlay */}
        </div>

        <div className='container mx-auto px-4 py-12 md:py-20 relative z-10'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='max-w-2xl mb-8 md:mb-0'>
              <div className='flex items-center mb-3'>
                <span className='text-[#F7B500] text-sm font-semibold'>
                  {t("Home_Courses")}
                </span>
                <ChevronRight
                  className={`h-4 w-4 mx-1 text-gray-300 ${
                    direction === "rtl" ? "rotate-180" : ""
                  }`}
                />
                <span className='text-white text-sm'>
                  {t("Course_Catalog")}
                </span>
              </div>

              <h1 className='text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white'>
                {t("Discover_Academic_Path")}
              </h1>

              <p className='text-white text-lg md:text-xl opacity-90 mb-6'>
                {t("Course_Catalog_Description")}
              </p>

              <div className='flex flex-wrap gap-4'>
                <button
                  onClick={handleBrowseCourses}
                  className='bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] font-bold py-3 px-6 rounded-lg transition shadow-md cursor-pointer'
                >
                  {t("Browse_Courses")}
                </button>
                <button
                  onClick={handleViewPrograms}
                  className='bg-transparent hover:bg-white/10 text-white border border-white font-medium py-3 px-6 rounded-lg transition cursor-pointer'
                >
                  {t("View_Programs")}
                </button>
              </div>
            </div>

            <div className='w-full md:w-auto'>
              <div className='bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl'>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {t("Quick_Course_Finder")}
                </h3>
                <div className='relative mb-4'>
                  <Search
                    className={`absolute ${
                      direction === "rtl" ? "right-3" : "left-3"
                    } top-1/2 transform -translate-y-1/2 text-gray-400`}
                    size={20}
                  />
                  <input
                    type='text'
                    placeholder={t("Search_Course_Placeholder")}
                    className={`w-full ${
                      direction === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"
                    } py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7B500] text-white placeholder-white/60`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className='grid grid-cols-2 gap-3 mb-4'>
                  <select
                    className='py-2 px-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7B500] text-white'
                    value={activeFilters.department}
                    onChange={(e) =>
                      handleFilterChange("department", e.target.value)
                    }
                  >
                    <option value='all' className='text-gray-800'>
                      {t("All_Departments_Courses")}
                    </option>
                    <option value='Economics' className='text-gray-800'>
                      {t("Economics_Field")}
                    </option>
                    <option value='Finance' className='text-gray-800'>
                      {t("Finance_Field")}
                    </option>
                    <option value='Management' className='text-gray-800'>
                      {t("Management_Field")}
                    </option>
                  </select>
                  <select
                    className='py-2 px-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7B500] text-white'
                    value={activeFilters.level}
                    onChange={(e) =>
                      handleFilterChange("level", e.target.value)
                    }
                  >
                    <option value='all' className='text-gray-800'>
                      {t("All_Levels_Courses")}
                    </option>
                    <option value='Undergraduate' className='text-gray-800'>
                      {t("Undergraduate_Courses")}
                    </option>
                    <option value='Graduate' className='text-gray-800'>
                      {t("Graduate_Courses")}
                    </option>
                  </select>
                </div>
                <button className='w-full bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] font-bold py-3 rounded-lg transition shadow-md'>
                  {t("Find_Courses")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className='absolute bottom-0 left-0 right-0 h-16 overflow-hidden'>
          <svg
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
            className='absolute bottom-0 left-0 w-full h-full text-[#F5F7FA] fill-current'
          >
            <path d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0z'></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-8'>
        {selectedCourse ? (
          <CourseDetail
            course={selectedCourse}
            onBackClick={handleBackClick}
            onDownloadSyllabus={handleDownloadSyllabus}
            t={t}
            direction={direction}
          />
        ) : (
          <>
            {/* Course Stats */}
            <div
              id='course-stats'
              className='animate-on-scroll grid grid-cols-2 md:grid-cols-4 gap-4 -mt-8 mb-8 relative z-10'
            >
              {[
                {
                  icon: <BookOpen className='h-6 w-6 text-[#F7B500]' />,
                  label: t("Total_Courses"),
                  value: courses.length,
                },
                {
                  icon: <GraduationCap className='h-6 w-6 text-[#F7B500]' />,
                  label: t("Departments"),
                  value: "4",
                },
                {
                  icon: <Users className='h-6 w-6 text-[#F7B500]' />,
                  label: t("Faculty_Members"),
                  value: "32",
                },
                {
                  icon: <Calendar className='h-6 w-6 text-[#F7B500]' />,
                  label: t("Semesters"),
                  value: "3",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-xl shadow-md p-4 flex items-center transform transition-all duration-500 ${
                    animatedElements.includes("course-stats")
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className='bg-[#1D3D6F]/10 p-3 rounded-lg mr-4'>
                    {stat.icon}
                  </div>
                  <div>
                    <p className='text-gray-500 text-sm'>{stat.label}</p>
                    <p className='text-[#1D3D6F] text-xl font-bold'>
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs and Filters */}
            <div
              id='course-filters'
              className='animate-on-scroll bg-white rounded-xl shadow-md p-6 mb-8'
            >
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
                <div className='flex overflow-x-auto pb-2 md:pb-0 space-x-2 w-full md:w-auto'>
                  {["all", "featured", "popular"].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                        activeTab === tab
                          ? "bg-[#1D3D6F] text-white font-medium"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === "all"
                        ? t("All_Courses")
                        : tab === "featured"
                        ? t("Featured")
                        : t("Popular")}
                    </button>
                  ))}
                </div>

                <div className='flex items-center gap-3 w-full md:w-auto'>
                  <div className='relative flex-grow md:flex-grow-0 md:w-48'>
                    <Search
                      className={`absolute ${
                        direction === "rtl" ? "right-3" : "left-3"
                      } top-1/2 transform -translate-y-1/2 text-gray-400`}
                      size={18}
                    />
                    <input
                      type='text'
                      placeholder={t("Search_Courses")}
                      className={`w-full ${
                        direction === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"
                      } py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3D6F]`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      showFilters
                        ? "bg-[#1D3D6F] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter size={18} />
                    <span className='hidden md:inline'>{t("Filters")}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        showFilters ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div className='flex border border-gray-300 rounded-lg overflow-hidden'>
                    <button
                      className={`p-2 ${
                        viewMode === "grid"
                          ? "bg-[#1D3D6F] text-white"
                          : "bg-white text-gray-600"
                      }`}
                      onClick={() => setViewMode("grid")}
                      title='Grid View'
                    >
                      <Grid3X3 size={18} />
                    </button>
                    <button
                      className={`p-2 ${
                        viewMode === "list"
                          ? "bg-[#1D3D6F] text-white"
                          : "bg-white text-gray-600"
                      }`}
                      onClick={() => setViewMode("list")}
                      title='List View'
                    >
                      <ListFilter size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Filters */}
              {showFilters && (
                <CourseFilter
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                />
              )}

              {/* Results Stats */}
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center mt-4 pt-4 border-t border-gray-200'>
                <p className='text-gray-600 mb-3 md:mb-0'>
                  {t("Showing_Courses")
                    .replace("{count}", filteredCourses.length)
                    .replace("{total}", courses.length)}
                </p>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-600'>{t("Sort_By")}:</span>
                  <select
                    className='border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D3D6F]'
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value='title'>{t("Sort_By_Title")}</option>
                    <option value='code'>{t("Sort_By_Code")}</option>
                    <option value='credits'>{t("Sort_By_Credits")}</option>
                    <option value='semester'>{t("Sort_By_Semester")}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg shadow-sm'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-5 w-5 text-red-500'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm font-medium'>{t("Error")}</p>
                    <p className='text-sm'>{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className='flex flex-col items-center justify-center h-64'>
                <Loader2 className='h-12 w-12 animate-spin text-[#1D3D6F] mb-4' />
                <p className='text-[#1D3D6F] font-medium'>
                  {t("Loading_Courses")}
                </p>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div id='course-list' className='animate-on-scroll'>
                {viewMode === "grid" ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {filteredCourses.map((course, index) => (
                      <CourseCard
                        key={course.id || index}
                        course={course}
                        onClick={() => handleCourseClick(course)}
                        index={index}
                        isVisible={animatedElements.includes("course-list")}
                      />
                    ))}
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {filteredCourses.map((course, index) => (
                      <CourseListItem
                        key={course.id || index}
                        course={course}
                        onClick={() => handleCourseClick(course)}
                        index={index}
                        isVisible={animatedElements.includes("course-list")}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className='text-center py-16 bg-white rounded-xl shadow-md'>
                <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-6'>
                  <Search className='h-10 w-10' />
                </div>
                <h3 className='text-2xl font-semibold mb-3 text-[#1D3D6F]'>
                  {t("No_Courses_Found")}
                </h3>
                <p className='text-gray-500 mb-8 max-w-md mx-auto'>
                  {t("No_Courses_Description")}
                </p>
                <button
                  onClick={resetFilters}
                  className='bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] font-medium py-3 px-8 rounded-lg transition shadow-md'
                >
                  {t("Reset_Filters_Courses")}
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
          <div
            id='featured-programs'
            className='animate-on-scroll container mx-auto px-4 py-12 mt-8'
          >
            <h2 className='text-2xl md:text-3xl font-bold text-[#1D3D6F] mb-2'>
              {t("Featured_Academic_Programs")}
            </h2>
            <p className='text-gray-600 mb-8'>
              {t("Featured_Programs_Description")}
            </p>

            <div
              className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${
                animatedElements.includes("featured-programs")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              {[
                {
                  title: t("Bachelor_Economics"),
                  description: t("Bachelor_Economics_Description"),
                  icon: <Book className='h-8 w-8 text-[#F7B500]' />,
                  duration: "4 years",
                  credits: "140 credits",
                },
                {
                  title: t("Master_Finance"),
                  description: t("Master_Finance_Description"),
                  icon: <Users className='h-8 w-8 text-[#F7B500]' />,
                  duration: "2 years",
                  credits: "60 credits",
                },
                {
                  title: t("Business_Administration"),
                  description: t("Business_Administration_Description"),
                  icon: <Calendar className='h-8 w-8 text-[#F7B500]' />,
                  duration: "4 years",
                  credits: "130 credits",
                },
              ].map((program, index) => (
                <div
                  key={index}
                  className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group'
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className='h-3 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85]'></div>
                  <div className='p-6'>
                    <div className='inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#1D3D6F]/10 mb-4 group-hover:bg-[#1D3D6F]/20 transition-colors'>
                      {program.icon}
                    </div>
                    <h4 className='text-xl font-semibold mb-3 text-[#1D3D6F]'>
                      {program.title}
                    </h4>
                    <p className='text-gray-600 mb-4'>{program.description}</p>
                    <div className='flex justify-between items-center text-sm text-gray-500 mb-4'>
                      <div className='flex items-center'>
                        <Clock
                          className={`h-4 w-4 ${
                            direction === "rtl" ? "ml-1" : "mr-1"
                          } text-[#1D3D6F]`}
                        />
                        {t("Duration")}: {program.duration}
                      </div>
                      <div className='flex items-center'>
                        <FileText
                          className={`h-4 w-4 ${
                            direction === "rtl" ? "ml-1" : "mr-1"
                          } text-[#1D3D6F]`}
                        />
                        {t("Credits")}: {program.credits}
                      </div>
                    </div>
                    <button
                      onClick={() => handleProgramReadMore(program)}
                      className='inline-flex items-center text-[#1D3D6F] font-medium hover:text-[#F7B500] transition group-hover:translate-x-1 duration-300 cursor-pointer'
                    >
                      {t("Learn_More")}{" "}
                      <ChevronRight
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "mr-1 rotate-180" : "ml-1"
                        } transition-transform group-hover:translate-x-1`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Registration CTA */}
      {!selectedCourse && !isLoading && (
        <div
          id='registration-cta'
          className='animate-on-scroll container mx-auto px-4 py-8 mt-4 mb-12'
        >
          <div
            className={`relative bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] rounded-xl shadow-xl overflow-hidden transition-all duration-700 ${
              animatedElements.includes("registration-cta")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <div className='absolute inset-0 opacity-30 bg-[#1D3D6F]'>
              {/* Pattern overlay */}
            </div>

            <div className='p-8 md:p-10 flex flex-col md:flex-row items-center justify-between relative z-10'>
              <div className='mb-8 md:mb-0 md:mr-6 md:max-w-xl'>
                <h2 className='text-2xl md:text-3xl font-bold text-white mb-4'>
                  {t("Ready_Register")}
                </h2>
                <p className='text-white/90 mb-6'>
                  {t("Registration_Description")}
                </p>
                <div className='space-y-3'>
                  {[
                    t("Open_Registration"),
                    t("Flexible_Schedules"),
                    t("Expert_Faculty"),
                  ].map((item, i) => (
                    <div key={i} className='flex items-center'>
                      <CheckCircle2
                        className={`h-5 w-5 text-[#F7B500] ${
                          direction === "rtl" ? "ml-2" : "mr-2"
                        }`}
                      />
                      <span className='text-white'>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 md:min-w-[320px]'>
                <h3 className='text-xl font-semibold mb-4 text-white'>
                  {t("Quick_Registration")}
                </h3>
                <form onSubmit={handleQuickRegistration} className='space-y-4'>
                  <div>
                    <label className='block text-white/90 text-sm mb-1'>
                      {t("Student_ID")}
                    </label>
                    <input
                      type='text'
                      value={quickRegData.studentId}
                      onChange={(e) => setQuickRegData({...quickRegData, studentId: e.target.value})}
                      className='w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7B500] text-white placeholder-white/60'
                      placeholder={t("Student_ID_Placeholder")}
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-white/90 text-sm mb-1'>
                      {t("Semester")}
                    </label>
                    <select
                      value={quickRegData.semester}
                      onChange={(e) => setQuickRegData({...quickRegData, semester: e.target.value})}
                      className='w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7B500] text-white'
                    >
                      <option value='fall' className='text-gray-800'>
                        {t("Fall")} 2023
                      </option>
                      <option value='spring' className='text-gray-800'>
                        {t("Spring")} 2024
                      </option>
                      <option value='summer' className='text-gray-800'>
                        {t("Summer")} 2024
                      </option>
                    </select>
                  </div>
                  <button
                    type='submit'
                    className='w-full bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] font-bold py-3 rounded-lg transition shadow-md cursor-pointer'
                  >
                    {t("Start_Registration")}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Program Details Modal */}
      <Modal
        isOpen={showProgramModal}
        onClose={closeProgramModal}
        title=""
        size="lg"
      >
        {selectedProgram && (
          <div className="space-y-8">
            {/* Enhanced Header Section */}
            <div className="relative bg-gradient-to-br from-[#004B87] via-[#1D3D6F] to-[#2C4F85] rounded-2xl p-8 text-white overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4B400] rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F4B400] rounded-full translate-y-12 -translate-x-12"></div>
              </div>

              <div className="relative z-10 flex items-center">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl mr-6 border border-white/30">
                  <div className="text-[#F4B400] text-4xl">
                    {selectedProgram.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">{selectedProgram.title}</h3>
                  <p className="text-white/80 text-lg">Faculty of Economics • Kandahar University</p>
                  <div className="flex items-center mt-3 space-x-6">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-[#F4B400]" />
                      <span className="text-white/90">{selectedProgram.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-[#F4B400]" />
                      <span className="text-white/90">{selectedProgram.credits}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Program Overview */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100">
              <h4 className="text-2xl font-bold text-[#004B87] mb-4 flex items-center">
                <BookOpen className="h-6 w-6 mr-3 text-[#F4B400]" />
                Program Overview
              </h4>
              <p className="text-gray-700 leading-relaxed text-lg">{selectedProgram.description}</p>
            </div>

            {/* Key Information Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-[#004B87] hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-[#004B87] p-3 rounded-lg mr-4">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-[#004B87]">Program Duration</h5>
                    <p className="text-gray-600">Complete your degree in</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#F4B400]">{selectedProgram.duration}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-[#F4B400] hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-[#F4B400] p-3 rounded-lg mr-4">
                    <Award className="h-6 w-6 text-[#004B87]" />
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-[#004B87]">Credit Hours</h5>
                    <p className="text-gray-600">Total academic credits</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#004B87]">{selectedProgram.credits}</p>
              </div>
            </div>

            {/* Career Opportunities Section */}
            <div className="bg-gradient-to-br from-[#F4B400]/10 to-[#F4B400]/5 rounded-xl p-6 border border-[#F4B400]/20">
              <h5 className="text-2xl font-bold text-[#004B87] mb-6 flex items-center">
                <Users className="h-6 w-6 mr-3 text-[#F4B400]" />
                Career Opportunities
              </h5>
              <div className="grid md:grid-cols-2 gap-4">
                {selectedProgram.title === "Bachelor in Economics" && (
                  <>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#004B87]">
                      <h6 className="font-semibold text-[#004B87] mb-2">Government Sector</h6>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Economic Policy Analyst</li>
                        <li>• Budget Analyst</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#F4B400]">
                      <h6 className="font-semibold text-[#004B87] mb-2">Private Sector</h6>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Financial Consultant</li>
                        <li>• Banking Professional</li>
                      </ul>
                    </div>
                  </>
                )}
                {selectedProgram.title === "Master in Finance" && (
                  <>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#004B87]">
                      <h6 className="font-semibold text-[#004B87] mb-2">Investment Management</h6>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Investment Manager</li>
                        <li>• Portfolio Manager</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#F4B400]">
                      <h6 className="font-semibold text-[#004B87] mb-2">Corporate Finance</h6>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Financial Analyst</li>
                        <li>• Risk Manager</li>
                      </ul>
                    </div>
                  </>
                )}
                {selectedProgram.title === "Business Administration" && (
                  <>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#004B87]">
                      <h6 className="font-semibold text-[#004B87] mb-2">Management</h6>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Business Manager</li>
                        <li>• Operations Director</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#F4B400]">
                      <h6 className="font-semibold text-[#004B87] mb-2">Entrepreneurship</h6>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Entrepreneur</li>
                        <li>• Management Consultant</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Admission Requirements Section */}
            <div className="bg-gradient-to-br from-[#004B87] to-[#1D3D6F] text-white rounded-xl p-6 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#F4B400] rounded-full opacity-20 -translate-y-10 translate-x-10"></div>

              <div className="relative z-10">
                <h5 className="text-2xl font-bold mb-6 flex items-center">
                  <CheckCircle2 className="h-6 w-6 mr-3 text-[#F4B400]" />
                  Admission Requirements
                </h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <div className="bg-[#F4B400] p-2 rounded-full mr-3">
                        <GraduationCap className="h-4 w-4 text-[#004B87]" />
                      </div>
                      <span className="text-white/90">High school diploma or equivalent</span>
                    </div>
                    <div className="flex items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <div className="bg-[#F4B400] p-2 rounded-full mr-3">
                        <FileText className="h-4 w-4 text-[#004B87]" />
                      </div>
                      <span className="text-white/90">Entrance examination</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <div className="bg-[#F4B400] p-2 rounded-full mr-3">
                        <BookOpen className="h-4 w-4 text-[#004B87]" />
                      </div>
                      <span className="text-white/90">English proficiency test</span>
                    </div>
                    <div className="flex items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <div className="bg-[#F4B400] p-2 rounded-full mr-3">
                        <User className="h-4 w-4 text-[#004B87]" />
                      </div>
                      <span className="text-white/90">Personal statement</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>




          </div>
        )}
      </Modal>



      <Footer />
    </div>
  );
}

// Course Filter Component
function CourseFilter({ activeFilters, onFilterChange }) {
  const { t, direction } = useLanguage();
  return (
    <div className='pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4'>
      <div>
        <label className='block text-sm font-medium text-[#1D3D6F] mb-1'>
          {t("Department")}
        </label>
        <select
          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1D3D6F]'
          value={activeFilters.department}
          onChange={(e) => onFilterChange("department", e.target.value)}
        >
          <option value='all'>{t("All_Departments_Courses")}</option>
          <option value='Economics'>{t("Economics_Field")}</option>
          <option value='Finance'>{t("Finance_Field")}</option>
          <option value='Management'>{t("Management_Field")}</option>
          <option value='Statistics'>{t("Accounting_Field")}</option>
        </select>
      </div>
      <div>
        <label className='block text-sm font-medium text-[#1D3D6F] mb-1'>
          {t("Semester")}
        </label>
        <select
          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1D3D6F]'
          value={activeFilters.semester}
          onChange={(e) => onFilterChange("semester", e.target.value)}
        >
          <option value='all'>{t("All_Semesters")}</option>
          <option value='Fall'>{t("Fall")}</option>
          <option value='Spring'>{t("Spring")}</option>
          <option value='Summer'>{t("Summer")}</option>
        </select>
      </div>
      <div>
        <label className='block text-sm font-medium text-[#1D3D6F] mb-1'>
          {t("Level")}
        </label>
        <select
          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1D3D6F]'
          value={activeFilters.level}
          onChange={(e) => onFilterChange("level", e.target.value)}
        >
          <option value='all'>{t("All_Levels_Courses")}</option>
          <option value='Undergraduate'>{t("Undergraduate_Courses")}</option>
          <option value='Graduate'>{t("Graduate_Courses")}</option>
        </select>
      </div>
    </div>
  );
}

// Course Card Component
function CourseCard({ course, onClick, index, isVisible }) {
  const { t, direction } = useLanguage();
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
      onClick={() => onClick(course)}
    >
      <div className='h-48 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] relative'>
        <img
          src={
            course.image
              ? `http://localhost:4400/public/img/courses/${course.image}`
              : "/placeholder.svg?height=200&width=300"
          }
          alt={course.name}
          className='w-full h-full object-cover mix-blend-overlay'
          onError={(e) => {
            e.target.src = "/placeholder.svg?height=200&width=300";
          }}
        />
        <div className='absolute top-0 left-0 w-full h-full p-4 flex flex-col justify-between'>
          <div className='flex justify-between'>
            <span className='bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-2 py-1 rounded-md'>
              {course.department_id?.name || "Department"}
            </span>
            <span className='bg-white text-[#1D3D6F] text-xs font-bold px-2 py-1 rounded-md'>
              {course.code}
            </span>
          </div>
          <h3 className='text-white text-xl font-semibold line-clamp-2 drop-shadow-md'>
            {course.name}
          </h3>
        </div>
      </div>
      <div className='p-5'>
        <div className='flex justify-between items-center mb-3'>
          <span className='text-sm text-gray-500 flex items-center'>
            <Calendar
              className={`h-4 w-4 ${
                direction === "rtl" ? "ml-1" : "mr-1"
              } text-[#1D3D6F]`}
            />
            {t(course.semester)} {t("Semester_Label")}
          </span>
          <span className='text-sm font-medium bg-[#1D3D6F]/10 text-[#1D3D6F] px-2 py-1 rounded-full'>
            {course.credits} {t("Credits_Label")}
          </span>
        </div>
        <p className='text-[#1D3D6F] font-medium mb-2 flex items-center'>
          <User
            className={`h-4 w-4 ${
              direction === "rtl" ? "ml-1" : "mr-1"
            } text-[#1D3D6F]`}
          />
          {course.instructor}
        </p>
        <p className='text-gray-600 text-sm line-clamp-2 mb-4 h-10'>
          {course.description}
        </p>
        <div className='flex justify-between items-center'>
          <span className='text-xs bg-[#E8ECEF] text-[#1D3D6F] px-2 py-1 rounded-full'>
            {t(course.level + "_Courses")}
          </span>
          <button className='text-[#1D3D6F] text-sm font-medium hover:text-[#F7B500] transition-colors flex items-center'>
            {t("View_Details")}{" "}
            <ChevronRight
              className={`h-4 w-4 ${
                direction === "rtl" ? "mr-1 rotate-180" : "ml-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// Course List Item Component
function CourseListItem({ course, onClick, index, isVisible }) {
  const { t, direction } = useLanguage();
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
      onClick={() => onClick(course)}
    >
      <div className='flex flex-col md:flex-row'>
        <div className='w-full md:w-64 h-40 md:h-auto bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] relative'>
          <img
            src={
              course.image
                ? `http://localhost:4400/public/img/courses/${course.image}`
                : "/placeholder.svg?height=200&width=300"
            }
            alt={course.name}
            className='w-full h-full object-cover mix-blend-overlay'
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=200&width=300";
            }}
          />
          <div className='absolute top-0 left-0 w-full h-full p-4 flex flex-col justify-between'>
            <div className='flex justify-between'>
              <span className='bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-2 py-1 rounded-md'>
                {course.department_id?.name || "Department"}
              </span>
              <span className='bg-white text-[#1D3D6F] text-xs font-bold px-2 py-1 rounded-md'>
                {course.code}
              </span>
            </div>
          </div>
        </div>
        <div className='p-5 flex-1'>
          <div className='flex flex-col md:flex-row justify-between'>
            <div>
              <h3 className='text-xl font-semibold text-[#1D3D6F] mb-2'>
                {course.name}
              </h3>
              <p className='text-[#1D3D6F] font-medium mb-2 flex items-center'>
                <User className='h-4 w-4 mr-1 text-[#1D3D6F]' />
                {course.instructor}
              </p>
              <p className='text-gray-600 text-sm line-clamp-2 mb-4'>
                {course.description}
              </p>
            </div>
            <div className='flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 md:gap-4 mt-2 md:mt-0 md:ml-4'>
              <span className='text-sm font-medium bg-[#1D3D6F]/10 text-[#1D3D6F] px-3 py-1 rounded-full'>
                {course.credits} {t("Credits_Label")}
              </span>
              <span className='text-sm text-gray-500 flex items-center'>
                <Calendar
                  className={`h-4 w-4 ${
                    direction === "rtl" ? "ml-1" : "mr-1"
                  } text-[#1D3D6F]`}
                />
                {t(course.semester)}
              </span>
              <span className='text-xs bg-[#E8ECEF] text-[#1D3D6F] px-2 py-1 rounded-full'>
                {t(course.level + "_Courses")}
              </span>
            </div>
          </div>
          <div className='flex justify-between items-center mt-3 pt-3 border-t border-gray-100'>
            <div className='flex items-center text-sm text-gray-500'>
              <MapPin
                className={`h-4 w-4 ${
                  direction === "rtl" ? "ml-1" : "mr-1"
                } text-[#1D3D6F]`}
              />
              {course.location || t("Location")}
              <span className='mx-2'>•</span>
              <Clock
                className={`h-4 w-4 ${
                  direction === "rtl" ? "ml-1" : "mr-1"
                } text-[#1D3D6F]`}
              />
              {course.schedule || "MWF 10:00-11:30"}
            </div>
            <button className='text-[#1D3D6F] text-sm font-medium hover:text-[#F7B500] transition-colors flex items-center'>
              {t("View_Details")}{" "}
              <ChevronRight
                className={`h-4 w-4 ${
                  direction === "rtl" ? "mr-1 rotate-180" : "ml-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Course Detail Component
function CourseDetail({ course, onBackClick, onDownloadSyllabus, t, direction }) {
  return (
    <div className='bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn'>
      <div className='bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white p-6'>
        <button
          onClick={onBackClick}
          className='mb-4 flex items-center text-white hover:text-[#F7B500] transition-colors'
        >
          <ArrowLeft
            className={`${direction === "rtl" ? "ml-2" : "mr-2"} h-4 w-4 ${
              direction === "rtl" ? "rotate-180" : ""
            }`}
          />{" "}
          {t("Back_To_Courses")}
        </button>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div>
            <div className='flex flex-wrap items-center gap-2 mb-3'>
              <span className='bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-2 py-1 rounded-md'>
                {course.department_id?.name || "Department"}
              </span>
              <span className='bg-white text-[#1D3D6F] text-xs font-bold px-2 py-1 rounded-md'>
                {course.code}
              </span>
              <span className='bg-[#E8ECEF] text-[#1D3D6F] text-xs font-bold px-2 py-1 rounded-md'>
                {course.level}
              </span>
            </div>
            <h1 className='text-2xl md:text-3xl font-bold'>{course.name}</h1>
            <p className='mt-2 text-white/90 flex items-center'>
              <User className='h-4 w-4 mr-2' />
              Instructor: {course.instructor}
            </p>
          </div>
          <div className='bg-white/10 backdrop-blur-sm px-5 py-3 rounded-lg text-center border border-white/20'>
            <p className='text-sm opacity-80'>Credits</p>
            <p className='text-3xl font-bold'>{course.credits}</p>
          </div>
        </div>
      </div>

      <div className='p-6 md:p-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='md:col-span-2'>
            <div className='bg-[#F5F7FA] rounded-xl p-5 mb-8'>
              <div className='flex items-center mb-4'>
                <div className='bg-[#1D3D6F] p-2 rounded-lg mr-3'>
                  <BookOpen className='h-5 w-5 text-white' />
                </div>
                <h2 className='text-xl font-semibold text-[#1D3D6F]'>
                  {t("Course_Overview")}
                </h2>
              </div>
              <p className='text-gray-700 leading-relaxed'>
                {course.description}
              </p>
            </div>

            <h2 className='text-xl font-semibold mb-4 text-[#1D3D6F] flex items-center'>
              <Star
                className={`h-5 w-5 ${
                  direction === "rtl" ? "ml-2" : "mr-2"
                } text-[#F7B500]`}
              />
              {t("Learning_Outcomes")}
            </h2>
            <div className='bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-8'>
              <ul className='space-y-3'>
                {(
                  course.outcomes || [
                    "Understand key theoretical concepts in the field",
                    "Apply analytical methods to real-world problems",
                    "Develop critical thinking and problem-solving skills",
                    "Communicate findings effectively through written and oral presentations",
                    "Work collaboratively in team-based projects",
                  ]
                ).map((outcome, index) => (
                  <li key={index} className='flex items-start'>
                    <CheckCircle2 className='h-5 w-5 text-[#1D3D6F] mr-2 flex-shrink-0 mt-0.5' />
                    <span className='text-gray-700'>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            <h2 className='text-xl font-semibold mb-4 text-[#1D3D6F]'>
              {t("Prerequisites")}
            </h2>
            {course.prerequisites && course.prerequisites.length > 0 ? (
              <div className='bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-8'>
                <ul className='divide-y divide-gray-100'>
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} className='py-3 flex items-center'>
                      <div
                        className={`bg-[#1D3D6F]/10 p-2 rounded-lg ${
                          direction === "rtl" ? "ml-3" : "mr-3"
                        }`}
                      >
                        <BookOpen className='h-4 w-4 text-[#1D3D6F]' />
                      </div>
                      <span className='text-gray-700'>{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className='bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-8 text-center'>
                <p className='text-gray-500'>{t("No_Prerequisites")}</p>
              </div>
            )}

            <h2 className='text-xl font-semibold mb-4 text-[#1D3D6F]'>
              {t("Course_Materials")}
            </h2>
            <div className='bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8'>
              <ul className='divide-y divide-gray-100'>
                {(
                  course.materials || [
                    {
                      id: 1,
                      title: "Introduction to Economics Textbook",
                      type: "book",
                      size: "PDF, 8.5 MB",
                      description: "Primary textbook covering fundamental economic principles"
                    },
                    {
                      id: 2,
                      title: "Course Syllabus",
                      type: "doc",
                      size: "PDF, 1.2 MB",
                      description: "Complete course outline and requirements"
                    },
                    {
                      id: 3,
                      title: "Lecture Notes Collection",
                      type: "doc",
                      size: "PDF, 3.4 MB",
                      description: "Comprehensive lecture notes and examples"
                    },
                    {
                      id: 4,
                      title: "Case Studies",
                      type: "doc",
                      size: "PDF, 2.1 MB",
                      description: "Real-world economic case studies for analysis"
                    },
                  ]
                ).map((material) => (
                  <li
                    key={material.id}
                    className='p-4 hover:bg-gray-50 transition-colors'
                  >
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center flex-1'>
                        <div className='bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white p-3 rounded-lg mr-4 uppercase text-xs font-bold min-w-[50px] text-center'>
                          {material.type}
                        </div>
                        <div className='flex-1'>
                          <h4 className='text-[#1D3D6F] font-semibold text-lg mb-1'>
                            {material.title}
                          </h4>
                          <p className='text-gray-600 text-sm mb-1'>
                            {material.description}
                          </p>
                          <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
                            {material.size}
                          </span>
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium'>
                          Available in Class
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Advanced Templates Section */}
            <div className='mt-8'>
              <h2 className='text-xl font-semibold mb-6 text-[#1D3D6F] flex items-center'>
                <Download className='h-6 w-6 mr-2 text-[#F7B500]' />
                Course Templates & Resources
              </h2>

              <div className='grid md:grid-cols-3 gap-6'>
                {/* Assignment Template */}
                <div className='bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group'>
                  <div className='flex items-center mb-4'>
                    <div className='bg-blue-500 text-white p-3 rounded-lg mr-3 group-hover:scale-110 transition-transform'>
                      <FileText className='h-6 w-6' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-blue-900'>Assignment Template</h3>
                      <p className='text-sm text-blue-700'>Professional format</p>
                    </div>
                  </div>
                  <p className='text-blue-800 text-sm mb-4 leading-relaxed'>
                    Structured template for course assignments with proper formatting guidelines,
                    citation requirements, and submission standards.
                  </p>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full'>
                      .TXT Format
                    </span>
                    <button
                      onClick={() => {
                        const content = `ASSIGNMENT TEMPLATE - Faculty of Economics
Student Name: ___________________
Student ID: ___________________
Course: ${course.name || 'Course Name'}
Assignment Title: ___________________
Due Date: ___________________

INSTRUCTIONS:
1. Read assignment requirements carefully
2. Follow formatting guidelines below
3. Include proper citations (APA format)
4. Submit before deadline via student portal

ASSIGNMENT CONTENT:
[Write your assignment content here]

ANALYSIS SECTION:
[Provide detailed analysis with supporting evidence]

CONCLUSION:
[Summarize key findings and insights]

REFERENCES:
[List all sources in APA format]

FORMATTING REQUIREMENTS:
- Font: Times New Roman, 12pt
- Spacing: Double-spaced
- Margins: 1 inch all sides
- Page numbers: Top right corner

Submission Date: ___________________`;

                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `${course.code || 'Course'}_Assignment_Template.txt`;
                        link.click();
                        window.URL.revokeObjectURL(url);
                        alert('Assignment template downloaded successfully!');
                      }}
                      className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center'
                    >
                      <Download className='h-4 w-4 mr-1' />
                      Download
                    </button>
                  </div>
                </div>

                {/* Project Report Template */}
                <div className='bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group'>
                  <div className='flex items-center mb-4'>
                    <div className='bg-green-500 text-white p-3 rounded-lg mr-3 group-hover:scale-110 transition-transform'>
                      <Book className='h-6 w-6' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-green-900'>Project Report Template</h3>
                      <p className='text-sm text-green-700'>Research format</p>
                    </div>
                  </div>
                  <p className='text-green-800 text-sm mb-4 leading-relaxed'>
                    Comprehensive template for research projects including methodology,
                    analysis sections, and professional presentation standards.
                  </p>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full'>
                      .TXT Format
                    </span>
                    <button
                      onClick={() => {
                        const content = `PROJECT REPORT TEMPLATE - Faculty of Economics
PROJECT TITLE: ___________________
STUDENT NAME: ___________________
STUDENT ID: ___________________
COURSE: ${course.name || 'Course Name'}
INSTRUCTOR: ${course.instructor || 'Instructor Name'}
DATE: ___________________

EXECUTIVE SUMMARY
[Brief overview of project objectives, methodology, and key findings]

1. INTRODUCTION
1.1 Background and Context
[Provide background information and context for the project]

1.2 Problem Statement
[Clearly define the problem or research question]

1.3 Objectives
[List primary and secondary objectives]

2. LITERATURE REVIEW
[Review relevant academic sources and previous research]

3. METHODOLOGY
3.1 Research Design
[Describe research approach and design]

3.2 Data Collection
[Explain data collection methods and sources]

3.3 Analysis Methods
[Detail analytical techniques used]

4. ANALYSIS AND FINDINGS
4.1 Data Analysis
[Present analysis results with charts/tables]

4.2 Key Findings
[Highlight main discoveries and insights]

5. DISCUSSION
5.1 Interpretation of Results
[Discuss implications of findings]

5.2 Limitations
[Acknowledge study limitations]

6. CONCLUSIONS AND RECOMMENDATIONS
[Summarize findings and provide recommendations]

7. REFERENCES
[List all sources in APA format]

8. APPENDICES
[Include supporting materials]`;

                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `${course.code || 'Course'}_Project_Report_Template.txt`;
                        link.click();
                        window.URL.revokeObjectURL(url);
                        alert('Project report template downloaded successfully!');
                      }}
                      className='bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center'
                    >
                      <Download className='h-4 w-4 mr-1' />
                      Download
                    </button>
                  </div>
                </div>

                {/* Presentation Template */}
                <div className='bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group'>
                  <div className='flex items-center mb-4'>
                    <div className='bg-purple-500 text-white p-3 rounded-lg mr-3 group-hover:scale-110 transition-transform'>
                      <Users className='h-6 w-6' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-purple-900'>Presentation Template</h3>
                      <p className='text-sm text-purple-700'>Slide structure</p>
                    </div>
                  </div>
                  <p className='text-purple-800 text-sm mb-4 leading-relaxed'>
                    Professional presentation structure with slide guidelines,
                    timing recommendations, and best practices for academic presentations.
                  </p>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full'>
                      .TXT Format
                    </span>
                    <button
                      onClick={() => {
                        const content = `PRESENTATION TEMPLATE - Faculty of Economics
COURSE: ${course.name || 'Course Name'}
PRESENTER: ___________________
STUDENT ID: ___________________
DATE: ___________________
DURATION: 15-20 minutes

SLIDE STRUCTURE GUIDE

SLIDE 1: TITLE SLIDE
- Presentation Title
- Student Name and ID
- Course: ${course.name || 'Course Name'}
- Date
- University Logo

SLIDE 2: AGENDA/OUTLINE
- Overview of topics to be covered
- Estimated timing for each section

SLIDE 3: INTRODUCTION
- Background and context
- Problem statement or research question
- Objectives of the presentation

SLIDE 4-5: LITERATURE REVIEW/BACKGROUND
- Key theories and concepts
- Previous research findings
- Theoretical framework

SLIDE 6-8: METHODOLOGY (if applicable)
- Research approach
- Data collection methods
- Analysis techniques

SLIDE 9-12: MAIN CONTENT/ANALYSIS
- Key findings and results
- Data visualization (charts, graphs)
- Supporting evidence
- Case studies or examples

SLIDE 13-14: DISCUSSION
- Interpretation of results
- Implications and significance
- Limitations and challenges

SLIDE 15: CONCLUSIONS
- Summary of key findings
- Recommendations
- Future research directions

SLIDE 16: REFERENCES
- Key academic sources
- APA format citations

SLIDE 17: THANK YOU & QUESTIONS
- Contact information
- Open for questions and discussion

PRESENTATION TIPS:
✓ Keep slides simple and uncluttered
✓ Use bullet points instead of paragraphs
✓ Include relevant visuals and charts
✓ Practice timing (aim for 15-20 minutes)
✓ Prepare for Q&A session
✓ Maintain eye contact with audience
✓ Speak clearly and at appropriate pace

TECHNICAL REQUIREMENTS:
- Font: Arial or Calibri, minimum 24pt
- High contrast colors
- Consistent formatting
- Save as PDF for compatibility`;

                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `${course.code || 'Course'}_Presentation_Template.txt`;
                        link.click();
                        window.URL.revokeObjectURL(url);
                        alert('Presentation template downloaded successfully!');
                      }}
                      className='bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center'
                    >
                      <Download className='h-4 w-4 mr-1' />
                      Download
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Resources */}
              <div className='mt-6 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white p-6 rounded-xl'>
                <h3 className='font-semibold text-lg mb-3 flex items-center'>
                  <CheckCircle2 className='h-5 w-5 mr-2 text-[#F7B500]' />
                  Template Usage Guidelines
                </h3>
                <div className='grid md:grid-cols-2 gap-4 text-sm'>
                  <div>
                    <h4 className='font-medium mb-2 text-[#F7B500]'>Before Using Templates:</h4>
                    <ul className='space-y-1 text-gray-200'>
                      <li>• Read course-specific requirements</li>
                      <li>• Check assignment guidelines</li>
                      <li>• Verify formatting standards</li>
                      <li>• Confirm submission deadlines</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className='font-medium mb-2 text-[#F7B500]'>Academic Standards:</h4>
                    <ul className='space-y-1 text-gray-200'>
                      <li>• Follow APA citation format</li>
                      <li>• Maintain academic integrity</li>
                      <li>• Use proper grammar and spelling</li>
                      <li>• Include original analysis</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className='bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden sticky top-4'>
              <div className='bg-[#1D3D6F] text-white p-4'>
                <h2 className='text-lg font-semibold'>
                  {t("Course_Information")}
                </h2>
              </div>
              <div className='p-5'>
                <ul className='space-y-4'>
                  <li className='flex justify-between items-center pb-3 border-b border-gray-100'>
                    <span className='text-gray-600 flex items-center'>
                      <BookOpen
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-2" : "mr-2"
                        } text-[#1D3D6F]`}
                      />
                      {t("Department_Label")}:
                    </span>
                    <span className='font-medium text-[#1D3D6F]'>
                      {course.department_id?.name || t("Department")}
                    </span>
                  </li>
                  <li className='flex justify-between items-center pb-3 border-b border-gray-100'>
                    <span className='text-gray-600 flex items-center'>
                      <Calendar
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-2" : "mr-2"
                        } text-[#1D3D6F]`}
                      />
                      {t("Semester_Label")}:
                    </span>
                    <span className='font-medium text-[#1D3D6F]'>
                      {t(course.semester)}
                    </span>
                  </li>
                  <li className='flex justify-between items-center pb-3 border-b border-gray-100'>
                    <span className='text-gray-600 flex items-center'>
                      <GraduationCap
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-2" : "mr-2"
                        } text-[#1D3D6F]`}
                      />
                      {t("Level_Label")}:
                    </span>
                    <span className='font-medium text-[#1D3D6F]'>
                      {t(course.level + "_Courses")}
                    </span>
                  </li>
                  <li className='flex justify-between items-center pb-3 border-b border-gray-100'>
                    <span className='text-gray-600 flex items-center'>
                      <Book
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-2" : "mr-2"
                        } text-[#1D3D6F]`}
                      />
                      {t("Credits_Label")}:
                    </span>
                    <span className='font-medium text-[#1D3D6F]'>
                      {course.credits}
                    </span>
                  </li>
                </ul>

                <div className='mt-6'>
                  <h3 className='text-lg font-semibold mb-4 text-[#1D3D6F]'>
                    {t("Schedule")}
                  </h3>
                  <div className='space-y-3 bg-[#F5F7FA] p-4 rounded-lg'>
                    <div className='flex items-center'>
                      <Calendar
                        className={`h-5 w-5 ${
                          direction === "rtl" ? "ml-2" : "mr-2"
                        } text-[#1D3D6F]`}
                      />
                      <span className='text-gray-700'>
                        {course.schedule || "MWF 10:00-11:30"}
                      </span>
                    </div>
                    <div className='flex items-center'>
                      <MapPin
                        className={`h-5 w-5 ${
                          direction === "rtl" ? "ml-2" : "mr-2"
                        } text-[#1D3D6F]`}
                      />
                      <span className='text-gray-700'>
                        {course.location || t("Location")}
                      </span>
                    </div>
                    <div className='flex items-center'>
                      <Clock
                        className={`h-5 w-5 ${
                          direction === "rtl" ? "ml-2" : "mr-2"
                        } text-[#1D3D6F]`}
                      />
                      <span className='text-gray-700'>
                        {t("Duration_Weeks").replace("{weeks}", "16")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='mt-6 space-y-3'>
                  <button
                    onClick={() => onDownloadSyllabus(course)}
                    className='w-full bg-[#F7B500] text-[#1D3D6F] py-3 rounded-lg font-medium hover:bg-[#F7B500]/90 transition-colors flex items-center justify-center cursor-pointer'
                  >
                    <FileText
                      className={`h-5 w-5 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {t("Download_Syllabus")}
                  </button>
                  <div className='bg-blue-50 p-3 rounded-lg'>
                    <p className='text-sm text-blue-800 text-center'>
                      <Calendar className='h-4 w-4 inline mr-1' />
                      Course registration is handled through the Student Portal
                    </p>
                  </div>
                  <div className='bg-green-50 p-3 rounded-lg'>
                    <p className='text-sm text-green-800 text-center'>
                      <Download className='h-4 w-4 inline mr-1' />
                      Templates available in the Course Templates section above
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
