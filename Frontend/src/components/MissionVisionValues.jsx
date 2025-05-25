import React, { useEffect, useRef, useState } from "react";
import { Target, Eye, Heart, ChevronRight, X, Users, BookOpen, Award, GraduationCap, FileText } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import axios from "axios";

const MissionVisionValues = () => {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [realStats, setRealStats] = useState({
    studentCount: 0,
    teacherCount: 0,
    researchCount: 0,
    programCount: 0,
    successRate: "0%",
    loading: true,
    error: null
  });
  const sectionRef = useRef(null);

  // Set direction based on language
  const direction = ["ps", "dr"].includes(language) ? "rtl" : "ltr";

  // Modal handlers
  const handleLearnMore = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  // Fetch real statistics from APIs
  const fetchRealStats = async () => {
    try {
      setRealStats(prev => ({ ...prev, loading: true, error: null }));

      // Fetch data from multiple APIs
      const [
        universityStatsResponse,
        studentCountResponse,
        teacherCountResponse,
        researchCountResponse,
        programCountResponse
      ] = await Promise.all([
        axios.get("http://localhost:4400/api/v1/departments/university-statistics").catch(() => null),
        axios.get("http://localhost:4400/api/v1/students/studentcount").catch(() => null),
        axios.get("http://localhost:4400/api/v1/teachers/count").catch(() => null),
        axios.get("http://localhost:4400/api/v1/departments/researchPaperCount").catch(() => null),
        axios.get("http://localhost:4400/api/v1/departments/programcount").catch(() => null)
      ]);

      // Extract data with fallbacks
      let studentCount = 1200;
      let teacherCount = 50;
      let researchCount = 75;
      let programCount = 8;
      let successRate = "85%";

      // Use university statistics if available
      if (universityStatsResponse?.data?.data?.statistics) {
        const stats = universityStatsResponse.data.data.statistics;
        const studentStat = stats.find(s => s.label.toLowerCase().includes('student'));
        const teacherStat = stats.find(s => s.label.toLowerCase().includes('faculty') || s.label.toLowerCase().includes('teacher'));
        const researchStat = stats.find(s => s.label.toLowerCase().includes('research'));
        const successStat = stats.find(s => s.label.toLowerCase().includes('success') || s.label.toLowerCase().includes('rate'));

        if (studentStat) studentCount = parseInt(studentStat.number.replace(/[^0-9]/g, '')) || studentCount;
        if (teacherStat) teacherCount = parseInt(teacherStat.number.replace(/[^0-9]/g, '')) || teacherCount;
        if (researchStat) researchCount = parseInt(researchStat.number.replace(/[^0-9]/g, '')) || researchCount;
        if (successStat) successRate = successStat.number;
      }

      // Use individual API responses as backup
      if (studentCountResponse?.data) {
        studentCount = studentCountResponse.data;
      }
      if (teacherCountResponse?.data) {
        teacherCount = teacherCountResponse.data;
      }
      if (researchCountResponse?.data) {
        researchCount = researchCountResponse.data;
      }
      if (programCountResponse?.data) {
        programCount = programCountResponse.data;
      }

      setRealStats({
        studentCount,
        teacherCount,
        researchCount,
        programCount,
        successRate,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error("Error fetching real statistics:", error);
      setRealStats(prev => ({
        ...prev,
        loading: false,
        error: "Failed to load live statistics. Showing estimated values."
      }));
    }
  };

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Fetch real statistics when component mounts
  useEffect(() => {
    fetchRealStats();
  }, [language]); // Re-fetch when language changes

  const missionVisionData = [
    {
      id: "mission",
      title: t("Our Mission") || "Our Mission",
      content: t("mission_content") || "To provide exceptional economic education and research opportunities that prepare students to become leaders in the global economy.",
      detailedContent: t("mission_detailed") || "Our mission is to provide world-class economic education that combines theoretical knowledge with practical application. We are committed to developing critical thinking skills, fostering innovation, and preparing our students to tackle complex economic challenges in an increasingly interconnected world. Through rigorous academic programs, cutting-edge research, and industry partnerships, we aim to produce graduates who will become leaders in government, business, and academia.",
      objectives: [
        "Deliver high-quality undergraduate and graduate programs in economics",
        "Conduct innovative research that contributes to economic knowledge",
        "Foster critical thinking and analytical skills in our students",
        "Prepare graduates for successful careers in various economic sectors",
        "Promote ethical decision-making in economic practices"
      ],
      icon: Target,
      gradient: "from-[#004B87] to-[#003366]",
      iconBg: "bg-[#F4B400]",
      iconColor: "text-[#004B87]",
      delay: "0ms"
    },
    {
      id: "vision",
      title: t("Our Vision") || "Our Vision",
      content: t("vision_content") || "To be recognized as a leading faculty of economics in the region, known for academic excellence and innovative research.",
      detailedContent: t("vision_detailed") || "We envision becoming the premier destination for economic education in Afghanistan and the broader region. Our vision encompasses being recognized internationally for our academic excellence, groundbreaking research, and the success of our graduates. We strive to be at the forefront of economic thought, contributing to policy development and economic growth while maintaining our commitment to serving our local community and addressing regional economic challenges.",
      objectives: [
        "Achieve regional recognition for academic excellence",
        "Establish strong international partnerships and collaborations",
        "Become a leading center for economic research in Central Asia",
        "Produce graduates who lead economic development initiatives",
        "Influence economic policy at national and regional levels"
      ],
      icon: Eye,
      gradient: "from-[#F4B400] to-[#E6A200]",
      iconBg: "bg-[#004B87]",
      iconColor: "text-[#F4B400]",
      delay: "200ms"
    },
    {
      id: "values",
      title: t("Our Values") || "Our Values",
      content: t("values_content") || "Excellence in education, integrity in research, diversity and inclusion, innovation in teaching methods, and commitment to sustainable development.",
      detailedContent: t("values_detailed") || "Our core values guide every aspect of our work and define our institutional character. We believe in excellence as a standard, not an exception. Integrity forms the foundation of our research and teaching practices. We embrace diversity and promote inclusion, recognizing that different perspectives enrich our academic environment. Innovation drives our teaching methods and research approaches, while our commitment to sustainable development ensures that our work contributes to a better future for all.",
      objectives: [
        "Maintain the highest standards of academic excellence",
        "Uphold integrity and ethical practices in all activities",
        "Promote diversity, inclusion, and equal opportunities",
        "Foster innovation in teaching and research methodologies",
        "Commit to sustainable economic development practices",
        "Build strong partnerships with industry and community"
      ],
      icon: Heart,
      gradient: "from-[#004B87] via-[#003366] to-[#002244]",
      iconBg: "bg-[#F4B400]",
      iconColor: "text-[#004B87]",
      delay: "400ms"
    }
  ];

  return (
    <section
      ref={sectionRef}
      dir={direction}
      className="relative py-20 overflow-hidden"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F9F9F9] via-white to-[#F5F5F5]"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#004B87] rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F4B400] rounded-full opacity-5 translate-x-1/3 translate-y-1/3 blur-3xl"></div>

      {/* Floating geometric shapes */}
      <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-[#F4B400] rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-3/4 left-1/4 w-6 h-6 bg-[#004B87] rounded-full opacity-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 right-1/6 w-3 h-3 bg-[#F4B400] rounded-full opacity-40 animate-pulse" style={{ animationDelay: "2s" }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <div className="inline-block mb-4">
            <span className="bg-[#004B87] text-[#F4B400] text-sm font-bold py-2 px-4 rounded-full">
              {t("About Faculty") || "About Faculty"}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-poppins">
            <span className="text-[#004B87]">{t("Our") || "Our"}</span>{" "}
            <span className="text-[#F4B400]">{t("Foundation") || "Foundation"}</span>
          </h2>

          <p className="text-lg md:text-xl text-[#333333] opacity-80 max-w-3xl mx-auto font-roboto leading-relaxed">
            {t("foundation_description") || "Discover the core principles that guide our faculty towards excellence in economic education and research."}
          </p>
        </div>

        {/* Mission, Vision, Values Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10 max-w-7xl mx-auto">
          {missionVisionData.map((item, index) => {
            const IconComponent = item.icon;

            return (
              <div
                key={item.id}
                className={`group relative h-full transition-all duration-700 transform ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-16 opacity-0"
                }`}
                style={{
                  animationDelay: item.delay,
                  transitionDelay: item.delay
                }}
              >
                {/* Main Card */}
                <div className="relative h-full p-8 rounded-2xl overflow-hidden transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl">
                  {/* Background with gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-95`}
                  ></div>

                  {/* Glass effect overlay */}
                  <div
                    className="absolute inset-0 backdrop-filter backdrop-blur-sm"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  ></div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Icon */}
                    <div className="mb-6">
                      <div
                        className={`w-16 h-16 ${item.iconBg} rounded-2xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                        style={{
                          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                        }}
                      >
                        <IconComponent className={`${item.iconColor} text-2xl`} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 font-poppins">
                      {item.title}
                    </h3>

                    {/* Content */}
                    <p className="text-white/90 text-base md:text-lg leading-relaxed font-roboto flex-grow">
                      {item.content}
                    </p>

                    {/* Learn More Button */}
                    <button
                      onClick={() => handleLearnMore(item)}
                      className="mt-6 flex items-center text-white/70 group-hover:text-white transition-colors duration-300 hover:text-[#F4B400] cursor-pointer"
                    >
                      <span className="text-sm font-medium mr-2">{t("Learn More") || "Learn More"}</span>
                      <ChevronRight
                        className={`h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1 ${
                          direction === "rtl" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                </div>

                {/* Floating elements for each card */}
                <div className="absolute -top-2 -right-2 w-20 h-20 bg-white rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#F4B400] rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom decorative wave */}
        <div className="mt-20 relative">
          <svg
            className="w-full h-16 text-[#004B87] opacity-10"
            viewBox="0 0 1440 100"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
          </svg>
        </div>
      </div>

      {/* Modal for detailed information */}
      {showModal && selectedItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            dir={direction}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${selectedItem.iconBg} mr-4`}>
                    {React.createElement(selectedItem.icon, { className: `${selectedItem.iconColor} text-2xl` })}
                  </div>
                  <h2 className="text-2xl font-bold text-[#004B87] font-poppins">
                    {selectedItem.title}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Detailed Description */}
              <div>
                <h3 className="text-xl font-semibold text-[#004B87] mb-3 font-poppins">
                  {t("Overview") || "Overview"}
                </h3>
                <p className="text-gray-700 leading-relaxed font-roboto text-base">
                  {selectedItem.detailedContent}
                </p>
              </div>

              {/* Objectives/Key Points */}
              <div>
                <h3 className="text-xl font-semibold text-[#004B87] mb-4 font-poppins">
                  {selectedItem.id === "mission" && (t("Key Objectives") || "Key Objectives")}
                  {selectedItem.id === "vision" && (t("Strategic Goals") || "Strategic Goals")}
                  {selectedItem.id === "values" && (t("Core Principles") || "Core Principles")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedItem.objectives.map((objective, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-[#F4B400] rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-[#004B87] text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-gray-700 font-roboto text-sm leading-relaxed">
                        {objective}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics or Additional Info */}
              <div className="bg-gradient-to-r from-[#004B87]/5 to-[#F4B400]/5 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#004B87] mb-4 font-poppins">
                  {t("Live Statistics & Impact") || "Live Statistics & Impact"}
                </h3>

                {realStats.loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004B87]"></div>
                    <span className="ml-3 text-[#004B87] font-roboto">{t("Loading statistics...") || "Loading statistics..."}</span>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-[#004B87] rounded-full mx-auto mb-2">
                          <Users className="h-6 w-6 text-[#F4B400]" />
                        </div>
                        <div className="text-2xl font-bold text-[#004B87] font-poppins">{realStats.studentCount.toLocaleString()}+</div>
                        <div className="text-sm text-gray-600 font-roboto">{t("Students Enrolled") || "Students Enrolled"}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-[#F4B400] rounded-full mx-auto mb-2">
                          <GraduationCap className="h-6 w-6 text-[#004B87]" />
                        </div>
                        <div className="text-2xl font-bold text-[#004B87] font-poppins">{realStats.teacherCount}+</div>
                        <div className="text-sm text-gray-600 font-roboto">{t("Faculty Members") || "Faculty Members"}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-[#004B87] rounded-full mx-auto mb-2">
                          <FileText className="h-6 w-6 text-[#F4B400]" />
                        </div>
                        <div className="text-2xl font-bold text-[#004B87] font-poppins">{realStats.researchCount}+</div>
                        <div className="text-sm text-gray-600 font-roboto">{t("Research Papers") || "Research Papers"}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-[#F4B400] rounded-full mx-auto mb-2">
                          <BookOpen className="h-6 w-6 text-[#004B87]" />
                        </div>
                        <div className="text-2xl font-bold text-[#004B87] font-poppins">{realStats.programCount}</div>
                        <div className="text-sm text-gray-600 font-roboto">{t("Academic Programs") || "Academic Programs"}</div>
                      </div>
                    </div>

                    {/* Success Rate */}
                    <div className="text-center mt-6 p-4 bg-white rounded-lg border border-[#004B87]/10">
                      <div className="text-3xl font-bold text-[#004B87] font-poppins mb-1">{realStats.successRate}</div>
                      <div className="text-sm text-gray-600 font-roboto">{t("Course Success Rate") || "Course Success Rate"}</div>
                    </div>

                    {realStats.error && (
                      <div className="mt-4 text-center">
                        <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm">
                          <Award className="h-4 w-4 mr-2" />
                          {realStats.error}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Call to Action */}
              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={fetchRealStats}
                  disabled={realStats.loading}
                  className="px-6 py-3 bg-[#F4B400] text-[#004B87] rounded-lg hover:bg-[#E6A200] transition-colors font-medium font-roboto disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {realStats.loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#004B87] mr-2"></div>
                      {t("Refreshing...") || "Refreshing..."}
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4 mr-2" />
                      {t("Refresh Stats") || "Refresh Stats"}
                    </>
                  )}
                </button>
                <button
                  onClick={closeModal}
                  className="px-8 py-3 bg-[#004B87] text-white rounded-lg hover:bg-[#003366] transition-colors font-medium font-roboto"
                >
                  {t("Close") || "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MissionVisionValues;
