import React from "react";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Globe, Send } from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Textarea } from "../components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";

function ContactPage() {
  const [language, setLanguage] = useState("en");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    department: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const translations = {
    en: {
      title: "Contact Us",
      subtitle: "Get in touch with the Faculty of Economics",
      formTitle: "Send us a message",
      name: "Full Name",
      email: "Email Address",
      subject: "Subject",
      department: "Department",
      message: "Your Message",
      submit: "Send Message",
      departments: {
        select: "Select Department",
        economics: "Economics",
        finance: "Finance & Banking",
        management: "Business Management",
        statistics: "Statistics",
      },
      contactInfo: "Contact Information",
      address:
        "Kandahar University, Faculty of Economics, Kandahar, Afghanistan",
      phone: "+93 70 000 0000",
      email: "info@kufe.edu.af",
      officeHours: "Office Hours",
      weekdays: "Monday - Thursday: 8:00 AM - 4:00 PM",
      friday: "Friday: Closed",
      weekend: "Saturday - Sunday: 8:00 AM - 12:00 PM",
      socialMedia: "Follow Us",
      departments: "Departments",
      successMessage: "Thank you! Your message has been sent successfully.",
    },
    ps: {
      title: "زمونږ سره اړیکه ونیسئ",
      subtitle: "د اقتصاد پوهنځي سره اړیکه ونیسئ",
      formTitle: "موږ ته پیغام ولیږئ",
      name: "بشپړ نوم",
      email: "بریښنالیک پته",
      subject: "موضوع",
      department: "څانګه",
      message: "ستاسو پیغام",
      submit: "پیغام ولیږئ",
      departments: {
        select: "څانګه وټاکئ",
        economics: "اقتصاد",
        finance: "مالي او بانکداري",
        management: "سوداګریز مدیریت",
        statistics: "احصایه",
      },
      contactInfo: "د اړیکې معلومات",
      address: "کندهار پوهنتون، د اقتصاد پوهنځی، کندهار، افغانستان",
      phone: "+۹۳ ۷۰ ۰۰۰ ۰۰۰۰",
      email: "info@kufe.edu.af",
      officeHours: "د دفتر ساعتونه",
      weekdays: "دوشنبه - پنجشنبه: ۸:۰۰ سهار - ۴:۰۰ ماښام",
      friday: "جمعه: تړلی",
      weekend: "شنبه - یکشنبه: ۸:۰۰ سهار - ۱۲:۰۰ غرمه",
      socialMedia: "موږ تعقیب کړئ",
      departments: "څانګې",
      successMessage: "مننه! ستاسو پیغام په بریالیتوب سره ولیږل شو.",
    },
    da: {
      title: "با ما تماس بگیرید",
      subtitle: "با دانشکده اقتصاد تماس بگیرید",
      formTitle: "به ما پیام بفرستید",
      name: "نام کامل",
      email: "آدرس ایمیل",
      subject: "موضوع",
      department: "دیپارتمنت",
      message: "پیام شما",
      submit: "ارسال پیام",
      departments: {
        select: "دیپارتمنت را انتخاب کنید",
        economics: "اقتصاد",
        finance: "مالی و بانکداری",
        management: "مدیریت تجارت",
        statistics: "آمار",
      },
      contactInfo: "ا��لاعات تماس",
      address: "دانشگاه کندهار، دانشکده اقتصاد، کندهار، افغانستان",
      phone: "+۹۳ ۷۰ ۰۰۰ ۰۰۰۰",
      email: "info@kufe.edu.af",
      officeHours: "ساعات کاری",
      weekdays: "دوشنبه - پنجشنبه: ۸:۰۰ صبح - ۴:۰۰ بعد از ظهر",
      friday: "جمعه: تعطیل",
      weekend: "شنبه - یکشنبه: ۸:۰۰ صبح - ۱۲:۰۰ ظهر",
      socialMedia: "ما را دنبال کنید",
      departments: "دیپارتمنت ها",
      successMessage: "تشکر! پیام شما با موفقیت ارسال شد.",
    },
  };

  const t = translations[language];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setFormSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        department: "",
        message: "",
      });
    }, 3000);
  };

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
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
          {/* Contact form */}
          <div className='lg:col-span-2'>
            <Card className='overflow-hidden border-0 shadow-xl rounded-2xl'>
              <CardContent className='p-0'>
                <div className='bg-white p-8 md:p-10'>
                  <h2 className='text-2xl font-bold mb-8 text-slate-800 border-b pb-4 border-slate-100'>
                    {t.formTitle}
                  </h2>

                  {formSubmitted ? (
                    <div className='bg-green-50 border border-green-200 rounded-xl p-8 text-center'>
                      <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-8 w-8'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M5 13l4 4L19 7'
                          />
                        </svg>
                      </div>
                      <h3 className='text-xl font-medium text-green-800 mb-2'>
                        {t.successMessage}
                      </h3>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className='space-y-8'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        <div className='space-y-3'>
                          <Label
                            htmlFor='name'
                            className='text-slate-700 font-medium'
                          >
                            {t.name}
                          </Label>
                          <Input
                            id='name'
                            name='name'
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className='border-slate-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200'
                          />
                        </div>
                        <div className='space-y-3'>
                          <Label
                            htmlFor='email'
                            className='text-slate-700 font-medium'
                          >
                            {t.email}
                          </Label>
                          <Input
                            id='email'
                            name='email'
                            type='email'
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className='border-slate-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200'
                          />
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        <div className='space-y-3'>
                          <Label
                            htmlFor='subject'
                            className='text-slate-700 font-medium'
                          >
                            {t.subject}
                          </Label>
                          <Input
                            id='subject'
                            name='subject'
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            className='border-slate-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200'
                          />
                        </div>
                        <div className='space-y-3'>
                          <Label
                            htmlFor='department'
                            className='text-slate-700 font-medium'
                          >
                            {t.department}
                          </Label>
                          <Select
                            name='department'
                            value={formData.department}
                            onValueChange={(value) =>
                              setFormData({ ...formData, department: value })
                            }
                          >
                            <SelectTrigger className='border-slate-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200'>
                              <SelectValue placeholder={t.departments.select} />
                            </SelectTrigger>
                            <SelectContent className='bg-white border border-slate-200 shadow-lg rounded-lg'>
                              <SelectItem
                                value='economics'
                                className='hover:bg-slate-50 rounded-md'
                              >
                                {t.departments.economics}
                              </SelectItem>
                              <SelectItem
                                value='finance'
                                className='hover:bg-slate-50 rounded-md'
                              >
                                {t.departments.finance}
                              </SelectItem>
                              <SelectItem
                                value='management'
                                className='hover:bg-slate-50 rounded-md'
                              >
                                {t.departments.management}
                              </SelectItem>
                              <SelectItem
                                value='statistics'
                                className='hover:bg-slate-50 rounded-md'
                              >
                                {t.departments.statistics}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className='space-y-3'>
                        <Label
                          htmlFor='message'
                          className='text-slate-700 font-medium'
                        >
                          {t.message}
                        </Label>
                        <Textarea
                          id='message'
                          name='message'
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          className='min-h-[180px] border-slate-200 rounded-lg focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200'
                        />
                      </div>

                      <div className='pt-2'>
                        <Button
                          type='submit'
                          className='w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 px-6 rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-200'
                        >
                          <Send className='mr-2 h-4 w-4' />
                          {t.submit}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact information */}
          <div>
            <Card className='overflow-hidden border-0 shadow-xl rounded-2xl'>
              <CardContent className='p-0'>
                <div className='bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 md:p-10'>
                  <h2 className='text-2xl font-bold mb-8 border-b border-slate-700/50 pb-4'>
                    {t.contactInfo}
                  </h2>

                  <div className='space-y-8'>
                    <div className='flex items-start'>
                      <div className='flex-shrink-0 mt-1 bg-slate-800/50 p-2 rounded-lg'>
                        <MapPin className='h-5 w-5 text-blue-300' />
                      </div>
                      <div className='ml-4'>
                        <p className='text-slate-300'>{t.address}</p>
                      </div>
                    </div>

                    <div className='flex items-center'>
                      <div className='flex-shrink-0 bg-slate-800/50 p-2 rounded-lg'>
                        <Phone className='h-5 w-5 text-blue-300' />
                      </div>
                      <div className='ml-4'>
                        <p className='text-slate-300'>{t.phone}</p>
                      </div>
                    </div>

                    <div className='flex items-center'>
                      <div className='flex-shrink-0 bg-slate-800/50 p-2 rounded-lg'>
                        <Mail className='h-5 w-5 text-blue-300' />
                      </div>
                      <div className='ml-4'>
                        <p className='text-slate-300'>{t.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className='mt-10'>
                    <h3 className='text-xl font-semibold mb-6 text-white'>
                      {t.officeHours}
                    </h3>
                    <div className='space-y-4 text-slate-300'>
                      <div className='flex items-center bg-slate-800/50 p-3 rounded-lg'>
                        <Clock className='h-5 w-5 text-blue-300 mr-3' />
                        <span>{t.weekdays}</span>
                      </div>
                      <div className='flex items-center bg-slate-800/50 p-3 rounded-lg'>
                        <Clock className='h-5 w-5 text-blue-300 mr-3' />
                        <span>{t.friday}</span>
                      </div>
                      <div className='flex items-center bg-slate-800/50 p-3 rounded-lg'>
                        <Clock className='h-5 w-5 text-blue-300 mr-3' />
                        <span>{t.weekend}</span>
                      </div>
                    </div>
                  </div>

                  <div className='mt-10'>
                    <h3 className='text-xl font-semibold mb-6 text-white'>
                      {t.socialMedia}
                    </h3>
                    <div className='flex space-x-4'>
                      <a
                        href='#'
                        className='bg-slate-800 hover:bg-blue-600 h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1'
                      >
                        <svg
                          className='h-5 w-5 text-white'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                          aria-hidden='true'
                        >
                          <path
                            fillRule='evenodd'
                            d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </a>
                      <a
                        href='#'
                        className='bg-slate-800 hover:bg-blue-600 h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1'
                      >
                        <svg
                          className='h-5 w-5 text-white'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                          aria-hidden='true'
                        >
                          <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
                        </svg>
                      </a>
                      <a
                        href='#'
                        className='bg-slate-800 hover:bg-blue-600 h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1'
                      >
                        <svg
                          className='h-5 w-5 text-white'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                          aria-hidden='true'
                        >
                          <path
                            fillRule='evenodd'
                            d='M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </a>
                      <a
                        href='#'
                        className='bg-slate-800 hover:bg-blue-600 h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1'
                      >
                        <svg
                          className='h-5 w-5 text-white'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                          aria-hidden='true'
                        >
                          <path
                            fillRule='evenodd'
                            d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <div className='mt-8'>
              <Card className='overflow-hidden border-0 shadow-xl rounded-2xl'>
                <CardContent className='p-0'>
                  <div className='aspect-video relative rounded-2xl overflow-hidden'>
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Departments section */}
        <div className='mt-20'>
          <h2 className='text-3xl font-bold mb-10 text-center text-slate-800'>
            {t.departments}
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {[
              {
                name: t.departments.economics,
                email: "economics@kufe.edu.af",
                phone: "+93 70 000 0001",
              },
              {
                name: t.departments.finance,
                email: "finance@kufe.edu.af",
                phone: "+93 70 000 0002",
              },
              {
                name: t.departments.management,
                email: "management@kufe.edu.af",
                phone: "+93 70 000 0003",
              },
              {
                name: t.departments.statistics,
                email: "statistics@kufe.edu.af",
                phone: "+93 70 000 0004",
              },
            ].map((dept, index) => (
              <Card
                key={index}
                className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:-translate-y-1'
              >
                <CardContent className='p-6 md:p-8'>
                  <h3 className='text-xl font-semibold mb-4 text-slate-800'>
                    {dept.name}
                  </h3>
                  <div className='space-y-4 text-slate-600'>
                    <div className='flex items-center'>
                      <Mail className='h-5 w-5 text-blue-500 mr-3' />
                      <span>{dept.email}</span>
                    </div>
                    <div className='flex items-center'>
                      <Phone className='h-5 w-5 text-blue-500 mr-3' />
                      <span>{dept.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
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
                    href='/research'
                    className='hover:text-blue-300 transition-colors flex items-center'
                  >
                    <span className='bg-slate-800 h-1.5 w-1.5 rounded-full mr-2'></span>
                    Research
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

export default ContactPage;
