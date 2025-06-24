import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function CourseFilter({ activeFilters, onFilterChange }) {
  const { t, isRTL } = useLanguage();

  const departments = [
    { value: "all", label: t("course.all_departments") },
    { value: "Economics", label: t("course.economics") },
    { value: "Finance", label: t("course.finance") },
    { value: "Management", label: t("course.management") },
    { value: "Statistics", label: t("course.statistics") },
    { value: "Accounting", label: t("course.accounting") },
  ];

  const semesters = [
    { value: "all", label: t("course.all_semesters") },
    { value: "Fall", label: t("course.fall") },
    { value: "Spring", label: t("course.spring") },
    { value: "Summer", label: t("course.summer") },
  ];

  const levels = [
    { value: "all", label: t("course.all_levels") },
    { value: "Undergraduate", label: t("course.undergraduate") },
    { value: "Graduate", label: t("course.graduate") },
  ];

  return (
    <div className='mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4'>
      {/* Department Filter */}
      <div>
        <label
          htmlFor='department-filter'
          className='block text-sm font-medium text-gray-700 mb-1 font-[Roboto]'
        >
          {t("course.department")}
        </label>
        <select
          id='department-filter'
          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004B87] font-[Roboto]'
          value={activeFilters.department}
          onChange={(e) => onFilterChange("department", e.target.value)}
        >
          {departments.map((dept) => (
            <option key={dept.value} value={dept.value}>
              {dept.label}
            </option>
          ))}
        </select>
      </div>

      {/* Semester Filter */}
      <div>
        <label
          htmlFor='semester-filter'
          className='block text-sm font-medium text-gray-700 mb-1 font-[Roboto]'
        >
          {t("course.semester")}
        </label>
        <select
          id='semester-filter'
          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004B87] font-[Roboto]'
          value={activeFilters.semester}
          onChange={(e) => onFilterChange("semester", e.target.value)}
        >
          {semesters.map((semester) => (
            <option key={semester.value} value={semester.value}>
              {semester.label}
            </option>
          ))}
        </select>
      </div>

      {/* Level Filter */}
      <div>
        <label
          htmlFor='level-filter'
          className='block text-sm font-medium text-gray-700 mb-1 font-[Roboto]'
        >
          {t("course.level")}
        </label>
        <select
          id='level-filter'
          className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004B87] font-[Roboto]'
          value={activeFilters.level}
          onChange={(e) => onFilterChange("level", e.target.value)}
        >
          {levels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
