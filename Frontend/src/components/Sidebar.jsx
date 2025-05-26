import React from "react";
import {
  BarChart,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  BookOpen,
  Calendar,
  Newspaper,
  Building,
  Layers,
  User,
  ClipboardCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FacultyDirectoryManagement from "./DataManagement/FacultyDirectoryManagement";
// import Logo from "../../pub";
const Sidebar = ({ isSidebarOpen, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  // Menu items configuration
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { id: "faculty", label: "Faculty", icon: <Building size={20} /> },
    { id: "departments", label: "Departments", icon: <Layers size={20} /> },
    { id: "students", label: "Students", icon: <GraduationCap size={20} /> },
    { id: "courses", label: "Courses", icon: <BookOpen size={20} /> },
    { id: "semesters", label: "Semesters", icon: <Calendar size={20} /> },
    {
      id: "marks",
      label: "Marks Management",
      icon: <FileText size={20} />,
      href: "/teachermarks",
    },
    { id: "research", label: "Research", icon: <FileText size={20} /> },
    { id: "events", label: "Events", icon: <Calendar size={20} /> },
    { id: "news", label: "News", icon: <Newspaper size={20} /> },
    { id: "committe", label: "Committe", icon: <Newspaper size={20} /> },
    {
      id: "facultyDirectory",
      label: "faculty Directory",
      icon: <User size={20} />,
    },
    {
      id: "announcements",
      label: "Announcements",
      icon: <MessageSquare size={20} />,
    },
    {
      id: "qualityAssurance",
      label: "Quality Assurance",
      icon: <ClipboardCheck size={20} />,
    },
    { id: "analytics", label: "Analytics", icon: <BarChart size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-[#004B87] text-white transition-all duration-300 flex flex-col z-10`}
    >
      <div className='flex items-center p-4 border-b border-opacity-10 border-white'>
        <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3'>
          <img
            src='/placeholder.svg?height=40&width=40'
            alt='KUFE Logo'
            className='w-8 h-8'
          />
        </div>
        <h2 className={`text-xl font-bold ${!isSidebarOpen && "hidden"}`}>
          KUFE
        </h2>
      </div>

      <div className='flex-1 py-4 overflow-y-auto'>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center px-4 py-3 ${
              activeTab === item.id
                ? "bg-white bg-opacity-20 text-sky-900 border-l-4 border-[#F4B400]"
                : "hover:bg-white hover:text-sky-900  text-[#fff] hover:bg-opacity-10"
            } cursor-pointer`}
            onClick={() => {
              setActiveTab(item.id);
              if (item.href) {
                navigate(item.href);
              }
            }}
          >
            {item.icon}
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className='p-4 border-t border-opacity-10 border-white'>
        <div className='flex items-center px-4 py-3 hover:bg-white hover:bg-opacity-10 cursor-pointer'>
          <LogOut size={20} />
          <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
