import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Clock,
  MapPin,
  Search,
  ChevronRight,
  ArrowRight,
  Filter,
  Loader2,
  AlertCircle,
  Bell,
  Tag,
  CalendarIcon,
  Megaphone,
  Newspaper,
  ExternalLink,
  BookOpen,
  Users,
  Share2,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Animation helper hook
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

function AnnouncementsEventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // State for API data
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState({
    announcements: true,
    events: true,
    news: true,
  });
  const [error, setError] = useState({
    announcements: false,
    events: false,
    news: false,
  });

  // Animation refs
  const [heroRef, heroVisible] = useElementOnScreen({ threshold: 0.1 });
  const [announcementsRef, announcementsVisible] = useElementOnScreen({
    threshold: 0.1,
  });
  const [eventsRef, eventsVisible] = useElementOnScreen({ threshold: 0.1 });
  const [newsRef, newsVisible] = useElementOnScreen({ threshold: 0.1 });
  const [archiveRef, archiveVisible] = useElementOnScreen({ threshold: 0.1 });

  // Fetch data from APIs
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:4400/api/v1/announcement/"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch announcements");
        }
        const responseData = await response.json();
        // Extract announcements from the correct path in the response
        const announcementsData = responseData.data || [];

        // Map the API data to our component's expected format
        const formattedAnnouncements = announcementsData.map((item) => ({
          id: item._id,
          title: item.title,
          content: item.content,
          date: item.publish_date,
          category: item.category,
          featured: item.is_featured,
        }));

        setAnnouncements(formattedAnnouncements);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError((prev) => ({ ...prev, announcements: true }));
      } finally {
        setLoading((prev) => ({ ...prev, announcements: false }));
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:4400/api/v1/events/");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const responseData = await response.json();
        // Extract events from the correct path in the response
        const eventsData = responseData.data?.events || [];

        // Map the API data to our component's expected format
        const formattedEvents = eventsData.map((item) => ({
          id: item._id,
          title: item.title,
          description: item.description,
          date: item.date,
          time: new Date(item.date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          location: item.location,
          category: item.type, // Using 'type' as category
          featured: false, // Default value as it's not in the API
          image: item.image,
        }));

        setEvents(formattedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError((prev) => ({ ...prev, events: true }));
      } finally {
        setLoading((prev) => ({ ...prev, events: false }));
      }
    };

    const fetchNews = async () => {
      try {
        const response = await fetch("http://127.0.0.1:4400/api/v1/news/");
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const responseData = await response.json();

        // Extract news from the correct path in the response
        const newsData = responseData.data?.news || [];

        // Map the API data to our component's expected format
        const formattedNews = newsData.map((item) => ({
          id: item._id,
          title: item.title,
          summary: item.content, // Using 'content' as summary
          date: item.publish_date,
          image: item.image,
          category: item.category,
        }));

        setNews(formattedNews);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError((prev) => ({ ...prev, news: true }));
      } finally {
        setLoading((prev) => ({ ...prev, news: false }));
      }
    };

    fetchAnnouncements();
    fetchEvents();
    fetchNews();
  }, []);

  // Text content
  const content = {
    title: "Announcements & Events",
    subtitle:
      "Stay updated with the latest news and upcoming events at the Faculty of Economics",
    search: "Search announcements and events...",
    filter: "Filter by category",
    categories: {
      all: "All Categories",
      academic: "Academic",
      admission: "Admission",
      conference: "Conference",
      workshop: "Workshop",
      seminar: "Seminar",
      cultural: "Cultural",
      research: "Research",
    },
    featured: {
      title: "Featured Announcements",
      viewAll: "View All Announcements",
    },
    upcoming: {
      title: "Upcoming Events",
      viewAll: "View All Events",
      today: "Today",
      tomorrow: "Tomorrow",
      register: "Register",
      moreInfo: "More Info",
    },
    news: {
      title: "Latest News",
      viewAll: "View All News",
      readMore: "Read More",
    },
    tabs: {
      all: "All",
      announcements: "Announcements",
      events: "Events",
      news: "News",
    },
    archive: {
      title: "Archive",
      viewMore: "View More",
    },
    noResults: "No results found for your search criteria.",
    loading: "Loading data...",
    error: "Error loading data. Please try again later.",
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  // Filter announcements based on search query and category
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      searchQuery === "" ||
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || announcement.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Filter events based on search query and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || event.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Filter news based on search query and category
  const filteredNews = news.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Get current date for highlighting today's events
  const currentDate = new Date();
  const today = currentDate.toISOString().split("T")[0];
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(currentDate.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Loading component
  const LoadingComponent = () => (
    <div className='flex justify-center items-center py-16'>
      <Loader2 className='h-8 w-8 text-[#1D3D6F] animate-spin' />
      <span className='ml-2 text-[#1D3D6F] font-medium'>{content.loading}</span>
    </div>
  );

  // Error component
  const ErrorComponent = () => (
    <div className='flex flex-col justify-center items-center py-16'>
      <AlertCircle className='h-12 w-12 text-red-500 mb-4' />
      <p className='text-lg font-medium text-red-500'>{content.error}</p>
    </div>
  );

  // Get category badge color
  const getCategoryColor = (category) => {
    const colors = {
      academic: "bg-blue-100 text-blue-800",
      admission: "bg-green-100 text-green-800",
      conference: "bg-purple-100 text-purple-800",
      workshop: "bg-orange-100 text-orange-800",
      seminar: "bg-pink-100 text-pink-800",
      cultural: "bg-indigo-100 text-indigo-800",
      research: "bg-teal-100 text-teal-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />

      {/* Hero Section with Enhanced Design - Left Aligned */}
      <div
        ref={heroRef}
        className={`relative bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white overflow-hidden
    ${heroVisible ? "opacity-100 animate-fade-in-down" : "opacity-0"}`}
        style={{
          animationDelay: "0.2s",
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {/* Decorative Elements */}
        <div className='absolute top-0 left-0 w-full h-full overflow-hidden'>
          <div className='absolute top-10 left-10 w-32 h-32 bg-[#F7B500]/10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-10 right-10 w-64 h-64 bg-[#1D3D6F]/20 rounded-full blur-3xl'></div>
          <div className='absolute top-1/2 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-xl'></div>

          {/* Background Pattern */}
          <div className='absolute inset-0 opacity-5'>
            <div
              className='absolute inset-0'
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                backgroundSize: "24px 24px",
              }}
            ></div>
          </div>
        </div>

        <div className='container mx-auto px-4 py-20 md:py-28 relative z-10'>
          <div className='max-w-2xl text-left'>
            <div className='inline-flex items-center px-3 py-1 rounded-full bg-[#F7B500]/20 text-[#F7B500] text-sm font-medium mb-6'>
              <span className='mr-2'>•</span>
              <span>Faculty of Economics</span>
            </div>
            <h1 className='text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white'>
              {content.title}
            </h1>
            <p className='mt-4 text-white/80 text-lg md:text-xl max-w-xl leading-relaxed'>
              {content.subtitle}
            </p>

            <div className='mt-10 flex flex-wrap gap-4'>
              <a
                href='#announcements'
                className='inline-flex items-center px-6 py-3 bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#F7B500]/30 transform hover:-translate-y-1'
              >
                <Megaphone className='mr-2 h-5 w-5' />
                View Announcements
              </a>
              <a
                href='#events'
                className='inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-300 backdrop-blur-sm'
              >
                <CalendarIcon className='mr-2 h-5 w-5' />
                Browse Events
              </a>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className='absolute bottom-0 left-0 right-0 h-16 overflow-hidden'>
          <svg
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
            className='absolute bottom-0 left-0 w-full h-full text-white fill-current'
          >
            <path d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0z'></path>
          </svg>
        </div>
      </div>

      {/* Search and filter section */}
      <div className='container mx-auto px-4 -mt-8 relative z-20'>
        <div className='bg-white rounded-2xl shadow-xl p-6 border border-[#E8ECEF]/50 backdrop-blur-lg'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1D3D6F] h-5 w-5' />
              <Input
                type='text'
                placeholder={content.search}
                value={searchQuery}
                onChange={handleSearchChange}
                className='pl-10 border-[#E8ECEF] rounded-lg focus:border-[#1D3D6F] focus:ring focus:ring-[#1D3D6F]/20 transition-all duration-300'
              />
            </div>
            <div className='md:w-64 flex items-center gap-2'>
              <Filter className='text-[#1D3D6F] h-5 w-5 hidden md:block' />
              <Select
                value={categoryFilter}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className='border-[#E8ECEF] rounded-lg focus:border-[#1D3D6F] focus:ring focus:ring-[#1D3D6F]/20 transition-all duration-300'>
                  <SelectValue placeholder={content.filter} />
                </SelectTrigger>
                <SelectContent className='bg-white/95 backdrop-blur-md border-[#E8ECEF] z-50 rounded-lg shadow-xl'>
                  <SelectItem
                    value='all'
                    className='hover:bg-[#E8ECEF] rounded-md transition-colors duration-200'
                  >
                    {content.categories.all}
                  </SelectItem>
                  <SelectItem
                    value='academic'
                    className='hover:bg-[#E8ECEF] rounded-md transition-colors duration-200'
                  >
                    {content.categories.academic}
                  </SelectItem>
                  <SelectItem
                    value='admission'
                    className='hover:bg-[#E8ECEF] rounded-md transition-colors duration-200'
                  >
                    {content.categories.admission}
                  </SelectItem>
                  <SelectItem
                    value='conference'
                    className='hover:bg-[#E8ECEF] rounded-md transition-colors duration-200'
                  >
                    {content.categories.conference}
                  </SelectItem>
                  <SelectItem
                    value='workshop'
                    className='hover:bg-[#E8ECEF] rounded-md transition-colors duration-200'
                  >
                    {content.categories.workshop}
                  </SelectItem>
                  <SelectItem
                    value='seminar'
                    className='hover:bg-[#E8ECEF] rounded-md transition-colors duration-200'
                  >
                    {content.categories.seminar}
                  </SelectItem>
                  <SelectItem
                    value='cultural'
                    className='hover:bg-[#E8ECEF] rounded-md transition-colors duration-200'
                  >
                    {content.categories.cultural}
                  </SelectItem>
                  <SelectItem
                    value='research'
                    className='hover:bg-[#E8ECEF] rounded-md transition-colors duration-200'
                  >
                    {content.categories.research}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-[#F7FAFC] rounded-xl p-6 shadow-sm border border-[#E8ECEF] flex items-center'>
            <div className='bg-[#1D3D6F]/10 p-4 rounded-full mr-4'>
              <Megaphone className='h-6 w-6 text-[#1D3D6F]' />
            </div>
            <div>
              <p className='text-sm text-[#64748B] font-medium'>
                Total Announcements
              </p>
              <p className='text-2xl font-bold text-[#1D3D6F]'>
                {announcements.length}
              </p>
            </div>
          </div>
          <div className='bg-[#F7FAFC] rounded-xl p-6 shadow-sm border border-[#E8ECEF] flex items-center'>
            <div className='bg-[#1D3D6F]/10 p-4 rounded-full mr-4'>
              <CalendarIcon className='h-6 w-6 text-[#1D3D6F]' />
            </div>
            <div>
              <p className='text-sm text-[#64748B] font-medium'>
                Upcoming Events
              </p>
              <p className='text-2xl font-bold text-[#1D3D6F]'>
                {events.length}
              </p>
            </div>
          </div>
          <div className='bg-[#F7FAFC] rounded-xl p-6 shadow-sm border border-[#E8ECEF] flex items-center'>
            <div className='bg-[#1D3D6F]/10 p-4 rounded-full mr-4'>
              <Newspaper className='h-6 w-6 text-[#1D3D6F]' />
            </div>
            <div>
              <p className='text-sm text-[#64748B] font-medium'>Latest News</p>
              <p className='text-2xl font-bold text-[#1D3D6F]'>{news.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className='container mx-auto px-4 py-8'>
        <Tabs
          defaultValue='all'
          className='w-full'
          onValueChange={handleTabChange}
        >
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
            <div className='mb-4 md:mb-0'>
              <h2 className='text-2xl font-bold text-[#1D3D6F] mb-2'>
                Browse Content
              </h2>
              <p className='text-[#64748B]'>
                Filter content by type or use the search above
              </p>
            </div>
            <TabsList className='grid w-full md:w-auto grid-cols-4 bg-[#F7FAFC] rounded-lg p-1 border border-[#E8ECEF]'>
              <TabsTrigger
                value='all'
                className='data-[state=active]:bg-[#1D3D6F] data-[state=active]:text-slate-800  rounded-md transition-all duration-300'
              >
                {content.tabs.all}
              </TabsTrigger>
              <TabsTrigger
                value='announcements'
                className='data-[state=active]:bg-[#1D3D6F] data-[state=active]:text-slate-800 rounded-md transition-all duration-300'
              >
                <Megaphone className='h-4 w-4 mr-2 inline-block' />
                {content.tabs.announcements}
              </TabsTrigger>
              <TabsTrigger
                value='events'
                className='data-[state=active]:bg-[#1D3D6F] data-[state=active]:text-slate-800  rounded-md transition-all duration-300'
              >
                <CalendarIcon className='h-4 w-4 mr-2 inline-block' />
                {content.tabs.events}
              </TabsTrigger>
              <TabsTrigger
                value='news'
                className='data-[state=active]:bg-[#1D3D6F] data-[state=active]:text-slate-800 rounded-md transition-all duration-300'
              >
                <Newspaper className='h-4 w-4 mr-2 inline-block' />
                {content.tabs.news}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* All Tab */}
          <TabsContent value='all'>
            {/* Loading and error states for all content */}
            {(loading.announcements || loading.events || loading.news) && (
              <LoadingComponent />
            )}

            {(error.announcements || error.events || error.news) && (
              <ErrorComponent />
            )}

            {/* Featured Announcements */}
            {!loading.announcements &&
              !error.announcements &&
              filteredAnnouncements.some((a) => a.featured) && (
                <section
                  id='announcements'
                  ref={announcementsRef}
                  className={`mb-16 transition-all duration-700 transform 
                  ${
                    announcementsVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: "0.3s" }}
                >
                  <div className='flex justify-between items-center mb-6'>
                    <div className='flex items-center'>
                      <div className='bg-[#F7B500]/20 p-2 rounded-lg mr-3'>
                        <Bell className='h-6 w-6 text-[#F7B500]' />
                      </div>
                      <div>
                        <h2 className='text-2xl font-bold text-[#1D3D6F]'>
                          {content.featured.title}
                        </h2>
                        <p className='text-[#64748B] text-sm'>
                          Important announcements from the faculty
                        </p>
                      </div>
                    </div>
                    <Button
                      variant='outline'
                      className='border-[#1D3D6F] text-[#1D3D6F] hover:bg-[#1D3D6F] hover:text-white flex items-center gap-1 transition-colors duration-300'
                    >
                      {content.featured.viewAll}{" "}
                      <ArrowRight className='h-4 w-4' />
                    </Button>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {filteredAnnouncements
                      .filter((a) => a.featured)
                      .map((announcement) => (
                        <Card
                          key={announcement.id}
                          className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden transform hover:-translate-y-1'
                        >
                          <CardContent className='p-0'>
                            <div className='bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] p-6 text-white'>
                              <div className='flex justify-between items-start'>
                                <div className='inline-flex items-center px-2 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-3'>
                                  <span className='mr-1'>•</span>
                                  <span>Featured</span>
                                </div>
                                <div
                                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(
                                    announcement.category
                                  )}`}
                                >
                                  {content.categories[announcement.category] ||
                                    announcement.category}
                                </div>
                              </div>
                              <h3 className='text-xl font-bold mb-2'>
                                {announcement.title}
                              </h3>
                              <p className='text-white text-sm opacity-80 flex items-center'>
                                <CalendarIcon className='h-4 w-4 mr-2 opacity-70' />
                                {formatDate(announcement.date)}
                              </p>
                            </div>
                            <div className='p-6 bg-white'>
                              <p className='text-[#334155] mb-4'>
                                {announcement.content}
                              </p>
                              <div className='flex justify-between items-center'>
                                <Button
                                  variant='link'
                                  className='text-[#1D3D6F] hover:text-[#2C4F85] p-0 h-auto flex items-center gap-1 transition-colors duration-300'
                                >
                                  Read full announcement{" "}
                                  <ArrowRight className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='text-[#64748B] hover:text-[#1D3D6F] p-2 h-8 w-8 rounded-full'
                                >
                                  <Share2 className='h-4 w-4' />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </section>
              )}

            {/* Upcoming Events */}
            {!loading.events && !error.events && filteredEvents.length > 0 && (
              <section
                id='events'
                ref={eventsRef}
                className={`mb-16 transition-all duration-700 transform 
                  ${
                    eventsVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                style={{ transitionDelay: "0.5s" }}
              >
                <div className='flex justify-between items-center mb-6'>
                  <div className='flex items-center'>
                    <div className='bg-[#1D3D6F]/10 p-2 rounded-lg mr-3'>
                      <CalendarIcon className='h-6 w-6 text-[#1D3D6F]' />
                    </div>
                    <div>
                      <h2 className='text-2xl font-bold text-[#1D3D6F]'>
                        {content.upcoming.title}
                      </h2>
                      <p className='text-[#64748B] text-sm'>
                        Join us at these upcoming faculty events
                      </p>
                    </div>
                  </div>
                  <Button
                    variant='outline'
                    className='border-[#1D3D6F] text-[#1D3D6F] hover:bg-[#1D3D6F] hover:text-white flex items-center gap-1 transition-colors duration-300'
                  >
                    {content.upcoming.viewAll}{" "}
                    <ArrowRight className='h-4 w-4' />
                  </Button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  {filteredEvents
                    .sort(
                      (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    )
                    .slice(0, 3)
                    .map((event) => (
                      <Card
                        key={event.id}
                        className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden transform hover:-translate-y-1'
                      >
                        <CardContent className='p-0'>
                          <div className='relative h-48 overflow-hidden'>
                            <img
                              src={
                                event.image ||
                                "/placeholder.svg?height=200&width=400"
                              }
                              alt={event.title}
                              className='w-full h-full object-cover'
                            />
                            <div className='absolute top-4 right-4'>
                              {event.date === today ? (
                                <div className='bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-2.5 py-1 rounded-full shadow-md'>
                                  {content.upcoming.today}
                                </div>
                              ) : event.date === tomorrowStr ? (
                                <div className='bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-2.5 py-1 rounded-full shadow-md'>
                                  {content.upcoming.tomorrow}
                                </div>
                              ) : (
                                <div
                                  className={`text-xs font-medium px-2.5 py-1 rounded-full shadow-md ${getCategoryColor(
                                    event.category
                                  )}`}
                                >
                                  {content.categories[event.category] ||
                                    event.category}
                                </div>
                              )}
                            </div>
                            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
                            <div className='absolute bottom-0 left-0 w-full p-4'>
                              <div className='flex items-center text-white mb-1'>
                                <CalendarIcon className='h-4 w-4 mr-2' />
                                <span className='text-sm'>
                                  {formatDate(event.date)}
                                </span>
                              </div>
                              <h3 className='text-xl font-bold text-white'>
                                {event.title}
                              </h3>
                            </div>
                          </div>
                          <div className='p-6 bg-white'>
                            <p className='text-[#334155] mb-4 line-clamp-2'>
                              {event.description}
                            </p>
                            <div className='space-y-2 mb-4'>
                              <div className='flex items-center text-sm text-[#64748B]'>
                                <Clock className='h-4 w-4 mr-2 text-[#1D3D6F]' />
                                <span>{event.time}</span>
                              </div>
                              <div className='flex items-center text-sm text-[#64748B]'>
                                <MapPin className='h-4 w-4 mr-2 text-[#1D3D6F]' />
                                <span>{event.location}</span>
                              </div>
                            </div>
                            <div className='flex gap-2'>
                              <Button className='bg-[#1D3D6F] hover:bg-[#2C4F85] text-white flex-1 transition-colors duration-300'>
                                {content.upcoming.register}
                              </Button>
                              <Button
                                variant='outline'
                                className='border-[#1D3D6F] text-[#1D3D6F] hover:bg-[#E8ECEF] transition-colors duration-300'
                              >
                                {content.upcoming.moreInfo}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </section>
            )}

            {/* Latest News */}
            {!loading.news && !error.news && filteredNews.length > 0 && (
              <section
                ref={newsRef}
                className={`mb-16 transition-all duration-700 transform 
                  ${
                    newsVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                style={{ transitionDelay: "0.7s" }}
              >
                <div className='flex justify-between items-center mb-6'>
                  <div className='flex items-center'>
                    <div className='bg-[#F7B500]/20 p-2 rounded-lg mr-3'>
                      <Newspaper className='h-6 w-6 text-[#F7B500]' />
                    </div>
                    <div>
                      <h2 className='text-2xl font-bold text-[#1D3D6F]'>
                        {content.news.title}
                      </h2>
                      <p className='text-[#64748B] text-sm'>
                        Recent updates from the faculty
                      </p>
                    </div>
                  </div>
                  <Button
                    variant='outline'
                    className='border-[#1D3D6F] text-[#1D3D6F] hover:bg-[#1D3D6F] hover:text-white flex items-center gap-1 transition-colors duration-300'
                  >
                    {content.news.viewAll} <ArrowRight className='h-4 w-4' />
                  </Button>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  {filteredNews.slice(0, 3).map((item) => (
                    <Card
                      key={item.id}
                      className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden transform hover:-translate-y-1'
                    >
                      <CardContent className='p-0'>
                        <div className='relative h-48 overflow-hidden'>
                          <img
                            src={
                              `http://localhost:4400/public/img/news/${
                                item.image || "/placeholder.svg"
                              }` || "/placeholder.svg?height=200&width=400"
                            }
                            alt={item.title}
                            className='w-full h-full object-cover'
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-[#1D3D6F]/90 to-transparent flex items-end'>
                            <div className='p-6'>
                              <div className='flex items-center text-white opacity-80 mb-2'>
                                <CalendarIcon className='h-4 w-4 mr-2' />
                                <span className='text-sm'>
                                  {formatDate(item.date)}
                                </span>
                              </div>
                              <h3 className='text-xl font-bold text-white'>
                                {item.title}
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div className='p-6 bg-white'>
                          <p className='text-[#334155] mb-4 line-clamp-3'>
                            {item.summary}
                          </p>
                          <div className='flex justify-between items-center'>
                            <Button
                              variant='link'
                              className='text-[#1D3D6F] hover:text-[#2C4F85] p-0 h-auto flex items-center gap-1 transition-colors duration-300'
                            >
                              {content.news.readMore}{" "}
                              <ArrowRight className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-[#64748B] hover:text-[#1D3D6F] p-2 h-8 w-8 rounded-full'
                            >
                              <Share2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Quick Links Section */}
            <section className='mb-16 bg-[#F7FAFC] rounded-2xl p-8 border border-[#E8ECEF]'>
              <h2 className='text-2xl font-bold text-[#1D3D6F] mb-6'>
                Quick Links
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-white rounded-xl p-6 shadow-sm border border-[#E8ECEF] hover:shadow-md transition-all duration-300 transform hover:-translate-y-1'>
                  <div className='flex items-center mb-4'>
                    <div className='bg-[#1D3D6F]/10 p-3 rounded-lg mr-3'>
                      <BookOpen className='h-6 w-6 text-[#1D3D6F]' />
                    </div>
                    <h3 className='text-lg font-semibold text-[#1D3D6F]'>
                      Academic Calendar
                    </h3>
                  </div>
                  <p className='text-[#64748B] mb-4'>
                    View important academic dates and deadlines for the current
                    semester.
                  </p>
                  <Button
                    variant='link'
                    className='text-[#1D3D6F] hover:text-[#2C4F85] p-0 h-auto flex items-center gap-1'
                  >
                    View Calendar <ExternalLink className='h-4 w-4' />
                  </Button>
                </div>
                <div className='bg-white rounded-xl p-6 shadow-sm border border-[#E8ECEF] hover:shadow-md transition-all duration-300 transform hover:-translate-y-1'>
                  <div className='flex items-center mb-4'>
                    <div className='bg-[#1D3D6F]/10 p-3 rounded-lg mr-3'>
                      <Users className='h-6 w-6 text-[#1D3D6F]' />
                    </div>
                    <h3 className='text-lg font-semibold text-[#1D3D6F]'>
                      Faculty Directory
                    </h3>
                  </div>
                  <p className='text-[#64748B] mb-4'>
                    Find contact information for faculty members and staff.
                  </p>
                  <Button
                    variant='link'
                    className='text-[#1D3D6F] hover:text-[#2C4F85] p-0 h-auto flex items-center gap-1'
                  >
                    View Directory <ExternalLink className='h-4 w-4' />
                  </Button>
                </div>
                <div className='bg-white rounded-xl p-6 shadow-sm border border-[#E8ECEF] hover:shadow-md transition-all duration-300 transform hover:-translate-y-1'>
                  <div className='flex items-center mb-4'>
                    <div className='bg-[#1D3D6F]/10 p-3 rounded-lg mr-3'>
                      <Bell className='h-6 w-6 text-[#1D3D6F]' />
                    </div>
                    <h3 className='text-lg font-semibold text-[#1D3D6F]'>
                      Subscribe to Updates
                    </h3>
                  </div>
                  <p className='text-[#64748B] mb-4'>
                    Get notifications about new announcements and events.
                  </p>
                  <Button
                    variant='link'
                    className='text-[#1D3D6F] hover:text-[#2C4F85] p-0 h-auto flex items-center gap-1'
                  >
                    Subscribe Now <ExternalLink className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </section>

            {/* No results message */}
            {!loading.announcements &&
              !loading.events &&
              !loading.news &&
              !error.announcements &&
              !error.events &&
              !error.news &&
              filteredAnnouncements.length === 0 &&
              filteredEvents.length === 0 &&
              filteredNews.length === 0 && (
                <div className='text-center py-16 bg-white rounded-xl shadow-lg'>
                  <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4'>
                    <Search className='h-8 w-8' />
                  </div>
                  <h3 className='text-xl font-medium text-[#1D3D6F] mb-2'>
                    {content.noResults}
                  </h3>
                  <p className='text-[#64748B]'>
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value='announcements'>
            {loading.announcements && <LoadingComponent />}

            {error.announcements && <ErrorComponent />}

            {!loading.announcements &&
            !error.announcements &&
            filteredAnnouncements.length > 0 ? (
              <div>
                <div className='flex justify-between items-center mb-6'>
                  <div>
                    <h2 className='text-2xl font-bold text-[#1D3D6F]'>
                      All Announcements
                    </h2>
                    <p className='text-[#64748B]'>
                      Showing {filteredAnnouncements.length} announcements
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Select defaultValue='newest'>
                      <SelectTrigger className='w-[180px] border-[#E8ECEF]'>
                        <SelectValue placeholder='Sort by' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='newest'>Newest First</SelectItem>
                        <SelectItem value='oldest'>Oldest First</SelectItem>
                        <SelectItem value='featured'>Featured</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {filteredAnnouncements.map((announcement) => (
                    <Card
                      key={announcement.id}
                      className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden transform hover:-translate-y-1'
                    >
                      <CardContent className='p-0'>
                        <div
                          className={`bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] p-6 text-white ${
                            announcement.featured
                              ? "border-l-4 border-[#F7B500]"
                              : ""
                          }`}
                        >
                          <div className='flex justify-between items-start'>
                            {announcement.featured && (
                              <div className='inline-flex items-center px-2 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-3'>
                                <span className='mr-1'>•</span>
                                <span>Featured</span>
                              </div>
                            )}
                            <div
                              className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(
                                announcement.category
                              )}`}
                            >
                              {content.categories[announcement.category] ||
                                announcement.category}
                            </div>
                          </div>
                          <h3 className='text-xl font-bold mb-2'>
                            {announcement.title}
                          </h3>
                          <p className='text-white text-sm opacity-80 flex items-center'>
                            <CalendarIcon className='h-4 w-4 mr-2 opacity-70' />
                            {formatDate(announcement.date)}
                          </p>
                        </div>
                        <div className='p-6 bg-white'>
                          <p className='text-[#334155] mb-4'>
                            {announcement.content}
                          </p>
                          <div className='flex justify-between items-center'>
                            <Button
                              variant='link'
                              className='text-[#1D3D6F] hover:text-[#2C4F85] p-0 h-auto flex items-center gap-1 transition-colors duration-300'
                            >
                              Read full announcement{" "}
                              <ArrowRight className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-[#64748B] hover:text-[#1D3D6F] p-2 h-8 w-8 rounded-full'
                            >
                              <Share2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : !loading.announcements && !error.announcements ? (
              <div className='text-center py-16 bg-white rounded-xl shadow-lg'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4'>
                  <Search className='h-8 w-8' />
                </div>
                <h3 className='text-xl font-medium text-[#1D3D6F] mb-2'>
                  {content.noResults}
                </h3>
                <p className='text-[#64748B]'>
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : null}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value='events'>
            {loading.events && <LoadingComponent />}

            {error.events && <ErrorComponent />}

            {!loading.events && !error.events && filteredEvents.length > 0 ? (
              <div>
                <div className='flex justify-between items-center mb-6'>
                  <div>
                    <h2 className='text-2xl font-bold text-[#1D3D6F]'>
                      All Events
                    </h2>
                    <p className='text-[#64748B]'>
                      Showing {filteredEvents.length} events
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Select defaultValue='upcoming'>
                      <SelectTrigger className='w-[180px] border-[#E8ECEF]'>
                        <SelectValue placeholder='Sort by' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='upcoming'>Upcoming</SelectItem>
                        <SelectItem value='today'>Today</SelectItem>
                        <SelectItem value='this-week'>This Week</SelectItem>
                        <SelectItem value='this-month'>This Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {filteredEvents
                    .sort(
                      (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    )
                    .map((event) => (
                      <Card
                        key={event.id}
                        className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden transform hover:-translate-y-1'
                      >
                        <CardContent className='p-0'>
                          <div className='relative h-48 overflow-hidden'>
                            <img
                              src={
                                event.image ||
                                "/placeholder.svg?height=200&width=400"
                              }
                              alt={event.title}
                              className='w-full h-full object-cover'
                            />
                            <div className='absolute top-4 right-4'>
                              {event.date === today ? (
                                <div className='bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-2.5 py-1 rounded-full shadow-md'>
                                  {content.upcoming.today}
                                </div>
                              ) : event.date === tomorrowStr ? (
                                <div className='bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-2.5 py-1 rounded-full shadow-md'>
                                  {content.upcoming.tomorrow}
                                </div>
                              ) : (
                                <div
                                  className={`text-xs font-medium px-2.5 py-1 rounded-full shadow-md ${getCategoryColor(
                                    event.category
                                  )}`}
                                >
                                  {content.categories[event.category] ||
                                    event.category}
                                </div>
                              )}
                            </div>
                            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
                            <div className='absolute bottom-0 left-0 w-full p-4'>
                              <div className='flex items-center text-white mb-1'>
                                <CalendarIcon className='h-4 w-4 mr-2' />
                                <span className='text-sm'>
                                  {formatDate(event.date)}
                                </span>
                              </div>
                              <h3 className='text-xl font-bold text-white'>
                                {event.title}
                              </h3>
                            </div>
                          </div>
                          <div className='p-6 bg-white'>
                            <p className='text-[#334155] mb-4 line-clamp-2'>
                              {event.description}
                            </p>
                            <div className='space-y-2 mb-4'>
                              <div className='flex items-center text-sm text-[#64748B]'>
                                <Clock className='h-4 w-4 mr-2 text-[#1D3D6F]' />
                                <span>{event.time}</span>
                              </div>
                              <div className='flex items-center text-sm text-[#64748B]'>
                                <MapPin className='h-4 w-4 mr-2 text-[#1D3D6F]' />
                                <span>{event.location}</span>
                              </div>
                            </div>
                            <div className='flex gap-2'>
                              <Button className='bg-[#1D3D6F] hover:bg-[#2C4F85] text-white flex-1 transition-colors duration-300'>
                                {content.upcoming.register}
                              </Button>
                              <Button
                                variant='outline'
                                className='border-[#1D3D6F] text-[#1D3D6F] hover:bg-[#E8ECEF] transition-colors duration-300'
                              >
                                {content.upcoming.moreInfo}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ) : !loading.events && !error.events ? (
              <div className='text-center py-16 bg-white rounded-xl shadow-lg'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4'>
                  <Search className='h-8 w-8' />
                </div>
                <h3 className='text-xl font-medium text-[#1D3D6F] mb-2'>
                  {content.noResults}
                </h3>
                <p className='text-[#64748B]'>
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : null}
          </TabsContent>

          {/* News Tab */}
          <TabsContent value='news'>
            {loading.news && <LoadingComponent />}

            {error.news && <ErrorComponent />}

            {!loading.news && !error.news && filteredNews.length > 0 ? (
              <div>
                <div className='flex justify-between items-center mb-6'>
                  <div>
                    <h2 className='text-2xl font-bold text-[#1D3D6F]'>
                      All News
                    </h2>
                    <p className='text-[#64748B]'>
                      Showing {filteredNews.length} news articles
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Select defaultValue='newest'>
                      <SelectTrigger className='w-[180px] border-[#E8ECEF]'>
                        <SelectValue placeholder='Sort by' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='newest'>Newest First</SelectItem>
                        <SelectItem value='oldest'>Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {filteredNews.map((item) => (
                    <Card
                      key={item.id}
                      className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden transform hover:-translate-y-1'
                    >
                      <CardContent className='p-0'>
                        <div className='relative h-48 overflow-hidden'>
                          <img
                            src={
                              `http://localhost:4400/public/img/news/${
                                item.image || "/placeholder.svg"
                              }` || "/placeholder.svg?height=200&width=400"
                            }
                            alt={item.title}
                            className='w-full h-full object-cover'
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-[#1D3D6F]/90 to-transparent flex items-end'>
                            <div className='p-6'>
                              <div className='flex items-center text-white opacity-80 mb-2'>
                                <CalendarIcon className='h-4 w-4 mr-2' />
                                <span className='text-sm'>
                                  {formatDate(item.date)}
                                </span>
                              </div>
                              <h3 className='text-xl font-bold text-white'>
                                {item.title}
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div className='p-6 bg-white'>
                          <p className='text-[#334155] mb-4 line-clamp-3'>
                            {item.summary}
                          </p>
                          <div className='flex justify-between items-center'>
                            <Button
                              variant='link'
                              className='text-[#1D3D6F] hover:text-[#2C4F85] p-0 h-auto flex items-center gap-1 transition-colors duration-300'
                            >
                              {content.news.readMore}{" "}
                              <ArrowRight className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-[#64748B] hover:text-[#1D3D6F] p-2 h-8 w-8 rounded-full'
                            >
                              <Share2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : !loading.news && !error.news ? (
              <div className='text-center py-16 bg-white rounded-xl shadow-lg'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4'>
                  <Search className='h-8 w-8' />
                </div>
                <h3 className='text-xl font-medium text-[#1D3D6F] mb-2'>
                  {content.noResults}
                </h3>
                <p className='text-[#64748B]'>
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : null}
          </TabsContent>
        </Tabs>

        {/* Archive section */}
        <section
          ref={archiveRef}
          className={`mt-16 transition-all duration-700 transform 
            ${
              archiveVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          style={{ transitionDelay: "0.9s" }}
        >
          <div className='flex justify-between items-center mb-6'>
            <div className='flex items-center'>
              <div className='bg-[#1D3D6F]/10 p-2 rounded-lg mr-3'>
                <Tag className='h-6 w-6 text-[#1D3D6F]' />
              </div>
              <div>
                <h2 className='text-2xl font-bold text-[#1D3D6F]'>
                  {content.archive.title}
                </h2>
                <p className='text-[#64748B] text-sm'>
                  Browse past announcements and events
                </p>
              </div>
            </div>
            <Button
              variant='outline'
              className='border-[#1D3D6F] text-[#1D3D6F] hover:bg-[#1D3D6F] hover:text-white flex items-center gap-1 transition-colors duration-300'
            >
              {content.archive.viewMore} <ArrowRight className='h-4 w-4' />
            </Button>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-white transform hover:-translate-y-1'>
              <CardContent className='p-6'>
                <h3 className='text-lg font-semibold mb-4 text-[#1D3D6F]'>
                  2023
                </h3>
                <ul className='space-y-3'>
                  <li>
                    <a
                      href='#'
                      className='flex items-center text-[#2C4F85] hover:text-[#1D3D6F] transition-colors'
                    >
                      <ChevronRight className='h-4 w-4 mr-2 text-[#1D3D6F]' />
                      <span>July 2023</span>
                      <span className='ml-auto bg-[#E8ECEF] text-[#1D3D6F] text-xs font-medium px-2 py-0.5 rounded-full'>
                        12
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='flex items-center text-[#2C4F85] hover:text-[#1D3D6F] transition-colors'
                    >
                      <ChevronRight className='h-4 w-4 mr-2 text-[#1D3D6F]' />
                      <span>June 2023</span>
                      <span className='ml-auto bg-[#E8ECEF] text-[#1D3D6F] text-xs font-medium px-2 py-0.5 rounded-full'>
                        8
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='flex items-center text-[#2C4F85] hover:text-[#1D3D6F] transition-colors'
                    >
                      <ChevronRight className='h-4 w-4 mr-2 text-[#1D3D6F]' />
                      <span>May 2023</span>
                      <span className='ml-auto bg-[#E8ECEF] text-[#1D3D6F] text-xs font-medium px-2 py-0.5 rounded-full'>
                        15
                      </span>
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-white transform hover:-translate-y-1'>
              <CardContent className='p-6'>
                <h3 className='text-lg font-semibold mb-4 text-[#1D3D6F]'>
                  2022
                </h3>
                <ul className='space-y-3'>
                  <li>
                    <a
                      href='#'
                      className='flex items-center text-[#2C4F85] hover:text-[#1D3D6F] transition-colors'
                    >
                      <ChevronRight className='h-4 w-4 mr-2 text-[#1D3D6F]' />
                      <span>December 2022</span>
                      <span className='ml-auto bg-[#E8ECEF] text-[#1D3D6F] text-xs font-medium px-2 py-0.5 rounded-full'>
                        10
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='flex items-center text-[#2C4F85] hover:text-[#1D3D6F] transition-colors'
                    >
                      <ChevronRight className='h-4 w-4 mr-2 text-[#1D3D6F]' />
                      <span>November 2022</span>
                      <span className='ml-auto bg-[#E8ECEF] text-[#1D3D6F] text-xs font-medium px-2 py-0.5 rounded-full'>
                        7
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='flex items-center text-[#2C4F85] hover:text-[#1D3D6F] transition-colors'
                    >
                      <ChevronRight className='h-4 w-4 mr-2 text-[#1D3D6F]' />
                      <span>October 2022</span>
                      <span className='ml-auto bg-[#E8ECEF] text-[#1D3D6F] text-xs font-medium px-2 py-0.5 rounded-full'>
                        9
                      </span>
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-white transform hover:-translate-y-1'>
              <CardContent className='p-6'>
                <h3 className='text-lg font-semibold mb-4 text-[#1D3D6F]'>
                  2021
                </h3>
                <ul className='space-y-3'>
                  <li>
                    <a
                      href='#'
                      className='flex items-center text-[#2C4F85] hover:text-[#1D3D6F] transition-colors'
                    >
                      <ChevronRight className='h-4 w-4 mr-2 text-[#1D3D6F]' />
                      <span>December 2021</span>
                      <span className='ml-auto bg-[#E8ECEF] text-[#1D3D6F] text-xs font-medium px-2 py-0.5 rounded-full'>
                        11
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='flex items-center text-[#2C4F85] hover:text-[#1D3D6F] transition-colors'
                    >
                      <ChevronRight className='h-4 w-4 mr-2 text-[#1D3D6F]' />
                      <span>November 2021</span>
                      <span className='ml-auto bg-[#E8ECEF] text-[#1D3D6F] text-xs font-medium px-2 py-0.5 rounded-full'>
                        6
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='flex items-center text-[#2C4F85] hover:text-[#1D3D6F] transition-colors'
                    >
                      <ChevronRight className='h-4 w-4 mr-2 text-[#1D3D6F]' />
                      <span>October 2021</span>
                      <span className='ml-auto bg-[#E8ECEF] text-[#1D3D6F] text-xs font-medium px-2 py-0.5 rounded-full'>
                        8
                      </span>
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className='bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] py-16 mt-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-3xl font-bold text-white mb-4'>
              Stay Updated with Faculty News
            </h2>
            <p className='text-white/80 mb-8'>
              Subscribe to our newsletter to receive the latest announcements,
              events, and news directly in your inbox.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Input
                type='email'
                placeholder='Enter your email address'
                className='bg-white/10 border-white/20 text-white placeholder:text-white/60 max-w-md'
              />
              <Button className='bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] font-medium transition-all duration-300'>
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.7s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default AnnouncementsEventsPage;
