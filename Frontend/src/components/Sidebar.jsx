import React from "react";
import {
  FileText,
  GraduationCap,
  Home,
  LogOut,
  MessageSquare,
  BookOpen,
  Calendar,
  Newspaper,
  Building,
  Layers,
  User,
  ClipboardCheck,
  Library,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import FacultyDirectoryManagement from "./DataManagement/FacultyDirectoryManagement";
// import Logo from "../../pub";
const Sidebar = ({ isSidebarOpen, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t, language } = useLanguage();

  // Check if current language is RTL
  const isRTL = language === 'dr' || language === 'ps';

  // Handle logout
  const handleLogout = async () => {
    try {
      // Set flag to indicate user manually logged out
      sessionStorage.setItem('wasLoggedOut', 'true');
      await logout();
      // Clear any stored navigation state
      sessionStorage.removeItem('redirectPath');
      // Navigate to home page and replace history
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  // Menu items configuration
  const menuItems = [
    { id: "dashboard", label: t("dashboard"), icon: <Home size={20} /> },
    { id: "faculty", label: t("faculty"), icon: <Building size={20} /> },
    { id: "departments", label: t("departments"), icon: <Layers size={20} /> },
    { id: "students", label: t("students"), icon: <GraduationCap size={20} /> },
    { id: "courses", label: t("courses"), icon: <BookOpen size={20} /> },
    { id: "subjects", label: t("subjects"), icon: <Library size={20} /> },
    { id: "semesters", label: t("semesters"), icon: <Calendar size={20} /> },
    { id: "research", label: t("research"), icon: <FileText size={20} /> },
    { id: "events", label: t("events"), icon: <Calendar size={20} /> },
    { id: "news", label: t("news"), icon: <Newspaper size={20} /> },
    { id: "committe", label: t("committee"), icon: <Newspaper size={20} /> },
    {
      id: "facultyDirectory",
      label: t("facultyDirectory"),
      icon: <User size={20} />,
    },
    {
      id: "announcements",
      label: t("announcements"),
      icon: <MessageSquare size={20} />,
    },
    {
      id: "qualityAssurance",
      label: t("qualityAssurance"),
      icon: <ClipboardCheck size={20} />,
    },
  ];

  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-[#004B87] text-white transition-all duration-300 flex flex-col z-10 ${isRTL ? 'order-last' : 'order-first'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        direction: isRTL ? 'rtl' : 'ltr'
      }}
    >
      <div className={`flex items-center p-4 border-b border-opacity-10 border-white ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`w-10 h-10 bg-white rounded-full flex items-center justify-center ${isRTL ? 'order-2 ml-3' : 'order-1 mr-3'}`}>
          <img
            src='/KufeLogo.jpeg'
            alt='KUFE Logo'
            className='w-8 h-8 rounded-full object-cover'
          />
        </div>
        <h2
          className={`text-xl font-bold ${!isSidebarOpen && "hidden"} ${isRTL ? 'order-1 text-right' : 'order-2 text-left'}`}
          style={{ textAlign: isRTL ? 'right' : 'left' }}
        >
          KUFE
        </h2>
      </div>

      <div className='flex-1 py-4 overflow-y-auto'>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center px-4 py-3 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'} ${
              activeTab === item.id
                ? `bg-white bg-opacity-20 text-sky-900 ${isRTL ? 'border-r-4 border-[#F4B400]' : 'border-l-4 border-[#F4B400]'}`
                : "hover:bg-white hover:text-sky-900 text-[#fff] hover:bg-opacity-10"
            } cursor-pointer transition-all duration-200`}
            onClick={() => {
              setActiveTab(item.id);
              if (item.href) {
                navigate(item.href);
              }
            }}
            dir={isRTL ? 'rtl' : 'ltr'}
            style={{ textAlign: isRTL ? 'right' : 'left' }}
          >
            <div className={`${isRTL ? 'order-2' : 'order-1'}`}>
              {item.icon}
            </div>
            <span
              className={`${isRTL ? 'mr-3 order-1 text-right' : 'ml-3 order-2 text-left'} ${!isSidebarOpen && "hidden"}`}
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className='p-4 border-t border-opacity-10 border-white'>
        {/* Go to Home Page */}
        <div
          className={`flex items-center px-4 py-3 hover:bg-white hover:bg-opacity-10 cursor-pointer hover:text-[#F4B400] transition-colors mb-2 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
          onClick={() => navigate('/')}
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{ textAlign: isRTL ? 'right' : 'left' }}
        >
          <ExternalLink size={20} />
          <span
            className={`${isRTL ? 'mr-3 text-right' : 'ml-3 text-left'} ${!isSidebarOpen && "hidden"}`}
            style={{ textAlign: isRTL ? 'right' : 'left' }}
          >
            {t("goToHome")}
          </span>
        </div>

        {/* Logout */}
        <div
          className={`flex items-center px-4 py-3 hover:bg-white hover:bg-opacity-10 cursor-pointer hover:text-red-400 transition-colors ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
          onClick={handleLogout}
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{ textAlign: isRTL ? 'right' : 'left' }}
        >
          <LogOut size={20} />
          <span
            className={`${isRTL ? 'mr-3 text-right' : 'ml-3 text-left'} ${!isSidebarOpen && "hidden"}`}
            style={{ textAlign: isRTL ? 'right' : 'left' }}
          >
            {t("logout")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
