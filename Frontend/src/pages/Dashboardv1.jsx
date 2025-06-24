import React from "react";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CourseManagement from "../components/DataManagement/CourseManagement";
import StudentManagement from "../components/DataManagement/StudentManagement";
import ResearchManagement from "../components/DataManagement/ResearchManagement";
import EventManagement from "../components/DataManagement/EventManagement";
import NewsManagement from "../components/DataManagement/NewsManagement";
import FacultyManagement from "../components/DataManagement/FacultyManagement";
import DepartmentManagement from "../components/DataManagement/DepartmentManagement";
import AnnouncementManagement from "../components/DataManagement/AnnouncementManagement";
import DashboardHome from "../components/DashboardHome";
import FacultyDirectoryManagement from "../components/DataManagement/FacultyDirectoryManagement";
import CommitteeMemberManagement from "../components/DataManagement/CommitteeMemberManagement";
import QualityAssuranceManagement from "../components/DataManagement/QualityAssuranceManagement";
import SemesterManagement from "../components/DataManagement/SemesterManagement";
import SubjectManagement from "../components/DataManagement/SubjectManagement";
import { useLanguage } from "../contexts/LanguageContext";

const Dashboardv1 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { language, isRTL } = useLanguage();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Render the appropriate component based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome />;
      case "courses":
        return <CourseManagement />;
      case "subjects":
        return <SubjectManagement />;
      case "students":
        return <StudentManagement />;
      case "research":
        return <ResearchManagement />;
      case "events":
        return <EventManagement />;
      case "news":
        return <NewsManagement />;
      case "faculty":
        return <FacultyManagement />;
      case "departments":
        return <DepartmentManagement />;
      case "announcements":
        return <AnnouncementManagement />;
      case "facultyDirectory":
        return <FacultyDirectoryManagement />;
      case "committe":
        return <CommitteeMemberManagement />;
      case "qualityAssurance":
        return <QualityAssuranceManagement />;
      case "semesters":
        return <SemesterManagement />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div
      className={`flex min-h-screen bg-gray-50 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        direction: isRTL ? 'rtl' : 'ltr',
        flexDirection: isRTL ? 'row-reverse' : 'row'
      }}
    >
      {/* Sidebar - will appear on right in RTL due to flex-row-reverse */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Header
          toggleSidebar={toggleSidebar}
          activeTab={activeTab}
          language={language}
        />
        <div
          className="flex-1 overflow-y-auto p-6"
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboardv1;
