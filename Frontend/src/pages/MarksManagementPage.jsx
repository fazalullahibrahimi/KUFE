import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  BarChart3,
  Trophy,
  TrendingUp,
} from "lucide-react";
import TeacherMarksManagement from "../components/DataManagement/TeacherMarksManagement";
import StudentMarksView from "../components/DataManagement/StudentMarksView";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCurrentUser } from "../utils/helpers";

const MarksManagementPage = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("teacher");
  const [isLoading, setIsLoading] = useState(true);

  // Get current user from localStorage
  const currentUser = getCurrentUser();
  const userRole = currentUser?.role || "student";

  // Determine the active tab based on user role and URL path
  useEffect(() => {
    setIsLoading(true);

    // Default tab based on user role
    if (userRole === "teacher" || userRole === "admin") {
      setActiveTab("teacher");
    } else {
      setActiveTab("student");
    }

    // Override with URL path if needed
    if (location.pathname === "/studentmarks") {
      setActiveTab("student");
    } else if (location.pathname === "/teachermarks") {
      setActiveTab("teacher");
    }

    setIsLoading(false);
  }, [location.pathname, userRole]);

  // Handle tab change and update URL
  const handleTabChange = (value) => {
    if (
      userRole === "admin" ||
      (userRole === "teacher" && value === "teacher") ||
      (userRole === "student" && value === "student")
    ) {
      setActiveTab(value);
      navigate(value === "teacher" ? "/teachermarks" : "/studentmarks", {
        replace: true,
      });
    }
  };

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to='/login' replace />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className='flex flex-col min-h-screen'>
        <Navbar />
        <main className='flex-grow bg-gradient-to-br from-[#E8ECEF] to-white flex items-center justify-center'>
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] rounded-full blur-lg opacity-75 animate-pulse'></div>
            <div className='relative w-16 h-16 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] rounded-full flex items-center justify-center'>
              <div className='w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin'></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tabs = [
    {
      id: "teacher",
      label: t("teacher_dashboard"),
      icon: <BookOpen className='h-6 w-6' />,
      description: t("manage_student_grades"),
      gradient: "from-[#1D3D6F] via-[#2C4F85] to-[#1D3D6F]",
      bgGradient: "from-[#E8ECEF] to-white",
      iconBg: "from-[#E8ECEF] to-white",
      available: userRole === "teacher" || userRole === "admin",
    },
    {
      id: "student",
      label: t("student_portal_desc"),
      icon: <GraduationCap className='h-6 w-6' />,
      description: t("view_academic_performance"),
      gradient: "from-[#2C4F85] via-[#1D3D6F] to-[#2C4F85]",
      bgGradient: "from-[#E8ECEF] to-white",
      iconBg: "from-[#E8ECEF] to-white",
      available: userRole === "student" || userRole === "admin",
    },
  ];

  const availableTabs = tabs.filter((tab) => tab.available);

  return (
    <div className={`flex flex-col min-h-screen ${isRTL ? "rtl" : "ltr"}`}>
      <Navbar />

      {/* Animated Background */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#1D3D6F]/20 to-[#F7B500]/20 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#2C4F85]/20 to-[#1D3D6F]/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#F7B500]/10 to-[#2C4F85]/10 rounded-full blur-3xl animate-pulse delay-500'></div>
      </div>

      <main className='flex-grow bg-gradient-to-br from-[#E8ECEF] to-white relative z-10'>
        <div className='w-full'>
          {/* Header Section */}
          <div className='bg-gradient-to-br from-[#1D3D6F] via-[#2C4F85] to-[#1D3D6F] text-white pt-24 pb-16 px-4'>
            <div className='max-w-4xl mx-auto text-center'>
              <div className='relative inline-block mb-6'>
                <div className='absolute inset-0 bg-white/20 rounded-2xl blur-lg animate-pulse'></div>
                <div className='relative bg-white/10 backdrop-blur-sm p-4 rounded-2xl inline-block border border-white/20'>
                  <BarChart3 className='h-12 w-12 text-white' />
                </div>
              </div>
              <h1 className='text-5xl font-bold mb-4 text-white'>
                Academic Performance Hub
              </h1>
              <p className='text-white/90 text-xl max-w-3xl mx-auto leading-relaxed'>
                Comprehensive academic records and grade management system for
                students and faculty
              </p>
              <div className='mt-8 flex justify-center space-x-8'>
                <div className='flex items-center space-x-2 text-white/80'>
                  <div className='w-2 h-2 bg-[#F7B500] rounded-full animate-pulse'></div>
                  <span className='text-sm font-medium'>Real-time Updates</span>
                </div>
                <div className='flex items-center space-x-2 text-white/80'>
                  <div className='w-2 h-2 bg-[#F7B500] rounded-full animate-pulse delay-300'></div>
                  <span className='text-sm font-medium'>Secure Access</span>
                </div>
                <div className='flex items-center space-x-2 text-white/80'>
                  <div className='w-2 h-2 bg-[#F7B500] rounded-full animate-pulse delay-700'></div>
                  <span className='text-sm font-medium'>
                    Professional Reports
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Container */}
          <div className='relative w-full -mt-8'>
            <div className='relative bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 overflow-hidden min-h-screen'>
              {/* Decorative Elements */}
              <div className='absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#1D3D6F]/10 to-transparent rounded-full blur-3xl'></div>
              <div className='absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#F7B500]/10 to-transparent rounded-full blur-3xl'></div>

              {/* Tab Navigation for Admin */}
              {userRole === "admin" && availableTabs.length > 1 && (
                <div className='relative bg-gradient-to-r from-[#E8ECEF]/30 to-[#E8ECEF]/10 border-b border-[#E8ECEF]'>
                  <div className='flex px-6 py-4'>
                    {availableTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`group relative flex-1 mx-2 rounded-xl transition-all duration-300 transform ${
                          activeTab === tab.id ? "scale-105" : "hover:scale-102"
                        }`}
                      >
                        {/* Tab Background */}
                        <div
                          className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                            activeTab === tab.id
                              ? `bg-gradient-to-r ${tab.gradient} shadow-lg`
                              : "bg-white/60 hover:bg-white/80 border border-[#E8ECEF]"
                          }`}
                        ></div>

                        {/* Tab Content */}
                        <div className='relative px-6 py-4 flex items-center space-x-3'>
                          <div
                            className={`relative p-2 rounded-lg transition-all duration-300 ${
                              activeTab === tab.id
                                ? "bg-white/20"
                                : "bg-[#E8ECEF]"
                            }`}
                          >
                            <div
                              className={`transition-colors duration-300 ${
                                activeTab === tab.id
                                  ? "text-white"
                                  : "text-[#1D3D6F]"
                              }`}
                            >
                              {tab.icon}
                            </div>
                          </div>

                          <div className='text-left'>
                            <div
                              className={`font-bold text-base transition-colors duration-300 ${
                                activeTab === tab.id
                                  ? "text-white"
                                  : "text-[#1D3D6F]"
                              }`}
                            >
                              {tab.label}
                            </div>
                            <div
                              className={`text-xs transition-colors duration-300 ${
                                activeTab === tab.id
                                  ? "text-white/80"
                                  : "text-[#2C4F85]"
                              }`}
                            >
                              {tab.description}
                            </div>
                          </div>

                          {/* Active Tab Indicator */}
                          {activeTab === tab.id && (
                            <div className='absolute top-1 right-1'>
                              <div className='w-2 h-2 bg-[#F7B500] rounded-full animate-pulse'></div>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Single Role Header for Non-Admin Users */}
              {userRole !== "admin" && (
                <div className='relative bg-gradient-to-r from-[#E8ECEF]/30 to-[#E8ECEF]/10 border-b border-[#E8ECEF]'>
                  <div className='px-6 py-8'>
                    {availableTabs.map((tab) => (
                      <div
                        key={tab.id}
                        className='flex items-center justify-center'
                      >
                        <div className='flex items-center space-x-4'>
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-r ${tab.gradient} shadow-lg`}
                          >
                            <div className='text-white'>{tab.icon}</div>
                          </div>
                          <div className='text-center'>
                            <div className='font-bold text-xl text-[#1D3D6F]'>
                              {tab.label}
                            </div>
                            <div className='text-[#2C4F85] text-sm'>
                              {tab.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Area */}
              <div className='relative'>
                <div className='transition-all duration-700 ease-out'>
                  {activeTab === "teacher" ? (
                    <div className='animate-slideInFromLeft'>
                      <TeacherMarksManagement />
                    </div>
                  ) : (
                    <div className='animate-slideInFromRight'>
                      <StudentMarksView />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats for Admin */}
          {userRole === "admin" && (
            <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto'>
              <div className='group relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300'></div>
                <div className='relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white transition-all duration-300 transform hover:-translate-y-1'>
                  <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E8ECEF] to-white rounded-xl mb-4 mx-auto border border-[#E8ECEF]'>
                    <BookOpen className='h-8 w-8 text-[#1D3D6F]' />
                  </div>
                  <div className='text-center'>
                    <div className='text-sm font-semibold text-[#1D3D6F] mb-1'>
                      {t("active_courses")}
                    </div>
                    <div className='text-3xl font-bold bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] bg-clip-text text-transparent'>
                      12
                    </div>
                  </div>
                </div>
              </div>

              <div className='group relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-[#2C4F85] to-[#1D3D6F] rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300'></div>
                <div className='relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white transition-all duration-300 transform hover:-translate-y-1'>
                  <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E8ECEF] to-white rounded-xl mb-4 mx-auto border border-[#E8ECEF]'>
                    <TrendingUp className='h-8 w-8 text-[#2C4F85]' />
                  </div>
                  <div className='text-center'>
                    <div className='text-sm font-semibold text-[#1D3D6F] mb-1'>
                      {t("avg_progress")}
                    </div>
                    <div className='text-3xl font-bold bg-gradient-to-r from-[#2C4F85] to-[#1D3D6F] bg-clip-text text-transparent'>
                      85%
                    </div>
                  </div>
                </div>
              </div>

              <div className='group relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-[#F7B500] to-[#1D3D6F] rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300'></div>
                <div className='relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white transition-all duration-300 transform hover:-translate-y-1'>
                  <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E8ECEF] to-white rounded-xl mb-4 mx-auto border border-[#E8ECEF]'>
                    <Trophy className='h-8 w-8 text-[#F7B500]' />
                  </div>
                  <div className='text-center'>
                    <div className='text-sm font-semibold text-[#1D3D6F] mb-1'>
                      {t("top_performers")}
                    </div>
                    <div className='text-3xl font-bold bg-gradient-to-r from-[#F7B500] to-[#1D3D6F] bg-clip-text text-transparent'>
                      24
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .animate-slideInFromLeft {
          animation: slideInFromLeft 0.7s ease-out;
        }

        .animate-slideInFromRight {
          animation: slideInFromRight 0.7s ease-out;
        }

        /* Glass Morphism Enhancement */
        .backdrop-blur-2xl {
          backdrop-filter: blur(40px);
        }

        /* RTL Support */
        .rtl {
          direction: rtl;
        }

        .rtl .space-x-4 > * + * {
          margin-left: 0;
          margin-right: 1rem;
        }

        /* Smooth Transitions */
        * {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default MarksManagementPage;
