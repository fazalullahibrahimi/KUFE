import React from "react"
import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Search, ChevronRight, ArrowRight, Filter, Phone, Mail, Loader2, AlertCircle } from 'lucide-react'

import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import Navbar from "../components/Navbar"

function AnnouncementsEventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // State for API data
  const [announcements, setAnnouncements] = useState([])
  const [events, setEvents] = useState([])
  const [news, setNews] = useState([])

  // Loading and error states
  const [loading, setLoading] = useState({
    announcements: true,
    events: true,
    news: true,
  })
  const [error, setError] = useState({
    announcements: false,
    events: false,
    news: false,
  })

  // Fetch data from APIs
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("http://127.0.0.1:4400/api/v1/announcement/")
        if (!response.ok) {
          throw new Error("Failed to fetch announcements")
        }
        const responseData = await response.json()
        // Extract announcements from the correct path in the response
        const announcementsData = responseData.data || []
        console.log(announcementsData)
        
        // Map the API data to our component's expected format
        const formattedAnnouncements = announcementsData.map(item => ({
          id: item._id,
          title: item.title,
          content: item.content,
          date: item.publish_date,
          category: item.category,
          featured: item.is_featured
        }))
        
        setAnnouncements(formattedAnnouncements)
      } catch (err) {
        console.error("Error fetching announcements:", err)
        setError((prev) => ({ ...prev, announcements: true }))
      } finally {
        setLoading((prev) => ({ ...prev, announcements: false }))
      }
    }

    const fetchEvents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:4400/api/v1/events/")
        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }
        const responseData = await response.json()
        // Extract events from the correct path in the response
        const eventsData = responseData.data?.events || []
        console.log(eventsData)
        // Map the API data to our component's expected format
        const formattedEvents = eventsData.map(item => ({
          id: item._id,
          title: item.title,
          description: item.description,
          date: item.date,
          time: new Date(item.date).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          location: item.location,
          category: item.type, // Using 'type' as category
          featured: false, // Default value as it's not in the API
          image: item.image
        }))
        
        setEvents(formattedEvents)
      } catch (err) {
        console.error("Error fetching events:", err)
        setError((prev) => ({ ...prev, events: true }))
      } finally {
        setLoading((prev) => ({ ...prev, events: false }))
      }
    }

    const fetchNews = async () => {
      try {
        const response = await fetch("http://127.0.0.1:4400/api/v1/news/")
        if (!response.ok) {
          throw new Error("Failed to fetch news")
        }
        const responseData = await response.json()
       
        // Extract news from the correct path in the response
        const newsData = responseData.data?.news || []
        console.log(newsData)
        
        // Map the API data to our component's expected format
        const formattedNews = newsData.map(item => ({
          id: item._id,
          title: item.title,
          summary: item.content, // Using 'content' as summary
          date: item.publish_date,
          image: item.image,
          category: item.category
        }))
        
        setNews(formattedNews)
      } catch (err) {
        console.error("Error fetching news:", err)
        setError((prev) => ({ ...prev, news: true }))
      } finally {
        setLoading((prev) => ({ ...prev, news: false }))
      }
    }

    fetchAnnouncements()
    fetchEvents()
    fetchNews()
  }, [])

  // Text content
  const content = {
    title: "Announcements & Events",
    subtitle: "Stay updated with the latest news and upcoming events",
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
      research: "Research"
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
    calendar: {
      title: "Events Calendar",
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
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
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleCategoryChange = (value) => {
    setCategoryFilter(value)
  }

  // Filter announcements based on search query and category
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      searchQuery === "" ||
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || announcement.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Filter events based on search query and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Filter news based on search query and category
  const filteredNews = news.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Get current date for highlighting today's events
  const currentDate = new Date()
  const today = currentDate.toISOString().split("T")[0]
  const tomorrow = new Date(currentDate)
  tomorrow.setDate(currentDate.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split("T")[0]

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Loading component
  const LoadingComponent = () => (
    <div className="flex justify-center items-center py-16">
      <Loader2 className="h-8 w-8 text-[#1D3D6F] animate-spin" />
      <span className="ml-2 text-[#1D3D6F] font-medium">{content.loading}</span>
    </div>
  )

  // Error component
  const ErrorComponent = () => (
    <div className="flex flex-col justify-center items-center py-16">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <p className="text-lg font-medium text-red-500">{content.error}</p>
    </div>
  )

  return (
    <>
      <div className="min-h-screen bg-[#E8ECEF]">
        <Navbar />
        {/* Header */}
        <div className="relative pt-8 bg-[#1D3D6F] text-white">
          <div className="container mx-auto px-4 py-10 md:py-16">
            <div className="flex justify-between items-center">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 text-white">{content.title}</h1>
                <p className="mt-2 text-white text-lg md:text-xl opacity-90">{content.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Decorative wave */}
          <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="absolute bottom-0 left-0 w-full h-full text-[#E8ECEF] fill-current"
            >
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0z"></path>
            </svg>
          </div>
        </div>

        {/* Search and filter section */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 -mt-16 relative z-10 border border-[#E8ECEF]">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1D3D6F] h-5 w-5" />
                <Input
                  type="text"
                  placeholder={content.search}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 border-[#E8ECEF] rounded-lg focus:border-[#1D3D6F] focus:ring focus:ring-[#1D3D6F]/20"
                />
              </div>
              <div className="md:w-64 flex items-center gap-2">
                <Filter className="text-[#1D3D6F] h-5 w-5 hidden md:block" />
                <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="border-[#E8ECEF] rounded-lg focus:border-[#1D3D6F] focus:ring focus:ring-[#1D3D6F]/20">
                    <SelectValue placeholder={content.filter} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#E8ECEF]">
                    <SelectItem value="all" className="hover:bg-[#E8ECEF] rounded-md">
                      {content.categories.all}
                    </SelectItem>
                    <SelectItem value="academic" className="hover:bg-[#E8ECEF] rounded-md">
                      {content.categories.academic}
                    </SelectItem>
                    <SelectItem value="admission" className="hover:bg-[#E8ECEF] rounded-md">
                      {content.categories.admission}
                    </SelectItem>
                    <SelectItem value="conference" className="hover:bg-[#E8ECEF] rounded-md">
                      {content.categories.conference}
                    </SelectItem>
                    <SelectItem value="workshop" className="hover:bg-[#E8ECEF] rounded-md">
                      {content.categories.workshop}
                    </SelectItem>
                    <SelectItem value="seminar" className="hover:bg-[#E8ECEF] rounded-md">
                      {content.categories.seminar}
                    </SelectItem>
                    <SelectItem value="cultural" className="hover:bg-[#E8ECEF] rounded-md">
                      {content.categories.cultural}
                    </SelectItem>
                    <SelectItem value="research" className="hover:bg-[#E8ECEF] rounded-md">
                      {content.categories.research}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="container mx-auto px-4 py-8">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-[#E8ECEF]">
                <TabsTrigger value="all" className="data-[state=active]:bg-[#1D3D6F] data-[state=active]:text-white">
                  {content.tabs.all}
                </TabsTrigger>
                <TabsTrigger
                  value="announcements"
                  className="data-[state=active]:bg-[#1D3D6F] data-[state=active]:text-white"
                >
                  {content.tabs.announcements}
                </TabsTrigger>
                <TabsTrigger value="events" className="data-[state=active]:bg-[#1D3D6F] data-[state=active]:text-white">
                  {content.tabs.events}
                </TabsTrigger>
                <TabsTrigger value="news" className="data-[state=active]:bg-[#1D3D6F] data-[state=active]:text-white">
                  {content.tabs.news}
                </TabsTrigger>
              </TabsList>

              {/* All Tab */}
              <TabsContent value="all">
                {/* Loading and error states for all content */}
                {(loading.announcements || loading.events || loading.news) && <LoadingComponent />}

                {(error.announcements || error.events || error.news) && <ErrorComponent />}

                {/* Featured Announcements */}
                {!loading.announcements && !error.announcements && filteredAnnouncements.some((a) => a.featured) && (
                  <section className="mb-16">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-[#1D3D6F]">{content.featured.title}</h2>
                      <Button variant="link" className="text-[#1D3D6F] hover:text-[#2C4F85] flex items-center gap-1">
                        {content.featured.viewAll} <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredAnnouncements
                        .filter((a) => a.featured)
                        .map((announcement) => (
                          <Card
                            key={announcement.id}
                            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden"
                          >
                            <CardContent className="p-0">
                              <div className="bg-[#1D3D6F] p-6 text-white">
                                <div className="flex justify-between items-start">
                                  <h3 className="text-xl font-bold mb-2">{announcement.title}</h3>
                                  <div className="bg-[#F7B500] text-[#1D3D6F] text-xs font-medium px-2.5 py-1 rounded-full">
                                    {content.categories[announcement.category] || announcement.category}
                                  </div>
                                </div>
                                <p className="text-white text-sm opacity-80">{formatDate(announcement.date)}</p>
                              </div>
                              <div className="p-6 bg-white">
                                <p className="text-black">{announcement.content}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </section>
                )}

                {/* Upcoming Events */}
                {!loading.events && !error.events && filteredEvents.length > 0 && (
                  <section className="mb-16">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-[#1D3D6F]">{content.upcoming.title}</h2>
                      <Button variant="link" className="text-[#1D3D6F] hover:text-[#2C4F85] flex items-center gap-1">
                        {content.upcoming.viewAll} <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {filteredEvents
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .slice(0, 3)
                        .map((event) => (
                          <Card
                            key={event.id}
                            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden"
                          >
                            <CardContent className="p-0">
                              <div className="relative h-48 overflow-hidden">
                                <img
                                  src={event.image || "/placeholder.svg?height=200&width=400"}
                                  alt={event.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                  {event.date === today ? (
                                    <div className="bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-2.5 py-1 rounded-full">
                                      {content.upcoming.today}
                                    </div>
                                  ) : event.date === tomorrowStr ? (
                                    <div className="bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-2.5 py-1 rounded-full">
                                      {content.upcoming.tomorrow}
                                    </div>
                                  ) : (
                                    <div className="bg-[#1D3D6F] text-white text-xs font-medium px-2.5 py-1 rounded-full">
                                      {content.categories[event.category] || event.category}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="p-6 bg-white">
                                <h3 className="text-xl font-bold mb-2 text-[#1D3D6F]">{event.title}</h3>
                                <p className="text-black mb-4 line-clamp-2">{event.description}</p>
                                <div className="space-y-2 mb-4">
                                  <div className="flex items-center text-sm text-[#2C4F85]">
                                    <Calendar className="h-4 w-4 mr-2 text-[#1D3D6F]" />
                                    <span>{formatDate(event.date)}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-[#2C4F85]">
                                    <Clock className="h-4 w-4 mr-2 text-[#1D3D6F]" />
                                    <span>{event.time}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-[#2C4F85]">
                                    <MapPin className="h-4 w-4 mr-2 text-[#1D3D6F]" />
                                    <span>{event.location}</span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button className="bg-[#1D3D6F] hover:bg-[#2C4F85] text-white flex-1">
                                    {content.upcoming.register}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="border-[#1D3D6F] text-[#1D3D6F] hover:bg-[#E8ECEF]"
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
                  <section className="mb-16">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-[#1D3D6F]">{content.news.title}</h2>
                      <Button variant="link" className="text-[#1D3D6F] hover:text-[#2C4F85] flex items-center gap-1">
                        {content.news.viewAll} <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {filteredNews.map((item) => (
                        <Card
                          key={item.id}
                          className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden"
                        >
                          <CardContent className="p-0">
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={`/img/news/${item.image}`|| "/placeholder.svg?height=200&width=400"}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#1D3D6F]/80 to-transparent flex items-end">
                                <div className="p-6">
                                  <div className="text-xs font-medium text-white opacity-80 mb-2">
                                    {formatDate(item.date)}
                                  </div>
                                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                                </div>
                              </div>
                            </div>
                            <div className="p-6 bg-white">
                              <p className="text-black mb-4">{item.summary}</p>
                              <Button
                                variant="link"
                                className="text-[#1D3D6F] hover:text-[#2C4F85] p-0 h-auto flex items-center gap-1"
                              >
                                {content.news.readMore} <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

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
                    <div className="text-center py-16 bg-white rounded-xl shadow">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4">
                        <Search className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-medium text-[#1D3D6F] mb-2">{content.noResults}</h3>
                    </div>
                  )}
              </TabsContent>

              {/* Announcements Tab */}
              <TabsContent value="announcements">
                {loading.announcements && <LoadingComponent />}

                {error.announcements && <ErrorComponent />}

                {!loading.announcements && !error.announcements && filteredAnnouncements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredAnnouncements.map((announcement) => (
                      <Card
                        key={announcement.id}
                        className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden"
                      >
                        <CardContent className="p-0">
                          <div
                            className={`bg-[#1D3D6F] p-6 text-white ${
                              announcement.featured ? "border-l-4 border-[#F7B500]" : ""
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <h3 className="text-xl font-bold mb-2">{announcement.title}</h3>
                              <div className="bg-[#F7B500] text-[#1D3D6F] text-xs font-medium px-2.5 py-1 rounded-full">
                                {content.categories[announcement.category] || announcement.category}
                              </div>
                            </div>
                            <p className="text-white text-sm opacity-80">{formatDate(announcement.date)}</p>
                          </div>
                          <div className="p-6 bg-white">
                            <p className="text-black">{announcement.content}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : !loading.announcements && !error.announcements ? (
                  <div className="text-center py-16 bg-white rounded-xl shadow">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4">
                      <Search className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-medium text-[#1D3D6F] mb-2">{content.noResults}</h3>
                  </div>
                ) : null}
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events">
                {loading.events && <LoadingComponent />}

                {error.events && <ErrorComponent />}

                {!loading.events && !error.events && filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((event) => (
                        <Card
                          key={event.id}
                          className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden"
                        >
                          <CardContent className="p-0">
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={event.image || "/placeholder.svg?height=200&width=400"}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-4 right-4">
                                {event.date === today ? (
                                  <div className="bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-2.5 py-1 rounded-full">
                                    {content.upcoming.today}
                                  </div>
                                ) : event.date === tomorrowStr ? (
                                  <div className="bg-[#F7B500] text-[#1D3D6F] text-xs font-bold px-2.5 py-1 rounded-full">
                                    {content.upcoming.tomorrow}
                                  </div>
                                ) : (
                                  <div className="bg-[#1D3D6F] text-white text-xs font-medium px-2.5 py-1 rounded-full">
                                    {content.categories[event.category] || event.category}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="p-6 bg-white">
                              <h3 className="text-xl font-bold mb-2 text-[#1D3D6F]">{event.title}</h3>
                              <p className="text-black mb-4 line-clamp-2">{event.description}</p>
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-[#2C4F85]">
                                  <Calendar className="h-4 w-4 mr-2 text-[#1D3D6F]" />
                                  <span>{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center text-sm text-[#2C4F85]">
                                  <Clock className="h-4 w-4 mr-2 text-[#1D3D6F]" />
                                  <span>{event.time}</span>
                                </div>
                                <div className="flex items-center text-sm text-[#2C4F85]">
                                  <MapPin className="h-4 w-4 mr-2 text-[#1D3D6F]" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button className="bg-[#1D3D6F] hover:bg-[#2C4F85] text-white flex-1">
                                  {content.upcoming.register}
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-[#1D3D6F] text-[#1D3D6F] hover:bg-[#E8ECEF]"
                                >
                                  {content.upcoming.moreInfo}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : !loading.events && !error.events ? (
                  <div className="text-center py-16 bg-white rounded-xl shadow">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4">
                      <Search className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-medium text-[#1D3D6F] mb-2">{content.noResults}</h3>
                  </div>
                ) : null}
              </TabsContent>

              {/* News Tab */}
              <TabsContent value="news">
                {loading.news && <LoadingComponent />}

                {error.news && <ErrorComponent />}

                {!loading.news && !error.news && filteredNews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNews.map((item) => (
                      <Card
                        key={item.id}
                        className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden"
                      >
                        <CardContent className="p-0">
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={`/img/news/${item.image}` || "/placeholder.svg?height=200&width=400"}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1D3D6F]/80 to-transparent flex items-end">
                              <div className="p-6">
                                <div className="text-xs font-medium text-white opacity-80 mb-2">
                                  {formatDate(item.date)}
                                </div>
                                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                              </div>
                            </div>
                          </div>
                          <div className="p-6 bg-white">
                            <p className="text-black mb-4">{item.summary}</p>
                            <Button
                              variant="link"
                              className="text-[#1D3D6F] hover:text-[#2C4F85] p-0 h-auto flex items-center gap-1"
                            >
                              {content.news.readMore} <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : !loading.news && !error.news ? (
                  <div className="text-center py-16 bg-white rounded-xl shadow">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8ECEF] text-[#1D3D6F] mb-4">
                      <Search className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-medium text-[#1D3D6F] mb-2">{content.noResults}</h3>
                  </div>
                ) : null}
              </TabsContent>
            </Tabs>

            {/* Events Calendar */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6 text-[#1D3D6F]">{content.calendar.title}</h2>
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6 bg-white">
                  <div className="grid grid-cols-7 gap-1">
                    {/* Calendar header - days of week */}
                    {content.calendar.weekdays.map((day, index) => (
                      <div key={index} className="text-center font-medium text-[#1D3D6F] py-2">
                        {day}
                      </div>
                    ))}

                    {/* Calendar days - simplified example */}
                    {Array.from({ length: 35 }, (_, i) => {
                      const day = i + 1
                      const hasEvent = events.some((event) => {
                        const eventDate = new Date(event.date)
                        return eventDate.getDate() === day && eventDate.getMonth() === currentDate.getMonth()
                      })

                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded-md flex flex-col items-center justify-center p-1 ${
                            day === currentDate.getDate()
                              ? "bg-[#F7B500] text-[#1D3D6F] font-medium"
                              : hasEvent
                                ? "bg-[#E8ECEF] hover:bg-[#E8ECEF]/80 cursor-pointer transition-colors"
                                : ""
                          }`}
                        >
                          <span className="text-sm">{day <= 31 ? day : ""}</span>
                          {hasEvent && <div className="w-1.5 h-1.5 rounded-full bg-[#1D3D6F] mt-1"></div>}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Archive section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1D3D6F]">{content.archive.title}</h2>
                <Button variant="link" className="text-[#1D3D6F] hover:text-[#2C4F85] flex items-center gap-1">
                  {content.archive.viewMore} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-white">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-[#1D3D6F]">2023</h3>
                    <ul className="space-y-3">
                      <li>
                        <a href="#" className="flex items-center text-[#2C4F85] hover:text-[#1D3D6F] transition-colors">
                          <ChevronRight className="h-4 w-4 mr-2 text-[#1D3D6F]" />
                          <span>July 2023</span>
                          <span className="ml-auto bg-[#E8ECEF] text-[#1D3D6F] text-xs font-medium px-2 py-0.5 rounded-full">
                            12
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center text-[#2C4F85] hover:text-[#1D3D6F] transition-colors">
                          <ChevronRight className="h-4 w-4 mr-2 text-[#1D3D6F]" />
                          <span>June 2023</span>
                          <span className="ml-auto bg-[#E8ECEF] text-[#1D3D6F] text-xs font-medium px-2 py-0.5 rounded-full">
                            8
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center text-[#2C4F85] hover:text-[#1D3D6F] transition-colors">
                          <ChevronRight className="h-4 w-4 mr-2 text-[#1D3D6F]" />
                          <span>May 2023</span>
                          <span className="ml-auto bg-[#E8ECEF] text-[#1D3D6F] text-xs font-medium px-2 py-0.5 rounded-full">
                            15
                          </span>
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-white">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-[#1D3D6F]">2022</h3>
                    <ul className="space-y-3">
                      <li>
                        <a href="#" className="flex items-center text-[#2C4F85] hover:text-[#1D3D6F] transition-colors">
                          <ChevronRight className="h-4 w-4 mr-2 text-[#1D3D6F]" />
                          <span>December 2022</span>
                          <span className="ml-auto bg-[#E8ECEF] text-[#1D3D6F] text-xs font-medium px-2 py-0.5 rounded-full">
                            10
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center text-[#2C4F85] hover:text-[#1D3D6F] transition-colors">
                          <ChevronRight className="h-4 w-4 mr-2 text-[#1D3D6F]" />
                          <span>November 2022</span>
                          <span className="ml-auto bg-[#E8ECEF] text-[#1D3D6F] text-xs font-medium px-2 py-0.5 rounded-full">
                            7
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center text-[#2C4F85] hover:text-[#1D3D6F] transition-colors">
                          <ChevronRight className="h-4 w-4 mr-2 text-[#1D3D6F]" />
                          <span>October 2022</span>
                          <span className="ml-auto bg-[#E8ECEF] text-[#1D3D6F] text-xs font-medium px-2 py-0.5 rounded-full">
                            9
                          </span>
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-white">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-[#1D3D6F]">2021</h3>
                    <ul className="space-y-3">
                      <li>
                        <a href="#" className="flex items-center text-[#2C4F85] hover:text-[#1D3D6F] transition-colors">
                          <ChevronRight className="h-4 w-4 mr-2 text-[#1D3D6F]" />
                          <span>December 2021</span>
                          <span className="ml-auto bg-[#E8ECEF] text-[#1D3D6F] text-xs font-medium px-2 py-0.5 rounded-full">
                            11
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center text-[#2C4F85] hover:text-[#1D3D6F] transition-colors">
                          <ChevronRight className="h-4 w-4 mr-2 text-[#1D3D6F]" />
                          <span>November 2021</span>
                          <span className="ml-auto bg-[#E8ECEF] text-[#1D3D6F] text-xs font-medium px-2 py-0.5 rounded-full">
                            6
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center text-[#2C4F85] hover:text-[#1D3D6F] transition-colors">
                          <ChevronRight className="h-4 w-4 mr-2 text-[#1D3D6F]" />
                          <span>October 2021</span>
                          <span className="ml-auto bg-[#E8ECEF] text-[#1D3D6F] text-xs font-medium px-2 py-0.5 rounded-full">
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
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1D3D6F] text-white mt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-white">KUFE</h3>
              <p className="text-white opacity-80 leading-relaxed">
                Kandahar University Faculty of Economics provides quality education in economics, finance, business
                management, and statistics.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3 text-white opacity-80">
                <li>
                  <a href="/" className="hover:text-[#F7B500] transition-colors flex items-center">
                    <span className="bg-[#2C4F85] h-1.5 w-1.5 rounded-full mr-2"></span>
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-[#F7B500] transition-colors flex items-center">
                    <span className="bg-[#2C4F85] h-1.5 w-1.5 rounded-full mr-2"></span>
                    About
                  </a>
                </li>
                <li>
                  <a href="/academics" className="hover:text-[#F7B500] transition-colors flex items-center">
                    <span className="bg-[#2C4F85] h-1.5 w-1.5 rounded-full mr-2"></span>
                    Academics
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-[#F7B500] transition-colors flex items-center">
                    <span className="bg-[#2C4F85] h-1.5 w-1.5 rounded-full mr-2"></span>
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Contact</h3>
              <ul className="space-y-4 text-white opacity-80">
                <li className="flex items-center">
                  <MapPin className="h-5 w-5 text-[#F7B500] mr-3" />
                  <span>Kandahar University, Afghanistan</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-[#F7B500] mr-3" />
                  <span>+93 70 000 0000</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-[#F7B500] mr-3" />
                  <span>info@kufe.edu.af</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#2C4F85] mt-10 pt-8 text-center text-white opacity-70">
            <p>&copy; {new Date().getFullYear()} Kandahar University Faculty of Economics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default AnnouncementsEventsPage
