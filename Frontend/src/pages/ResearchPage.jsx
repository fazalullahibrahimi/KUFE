import React from "react";
import { useState } from "react";
import { SearchIcon, FileTextIcon, FilterIcon } from "../components/Icons";

// Sample research papers data
const researchPapers = [
  {
    id: 1,
    title: "The Impact of Microfinance on Rural Youth",
    author: "Zarghona Sahar",
    year: 2023,
    category: "Economics",
    keywords: ["microfinance", "youth", "empowerment"],
    link: "#",
  },
  {
    id: 2,
    title: "Digital Payment Systems in Afghanistan",
    author: "Mohammad Wasiq",
    year: 2024,
    category: "Finance",
    keywords: ["digital", "payments", "Afghanistan"],
    link: "#",
  },
  {
    id: 3,
    title: "Sustainable Agriculture Practices in Arid Regions",
    author: "Fatima Ahmadi",
    year: 2023,
    category: "Agriculture",
    keywords: ["sustainable", "agriculture", "arid climate"],
    link: "#",
  },
  {
    id: 4,
    title: "Educational Technology Implementation in Rural Schools",
    author: "Ahmad Karimi",
    year: 2022,
    category: "Education",
    keywords: ["edtech", "rural education", "technology"],
    link: "#",
  },
  {
    id: 5,
    title: "Small Business Development After Crisis",
    author: "Najiba Hakimi",
    year: 2024,
    category: "Business",
    keywords: ["entrepreneurship", "crisis recovery", "small business"],
    link: "#",
  },
  {
    id: 6,
    title: "Healthcare Access in Remote Communities",
    author: "Khalid Rahman",
    year: 2023,
    category: "Healthcare",
    keywords: ["healthcare", "remote access", "community medicine"],
    link: "#",
  },
];

const ResearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Extract unique categories for the filter dropdown
  const categories = ["All", ...new Set(researchPapers.map((p) => p.category))];

  // Filter papers based on search term and category
  const filtered = researchPapers.filter((paper) => {
    const matchesCategory =
      filterCategory === "All" || paper.category === filterCategory;
    const matchesSearch =
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.keywords.some((kw) =>
        kw.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  return (
    <div className='bg-[#F9F9F9] min-h-screen px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        <header className='mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold text-[#004B87]'>
            Research Library
          </h1>
          <p className='text-gray-600 mt-1'>
            Browse published research papers from KUFE faculty and students.
          </p>
        </header>

        {/* Search + Filter */}
        <div className='flex flex-col md:flex-row items-center gap-4 mb-6'>
          <div className='relative w-full md:w-2/3'>
            <SearchIcon className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
            <input
              type='text'
              placeholder='Search by title, author, or keyword...'
              className='w-full py-3 pl-10 pr-4 rounded-xl border shadow-sm focus:ring-2 focus:ring-[#004B87] focus:outline-none'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className='relative w-full md:w-1/3'>
            <select
              className='w-full py-3 px-4 rounded-xl border shadow-sm focus:ring-2 focus:ring-[#004B87] focus:outline-none appearance-none'
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <FilterIcon className='absolute right-4 top-3 h-5 w-5 text-gray-400 pointer-events-none' />
          </div>
        </div>

        {/* Research Papers Count */}
        <div className='mb-4 text-sm text-gray-500'>
          Showing {filtered.length} of {researchPapers.length} papers
        </div>

        {/* Research Cards */}
        <div className='grid gap-6 grid-cols-1 md:grid-cols-2'>
          {filtered.length > 0 ? (
            filtered.map((paper) => (
              <div
                key={paper.id}
                className='bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition border-t-4 border-[#004B87]'
              >
                <h2 className='text-xl font-semibold text-[#004B87] mb-2'>
                  {paper.title}
                </h2>
                <p className='text-sm text-gray-600 mb-1'>
                  <span className='font-medium'>Author:</span> {paper.author}
                </p>
                <p className='text-sm text-gray-600 mb-1'>
                  <span className='font-medium'>Year:</span> {paper.year}
                </p>
                <p className='text-sm text-gray-600 mb-2'>
                  <span className='font-medium'>Category:</span>{" "}
                  {paper.category}
                </p>
                <div className='flex flex-wrap gap-1 mb-4'>
                  {paper.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className='bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full'
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <a
                  href={paper.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 bg-[#004B87] hover:bg-[#003b6d] text-white font-medium py-2 px-4 rounded-xl transition'
                >
                  <FileTextIcon className='h-4 w-4' /> View PDF
                </a>
              </div>
            ))
          ) : (
            <div className='text-center col-span-2 py-12'>
              <svg
                className='mx-auto h-12 w-12 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
              <h3 className='mt-2 text-lg font-medium text-gray-900'>
                No research papers found
              </h3>
              <p className='mt-1 text-gray-500'>
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("All");
                }}
                className='mt-4 text-[#004B87] hover:text-[#003b6d] font-medium'
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResearchPage;
