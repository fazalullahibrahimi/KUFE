import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  FileText,
  BookOpen,
  Calendar,
  User,
  Download,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ResearchPage() {
  const [researchPapers, setResearchPapers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch data from backend API
  useEffect(() => {
    const fetchResearchPapers = async () => {
      try {
        setLoading(true);
        setError("");

        // Maintain the existing API call
        const response = await axios.get(
          "http://localhost:4400/api/v1/research/papers"
        );
        console.log("Research Papers:", response.data);

        // Handle different response structures
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data.papers)
        ) {
          setResearchPapers(response.data.data.papers);
        } else if (response.data && Array.isArray(response.data.data)) {
          setResearchPapers(response.data.data);
        } else if (
          response.data &&
          response.data.data &&
          response.data.data.paper
        ) {
          // Handle single paper case
          setResearchPapers([response.data.data.paper]);
        } else {
          throw new Error("Invalid data format received from server");
        }
      } catch (err) {
        console.error("Error fetching research papers:", err);

        if (err.response) {
          if (err.response.status === 404) {
            setError(
              "The resource could not be found. Please try again later."
            );
          } else if (err.response.status === 500) {
            setError(
              "The server encountered an error. Our team has been notified."
            );
          } else {
            setError(
              `Server error: ${
                err.response.data?.message || "Unknown error occurred"
              }`
            );
          }
        } else if (err.request) {
          setError(
            "Unable to connect to the server. Please check your internet connection and try again."
          );
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResearchPapers();
  }, []);

  // Extract unique categories
  const categories = [
    "All",
    ...new Set(researchPapers.map((p) => p.category).filter(Boolean)),
  ];

  // Filter papers
  const filtered = researchPapers.filter((paper) => {
    const matchesCategory =
      filterCategory === "All" || paper.category === filterCategory;
    const matchesSearch =
      paper.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (paper.keywords &&
        Array.isArray(paper.keywords) &&
        paper.keywords.some((kw) =>
          kw.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    return matchesCategory && matchesSearch;
  });

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className='min-h-screen bg-[#E8ECEF]'>
      <Navbar />
      {/* Header */}
      <div className='relative bg-[#1D3D6F] text-white pt-12'>
        <div className='container mx-auto px-4 py-10 md:py-16'>
          <div className='flex justify-between items-center'>
            <div className='max-w-2xl'>
              <h1 className='text-3xl md:text-5xl font-bold tracking-tight mb-2 text-white'>
                Research Library
              </h1>
              <p className='mt-2 text-white text-lg md:text-xl opacity-90'>
                Browse published research papers from KUFE faculty and students
              </p>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className='absolute bottom-0 left-0 right-0 h-12 overflow-hidden'>
          <svg
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
            className='absolute bottom-0 left-0 w-full h-full text-[#E8ECEF] fill-current'
          >
            <path d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0z'></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-8'>
        {/* Search + Filter */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-8 -mt-8 relative z-10'>
          <div className='flex flex-col md:flex-row items-center gap-4'>
            <div className='relative w-full md:w-2/3'>
              <Search
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                size={20}
              />
              <input
                type='text'
                placeholder='Search by title, author, or keyword...'
                className='w-full py-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1D3D6F] focus:outline-none'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className='relative w-full md:w-1/3'>
              <select
                className='w-full py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1D3D6F] focus:outline-none appearance-none'
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <Filter
                className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none'
                size={20}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6'>
            <p className='font-medium'>Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <Loader2 className='h-12 w-12 animate-spin text-[#1D3D6F]' />
          </div>
        ) : (
          <>
            {/* Research Papers Count */}
            <div className='mb-4 flex justify-between items-center'>
              <p className='text-[#1D3D6F]'>
                Showing {filtered.length} of {researchPapers.length} papers
              </p>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-[#1D3D6F]'>Sort by:</span>
                <select className='border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D3D6F]'>
                  <option value='date'>Publication Date</option>
                  <option value='title'>Title (A-Z)</option>
                  <option value='author'>Author</option>
                </select>
              </div>
            </div>

            {/* Research Cards */}
            {filtered.length > 0 ? (
              <div className='grid gap-6 grid-cols-1 md:grid-cols-2'>
                {filtered.map((paper) => (
                  <div
                    key={paper._id || paper.id}
                    className='bg-white rounded-lg shadow-md hover:shadow-lg transition border-t-4 border-[#1D3D6F] overflow-hidden'
                  >
                    <div className='p-6'>
                      <div className='flex justify-between items-start mb-3'>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            paper.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {paper.status || "published"}
                        </span>
                        {paper.category && (
                          <span className='bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-2 py-1 rounded-full'>
                            {paper.category}
                          </span>
                        )}
                      </div>
                      <h2 className='text-xl font-semibold text-[#1D3D6F] mb-3'>
                        {paper.title}
                      </h2>
                      <div className='flex items-center text-sm text-gray-600 mb-3'>
                        <User className='h-4 w-4 mr-1 text-[#1D3D6F]' />
                        <span>{paper.author}</span>
                      </div>
                      <div className='flex items-center text-sm text-gray-600 mb-3'>
                        <Calendar className='h-4 w-4 mr-1 text-[#1D3D6F]' />
                        <span>
                          {formatDate(paper.publicationDate || paper.date)}
                        </span>
                      </div>
                      <p className='text-sm text-gray-600 mb-4 line-clamp-3'>
                        {paper.abstract || paper.description}
                      </p>
                      {paper.keywords &&
                        Array.isArray(paper.keywords) &&
                        paper.keywords.length > 0 && (
                          <div className='flex flex-wrap gap-2 mb-4'>
                            {paper.keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className='bg-[#E8ECEF] text-[#1D3D6F] text-xs px-2 py-1 rounded-full'
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                      <div className='flex justify-between items-center'>
                        <div className='flex items-center text-sm text-gray-500'>
                          <BookOpen className='h-4 w-4 mr-1' />
                          <span>{paper.pages || "N/A"} pages</span>
                        </div>
                        <a
                          href={paper.filePath || paper.fileUrl || "#"}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-2 bg-[#1D3D6F] hover:bg-[#2C4F85] text-white font-medium py-2 px-4 rounded-lg transition'
                        >
                          <FileText className='h-4 w-4' /> View PDF
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center bg-white rounded-lg shadow-md py-12'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4'>
                  <BookOpen className='h-8 w-8' />
                </div>
                <h3 className='text-xl font-medium text-[#1D3D6F] mb-2'>
                  No research papers found
                </h3>
                <p className='text-gray-500 mb-6'>
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterCategory("All");
                  }}
                  className='bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] font-medium py-2 px-6 rounded-lg transition'
                >
                  Reset filters
                </button>
              </div>
            )}
          </>
        )}

        {/* Featured Research Section */}
        {!loading && !error && filtered.length > 0 && (
          <div className='mt-12'>
            <h2 className='text-2xl font-bold text-[#1D3D6F] mb-6'>
              Featured Research
            </h2>
            <div className='bg-white rounded-lg shadow-md overflow-hidden'>
              <div className='bg-[#1D3D6F] p-6 text-white'>
                <h3 className='text-xl font-semibold mb-2'>
                  Research Highlights
                </h3>
                <p className='opacity-90'>
                  Explore groundbreaking research from our faculty and students
                  that contributes to economic development and policy-making.
                </p>
              </div>
              <div className='p-6'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  {researchPapers
                    .filter((paper) => paper.featured)
                    .slice(0, 3)
                    .map((paper) => (
                      <div
                        key={paper._id || paper.id}
                        className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition'
                      >
                        <div className='flex items-center justify-between mb-2'>
                          {paper.category && (
                            <span className='bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-2 py-1 rounded-full'>
                              {paper.category}
                            </span>
                          )}
                          <span className='text-xs text-gray-500'>
                            {new Date(
                              paper.publicationDate || paper.date
                            ).getFullYear()}
                          </span>
                        </div>
                        <h4 className='font-medium text-[#1D3D6F] mb-2 line-clamp-2'>
                          {paper.title}
                        </h4>
                        <p className='text-sm text-gray-600 mb-3 line-clamp-3'>
                          {paper.abstract || paper.description}
                        </p>
                        <a
                          href={paper.filePath || paper.fileUrl || "#"}
                          className='text-sm font-medium text-[#1D3D6F] hover:text-[#F7B500] transition flex items-center'
                        >
                          Read more <ChevronRight className='h-4 w-4 ml-1' />
                        </a>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Research Submission CTA */}
        <div className='mt-12 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] rounded-lg shadow-lg overflow-hidden'>
          <div className='p-8 md:p-10 text-white'>
            <div className='flex flex-col md:flex-row items-center justify-between'>
              <div className='mb-6 md:mb-0 md:mr-6'>
                <h2 className='text-2xl font-bold mb-3'>
                  Submit Your Research
                </h2>
                <p className='opacity-90 max-w-xl'>
                  Are you a faculty member or student with research to share?
                  Submit your paper for review and publication in our research
                  library.
                </p>
              </div>
              <button className='bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] font-bold py-3 px-6 rounded-lg transition shadow-md'>
                Submit Paper
              </button>
            </div>
          </div>
        </div>

        {/* Research Resources */}
        <div className='mt-12'>
          <h2 className='text-2xl font-bold text-[#1D3D6F] mb-6'>
            Research Resources
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4'>
                <BookOpen className='h-6 w-6' />
              </div>
              <h3 className='text-lg font-semibold mb-2 text-[#1D3D6F]'>
                Research Guidelines
              </h3>
              <p className='text-gray-600 mb-4'>
                Access our comprehensive guidelines for conducting and
                publishing research at KUFE.
              </p>
              <a
                href='#'
                className='inline-flex items-center text-[#1D3D6F] font-medium hover:text-[#F7B500] transition'
              >
                View Guidelines <ChevronRight className='h-4 w-4 ml-1' />
              </a>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4'>
                <Download className='h-6 w-6' />
              </div>
              <h3 className='text-lg font-semibold mb-2 text-[#1D3D6F]'>
                Research Templates
              </h3>
              <p className='text-gray-600 mb-4'>
                Download templates for research proposals, papers, and
                presentations.
              </p>
              <a
                href='#'
                className='inline-flex items-center text-[#1D3D6F] font-medium hover:text-[#F7B500] transition'
              >
                Download Templates <ChevronRight className='h-4 w-4 ml-1' />
              </a>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4'>
                <FileText className='h-6 w-6' />
              </div>
              <h3 className='text-lg font-semibold mb-2 text-[#1D3D6F]'>
                Research Funding
              </h3>
              <p className='text-gray-600 mb-4'>
                Learn about available funding opportunities for research
                projects at KUFE.
              </p>
              <a
                href='#'
                className='inline-flex items-center text-[#1D3D6F] font-medium hover:text-[#F7B500] transition'
              >
                Explore Funding <ChevronRight className='h-4 w-4 ml-1' />
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
