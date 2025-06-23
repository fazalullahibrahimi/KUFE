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

  // Sample data
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "New Semester Registration Open",
      content:
        "Registration for the upcoming semester is now open. Students can register online through the student portal.",
      fullContent: `The Faculty of Economics is pleased to announce that registration for the Spring 2024 semester is now officially open. All current and prospective students are encouraged to complete their registration as soon as possible to secure their preferred courses and schedules.

Registration Process:
1. Log into the student portal using your university credentials
2. Review the available courses for your program
3. Select your desired courses and sections
4. Confirm your registration and pay any required fees
5. Print your registration confirmation for your records

Important Dates:
- Early Registration: January 15-20, 2024
- Regular Registration: January 21-30, 2024
- Late Registration: February 1-5, 2024 (additional fees apply)

Course offerings include core economics courses, electives, and specialized seminars. Students are advised to consult with their academic advisors to ensure proper course selection that aligns with their degree requirements.`,
      date: "2024-01-15",
      category: "academic",
      featured: true,
      contactInfo: "For assistance, contact the Registrar's Office at registrar@ku.edu.af or visit Room 201, Administration Building.",
      importantNotes: "Students who fail to register by the deadline may lose their enrollment status. Financial aid recipients must maintain full-time enrollment to retain their aid eligibility."
    },
    {
      id: 2,
      title: "Scholarship Applications Available",
      content:
        "Merit-based scholarships are now available for eligible students. Apply before the deadline.",
      fullContent: `The Faculty of Economics is proud to announce the availability of merit-based scholarships for the 2024-2025 academic year. These scholarships are designed to support outstanding students who demonstrate academic excellence and financial need.

Available Scholarships:
- Dean's Excellence Scholarship: Full tuition coverage for top 5% of students
- Academic Merit Award: 50% tuition reduction for students with GPA 3.5+
- Need-Based Grant: Variable amounts based on financial circumstances
- Research Assistant Scholarship: Tuition waiver plus monthly stipend

Eligibility Requirements:
- Minimum GPA of 3.0 for continuing students
- Demonstrated financial need (documentation required)
- Full-time enrollment status
- Afghan citizenship or permanent residency
- No outstanding academic or financial obligations

Application Requirements:
- Completed scholarship application form
- Official transcripts
- Two letters of recommendation
- Personal statement (500 words maximum)
- Financial need documentation
- Copy of national ID card`,
      date: "2024-01-10",
      category: "admission",
      featured: false,
      contactInfo: "Submit applications to the Financial Aid Office, Room 105, Student Services Building, or email scholarships@ku.edu.af",
      importantNotes: "Application deadline is February 28, 2024. Incomplete applications will not be considered. Recipients must maintain a minimum GPA of 3.0 to retain their scholarship."
    },
  ]);

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Economics Conference 2024",
      description:
        "Annual conference featuring leading economists and industry experts.",
      fullDescription: `Join us for the most anticipated economics conference of the year! This comprehensive event brings together renowned economists, industry leaders, policy makers, and students to discuss current economic trends, challenges, and opportunities.

Conference Highlights:
- Keynote speeches by international economic experts
- Panel discussions on global economic trends
- Workshops on economic research methodologies
- Networking opportunities with industry professionals
- Student presentation sessions
- Awards ceremony for outstanding research

Featured Speakers:
- Dr. Ahmad Rashid - Former Economic Advisor to the Government
- Prof. Sarah Johnson - International Monetary Fund
- Dr. Mohammad Karimi - Central Bank of Afghanistan
- Ms. Elena Rodriguez - World Bank Representative

Topics to be Covered:
- Post-pandemic economic recovery strategies
- Digital transformation in banking and finance
- Sustainable development and green economics
- Regional trade and economic cooperation
- Monetary policy in developing economies`,
      date: "2024-02-15",
      time: "9:00 AM - 5:00 PM",
      location: "Main Auditorium",
      category: "conference",
      image: "/placeholder.svg?height=200&width=400",
      registrationRequired: true,
      capacity: 300,
      registrationDeadline: "2024-02-10",
      contactInfo: "For registration and inquiries, contact events@ku.edu.af or call +93-40-222-3456",
      requirements: "Business attire required. Students must bring valid ID cards. Light refreshments will be provided."
    },
    {
      id: 2,
      title: "Career Fair",
      description: "Meet with top employers and explore career opportunities.",
      fullDescription: `The Faculty of Economics Career Fair is your gateway to exciting career opportunities in the economic and business sectors. This annual event connects students and recent graduates with leading employers from various industries.

Participating Organizations:
- Afghanistan International Bank
- Da Afghanistan Bank (Central Bank)
- Ministry of Finance
- USAID Afghanistan
- World Bank Afghanistan Office
- Local and international NGOs
- Private sector companies
- Government agencies

What to Expect:
- Direct interaction with hiring managers
- On-the-spot interviews for qualified candidates
- Career counseling sessions
- Resume review services
- Professional networking opportunities
- Information about internship programs
- Graduate program presentations

Career Opportunities Available:
- Economic Analysts
- Financial Advisors
- Banking Associates
- Research Assistants
- Project Coordinators
- Data Analysts
- Policy Researchers`,
      date: "2024-02-20",
      time: "10:00 AM - 4:00 PM",
      location: "Student Center",
      category: "cultural",
      image: "/placeholder.svg?height=200&width=400",
      registrationRequired: false,
      capacity: 500,
      contactInfo: "For more information, visit the Career Services Office or email careers@ku.edu.af",
      requirements: "Bring multiple copies of your resume. Professional attire recommended. Students should bring their student ID cards."
    },
  ]);

  const [news, setNews] = useState([
    {
      id: 1,
      title: "Faculty Research Published",
      summary:
        "Our faculty's latest research on economic trends has been published in a prestigious journal.",
      fullContent: `The Faculty of Economics is proud to announce that groundbreaking research conducted by our faculty members has been published in the International Journal of Economic Development, one of the most prestigious academic publications in the field.

Research Details:
The study, titled "Economic Resilience in Post-Conflict Societies: A Case Study of Afghanistan's Recovery Path," was conducted by Dr. Mohammad Hashim, Professor of Economics, in collaboration with Dr. Fatima Ahmadi, Associate Professor of Development Economics.

Key Findings:
- Analysis of Afghanistan's economic recovery patterns over the past two decades
- Identification of key factors contributing to economic resilience
- Policy recommendations for sustainable economic growth
- Comparative analysis with other post-conflict economies
- Assessment of international aid effectiveness

Research Impact:
This research provides valuable insights for policymakers, international organizations, and academic institutions working on post-conflict economic recovery. The findings have already been cited by several international development agencies and are being used to inform policy decisions.

Publication Recognition:
The International Journal of Economic Development has an impact factor of 3.2 and is indexed in major academic databases including Scopus and Web of Science. This publication significantly enhances the international reputation of our faculty and university.

Future Research:
Building on this success, the research team is planning follow-up studies focusing on specific sectors of the Afghan economy and their recovery trajectories.`,
      date: "2024-01-12",
      image: "news1.jpg",
      author: "Dr. Mohammad Hashim & Dr. Fatima Ahmadi",
      category: "research",
      tags: ["research", "publication", "economic development", "post-conflict recovery"]
    },
    {
      id: 2,
      title: "Student Achievement Recognition",
      summary:
        "Several students have been recognized for their outstanding academic performance.",
      fullContent: `The Faculty of Economics is delighted to announce the outstanding achievements of our students who have been recognized for their exceptional academic performance and contributions to the university community.

Academic Excellence Awards:
- Hamid Karimi (4th Year) - Dean's List for maintaining 4.0 GPA
- Maryam Sultani (3rd Year) - Outstanding Research Award for thesis on microfinance
- Ahmad Shah Durrani (2nd Year) - Best Student Presentation at National Economics Symposium
- Zahra Mohammadi (4th Year) - Excellence in Statistics and Data Analysis

Research Achievements:
Several students have had their research work accepted for presentation at national and international conferences:
- "Impact of Digital Banking on Rural Communities" by Hamid Karimi
- "Women's Economic Empowerment through Microfinance" by Maryam Sultani
- "Agricultural Economics and Food Security" by Ahmad Shah Durrani

Scholarship Recipients:
The following students have been awarded prestigious scholarships:
- Zahra Mohammadi - World Bank Scholarship for Graduate Studies
- Hamid Karimi - Government Merit Scholarship
- Maryam Sultani - USAID Women's Leadership Scholarship

Community Service Recognition:
Our students have also been recognized for their community service:
- Economic literacy programs in rural communities
- Financial education workshops for women's groups
- Volunteer work with local NGOs on development projects

These achievements reflect the high quality of education and the dedication of our students. The faculty is proud of their accomplishments and looks forward to their continued success.`,
      date: "2024-01-08",
      image: "news2.jpg",
      author: "Faculty Administration",
      category: "achievement",
      tags: ["students", "achievement", "awards", "recognition", "scholarship"]
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
  };

  const handleViewAllEvents = () => {
    setShowAllEvents(true);
    setActiveTab("events");
  };

  const handleViewAllNews = () => {
    setShowAllNews(true);
    setActiveTab("news");
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
            defaultValue='all'
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
                              <div className='bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] p-6 text-white'>
                                <div className='flex justify-between items-start'>
                                  <div className='inline-flex items-center px-2 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-3'>
                                    <span className={`${direction === 'rtl' ? 'ml-1' : 'mr-1'}`}>•</span>
                                    <span>{content.featured}</span>
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
                                <h3 className={`text-xl font-bold mb-2 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                                  {announcement.title}
                                </h3>
                                <div className='text-white text-sm opacity-80 flex items-center'>
                                  <CalendarIcon className={`h-4 w-4 opacity-70 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                                  <span>{formatDate(announcement.date)}</span>
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
                      className='grid grid-cols-1 md:grid-cols-3 gap-6'
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
                                    <CalendarIcon className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                                    <span className='text-sm'>
                                      {formatDate(event.date)}
                                    </span>
                                  </div>
                                  <h3 className={`text-xl font-bold text-white ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                                    {event.title}
                                  </h3>
                                </div>
                              </div>
                              <div className='p-6 bg-white'>
                                <p className={`text-[#334155] mb-4 line-clamp-2 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                                  {event.description}
                                </p>
                                <div className='space-y-2 mb-4'>
                                  <div className='flex items-center text-sm text-[#64748B]'>
                                    <Clock className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'} text-[#1D3D6F]`} />
                                    <span>{event.time}</span>
                                  </div>
                                  <div className='flex items-center text-sm text-[#64748B]'>
                                    <MapPin className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'} text-[#1D3D6F]`} />
                                    <span>{event.location}</span>
                                  </div>
                                </div>
                                <div className='flex gap-2'>
                                  <Button
                                    className='bg-[#1D3D6F] hover:bg-[#2C4F85] text-white flex-1 transition-colors duration-300'
                                    onClick={() => handleEventMoreInfo(event)}
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
                    className='grid grid-cols-1 md:grid-cols-3 gap-6'
                    style={{
                      direction: direction,
                      justifyItems: direction === 'rtl' ? 'end' : 'start'
                    }}
                  >
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
                                  <CalendarIcon className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                                  <span className='text-sm'>
                                    {formatDate(item.date)}
                                  </span>
                                </div>
                                <h3 className={`text-xl font-bold text-white ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                                  {item.title}
                                </h3>
                              </div>
                            </div>
                          </div>
                          <div className='p-6 bg-white'>
                            <p className={`text-[#334155] mb-4 line-clamp-3 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                              {item.summary}
                            </p>
                            <div className={`flex ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'} justify-between items-center`}>
                              <Button
                                variant='link'
                                className='text-[#1D3D6F] hover:text-[#2C4F85] p-0 h-auto flex items-center gap-1 transition-colors duration-300'
                                onClick={() => handleNewsReadMore(item)}
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


            </TabsContent>

            {/* Individual Tabs */}
            <TabsContent value='announcements' className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
              {loading.announcements && <LoadingComponent />}
              {error.announcements && <ErrorComponent />}
              {!loading.announcements && !error.announcements && (
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
                      <CardContent className='p-6'>
                        <div className={`flex ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'} justify-between items-start mb-4`}>
                          <div
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(
                              announcement.category
                            )}`}
                          >
                            {content.categories[announcement.category] ||
                              announcement.category}
                          </div>
                          <div className={`text-sm text-[#64748B] ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                            {formatDate(announcement.date)}
                          </div>
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value='events' className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
              {loading.events && <LoadingComponent />}
              {error.events && <ErrorComponent />}
              {!loading.events && !error.events && (
                <div
                  className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  style={{
                    direction: direction,
                    justifyItems: direction === 'rtl' ? 'end' : 'start'
                  }}
                >
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
                          <div className={`absolute top-4 ${direction === 'rtl' ? 'left-4' : 'right-4'}`}>
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
                          <h3 className={`text-xl font-bold text-[#1D3D6F] mb-2 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                            {event.title}
                          </h3>
                          <p className={`text-[#334155] mb-4 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                            {event.description}
                          </p>
                          <div className='space-y-2 mb-4'>
                            <div className='flex items-center text-sm text-[#64748B]'>
                              <CalendarIcon className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'} text-[#1D3D6F]`} />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className='flex items-center text-sm text-[#64748B]'>
                              <Clock className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'} text-[#1D3D6F]`} />
                              <span>{event.time}</span>
                            </div>
                            <div className='flex items-center text-sm text-[#64748B]'>
                              <MapPin className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'} text-[#1D3D6F]`} />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          <Button
                            className='w-full bg-[#1D3D6F] hover:bg-[#2C4F85] text-white'
                            onClick={() => handleEventMoreInfo(event)}
                          >
                            {content.upcoming.moreInfo}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value='news' className={`${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
              {loading.news && <LoadingComponent />}
              {error.news && <ErrorComponent />}
              {!loading.news && !error.news && (
                <div
                  className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  style={{
                    direction: direction,
                    justifyItems: direction === 'rtl' ? 'end' : 'start'
                  }}
                >
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
                          <div className={`text-sm text-[#64748B] mb-2 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                            {formatDate(item.date)}
                          </div>
                          <h3 className={`text-xl font-bold text-[#1D3D6F] mb-3 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                            {item.title}
                          </h3>
                          <p className={`text-[#334155] mb-4 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>{item.summary}</p>
                          <Button
                            variant='link'
                            className='text-[#1D3D6F] hover:text-[#2C4F85] p-0 h-auto flex items-center gap-1'
                            onClick={() => handleNewsReadMore(item)}
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
