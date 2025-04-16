import React from "react";
import { useState } from "react";
import {
  Globe,
  BookOpen,
  Award,
  Users,
  Calendar,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";

function AboutPage() {
  const [language, setLanguage] = useState("en");

  const translations = {
    en: {
      title: "About Us",
      subtitle: "Learn about the Faculty of Economics at Kandahar University",
      overview: {
        title: "Faculty Overview",
        content:
          "The Faculty of Economics at Kandahar University is one of the leading educational institutions in Afghanistan dedicated to providing quality education in economics, finance, business management, and statistics. Established in 2002, our faculty has been committed to academic excellence and preparing students for successful careers in the economic and business sectors.",
      },
      mission: {
        title: "Our Mission",
        content:
          "To provide high-quality education in economics and business disciplines, conduct impactful research, and contribute to the economic development of Afghanistan through knowledge creation and dissemination.",
      },
      vision: {
        title: "Our Vision",
        content:
          "To be recognized as a center of excellence in economics education and research in Afghanistan and the region, producing graduates who are innovative, ethical, and capable of addressing complex economic challenges.",
      },
      values: {
        title: "Our Values",
        list: [
          {
            title: "Academic Excellence",
            description:
              "We are committed to maintaining high standards in teaching, learning, and research.",
          },
          {
            title: "Integrity",
            description:
              "We uphold ethical principles and promote honesty and transparency in all our activities.",
          },
          {
            title: "Innovation",
            description:
              "We encourage creative thinking and innovative approaches to economic challenges.",
          },
          {
            title: "Inclusivity",
            description:
              "We value diversity and provide equal opportunities for all students and staff.",
          },
        ],
      },
      dean: {
        title: "Dean's Message",
        name: "Dr. Ahmad Ahmadi",
        position: "Dean, Faculty of Economics",
        message:
          "Welcome to the Faculty of Economics at Kandahar University. Our faculty is dedicated to providing a stimulating learning environment where students can develop their knowledge and skills in economics and business disciplines. We are committed to academic excellence, innovative research, and community engagement. Our goal is to prepare our graduates to become future leaders who can contribute to the economic development of Afghanistan. I invite you to explore our programs and join our academic community.",
        readMore: "Read Full Message",
      },
      stats: {
        title: "Faculty at a Glance",
        students: "Students",
        faculty: "Faculty Members",
        programs: "Academic Programs",
        years: "Years of Excellence",
      },
      departments: {
        title: "Our Departments",
        list: [
          {
            name: "Department of Economics",
            description:
              "Focuses on economic theory, policy analysis, and development economics.",
            programs: "Bachelor's and Master's in Economics",
          },
          {
            name: "Department of Finance & Banking",
            description:
              "Specializes in financial management, banking, and investment analysis.",
            programs: "Bachelor's in Finance and Banking",
          },
          {
            name: "Department of Business Management",
            description:
              "Covers business administration, marketing, and entrepreneurship.",
            programs: "Bachelor's in Business Administration",
          },
          {
            name: "Department of Statistics",
            description:
              "Focuses on statistical methods, data analysis, and econometrics.",
            programs: "Bachelor's in Statistics",
          },
        ],
      },
      history: {
        title: "Our History",
        content:
          "The Faculty of Economics at Kandahar University was established in 2002 as part of the university's expansion efforts. Starting with just two departments and a handful of students, the faculty has grown significantly over the years. In 2010, we introduced our first Master's program, and by 2015, we had expanded to four specialized departments. Throughout our history, we have remained committed to providing quality education and contributing to Afghanistan's economic development through research and community engagement.",
      },
      contact: {
        title: "Contact Us",
        address:
          "Kandahar University, Faculty of Economics, Kandahar, Afghanistan",
        phone: "+93 70 000 0000",
        email: "info@kufe.edu.af",
        visitUs: "Visit Us",
      },
    },
    ps: {
      title: "زموږ په اړه",
      subtitle: "د کندهار پوهنتون د اقتصاد پوهنځي په اړه معلومات",
      overview: {
        title: "د پوهنځي لنډه کتنه",
        content:
          "د کندهار پوهنتون د اقتصاد پوهنځی د افغانستان د مخکښو تعلیمي ادارو څخه دی چې د اقتصاد، مالي چارو، سوداګریز مدیریت او احصایې په برخه کې د کیفیت لرونکي زده کړو په برابرولو کې ژمن دی. په ۲۰۰۲ کال کې تاسیس شوی، زموږ پوهنځی د علمي برتري او د اقتصادي او سوداګریزو سکتورونو کې د بریالیو کاري فرصتونو لپاره د زده کوونکو چمتو کولو لپاره ژمن دی.",
      },
      mission: {
        title: "زموږ ماموریت",
        content:
          "د اقتصاد او سوداګرۍ په څانګو کې د لوړ کیفیت زده کړو برابرول، د اغیزناکو څیړنو ترسره کول، او د پوهې رامنځته کولو او خپرولو له لارې د افغانستان په اقتصادي پرمختګ کې مرسته کول.",
      },
      vision: {
        title: "زموږ لیدلوری",
        content:
          "په افغانستان او سیمه کې د اقتصادي زده کړو او څیړنو په برخه کې د برتري مرکز په توګه پیژندل کیږي، داسې فارغان تولیدوي چې نوښتګر، اخلاقي، او د پیچلي اقتصادي ننګونو د حل وړتیا ولري.",
      },
      values: {
        title: "زموږ ارزښتونه",
        list: [
          {
            title: "علمي برتري",
            description:
              "موږ په تدریس، زده کړه او څیړنه کې د لوړو معیارونو ساتلو ته ژمن یو.",
          },
          {
            title: "صداقت",
            description:
              "موږ اخلاقي اصول ساتو او په خپلو ټولو فعالیتونو کې صداقت او شفافیت ته وده ورکوو.",
          },
          {
            title: "نوښت",
            description:
              "موږ خلاق فکر او د اقتصادي ننګونو لپاره نوښتګرو لارو ته هڅوو.",
          },
          {
            title: "ټولشمولیت",
            description:
              "موږ تنوع ته ارزښت ورکوو او د ټولو زده کوونکو او کارکوونکو لپاره مساوي فرصتونه برابروو.",
          },
        ],
      },
      dean: {
        title: "د رئیس پیغام",
        name: "ډاکټر احمد احمدي",
        position: "رئیس، د اقتصاد پوهنځی",
        message:
          "د کندهار پوهنتون د اقتصاد پوهنځي ته ښه راغلاست. زموږ پوهنځی د زده کړې داسې چاپیریال برابرولو ته ژمن دی چیرې چې زده کوونکي کولی شي د اقتصاد او سوداګرۍ په څانګو کې خپله پوهه او مهارتونه وده ورکړي. موږ علمي برتري، نوښتګرې څیړنې، او د ټولنې ښکیلتیا ته ژمن یو. زموږ موخه دا ده چې خپل فارغان د راتلونکي مشرانو په توګه چمتو کړو چې د افغانستان په اقتصادي پرمختګ کې مرسته وکړي. زه تاسو بلنه درکوم چې زموږ پروګرامونه وڅیړئ او زموږ علمي ټولنې سره یوځای شئ.",
        readMore: "بشپړ پیغام ولولئ",
      },
      stats: {
        title: "پوهنځی په یوه نظر کې",
        students: "زده کوونکي",
        faculty: "استادان",
        programs: "علمي پروګرامونه",
        years: "د برتري کلونه",
      },
      departments: {
        title: "زموږ څانګې",
        list: [
          {
            name: "د اقتصاد څانګه",
            description:
              "د اقتصادي تیوري، پالیسي تحلیل، او پرمختیایي اقتصاد باندې تمرکز کوي.",
            programs: "په اقتصاد کې د لیسانس او ماسټر",
          },
          {
            name: "د مالي او بانکدارۍ څانګه",
            description:
              "په مالي مدیریت، بانکدارۍ، او پانګونې تحلیل کې تخصص لري.",
            programs: "په مالي او بانکدارۍ کې لیسانس",
          },
          {
            name: "د سوداګریز مدیریت څانګه",
            description: "د سوداګرۍ اداره، بازارموندنه، او کارآفریني پوښي.",
            programs: "په سوداګرۍ اداره کې لیسانس",
          },
          {
            name: "د احصایې څانګه",
            description:
              "د احصایوي میتودونو، د معلوماتو تحلیل، او اقتصاد سنجش باندې تمرکز کوي.",
            programs: "په احصایه کې لیسانس",
          },
        ],
      },
      history: {
        title: "زموږ تاریخ",
        content:
          "د کندهار پوهنتون د اقتصاد پوهنځی په ۲۰۰۲ کال کې د پوهنتون د پراختیا د هڅو په توګه تاسیس شو. د یوازې دوو څانګو او یو څو زده کوونکو سره پیل کیدو، پوهنځی په تیرو کلونو کې د پام وړ وده کړې ده. په ۲۰۱۰ کال کې، موږ خپل لومړی د ماسټر پروګرام معرفي کړ، او تر ۲۰۱۵ کال پورې، موږ څلورو تخصصي څانګو ته پراختیا ورکړه. د خپل تاریخ په اوږدو کې، موږ د کیفیت لرونکو زده کړو په برابرولو او د څیړنې او د ټولنې ښکیلتیا له لارې د افغانستان په اقتصادي پرمختګ کې د مرستې کولو ته ژمن پاتې شوي یو.",
      },
      contact: {
        title: "اړیکه ونیسئ",
        address: "کندهار پوهنتون، د اقتصاد پوهنځی، کندهار، افغانستان",
        phone: "+۹۳ ۷۰ ۰۰۰ ۰۰۰۰",
        email: "info@kufe.edu.af",
        visitUs: "موږ سره لیدنه وکړئ",
      },
    },
    da: {
      title: "درباره ما",
      subtitle: "درباره دانشکده اقتصاد دانشگاه کندهار بیشتر بدانید",
      overview: {
        title: "نگاه کلی دانشکده",
        content:
          "دانشکده اقتصاد دانشگاه کندهار یکی از موسسات آموزشی پیشرو در افغانستان است که به ارائه آموزش با کیفیت در زمینه های اقتصاد، مالی، مدیریت تجارت و آمار اختصاص دارد. تاسیس شده در سال ۲۰۰۲، دانشکده ما متعهد به برتری علمی و آماده سازی دانشجویان برای مشاغل موفق در بخش های اقتصادی و تجاری است.",
      },
      mission: {
        title: "ماموریت ما",
        content:
          "ارائه آموزش با کیفیت بالا در رشته های اقتصاد و تجارت، انجام تحقیقات تاثیرگذار، و کمک به توسعه اقتصادی افغانستان از طریق ایجاد و انتشار دانش.",
      },
      vision: {
        title: "چشم انداز ما",
        content:
          "شناخته شدن به عنوان مرکز برتری در آموزش و تحقیقات اقتصادی در افغانستان و منطقه، تربیت فارغ التحصیلانی که نوآور، اخلاقی و قادر به حل چالش های پیچیده اقتصادی هستند.",
      },
      values: {
        title: "ارزش های ما",
        list: [
          {
            title: "برتری علمی",
            description:
              "ما متعهد به حفظ استانداردهای بالا در تدریس، یادگیری و تحقیق هستیم.",
          },
          {
            title: "درستکاری",
            description:
              "ما اصول اخلاقی را رعایت می کنیم و صداقت و شفافیت را در تمام فعالیت های خود ترویج می دهیم.",
          },
          {
            title: "نوآوری",
            description:
              "ما تفکر خلاق و رویکردهای نوآورانه به چالش های اقتصادی را تشویق می کنیم.",
          },
          {
            title: "فراگیری",
            description:
              "ما به تنوع ارزش می دهیم و فرصت های برابر برای همه دانشجویان و کارکنان فراهم می کنیم.",
          },
        ],
      },
      dean: {
        title: "پیام رئیس دانشکده",
        name: "دکتر احمد احمدی",
        position: "رئیس، دانشکده اقتصاد",
        message:
          "به دانشکده اقتصاد دانشگاه کندهار خوش آمدید. دانشکده ما متعهد به ایجاد محیط یادگیری محرک است که در آن دانشجویان می توانند دانش و مهارت های خود را در رشته های اقتصاد و تجارت توسعه دهند. ما متعهد به برتری علمی، تحقیقات نوآورانه و مشارکت جامعه هستیم. هدف ما آماده سازی فارغ التحصیلان ما به عنوان رهبران آینده است که می توانند به توسعه اقتصادی افغانستان کمک کنند. از شما دعوت می کنم برنامه های ما را کاوش کنید و به جامعه علمی ما بپیوندید.",
        readMore: "خواندن پیام کامل",
      },
      stats: {
        title: "دانشکده در یک نگاه",
        students: "دانشجویان",
        faculty: "اعضای هیئت علمی",
        programs: "برنامه های تحصیلی",
        years: "سال های برتری",
      },
      departments: {
        title: "دیپارتمنت های ما",
        list: [
          {
            name: "دیپارتمنت اقتصاد",
            description: "تمرکز بر نظریه اقتصادی، تحلیل سیاست و اقتصاد توسعه.",
            programs: "لیسانس و ماستری در اقتصاد",
          },
          {
            name: "دیپارتمنت مالی و بانکداری",
            description: "تخصص در مدیریت مالی، بانکداری و تحلیل سرمایه گذاری.",
            programs: "لیسانس در مالی و بانکداری",
          },
          {
            name: "دیپارتمنت مدیریت تجارت",
            description: "پوشش مدیریت تجارت، بازاریابی و کارآفرینی.",
            programs: "لیسانس در مدیریت تجارت",
          },
          {
            name: "دیپارتمنت آمار",
            description: "تمرکز بر روش های آماری، تحلیل داده ها و اقتصادسنجی.",
            programs: "لیسانس در آمار",
          },
        ],
      },
      history: {
        title: "تاریخچه ما",
        content:
          "دانشکده اقتصاد دانشگاه کندهار در سال ۲۰۰۲ به عنوان بخشی از تلاش های گسترش دانشگاه تاسیس شد. با شروع تنها با دو دیپارتمنت و تعداد کمی دانشجو، دانشکده در طول سال ها به طور قابل توجهی رشد کرده است. در سال ۲۰۱۰، ما اولین برنامه ماستری خود را معرفی کردیم و تا سال ۲۰۱۵، به چهار دیپارتمنت تخصصی گسترش یافتیم. در طول تاریخ خود، ما همچنان متعهد به ارائه آموزش با کیفیت و کمک به توسعه اقتصادی افغانستان از طریق تحقیق و مشارکت جامعه بوده ایم.",
      },
      contact: {
        title: "تماس با ما",
        address: "دانشگاه کندهار، دانشکده اقتصاد، کندهار، افغانستان",
        phone: "+۹۳ ۷۰ ۰۰۰ ۰۰۰۰",
        email: "info@kufe.edu.af",
        visitUs: "از ما دیدن کنید",
      },
    },
  };

  const t = translations[language];

  const handleLanguageChange = (value) => {
    setLanguage(value);
    // In a real application, you might want to store this in localStorage or cookies
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

      {/* Main content */}
      <div className='container mx-auto px-4 py-16'>
        {/* Overview section */}
        <section className='mb-16'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold mb-6 text-slate-800 text-center'>
              {t.overview.title}
            </h2>
            <p className='text-lg text-slate-600 leading-relaxed'>
              {t.overview.content}
            </p>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className='mb-16'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <Card className='border-0 shadow-xl rounded-2xl overflow-hidden'>
              <CardContent className='p-0'>
                <div className='bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white'>
                  <BookOpen className='h-8 w-8 mb-4' />
                  <h3 className='text-xl font-bold mb-2'>{t.mission.title}</h3>
                </div>
                <div className='p-6'>
                  <p className='text-slate-600'>{t.mission.content}</p>
                </div>
              </CardContent>
            </Card>

            <Card className='border-0 shadow-xl rounded-2xl overflow-hidden'>
              <CardContent className='p-0'>
                <div className='bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-white'>
                  <Award className='h-8 w-8 mb-4' />
                  <h3 className='text-xl font-bold mb-2'>{t.vision.title}</h3>
                </div>
                <div className='p-6'>
                  <p className='text-slate-600'>{t.vision.content}</p>
                </div>
              </CardContent>
            </Card>

            <Card className='border-0 shadow-xl rounded-2xl overflow-hidden'>
              <CardContent className='p-0'>
                <div className='bg-gradient-to-br from-amber-600 to-amber-700 p-6 text-white'>
                  <Users className='h-8 w-8 mb-4' />
                  <h3 className='text-xl font-bold mb-2'>{t.values.title}</h3>
                </div>
                <div className='p-6'>
                  <ul className='space-y-3'>
                    {t.values.list.map((value, index) => (
                      <li key={index} className='flex items-start'>
                        <ChevronRight className='h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0' />
                        <div>
                          <span className='font-medium text-slate-800'>
                            {value.title}:
                          </span>{" "}
                          <span className='text-slate-600'>
                            {value.description}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Dean's Message */}
        <section className='mb-16'>
          <Card className='border-0 shadow-xl rounded-2xl overflow-hidden'>
            <CardContent className='p-0'>
              <div className='grid grid-cols-1 md:grid-cols-3'>
                <div className='bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white'>
                  <h3 className='text-2xl font-bold mb-6'>{t.dean.title}</h3>
                  <div className='mb-6'>
                    <div className='w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mx-auto flex items-center justify-center text-white text-4xl font-bold'>
                      AA
                    </div>
                  </div>
                  <div className='text-center'>
                    <h4 className='text-xl font-semibold'>{t.dean.name}</h4>
                    <p className='text-slate-300 mt-1'>{t.dean.position}</p>
                  </div>
                </div>
                <div className='md:col-span-2 p-8'>
                  <p className='text-slate-600 leading-relaxed mb-6'>
                    {t.dean.message}
                  </p>
                  <Button className='bg-slate-900 hover:bg-slate-800 text-white'>
                    {t.dean.readMore}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold mb-10 text-slate-800 text-center'>
            {t.stats.title}
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            <Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-blue-100'>
              <CardContent className='p-6 text-center'>
                <div className='text-4xl font-bold text-blue-600 mb-2'>
                  1200+
                </div>
                <div className='text-slate-700'>{t.stats.students}</div>
              </CardContent>
            </Card>
            <Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:-translate-y-1 bg-gradient-to-br from-emerald-50 to-emerald-100'>
              <CardContent className='p-6 text-center'>
                <div className='text-4xl font-bold text-emerald-600 mb-2'>
                  45+
                </div>
                <div className='text-slate-700'>{t.stats.faculty}</div>
              </CardContent>
            </Card>
            <Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:-translate-y-1 bg-gradient-to-br from-amber-50 to-amber-100'>
              <CardContent className='p-6 text-center'>
                <div className='text-4xl font-bold text-amber-600 mb-2'>8</div>
                <div className='text-slate-700'>{t.stats.programs}</div>
              </CardContent>
            </Card>
            <Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-purple-100'>
              <CardContent className='p-6 text-center'>
                <div className='text-4xl font-bold text-purple-600 mb-2'>
                  20+
                </div>
                <div className='text-slate-700'>{t.stats.years}</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Departments */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold mb-10 text-slate-800 text-center'>
            {t.departments.title}
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {t.departments.list.map((dept, index) => (
              <Card
                key={index}
                className='border-0 shadow-xl rounded-2xl overflow-hidden'
              >
                <CardContent className='p-0'>
                  <div
                    className={`bg-gradient-to-br ${
                      index === 0
                        ? "from-blue-600 to-blue-700"
                        : index === 1
                        ? "from-emerald-600 to-emerald-700"
                        : index === 2
                        ? "from-amber-600 to-amber-700"
                        : "from-purple-600 to-purple-700"
                    } p-6 text-white`}
                  >
                    <h3 className='text-xl font-bold'>{dept.name}</h3>
                  </div>
                  <div className='p-6'>
                    <p className='text-slate-600 mb-4'>{dept.description}</p>
                    <div className='flex items-center text-sm font-medium'>
                      <Calendar className='h-4 w-4 mr-2 text-slate-500' />
                      <span>{dept.programs}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* History */}
        <section className='mb-16'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold mb-6 text-slate-800 text-center'>
              {t.history.title}
            </h2>
            <Card className='border-0 shadow-xl rounded-2xl overflow-hidden'>
              <CardContent className='p-8'>
                <div className='flex flex-col md:flex-row gap-8 items-center'>
                  <div className='md:w-1/3'>
                    <div className='relative'>
                      <div className='aspect-square rounded-2xl bg-slate-200 overflow-hidden'>
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <div className='text-6xl font-bold text-slate-400'>
                            2002
                          </div>
                        </div>
                      </div>
                      <div className='absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center'>
                        <div className='text-2xl font-bold text-blue-600'>
                          20+
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='md:w-2/3'>
                    <p className='text-slate-600 leading-relaxed'>
                      {t.history.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact */}
        <section>
          <Card className='border-0 shadow-xl rounded-2xl overflow-hidden'>
            <CardContent className='p-0'>
              <div className='grid grid-cols-1 md:grid-cols-2'>
                <div className='bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white'>
                  <h3 className='text-2xl font-bold mb-6'>{t.contact.title}</h3>
                  <div className='space-y-6'>
                    <div className='flex items-start'>
                      <div className='flex-shrink-0 mt-1 bg-slate-800/50 p-2 rounded-lg'>
                        <MapPin className='h-5 w-5 text-blue-300' />
                      </div>
                      <div className='ml-4'>
                        <p className='text-slate-300'>{t.contact.address}</p>
                      </div>
                    </div>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 bg-slate-800/50 p-2 rounded-lg'>
                        <Phone className='h-5 w-5 text-blue-300' />
                      </div>
                      <div className='ml-4'>
                        <p className='text-slate-300'>{t.contact.phone}</p>
                      </div>
                    </div>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 bg-slate-800/50 p-2 rounded-lg'>
                        <Mail className='h-5 w-5 text-blue-300' />
                      </div>
                      <div className='ml-4'>
                        <p className='text-slate-300'>{t.contact.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className='mt-8'>
                    <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
                      {t.contact.visitUs}
                    </Button>
                  </div>
                </div>
                <div className='aspect-auto h-full min-h-[300px] relative'>
                  <iframe
                    src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3390.0517185453!2d65.7008!3d31.6133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDM2JzQ3LjkiTiA2NcKwNDInMDIuOSJF!5e0!3m2!1sen!2sus!4v1619099477556!5m2!1sen!2sus'
                    width='100%'
                    height='100%'
                    style={{ border: 0 }}
                    allowFullScreen=''
                    loading='lazy'
                    className='absolute inset-0'
                  ></iframe>
                </div>
              </div>
            </CardContent>
          </Card>
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
              <h3 className='text-xl font-bold mb-6 text-white'>Quick Links</h3>
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
  );
}

export default AboutPage;
