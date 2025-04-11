import React, { useState, useEffect } from "react"
import CourseCard from "./CourseCard"
import { ChevronLeft, ChevronRight } from "lucide-react"

const CoursesList = ({ courses = [], departments = [] }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 6 : 9)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const totalPages = Math.ceil(courses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentCourses = courses.slice(startIndex, startIndex + itemsPerPage)

  const getDepartmentName = (department) => {
    if (!department) return "Unknown Department"

    if (typeof department === "object") return department.name || "Unknown Department"

    const found = departments.find((d) => d._id === department)
    return found ? found.name : "Unknown Department"
  }

  return (
    <div className="space-y-8">
      {currentCourses.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No courses found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCourses.map((course, index) => (
         <CourseCard
         key={course._id || `${course.code}-${index}`}
         course={course}
       />
       
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 py-4">
              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </button>

              <div className="flex items-center gap-1.5">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1
                  const isCurrent = page === currentPage
                  const shouldShow =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)

                  if (!shouldShow) return null

                  return (
                    <button
                      key={`page-${page}`}
                      onClick={() => setCurrentPage(page)}
                      className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 ${
                        isCurrent
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>

              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CoursesList
