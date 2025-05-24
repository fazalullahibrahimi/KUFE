import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  BarChart3,
  Sparkles,
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
        <div className='container mx-auto px-4 py-12'>
          {/* Header Section */}
          <div className='text-center mb-12'>
            <div className='relative inline-block'>
              <div className='absolute inset-0 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] rounded-2xl blur-lg opacity-75 animate-pulse'></div>
              <div className='relative bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] p-4 rounded-2xl inline-block'>
                <BarChart3 className='h-12 w-12 text-white' />
              </div>
            </div>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-[#000000] via-[#1D3D6F] to-[#2C4F85] bg-clip-text text-transparent mt-6 mb-4'>
              {t("academic_performance_hub")}
            </h1>
            <p className='text-[#1D3D6F] text-lg max-w-2xl mx-auto'>
              {t("comprehensive_marks_management")}
            </p>
          </div>

          {/* Main Content Container */}
          <div className='relative max-w-6xl mx-auto'>
            {/* Glass Morphism Container */}
            <div className='absolute inset-0 bg-white/30 backdrop-blur-2xl rounded-3xl border border-white/20'></div>

            <div className='relative bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-2xl rounded-3xl border border-white/20 overflow-hidden'>
              {/* Decorative Elements */}
              <div className='absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#1D3D6F]/10 to-transparent rounded-full blur-3xl'></div>
              <div className='absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#F7B500]/10 to-transparent rounded-full blur-3xl'></div>

              {/* Tab Navigation for Admin */}
              {userRole === "admin" && availableTabs.length > 1 && (
                <div className='relative border-b border-white/20 bg-gradient-to-r from-white/40 to-white/20 backdrop-blur-xl'>
                  <div className='flex p-2'>
                    {availableTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`group relative flex-1 mx-2 rounded-2xl transition-all duration-500 transform ${
                          activeTab === tab.id ? "scale-105" : "hover:scale-102"
                        }`}
                      >
                        {/* Tab Background */}
                        <div
                          className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                            activeTab === tab.id
                              ? `bg-gradient-to-r ${tab.gradient}`
                              : "bg-white/20 hover:bg-white/30"
                          }`}
                        ></div>

                        {/* Glow Effect */}
                        {activeTab === tab.id && (
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-2xl blur-xl opacity-50 animate-pulse`}
                          ></div>
                        )}

                        {/* Tab Content */}
                        <div className='relative px-8 py-6 flex items-center space-x-4'>
                          <div
                            className={`relative p-3 rounded-xl transition-all duration-300 ${
                              activeTab === tab.id
                                ? "bg-white/20"
                                : `bg-gradient-to-br ${tab.iconBg} group-hover:bg-[#E8ECEF]`
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
                              className={`font-bold text-lg transition-colors duration-300 ${
                                activeTab === tab.id
                                  ? "text-white"
                                  : "text-[#1D3D6F]"
                              }`}
                            >
                              {tab.label}
                            </div>
                            <div
                              className={`text-sm transition-colors duration-300 ${
                                activeTab === tab.id
                                  ? "text-white/80"
                                  : "text-[#2C4F85]"
                              }`}
                            >
                              {tab.description}
                            </div>
                          </div>

                          {/* Sparkle Effect for Active Tab */}
                          {activeTab === tab.id && (
                            <div className='absolute top-2 right-2'>
                              <Sparkles className='h-5 w-5 text-[#F7B500] animate-pulse' />
                            </div>
                          )}
                        </div>

                        {/* Active Tab Indicator */}
                        {activeTab === tab.id && (
                          <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#F7B500] rounded-full' />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Single Role Header for Non-Admin Users */}
              {userRole !== "admin" && (
                <div className='relative border-b border-white/20 bg-gradient-to-r from-white/40 to-white/20 backdrop-blur-xl'>
                  <div className='p-6'>
                    {availableTabs.map((tab) => (
                      <div
                        key={tab.id}
                        className='flex items-center justify-center'
                      >
                        <div className='flex items-center space-x-4'>
                          <div
                            className={`p-4 rounded-xl bg-gradient-to-r ${tab.gradient}`}
                          >
                            <div className='text-white'>{tab.icon}</div>
                          </div>
                          <div className='text-center'>
                            <div className='font-bold text-xl text-[#1D3D6F]'>
                              {tab.label}
                            </div>
                            <div className='text-[#2C4F85]'>
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
              <div className='relative p-8'>
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
