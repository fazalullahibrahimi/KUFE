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
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
                <button className='bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] font-bold py-3 px-6 rounded-lg transition shadow-md'>
                  {t("Browse_Courses")}
                </button>
                <button className='bg-transparent hover:bg-white/10 text-white border border-white font-medium py-3 px-6 rounded-lg transition'>
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
                    <a
                      href='#'
                      className='inline-flex items-center text-[#1D3D6F] font-medium hover:text-[#F7B500] transition group-hover:translate-x-1 duration-300'
                    >
                      {t("Learn_More")}{" "}
                      <ChevronRight
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "mr-1 rotate-180" : "ml-1"
                        } transition-transform group-hover:translate-x-1`}
                      />
                    </a>
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
                <div className='space-y-4'>
                  <div>
                    <label className='block text-white/90 text-sm mb-1'>
                      {t("Student_ID")}
                    </label>
                    <input
                      type='text'
                      className='w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7B500] text-white'
                      placeholder={t("Student_ID_Placeholder")}
                    />
                  </div>
                  <div>
                    <label className='block text-white/90 text-sm mb-1'>
                      {t("Semester")}
                    </label>
                    <select className='w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7B500] text-white'>
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
                  <button className='w-full bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] font-bold py-3 rounded-lg transition shadow-md'>
                    {t("Start_Registration")}
                  </button>
                </div>
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
function CourseDetail({ course, onBackClick, t, direction }) {
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
                    },
                    {
                      id: 2,
                      title: "Course Syllabus",
                      type: "doc",
                      size: "PDF, 1.2 MB",
                    },
                    {
                      id: 3,
                      title: "Assignment Guidelines",
                      type: "doc",
                      size: "PDF, 0.8 MB",
                    },
                  ]
                ).map((material) => (
                  <li
                    key={material.id}
                    className='p-4 hover:bg-gray-50 transition-colors'
                  >
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center'>
                        <div className='bg-[#1D3D6F] text-white p-2 rounded-lg mr-3 uppercase text-xs'>
                          {material.type}
                        </div>
                        <span className='text-[#1D3D6F] font-medium'>
                          {material.title}
                        </span>
                      </div>
                      <div className='flex items-center'>
                        <span className='text-xs text-gray-500 mr-3'>
                          {material.size}
                        </span>
                        <button className='bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center'>
                          <Download
                            className={`h-4 w-4 ${
                              direction === "rtl" ? "ml-1" : "mr-1"
                            }`}
                          />{" "}
                          {t("Download_Templates")}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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
                  <button className='w-full bg-[#F7B500] text-[#1D3D6F] py-3 rounded-lg font-medium hover:bg-[#F7B500]/90 transition-colors flex items-center justify-center'>
                    <Calendar
                      className={`h-5 w-5 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {t("Register_Course")}
                  </button>
                  <button className='w-full bg-white border border-[#1D3D6F] text-[#1D3D6F] py-3 rounded-lg font-medium hover:bg-[#1D3D6F]/5 transition-colors flex items-center justify-center'>
                    <FileText
                      className={`h-5 w-5 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {t("Download_Syllabus")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
