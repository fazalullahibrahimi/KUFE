import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  MapPin,
  Search,
  ArrowRight,
  Filter,
  Loader2,
  AlertCircle,
  Bell,
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
    const observer = new IntersectionObserver(([entry]) => {
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

  // Animation refs
  const [heroRef, heroVisible] = useElementOnScreen({
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  });
  const [announcementsRef, announcementsVisible] = useElementOnScreen({
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  });
  const [eventsRef, eventsVisible] = useElementOnScreen({
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  });
  const [newsRef, newsVisible] = useElementOnScreen({
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  });

  // Sample data
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "New Semester Registration Open",
      content:
        "Registration for the upcoming semester is now open. Students can register online through the student portal.",
      date: "2024-01-15",
      category: "academic",
      featured: true,
    },
    {
      id: 2,
      title: "Scholarship Applications Available",
      content:
        "Merit-based scholarships are now available for eligible students. Apply before the deadline.",
      date: "2024-01-10",
      category: "admission",
      featured: false,
    },
  ]);

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Economics Conference 2024",
      description:
        "Annual conference featuring leading economists and industry experts.",
      date: "2024-02-15",
      time: "9:00 AM - 5:00 PM",
      location: "Main Auditorium",
      category: "conference",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      title: "Career Fair",
      description: "Meet with top employers and explore career opportunities.",
      date: "2024-02-20",
      time: "10:00 AM - 4:00 PM",
      location: "Student Center",
      category: "cultural",
      image: "/placeholder.svg?height=200&width=400",
    },
  ]);

  const [news, setNews] = useState([
    {
      id: 1,
      title: "Faculty Research Published",
      summary:
        "Our faculty's latest research on economic trends has been published in a prestigious journal.",
      date: "2024-01-12",
      image: "news1.jpg",
    },
    {
      id: 2,
      title: "Student Achievement Recognition",
      summary:
        "Several students have been recognized for their outstanding academic performance.",
      date: "2024-01-08",
      image: "news2.jpg",
    },
  ]);

  // Loading and error states
  const [loading, setLoading] = useState({
    announcements: false,
    events: false,
    news: false,
  });

  const [error, setError] = useState({
    announcements: null,
    events: null,
    news: null,
  });

  // Static text content
  const content = {
    title: "News & Events",
    subtitle:
      "Stay updated with the latest news and upcoming events from the Faculty of Economics",
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

  // Filter functions
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || announcement.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Event handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  // Utility functions
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getCategoryColor = (category) => {
    const colors = {
      academic: "bg-blue-100 text-blue-800",
      admission: "bg-green-100 text-green-800",
      conference: "bg-purple-100 text-purple-800",
      workshop: "bg-orange-100 text-orange-800",
      seminar: "bg-indigo-100 text-indigo-800",
      cultural: "bg-pink-100 text-pink-800",
      research: "bg-teal-100 text-teal-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  // Get today and tomorrow for event badges
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const tomorrowStr = tomorrow;

  // Loading component
  const LoadingComponent = () => (
    <div className='flex items-center justify-center py-12'>
      <Loader2 className='h-8 w-8 animate-spin text-[#1D3D6F]' />
      <span className='ml-2 text-[#64748B]'>{content.loading}</span>
    </div>
  );

  // Error component
  const ErrorComponent = () => (
    <div className='flex items-center justify-center py-12'>
      <AlertCircle className='h-8 w-8 text-red-500' />
      <span className='ml-2 text-red-600'>{content.error}</span>
    </div>
  );

  return (
    <>
      <div className='min-h-screen bg-white'>
        <Navbar />

        {/* Hero Section */}
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
            <div className='max-w-4xl text-left'>
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

              <div className='flex flex-wrap gap-4 mt-10'>
                <a
                  href='#announcements'
                  className='inline-flex items-center px-6 py-3 bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] font-medium rounded-lg shadow-lg hover:shadow-[#F7B500]/30 transition-all duration-300'
                >
                  <Megaphone className='h-5 w-5 mr-2' />
                  View Announcements
                </a>
                <a
                  href='#events'
                  className='inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm font-medium rounded-lg transition-all duration-300'
                >
                  <CalendarIcon className='h-5 w-5 mr-2' />
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
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] h-5 w-5' />
                <Input
                  type='text'
                  placeholder={content.search}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className='w-full py-3 pl-10 pr-4 border border-[#E8ECEF] rounded-lg bg-[#F7FAFC] focus:border-[#1D3D6F] focus:ring focus:ring-[#1D3D6F]/20 transition-all duration-300'
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
            <div className='bg-[#F7FAFC] rounded-xl p-6 border border-[#E8ECEF] flex items-center hover:shadow-lg transition-all duration-300'>
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
            <div className='bg-[#F7FAFC] rounded-xl p-6 border border-[#E8ECEF] flex items-center hover:shadow-lg transition-all duration-300'>
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
            <div className='bg-[#F7FAFC] rounded-xl p-6 border border-[#E8ECEF] flex items-center hover:shadow-lg transition-all duration-300'>
              <div className='bg-[#1D3D6F]/10 p-4 rounded-full mr-4'>
                <Newspaper className='h-6 w-6 text-[#1D3D6F]' />
              </div>
              <div>
                <p className='text-sm text-[#64748B] font-medium'>
                  Latest News
                </p>
                <p className='text-2xl font-bold text-[#1D3D6F]'>
                  {news.length}
                </p>
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
              <div className='mb-4 md:mb-0 text-left'>
                <h2 className='text-2xl font-bold text-[#1D3D6F] mb-2'>
                  Browse Content
                </h2>
                <p className='text-[#64748B]'>
                  Filter and explore our latest updates
                </p>
              </div>
              <TabsList className='grid w-full md:w-auto grid-cols-4 bg-[#F7FAFC] rounded-lg p-1 border border-[#E8ECEF]'>
                <TabsTrigger
                  value='all'
                  className='data-[state=active]:bg-[#1D3D6F] data-[state=active]:text-white rounded-md transition-all duration-300'
                >
                  {content.tabs.all}
                </TabsTrigger>
                <TabsTrigger
                  value='announcements'
                  className='flex items-center gap-2 data-[state=active]:bg-[#1D3D6F] data-[state=active]:text-white rounded-md transition-all duration-300'
                >
                  <Megaphone className='h-4 w-4' />
                  {content.tabs.announcements}
                </TabsTrigger>
                <TabsTrigger
                  value='events'
                  className='flex items-center gap-2 data-[state=active]:bg-[#1D3D6F] data-[state=active]:text-white rounded-md transition-all duration-300'
                >
                  <CalendarIcon className='h-4 w-4' />
                  {content.tabs.events}
                </TabsTrigger>
                <TabsTrigger
                  value='news'
                  className='flex items-center gap-2 data-[state=active]:bg-[#1D3D6F] data-[state=active]:text-white rounded-md transition-all duration-300'
                >
                  <Newspaper className='h-4 w-4' />
                  {content.tabs.news}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* All Tab */}
            <TabsContent value='all'>
              {/* Loading and error states */}
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
                    className={`mb-16 transition-all duration-700 transform ${
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
                        {content.featured.viewAll}
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
                                    {content.categories[
                                      announcement.category
                                    ] || announcement.category}
                                  </div>
                                </div>
                                <h3 className='text-xl font-bold mb-2'>
                                  {announcement.title}
                                </h3>
                                <div className='text-white text-sm opacity-80 flex items-center'>
                                  <CalendarIcon className='h-4 w-4 opacity-70 mr-2' />
                                  <span>{formatDate(announcement.date)}</span>
                                </div>
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
                                    Read Full Announcement
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
              {!loading.events &&
                !error.events &&
                filteredEvents.length > 0 && (
                  <section
                    id='events'
                    ref={eventsRef}
                    className={`mb-16 transition-all duration-700 transform ${
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
                            Join our upcoming events and activities
                          </p>
                        </div>
                      </div>
                      <Button
                        variant='outline'
                        className='border-[#1D3D6F] text-[#1D3D6F] hover:bg-[#1D3D6F] hover:text-white flex items-center gap-1 transition-colors duration-300'
                      >
                        {content.upcoming.viewAll}
                        <ArrowRight className='h-4 w-4' />
                      </Button>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                      {filteredEvents
                        .sort(
                          (a, b) =>
                            new Date(a.date).getTime() -
                            new Date(b.date).getTime()
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
                  className={`mb-16 transition-all duration-700 transform ${
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
                          Recent updates and achievements
                        </p>
                      </div>
                    </div>
                    <Button
                      variant='outline'
                      className='border-[#1D3D6F] text-[#1D3D6F] hover:bg-[#1D3D6F] hover:text-white flex items-center gap-1 transition-colors duration-300'
                    >
                      {content.news.viewAll}
                      <ArrowRight className='h-4 w-4' />
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
                                {content.news.readMore}
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
                      View important academic dates and deadlines
                    </p>
                    <Button
                      variant='link'
                      className='text-[#1D3D6F] hover:text-[#2C4F85] p-0 h-auto flex items-center gap-1'
                    >
                      View Calendar
                      <ExternalLink className='h-4 w-4' />
                    </Button>
                  </div>
                  <div className='bg-white rounded-xl p-6 shadow-sm border border-[#E8ECEF] hover:shadow-md transition-all duration-300 transform hover:-translate-y-1'>
                    <div className='flex items-center mb-4'>
                      <div className='bg-[#1D3D6F]/10 p-3 rounded-lg mr-3'>
                        <Users className='h-6 w-6 text-[#1D3D6F]' />
                      </div>
                      <h3 className='text-lg font-semibold text-[#1D3D6F]'>
                        Student Portal
                      </h3>
                    </div>
                    <p className='text-[#64748B] mb-4'>
                      Access your student account and resources
                    </p>
                    <Button
                      variant='link'
                      className='text-[#1D3D6F] hover:text-[#2C4F85] p-0 h-auto flex items-center gap-1'
                    >
                      Access Portal
                      <ExternalLink className='h-4 w-4' />
                    </Button>
                  </div>
                  <div className='bg-white rounded-xl p-6 shadow-sm border border-[#E8ECEF] hover:shadow-md transition-all duration-300 transform hover:-translate-y-1'>
                    <div className='flex items-center mb-4'>
                      <div className='bg-[#1D3D6F]/10 p-3 rounded-lg mr-3'>
                        <Newspaper className='h-6 w-6 text-[#1D3D6F]' />
                      </div>
                      <h3 className='text-lg font-semibold text-[#1D3D6F]'>
                        Newsletter
                      </h3>
                    </div>
                    <p className='text-[#64748B] mb-4'>
                      Subscribe to our monthly newsletter
                    </p>
                    <Button
                      variant='link'
                      className='text-[#1D3D6F] hover:text-[#2C4F85] p-0 h-auto flex items-center gap-1'
                    >
                      Subscribe
                      <ExternalLink className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </section>
            </TabsContent>

            {/* Individual Tabs */}
            <TabsContent value='announcements'>
              {loading.announcements && <LoadingComponent />}
              {error.announcements && <ErrorComponent />}
              {!loading.announcements && !error.announcements && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {filteredAnnouncements.map((announcement) => (
                    <Card
                      key={announcement.id}
                      className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden'
                    >
                      <CardContent className='p-6'>
                        <div className='flex justify-between items-start mb-4'>
                          <div
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(
                              announcement.category
                            )}`}
                          >
                            {content.categories[announcement.category] ||
                              announcement.category}
                          </div>
                          <div className='text-sm text-[#64748B]'>
                            {formatDate(announcement.date)}
                          </div>
                        </div>
                        <h3 className='text-xl font-bold text-[#1D3D6F] mb-3'>
                          {announcement.title}
                        </h3>
                        <p className='text-[#334155] mb-4'>
                          {announcement.content}
                        </p>
                        <Button
                          variant='link'
                          className='text-[#1D3D6F] hover:text-[#2C4F85] p-0 h-auto flex items-center gap-1'
                        >
                          Read More
                          <ArrowRight className='h-4 w-4' />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value='events'>
              {loading.events && <LoadingComponent />}
              {error.events && <ErrorComponent />}
              {!loading.events && !error.events && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {filteredEvents.map((event) => (
                    <Card
                      key={event.id}
                      className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden'
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
                            <div
                              className={`text-xs font-medium px-2.5 py-1 rounded-full shadow-md ${getCategoryColor(
                                event.category
                              )}`}
                            >
                              {content.categories[event.category] ||
                                event.category}
                            </div>
                          </div>
                        </div>
                        <div className='p-6'>
                          <h3 className='text-xl font-bold text-[#1D3D6F] mb-2'>
                            {event.title}
                          </h3>
                          <p className='text-[#334155] mb-4'>
                            {event.description}
                          </p>
                          <div className='space-y-2 mb-4'>
                            <div className='flex items-center text-sm text-[#64748B]'>
                              <CalendarIcon className='h-4 w-4 mr-2 text-[#1D3D6F]' />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className='flex items-center text-sm text-[#64748B]'>
                              <Clock className='h-4 w-4 mr-2 text-[#1D3D6F]' />
                              <span>{event.time}</span>
                            </div>
                            <div className='flex items-center text-sm text-[#64748B]'>
                              <MapPin className='h-4 w-4 mr-2 text-[#1D3D6F]' />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          <Button className='w-full bg-[#1D3D6F] hover:bg-[#2C4F85] text-white'>
                            Register Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value='news'>
              {loading.news && <LoadingComponent />}
              {error.news && <ErrorComponent />}
              {!loading.news && !error.news && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {filteredNews.map((item) => (
                    <Card
                      key={item.id}
                      className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden'
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
                        </div>
                        <div className='p-6'>
                          <div className='text-sm text-[#64748B] mb-2'>
                            {formatDate(item.date)}
                          </div>
                          <h3 className='text-xl font-bold text-[#1D3D6F] mb-3'>
                            {item.title}
                          </h3>
                          <p className='text-[#334155] mb-4'>{item.summary}</p>
                          <Button
                            variant='link'
                            className='text-[#1D3D6F] hover:text-[#2C4F85] p-0 h-auto flex items-center gap-1'
                          >
                            Read More
                            <ArrowRight className='h-4 w-4' />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default AnnouncementsEventsPage;
