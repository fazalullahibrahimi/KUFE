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
import { useLanguage } from "../../contexts/LanguageContext";
import Footer from "../Footer";

export default function CourseDetail({ course, onBackClick }) {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [showPrerequisites, setShowPrerequisites] = useState(false);

  return (
    <>
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        {/* Header with back button */}
        <div className='p-4 border-b border-gray-200 flex items-center'>
          <button
            onClick={onBackClick}
            className='flex items-center text-[#004B87] hover:text-[#003a6a] transition-colors font-[Roboto]'
          >
            <ArrowLeft size={20} className='mr-2' />
            {t("course.back_to_courses")}
          </button>
        </div>

        {/* Course Header */}
        <div className='relative'>
          <div className='h-48 md:h-64 bg-gray-200 relative'>
            <img
              src={`http://localhost:4400/public/img/course/${course.image}` || "/placeholder.svg"}
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
                  {course.credits} {t("course.credits")}
                </span>
              </div>
              <h1 className='text-2xl md:text-3xl font-bold font-[Poppins]'>
                {course.name}
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
              {t("course.overview")}
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm font-[Roboto] whitespace-nowrap ${
                activeTab === "materials"
                  ? "border-b-2 border-[#004B87] text-[#004B87]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("materials")}
            >
              {t("course.materials")}
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm font-[Roboto] whitespace-nowrap ${
                activeTab === "schedule"
                  ? "border-b-2 border-[#004B87] text-[#004B87]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("schedule")}
            >
              {t("course.schedule_location")}
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
                  {t("course.course_description")}
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
                      {t("course.prerequisites")}
                    </h3>
                    {showPrerequisites ? (
                      <ChevronUp size={20} className='text-gray-500' />
                    ) : (
                      <ChevronDown size={20} className='text-gray-500' />
                    )}
                  </div>

                  {showPrerequisites && (
                    <div className='mt-3 p-3 border border-gray-200 rounded-md'>
                      {course.prerequisites &&
                      course.prerequisites.length > 0 ? (
                        <ul className='list-disc pl-5 font-[Roboto] text-gray-700'>
                          {course.prerequisites.map((prereq, index) => (
                            <li key={index} className='mb-1'>
                              {prereq}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className='text-gray-700 font-[Roboto]'>
                          {t("course.no_prerequisites")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className='bg-gray-50 p-4 rounded-lg h-fit'>
                <h3 className='text-lg font-semibold mb-4 font-[Poppins] text-[#333333]'>
                  {t("course.course_information")}
                </h3>

                <div className='space-y-4'>
                  <div className='flex items-start'>
                    <User
                      size={20}
                      className='text-[#004B87] mt-1 mr-3 flex-shrink-0'
                    />
                    <div>
                      <p className='text-sm text-gray-500 font-[Roboto]'>
                        {t("course.instructor")}
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
                        {t("course.department")}
                      </p>
                      <p className='font-medium text-[#333333] font-[Roboto]'>
                        {course.department_id.name}
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
                        {t("course.semester")}
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
                        {t("course.schedule")}
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
                        {t("course.location")}
                      </p>
                      <p className='font-medium text-[#333333] font-[Roboto]'>
                        {course.location}
                      </p>
                    </div>
                  </div>
                </div>

                <button className='mt-6 w-full bg-[#004B87] text-white py-2 rounded-md hover:bg-[#003a6a] transition-colors font-[Roboto]'>
                  {t("course.register_for_course")}
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
                          {t("course.name")}
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[Roboto]'
                        >
                          {t("course.type")}
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[Roboto]'
                        >
                          {t("course.size")}
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-[Roboto]'
                        >
                          {t("course.action")}
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
                              {t("course.download")}
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
                    {t("course.no_materials_available")}
                  </h3>
                  <p className='text-gray-500 font-[Roboto]'>
                    {t("course.no_materials_available_desc")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === "schedule" && (
            <div>
              <h2 className='text-xl font-semibold mb-4 font-[Poppins] text-[#333333]'>
                {t("course.schedule_location")}
              </h2>

              <div className='grid md:grid-cols-2 gap-6'>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h3 className='text-lg font-medium mb-3 font-[Poppins] text-[#333333]'>
                    {t("course.class_schedule")}
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
                    {t("course.location")}
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
                      {t("course.academic_calendar")}
                    </h3>
                  </div>
                  <div className='p-4'>
                    <div className='space-y-3'>
                      <div className='flex justify-between pb-2 border-b border-gray-100'>
                        <span className='text-gray-700 font-[Roboto]'>
                          {t("course.first_day_classes")}
                        </span>
                        <span className='font-medium text-[#333333] font-[Roboto]'>
                          Sep 1, 2023
                        </span>
                      </div>
                      <div className='flex justify-between pb-2 border-b border-gray-100'>
                        <span className='text-gray-700 font-[Roboto]'>
                          {t("course.last_day_add_drop")}
                        </span>
                        <span className='font-medium text-[#333333] font-[Roboto]'>
                          Sep 15, 2023
                        </span>
                      </div>
                      <div className='flex justify-between pb-2 border-b border-gray-100'>
                        <span className='text-gray-700 font-[Roboto]'>
                          {t("course.midterm_exams")}
                        </span>
                        <span className='font-medium text-[#333333] font-[Roboto]'>
                          Oct 20-27, 2023
                        </span>
                      </div>
                      <div className='flex justify-between pb-2 border-b border-gray-100'>
                        <span className='text-gray-700 font-[Roboto]'>
                          {t("course.last_day_classes")}
                        </span>
                        <span className='font-medium text-[#333333] font-[Roboto]'>
                          Dec 15, 2023
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-700 font-[Roboto]'>
                          {t("course.final_exams")}
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
      <Footer />
    </>
  );
}
