import React from "react";

import { useState } from "react";
import TeacherMarksManagement from "./TeacherMarksManagement";
import StudentMarksView from "./StudentMarksView";
import { useLanguage } from "../../contexts/LanguageContext";

const StudentMarksManagement = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("teacher"); // teacher or student

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold text-gray-800'>
          {t("marks.management")}
        </h2>
        <div className='flex space-x-2'>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "teacher"
                ? "bg-[#004B87] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab("teacher")}
          >
            {t("marks.teacher_view")}
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "student"
                ? "bg-[#004B87] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab("student")}
          >
            {t("marks.student_view")}
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
