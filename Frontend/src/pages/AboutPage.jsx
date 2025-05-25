import React from "react";

import { useEffect, useState, useRef } from "react";
import {
  BookOpen,
  Award,
  Users,
  Calendar,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Home,
  ExternalLink,
  Clock,
  Search,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";

function AboutPage() {
  const { t, language } = useLanguage();
  const [departments, setDepartments] = useState([]);
  const [studentCount, setStudentCount] = useState(1200);
  const [facultyMemberCount, setFacultyMemberCount] = useState(45);
  const [academicProgramCount, setAcademicProgramCount] = useState(8);
  const [researchPaperCount, setResearchPaperCount] = useState(120);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleSections, setVisibleSections] = useState({});
  const [animatedCounts, setAnimatedCounts] = useState({
    students: 0,
    faculty: 0,
    programs: 0,
    research: 0,
  });

  // State for department modals
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);

  // Refs for sections to observe
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const overviewRef = useRef(null);
  const missionRef = useRef(null);
  const deanRef = useRef(null);
  const departmentsRef = useRef(null);
  const historyRef = useRef(null);
  const contactRef = useRef(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // For demonstration, using placeholder data
        // In production, uncomment the fetch calls and use actual API endpoints

        // Simulating API responses with placeholder data

        //  Uncomment for actual API calls
        // Fetch departments data
        const departmentsResponse = await fetch(
          "http://localhost:4400/api/v1/departments/"
        );
        const departmentsData = await departmentsResponse.json();

        // Fetch student count
        const studentCountResponse = await fetch(
          "http://localhost:4400/api/v1/students/studentcount"
        );
        const studentCountData = await studentCountResponse.json();

        // Fetch faculty member count
        const facultyMemberCountResponse = await fetch(
          "http://127.0.0.1:4400/api/v1/teachers/count"
        );
        const facultyMemberCountData = await facultyMemberCountResponse.json();

        // Fetch academic program count
        const academicProgramCountResponse = await fetch(
          "http://127.0.0.1:4400/api/v1/departments/programcount"
        );
        const academicProgramCountData =
          await academicProgramCountResponse.json();

        // Fetch research paper count
        const researchPaperCountResponse = await fetch(
          "http://localhost:4400/api/v1/departments/researchPaperCount"
        );
        const researchPaperCountData = await researchPaperCountResponse.json();

        // Update state with fetched data
        if (departmentsData.status === "success") {
          setDepartments(departmentsData.data.departments);
        }

        setStudentCount(studentCountData);
        setFacultyMemberCount(facultyMemberCountData);
        setAcademicProgramCount(academicProgramCountData);
        setResearchPaperCount(researchPaperCountData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Parallax effect for hero section
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        heroRef.current.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id || entry.target.dataset.section;
          if (sectionId) {
            setVisibleSections((prev) => ({
              ...prev,
              [sectionId]: true,
            }));

            // Start count animation for stats section
            if (sectionId === "stats" && !visibleSections.stats) {
              animateCounters();
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all section refs
    const refs = [
      { ref: overviewRef, id: "overview" },
      { ref: statsRef, id: "stats" },
      { ref: missionRef, id: "mission" },
      { ref: deanRef, id: "dean" },
      { ref: departmentsRef, id: "departments" },
      { ref: historyRef, id: "history" },
      { ref: contactRef, id: "contact" },
    ];

    refs.forEach(({ ref, id }) => {
      if (ref.current) {
        ref.current.dataset.section = id;
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach(({ ref }) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, [visibleSections]);

  // Function to animate counters
  const animateCounters = () => {
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);

    let frame = 0;
    const countTargets = {
      students: studentCount,
      faculty: facultyMemberCount,
      programs: academicProgramCount,
      research: researchPaperCount,
    };

    const counter = setInterval(() => {
      frame++;

      const progress = frame / totalFrames;
      const easeOutQuad = (t) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);

      setAnimatedCounts({
        students: Math.floor(easedProgress * countTargets.students),
        faculty: Math.floor(easedProgress * countTargets.faculty),
        programs: Math.floor(easedProgress * countTargets.programs),
        research: Math.floor(easedProgress * countTargets.research),
      });

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);
  };

  // Department icon mapping
  const getDepartmentIcon = (departmentName) => {
    const iconMap = {
      'Economics': <BookOpen className='h-8 w-8 text-[#F7B500]' />,
      'Business Administration': <Users className='h-8 w-8 text-[#F7B500]' />,
      'Finance': <Award className='h-8 w-8 text-[#F7B500]' />,
      'Statistics': <Calendar className='h-8 w-8 text-[#F7B500]' />,
      'Management': <Users className='h-8 w-8 text-[#F7B500]' />,
      'Accounting': <BookOpen className='h-8 w-8 text-[#F7B500]' />,
      'Marketing': <Award className='h-8 w-8 text-[#F7B500]' />,
      'Banking': <Calendar className='h-8 w-8 text-[#F7B500]' />,
    };

    // Find matching icon or return default
    const matchedKey = Object.keys(iconMap).find(key =>
      departmentName.toLowerCase().includes(key.toLowerCase())
    );

    return matchedKey ? iconMap[matchedKey] : <BookOpen className='h-8 w-8 text-[#F7B500]' />;
  };

  // Department handlers
  const handleReadMore = (department) => {
    setSelectedDepartment(department);
    setShowDepartmentModal(true);
  };

  const closeDepartmentModal = () => {
    setShowDepartmentModal(false);
    setSelectedDepartment(null);
  };



  // Determine text direction based on language
  const isRTL = language === "dr" || language === "ps";
  const textDirection = isRTL ? "rtl" : "ltr";

  return (
    <div
      className={`min-h-screen bg-[#F9F9F9] ${textDirection}`}
      dir={textDirection}
    >
      <Navbar />

      {/* Hero Section */}
      <div
        ref={heroRef}
        className='pt-16 relative bg-[#1D3D6F] text-white overflow-hidden'
        // style={{
        //   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        //   backgroundBlendMode: "overlay",
        // }}
      >
        {/* Decorative elements */}
        <div className='absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-[#004B87] to-transparent rounded-full filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2'></div>
        <div className='absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-t from-[#F7B500] to-transparent rounded-full filter blur-3xl opacity-10 transform -translate-x-1/2 translate-y-1/2'></div>

        {/* Breadcrumb */}
        <div className='container mx-auto px-4 pt-6'>
          <div className='flex items-center text-sm text-white/70'>
            <a href='/' className='hover:text-white flex items-center'>
              <Home className='h-3.5 w-3.5 mr-1' />
              <span>Home</span>
            </a>
            <ChevronRight className='h-3.5 w-3.5 mx-2' />
            <span className='text-white'>About Us</span>
          </div>
        </div>

        <div className='container mx-auto px-4 py-12 md:py-20'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='max-w-2xl mb-10 md:mb-0'>
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-white'>
                About <span className='text-[#F7B500]'>Our Faculty</span>
              </h1>
              <p className='mt-4 text-white/90 text-lg md:text-xl leading-relaxed'>
                {t(
                  "Learn about the Faculty of Economics at Kandahar University, our mission, vision, and commitment to academic excellence."
                )}
              </p>

              <div className='mt-8 flex flex-wrap gap-4'>
                <a
                  href='#mission'
                  className='px-6 py-3 bg-[#F7B500] text-[#1D3D6F] font-bold rounded-lg hover:bg-[#F7B500]/90 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                >
                  {t("Our Mission")}
                </a>
                <a
                  href='#contact'
                  className='px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/20 transition border border-white/20'
                >
                  {t("Contact Us")}
                </a>
              </div>
            </div>

            <div className='relative w-full max-w-md'>
              <div className='absolute inset-0 bg-gradient-to-r from-[#004B87] to-[#1D3D6F] rounded-2xl transform rotate-3 scale-95 opacity-20 blur-xl'></div>
              <div className='relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                <h3 className='text-xl font-bold mb-4 flex items-center'>
                  <Search className='h-5 w-5 mr-2' />
                  {t("Quick Facts")}
                </h3>
                <div className='space-y-4'>
                  <div className='flex justify-between items-center border-b border-white/20 pb-3'>
                    <span className='text-white/80'>{t("Established")}</span>
                    <span className='text-white font-semibold'>2010</span>
                  </div>
                  <div className='flex justify-between items-center border-b border-white/20 pb-3'>
                    <span className='text-white/80'>{t("Departments")}</span>
                    <span className='text-white font-semibold'>4</span>
                  </div>
                  <div className='flex justify-between items-center border-b border-white/20 pb-3'>
                    <span className='text-white/80'>{t("Programs")}</span>
                    <span className='text-white font-semibold'>
                      {academicProgramCount}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-white/80'>{t("Location")}</span>
                    <span className='text-white font-semibold'>
                      {t("Kandahar")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className='absolute bottom-0 left-0 right-0 h-16 overflow-hidden'>
          <svg
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
            className='absolute bottom-0 left-0 w-full h-full text-[#F9F9F9] fill-current'
          >
            <path d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0z'></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-16'>
        {/* Overview Section */}
        <section ref={overviewRef} data-section='overview' className='mb-20'>
          <div
            className={`max-w-4xl mx-auto text-center transition-all duration-1000 ease-out ${
              visibleSections.overview
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className='inline-flex items-center justify-center mb-4'>
              <div className='h-0.5 w-6 bg-[#F7B500]'></div>
              <span className='mx-2 text-[#F7B500] font-semibold'>
                OVERVIEW
              </span>
              <div className='h-0.5 w-6 bg-[#F7B500]'></div>
            </div>
            <h2 className='text-3xl md:text-4xl font-bold mb-6 text-[#1D3D6F]'>
              {t("Faculty Overview")}
            </h2>
            <p className='text-gray-600 text-lg leading-relaxed'>
              {t(
                "The Faculty of Economics at Kandahar University is one of the leading educational institutions in Afghanistan dedicated to providing quality education in economics, finance, business management, and statistics. Established in 2002, our faculty has been committed to academic excellence and preparing students for successful careers in the economic and business sectors."
              )}
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section
          ref={statsRef}
          id='stats'
          data-section='stats'
          className='mb-20 -mt-4'
        >
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 ease-out ${
              visibleSections.stats
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {[
              {
                label: t("Students"),
                value: studentCount,
                icon: <Users className='h-6 w-6 text-[#F7B500]' />,
              },
              {
                label: t("Faculty"),
                value: facultyMemberCount,
                icon: <BookOpen className='h-6 w-6 text-[#F7B500]' />,
              },
              {
                label: t("Programs"),
                value: academicProgramCount,
                icon: <Award className='h-6 w-6 text-[#F7B500]' />,
              },
              {
                label: t("Research Papers"),
                value: researchPaperCount,
                icon: <Calendar className='h-6 w-6 text-[#F7B500]' />,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className='relative overflow-hidden bg-white rounded-xl shadow-md p-6 transform hover:-translate-y-1 transition-all duration-300'
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Decorative elements */}
                <div className='absolute -top-6 -right-6 w-16 h-16 bg-[#1D3D6F]/5 rounded-full'></div>
                <div className='absolute -bottom-8 -left-8 w-24 h-24 bg-[#F7B500]/5 rounded-full blur-md'></div>

                <div className='relative z-10 flex items-center'>
                  <div className='bg-[#1D3D6F]/10 p-3 rounded-lg mr-4'>
                    {stat.icon}
                  </div>
                  <div>
                    <p className='text-3xl font-bold text-[#1D3D6F]'>
                      {stat.value}+
                    </p>
                    <p className='text-gray-600'>{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission, Vision, Values Section */}
        <section
          ref={missionRef}
          id='mission'
          data-section='mission'
          className='mb-20'
        >
          <div
            className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-1000 ease-out ${
              visibleSections.mission
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className='inline-flex items-center justify-center mb-4'>
              <div className='h-0.5 w-6 bg-[#F7B500]'></div>
              <span className='mx-2 text-[#F7B500] font-semibold'>
                OUR PRINCIPLES
              </span>
              <div className='h-0.5 w-6 bg-[#F7B500]'></div>
            </div>
            <h2 className='text-3xl md:text-4xl font-bold mb-6 text-[#1D3D6F]'>
              {t("Mission, Vision & Values")}
            </h2>
            <p className='text-gray-600 text-lg'>
              {t(
                "Our guiding principles shape our approach to education, research, and community engagement."
              )}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
              {
                title: t("Our Mission"),
                icon: <BookOpen className='h-8 w-8 text-[#F7B500]' />,
                content: t(
                  "To provide high-quality education in economics and business disciplines, conduct impactful research, and contribute to the economic development of Afghanistan through knowledge creation and dissemination."
                ),
              },
              {
                title: t("Our Vision"),
                icon: <Award className='h-8 w-8 text-[#F7B500]' />,
                content: t(
                  "To be recognized as a center of excellence in economics education and research in Afghanistan and the region, producing graduates who are innovative, ethical, and capable of addressing complex economic challenges."
                ),
              },
              {
                title: t("Our Values"),
                icon: <Users className='h-8 w-8 text-[#F7B500]' />,
                content: (
                  <ul className='space-y-3'>
                    {[
                      {
                        title: t("Academic Excellence"),
                        description: t(
                          "We are committed to maintaining high standards in teaching, learning, and research."
                        ),
                      },
                      {
                        title: t("Integrity"),
                        description: t(
                          "We uphold ethical principles and promote honesty and transparency in all our activities."
                        ),
                      },
                      {
                        title: t("Innovation"),
                        description: t(
                          "We encourage creative thinking and innovative approaches to economic challenges."
                        ),
                      },
                      {
                        title: t("Inclusivity"),
                        description: t(
                          "We value diversity and provide equal opportunities for all students and staff."
                        ),
                      },
                    ].map((value, index) => (
                      <li key={index} className='flex items-start'>
                        <ChevronRight className='h-5 w-5 text-[#F7B500] mt-0.5 mr-2 flex-shrink-0' />
                        <div>
                          <span className='font-medium text-[#1D3D6F]'>
                            {value.title}:
                          </span>{" "}
                          <span className='text-gray-600'>
                            {value.description}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ),
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden bg-white backdrop-blur-sm bg-opacity-80 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 transform ${
                  visibleSections.mission
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                  transitionProperty: "transform, opacity, box-shadow",
                }}
              >
                {/* Decorative elements */}
                <div className='absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-[#004B87]/10 to-[#1D3D6F]/5 rounded-full blur-xl'></div>
                <div className='absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-tr from-[#F7B500]/10 to-[#F4B400]/5 rounded-full blur-lg'></div>

                <div className='relative z-10'>
                  <div className='mb-6 relative'>
                    <div className='absolute inset-0 bg-gradient-to-r from-[#004B87] to-[#1D3D6F] rounded-full opacity-10 blur-md transform scale-110'></div>
                    <div className='relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#004B87] to-[#1D3D6F] text-white'>
                      {item.icon}
                    </div>
                  </div>

                  <h3 className='text-2xl font-bold mb-4 text-[#1D3D6F] group-hover:text-[#004B87] transition-colors'>
                    {item.title}
                  </h3>

                  {typeof item.content === "string" ? (
                    <p className='text-gray-600 mb-6'>{item.content}</p>
                  ) : (
                    item.content
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dean's Message Section */}
        <section ref={deanRef} data-section='dean' className='mb-20'>
          <div
            className={`relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-1000 ease-out ${
              visibleSections.dean
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className='grid grid-cols-1 md:grid-cols-3'>
              <div className='bg-gradient-to-br from-[#1D3D6F] to-[#0F2A5C] p-8 text-white'>
                <h3 className='text-2xl font-bold mb-8'>
                  {t("Dean's Message")}
                </h3>
                <div className='mb-8'>
                  <div className='w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm border-4 border-[#F7B500] mx-auto flex items-center justify-center text-5xl font-bold text-white relative overflow-hidden'>
                    <div className='absolute inset-0 bg-gradient-to-br from-[#1D3D6F]/50 to-[#0F2A5C]/50 backdrop-blur-sm'></div>
                    <span className='relative z-10'>AA</span>
                  </div>
                </div>
                <div className='text-center'>
                  <h4 className='text-xl font-semibold'>
                    {t("Dr. Ahmad Ahmadi")}
                  </h4>
                  <p className='text-white/80 mt-1'>
                    {t("Dean, Faculty of Economics")}
                  </p>
                </div>
              </div>
              <div className='md:col-span-2 p-8'>
                <p className='text-gray-600 leading-relaxed mb-6 text-lg'>
                  {t(
                    "Welcome to the Faculty of Economics at Kandahar University. Our faculty is dedicated to providing a stimulating learning environment where students can develop their knowledge and skills in economics and business disciplines. We are committed to academic excellence, innovative research, and community engagement."
                  )}
                </p>
                <p className='text-gray-600 leading-relaxed mb-6 text-lg'>
                  {t(
                    "Our goal is to prepare our graduates to become future leaders who can contribute to the economic development of Afghanistan. I invite you to explore our programs and join our academic community."
                  )}
                </p>
                <button className='bg-[#1D3D6F] hover:bg-[#2C4F85] text-white rounded-lg px-6 py-3 flex items-center transition-all duration-300 transform hover:scale-105'>
                  {t("Read Full Message")}
                  <ArrowRight className='ml-2 h-4 w-4' />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Departments Section */}
        <section
          ref={departmentsRef}
          data-section='departments'
          className='mb-20'
        >
          <div
            className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-1000 ease-out ${
              visibleSections.departments
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className='inline-flex items-center justify-center mb-4'>
              <div className='h-0.5 w-6 bg-[#F7B500]'></div>
              <span className='mx-2 text-[#F7B500] font-semibold'>
                ACADEMICS
              </span>
              <div className='h-0.5 w-6 bg-[#F7B500]'></div>
            </div>
            <h2 className='text-3xl md:text-4xl font-bold mb-6 text-[#1D3D6F]'>
              {t("Our Departments")}
            </h2>
            <p className='text-gray-600 text-lg'>
              {t(
                "Explore our specialized departments offering comprehensive education in various fields of economics and business."
              )}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {loading ? (
              // Loading skeletons
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className='bg-white rounded-xl shadow-md p-6 animate-pulse'
                  >
                    <div className='flex items-center justify-center w-14 h-14 rounded-full bg-gray-200 mb-4'></div>
                    <div className='h-6 bg-gray-200 rounded w-3/4 mb-3'></div>
                    <div className='h-4 bg-gray-200 rounded mb-2'></div>
                    <div className='h-4 bg-gray-200 rounded mb-2'></div>
                    <div className='h-4 bg-gray-200 rounded w-2/3 mb-4'></div>
                    <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                  </div>
                ))
            ) : error ? (
              <div className='col-span-2 text-center py-8'>
                <p className='text-red-500'>{error}</p>
              </div>
            ) : departments.length > 0 ? (
              departments.map((dept, index) => (
                <div
                  key={dept._id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-500 transform ${
                    visibleSections.departments
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className='h-3 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85]'></div>
                  <div className='p-6'>
                    <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1D3D6F]/10 mb-4 hover:bg-[#1D3D6F]/20 transition-colors'>
                      {getDepartmentIcon(dept.name)}
                    </div>
                    <h4 className='text-xl font-semibold mb-3 text-[#1D3D6F]'>
                      {t(dept.name)}
                    </h4>
                    <p className='text-gray-600 mb-4 line-clamp-3'>{t(dept.description)}</p>
                    <div className='flex justify-between items-center text-sm text-gray-500 mb-4'>
                      <div className='flex items-center'>
                        <Clock className='h-4 w-4 mr-1 text-[#1D3D6F]' />
                        {t("4-Year Program")}
                      </div>
                      <div className='flex items-center'>
                        <Calendar className='h-4 w-4 mr-1 text-[#1D3D6F]' />
                        {t("Fall & Spring Intake")}
                      </div>
                    </div>
                    <button
                      onClick={() => handleReadMore(dept)}
                      className='inline-flex items-center text-[#1D3D6F] font-medium hover:text-[#F7B500] transition hover:translate-x-1 duration-300 cursor-pointer'
                    >
                      {t("Learn more")}{" "}
                      <ChevronRight className='h-4 w-4 ml-1 transition-transform hover:translate-x-1' />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className='col-span-2 text-center py-8'>
                <p className='text-[#1D3D6F]'>{t("No departments found.")}</p>
              </div>
            )}
          </div>
        </section>

        {/* History Section */}
        <section ref={historyRef} data-section='history' className='mb-20'>
          <div
            className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-1000 ease-out ${
              visibleSections.history
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className='inline-flex items-center justify-center mb-4'>
              <div className='h-0.5 w-6 bg-[#F7B500]'></div>
              <span className='mx-2 text-[#F7B500] font-semibold'>
                HERITAGE
              </span>
              <div className='h-0.5 w-6 bg-[#F7B500]'></div>
            </div>
            <h2 className='text-3xl md:text-4xl font-bold mb-6 text-[#1D3D6F]'>
              {t("Our History")}
            </h2>
            <p className='text-gray-600 text-lg'>
              {t(
                "Tracing our journey from establishment to becoming a leading institution in economics education."
              )}
            </p>
          </div>

          <div className='max-w-4xl mx-auto'>
            <div
              className={`bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-1000 ease-out ${
                visibleSections.history
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className='p-8'>
                <div className='flex flex-col md:flex-row gap-8 items-center'>
                  <div className='md:w-1/3'>
                    <div className='relative'>
                      <div className='aspect-square rounded-2xl bg-[#1D3D6F]/5 overflow-hidden flex items-center justify-center'>
                        <div className='text-6xl font-bold text-[#1D3D6F]'>
                          2002
                        </div>
                      </div>
                      <div className='absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-[#F7B500] flex items-center justify-center transform rotate-12 shadow-lg'>
                        <div className='text-2xl font-bold text-[#1D3D6F] transform -rotate-12'>
                          20+
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='md:w-2/3'>
                    <p className='text-gray-600 leading-relaxed text-lg'>
                      {t(
                        "The Faculty of Economics at Kandahar University was established in 2002 as part of the university's expansion efforts. Starting with just two departments and a handful of students, the faculty has grown significantly over the years."
                      )}
                    </p>
                    <p className='text-gray-600 leading-relaxed text-lg mt-4'>
                      {t(
                        "In 2010, we introduced our first Master's program, and by 2015, we had expanded to four specialized departments. Throughout our history, we have remained committed to providing quality education and contributing to Afghanistan's economic development through research and community engagement."
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section ref={contactRef} id='contact' data-section='contact'>
          <div
            className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-1000 ease-out ${
              visibleSections.contact
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className='inline-flex items-center justify-center mb-4'>
              <div className='h-0.5 w-6 bg-[#F7B500]'></div>
              <span className='mx-2 text-[#F7B500] font-semibold'>
                GET IN TOUCH
              </span>
              <div className='h-0.5 w-6 bg-[#F7B500]'></div>
            </div>
            <h2 className='text-3xl md:text-4xl font-bold mb-6 text-[#1D3D6F]'>
              {t("Contact Us")}
            </h2>
            <p className='text-gray-600 text-lg'>
              {t(
                "Have questions or need more information? We're here to help."
              )}
            </p>
          </div>

          <div
            className={`bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-1000 ease-out ${
              visibleSections.contact
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className='grid grid-cols-1 md:grid-cols-2'>
              <div className='bg-gradient-to-br from-[#1D3D6F] to-[#0F2A5C] p-8 text-white'>
                <h3 className='text-2xl md:text-3xl font-bold mb-8'>
                  {t("Get In Touch")}
                </h3>
                <div className='space-y-6'>
                  <div className='flex items-start'>
                    <div className='flex-shrink-0 mt-1 bg-[#2C4F85] p-3 rounded-lg transition-transform duration-300 hover:scale-110'>
                      <MapPin className='h-6 w-6 text-[#F7B500]' />
                    </div>
                    <div className='ml-4'>
                      <p className='text-white text-lg'>
                        {t(
                          "Kandahar University, Faculty of Economics, Kandahar, Afghanistan"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0 bg-[#2C4F85] p-3 rounded-lg transition-transform duration-300 hover:scale-110'>
                      <Phone className='h-6 w-6 text-[#F7B500]' />
                    </div>
                    <div className='ml-4'>
                      <p className='text-white text-lg'>+93 70 000 0000</p>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0 bg-[#2C4F85] p-3 rounded-lg transition-transform duration-300 hover:scale-110'>
                      <Mail className='h-6 w-6 text-[#F7B500]' />
                    </div>
                    <div className='ml-4'>
                      <p className='text-white text-lg'>info@kufe.edu.af</p>
                    </div>
                  </div>
                </div>
                <div className='mt-8'>
                  <button className='bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] font-bold rounded-lg px-6 py-3 transition-all duration-300 transform hover:scale-105 flex items-center'>
                    {t("Visit Us")}
                    <ExternalLink className='ml-2 h-4 w-4' />
                  </button>
                </div>

                <div className='mt-8 pt-8 border-t border-white/20'>
                  <h4 className='text-xl font-semibold mb-4'>
                    {t("Office Hours")}
                  </h4>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-white/80'>
                        {t("Saturday - Thursday")}
                      </span>
                      <span className='text-white'>8:00 AM - 4:00 PM</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-white/80'>{t("Friday")}</span>
                      <span className='text-white'>{t("Closed")}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='aspect-auto h-full min-h-[400px] relative'>
                <iframe
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3390.0517185453!2d65.7008!3d31.6133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDM2JzQ3LjkiTiA2NcKwNDInMDIuOSJF!5e0!3m2!1sen!2sus!4v1619099477556!5m2!1sen!2sus'
                  width='100%'
                  height='100%'
                  style={{ border: 0 }}
                  allowFullScreen=''
                  loading='lazy'
                  className='absolute inset-0'
                  title='Kandahar University Map'
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className='py-16 mt-20'>
          <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1D3D6F] to-[#004B87] shadow-xl'>
            {/* Decorative elements */}
            <div className='absolute top-0 right-0 w-64 h-64 bg-[#F7B500] rounded-full mix-blend-overlay filter blur-3xl opacity-20 transform translate-x-1/3 -translate-y-1/3'></div>
            <div className='absolute bottom-0 left-0 w-64 h-64 bg-[#F7B500] rounded-full mix-blend-overlay filter blur-3xl opacity-10 transform -translate-x-1/3 translate-y-1/3'></div>

            <div className='relative z-10 p-8 md:p-12 lg:p-16'>
              <div className='flex flex-col md:flex-row md:items-center justify-between gap-10'>
                <div className='max-w-2xl'>
                  <h2 className='text-3xl md:text-4xl font-bold mb-4 text-white'>
                    {t("Ready to Begin Your")}{" "}
                    <span className='text-[#F7B500]'>
                      {t("Academic Journey")}
                    </span>
                    ?
                  </h2>
                  <p className='text-white/90 text-lg leading-relaxed mb-8'>
                    {t(
                      "Take the next step in your academic career. Apply now to join our programs at the Faculty of Economics and be part of a community dedicated to excellence and innovation."
                    )}
                  </p>
                  <div className='flex flex-wrap gap-4'>
                    <a
                      href='#'
                      className='px-8 py-4 bg-[#F7B500] text-[#1D3D6F] font-bold rounded-lg hover:bg-[#F7B500]/90 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center'
                    >
                      {t("Apply Now")}
                      <ArrowRight className='ml-2 h-5 w-5' />
                    </a>
                    <a
                      href='#'
                      className='px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/20 transition border border-white/20 flex items-center'
                    >
                      {t("Request Information")}
                      <ExternalLink className='ml-2 h-4 w-4' />
                    </a>
                  </div>
                </div>

                <div className='hidden lg:block'>
                  <div className='relative'>
                    <div className='absolute inset-0 bg-white/5 backdrop-blur-sm rounded-xl transform rotate-6 scale-95'></div>
                    <div className='relative bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20'>
                      <div className='flex items-center mb-4'>
                        <div className='w-2 h-2 rounded-full bg-red-400 mr-1.5'></div>
                        <div className='w-2 h-2 rounded-full bg-yellow-400 mr-1.5'></div>
                        <div className='w-2 h-2 rounded-full bg-green-400'></div>
                      </div>
                      <div className='space-y-3'>
                        <div className='h-4 bg-white/20 rounded w-3/4'></div>
                        <div className='h-4 bg-white/20 rounded'></div>
                        <div className='h-4 bg-white/20 rounded w-5/6'></div>
                        <div className='h-4 bg-white/20 rounded w-2/3'></div>
                      </div>
                      <div className='mt-6 flex justify-between'>
                        <div className='h-8 w-24 bg-[#F7B500] rounded'></div>
                        <div className='h-8 w-24 bg-white/20 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Department Modal */}
      {showDepartmentModal && selectedDepartment && (
        <div
          className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50'
          onClick={closeDepartmentModal}
        >
          <div
            className='bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-10'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1D3D6F]/10 mr-4'>
                    {getDepartmentIcon(selectedDepartment.name)}
                  </div>
                  <h2 className='text-2xl font-bold text-[#1D3D6F]'>
                    {t(selectedDepartment.name)}
                  </h2>
                </div>
                <button
                  onClick={closeDepartmentModal}
                  className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                >
                  <svg className='w-6 h-6 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
            </div>

            <div className='p-6'>
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-[#1D3D6F] mb-3'>Department Overview</h3>
                <p className='text-gray-600 leading-relaxed'>
                  {t(selectedDepartment.description)}
                </p>
              </div>

              {/* Mission, Vision, Values Grid */}
              <div className='grid md:grid-cols-3 gap-6 mb-6'>
                {/* Mission */}
                <div className='bg-blue-50 p-6 rounded-xl border border-blue-100'>
                  <div className='flex items-center mb-4'>
                    <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3'>
                      <span className='text-white font-bold text-sm'>M</span>
                    </div>
                    <h4 className='text-lg font-semibold text-blue-800'>Mission</h4>
                  </div>
                  <p className='text-blue-700 leading-relaxed'>
                    {selectedDepartment.mission || "Mission statement not available"}
                  </p>
                </div>

                {/* Vision */}
                <div className='bg-green-50 p-6 rounded-xl border border-green-100'>
                  <div className='flex items-center mb-4'>
                    <div className='w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3'>
                      <span className='text-white font-bold text-sm'>V</span>
                    </div>
                    <h4 className='text-lg font-semibold text-green-800'>Vision</h4>
                  </div>
                  <p className='text-green-700 leading-relaxed'>
                    {selectedDepartment.vision || "Vision statement not available"}
                  </p>
                </div>

                {/* Values */}
                <div className='bg-purple-50 p-6 rounded-xl border border-purple-100'>
                  <div className='flex items-center mb-4'>
                    <div className='w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3'>
                      <span className='text-white font-bold text-sm'>V</span>
                    </div>
                    <h4 className='text-lg font-semibold text-purple-800'>Values</h4>
                  </div>
                  <p className='text-purple-700 leading-relaxed'>
                    {selectedDepartment.values || "Values statement not available"}
                  </p>
                </div>
              </div>

              <div className='grid md:grid-cols-2 gap-6 mb-6'>
                <div className='bg-blue-50 p-4 rounded-lg'>
                  <h4 className='font-semibold text-[#1D3D6F] mb-2 flex items-center'>
                    <Clock className='h-5 w-5 mr-2 text-[#F7B500]' />
                    Program Duration
                  </h4>
                  <p className='text-gray-600'>4-Year Bachelor's Degree Program</p>
                </div>

                <div className='bg-green-50 p-4 rounded-lg'>
                  <h4 className='font-semibold text-[#1D3D6F] mb-2 flex items-center'>
                    <Calendar className='h-5 w-5 mr-2 text-[#F7B500]' />
                    Intake Periods
                  </h4>
                  <p className='text-gray-600'>Fall & Spring Semesters</p>
                </div>

                <div className='bg-yellow-50 p-4 rounded-lg'>
                  <h4 className='font-semibold text-[#1D3D6F] mb-2 flex items-center'>
                    <Users className='h-5 w-5 mr-2 text-[#F7B500]' />
                    Faculty Members
                  </h4>
                  <p className='text-gray-600'>Experienced Professors & Lecturers</p>
                </div>

                <div className='bg-purple-50 p-4 rounded-lg'>
                  <h4 className='font-semibold text-[#1D3D6F] mb-2 flex items-center'>
                    <Award className='h-5 w-5 mr-2 text-[#F7B500]' />
                    Degree Type
                  </h4>
                  <p className='text-gray-600'>Bachelor of Science (B.S.)</p>
                </div>
              </div>

              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-[#1D3D6F] mb-3'>Career Opportunities</h3>
                <div className='grid md:grid-cols-2 gap-3'>
                  {[
                    'Government Economic Analyst',
                    'Financial Consultant',
                    'Business Development Manager',
                    'Research Analyst',
                    'Banking Professional',
                    'Investment Advisor',
                    'Policy Researcher',
                    'Corporate Finance Specialist'
                  ].map((career, index) => (
                    <div key={index} className='flex items-center p-2 bg-gray-50 rounded-lg'>
                      <ChevronRight className='h-4 w-4 text-[#F7B500] mr-2' />
                      <span className='text-gray-700'>{career}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-[#1D3D6F] mb-3'>Key Features</h3>
                <div className='space-y-3'>
                  <div className='flex items-start'>
                    <BookOpen className='h-5 w-5 text-[#F7B500] mr-3 mt-0.5' />
                    <div>
                      <h4 className='font-medium text-gray-800'>Comprehensive Curriculum</h4>
                      <p className='text-gray-600 text-sm'>Modern curriculum designed to meet industry standards</p>
                    </div>
                  </div>
                  <div className='flex items-start'>
                    <Users className='h-5 w-5 text-[#F7B500] mr-3 mt-0.5' />
                    <div>
                      <h4 className='font-medium text-gray-800'>Expert Faculty</h4>
                      <p className='text-gray-600 text-sm'>Learn from experienced professors and industry professionals</p>
                    </div>
                  </div>
                  <div className='flex items-start'>
                    <Award className='h-5 w-5 text-[#F7B500] mr-3 mt-0.5' />
                    <div>
                      <h4 className='font-medium text-gray-800'>Research Opportunities</h4>
                      <p className='text-gray-600 text-sm'>Engage in cutting-edge research projects and publications</p>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AboutPage;
