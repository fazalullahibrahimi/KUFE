import React from "react"
import { Link } from "react-router-dom"
import { Clock, BookOpen } from "lucide-react"

const CourseCard = ({ course }) => {
  const {
    _id,
    code,
    name,
    description,
    credits,
    department_id,
  } = course || {}

  const departmentName = department_id?.name

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Header Section */}
        <div className="flex flex-col gap-1 mb-3">
          {code && <span className="text-xs text-primary font-medium">{code}</span>}
          {name && (
            <Link to={`/courses/${_id}`} className="hover:underline text-lg font-semibold text-gray-900 line-clamp-1">
              {name}
            </Link>
          )}
          {departmentName && (
            <span className="text-sm text-gray-500">{departmentName}</span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 text-gray-600">
            {description}
          </p>
        )}

        {/* Course Info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-auto">
          {credits && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{credits} credit hours</span>
            </div>
          )}
          {code && (
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>Course Code: {code}</span>
            </div>
          )}
        </div>
      </div>

      {/* Button */}
      <div className="p-4 pt-0 mt-auto">
        <Link
          to={`/courses/${_id}`}
          className="inline-flex items-center justify-center rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 w-full py-2 transition"
        >
          View Course Details
        </Link>
      </div>
    </div>
  )
}

export default CourseCard
