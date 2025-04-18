import React from "react";
import { useState } from "react";
import {
  Globe,
  Calendar,
  Clock,
  MapPin,
  Search,
  ChevronRight,
  ArrowRight,
  Filter,
  Phone,
  Mail,
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

function AnnouncementsEventsPage() {
  const [language, setLanguage] = useState("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const translations = {
    en: {
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
    },
    ps: {
      title: "اعلانات او پیښې",
      subtitle: "د وروستي خبرونو او راتلونکو پیښو سره تازه پاتې شئ",
      search: "اعلانات او پیښې لټول...",
      filter: "د کټګورۍ له مخې فلټر کول",
      categories: {
        all: "ټولې کټګورۍ",
        academic: "علمي",
        admission: "داخله",
        conference: "کنفرانس",
        workshop: "ورکشاپ",
        seminar: "سیمینار",
        cultural: "کلتوري",
      },
      featured: {
        title: "ځانګړي اعلانات",
        viewAll: "ټول اعلانات وګورئ",
      },
      upcoming: {
        title: "راتلونکې پیښې",
        viewAll: "ټولې پیښې وګورئ",
        today: "نن",
        tomorrow: "سبا",
        register: "راجستر کول",
        moreInfo: "نور معلومات",
      },
      news: {
        title: "وروستي خبرونه",
        viewAll: "ټول خبرونه وګورئ",
        readMore: "نور ولولئ",
      },
      calendar: {
        title: "د پیښو کلیز",
        months: [
          "جنوري",
          "فبروري",
          "مارچ",
          "اپریل",
          "می",
          "جون",
          "جولای",
          "اګست",
          "سپتمبر",
          "اکتوبر",
          "نومبر",
          "دسمبر",
        ],
        weekdays: [
          "یکشنبه",
          "دوشنبه",
          "سه شنبه",
          "چهارشنبه",
          "پنجشنبه",
          "جمعه",
          "شنبه",
        ],
      },
      tabs: {
        all: "ټول",
        announcements: "اعلانات",
        events: "پیښې",
        news: "خبرونه",
      },
      archive: {
        title: "آرشیف",
        viewMore: "نور وګورئ",
      },
      noResults: "ستاسو د لټون معیار لپاره پایلې ونه موندل شوې.",
    },
    da: {
      title: "اعلانات و رویدادها",
      subtitle: "با آخرین اخبار و رویدادهای آینده به روز باشید",
      search: "جستجوی اعلانات و رویدادها...",
      filter: "فیلتر بر اساس دسته بندی",
      categories: {
        all: "همه دسته بندی ها",
        academic: "علمی",
        admission: "پذیرش",
        conference: "کنفرانس",
        workshop: "کارگاه",
        seminar: "سمینار",
        cultural: "فرهنگی",
      },
      featured: {
        title: "اعلانات ویژه",
        viewAll: "مشاهده همه اعلانات",
      },
      upcoming: {
        title: "رویدادهای آینده",
        viewAll: "مشاهده همه رویدادها",
        today: "امروز",
        tomorrow: "فردا",
        register: "ثبت نام",
        moreInfo: "اطلاعات بیشتر",
      },
      news: {
        title: "آخرین اخبار",
        viewAll: "مشاهده همه اخبار",
        readMore: "بیشتر بخوانید",
      },
      calendar: {
        title: "تقویم رویدادها",
        months: [
          "جنوری",
          "فبروری",
          "مارچ",
          "اپریل",
          "می",
          "جون",
          "جولای",
          "آگست",
          "سپتمبر",
          "اکتوبر",
          "نومبر",
          "دسمبر",
        ],
        weekdays: [
          "یکشنبه",
          "دوشنبه",
          "سه شنبه",
          "چهارشنبه",
          "پنجشنبه",
          "جمعه",
          "شنبه",
        ],
      },
      tabs: {
        all: "همه",
        announcements: "اعلانات",
        events: "رویدادها",
        news: "اخبار",
      },
      archive: {
        title: "آرشیو",
        viewMore: "بیشتر ببینید",
      },
      noResults: "نتیجه ای برای معیار جستجوی شما یافت نشد.",
    },
  };

  const t = translations[language];

  // Sample data for announcements, events, and news
  const announcements = [
    {
      id: 1,
      title: {
        en: "Fall 2023 Semester Registration Now Open",
        ps: "د ۲۰۲۳ کال د منی سمسټر راجستریشن اوس پرانیستی دی",
        da: "ثبت نام ترم خزان ۲۰۲۳ اکنون باز است",
      },
      content: {
        en: "Registration for the Fall 2023 semester is now open for all students. Please visit the Registrar's Office or register online through the student portal by August 15, 2023.",
        ps: "د ۲۰۲۳ کال د منی سمسټر لپاره راجستریشن اوس د ټولو زده کوونکو لپاره پرانیستی دی. مهرباني وکړئ د راجسټرار دفتر ته مراجعه وکړئ یا د ۲۰۲۳ کال د اګست تر ۱۵ نیټې پورې د زده کوونکي پورټل له لارې آنلاین راجستر شئ.",
        da: "ثبت نام برای ترم خزان ۲۰۲۳ اکنون برای تمام دانشجویان باز است. لطفاً به دفتر ثبت نام مراجعه کنید یا تا ۱۵ آگست ۲۰۲۳ از طریق پورتال دانشجویی به صورت آنلاین ثبت نام کنید.",
      },
      date: "2023-07-15",
      category: "academic",
      featured: true,
    },
    {
      id: 2,
      title: {
        en: "New Scholarship Opportunities Available",
        ps: "د نوي بورسونو فرصتونه شتون لري",
        da: "فرصت های جدید بورسیه در دسترس است",
      },
      content: {
        en: "The Faculty of Economics is pleased to announce new scholarship opportunities for outstanding students. Applications are open until September 1, 2023.",
        ps: "د اقتصاد پوهنځی د ځانګړو زده کوونکو لپاره د نوي بورسونو فرصتونو اعلان کولو څخه خوښي څرګندوي. غوښتنلیکونه د ۲۰۲۳ کال د سپټمبر تر ۱ نیټې پورې پرانیستي دي.",
        da: "دانشکده اقتصاد با خوشحالی فرصت های جدید بورسیه را برای دانشجویان برجسته اعلام می کند. درخواست ها تا ۱ سپتمبر ۲۰۲۳ باز است.",
      },
      date: "2023-07-20",
      category: "admission",
      featured: true,
    },
    {
      id: 3,
      title: {
        en: "Library Hours Extended During Final Exams",
        ps: "د وروستي ازموینو پر مهال د کتابتون ساعتونه غځول شوي",
        da: "ساعات کتابخانه در طول امتحانات نهایی تمدید شده است",
      },
      content: {
        en: "The university library will extend its operating hours during the final examination period. The library will be open from 8:00 AM to 10:00 PM from July 25 to August 5, 2023.",
        ps: "د وروستي ازموینو په موده کې به پوهنتون کتابتون خپل کاري ساعتونه وغځوي. کتابتون به د ۲۰۲۳ کال د جولای له ۲۵ څخه د اګست تر ۵ پورې د سهار له ۸:۰۰ بجو څخه د ماښام تر ۱۰:۰۰ بجو پورې پرانیستی وي.",
        da: "کتابخانه دانشگاه ساعات کاری خود را در دوره امتحانات نهایی تمدید خواهد کرد. کتابخانه از ۲۵ جولای تا ۵ آگست ۲۰۲۳ از ساعت ۸:۰۰ صبح تا ۱۰:۰۰ شب باز خواهد بود.",
      },
      date: "2023-07-18",
      category: "academic",
      featured: false,
    },
  ];

  const events = [
    {
      id: 1,
      title: {
        en: "Economic Development Conference",
        ps: "د اقتصادي پرمختیا کنفرانس",
        da: "کنفرانس توسعه اقتصادی",
      },
      description: {
        en: "Join us for a conference on economic development in Afghanistan featuring keynote speakers from international organizations and local experts.",
        ps: "د افغانستان په اقتصادي پرمختیا باندې د یو کنفرانس لپاره له موږ سره یوځای شئ چې د نړیوالو سازمانونو او محلي کارپوهانو لخوا اصلي ویناوال به پکې وي.",
        da: "برای کنفرانسی در مورد توسعه اقتصادی در افغانستان با سخنرانان کلیدی از سازمان های بین المللی و کارشناسان محلی به ما بپیوندید.",
      },
      date: "2023-08-15",
      time: "09:00 - 17:00",
      location: {
        en: "Main Auditorium, Kandahar University",
        ps: "اصلي تالار، کندهار پوهنتون",
        da: "تالار اصلی، دانشگاه کندهار",
      },
      category: "conference",
      featured: true,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      title: {
        en: "Workshop on Research Methodology",
        ps: "د څیړنې میتودولوژۍ په اړه ورکشاپ",
        da: "کارگاه روش تحقیق",
      },
      description: {
        en: "A hands-on workshop designed to enhance research skills for undergraduate and graduate students in economics and related fields.",
        ps: "د اقتصاد او اړوندو برخو کې د لیسانس او ماسټر زده کوونکو لپاره د څیړنیزو مهارتونو د پیاوړي کولو لپاره یو عملي ورکشاپ.",
        da: "یک کارگاه عملی طراحی شده برای تقویت مهارت های تحقیقاتی دانشجویان کارشناسی و کارشناسی ارشد در رشته اقتصاد و زمینه های مرتبط.",
      },
      date: "2023-07-28",
      time: "14:00 - 17:00",
      location: {
        en: "Room 105, Faculty of Economics Building",
        ps: "خونه ۱۰۵، د اقتصاد پوهنځي ودانۍ",
        da: "اتاق ۱۰۵، ساختمان دانشکده اقتصاد",
      },
      category: "workshop",
      featured: true,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      title: {
        en: "Guest Lecture: International Trade Policies",
        ps: "میلمه لیکچر: نړیوال سوداګریز پالیسۍ",
        da: "سخنرانی مهمان: سیاست های تجارت بین المللی",
      },
      description: {
        en: "Dr. Sarah Johnson from the World Trade Organization will deliver a lecture on current international trade policies and their impact on developing economies.",
        ps: "د نړیوال سوداګرۍ سازمان څخه ډاکټر سارا جانسن به د اوسني نړیوال سوداګریزو پالیسیو او پر مخ پر ودې اقتصادونو باندې د هغوی د اغیزو په اړه لیکچر ورکړي.",
        da: "دکتر سارا جانسون از سازمان تجارت جهانی سخنرانی در مورد سیاست های فعلی تجارت بین المللی و تأثیر آنها بر اقتصادهای در حال توسعه ارائه خواهد داد.",
      },
      date: "2023-08-05",
      time: "10:00 - 12:00",
      location: {
        en: "Conference Hall, Faculty of Economics",
        ps: "کنفرانس هال، د اقتصاد پوهنځی",
        da: "سالن کنفرانس، دانشکده اقتصاد",
      },
      category: "seminar",
      featured: false,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 4,
      title: {
        en: "Student Orientation Day",
        ps: "د زده کوونکو د توجیه ورځ",
        da: "روز آشنایی دانشجویان",
      },
      description: {
        en: "Welcome event for new students joining the Faculty of Economics. Learn about academic programs, campus facilities, and student services.",
        ps: "د اقتصاد پوهنځي سره یوځای کیدونکو نویو زده کوونکو لپاره د هرکلي پروګرام. د علمي پروګرامونو، کمپس اسانتیاوو، او د زده کوونکو خدماتو په اړه معلومات ترلاسه کړئ.",
        da: "رویداد خوش آمدگویی برای دانشجویان جدیدی که به دانشکده اقتصاد می پیوندند. در مورد برنامه های علمی، امکانات پردیس و خدمات دانشجویی اطلاعات کسب کنید.",
      },
      date: "2023-08-20",
      time: "09:00 - 15:00",
      location: {
        en: "Main Campus, Kandahar University",
        ps: "اصلي کمپس، کندهار پوهنتون",
        da: "پردیس اصلی، دانشگاه کندهار",
      },
      category: "academic",
      featured: true,
      image: "/placeholder.svg?height=200&width=400",
    },
  ];

  const news = [
    {
      id: 1,
      title: {
        en: "Faculty of Economics Receives Research Grant",
        ps: "د اقتصاد پوهنځي د څیړنې مرسته ترلاسه کړه",
        da: "دانشکده اقتصاد کمک هزینه تحقیقاتی دریافت کرد",
      },
      summary: {
        en: "The Faculty of Economics has been awarded a significant research grant to study sustainable economic development in rural areas of Afghanistan.",
        ps: "د اقتصاد پوهنځي ته د افغانستان په کلیوالي سیمو کې د دوامداره اقتصادي پرمختیا د څیړلو لپاره د پام وړ څیړنیزه مرسته ورکړل شوې ده.",
        da: "دانشکده اقتصاد کمک هزینه تحقیقاتی قابل توجهی برای مطالعه توسعه اقتصادی پایدار در مناطق روستایی افغانستان دریافت کرده است.",
      },
      date: "2023-07-10",
      image: "/placeholder.svg?height=200&width=400",
      category: "research",
    },
    {
      id: 2,
      title: {
        en: "Economics Students Win National Competition",
        ps: "د اقتصاد زده کوونکو ملي سیالي وګټله",
        da: "دانشجویان اقتصاد مسابقه ملی را بردند",
      },
      summary: {
        en: "A team of undergraduate students from the Faculty of Economics won first place in the National Economics Case Competition held in Kabul last week.",
        ps: "د اقتصاد پوهنځي د لیسانس زده کوونکو یو ټیم تیره اونۍ په کابل کې د ملي اقتصادي قضیې په سیالۍ کې لومړی مقام وګاټه.",
        da: "تیمی از دانشجویان کارشناسی دانشکده اقتصاد هفته گذشته در مسابقه ملی موردکاوی اقتصاد که در کابل برگزار شد، مقام اول را کسب کردند.",
      },
      date: "2023-07-05",
      image: "/placeholder.svg?height=200&width=400",
      category: "achievement",
    },
    {
      id: 3,
      title: {
        en: "New Partnership with International University",
        ps: "د نړیوال پوهنتون سره نوې همکاري",
        da: "مشارکت جدید با دانشگاه بین المللی",
      },
      summary: {
        en: "The Faculty of Economics has established a new partnership with the London School of Economics for academic exchange and collaborative research projects.",
        ps: "د اقتصاد پوهنځي د علمي تبادلې او ګډو څیړنیزو پروژو لپاره د لندن د اقتصاد ښوونځي سره نوې همکاري رامینځته کړې ده.",
        da: "دانشکده اقتصاد برای تبادل علمی و پروژه های تحقیقاتی مشترک با مدرسه اقتصاد لندن مشارکت جدیدی برقرار کرده است.",
      },
      date: "2023-06-28",
      image: "/placeholder.svg?height=200&width=400",
      category: "partnership",
    },
  ];

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
  };

  // Filter announcements based on search query and category
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      searchQuery === "" ||
      announcement.title[language]
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      announcement.content[language]
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || announcement.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Filter events based on search query and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description[language]
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || event.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Filter news based on search query and category
  const filteredNews = news.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary[language].toLowerCase().includes(searchQuery.toLowerCase());

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
    return new Intl.DateTimeFormat(
      language === "en" ? "en-US" : language === "ps" ? "ps-AF" : "fa-AF",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    ).format(date);
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100'>
      {/* Header with language selector */}
      <div className='relative bg-gradient-to-r from-slate-900 to-slate-800 text-white'>
        <div className='container mx-auto px-4 py-10 md:py-16'>
          <div className='flex justify-between items-center'>
            <div className='max-w-2xl'>
              <h1 className='text-3xl md:text-5xl font-bold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300'>
                {t.title}
              </h1>
              <p className='mt-2 text-slate-300 text-lg md:text-xl'>
                {t.subtitle}
              </p>
            </div>
            <div className='flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg border border-slate-700/50'>
              <Globe className='text-blue-300 h-5 w-5' />

              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className='w-[140px] bg-transparent border-none text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'>
                  <SelectValue placeholder='Language' />
                </SelectTrigger>

                <SelectContent className='bg-slate-800 text-slate-100 border border-slate-700 shadow-lg rounded-md'>
                  <SelectItem
                    value='en'
                    className='hover:bg-slate-700 px-3 py-2 rounded-md transition-all duration-150'
                  >
                    English
                  </SelectItem>
                  <SelectItem
                    value='ps'
                    className='hover:bg-slate-700 px-3 py-2 rounded-md transition-all duration-150'
                  >
                    پښتو
                  </SelectItem>
                  <SelectItem
                    value='da'
                    className='hover:bg-slate-700 px-3 py-2 rounded-md transition-all duration-150'
                  >
                    دری
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className='absolute bottom-0 left-0 right-0 h-12 overflow-hidden'>
          <svg
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
            className='absolute bottom-0 left-0 w-full h-full text-slate-50 fill-current'
          >
            <path d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0z'></path>
          </svg>
        </div>
      </div>

      {/* Search and filter section */}
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-white rounded-2xl shadow-xl p-6 -mt-16 relative z-10 border border-slate-100'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5' />
              <Input
                type='text'
                placeholder={t.search}
                value={searchQuery}
                onChange={handleSearchChange}
                className='pl-10 border-slate-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200'
              />
            </div>
            <div className='md:w-64 flex items-center gap-2'>
              <Filter className='text-slate-400 h-5 w-5 hidden md:block' />
              <Select
                value={categoryFilter}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className='border-slate-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200'>
                  <SelectValue placeholder={t.filter} />
                </SelectTrigger>
                <SelectContent className='bg-white border border-slate-200 shadow-lg rounded-lg'>
                  <SelectItem
                    value='all'
                    className='hover:bg-slate-50 rounded-md'
                  >
                    {t.categories.all}
                  </SelectItem>
                  <SelectItem
                    value='academic'
                    className='hover:bg-slate-50 rounded-md'
                  >
                    {t.categories.academic}
                  </SelectItem>
                  <SelectItem
                    value='admission'
                    className='hover:bg-slate-50 rounded-md'
                  >
                    {t.categories.admission}
                  </SelectItem>
                  <SelectItem
                    value='conference'
                    className='hover:bg-slate-50 rounded-md'
                  >
                    {t.categories.conference}
                  </SelectItem>
                  <SelectItem
                    value='workshop'
                    className='hover:bg-slate-50 rounded-md'
                  >
                    {t.categories.workshop}
                  </SelectItem>
                  <SelectItem
                    value='seminar'
                    className='hover:bg-slate-50 rounded-md'
                  >
                    {t.categories.seminar}
                  </SelectItem>
                  <SelectItem
                    value='cultural'
                    className='hover:bg-slate-50 rounded-md'
                  >
                    {t.categories.cultural}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className='container mx-auto px-4 py-8'>
          <Tabs defaultValue='all' className='w-full'>
            <TabsList className='grid w-full grid-cols-4 mb-8'>
              <TabsTrigger value='all'>{t.tabs.all}</TabsTrigger>
              <TabsTrigger value='announcements'>
                {t.tabs.announcements}
              </TabsTrigger>
              <TabsTrigger value='events'>{t.tabs.events}</TabsTrigger>
              <TabsTrigger value='news'>{t.tabs.news}</TabsTrigger>
            </TabsList>

            {/* All Tab */}
            <TabsContent value='all'>
              {/* Featured Announcements */}
              {filteredAnnouncements.some((a) => a.featured) && (
                <section className='mb-16'>
                  <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-2xl font-bold text-slate-800'>
                      {t.featured.title}
                    </h2>
                    <Button
                      variant='link'
                      className='text-blue-600 hover:text-blue-800 flex items-center gap-1'
                    >
                      {t.featured.viewAll} <ArrowRight className='h-4 w-4' />
                    </Button>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {filteredAnnouncements
                      .filter((a) => a.featured)
                      .map((announcement) => (
                        <Card
                          key={announcement.id}
                          className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden'
                        >
                          <CardContent className='p-0'>
                            <div className='bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white'>
                              <div className='flex justify-between items-start'>
                                <h3 className='text-xl font-bold mb-2'>
                                  {announcement.title[language]}
                                </h3>
                                <div className='bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded-full'>
                                  {t.categories[announcement.category]}
                                </div>
                              </div>
                              <p className='text-blue-100 text-sm'>
                                {formatDate(announcement.date)}
                              </p>
                            </div>
                            <div className='p-6'>
                              <p className='text-slate-600'>
                                {announcement.content[language]}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </section>
              )}

              {/* Upcoming Events */}
              {filteredEvents.length > 0 && (
                <section className='mb-16'>
                  <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-2xl font-bold text-slate-800'>
                      {t.upcoming.title}
                    </h2>
                    <Button
                      variant='link'
                      className='text-blue-600 hover:text-blue-800 flex items-center gap-1'
                    >
                      {t.upcoming.viewAll} <ArrowRight className='h-4 w-4' />
                    </Button>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {filteredEvents
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .slice(0, 3)
                      .map((event) => (
                        <Card
                          key={event.id}
                          className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden'
                        >
                          <CardContent className='p-0'>
                            <div className='relative h-48 overflow-hidden'>
                              <img
                                src={event.image || "/placeholder.svg"}
                                alt={event.title[language]}
                                className='w-full h-full object-cover'
                              />
                              <div className='absolute top-4 right-4'>
                                {event.date === today ? (
                                  <div className='bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full'>
                                    {t.upcoming.today}
                                  </div>
                                ) : event.date === tomorrowStr ? (
                                  <div className='bg-amber-500 text-white text-xs font-medium px-2.5 py-1 rounded-full'>
                                    {t.upcoming.tomorrow}
                                  </div>
                                ) : (
                                  <div className='bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded-full'>
                                    {t.categories[event.category]}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className='p-6'>
                              <h3 className='text-xl font-bold mb-2 text-slate-800'>
                                {event.title[language]}
                              </h3>
                              <p className='text-slate-600 mb-4 line-clamp-2'>
                                {event.description[language]}
                              </p>
                              <div className='space-y-2 mb-4'>
                                <div className='flex items-center text-sm text-slate-500'>
                                  <Calendar className='h-4 w-4 mr-2 text-blue-500' />
                                  <span>{formatDate(event.date)}</span>
                                </div>
                                <div className='flex items-center text-sm text-slate-500'>
                                  <Clock className='h-4 w-4 mr-2 text-blue-500' />
                                  <span>{event.time}</span>
                                </div>
                                <div className='flex items-center text-sm text-slate-500'>
                                  <MapPin className='h-4 w-4 mr-2 text-blue-500' />
                                  <span>{event.location[language]}</span>
                                </div>
                              </div>
                              <div className='flex gap-2'>
                                <Button className='bg-blue-600 hover:bg-blue-700 text-white flex-1'>
                                  {t.upcoming.register}
                                </Button>
                                <Button
                                  variant='outline'
                                  className='border-blue-200 text-blue-600 hover:bg-blue-50'
                                >
                                  {t.upcoming.moreInfo}
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
              {filteredNews.length > 0 && (
                <section className='mb-16'>
                  <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-2xl font-bold text-slate-800'>
                      {t.news.title}
                    </h2>
                    <Button
                      variant='link'
                      className='text-blue-600 hover:text-blue-800 flex items-center gap-1'
                    >
                      {t.news.viewAll} <ArrowRight className='h-4 w-4' />
                    </Button>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {filteredNews.map((item) => (
                      <Card
                        key={item.id}
                        className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden'
                      >
                        <CardContent className='p-0'>
                          <div className='relative h-48 overflow-hidden'>
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.title[language]}
                              className='w-full h-full object-cover'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end'>
                              <div className='p-6'>
                                <div className='text-xs font-medium text-slate-300 mb-2'>
                                  {formatDate(item.date)}
                                </div>
                                <h3 className='text-xl font-bold text-white'>
                                  {item.title[language]}
                                </h3>
                              </div>
                            </div>
                          </div>
                          <div className='p-6'>
                            <p className='text-slate-600 mb-4'>
                              {item.summary[language]}
                            </p>
                            <Button
                              variant='link'
                              className='text-blue-600 hover:text-blue-800 p-0 h-auto flex items-center gap-1'
                            >
                              {t.news.readMore}{" "}
                              <ArrowRight className='h-4 w-4' />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* No results message */}
              {filteredAnnouncements.length === 0 &&
                filteredEvents.length === 0 &&
                filteredNews.length === 0 && (
                  <div className='text-center py-16'>
                    <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4'>
                      <Search className='h-8 w-8' />
                    </div>
                    <h3 className='text-xl font-medium text-slate-800 mb-2'>
                      {t.noResults}
                    </h3>
                  </div>
                )}
            </TabsContent>

            {/* Announcements Tab */}
            <TabsContent value='announcements'>
              {filteredAnnouncements.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {filteredAnnouncements.map((announcement) => (
                    <Card
                      key={announcement.id}
                      className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden'
                    >
                      <CardContent className='p-0'>
                        <div
                          className={`bg-gradient-to-br ${
                            announcement.featured
                              ? "from-blue-600 to-blue-700"
                              : "from-slate-700 to-slate-800"
                          } p-6 text-white`}
                        >
                          <div className='flex justify-between items-start'>
                            <h3 className='text-xl font-bold mb-2'>
                              {announcement.title[language]}
                            </h3>
                            <div className='bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded-full'>
                              {t.categories[announcement.category]}
                            </div>
                          </div>
                          <p className='text-blue-100 text-sm'>
                            {formatDate(announcement.date)}
                          </p>
                        </div>
                        <div className='p-6'>
                          <p className='text-slate-600'>
                            {announcement.content[language]}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className='text-center py-16'>
                  <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4'>
                    <Search className='h-8 w-8' />
                  </div>
                  <h3 className='text-xl font-medium text-slate-800 mb-2'>
                    {t.noResults}
                  </h3>
                </div>
              )}
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value='events'>
              {filteredEvents.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {filteredEvents
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((event) => (
                      <Card
                        key={event.id}
                        className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden'
                      >
                        <CardContent className='p-0'>
                          <div className='relative h-48 overflow-hidden'>
                            <img
                              src={event.image || "/placeholder.svg"}
                              alt={event.title[language]}
                              className='w-full h-full object-cover'
                            />
                            <div className='absolute top-4 right-4'>
                              {event.date === today ? (
                                <div className='bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full'>
                                  {t.upcoming.today}
                                </div>
                              ) : event.date === tomorrowStr ? (
                                <div className='bg-amber-500 text-white text-xs font-medium px-2.5 py-1 rounded-full'>
                                  {t.upcoming.tomorrow}
                                </div>
                              ) : (
                                <div className='bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded-full'>
                                  {t.categories[event.category]}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className='p-6'>
                            <h3 className='text-xl font-bold mb-2 text-slate-800'>
                              {event.title[language]}
                            </h3>
                            <p className='text-slate-600 mb-4 line-clamp-2'>
                              {event.description[language]}
                            </p>
                            <div className='space-y-2 mb-4'>
                              <div className='flex items-center text-sm text-slate-500'>
                                <Calendar className='h-4 w-4 mr-2 text-blue-500' />
                                <span>{formatDate(event.date)}</span>
                              </div>
                              <div className='flex items-center text-sm text-slate-500'>
                                <Clock className='h-4 w-4 mr-2 text-blue-500' />
                                <span>{event.time}</span>
                              </div>
                              <div className='flex items-center text-sm text-slate-500'>
                                <MapPin className='h-4 w-4 mr-2 text-blue-500' />
                                <span>{event.location[language]}</span>
                              </div>
                            </div>
                            <div className='flex gap-2'>
                              <Button className='bg-blue-600 hover:bg-blue-700 text-white flex-1'>
                                {t.upcoming.register}
                              </Button>
                              <Button
                                variant='outline'
                                className='border-blue-200 text-blue-600 hover:bg-blue-50'
                              >
                                {t.upcoming.moreInfo}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className='text-center py-16'>
                  <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4'>
                    <Search className='h-8 w-8' />
                  </div>
                  <h3 className='text-xl font-medium text-slate-800 mb-2'>
                    {t.noResults}
                  </h3>
                </div>
              )}
            </TabsContent>

            {/* News Tab */}
            <TabsContent value='news'>
              {filteredNews.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {filteredNews.map((item) => (
                    <Card
                      key={item.id}
                      className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden'
                    >
                      <CardContent className='p-0'>
                        <div className='relative h-48 overflow-hidden'>
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title[language]}
                            className='w-full h-full object-cover'
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end'>
                            <div className='p-6'>
                              <div className='text-xs font-medium text-slate-300 mb-2'>
                                {formatDate(item.date)}
                              </div>
                              <h3 className='text-xl font-bold text-white'>
                                {item.title[language]}
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div className='p-6'>
                          <p className='text-slate-600 mb-4'>
                            {item.summary[language]}
                          </p>
                          <Button
                            variant='link'
                            className='text-blue-600 hover:text-blue-800 p-0 h-auto flex items-center gap-1'
                          >
                            {t.news.readMore} <ArrowRight className='h-4 w-4' />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className='text-center py-16'>
                  <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4'>
                    <Search className='h-8 w-8' />
                  </div>
                  <h3 className='text-xl font-medium text-slate-800 mb-2'>
                    {t.noResults}
                  </h3>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Events Calendar */}
          <section className='mb-16'>
            <h2 className='text-2xl font-bold mb-6 text-slate-800'>
              {t.calendar.title}
            </h2>
            <Card className='border-0 shadow-xl rounded-2xl overflow-hidden'>
              <CardContent className='p-6'>
                <div className='grid grid-cols-7 gap-1'>
                  {/* Calendar header - days of week */}
                  {t.calendar.weekdays.map((day, index) => (
                    <div
                      key={index}
                      className='text-center font-medium text-slate-500 py-2'
                    >
                      {day}
                    </div>
                  ))}

                  {/* Calendar days - simplified example */}
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i + 1;
                    const hasEvent = events.some((event) => {
                      const eventDate = new Date(event.date);
                      return (
                        eventDate.getDate() === day &&
                        eventDate.getMonth() === currentDate.getMonth()
                      );
                    });

                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-md flex flex-col items-center justify-center p-1 ${
                          day === currentDate.getDate()
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : hasEvent
                            ? "bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors"
                            : ""
                        }`}
                      >
                        <span className='text-sm'>{day <= 31 ? day : ""}</span>
                        {hasEvent && (
                          <div className='w-1.5 h-1.5 rounded-full bg-blue-500 mt-1'></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Archive section */}
          <section>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold text-slate-800'>
                {t.archive.title}
              </h2>
              <Button
                variant='link'
                className='text-blue-600 hover:text-blue-800 flex items-center gap-1'
              >
                {t.archive.viewMore} <ArrowRight className='h-4 w-4' />
              </Button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl'>
                <CardContent className='p-6'>
                  <h3 className='text-lg font-semibold mb-4 text-slate-800'>
                    2023
                  </h3>
                  <ul className='space-y-3'>
                    <li>
                      <a
                        href='#'
                        className='flex items-center text-slate-600 hover:text-blue-600 transition-colors'
                      >
                        <ChevronRight className='h-4 w-4 mr-2 text-slate-400' />
                        <span>July 2023</span>
                        <span className='ml-auto bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full'>
                          12
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='flex items-center text-slate-600 hover:text-blue-600 transition-colors'
                      >
                        <ChevronRight className='h-4 w-4 mr-2 text-slate-400' />
                        <span>June 2023</span>
                        <span className='ml-auto bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full'>
                          8
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='flex items-center text-slate-600 hover:text-blue-600 transition-colors'
                      >
                        <ChevronRight className='h-4 w-4 mr-2 text-slate-400' />
                        <span>May 2023</span>
                        <span className='ml-auto bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full'>
                          15
                        </span>
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl'>
                <CardContent className='p-6'>
                  <h3 className='text-lg font-semibold mb-4 text-slate-800'>
                    2022
                  </h3>
                  <ul className='space-y-3'>
                    <li>
                      <a
                        href='#'
                        className='flex items-center text-slate-600 hover:text-blue-600 transition-colors'
                      >
                        <ChevronRight className='h-4 w-4 mr-2 text-slate-400' />
                        <span>December 2022</span>
                        <span className='ml-auto bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full'>
                          10
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='flex items-center text-slate-600 hover:text-blue-600 transition-colors'
                      >
                        <ChevronRight className='h-4 w-4 mr-2 text-slate-400' />
                        <span>November 2022</span>
                        <span className='ml-auto bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full'>
                          7
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='flex items-center text-slate-600 hover:text-blue-600 transition-colors'
                      >
                        <ChevronRight className='h-4 w-4 mr-2 text-slate-400' />
                        <span>October 2022</span>
                        <span className='ml-auto bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full'>
                          9
                        </span>
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl'>
                <CardContent className='p-6'>
                  <h3 className='text-lg font-semibold mb-4 text-slate-800'>
                    2021
                  </h3>
                  <ul className='space-y-3'>
                    <li>
                      <a
                        href='#'
                        className='flex items-center text-slate-600 hover:text-blue-600 transition-colors'
                      >
                        <ChevronRight className='h-4 w-4 mr-2 text-slate-400' />
                        <span>December 2021</span>
                        <span className='ml-auto bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full'>
                          11
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='flex items-center text-slate-600 hover:text-blue-600 transition-colors'
                      >
                        <ChevronRight className='h-4 w-4 mr-2 text-slate-400' />
                        <span>November 2021</span>
                        <span className='ml-auto bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full'>
                          6
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href='#'
                        className='flex items-center text-slate-600 hover:text-blue-600 transition-colors'
                      >
                        <ChevronRight className='h-4 w-4 mr-2 text-slate-400' />
                        <span>October 2021</span>
                        <span className='ml-auto bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full'>
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

        {/* Footer */}
        <footer className='bg-gradient-to-r from-slate-900 to-slate-800 text-white mt-20'>
          <div className='container mx-auto px-4 py-16'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
              <div>
                <h3 className='text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300'>
                  KUFE
                </h3>
                <p className='text-slate-300 leading-relaxed'>
                  Kandahar University Faculty of Economics provides quality
                  education in economics, finance, business management, and
                  statistics.
                </p>
              </div>
              <div>
                <h3 className='text-xl font-bold mb-6 text-white'>
                  Quick Links
                </h3>
                <ul className='space-y-3 text-slate-300'>
                  <li>
                    <a
                      href='/'
                      className='hover:text-blue-300 transition-colors flex items-center'
                    >
                      <span className='bg-slate-800 h-1.5 w-1.5 rounded-full mr-2'></span>
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href='/about'
                      className='hover:text-blue-300 transition-colors flex items-center'
                    >
                      <span className='bg-slate-800 h-1.5 w-1.5 rounded-full mr-2'></span>
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href='/academics'
                      className='hover:text-blue-300 transition-colors flex items-center'
                    >
                      <span className='bg-slate-800 h-1.5 w-1.5 rounded-full mr-2'></span>
                      Academics
                    </a>
                  </li>
                  <li>
                    <a
                      href='/contact'
                      className='hover:text-blue-300 transition-colors flex items-center'
                    >
                      <span className='bg-slate-800 h-1.5 w-1.5 rounded-full mr-2'></span>
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className='text-xl font-bold mb-6 text-white'>Contact</h3>
                <ul className='space-y-4 text-slate-300'>
                  <li className='flex items-center'>
                    <MapPin className='h-5 w-5 text-blue-300 mr-3' />
                    <span>Kandahar University, Afghanistan</span>
                  </li>
                  <li className='flex items-center'>
                    <Phone className='h-5 w-5 text-blue-300 mr-3' />
                    <span>+93 70 000 0000</span>
                  </li>
                  <li className='flex items-center'>
                    <Mail className='h-5 w-5 text-blue-300 mr-3' />
                    <span>info@kufe.edu.af</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className='border-t border-slate-800/70 mt-10 pt-8 text-center text-slate-400'>
              <p>
                &copy; {new Date().getFullYear()} Kandahar University Faculty of
                Economics. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AnnouncementsEventsPage;
