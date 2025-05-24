import React from "react";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  BookOpen,
  Award,
  Users,
  Calendar,
  ChevronRight,
  Search,
  GraduationCap,
  ChevronDown,
  ArrowRight,
  MapPin,
  Clock,
  ExternalLink,
  Home,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../contexts/LanguageContext";

// Custom hook for intersection observer (for animations)
const useElementOnScreen = (options) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
    }, options);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [containerRef, options]);

  return [containerRef, isVisible];
};

// Custom hook for animated counters
const useCountUp = ({ end, duration = 2000, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [sectionRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  });

  useEffect(() => {
    let startTimestamp;
    let animationFrameId;
    let timeoutId;

    const startValue = 0;
    const endValue = Number.parseInt(end.replace(/,/g, "").replace(/\+/g, ""));

    const easeOutQuad = (t) => t * (2 - t);

    const animate = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = easeOutQuad(progress);

      const currentCount = Math.floor(
        startValue + easedProgress * (endValue - startValue)
      );

      // Format the count to match the original format (with commas and + if needed)
      let formattedCount = currentCount.toString();
      if (end.includes(",")) {
        formattedCount = currentCount.toLocaleString();
      }
      if (end.includes("+") && progress === 1) {
        formattedCount += "+";
      }

      setCount(formattedCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (isVisible) {
      timeoutId = setTimeout(() => {
        animationFrameId = requestAnimationFrame(animate);
      }, delay);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, [end, duration, delay, isVisible]);

  return [sectionRef, count];
};

// Program card component
const ProgramCard = ({ program, index }) => {
  const IconComponent = program.icon;
  const [cardRef, isVisible] = useElementOnScreen({
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  });
  const { t, direction } = useLanguage();

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden bg-white backdrop-blur-sm bg-opacity-80 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{
        transitionDelay: `${index * 100}ms`,
        transitionProperty: "transform, opacity, box-shadow",
      }}
    >
      {/* Decorative elements */}
      <div className='absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-[#004B87]/10 to-[#1D3D6F]/5 rounded-full blur-xl'></div>
      <div className='absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-tr from-[#F7B500]/10 to-[#F4B400]/5 rounded-full blur-lg'></div>

      <div className='relative z-10'>
        <div className='mb-6 relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-[#004B87] to-[#1D3D6F] rounded-full opacity-10 blur-md transform scale-110'></div>
          <div className='relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#004B87] to-[#1D3D6F] text-white'>
            {IconComponent && <IconComponent className='h-8 w-8' />}
          </div>
        </div>

        <h3 className='text-2xl font-bold mb-4 text-[#1D3D6F] group-hover:text-[#004B87] transition-colors'>
          {program.title}
        </h3>

        <p className='text-gray-600 mb-6 line-clamp-3'>{program.description}</p>

        <div className='pt-2 border-t border-gray-100'>
          <a
            href='#'
            className='inline-flex items-center font-semibold text-[#1D3D6F] hover:text-[#F7B500] transition-colors group-hover:gap-2'
          >
            <span>{t("Learn_More_Link")}</span>
            <ChevronRight
              className={`h-4 w-4 ${
                direction === "rtl" ? "mr-1" : "ml-1"
              } transition-transform group-hover:${
                direction === "rtl" ? "translate-x-[-0.25rem]" : "translate-x-1"
              }`}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

// Stat card component
const StatCard = ({ stat, index }) => {
  const [statRef, count] = useCountUp({
    end: stat.number,
    duration: 2000,
    delay: index * 200,
  });
  const { direction } = useLanguage();

  return (
    <div
      ref={statRef}
      className='relative overflow-hidden p-6 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 transform hover:translate-y-[-5px] transition-all duration-300'
    >
      {/* Decorative elements */}
      <div className='absolute -top-6 -right-6 w-16 h-16 bg-white/5 rounded-full'></div>
      <div className='absolute -bottom-8 -left-8 w-24 h-24 bg-[#F7B500]/10 rounded-full blur-md'></div>

      <div className='relative z-10'>
        <h3 className='text-4xl font-bold text-[#F7B500] mb-2'>{count}</h3>
        <p className='text-white/90 font-medium'>{stat.label}</p>
      </div>
    </div>
  );
};

// Event card component
const EventCard = ({ event, index }) => {
  const [cardRef, isVisible] = useElementOnScreen({
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  });
  const { t, direction } = useLanguage();

  return (
    <div
      ref={cardRef}
      className={`group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className='h-52 relative overflow-hidden'>
        <img
          src={`http://localhost:4400/public/img/event/${event.image}`}
          alt={event.title}
          className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500'
          onError={(e) => {
            e.target.src = "/placeholder.svg?height=200&width=300";
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
        <div className='absolute top-0 right-0 m-3'>
          <span className='bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-3 py-1 rounded-full shadow-md'>
            {event.type || "Event"}
          </span>
        </div>
        <div className='absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center'>
              <Clock className='h-4 w-4 mr-1 text-[#F7B500]' />
              <span className='text-xs'>{event.date}</span>
            </div>
            {event.location && (
              <div className='flex items-center'>
                <MapPin className='h-4 w-4 mr-1 text-[#F7B500]' />
                <span className='text-xs'>{event.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='p-6'>
        <h3 className='text-xl font-bold mb-3 text-[#1D3D6F] group-hover:text-[#004B87] transition-colors line-clamp-2'>
          {event.title}
        </h3>
        <p className='text-gray-600 mb-4 line-clamp-3'>{event.description}</p>
        <a
          href='#'
          className='inline-flex items-center font-semibold text-[#1D3D6F] hover:text-[#F7B500] transition-colors'
        >
          <span>{t("Read_More_Link")}</span>
          <ChevronRight
            className={`h-4 w-4 ${
              direction === "rtl" ? "mr-1" : "ml-1"
            } transition-transform group-hover:${
              direction === "rtl" ? "translate-x-[-0.25rem]" : "translate-x-1"
            }`}
          />
        </a>
      </div>
    </div>
  );
};

// Skeleton loaders
const ProgramSkeleton = () => (
  <div className='bg-white p-6 rounded-xl shadow animate-pulse'>
    <div className='flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4'></div>
    <div className='h-6 bg-gray-200 rounded w-3/4 mb-3'></div>
    <div className='h-4 bg-gray-200 rounded mb-2'></div>
    <div className='h-4 bg-gray-200 rounded mb-2'></div>
    <div className='h-4 bg-gray-200 rounded w-2/3 mb-4'></div>
    <div className='h-4 bg-gray-200 rounded w-1/3'></div>
  </div>
);

const EventSkeleton = () => (
  <div className='bg-white rounded-xl shadow overflow-hidden animate-pulse'>
    <div className='h-48 bg-gray-200'></div>
    <div className='p-6'>
      <div className='h-4 bg-gray-200 rounded w-1/3 mb-3'></div>
      <div className='h-6 bg-gray-200 rounded w-3/4 mb-3'></div>
      <div className='h-4 bg-gray-200 rounded mb-2'></div>
      <div className='h-4 bg-gray-200 rounded mb-2'></div>
      <div className='h-4 bg-gray-200 rounded w-2/3 mb-4'></div>
      <div className='h-4 bg-gray-200 rounded w-1/4'></div>
    </div>
  </div>
);

const AcademicPage = () => {
  const [programs, setPrograms] = useState([]);
  const [stats, setStats] = useState([]);
  const [newsEvents, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const { t, language, direction } = useLanguage();

  // Refs for scroll animations
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  // Array of icons to cycle through for each program
  const icons = [BookOpen, Award, Users, Calendar, GraduationCap];

  // Fetch programs, stats, and news/events in useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Programs
        const programsResponse = await axios.get(
          "http://localhost:4400/api/v1/departments/programs"
        );
        console.log("Programs:", programsResponse.data);

        if (
          !programsResponse.data ||
          !programsResponse.data.data ||
          !programsResponse.data.data.programs
        ) {
          throw new Error("Received invalid programs data format from server");
        }

        if (programsResponse.data.data.programs.length === 0) {
          setError("No academic programs are currently available.");
          setPrograms([]);
        } else {
          const formattedPrograms = programsResponse.data.data.programs.map(
            (program, index) => ({
              title: program.title,
              description: program.description,
              icon: icons[index % icons.length],
              type:
                program.type ||
                (index % 2 === 0 ? "undergraduate" : "graduate"),
            })
          );
          setPrograms(formattedPrograms);
        }

        // Fetch Stats
        const statsResponse = await axios.get(
          "http://localhost:4400/api/v1/departments/university-statistics"
        );
        console.log("Stats:", statsResponse.data);

        if (!statsResponse.data || !statsResponse.data.data) {
          throw new Error("Received invalid stats data format from server");
        }

        setStats(statsResponse.data.data.statistics);

        // Fetch News and Events
        const newsEventsResponse = await axios.get(
          "http://localhost:4400/api/v1/events/"
        );
        console.log("News & Events:", newsEventsResponse.data);

        // Handle single event case
        if (
          newsEventsResponse.data.data &&
          newsEventsResponse.data.data.latestEvent
        ) {
          // Convert single event to array
          setEvents([
            {
              id: newsEventsResponse.data.data.latestEvent._id,
              title: newsEventsResponse.data.data.latestEvent.title,
              description: newsEventsResponse.data.data.latestEvent.description,
              date: new Date(
                newsEventsResponse.data.data.latestEvent.date
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              location: newsEventsResponse.data.data.latestEvent.location,
              type: newsEventsResponse.data.data.latestEvent.type,
              image: newsEventsResponse.data.data.latestEvent.image,
            },
          ]);
        }
        // Handle array of events case
        else if (
          newsEventsResponse.data.data &&
          Array.isArray(newsEventsResponse.data.data.events)
        ) {
          setEvents(
            newsEventsResponse.data.data.events.map((event) => ({
              id: event._id,
              title: event.title,
              description: event.description,
              date: new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              location: event.location,
              type: event.type,
              image: event.image,
            }))
          );
        }
        // Handle other possible structures
        else if (
          newsEventsResponse.data.data &&
          Array.isArray(newsEventsResponse.data.data)
        ) {
          setEvents(
            newsEventsResponse.data.data.map((event) => ({
              id: event._id,
              title: event.title,
              description: event.description,
              date: new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              location: event.location,
              type: event.type,
              image: event.image,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching data:", err);

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
                err.response.data.message || "Unknown error occurred"
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

    fetchData();
  }, [language]);

  // Filter programs based on active filter
  const filteredPrograms =
    activeFilter === "all"
      ? programs
      : programs.filter((program) => program.type === activeFilter);

  // Parallax effect for hero section
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        heroRef.current.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div dir={direction} className='min-h-screen bg-[#F9F9F9]'>
      <Navbar />

      {/* Hero Section */}
      <div
        ref={heroRef}
        className='pt-16 relative bg-[#1D3D6F] text-white overflow-hidden'
        // style={{
        //   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        //   backgroundBlendMode: "overlay",
        // }}
      >
        {/* Decorative elements */}
        <div className='absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-[#004B87] to-transparent rounded-full filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2'></div>
        <div className='absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-t from-[#F7B500] to-transparent rounded-full filter blur-3xl opacity-10 transform -translate-x-1/2 translate-y-1/2'></div>

        {/* Breadcrumb */}
        <div className='container mx-auto px-4 pt-6'>
          <div className='flex items-center text-sm text-white/70'>
            <a href='/' className='hover:text-white flex items-center'>
              <Home
                className={`h-3.5 w-3.5 ${
                  direction === "rtl" ? "ml-1" : "mr-1"
                }`}
              />
              <span>{t("Home")}</span>
            </a>
            <ChevronRight
              className={`h-3.5 w-3.5 mx-2 ${
                direction === "rtl" ? "rotate-180" : ""
              }`}
            />
            <span className='text-white'>{t("Academic_Programs_Title")}</span>
          </div>
        </div>

        <div className='container mx-auto px-4 py-12 md:py-20'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='max-w-2xl mb-10 md:mb-0'>
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-white'>
                {t("Academic_Programs_Title").split(" ")[0]}{" "}
                <span className='text-[#F7B500]'>
                  {t("Academic_Programs_Title").split(" ")[1]}
                </span>
              </h1>
              <p className='mt-4 text-white/90 text-lg md:text-xl leading-relaxed'>
                {t("Academic_Programs_Description")}
              </p>

              <div className='mt-8 flex flex-wrap gap-4'>
                <a
                  href='#programs'
                  className='px-6 py-3 bg-[#F7B500] text-[#1D3D6F] font-bold rounded-lg hover:bg-[#F7B500]/90 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                >
                  {t("Explore_Programs_Button")}
                </a>
              </div>
            </div>


          </div>
        </div>

        {/* Decorative wave */}
        <div className='absolute bottom-0 left-0 right-0 h-16 overflow-hidden'>
          <svg
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
            className='absolute bottom-0 left-0 w-full h-full text-[#F9F9F9] fill-current'
          >
            <path d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0z'></path>
          </svg>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className='bg-red-50 border-l-4 border-red-500 text-red-700 p-5 my-8 mx-4 md:mx-auto max-w-6xl rounded-r-lg shadow-md'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-red-500'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-red-800'>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className='mt-2 text-xs font-medium text-red-800 hover:text-red-600 underline'
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Academic Programs Section */}
      <section id='programs' className='py-20 px-4'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center max-w-3xl mx-auto mb-16'>
            <div className='inline-flex items-center justify-center mb-4'>
              <div className='h-0.5 w-6 bg-[#F7B500]'></div>
              <span className='mx-2 text-[#F7B500] font-semibold'>
                {t("DISCOVER_LABEL")}
              </span>
              <div className='h-0.5 w-6 bg-[#F7B500]'></div>
            </div>
            <h2 className='text-3xl md:text-4xl font-bold mb-6 text-[#1D3D6F]'>
              {t("Our_Academic_Programs_Title")}
            </h2>
            <p className='text-gray-600 text-lg'>
              {t("Academic_Programs_Section_Description")}
            </p>

            {/* Program filters */}
            <div className='mt-10 inline-flex flex-wrap justify-center gap-2 p-1 bg-gray-100 rounded-lg'>
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  activeFilter === "all"
                    ? "bg-white text-[#1D3D6F] shadow-sm"
                    : "text-gray-600 hover:text-[#1D3D6F]"
                }`}
              >
                {t("All_Programs_Filter")}
              </button>
              <button
                onClick={() => setActiveFilter("undergraduate")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  activeFilter === "undergraduate"
                    ? "bg-white text-[#1D3D6F] shadow-sm"
                    : "text-gray-600 hover:text-[#1D3D6F]"
                }`}
              >
                {t("Undergraduate_Level")}
              </button>
              <button
                onClick={() => setActiveFilter("graduate")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  activeFilter === "graduate"
                    ? "bg-white text-[#1D3D6F] shadow-sm"
                    : "text-gray-600 hover:text-[#1D3D6F]"
                }`}
              >
                {t("Graduate_Level")}
              </button>
            </div>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {[...Array(6)].map((_, index) => (
                <ProgramSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Programs Grid */}
          {!loading && !error && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((program, index) => (
                  <ProgramCard key={index} program={program} index={index} />
                ))
              ) : (
                <div className='col-span-1 md:col-span-3 text-center py-16'>
                  <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 text-gray-500 mb-6'>
                    <Search className='h-10 w-10' />
                  </div>
                  <h3 className='text-xl font-medium text-[#1D3D6F] mb-2'>
                    {t("No_Programs_Found_Title")}
                  </h3>
                  <p className='text-gray-500 max-w-md mx-auto'>
                    {t("No_Programs_Found_Description")}
                  </p>
                  <button
                    onClick={() => setActiveFilter("all")}
                    className='mt-6 px-6 py-2 bg-[#1D3D6F] text-white rounded-lg hover:bg-[#004B87] transition'
                  >
                    {t("View_All_Programs_Button")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className='py-20 relative bg-gradient-to-r from-[#1D3D6F] to-[#004B87] text-white overflow-hidden'
      >
        {/* Decorative elements */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F7B500] to-transparent opacity-30'></div>
          <div className='absolute -top-40 -right-40 w-80 h-80 bg-[#F7B500] rounded-full mix-blend-overlay filter blur-3xl opacity-10'></div>
          <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-[#F7B500] rounded-full mix-blend-overlay filter blur-3xl opacity-10'></div>
        </div>

        <div className='container mx-auto px-4 relative z-10'>
          <div className='text-center max-w-3xl mx-auto mb-16'>
            <div className='inline-flex items-center justify-center mb-4'>
              <div className='h-0.5 w-6 bg-[#F7B500]'></div>
              <span className='mx-2 text-[#F7B500] font-semibold'>
                {t("BY_THE_NUMBERS_LABEL")}
              </span>
              <div className='h-0.5 w-6 bg-[#F7B500]'></div>
            </div>
            <h2 className='text-3xl md:text-4xl font-bold mb-6 text-white'>
              {t("University_Statistics_Title")}
            </h2>
            <p className='text-white/80 text-lg'>
              {t("University_Statistics_Description")}
            </p>
          </div>

          <div className='max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {loading
              ? [...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className='bg-white/5 rounded-xl p-6 animate-pulse'
                  >
                    <div className='h-10 bg-white/10 rounded mb-2'></div>
                    <div className='h-4 bg-white/10 rounded w-2/3'></div>
                  </div>
                ))
              : Array.isArray(stats) &&
                stats.map((stat, index) => (
                  <StatCard key={index} stat={stat} index={index} />
                ))}
          </div>
        </div>
      </section>

      {/* Latest News & Events */}
      <section className='py-20 px-4'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center max-w-3xl mx-auto mb-16'>
            <div className='inline-flex items-center justify-center mb-4'>
              <div className='h-0.5 w-6 bg-[#F7B500]'></div>
              <span className='mx-2 text-[#F7B500] font-semibold'>
                {t("STAY_UPDATED_LABEL")}
              </span>
              <div className='h-0.5 w-6 bg-[#F7B500]'></div>
            </div>
            <h2 className='text-3xl md:text-4xl font-bold mb-6 text-[#1D3D6F]'>
              {t("Latest_News_Events_Title")}
            </h2>
            <p className='text-gray-600 text-lg'>
              {t("Latest_News_Events_Description")}
            </p>
          </div>

          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {[...Array(3)].map((_, index) => (
                <EventSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {Array.isArray(newsEvents) && newsEvents.length > 0 ? (
                newsEvents.map((event, index) => (
                  <EventCard key={index} event={event} index={index} />
                ))
              ) : (
                <div className='col-span-1 md:col-span-3 text-center py-16 bg-white rounded-xl shadow-md'>
                  <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 text-gray-500 mb-6'>
                    <Calendar className='h-10 w-10' />
                  </div>
                  <h3 className='text-xl font-medium text-[#1D3D6F] mb-2'>
                    {t("No_Events_Found_Title")}
                  </h3>
                  <p className='text-gray-500 max-w-md mx-auto'>
                    {t("No_Events_Found_Description")}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className='text-center mt-12'>
            <a
              href='#'
              className='inline-flex items-center px-6 py-3 bg-white border border-gray-200 rounded-lg text-[#1D3D6F] font-medium hover:bg-gray-50 transition shadow-sm'
            >
              {t("View_All_News_Events_Button")}
              <ArrowRight
                className={`${direction === "rtl" ? "mr-2" : "ml-2"} h-4 w-4 ${
                  direction === "rtl" ? "rotate-180" : ""
                }`}
              />
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className='py-16 px-4'>
        <div className='max-w-7xl mx-auto'>
          <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1D3D6F] to-[#004B87] shadow-xl'>
            {/* Decorative elements */}
            <div className='absolute top-0 right-0 w-64 h-64 bg-[#F7B500] rounded-full mix-blend-overlay filter blur-3xl opacity-20 transform translate-x-1/3 -translate-y-1/3'></div>
            <div className='absolute bottom-0 left-0 w-64 h-64 bg-[#F7B500] rounded-full mix-blend-overlay filter blur-3xl opacity-10 transform -translate-x-1/3 translate-y-1/3'></div>

            <div className='relative z-10 p-8 md:p-12 lg:p-16'>
              <div className='flex flex-col md:flex-row md:items-center justify-between gap-10'>
                <div className='max-w-2xl'>
                  <h2 className='text-3xl md:text-4xl font-bold mb-4 text-white'>
                    {t("Academic_Journey_Title")}
                  </h2>
                  <p className='text-white/90 text-lg leading-relaxed mb-8'>
                    {t("Academic_Journey_Description")}
                  </p>

                </div>

                <div className='hidden lg:block'>
                  <div className='relative'>
                    <div className='absolute inset-0 bg-white/5 backdrop-blur-sm rounded-xl transform rotate-6 scale-95'></div>
                    <div className='relative bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20'>
                      <div className='flex items-center mb-4'>
                        <div className='w-2 h-2 rounded-full bg-red-400 mr-1.5'></div>
                        <div className='w-2 h-2 rounded-full bg-yellow-400 mr-1.5'></div>
                        <div className='w-2 h-2 rounded-full bg-green-400'></div>
                      </div>
                      <div className='space-y-3'>
                        <div className='h-4 bg-white/20 rounded w-3/4'></div>
                        <div className='h-4 bg-white/20 rounded'></div>
                        <div className='h-4 bg-white/20 rounded w-5/6'></div>
                        <div className='h-4 bg-white/20 rounded w-2/3'></div>
                      </div>
                      <div className='mt-6 flex justify-between'>
                        <div className='h-8 w-24 bg-[#F7B500] rounded'></div>
                        <div className='h-8 w-24 bg-white/20 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default AcademicPage;
