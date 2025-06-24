import React from "react";
import { Calendar, User, BookOpen } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function CourseCard({ course, onClick }) {
  const { t, isRTL } = useLanguage();

  return (
    <div
      className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'
      onClick={onClick}
    >
      <div className='relative h-40'>
        <image
          src={`http://localhost:4400/public/img/course/${course.image}`|| "/placeholder.svg?height=200&width=300"}
          alt={course.title}
          className='w-full'
        />
        <div className='absolute top-0 right-0 bg-[#004B87] text-white px-3 py-1 text-sm font-medium rounded-bl-lg'>
          {course.credits} {t("course.credits")}
        </div>
      </div>

      <div className='p-4'>
        <div className='flex justify-between items-start mb-2'>
          <span className='inline-block bg-[#F4B400] text-[#333333] px-2 py-1 text-xs font-semibold rounded'>
            {course.code}
          </span>
          <span className='text-sm text-gray-500 font-[Roboto]'>
            {course.level}
          </span>
        </div>

        <h3 className='text-lg font-semibold mb-2 font-[Poppins] text-[#333333] line-clamp-2'>
          {course.name}
        </h3>

        <div className='flex items-center gap-2 mb-2'>
          <User size={16} className='text-gray-500' />
          <span className='text-sm text-gray-700 font-[Roboto]'>
            {course.instructor}
          </span>
        </div>

        <div className='flex items-center gap-2 mb-2'>
          <BookOpen size={16} className='text-gray-500' />
          <span className='text-sm text-gray-700 font-[Roboto]'>
            {course.department_id.name}
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <Calendar size={16} className='text-gray-500' />
          <span className='text-sm text-gray-700 font-[Roboto]'>
            {course.semester}
          </span>
        </div>

        <p className='mt-3 text-sm text-gray-600 line-clamp-2 font-[Roboto]'>
          {course.description}
        </p>

        <button
          className='mt-4 w-full bg-[#004B87] text-white py-2 rounded-md hover:bg-[#003a6a] transition-colors font-[Roboto]'
          onClick={(e) => {
            e.stopPropagation();
            onClick(course);
          }}
        >
          {t("course.view_details")}
        </button>
      </div>
    </div>
  );
}
