import React from "react";

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"

const CoursesFilter = ({ filters, departments, onFilterChange, onClearFilters }) => {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    handleResize() // Set initial value
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleSearchChange = (e) => {
    onFilterChange("searchQuery", e.target.value)
  }

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses by name, code, or description..."
            className="flex h-10 w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={filters.searchQuery}
            onChange={handleSearchChange}
          />
          {filters.searchQuery && (
            <button
              className="absolute right-1 top-1.5 h-7 w-7 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
              onClick={() => onFilterChange("searchQuery", "")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>

        <div className="flex gap-4">
          <select
            className="flex h-10 w-full md:w-[220px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={filters.department}
            onChange={(e) => onFilterChange("department", e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>

          {(filters.department || filters.searchQuery) && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 border border-input"
            >
              <X className="h-4 w-4 mr-2" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {isDesktop && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(
            ([key, value]) =>
              value &&
              key !== "searchQuery" && (
                <div key={key} className="flex items-center bg-muted text-sm rounded-md px-2 py-1">
                  <span className="capitalize mr-1">{key}:</span>
                  <span className="font-medium capitalize">
                    {key === "department" ? departments.find((dept) => dept._id === value)?.name || value : value}
                  </span>
                  <button
                    className="h-5 w-5 ml-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
                    onClick={() => onFilterChange(key, "")}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {key} filter</span>
                  </button>
                </div>
              ),
          )}
        </div>
      )}
    </div>
  )
}

export default CoursesFilter
