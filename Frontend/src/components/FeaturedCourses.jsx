import React from "react";

import { useState, useEffect } from "react"
import CourseCard from "./CourseCard"
import { ChevronLeft, ChevronRight } from "lucide-react"

const FeaturedCourses = ({ courses }) => {
  const [current, setCurrent] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSlidesToShow(3)
      } else if (window.innerWidth >= 640) {
        setSlidesToShow(2)
      } else {
        setSlidesToShow(1)
      }
    }

    handleResize() // Set initial value
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const totalSlides = Math.ceil(courses.length / slidesToShow)
  const canScrollLeft = current > 0
  const canScrollRight = current < totalSlides - 1

  const handlePrev = () => {
    if (!canScrollLeft) return
    setCurrent((prev) => prev - 1)
  }

  const handleNext = () => {
    if (!canScrollRight) return
    setCurrent((prev) => prev + 1)
  }

  if (courses.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Featured Courses</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={!canScrollLeft}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </button>
          <button
            onClick={handleNext}
            disabled={!canScrollRight}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out gap-6"
          style={{
            transform: `translateX(-${current * (100 / slidesToShow)}%)`,
            width: `${(courses.length / slidesToShow) * 100}%`,
          }}
        >
          {courses.map((course) => (
            <div key={course.id} className="min-w-0" style={{ width: `${100 / courses.length}%` }}>
              <CourseCard course={course} featured />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeaturedCourses
