import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Search,
  FileText,
  BookOpen,
  Calendar,
  User,
  Download,
  ChevronRight,
  ArrowUpRight,
  BookMarked,
  GraduationCap,
  Award,
  Clock,
  CheckCircle2,
  X,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ResearchPage() {
  const [researchPapers, setResearchPapers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [activeTab, setActiveTab] = useState("all");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = {
    hero: useRef(null),
    papers: useRef(null),
    featured: useRef(null),
    resources: useRef(null),
  };

  // Fetch data from backend API
  useEffect(() => {
    const fetchResearchPapers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:4400/api/v1/research/published"
        );

        console.log("Research Papers:", response.data);

        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data.research)
        ) {
          // Add featured flag to some papers for demo
          const enhancedPapers = response.data.data.research.map(
            (paper, index) => ({
              ...paper,
              featured: index % 5 === 0, // Mark every 5th paper as featured
              citationCount: Math.floor(Math.random() * 50), // Add random citation count
              downloadCount: Math.floor(Math.random() * 200), // Add random download count
              type:
                index % 3 === 0
                  ? "Journal Article"
                  : index % 3 === 1
                  ? "Conference Paper"
                  : "Research Report",
            })
          );
          setResearchPapers(enhancedPapers);
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

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    Object.entries(sectionRefs).forEach(([key, ref]) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
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

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "featured" && paper.featured) ||
      (activeTab === "recent" &&
        new Date(paper.publicationDate || paper.createdAt) >
          new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));

    return matchesCategory && matchesSearch && matchesTab;
  });

  // Sort papers
  const sortedPapers = [...filtered].sort((a, b) => {
    if (sortBy === "date") {
      return (
        new Date(b.publicationDate || b.createdAt) -
        new Date(a.publicationDate || a.createdAt)
      );
    } else if (sortBy === "title") {
      return (a.title || "").localeCompare(b.title || "");
    } else if (sortBy === "author") {
      const authorA = (a.authors && a.authors[0]?.author_id?.fullName) || "";
      const authorB = (b.authors && b.authors[0]?.author_id?.fullName) || "";
      return authorA.localeCompare(authorB);
    } else if (sortBy === "citations") {
      return (b.citationCount || 0) - (a.citationCount || 0);
    }
    return 0;
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

  // Get featured papers
  const featuredPapers = researchPapers
    .filter((paper) => paper.featured)
    .slice(0, 3);

  // Retry fetching data
  const retryFetch = () => {
    setLoading(true);
    setError("");
    const fetchResearchPapers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4400/api/v1/research/published"
        );
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data.research)
        ) {
          const enhancedPapers = response.data.data.research.map(
            (paper, index) => ({
              ...paper,
              featured: index % 5 === 0,
              citationCount: Math.floor(Math.random() * 50),
              downloadCount: Math.floor(Math.random() * 200),
              type:
                index % 3 === 0
                  ? "Journal Article"
                  : index % 3 === 1
                  ? "Conference Paper"
                  : "Research Report",
            })
          );
          setResearchPapers(enhancedPapers);
        }
      } catch (err) {
        console.error("Error retrying fetch:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchResearchPapers();
  };

  // Render skeleton loaders
  const renderSkeletons = (count) => {
    return Array(count)
      .fill(0)
      .map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className='bg-white rounded-lg shadow-md overflow-hidden animate-pulse'
        >
          <div className='p-6'>
            <div className='flex justify-between items-start mb-4'>
              <div className='h-6 w-24 bg-gray-200 rounded-full'></div>
              <div className='h-6 w-20 bg-gray-200 rounded-full'></div>
            </div>
            <div className='h-7 w-3/4 bg-gray-200 rounded mb-4'></div>
            <div className='h-5 w-1/2 bg-gray-200 rounded mb-3'></div>
            <div className='h-5 w-1/3 bg-gray-200 rounded mb-4'></div>
            <div className='h-4 w-full bg-gray-200 rounded mb-2'></div>
            <div className='h-4 w-full bg-gray-200 rounded mb-2'></div>
            <div className='h-4 w-2/3 bg-gray-200 rounded mb-4'></div>
            <div className='flex flex-wrap gap-2 mb-4'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='h-6 w-16 bg-gray-200 rounded-full'
                ></div>
              ))}
            </div>
            <div className='flex justify-between items-center'>
              <div className='h-5 w-20 bg-gray-200 rounded'></div>
              <div className='h-10 w-24 bg-gray-200 rounded-lg'></div>
            </div>
          </div>
        </div>
      ));
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#E8ECEF] to-white'>
      <Navbar />

      {/* Header with Parallax Effect */}
      <div
        id='hero'
        ref={sectionRefs.hero}
        className='relative bg-[#1D3D6F] text-white pt-12 overflow-hidden'
        // style={{
        //   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        //   backgroundAttachment: "fixed",
        // }}
      >
        <div className='absolute inset-0 bg-gradient-to-r from-[#1D3D6F] via-[#1D3D6F]/95 to-[#1D3D6F]/90'></div>

        <div className='container mx-auto px-4 py-16 md:py-24 relative z-10'>
          <div
            className={`transition-all duration-700 transform ${
              visibleSections.hero
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {/* Breadcrumb */}
            <div className='flex items-center text-sm mb-6 text-white/70'>
              <a href='/' className='hover:text-white transition'>
                Home
              </a>
              <ChevronRight className='h-3 w-3 mx-2' />
              <span className='text-white'>Research Library</span>
            </div>

            <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
              <div className='max-w-2xl mb-8 md:mb-0'>
                <h1 className='text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white'>
                  Research Library
                </h1>
                <p className='text-white/90 text-lg md:text-xl max-w-xl leading-relaxed'>
                  Explore groundbreaking research from KUFE faculty and students
                  that contributes to economic development and policy-making.
                </p>
              </div>

              <div className='bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/20 w-full md:w-auto'>
                <div className='text-white mb-3 font-medium'>
                  Research Statistics
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-[#F7B500]'>
                      {researchPapers.length}
                    </div>
                    <div className='text-sm text-white/80'>Publications</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-[#F7B500]'>
                      {categories.length - 1}
                    </div>
                    <div className='text-sm text-white/80'>Categories</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className='absolute bottom-0 left-0 right-0 h-16 overflow-hidden'>
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
      <div className='container mx-auto px-4 py-8 relative z-10'>
        {/* Search + Filter */}
        <div
          className={`bg-white rounded-xl shadow-lg p-6 mb-10 -mt-12 relative z-20 border border-gray-100 transition-all duration-300 ${
            isSearchFocused ? "ring-2 ring-[#1D3D6F]/30" : ""
          }`}
        >
          <div className='flex flex-col md:flex-row items-stretch gap-4'>
            <div
              className={`relative w-full md:w-2/3 transition-all duration-300 ${
                isSearchFocused ? "scale-[1.02]" : ""
              }`}
            >
              <Search
                className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'
                size={20}
              />
              <input
                type='text'
                placeholder='Search by title, author, or keyword...'
                className='w-full py-4 pl-12 pr-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1D3D6F] focus:border-[#1D3D6F] focus:outline-none shadow-sm'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
            <div className='flex flex-col sm:flex-row gap-4 w-full md:w-1/3'>
              <div className='relative w-full'>
                <select
                  className='w-full h-full py-4 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1D3D6F] focus:outline-none appearance-none shadow-sm'
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className='absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                  <ChevronDown className='h-5 w-5 text-gray-400' />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-xl shadow-md p-6 mb-8 animate-fade-in'>
            <div className='flex items-start'>
              <div className='flex-shrink-0'>
                <X className='h-6 w-6 text-red-500' />
              </div>
              <div className='ml-3'>
                <h3 className='text-lg font-medium text-red-800'>
                  Error Loading Research Papers
                </h3>
                <div className='mt-2 text-red-700'>
                  <p>{error}</p>
                </div>
                <div className='mt-4'>
                  <button
                    onClick={retryFetch}
                    className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                  >
                    <RefreshCw className='h-4 w-4 mr-2' /> Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Research Papers Section */}
        <section
          id='papers'
          ref={sectionRefs.papers}
          className={`transition-all duration-700 transform ${
            visibleSections.papers
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          {/* Tabs */}
          <div className='mb-6 border-b border-gray-200'>
            <div className='flex flex-wrap -mb-px'>
              <button
                onClick={() => setActiveTab("all")}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "all"
                    ? "border-[#1D3D6F] text-[#1D3D6F]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Papers
              </button>
              <button
                onClick={() => setActiveTab("featured")}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "featured"
                    ? "border-[#1D3D6F] text-[#1D3D6F]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Featured Research
              </button>
              <button
                onClick={() => setActiveTab("recent")}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "recent"
                    ? "border-[#1D3D6F] text-[#1D3D6F]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Recent Publications
              </button>
            </div>
          </div>

          {/* Research Papers Count & Sort */}
          <div className='mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <p className='text-[#1D3D6F] font-medium'>
              Showing {sortedPapers.length} of {researchPapers.length} papers
            </p>
            <div className='flex items-center gap-3'>
              <span className='text-sm text-[#1D3D6F]'>Sort by:</span>
              <select
                className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D3D6F] bg-white shadow-sm'
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value='date'>Publication Date</option>
                <option value='title'>Title (A-Z)</option>
                <option value='author'>Author</option>
                <option value='citations'>Citations</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className='grid gap-6 grid-cols-1 md:grid-cols-2'>
              {renderSkeletons(6)}
            </div>
          ) : (
            <>
              {/* Research Cards */}
              {sortedPapers.length > 0 ? (
                <div className='grid gap-6 grid-cols-1 md:grid-cols-2'>
                  {sortedPapers.map((paper, index) => (
                    <div
                      key={paper._id || paper.id || index}
                      className='bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group'
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: "both",
                      }}
                    >
                      <div className='p-6'>
                        <div className='flex justify-between items-start mb-3'>
                          <div className='flex gap-2'>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                paper.status === "published"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {paper.status || "published"}
                            </span>
                            <span className='inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800'>
                              {paper.type || "Research Paper"}
                            </span>
                          </div>
                          {paper.category && (
                            <span className='bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-3 py-1 rounded-full'>
                              {paper.category}
                            </span>
                          )}
                        </div>

                        <h2 className='text-xl font-semibold text-[#1D3D6F] mb-3 group-hover:text-[#2C4F85] transition-colors'>
                          {paper.title}
                        </h2>

                        <div className='flex items-center text-sm text-gray-600 mb-2'>
                          <User className='h-4 w-4 mr-2 text-[#1D3D6F]' />
                          <span className='font-medium'>
                            {(paper.authors &&
                              paper.authors[0]?.author_id?.fullName) ||
                              "Unknown Author"}
                          </span>
                        </div>

                        <div className='flex items-center text-sm text-gray-600 mb-3'>
                          <Calendar className='h-4 w-4 mr-2 text-[#1D3D6F]' />
                          <span>
                            {formatDate(
                              paper.publicationDate || paper.createdAt
                            )}
                          </span>
                        </div>

                        <p className='text-sm text-gray-600 mb-4 line-clamp-3'>
                          {paper.abstract ||
                            paper.description ||
                            "No abstract available for this research paper."}
                        </p>

                        {paper.keywords &&
                          Array.isArray(paper.keywords) &&
                          paper.keywords.length > 0 && (
                            <div className='flex flex-wrap gap-2 mb-4'>
                              {paper.keywords.map((keyword, index) => (
                                <span
                                  key={index}
                                  className='bg-[#E8ECEF] text-[#1D3D6F] text-xs px-3 py-1 rounded-full hover:bg-[#1D3D6F] hover:text-white transition-colors cursor-pointer'
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          )}

                        <div className='flex flex-wrap justify-between items-center gap-4 pt-3 border-t border-gray-100'>
                          <div className='flex items-center gap-4'>
                            <div className='flex items-center text-sm text-gray-500'>
                              <BookOpen className='h-4 w-4 mr-1 text-[#1D3D6F]' />
                              <span>{paper.pages || "N/A"} pages</span>
                            </div>
                            {paper.citationCount !== undefined && (
                              <div className='flex items-center text-sm text-gray-500'>
                                <BookMarked className='h-4 w-4 mr-1 text-[#1D3D6F]' />
                                <span>{paper.citationCount} citations</span>
                              </div>
                            )}
                          </div>

                          <a
                            href={paper.filePath || paper.fileUrl || "#"}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2 bg-[#1D3D6F] hover:bg-[#2C4F85] text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm group-hover:shadow-md'
                          >
                            <FileText className='h-4 w-4' /> View PDF
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center bg-white rounded-xl shadow-md py-12 border border-gray-100'>
                  <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4'>
                    <BookOpen className='h-8 w-8' />
                  </div>
                  <h3 className='text-xl font-medium text-[#1D3D6F] mb-2'>
                    No research papers found
                  </h3>
                  <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                    We couldn't find any research papers matching your criteria.
                    Try adjusting your search or filter settings.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterCategory("All");
                      setActiveTab("all");
                    }}
                    className='bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] font-medium py-2 px-6 rounded-lg transition shadow-sm'
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Featured Research Section */}
        {!loading && !error && featuredPapers.length > 0 && (
          <section
            id='featured'
            ref={sectionRefs.featured}
            className={`mt-16 transition-all duration-700 transform ${
              visibleSections.featured
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className='text-2xl font-bold text-[#1D3D6F] mb-6 flex items-center'>
              <Award className='h-6 w-6 mr-2 text-[#F7B500]' />
              Featured Research
            </h2>

            <div className='bg-gradient-to-br from-[#1D3D6F] to-[#2C4F85] rounded-xl shadow-lg overflow-hidden'>
              <div className='p-8 text-white'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                  {featuredPapers.map((paper, index) => (
                    <div
                      key={paper._id || paper.id || index}
                      className='bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-xl group'
                    >
                      <div className='flex items-center justify-between mb-4'>
                        <span className='bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-3 py-1 rounded-full'>
                          {paper.category || "Research"}
                        </span>
                        <span className='text-white/70 text-sm'>
                          {new Date(
                            paper.publicationDate || paper.createdAt
                          ).getFullYear()}
                        </span>
                      </div>

                      <h4 className='font-semibold text-white text-lg mb-3 group-hover:text-[#F7B500] transition-colors'>
                        {paper.title}
                      </h4>

                      <p className='text-white/80 text-sm mb-4 line-clamp-3'>
                        {paper.abstract ||
                          paper.description ||
                          "No abstract available."}
                      </p>

                      <div className='flex items-center justify-between'>
                        <div className='flex items-center text-white/70 text-sm'>
                          <User className='h-4 w-4 mr-1' />
                          <span>
                            {(paper.authors &&
                              paper.authors[0]?.author_id?.fullName) ||
                              "Unknown"}
                          </span>
                        </div>

                        <a
                          href={paper.filePath || paper.fileUrl || "#"}
                          className='text-[#F7B500] group-hover:text-white font-medium text-sm flex items-center transition-colors'
                        >
                          View Paper <ArrowUpRight className='h-4 w-4 ml-1' />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Research Submission CTA */}
        <div className='mt-16 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100'>
          <div className='p-8 md:p-10'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-8'>
              <div className='md:w-2/3'>
                <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1D3D6F]/10 text-[#1D3D6F] mb-4'>
                  <FileText className='h-6 w-6' />
                </div>
                <h2 className='text-2xl font-bold mb-3 text-[#1D3D6F]'>
                  Submit Your Research
                </h2>
                <p className='text-gray-600 max-w-xl mb-6'>
                  Are you a faculty member or student with research to share?
                  Submit your paper for review and publication in our research
                  library. Your work could contribute to the academic community
                  and advance knowledge in your field.
                </p>
                <button className='bg-[#1D3D6F] hover:bg-[#2C4F85] text-white font-bold py-3 px-6 rounded-lg transition shadow-md inline-flex items-center'>
                  Submit Paper <ArrowUpRight className='h-4 w-4 ml-2' />
                </button>
              </div>

              <div className='md:w-1/3 bg-[#E8ECEF] rounded-xl p-6 border border-gray-200'>
                <h3 className='font-medium text-[#1D3D6F] mb-4'>
                  Submission Requirements
                </h3>
                <ul className='space-y-3'>
                  <li className='flex items-start'>
                    <CheckCircle2 className='h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5' />
                    <span className='text-sm text-gray-600'>
                      Complete research paper in PDF format
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <CheckCircle2 className='h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5' />
                    <span className='text-sm text-gray-600'>
                      Abstract of 250-300 words
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <CheckCircle2 className='h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5' />
                    <span className='text-sm text-gray-600'>
                      Keywords (3-5) relevant to your research
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <CheckCircle2 className='h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5' />
                    <span className='text-sm text-gray-600'>
                      Author information and affiliations
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Research Resources */}
        <section
          id='resources'
          ref={sectionRefs.resources}
          className={`mt-16 transition-all duration-700 transform ${
            visibleSections.resources
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className='text-2xl font-bold text-[#1D3D6F] mb-6 flex items-center'>
            <GraduationCap className='h-6 w-6 mr-2 text-[#F7B500]' />
            Research Resources
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4 group-hover:bg-[#1D3D6F] group-hover:text-white transition-colors'>
                <BookOpen className='h-6 w-6' />
              </div>
              <h3 className='text-lg font-semibold mb-3 text-[#1D3D6F] group-hover:text-[#2C4F85] transition-colors'>
                Research Guidelines
              </h3>
              <p className='text-gray-600 mb-4'>
                Access our comprehensive guidelines for conducting and
                publishing research at KUFE. Learn about methodologies, ethical
                considerations, and formatting requirements.
              </p>
              <a
                href='#'
                className='inline-flex items-center text-[#1D3D6F] font-medium hover:text-[#F7B500] transition-colors'
              >
                View Guidelines <ChevronRight className='h-4 w-4 ml-1' />
              </a>
            </div>

            <div className='bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4 group-hover:bg-[#1D3D6F] group-hover:text-white transition-colors'>
                <Download className='h-6 w-6' />
              </div>
              <h3 className='text-lg font-semibold mb-3 text-[#1D3D6F] group-hover:text-[#2C4F85] transition-colors'>
                Research Templates
              </h3>
              <p className='text-gray-600 mb-4'>
                Download templates for research proposals, papers, and
                presentations. Our standardized formats will help you create
                professional academic documents.
              </p>
              <a
                href='#'
                className='inline-flex items-center text-[#1D3D6F] font-medium hover:text-[#F7B500] transition-colors'
              >
                Download Templates <ChevronRight className='h-4 w-4 ml-1' />
              </a>
            </div>

            <div className='bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group'>
              <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4 group-hover:bg-[#1D3D6F] group-hover:text-white transition-colors'>
                <Clock className='h-6 w-6' />
              </div>
              <h3 className='text-lg font-semibold mb-3 text-[#1D3D6F] group-hover:text-[#2C4F85] transition-colors'>
                Research Funding
              </h3>
              <p className='text-gray-600 mb-4'>
                Learn about available funding opportunities for research
                projects at KUFE. Discover grants, scholarships, and other
                financial resources to support your work.
              </p>
              <a
                href='#'
                className='inline-flex items-center text-[#1D3D6F] font-medium hover:text-[#F7B500] transition-colors'
              >
                Explore Funding <ChevronRight className='h-4 w-4 ml-1' />
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
