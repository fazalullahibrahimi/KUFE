import React from "react";

import { useState } from "react";
import TeacherMarksManagement from "./TeacherMarksManagement";
import StudentMarksView from "./StudentMarksView";
import { useLanguage } from "../../contexts/LanguageContext";

const StudentMarksManagement = () => {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("teacher"); // teacher or student

  return (
    <div
      className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        direction: isRTL ? 'rtl' : 'ltr',
        textAlign: isRTL ? 'right' : 'left'
      }}
    >
      <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h2 className='text-xl font-semibold text-gray-800'>
          {t("marksManagement")}
        </h2>
        <div className={`flex ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
          <button
            className={`px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === "teacher"
                ? "bg-[#004B87] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("teacher")}
          >
            {t("teacherView")}
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === "student"
                ? "bg-[#004B87] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("student")}
          >
            {t("studentView")}
          </button>
        </div>
      </div>

      {activeTab === "teacher" ? (
        <TeacherMarksManagement />
      ) : (
        <StudentMarksView />
      )}
    </div>
  );
};

export default StudentMarksManagement;
