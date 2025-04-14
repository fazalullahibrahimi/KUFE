import React from "react";

import { useState } from "react";
// import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function CourseDetail({ course, onBackClick }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showPrerequisites, setShowPrerequisites] = useState(false);

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      {/* Header with back button */}
      <div className='p-4 border-b border-gray-200 flex items-center'>
        <button
          onClick={onBackClick}
          className='flex items-center text-[#004B87] hover:text-[#003a6a] transition-colors font-[Roboto]'
        >
          <ArrowLeft size={20} className='mr-2' />
          Back to Courses
        </button>
      </div>

      {/* Course Header */}
      <div className='relative'>
        <div className='h-48 md:h-64 bg-gray-200 relative'>
          <img
            src={course.image || "/placeholder.svg"}
            alt={course.title}
            className='w-full h-[300px] object-cover rounded-md'
          />

          <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent'></div>
          <div className='absolute bottom-0 left-0 p-6 text-white'>
            <div className='flex items-center mb-2'>
              <span className='bg-[#F4B400] text-[#333333] px-3 py-1 text-sm font-semibold rounded mr-2'>
                {course.code}
              </span>
              <span className='bg-[#004B87] text-white px-3 py-1 text-sm font-semibold rounded'>
                {course.credits} Credits
              </span>
            </div>
            <h1 className='text-2xl md:text-3xl font-bold font-[Poppins]'>
              {course.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='border-b border-gray-200'>
        <div className='flex overflow-x-auto'>
          <button
            className={`px-4 py-3 font-medium text-sm font-[Roboto] whitespace-nowrap ${
              activeTab === "overview"
                ? "border-b-2 border-[#004B87] text-[#004B87]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm font-[Roboto] whitespace-nowrap ${
              activeTab === "materials"
                ? "border-b-2 border-[#004B87] text-[#004B87]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("materials")}
          >
            Course Materials
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm font-[Roboto] whitespace-nowrap ${
              activeTab === "schedule"
                ? "border-b-2 border-[#004B87] text-[#004B87]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("schedule")}
          >
            Schedule & Location
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className='p-6'>
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className='grid md:grid-cols-3 gap-6'>
            <div className='md:col-span-2'>
              <h2 className='text-xl font-semibold mb-4 font-[Poppins] text-[#333333]'>
                Course Description
              </h2>
              <p className='text-gray-700 mb-6 font-[Roboto] leading-relaxed'>
                {course.description}
              </p>

              <div className='mb-6'>
                <div
                  className='flex justify-between items-center cursor-pointer bg-gray-50 p-3 rounded-md'
                  onClick={() => setShowPrerequisites(!showPrerequisites)}
                >
                  <h3 className='text-lg font-medium font-[Poppins] text-[#333333]'>
                    Prerequisites
                  </h3>
                  {showPrerequisites ? (
                    <ChevronUp size={20} className='text-gray-500' />
                  ) : (
                    <ChevronDown size={20} className='text-gray-500' />
                  )}
                </div>

                {showPrerequisites && (
                  <div className='mt-3 p-3 border border-gray-200 rounded-md'>
                    {course.prerequisites && course.prerequisites.length > 0 ? (
                      <ul className='list-disc pl-5 font-[Roboto] text-gray-700'>
                        {course.prerequisites.map((prereq, index) => (
                          <li key={index} className='mb-1'>
                            {prereq}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className='text-gray-700 font-[Roboto]'>
                        No prerequisites required.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className='bg-gray-50 p-4 rounded-lg h-fit'>
              <h3 className='text-lg font-semibold mb-4 font-[Poppins] text-[#333333]'>
                Course Information
              </h3>

              <div className='space-y-4'>
                <div className='flex items-start'>
                  <User
                    size={20}
                    className='text-[#004B87] mt-1 mr-3 flex-shrink-0'
                  />
                  <div>
                    <p className='text-sm text-gray-500 font-[Roboto]'>
                      Instructor
                    </p>
                    <p className='font-medium text-[#333333] font-[Roboto]'>
                      {course.instructor}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <BookOpen
                    size={20}
                    className='text-[#004B87] mt-1 mr-3 flex-shrink-0'
                  />
                  <div>
                    <p className='text-sm text-gray-500 font-[Roboto]'>
                      Department
                    </p>
                    <p className='font-medium text-[#333333] font-[Roboto]'>
                      {course.department}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <Calendar
                    size={20}
                    className='text-[#004B87] mt-1 mr-3 flex-shrink-0'
                  />
                  <div>
                    <p className='text-sm text-gray-500 font-[Roboto]'>
                      Semester
                    </p>
                    <p className='font-medium text-[#333333] font-[Roboto]'>
                      {course.semester}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <Clock
                    size={20}
                    className='text-[#004B87] mt-1 mr-3 flex-shrink-0'
                  />
                  <div>
                    <p className='text-sm text-gray-500 font-[Roboto]'>
                      Schedule
                    </p>
                    <p className='font-medium text-[#333333] font-[Roboto]'>
                      {course.schedule}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <MapPin
                    size={20}
                    className='text-[#004B87] mt-1 mr-3 flex-shrink-0'
                  />
                  <div>
                    <p className='text-sm text-gray-500 font-[Roboto]'>
                      Location
                    </p>
                    <p className='font-medium text-[#333333] font-[Roboto]'>
                      {course.location}
                    </p>
                  </div>
                </div>
              </div>

              <button className='mt-6 w-full bg-[#004B87] text-white py-2 rounded-md hover:bg-[#003a6a] transition-colors font-[Roboto]'>
                Register for Course
              </button>
            </div>
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === "materials" && (
          <div>
            <h2 className='text-xl font-semibold mb-4 font-[Poppins] text-[#333333]'>
              Course Materials
            </h2>

            {course.materials && course.materials.length > 0 ? (
              <div className='border rounded-lg overflow-hidden'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[Roboto]'
                      >
                        Name
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[Roboto]'
                      >
                        Type
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[Roboto]'
                      >
                        Size
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-[Roboto]'
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {course.materials.map((material) => (
                      <tr key={material.id}>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <FileText
                              size={18}
                              className='text-gray-500 mr-2'
                            />
                            <span className='font-medium text-[#333333] font-[Roboto]'>
                              {material.title}
                            </span>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 uppercase font-[Roboto]'>
                            {material.type}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-[Roboto]'>
                          {material.size}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          <button className='text-[#004B87] hover:text-[#003a6a] flex items-center justify-end w-full'>
                            <Download size={16} className='mr-1' />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className='text-center py-8 bg-gray-50 rounded-lg'>
                <FileText size={48} className='mx-auto text-gray-400 mb-2' />
                <h3 className='text-lg font-medium mb-1 font-[Poppins] text-[#333333]'>
                  No materials available
                </h3>
                <p className='text-gray-500 font-[Roboto]'>
                  Course materials will be uploaded soon.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <div>
            <h2 className='text-xl font-semibold mb-4 font-[Poppins] text-[#333333]'>
              Schedule & Location
            </h2>

            <div className='grid md:grid-cols-2 gap-6'>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <h3 className='text-lg font-medium mb-3 font-[Poppins] text-[#333333]'>
                  Class Schedule
                </h3>
                <div className='flex items-start mb-4'>
                  <Clock
                    size={20}
                    className='text-[#004B87] mt-1 mr-3 flex-shrink-0'
                  />
                  <div>
                    <p className='font-medium text-[#333333] font-[Roboto]'>
                      {course.schedule}
                    </p>
                  </div>
                </div>

                <h3 className='text-lg font-medium mb-3 font-[Poppins] text-[#333333] mt-6'>
                  Location
                </h3>
                <div className='flex items-start'>
                  <MapPin
                    size={20}
                    className='text-[#004B87] mt-1 mr-3 flex-shrink-0'
                  />
                  <div>
                    <p className='font-medium text-[#333333] font-[Roboto]'>
                      {course.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
                <div className='p-4 bg-[#004B87] text-white'>
                  <h3 className='font-medium font-[Poppins]'>
                    Academic Calendar
                  </h3>
                </div>
                <div className='p-4'>
                  <div className='space-y-3'>
                    <div className='flex justify-between pb-2 border-b border-gray-100'>
                      <span className='text-gray-700 font-[Roboto]'>
                        First Day of Classes
                      </span>
                      <span className='font-medium text-[#333333] font-[Roboto]'>
                        Sep 1, 2023
                      </span>
                    </div>
                    <div className='flex justify-between pb-2 border-b border-gray-100'>
                      <span className='text-gray-700 font-[Roboto]'>
                        Last Day to Add/Drop
                      </span>
                      <span className='font-medium text-[#333333] font-[Roboto]'>
                        Sep 15, 2023
                      </span>
                    </div>
                    <div className='flex justify-between pb-2 border-b border-gray-100'>
                      <span className='text-gray-700 font-[Roboto]'>
                        Midterm Exams
                      </span>
                      <span className='font-medium text-[#333333] font-[Roboto]'>
                        Oct 20-27, 2023
                      </span>
                    </div>
                    <div className='flex justify-between pb-2 border-b border-gray-100'>
                      <span className='text-gray-700 font-[Roboto]'>
                        Last Day of Classes
                      </span>
                      <span className='font-medium text-[#333333] font-[Roboto]'>
                        Dec 15, 2023
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-700 font-[Roboto]'>
                        Final Exams
                      </span>
                      <span className='font-medium text-[#333333] font-[Roboto]'>
                        Dec 18-22, 2023
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
