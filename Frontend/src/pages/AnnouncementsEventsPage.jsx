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
import { useLanguage } from "../contexts/LanguageContext";

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
  const { t, language, direction } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [showAllNews, setShowAllNews] = useState(false);

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

  // Dynamic data states
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
    announcements: null,
    events: null,
    news: null,
  });

  // API base URL
  const API_BASE_URL = "http://localhost:4400/api/v1";

  // Fetch announcements from API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(prev => ({ ...prev, announcements: true }));
        setError(prev => ({ ...prev, announcements: null }));

        const response = await fetch(`${API_BASE_URL}/announcement`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Announcements API response:', data);

        if (data.success && Array.isArray(data.data)) {
          // Transform the data to match the expected format
          const transformedAnnouncements = data.data.map(announcement => ({
            id: announcement._id || announcement.id,
            title: announcement.title,
            content: announcement.content,
            fullContent: announcement.content, // Use content as fullContent if no separate field
            date: announcement.createdAt || announcement.date,
            category: announcement.category || 'academic',
            featured: announcement.is_featured || false,
            image: announcement.image || 'default-announcement.jpg',
            contactInfo: announcement.contactInfo || '',
            importantNotes: announcement.importantNotes || ''
          }));
          setAnnouncements(transformedAnnouncements);
        } else {
          console.error('Unexpected announcements data structure:', data);
          setError(prev => ({ ...prev, announcements: 'Invalid data format received' }));
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
        setError(prev => ({ ...prev, announcements: error.message }));
      } finally {
        setLoading(prev => ({ ...prev, announcements: false }));
      }
    };

    fetchAnnouncements();
  }, []);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(prev => ({ ...prev, events: true }));
        setError(prev => ({ ...prev, events: null }));

        const response = await fetch(`${API_BASE_URL}/events`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Events API response:', data);
        console.log('Events data structure check:', {
          hasStatus: !!data.status,
          status: data.status,
          hasData: !!data.data,
          hasEvents: !!(data.data && data.data.events),
          eventsLength: data.data && data.data.events ? data.data.events.length : 0
        });

        if (data.status === 'success' && data.data && Array.isArray(data.data.events)) {
          // Transform the data to match the expected format
          const transformedEvents = data.data.events.map(event => ({
            id: event._id || event.id,
            title: event.title,
            description: event.description,
            fullDescription: event.description, // Use description as fullDescription if no separate field
            date: event.date,
            time: event.time || '',
            location: event.location || '',
            category: event.type || event.category || 'conference',
            image: event.image || 'Hero_BackGroundImage.jpg',
            registrationRequired: event.registrationRequired || false,
            capacity: event.capacity || 0,
            registrationDeadline: event.registrationDeadline || '',
            contactInfo: event.contactInfo || '',
            requirements: event.requirements || ''
          }));
          setEvents(transformedEvents);
        } else {
          console.error('Unexpected events data structure:', data);
          setError(prev => ({ ...prev, events: 'Invalid data format received' }));
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(prev => ({ ...prev, events: error.message }));
      } finally {
        setLoading(prev => ({ ...prev, events: false }));
      }
    };

    fetchEvents();
  }, []);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(prev => ({ ...prev, news: true }));
        setError(prev => ({ ...prev, news: null }));

        const response = await fetch(`${API_BASE_URL}/news`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('News API response:', data);

        if (data.status === 'success' && data.data && Array.isArray(data.data.news)) {
          // Transform the data to match the expected format
          const transformedNews = data.data.news.map(newsItem => ({
            id: newsItem._id || newsItem.id,
            title: newsItem.title,
            summary: newsItem.summary || newsItem.content?.substring(0, 200) + '...',
            fullContent: newsItem.content,
            date: newsItem.createdAt || newsItem.date,
            image: newsItem.image || 'default-news.jpg',
            author: newsItem.author || 'Faculty Administration',
            category: newsItem.category || 'news',
            tags: newsItem.tags || []
          }));
          setNews(transformedNews);
        } else {
          console.error('Unexpected news data structure:', data);
          setError(prev => ({ ...prev, news: 'Invalid data format received' }));
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setError(prev => ({ ...prev, news: error.message }));
      } finally {
        setLoading(prev => ({ ...prev, news: false }));
      }
    };

    fetchNews();
  }, []);

  // Localized content
  const content = {
    title: t("news.page_title") || "News & Events",
    subtitle: t("news.page_subtitle") || "Stay updated with the latest news and upcoming events from the Faculty of Economics",
    search: t("news.search_placeholder") || "Search announcements and events...",
    filter: t("news.filter_by_category") || "Filter by category",
    categories: {
      all: t("news.all_categories") || "All Categories",
      academic: t("news.academic") || "Academic",
      admission: t("news.admission") || "Admission",
      conference: t("news.conference") || "Conference",
      workshop: t("news.workshop") || "Workshop",
      seminar: t("news.seminar") || "Seminar",
      cultural: t("news.cultural") || "Cultural",
      research: t("news.research") || "Research",
    },
    featured: {
      title: t("news.featured_announcements") || "Featured Announcements",
      viewAll: t("news.view_all_announcements") || "View All Announcements",
    },
    upcoming: {
      title: t("news.upcoming_events") || "Upcoming Events",
      viewAll: t("news.view_all_events") || "View All Events",
      today: t("news.today") || "Today",
      tomorrow: t("news.tomorrow") || "Tomorrow",
      register: t("news.register") || "Register",
      moreInfo: t("news.more_info") || "More Info",
    },
    news: {
      title: t("news.latest_news") || "Latest News",
      viewAll: t("news.view_all_news") || "View All News",
      readMore: t("news.read_more") || "Read More",
    },
    tabs: {
      all: t("news.all") || "All",
      announcements: t("news.announcements") || "Announcements",
      events: t("news.events") || "Events",
      news: t("news.news") || "News",
    },
    archive: {
      title: t("news.archive") || "Archive",
      viewMore: t("news.view_more") || "View More",
    },
    noResults: t("news.no_results") || "No results found for your search criteria.",
    loading: t("news.loading") || "Loading data...",
    error: t("news.error") || "Error loading data. Please try again later.",
    browseContent: t("news.browse_content") || "Browse Content",
    filterExplore: t("news.filter_explore") || "Filter and explore our latest updates",
    totalAnnouncements: t("news.total_announcements") || "Total Announcements",
    upcomingEventsCount: t("news.upcoming_events_count") || "Upcoming Events",
    latestNewsCount: t("news.latest_news_count") || "Latest News",
    featured: t("news.featured") || "Featured",
    readFullAnnouncement: t("news.read_full_announcement") || "Read full announcement",
    importantAnnouncements: t("news.important_announcements") || "Important announcements from the faculty",
    joinUpcomingEvents: t("news.join_upcoming_events") || "Join us at these upcoming faculty events",
    recentAchievements: t("news.recent_achievements") || "Recent updates and achievements",
    registerNow: t("news.register_now") || "Register Now",
    facultyOfEconomics: t("news.faculty_of_economics") || "Faculty of Economics",
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

  const handleReadFullAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
  };

  const handleEventMoreInfo = (event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const handleNewsReadMore = (newsItem) => {
    setSelectedNews(newsItem);
    setIsNewsModalOpen(true);
  };

  const handleCloseNewsModal = () => {
    setIsNewsModalOpen(false);
    setSelectedNews(null);
  };

  const handleViewAllAnnouncements = () => {
    setShowAllAnnouncements(true);
    setActiveTab("announcements");
    // Smooth scroll to tabs section
    setTimeout(() => {
      const tabsSection = document.querySelector('[role="tablist"]');
      if (tabsSection) {
        tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleViewAllEvents = () => {
    setShowAllEvents(true);
    setActiveTab("events");
    // Smooth scroll to tabs section
    setTimeout(() => {
      const tabsSection = document.querySelector('[role="tablist"]');
      if (tabsSection) {
        tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleViewAllNews = () => {
    setShowAllNews(true);
    setActiveTab("news");
    // Smooth scroll to tabs section
    setTimeout(() => {
      const tabsSection = document.querySelector('[role="tablist"]');
      if (tabsSection) {
        tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle ESC key to close modals
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (isModalOpen) {
          handleCloseModal();
        } else if (isEventModalOpen) {
          handleCloseEventModal();
        } else if (isNewsModalOpen) {
          handleCloseNewsModal();
        }
      }
    };

    const anyModalOpen = isModalOpen || isEventModalOpen || isNewsModalOpen;

    if (anyModalOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isEventModalOpen, isNewsModalOpen]);

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
      <div className='min-h-screen bg-white' dir={direction}>
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
            <div className={`max-w-4xl ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
              <div className='inline-flex items-center px-3 py-1 rounded-full bg-[#F7B500]/20 text-[#F7B500] text-sm font-medium mb-6'>
                <span className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'}`}>•</span>
                <span>{content.facultyOfEconomics}</span>
              </div>
              <h1 className='text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white'>
                {content.title}
              </h1>
              <p className='mt-4 text-white/80 text-lg md:text-xl max-w-xl leading-relaxed'>
                {content.subtitle}
              </p>


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
            <div className={`flex flex-col md:flex-row gap-4 ${direction === 'rtl' ? 'md:flex-row-reverse' : ''}`}>
              <div className='relative flex-1'>
                <Search className={`absolute ${direction === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-[#64748B] h-5 w-5`} />
                <Input
                  type='text'
                  placeholder={content.search}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`w-full py-3 ${direction === 'rtl' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} border border-[#E8ECEF] rounded-lg bg-[#F7FAFC] focus:border-[#1D3D6F] focus:ring focus:ring-[#1D3D6F]/20 transition-all duration-300`}
                  dir={direction}
                />
              </div>
              <div className={`md:w-64 flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <Filter className='text-[#1D3D6F] h-5 w-5 hidden md:block' />
                <Select
                  value={categoryFilter}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className={`border-[#E8ECEF] rounded-lg focus:border-[#1D3D6F] focus:ring focus:ring-[#1D3D6F]/20 transition-all duration-300 ${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
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
            <div className={`bg-[#F7FAFC] rounded-xl p-6 border border-[#E8ECEF] flex items-center hover:shadow-lg transition-all duration-300 ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`bg-[#1D3D6F]/10 p-4 rounded-full ${direction === 'rtl' ? 'ml-4' : 'mr-4'}`}>
                <Megaphone className='h-6 w-6 text-[#1D3D6F]' />
              </div>
              <div className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                <p className='text-sm text-[#64748B] font-medium'>
                  {content.totalAnnouncements}
                </p>
                <p className='text-2xl font-bold text-[#1D3D6F]'>
                  {announcements.length}
                </p>
              </div>
            </div>
            <div className={`bg-[#F7FAFC] rounded-xl p-6 border border-[#E8ECEF] flex items-center hover:shadow-lg transition-all duration-300 ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`bg-[#1D3D6F]/10 p-4 rounded-full ${direction === 'rtl' ? 'ml-4' : 'mr-4'}`}>
                <CalendarIcon className='h-6 w-6 text-[#1D3D6F]' />
              </div>
              <div className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                <p className='text-sm text-[#64748B] font-medium'>
                  {content.upcomingEventsCount}
                </p>
                <p className='text-2xl font-bold text-[#1D3D6F]'>
                  {events.length}
                </p>
              </div>
            </div>
            <div className={`bg-[#F7FAFC] rounded-xl p-6 border border-[#E8ECEF] flex items-center hover:shadow-lg transition-all duration-300 ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`bg-[#1D3D6F]/10 p-4 rounded-full ${direction === 'rtl' ? 'ml-4' : 'mr-4'}`}>
                <Newspaper className='h-6 w-6 text-[#1D3D6F]' />
              </div>
              <div className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                <p className='text-sm text-[#64748B] font-medium'>
                  {content.latestNewsCount}
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
            value={activeTab}
            className='w-full'
            onValueChange={handleTabChange}
          >
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-8 ${direction === 'rtl' ? 'md:flex-row-reverse' : ''}`}>
              <div className={`mb-4 md:mb-0 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                <h2 className='text-2xl font-bold text-[#1D3D6F] mb-2'>
                  {content.browseContent}
                </h2>
                <p className='text-[#64748B]'>
                  {content.filterExplore}
                </p>
              </div>
              <TabsList className={`grid w-full md:w-auto grid-cols-4 bg-[#F7FAFC] rounded-lg p-1 border border-[#E8ECEF] ${direction === 'rtl' ? 'grid-flow-col-dense' : ''}`} dir={direction}>
                <TabsTrigger
                  value='all'
                  className={`
                    data-[state=active]:bg-[#F7B500] data-[state=active]:text-[#1D3D6F] data-[state=active]:shadow-md data-[state=active]:font-bold
                    data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#64748B]
                    hover:data-[state=inactive]:bg-[#1D3D6F]/10 hover:data-[state=inactive]:text-[#1D3D6F]
                    data-[state=active]:hover:bg-[#F7B500] data-[state=active]:hover:text-[#1D3D6F]
                    focus:outline-none focus:ring-2 focus:ring-[#F7B500]/20
                    active:scale-95 cursor-pointer
                    rounded-md transition-all duration-300 font-medium px-3 py-2
                    ${direction === 'rtl' ? 'text-right' : 'text-left'}
                  `}
                >
                  {content.tabs.all}
                </TabsTrigger>
                <TabsTrigger
                  value='announcements'
                  className={`
                    flex items-center gap-2
                    data-[state=active]:bg-[#F7B500] data-[state=active]:text-[#1D3D6F] data-[state=active]:shadow-md data-[state=active]:font-bold
                    data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#64748B]
                    hover:data-[state=inactive]:bg-[#1D3D6F]/10 hover:data-[state=inactive]:text-[#1D3D6F]
                    data-[state=active]:hover:bg-[#F7B500] data-[state=active]:hover:text-[#1D3D6F]
                    focus:outline-none focus:ring-2 focus:ring-[#F7B500]/20
                    active:scale-95 cursor-pointer
                    rounded-md transition-all duration-300 font-medium px-3 py-2
                    ${direction === 'rtl' ? 'flex-row-reverse text-right' : 'flex-row text-left'}
                  `}
                >
                  <Megaphone className='h-4 w-4' />
                  {content.tabs.announcements}
                </TabsTrigger>
                <TabsTrigger
                  value='events'
                  className={`
                    flex items-center gap-2
                    data-[state=active]:bg-[#F7B500] data-[state=active]:text-[#1D3D6F] data-[state=active]:shadow-md data-[state=active]:font-bold
                    data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#64748B]
                    hover:data-[state=inactive]:bg-[#1D3D6F]/10 hover:data-[state=inactive]:text-[#1D3D6F]
                    data-[state=active]:hover:bg-[#F7B500] data-[state=active]:hover:text-[#1D3D6F]
                    focus:outline-none focus:ring-2 focus:ring-[#F7B500]/20
                    active:scale-95 cursor-pointer
                    rounded-md transition-all duration-300 font-medium px-3 py-2
                    ${direction === 'rtl' ? 'flex-row-reverse text-right' : 'flex-row text-left'}
                  `}
                >
                  <CalendarIcon className='h-4 w-4' />
                  {content.tabs.events}
                </TabsTrigger>
                <TabsTrigger
                  value='news'
                  className={`
                    flex items-center gap-2
                    data-[state=active]:bg-[#F7B500] data-[state=active]:text-[#1D3D6F] data-[state=active]:shadow-md data-[state=active]:font-bold
                    data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#64748B]
                    hover:data-[state=inactive]:bg-[#1D3D6F]/10 hover:data-[state=inactive]:text-[#1D3D6F]
                    data-[state=active]:hover:bg-[#F7B500] data-[state=active]:hover:text-[#1D3D6F]
                    focus:outline-none focus:ring-2 focus:ring-[#F7B500]/20
                    active:scale-95 cursor-pointer
                    rounded-md transition-all duration-300 font-medium px-3 py-2
                    ${direction === 'rtl' ? 'flex-row-reverse text-right' : 'flex-row text-left'}
                  `}
                >
                  <Newspaper className='h-4 w-4' />
                  {content.tabs.news}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* All Tab */}
            <TabsContent value='all' className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
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
                    <div className={`flex justify-between items-center mb-6 ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex items-center ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`bg-[#F7B500]/20 p-2 rounded-lg ${direction === 'rtl' ? 'ml-3' : 'mr-3'}`}>
                          <Bell className='h-6 w-6 text-[#F7B500]' />
                        </div>
                        <div className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                          <h2 className='text-2xl font-bold text-[#1D3D6F]'>
                            {content.featured.title}
                          </h2>
                          <p className='text-[#64748B] text-sm'>
                            {content.importantAnnouncements}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant='outline'
                        className={`border-[#1D3D6F] text-[#1D3D6F] hover:bg-[#1D3D6F] hover:text-white flex items-center gap-1 transition-colors duration-300 ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}
                        onClick={handleViewAllAnnouncements}
                      >
                        {content.featured.viewAll}
                        <ArrowRight className={`h-4 w-4 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>

                    <div
                      className={`grid grid-cols-1 md:grid-cols-2 gap-6`}
                      style={{
                        direction: direction,
                        justifyItems: direction === 'rtl' ? 'end' : 'start'
                      }}
                    >
                      {filteredAnnouncements
                        .filter((a) => a.featured)
                        .map((announcement) => (
                          <Card
                            key={announcement.id}
                            className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden transform hover:-translate-y-1 w-full'
                          >
                            <CardContent className='p-0'>
                              <div className='relative h-48 overflow-hidden'>
                                <img
                                  src={
                                    `http://localhost:4400/public/img/announcements/${
                                      announcement.image || "default-announcement.jpg"
                                    }`
                                  }
                                  alt={announcement.title}
                                  className='w-full h-full object-cover'
                                />
                                <div className={`absolute top-4 ${direction === 'rtl' ? 'left-4' : 'right-4'}`}>
                                  <div className='inline-flex items-center px-2 py-1 rounded-full bg-white/20 text-white text-xs font-medium'>
                                    <span className={`${direction === 'rtl' ? 'ml-1' : 'mr-1'}`}>•</span>
                                    <span>{content.featured}</span>
                                  </div>
                                </div>
                                <div className={`absolute top-4 ${direction === 'rtl' ? 'right-4' : 'left-4'}`}>
                                  <div
                                    className={`text-xs font-medium px-2.5 py-1 rounded-full shadow-md ${getCategoryColor(
                                      announcement.category
                                    )}`}
                                  >
                                    {content.categories[
                                      announcement.category
                                    ] || announcement.category}
                                  </div>
                                </div>
                                <div className='absolute inset-0 bg-gradient-to-t from-[#1D3D6F]/90 to-transparent flex items-end'>
                                  <div className='p-6'>
                                    <div className='text-white text-sm opacity-80 flex items-center mb-2'>
                                      <CalendarIcon className={`h-4 w-4 opacity-70 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                                      <span>{formatDate(announcement.date)}</span>
                                    </div>
                                    <h3 className={`text-xl font-bold text-white ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                                      {announcement.title}
                                    </h3>
                                  </div>
                                </div>
                              </div>
                              <div className='p-6 bg-white'>
                                <p className={`text-[#334155] mb-4 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                                  {announcement.content}
                                </p>
                                <div className={`flex ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'} justify-between items-center`}>
                                  <Button
                                    variant='link'
                                    className='text-[#1D3D6F] hover:text-[#2C4F85] p-0 h-auto flex items-center gap-1 transition-colors duration-300'
                                    onClick={() => handleReadFullAnnouncement(announcement)}
                                  >
                                    {content.readFullAnnouncement}
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
                    <div className={`flex justify-between items-center mb-6 ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex items-center ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`bg-[#1D3D6F]/10 p-2 rounded-lg ${direction === 'rtl' ? 'ml-3' : 'mr-3'}`}>
                          <CalendarIcon className='h-6 w-6 text-[#1D3D6F]' />
                        </div>
                        <div className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                          <h2 className='text-2xl font-bold text-[#1D3D6F]'>
                            {content.upcoming.title}
                          </h2>
                          <p className='text-[#64748B] text-sm'>
                            {content.joinUpcomingEvents}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant='outline'
                        className={`border-[#1D3D6F] text-[#1D3D6F] hover:bg-[#1D3D6F] hover:text-white flex items-center gap-1 transition-colors duration-300 ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}
                        onClick={handleViewAllEvents}
                      >
                        {content.upcoming.viewAll}
                        <ArrowRight className={`h-4 w-4 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>

                    <div
                      className='grid grid-cols-1 md:grid-cols-3 gap-3'
                      style={{
                        direction: direction,
                        justifyItems: direction === 'rtl' ? 'end' : 'start'
                      }}
                    >
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
                            className='group relative border-0 shadow-xl hover:shadow-2xl transition-all duration-700 rounded-3xl overflow-hidden transform hover:-translate-y-3 hover:scale-[1.03] bg-white/95 backdrop-blur-sm'
                          >
                            <CardContent className='p-0 relative'>
                              {/* Image Section with Enhanced Overlay */}
                              <div className='relative h-64 overflow-hidden'>
                                <img
                                  src={
                                    `http://localhost:4400/public/img/event/${
                                      event.image || "Hero_BackGroundImage.jpg"
                                    }`
                                  }
                                  alt={event.title}
                                  className='w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-1'
                                  onError={(e) => {
                                    e.target.src = "/placeholder.svg?height=200&width=400";
                                  }}
                                />

                                {/* Enhanced Badge */}
                                <div className={`absolute top-6 ${direction === 'rtl' ? 'left-6' : 'right-6'} z-10`}>
                                  {event.date === today ? (
                                    <div className='bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border border-white/30 animate-pulse'>
                                      <span className='flex items-center gap-2'>
                                        <div className='w-2 h-2 bg-white rounded-full animate-ping'></div>
                                        {content.upcoming.today}
                                      </span>
                                    </div>
                                  ) : event.date === tomorrowStr ? (
                                    <div className='bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border border-white/30'>
                                      <span className='flex items-center gap-2'>
                                        <div className='w-2 h-2 bg-white rounded-full'></div>
                                        {content.upcoming.tomorrow}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className='bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border border-white/30'>
                                      <span className='flex items-center gap-2'>
                                        <CalendarIcon className='h-3 w-3' />
                                        {content.categories[event.category] || event.category}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Enhanced Gradient Overlay */}
                                <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500'></div>

                                {/* Content Over Image */}
                                <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                                  <div className={`flex items-center mb-3 ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`bg-white/20 backdrop-blur-md p-2 rounded-xl ${direction === 'rtl' ? 'ml-3' : 'mr-3'}`}>
                                      <CalendarIcon className='h-4 w-4' />
                                    </div>
                                    <div>
                                      <span className='text-sm font-semibold opacity-90'>
                                        {formatDate(event.date)}
                                      </span>
                                    </div>
                                  </div>
                                  <h3 className={`text-2xl font-bold leading-tight mb-2 ${direction === 'rtl' ? 'text-right' : 'text-left'} group-hover:text-[#F7B500] transition-colors duration-300`}>
                                    {event.title}
                                  </h3>
                                  <p className={`text-white/80 text-sm line-clamp-2 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                                    {event.description}
                                  </p>
                                </div>
                              </div>

                              {/* Content Section with Enhanced Design */}
                              <div className='p-8 bg-gradient-to-br from-white via-gray-50/50 to-white'>
                                {/* Event Details with Icons */}
                                <div className='space-y-4 mb-8'>
                                  <div className={`flex items-center ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'} group/item`}>
                                    <div className={`bg-gradient-to-r from-[#1D3D6F]/10 to-[#2C4F85]/10 p-3 rounded-2xl ${direction === 'rtl' ? 'ml-4' : 'mr-4'} group-hover/item:from-[#1D3D6F]/20 group-hover/item:to-[#2C4F85]/20 transition-all duration-300`}>
                                      <Clock className='h-5 w-5 text-[#1D3D6F] group-hover/item:scale-110 transition-transform duration-300' />
                                    </div>
                                    <div>
                                      <p className='text-xs text-[#64748B] font-medium uppercase tracking-wide'>Time</p>
                                      <p className='text-[#1D3D6F] font-bold text-lg'>{event.time || 'Time TBA'}</p>
                                    </div>
                                  </div>

                                  <div className={`flex items-center ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'} group/item`}>
                                    <div className={`bg-gradient-to-r from-[#1D3D6F]/10 to-[#2C4F85]/10 p-3 rounded-2xl ${direction === 'rtl' ? 'ml-4' : 'mr-4'} group-hover/item:from-[#1D3D6F]/20 group-hover/item:to-[#2C4F85]/20 transition-all duration-300`}>
                                      <MapPin className='h-5 w-5 text-[#1D3D6F] group-hover/item:scale-110 transition-transform duration-300' />
                                    </div>
                                    <div>
                                      <p className='text-xs text-[#64748B] font-medium uppercase tracking-wide'>Location</p>
                                      <p className='text-[#1D3D6F] font-bold text-lg'>{event.location || 'Location TBA'}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Enhanced Action Button */}
                                <Button
                                  className='w-full bg-gradient-to-r from-[#1D3D6F] via-[#2C4F85] to-[#1D3D6F] hover:from-[#F7B500] hover:via-[#FFD700] hover:to-[#F7B500] text-white hover:text-[#1D3D6F] transition-all duration-500 shadow-xl hover:shadow-2xl rounded-2xl font-bold py-4 text-lg relative overflow-hidden group/btn'
                                  onClick={() => handleEventMoreInfo(event)}
                                >
                                  <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000'></span>
                                  <span className={`flex items-center justify-center gap-3 relative z-10 ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <span className='font-bold'>{content.upcoming.moreInfo}</span>
                                    <ArrowRight className={`h-5 w-5 transition-all duration-300 group-hover/btn:translate-x-1 group-hover/btn:scale-110 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                                  </span>
                                </Button>
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
                  <div className={`flex justify-between items-center mb-6 ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex items-center ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`bg-[#F7B500]/20 p-2 rounded-lg ${direction === 'rtl' ? 'ml-3' : 'mr-3'}`}>
                        <Newspaper className='h-6 w-6 text-[#F7B500]' />
                      </div>
                      <div className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <h2 className='text-2xl font-bold text-[#1D3D6F]'>
                          {content.news.title}
                        </h2>
                        <p className='text-[#64748B] text-sm'>
                          {content.recentAchievements}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant='outline'
                      className={`border-[#1D3D6F] text-[#1D3D6F] hover:bg-[#1D3D6F] hover:text-white flex items-center gap-1 transition-colors duration-300 ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}
                      onClick={handleViewAllNews}
                    >
                      {content.news.viewAll}
                      <ArrowRight className={`h-4 w-4 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>
                  <div
                    className='grid grid-cols-1 md:grid-cols-3 gap-3'
                    style={{
                      direction: direction,
                      justifyItems: direction === 'rtl' ? 'end' : 'start'
                    }}
                  >
                    {filteredNews.slice(0, 3).map((item) => (
                      <Card
                        key={item.id}
                        className='group relative border-0 shadow-xl hover:shadow-2xl transition-all duration-700 rounded-3xl overflow-hidden transform hover:-translate-y-3 hover:scale-[1.03] bg-white/95 backdrop-blur-sm'
                      >
                        <CardContent className='p-0 relative'>
                          {/* Image Section with Enhanced Overlay */}
                          <div className='relative h-64 overflow-hidden'>
                            <img
                              src={
                                `http://localhost:4400/public/img/news/${
                                  item.image || "/placeholder.svg"
                                }` || "/placeholder.svg?height=200&width=400"
                              }
                              alt={item.title}
                              className='w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-1'
                            />

                            {/* Enhanced News Badge */}
                            <div className={`absolute top-6 ${direction === 'rtl' ? 'left-6' : 'right-6'} z-10`}>
                              <div className='bg-gradient-to-r from-[#F7B500] to-[#FFD700] text-[#1D3D6F] text-xs font-bold px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border border-white/30'>
                                <span className='flex items-center gap-2'>
                                  <Newspaper className='h-3 w-3' />
                                  <span className='font-bold'>NEWS</span>
                                </span>
                              </div>
                            </div>

                            {/* Enhanced Gradient Overlay */}
                            <div className='absolute inset-0 bg-gradient-to-t from-[#1D3D6F]/95 via-[#1D3D6F]/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500'></div>

                            {/* Content Over Image */}
                            <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                              <div className={`flex items-center mb-3 ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`bg-white/20 backdrop-blur-md p-2 rounded-xl ${direction === 'rtl' ? 'ml-3' : 'mr-3'}`}>
                                  <CalendarIcon className='h-4 w-4' />
                                </div>
                                <div>
                                  <span className='text-sm font-semibold opacity-90'>
                                    {formatDate(item.date)}
                                  </span>
                                  {item.author && (
                                    <span className='block text-xs text-white/70 font-medium'>
                                      By {item.author}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <h3 className={`text-2xl font-bold leading-tight mb-2 ${direction === 'rtl' ? 'text-right' : 'text-left'} group-hover:text-[#F7B500] transition-colors duration-300 line-clamp-2`}>
                                {item.title}
                              </h3>
                            </div>
                          </div>

                          {/* Content Section with Enhanced Design */}
                          <div className='p-8 bg-gradient-to-br from-white via-gray-50/50 to-white'>
                            {/* Category Badge */}
                            <div className={`mb-6 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                              <div className='inline-flex items-center px-4 py-2 rounded-2xl text-xs font-bold bg-gradient-to-r from-[#1D3D6F]/10 to-[#2C4F85]/10 text-[#1D3D6F] border border-[#1D3D6F]/20'>
                                <span className='uppercase tracking-wider'>{item.category}</span>
                              </div>
                            </div>

                            {/* Summary */}
                            <p className={`text-[#334155] mb-8 line-clamp-3 leading-relaxed text-lg ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                              {item.summary}
                            </p>

                            {/* Action Buttons */}
                            <div className={`flex ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'} justify-between items-center`}>
                              <Button
                                variant='link'
                                className='text-[#1D3D6F] hover:text-[#F7B500] p-0 h-auto flex items-center gap-3 transition-all duration-300 font-bold text-lg group/btn'
                                onClick={() => handleNewsReadMore(item)}
                              >
                                <span className='relative'>
                                  {content.news.readMore}
                                  <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-[#F7B500] group-hover/btn:w-full transition-all duration-300'></span>
                                </span>
                                <ArrowRight className={`h-5 w-5 transition-all duration-300 group-hover/btn:translate-x-1 group-hover/btn:scale-110 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                              </Button>

                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-[#64748B] hover:text-[#1D3D6F] hover:bg-gradient-to-r hover:from-[#1D3D6F]/10 hover:to-[#2C4F85]/10 p-3 h-12 w-12 rounded-2xl transition-all duration-300 group/share'
                                onClick={() => {
                                  if (navigator.share) {
                                    navigator.share({
                                      title: item.title,
                                      text: item.summary,
                                      url: window.location.href
                                    });
                                  } else {
                                    navigator.clipboard.writeText(`${item.title}\n\n${item.summary}\n\n${window.location.href}`);
                                  }
                                }}
                              >
                                <Share2 className='h-5 w-5 group-hover/share:scale-110 transition-transform duration-300' />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}


            </TabsContent>

            {/* Individual Tabs */}
            <TabsContent value='announcements' className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
              {loading.announcements && <LoadingComponent />}
              {error.announcements && <ErrorComponent />}
              {!loading.announcements && !error.announcements && (
                <>
                  {filteredAnnouncements.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <Bell className="h-16 w-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
                      <p className="text-gray-500">There are currently no announcements to display.</p>
                    </div>
                  ) : (
                    <div
                      className='grid grid-cols-1 md:grid-cols-2 gap-6'
                      style={{
                        direction: direction,
                        justifyItems: direction === 'rtl' ? 'end' : 'start'
                      }}
                    >
                      {filteredAnnouncements.map((announcement) => (
                    <Card
                      key={announcement.id}
                      className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden'
                    >
                      <CardContent className='p-0'>
                        <div className='relative h-48 overflow-hidden'>
                          <img
                            src={
                              `http://localhost:4400/public/img/announcements/${
                                announcement.image || "default-announcement.jpg"
                              }`
                            }
                            alt={announcement.title}
                            className='w-full h-full object-cover'
                          />
                          <div className={`absolute top-4 ${direction === 'rtl' ? 'left-4' : 'right-4'}`}>
                            <div
                              className={`text-xs font-medium px-2.5 py-1 rounded-full shadow-md ${getCategoryColor(
                                announcement.category
                              )}`}
                            >
                              {content.categories[announcement.category] ||
                                announcement.category}
                            </div>
                          </div>
                        </div>
                        <div className='p-6'>
                          <div className={`text-sm text-[#64748B] mb-2 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                            {formatDate(announcement.date)}
                          </div>
                          <h3 className={`text-xl font-bold text-[#1D3D6F] mb-3 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                            {announcement.title}
                          </h3>
                          <p className={`text-[#334155] mb-4 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                            {announcement.content}
                          </p>
                          <Button
                            variant='link'
                            className='text-[#1D3D6F] hover:text-[#2C4F85] p-0 h-auto flex items-center gap-1'
                            onClick={() => handleReadFullAnnouncement(announcement)}
                          >
                            {content.news.readMore}
                            <ArrowRight className='h-4 w-4' />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value='events' className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
              {loading.events && <LoadingComponent />}
              {error.events && <ErrorComponent />}
              {!loading.events && !error.events && (
                <>
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <CalendarIcon className="h-16 w-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                      <p className="text-gray-500">There are currently no events to display.</p>
                    </div>
                  ) : (
                    <div
                      className='grid grid-cols-1 md:grid-cols-3 gap-3'
                      style={{
                        direction: direction,
                        justifyItems: direction === 'rtl' ? 'end' : 'start'
                      }}
                    >
                      {filteredEvents.map((event) => (
                        <Card
                          key={event.id}
                          className='group relative border-0 shadow-xl hover:shadow-2xl transition-all duration-700 rounded-3xl overflow-hidden transform hover:-translate-y-3 hover:scale-[1.03] bg-white/95 backdrop-blur-sm'
                        >
                          <CardContent className='p-0 relative'>
                            {/* Image Section */}
                            <div className='relative h-64 overflow-hidden'>
                              <img
                                src={
                                  `http://localhost:4400/public/img/event/${
                                    event.image || "Hero_BackGroundImage.jpg"
                                  }`
                                }
                                alt={event.title}
                                className='w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-1'
                                onError={(e) => {
                                  e.target.src = "/placeholder.svg?height=200&width=400";
                                }}
                              />

                              {/* Category Badge */}
                              <div className={`absolute top-6 ${direction === 'rtl' ? 'left-6' : 'right-6'} z-10`}>
                                <div className='bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border border-white/30'>
                                  <span className='flex items-center gap-2'>
                                    <CalendarIcon className='h-3 w-3' />
                                    {content.categories[event.category] || event.category}
                                  </span>
                                </div>
                              </div>

                              {/* Gradient Overlay */}
                              <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500'></div>

                              {/* Title Over Image */}
                              <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                                <h3 className={`text-2xl font-bold leading-tight ${direction === 'rtl' ? 'text-right' : 'text-left'} group-hover:text-[#F7B500] transition-colors duration-300`}>
                                  {event.title}
                                </h3>
                              </div>
                            </div>

                            {/* Content Section */}
                            <div className='p-8 bg-gradient-to-br from-white via-gray-50/50 to-white'>
                              <p className={`text-[#334155] mb-6 line-clamp-2 leading-relaxed text-lg ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                                {event.description}
                              </p>

                              {/* Event Details */}
                              <div className='space-y-4 mb-8'>
                                <div className={`flex items-center ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'} group/item`}>
                                  <div className={`bg-gradient-to-r from-[#1D3D6F]/10 to-[#2C4F85]/10 p-3 rounded-2xl ${direction === 'rtl' ? 'ml-4' : 'mr-4'} group-hover/item:from-[#1D3D6F]/20 group-hover/item:to-[#2C4F85]/20 transition-all duration-300`}>
                                    <CalendarIcon className='h-5 w-5 text-[#1D3D6F] group-hover/item:scale-110 transition-transform duration-300' />
                                  </div>
                                  <div>
                                    <p className='text-xs text-[#64748B] font-medium uppercase tracking-wide'>Date</p>
                                    <p className='text-[#1D3D6F] font-bold text-lg'>{formatDate(event.date)}</p>
                                  </div>
                                </div>

                                <div className={`flex items-center ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'} group/item`}>
                                  <div className={`bg-gradient-to-r from-[#1D3D6F]/10 to-[#2C4F85]/10 p-3 rounded-2xl ${direction === 'rtl' ? 'ml-4' : 'mr-4'} group-hover/item:from-[#1D3D6F]/20 group-hover/item:to-[#2C4F85]/20 transition-all duration-300`}>
                                    <Clock className='h-5 w-5 text-[#1D3D6F] group-hover/item:scale-110 transition-transform duration-300' />
                                  </div>
                                  <div>
                                    <p className='text-xs text-[#64748B] font-medium uppercase tracking-wide'>Time</p>
                                    <p className='text-[#1D3D6F] font-bold text-lg'>{event.time || 'Time TBA'}</p>
                                  </div>
                                </div>

                                <div className={`flex items-center ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'} group/item`}>
                                  <div className={`bg-gradient-to-r from-[#1D3D6F]/10 to-[#2C4F85]/10 p-3 rounded-2xl ${direction === 'rtl' ? 'ml-4' : 'mr-4'} group-hover/item:from-[#1D3D6F]/20 group-hover/item:to-[#2C4F85]/20 transition-all duration-300`}>
                                    <MapPin className='h-5 w-5 text-[#1D3D6F] group-hover/item:scale-110 transition-transform duration-300' />
                                  </div>
                                  <div>
                                    <p className='text-xs text-[#64748B] font-medium uppercase tracking-wide'>Location</p>
                                    <p className='text-[#1D3D6F] font-bold text-lg'>{event.location || 'Location TBA'}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Action Button */}
                              <Button
                                className='w-full bg-gradient-to-r from-[#1D3D6F] via-[#2C4F85] to-[#1D3D6F] hover:from-[#F7B500] hover:via-[#FFD700] hover:to-[#F7B500] text-white hover:text-[#1D3D6F] transition-all duration-500 shadow-xl hover:shadow-2xl rounded-2xl font-bold py-4 text-lg relative overflow-hidden group/btn'
                                onClick={() => handleEventMoreInfo(event)}
                              >
                                <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000'></span>
                                <span className={`flex items-center justify-center gap-3 relative z-10 ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                                  <span className='font-bold'>{content.upcoming.moreInfo}</span>
                                  <ArrowRight className={`h-5 w-5 transition-all duration-300 group-hover/btn:translate-x-1 group-hover/btn:scale-110 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                                </span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value='news' className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
              {loading.news && <LoadingComponent />}
              {error.news && <ErrorComponent />}
              {!loading.news && !error.news && (
                <>
                  {filteredNews.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <BookOpen className="h-16 w-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No news found</h3>
                      <p className="text-gray-500">There are currently no news articles to display.</p>
                    </div>
                  ) : (
                    <div
                      className='grid grid-cols-1 md:grid-cols-3 gap-3'
                      style={{
                        direction: direction,
                        justifyItems: direction === 'rtl' ? 'end' : 'start'
                      }}
                    >
                      {filteredNews.map((item) => (
                        <Card
                          key={item.id}
                          className='group relative border-0 shadow-xl hover:shadow-2xl transition-all duration-700 rounded-3xl overflow-hidden transform hover:-translate-y-3 hover:scale-[1.03] bg-white/95 backdrop-blur-sm'
                        >
                          <CardContent className='p-0 relative'>
                            {/* Image Section */}
                            <div className='relative h-64 overflow-hidden'>
                              <img
                                src={
                                  `http://localhost:4400/public/img/news/${
                                    item.image || "/placeholder.svg"
                                  }` || "/placeholder.svg?height=200&width=400"
                                }
                                alt={item.title}
                                className='w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-1'
                              />

                              {/* News Badge */}
                              <div className={`absolute top-6 ${direction === 'rtl' ? 'left-6' : 'right-6'} z-10`}>
                                <div className='bg-gradient-to-r from-[#F7B500] to-[#FFD700] text-[#1D3D6F] text-xs font-bold px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border border-white/30'>
                                  <span className='flex items-center gap-2'>
                                    <Newspaper className='h-3 w-3' />
                                    <span className='font-bold'>NEWS</span>
                                  </span>
                                </div>
                              </div>

                              {/* Gradient Overlay */}
                              <div className='absolute inset-0 bg-gradient-to-t from-[#1D3D6F]/95 via-[#1D3D6F]/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500'></div>

                              {/* Title Over Image */}
                              <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                                <h3 className={`text-2xl font-bold leading-tight ${direction === 'rtl' ? 'text-right' : 'text-left'} group-hover:text-[#F7B500] transition-colors duration-300 line-clamp-2`}>
                                  {item.title}
                                </h3>
                              </div>
                            </div>

                            {/* Content Section */}
                            <div className='p-8 bg-gradient-to-br from-white via-gray-50/50 to-white'>
                              {/* Date and Author */}
                              <div className={`flex items-center mb-6 ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`bg-gradient-to-r from-[#1D3D6F]/10 to-[#2C4F85]/10 p-3 rounded-2xl ${direction === 'rtl' ? 'ml-4' : 'mr-4'}`}>
                                  <CalendarIcon className='h-5 w-5 text-[#1D3D6F]' />
                                </div>
                                <div>
                                  <p className='text-xs text-[#64748B] font-medium uppercase tracking-wide'>Published</p>
                                  <p className='text-[#1D3D6F] font-bold text-lg'>{formatDate(item.date)}</p>
                                  {item.author && (
                                    <p className='text-sm text-[#64748B] font-medium'>By {item.author}</p>
                                  )}
                                </div>
                              </div>

                              {/* Category Badge */}
                              <div className={`mb-6 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                                <div className='inline-flex items-center px-4 py-2 rounded-2xl text-xs font-bold bg-gradient-to-r from-[#1D3D6F]/10 to-[#2C4F85]/10 text-[#1D3D6F] border border-[#1D3D6F]/20'>
                                  <span className='uppercase tracking-wider'>{item.category}</span>
                                </div>
                              </div>

                              {/* Summary */}
                              <p className={`text-[#334155] mb-8 line-clamp-3 leading-relaxed text-lg ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                                {item.summary}
                              </p>

                              {/* Action Buttons */}
                              <div className={`flex ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'} justify-between items-center`}>
                                <Button
                                  variant='link'
                                  className='text-[#1D3D6F] hover:text-[#F7B500] p-0 h-auto flex items-center gap-3 transition-all duration-300 font-bold text-lg group/btn'
                                  onClick={() => handleNewsReadMore(item)}
                                >
                                  <span className='relative'>
                                    {content.news.readMore}
                                    <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-[#F7B500] group-hover/btn:w-full transition-all duration-300'></span>
                                  </span>
                                  <ArrowRight className={`h-5 w-5 transition-all duration-300 group-hover/btn:translate-x-1 group-hover/btn:scale-110 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                                </Button>

                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='text-[#64748B] hover:text-[#1D3D6F] hover:bg-gradient-to-r hover:from-[#1D3D6F]/10 hover:to-[#2C4F85]/10 p-3 h-12 w-12 rounded-2xl transition-all duration-300 group/share'
                                  onClick={() => {
                                    if (navigator.share) {
                                      navigator.share({
                                        title: item.title,
                                        text: item.summary,
                                        url: window.location.href
                                      });
                                    } else {
                                      navigator.clipboard.writeText(`${item.title}\n\n${item.summary}\n\n${window.location.href}`);
                                    }
                                  }}
                                >
                                  <Share2 className='h-5 w-5 group-hover/share:scale-110 transition-transform duration-300' />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <Footer />
      </div>

      {/* Announcement Modal */}
      {isModalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div
            className={`bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
            onClick={(e) => e.stopPropagation()}
            dir={direction}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white p-6 rounded-t-2xl">
              <div className={`flex justify-between items-start ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="flex-1">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-4 ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'}`}>•</span>
                    <span>{content.categories[selectedAnnouncement.category] || selectedAnnouncement.category}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    {selectedAnnouncement.title}
                  </h2>
                  <div className={`flex items-center text-white/80 text-sm ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <CalendarIcon className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                    <span>{formatDate(selectedAnnouncement.date)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white/80 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {selectedAnnouncement.content}
                </p>

                {/* Additional content if available */}
                {selectedAnnouncement.fullContent && (
                  <div className="text-gray-600 leading-relaxed space-y-4">
                    {selectedAnnouncement.fullContent.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}

                {/* Contact Information */}
                {selectedAnnouncement.contactInfo && (
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-[#1D3D6F] mb-2">
                      {t("contact_information") || "Contact Information"}
                    </h3>
                    <p className="text-gray-600">{selectedAnnouncement.contactInfo}</p>
                  </div>
                )}

                {/* Important Notes */}
                {selectedAnnouncement.importantNotes && (
                  <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      {t("important_notes") || "Important Notes"}
                    </h3>
                    <p className="text-yellow-700">{selectedAnnouncement.importantNotes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className={`flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200 ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Button
                  onClick={handleCloseModal}
                  className="bg-[#1D3D6F] hover:bg-[#2C4F85] text-white px-6 py-2"
                >
                  {t("close") || "Close"}
                </Button>
                <Button
                  variant="outline"
                  className={`border-[#1D3D6F] text-[#1D3D6F] hover:bg-[#1D3D6F] hover:text-white px-6 py-2 flex items-center ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}
                  onClick={() => {
                    // Share functionality
                    if (navigator.share) {
                      navigator.share({
                        title: selectedAnnouncement.title,
                        text: selectedAnnouncement.content,
                        url: window.location.href
                      });
                    } else {
                      // Fallback: copy to clipboard
                      navigator.clipboard.writeText(`${selectedAnnouncement.title}\n\n${selectedAnnouncement.content}\n\n${window.location.href}`);
                    }
                  }}
                >
                  <Share2 className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {t("share") || "Share"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {isEventModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={handleCloseEventModal}>
          <div
            className={`bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
            onClick={(e) => e.stopPropagation()}
            dir={direction}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                    <span className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'}`}>•</span>
                    <span>{content.categories[selectedEvent.category] || selectedEvent.category}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    {selectedEvent.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-white/80 text-sm">
                    <div className="flex items-center">
                      <CalendarIcon className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                      <span>{formatDate(selectedEvent.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                      <span>{selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                      <span>{selectedEvent.location}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseEventModal}
                  className="text-white/80 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {selectedEvent.description}
                </p>

                {/* Full description if available */}
                {selectedEvent.fullDescription && (
                  <div className="text-gray-600 leading-relaxed space-y-4">
                    {selectedEvent.fullDescription.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}

                {/* Event Details */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedEvent.registrationRequired && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">
                        {t("registration_required") || "Registration Required"}
                      </h3>
                      <p className="text-blue-700">
                        {t("registration_deadline") || "Registration Deadline"}: {formatDate(selectedEvent.registrationDeadline)}
                      </p>
                      <p className="text-blue-700">
                        {t("capacity") || "Capacity"}: {selectedEvent.capacity} {t("participants") || "participants"}
                      </p>
                    </div>
                  )}

                  {selectedEvent.requirements && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {t("requirements") || "Requirements"}
                      </h3>
                      <p className="text-gray-600">{selectedEvent.requirements}</p>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                {selectedEvent.contactInfo && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-[#1D3D6F] mb-2">
                      {t("contact_information") || "Contact Information"}
                    </h3>
                    <p className="text-gray-600">{selectedEvent.contactInfo}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200">
                {selectedEvent.registrationRequired && (
                  <Button
                    className="bg-[#1D3D6F] hover:bg-[#2C4F85] text-white px-6 py-2"
                  >
                    {t("register_now") || "Register Now"}
                  </Button>
                )}
                <Button
                  onClick={handleCloseEventModal}
                  variant="outline"
                  className="border-[#1D3D6F] text-[#1D3D6F] hover:bg-[#1D3D6F] hover:text-white px-6 py-2"
                >
                  {t("close") || "Close"}
                </Button>
                <Button
                  variant="outline"
                  className="border-[#1D3D6F] text-[#1D3D6F] hover:bg-[#1D3D6F] hover:text-white px-6 py-2"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: selectedEvent.title,
                        text: selectedEvent.description,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(`${selectedEvent.title}\n\n${selectedEvent.description}\n\n${window.location.href}`);
                    }
                  }}
                >
                  <Share2 className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {t("share") || "Share"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* News Modal */}
      {isNewsModalOpen && selectedNews && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={handleCloseNewsModal}>
          <div
            className={`bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
            onClick={(e) => e.stopPropagation()}
            dir={direction}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                    <span className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'}`}>•</span>
                    <span>{selectedNews.category}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    {selectedNews.title}
                  </h2>
                  <div className="flex items-center text-white/80 text-sm">
                    <CalendarIcon className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                    <span>{formatDate(selectedNews.date)}</span>
                    {selectedNews.author && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{selectedNews.author}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleCloseNewsModal}
                  className="text-white/80 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {selectedNews.summary}
                </p>

                {/* Full content if available */}
                {selectedNews.fullContent && (
                  <div className="text-gray-600 leading-relaxed space-y-4">
                    {selectedNews.fullContent.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {selectedNews.tags && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      {t("tags") || "Tags"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedNews.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleCloseNewsModal}
                  className="bg-[#1D3D6F] hover:bg-[#2C4F85] text-white px-6 py-2"
                >
                  {t("close") || "Close"}
                </Button>
                <Button
                  variant="outline"
                  className="border-[#1D3D6F] text-[#1D3D6F] hover:bg-[#1D3D6F] hover:text-white px-6 py-2"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: selectedNews.title,
                        text: selectedNews.summary,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(`${selectedNews.title}\n\n${selectedNews.summary}\n\n${window.location.href}`);
                    }
                  }}
                >
                  <Share2 className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {t("share") || "Share"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AnnouncementsEventsPage;
