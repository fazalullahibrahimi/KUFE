import React from "react";
export default function CourseFilter({ activeFilters, onFilterChange }) {
  const departments = [
    { value: "all", label: "All Departments" },
    { value: "Economics", label: "Economics" },
    { value: "Finance", label: "Finance" },
    { value: "Management", label: "Management" },
    { value: "Statistics", label: "Statistics" },
    { value: "Accounting", label: "Accounting" },
  ];

  const semesters = [
    { value: "all", label: "All Semesters" },
    { value: "Fall", label: "Fall" },
    { value: "Spring", label: "Spring" },
    { value: "Summer", label: "Summer" },
  ];

  const levels = [
    { value: "all", label: "All Levels" },
    { value: "Undergraduate", label: "Undergraduate" },
    { value: "Graduate", label: "Graduate" },
  ];

  return (
    <div className='mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4'>
      {/* Department Filter */}
      <div>
        <label
          htmlFor='department-filter'
          className='block text-sm font-medium text-gray-700 mb-1 font-[Roboto]'
        >
          Department
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
          Semester
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
          Level
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
