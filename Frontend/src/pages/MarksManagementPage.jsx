import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs";
import { User, BookOpen, AlertCircle } from "lucide-react";
import TeacherMarksManagement from "../components/DataManagement/TeacherMarksManagement";
import StudentMarksView from "../components/DataManagement/StudentMarksView";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCurrentUser } from "../utils/helpers";

const MarksManagementPage = () => {
  const { t } = useLanguage();
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
    // Only allow tab change if user is admin
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
        <main className='flex-grow bg-gray-50 flex items-center justify-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#004B87]'></div>
        </main>
        <Footer />
      </div>
    );
  }

  // For teachers, only show teacher view with navigation buttons
  if (userRole === "teacher") {
    return (
      <div className='flex flex-col min-h-screen'>
        <Navbar />
        <main className='flex-grow bg-gray-50'>
          <div className='container mx-auto px-4 py-8'>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <div className='flex justify-between items-center mb-6'>
                <h1 className='text-2xl font-bold text-[#1D3D6F]'>
                  {t("marks.management")}
                </h1>
                <div className='flex space-x-2'>
                  <button
                    className='px-4 py-2 rounded-md bg-[#004B87] text-white'
                    onClick={() => navigate("/teachermarks")}
                  >
                    <div className='flex items-center gap-2'>
                      <BookOpen size={18} />
                      <span>{t("marks.teacher_view")}</span>
                    </div>
                  </button>
                  <button
                    className='px-4 py-2 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed'
                    disabled
                  >
                    <div className='flex items-center gap-2'>
                      <User size={18} />
                      <span>{t("marks.student_view")}</span>
                    </div>
                  </button>
                </div>
              </div>
              <TeacherMarksManagement />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // For students, only show student view with navigation buttons
  if (userRole === "student") {
    return (
      <div className='flex flex-col min-h-screen'>
        <Navbar />
        <main className='flex-grow bg-gray-50'>
          <div className='container mx-auto px-4 py-8'>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <div className='flex justify-between items-center mb-6'>
                <h1 className='text-2xl font-bold text-[#1D3D6F]'>
                  {t("marks.management")}
                </h1>
                <div className='flex space-x-2'>
                  <button
                    className='px-4 py-2 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed'
                    disabled
                  >
                    <div className='flex items-center gap-2'>
                      <BookOpen size={18} />
                      <span>{t("marks.teacher_view")}</span>
                    </div>
                  </button>
                  <button
                    className='px-4 py-2 rounded-md bg-[#004B87] text-white'
                    onClick={() => navigate("/studentmarks")}
                  >
                    <div className='flex items-center gap-2'>
                      <User size={18} />
                      <span>{t("marks.student_view")}</span>
                    </div>
                  </button>
                </div>
              </div>
              <StudentMarksView />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // For admin, show both tabs with navigation buttons
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <main className='flex-grow bg-gray-50'>
        <div className='container mx-auto px-4 py-8'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex justify-between items-center mb-6'>
              <h1 className='text-2xl font-bold text-[#1D3D6F]'>
                {t("marks.management")}
              </h1>
              <div className='flex space-x-2'>
                <button
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "teacher"
                      ? "bg-[#004B87] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => navigate("/teachermarks")}
                >
                  <div className='flex items-center gap-2'>
                    <BookOpen size={18} />
                    <span>{t("marks.teacher_view")}</span>
                  </div>
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "student"
                      ? "bg-[#004B87] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => navigate("/studentmarks")}
                >
                  <div className='flex items-center gap-2'>
                    <User size={18} />
                    <span>{t("marks.student_view")}</span>
                  </div>
                </button>
              </div>
            </div>

            {activeTab === "teacher" ? (
              <TeacherMarksManagement />
            ) : (
              <StudentMarksView />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MarksManagementPage;
