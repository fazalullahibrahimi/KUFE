import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// UI Components
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Textarea } from "../components/ui/Textarea";

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

function ContactPage() {
  const { t, direction } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    department_id: "", // This is the field expected by the backend
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Animation refs
  const [heroRef, heroVisible] = useElementOnScreen({ threshold: 0.1 });
  const [formRef, formVisible] = useElementOnScreen({ threshold: 0.1 });
  const [infoRef, infoVisible] = useElementOnScreen({ threshold: 0.1 });
  const [mapRef, mapVisible] = useElementOnScreen({ threshold: 0.1 });

  // Fetch departments with retry logic
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log(
          `Attempting to fetch departments (attempt ${retryCount + 1})`
        );
        const response = await fetch(
          "http://localhost:4400/api/v1/departments/"
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch departments: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();
        console.log("API Response:", result);

        if (
          result.status === "success" &&
          result.data &&
          result.data.departments
        ) {
          console.log("Departments found:", result.data.departments);
          // Log each department to verify the structure
          result.data.departments.forEach((dept) => {
            console.log("Department:", dept.name, "ID:", dept._id);
          });
          setDepartments(result.data.departments);

          // Reset retry count on success
          setRetryCount(0);
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
        setError(err.message);

        // Set up fallback mock data in case of error
        const fallbackDepartments = [
          { _id: "fallback-dept-1", name: "Marketing" },
          { _id: "fallback-dept-2", name: "Finance" },
          { _id: "fallback-dept-3", name: "Management" },
        ];
        setDepartments(fallbackDepartments);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, [retryCount]);

  // Function to retry fetching departments
  const retryFetchDepartments = () => {
    setRetryCount((prev) => prev + 1);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle department selection
  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;

    // Find the selected department to store its name
    const selectedDept = departments.find((dept) => dept._id === departmentId);
    if (selectedDept) {
      setSelectedDepartmentName(selectedDept.name);
      console.log(
        `Selected department: ${selectedDept.name} with ID: ${departmentId}`
      );
    } else {
      setSelectedDepartmentName("");
    }

    // Update form data with department_id
    setFormData({
      ...formData,
      department_id: departmentId,
    });
  };

  // Form validation
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!formData.subject.trim()) {
      setError("Subject is required");
      return false;
    }

    if (!formData.message.trim()) {
      setError("Message is required");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Create a submission object that includes both ID and name for the backend
    const submissionData = {
      ...formData,
      department_name: selectedDepartmentName, // Add department name for reference
    };

    // Log form data to verify department ID is included
    console.log("Submitting form data:", submissionData);

    try {
      const response = await fetch("http://127.0.0.1:4400/api/v1/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData), // Send the enhanced data to the backend
      });

      const responseData = await response.json().catch(() => null);
      console.log("Server response:", responseData);

      if (!response.ok) {
        throw new Error(
          responseData?.message ||
            `Failed to submit form: ${response.status} ${response.statusText}`
        );
      }

      // Form submitted successfully
      setFormSubmitted(true);
      console.log("Form submitted successfully!");
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form after successful submission
  useEffect(() => {
    if (formSubmitted) {
      const timer = setTimeout(() => {
        setFormSubmitted(false);
        setFormData({
          name: "",
          email: "",
          subject: "",
          department_id: "",
          message: "",
        });
        setSelectedDepartmentName("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [formSubmitted]);

  return (
    <div
      className='min-h-screen bg-gradient-to-b from-[#E8ECEF] to-white'
      dir={direction}
    >
      <Navbar />

      {/* Hero Section with Enhanced Design */}
      <div
        ref={heroRef}
        className={`pt-16 relative bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white
          ${heroVisible ? "opacity-100 animate-fade-in-down" : "opacity-0"}`}
        style={{
          animationDelay: "0.2s",
          transition: "opacity 0.5s ease-in-out",
          minHeight: "100vh",
          height: "100vh",
          position: "relative",
        }}
      >
        {/* Static Decorative Elements - never change with language */}
        <div
          className='absolute top-0 left-0 w-full h-full overflow-hidden'
          dir='ltr'
        >
          <div className='absolute top-10 left-10 w-32 h-32 bg-[#F7B500]/10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-10 right-10 w-64 h-64 bg-[#1D3D6F]/20 rounded-full blur-3xl'></div>
          <div className='absolute top-1/2 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-xl'></div>

          {/* Static Background Pattern - never changes */}
          <div className='absolute inset-0 opacity-5' dir='ltr'>
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

        <div className='container mx-auto px-4 py-16 md:py-24 relative z-10 flex items-center h-full'>
          <div className='max-w-3xl'>
            <div className='inline-flex items-center px-3 py-1 rounded-full bg-[#F7B500]/20 text-[#F7B500] text-sm font-medium mb-6'>
              <span className='mr-2'>•</span>
              <span>{t("contact.faculty_of_economics")}</span>
            </div>
            <h1 className='text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white'>
              {t("contact.get_in_touch")}
            </h1>
            <p className='mt-4 text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed'>
              {t("contact.hero_description")}
            </p>

            <div className='mt-8 flex flex-wrap gap-4'>
              <a
                href='#contact-form'
                className='inline-flex items-center px-6 py-3 bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#F7B500]/30 transform hover:-translate-y-1'
              >
                {t("contact.send_message")}
                <ChevronRight className='ml-2 h-4 w-4' />
              </a>
              <a
                href='#map'
                className='inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-300 backdrop-blur-sm'
              >
                {t("contact.view_on_map")}
                <MapPin className='ml-2 h-4 w-4' />
              </a>
            </div>
          </div>
        </div>

        {/* Decorative wave - ALWAYS VISIBLE */}
        <div
          className='absolute bottom-0 left-0 w-full h-20 z-20'
          style={{
            bottom: "0px",
            left: "0px",
            right: "0px",
            position: "absolute",
            overflow: "visible",
          }}
        >
          <svg
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
            className='w-full h-full'
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              fill: "#E8ECEF",
            }}
          >
            <path d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0z'></path>
          </svg>
        </div>
      </div>

      {/* Main content with enhanced styling */}
      <div className='container mx-auto px-4 py-16'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
          {/* Contact form with glass morphism */}
          <div
            id='contact-form'
            ref={formRef}
            className={`lg:col-span-2 transition-all duration-700 transform
              ${
                formVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            style={{ transitionDelay: "0.3s" }}
          >
            <Card className='overflow-hidden border-0 shadow-xl rounded-2xl bg-white/80 backdrop-blur-lg'>
              <CardContent className='p-0 z-50'>
                <div className='p-8 md:p-10 relative'>
                  {/* Decorative elements */}
                  <div className='absolute top-0 right-0 w-40 h-40 bg-[#1D3D6F]/5 rounded-full blur-3xl -z-10'></div>
                  <div className='absolute bottom-0 left-0 w-60 h-60 bg-[#F7B500]/5 rounded-full blur-3xl -z-10'></div>

                  <h2 className='text-2xl font-bold mb-8 text-[#1D3D6F] border-b pb-4 border-[#E8ECEF] flex items-center'>
                    <Send
                      className={
                        direction === "rtl"
                          ? "ml-3 h-5 w-5 text-[#F7B500]"
                          : "mr-3 h-5 w-5 text-[#F7B500]"
                      }
                    />
                    {t("contact.send_us_message")}
                  </h2>

                  {error && (
                    <div className='mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg animate-fade-in flex items-start'>
                      <AlertCircle
                        className={
                          direction === "rtl"
                            ? "h-5 w-5 ml-3 mt-0.5 flex-shrink-0"
                            : "h-5 w-5 mr-3 mt-0.5 flex-shrink-0"
                        }
                      />
                      <div>
                        <p className='font-medium'>
                          {t("contact.error")}: {error}
                        </p>
                        <p className='text-sm mt-1'>
                          {t("contact.error_description")}
                        </p>
                        {error.includes("fetch departments") && (
                          <button
                            onClick={retryFetchDepartments}
                            className='mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-sm font-medium transition-colors'
                          >
                            {t("contact.retry_departments")}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {formSubmitted ? (
                    <div className='bg-[#E8ECEF]/50 backdrop-blur-sm border border-[#1D3D6F]/20 rounded-xl p-8 text-center animate-fade-in'>
                      <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F7B500] text-[#1D3D6F] mb-4 shadow-lg'>
                        <CheckCircle className='h-8 w-8' />
                      </div>
                      <h3 className='text-xl font-medium text-[#1D3D6F] mb-2'>
                        {t("contact.thank_you")}
                      </h3>
                      <p className='text-[#1D3D6F]/70'>
                        {t("contact.response_message")}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className='space-y-8'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        <div className='space-y-3 group'>
                          <Label
                            htmlFor='name'
                            className='text-[#1D3D6F] font-medium flex items-center'
                          >
                            {t("contact.full_name")}{" "}
                            <span
                              className={
                                direction === "rtl"
                                  ? "text-red-500 mr-1"
                                  : "text-red-500 ml-1"
                              }
                            >
                              *
                            </span>
                          </Label>
                          <Input
                            id='name'
                            name='name'
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className='border-[#E8ECEF] rounded-lg focus:border-[#1D3D6F] focus:ring focus:ring-[#1D3D6F]/20 transition-all duration-300 group-hover:border-[#1D3D6F]/50'
                            placeholder={t("contact.placeholder_name")}
                          />
                        </div>
                        <div className='space-y-3 group'>
                          <Label
                            htmlFor='email'
                            className='text-[#1D3D6F] font-medium flex items-center'
                          >
                            {t("contact.email_address")}{" "}
                            <span
                              className={
                                direction === "rtl"
                                  ? "text-red-500 mr-1"
                                  : "text-red-500 ml-1"
                              }
                            >
                              *
                            </span>
                          </Label>
                          <Input
                            id='email'
                            name='email'
                            type='email'
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className='border-[#E8ECEF] rounded-lg focus:border-[#1D3D6F] focus:ring focus:ring-[#1D3D6F]/20 transition-all duration-300 group-hover:border-[#1D3D6F]/50'
                            placeholder={t("contact.placeholder_email")}
                          />
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        <div className='space-y-3 group'>
                          <Label
                            htmlFor='subject'
                            className='text-[#1D3D6F] font-medium flex items-center'
                          >
                            {t("contact.subject")}{" "}
                            <span
                              className={
                                direction === "rtl"
                                  ? "text-red-500 mr-1"
                                  : "text-red-500 ml-1"
                              }
                            >
                              *
                            </span>
                          </Label>
                          <Input
                            id='subject'
                            name='subject'
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            className='border-[#E8ECEF] rounded-lg focus:border-[#1D3D6F] focus:ring focus:ring-[#1D3D6F]/20 transition-all duration-300 group-hover:border-[#1D3D6F]/50'
                            placeholder={t("contact.placeholder_subject")}
                          />
                        </div>

                        <div className='space-y-3 group'>
                          <Label
                            htmlFor='department_id'
                            className='text-[#1D3D6F] font-medium'
                          >
                            {t("contact.department")}
                          </Label>

                          {/* Department Select Component */}
                          <div className='relative'>
                            <select
                              id='department_id'
                              name='department_id'
                              value={formData.department_id}
                              onChange={handleDepartmentChange}
                              className='w-full px-3 py-2 border border-[#E8ECEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3D6F]/20 focus:border-[#1D3D6F] transition-all duration-300 bg-white'
                            >
                              <option value=''>
                                {t("contact.select_department")}
                              </option>
                              {departments.map((dept) => (
                                <option key={dept._id} value={dept._id}>
                                  {dept.name}
                                </option>
                              ))}
                            </select>
                            <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                              <svg
                                className='w-4 h-4 text-gray-400'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth='2'
                                  d='M19 9l-7 7-7-7'
                                ></path>
                              </svg>
                            </div>
                          </div>

                          {selectedDepartmentName && (
                            <p className='text-xs text-green-600 mt-1'>
                              {t("contact.selected")}: {selectedDepartmentName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className='space-y-3 group'>
                        <Label
                          htmlFor='message'
                          className='text-[#1D3D6F] font-medium flex items-center'
                        >
                          {t("contact.your_message")}{" "}
                          <span
                            className={
                              direction === "rtl"
                                ? "text-red-500 mr-1"
                                : "text-red-500 ml-1"
                            }
                          >
                            *
                          </span>
                        </Label>
                        <Textarea
                          id='message'
                          name='message'
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          className='min-h-[180px] border-[#E8ECEF] rounded-lg focus:border-[#1D3D6F] focus:ring focus:ring-[#1D3D6F]/20 transition-all duration-300 group-hover:border-[#1D3D6F]/50'
                          placeholder={t("contact.placeholder_message")}
                        />
                      </div>

                      <div className='pt-2'>
                        <Button
                          type='submit'
                          disabled={isLoading}
                          className='w-full md:w-auto bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] hover:from-[#2C4F85] hover:to-[#1D3D6F] text-white font-medium py-3 px-8 rounded-lg shadow-lg hover:shadow-[#1D3D6F]/30 transition-all duration-300 transform hover:-translate-y-1'
                        >
                          {isLoading ? (
                            <>
                              <svg
                                className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                              >
                                <circle
                                  className='opacity-25'
                                  cx='12'
                                  cy='12'
                                  r='10'
                                  stroke='currentColor'
                                  strokeWidth='4'
                                ></circle>
                                <path
                                  className='opacity-75'
                                  fill='currentColor'
                                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                ></path>
                              </svg>
                              {t("contact.sending")}
                            </>
                          ) : (
                            <>
                              <Send
                                className={
                                  direction === "rtl"
                                    ? "ml-2 h-4 w-4"
                                    : "mr-2 h-4 w-4"
                                }
                              />
                              {t("contact.send_message_btn")}
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact information with enhanced styling */}
          <div
            ref={infoRef}
            className={`transition-all duration-700 transform
              ${
                infoVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            style={{ transitionDelay: "0.5s" }}
          >
            <Card className='overflow-hidden border-0 shadow-xl rounded-2xl h-full'>
              <CardContent className='p-0 h-full'>
                <div className='bg-gradient-to-br from-[#1D3D6F] to-[#2C4F85] text-white p-8 md:p-10 rounded-2xl h-full relative overflow-hidden'>
                  {/* Decorative elements */}
                  <div className='absolute top-0 right-0 w-40 h-40 bg-[#F7B500]/10 rounded-full blur-3xl'></div>
                  <div className='absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-3xl'></div>

                  <h2 className='text-2xl font-bold mb-8 border-b border-[#2C4F85]/50 pb-4 flex items-center'>
                    <Mail
                      className={
                        direction === "rtl"
                          ? "ml-3 h-5 w-5 text-[#F7B500]"
                          : "mr-3 h-5 w-5 text-[#F7B500]"
                      }
                    />
                    {t("contact.contact_information")}
                  </h2>

                  <div className='space-y-8 relative z-10'>
                    <div className='flex items-start group'>
                      <div className='flex-shrink-0 mt-1 bg-[#2C4F85] p-3 rounded-lg shadow-lg group-hover:bg-[#F7B500] group-hover:text-[#1D3D6F] transition-all duration-300'>
                        <MapPin className='h-5 w-5 text-[#F7B500] group-hover:text-[#1D3D6F]' />
                      </div>
                      <div className={direction === "rtl" ? "mr-4" : "ml-4"}>
                        <h3 className='text-[#F7B500] font-medium mb-1'>
                          {t("contact.our_location")}
                        </h3>
                        <p className='text-white/90'>
                          {t("contact.university_address")}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-start group'>
                      <div className='flex-shrink-0 mt-1 bg-[#2C4F85] p-3 rounded-lg shadow-lg group-hover:bg-[#F7B500] group-hover:text-[#1D3D6F] transition-all duration-300'>
                        <Phone className='h-5 w-5 text-[#F7B500] group-hover:text-[#1D3D6F]' />
                      </div>
                      <div className={direction === "rtl" ? "mr-4" : "ml-4"}>
                        <h3 className='text-[#F7B500] font-medium mb-1'>
                          {t("contact.phone_number")}
                        </h3>
                        <p className='text-white/90'>+93 70 000 0000</p>
                        <p className='text-white/70 text-sm mt-1'>
                          {t("contact.phone_hours")}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-start group'>
                      <div className='flex-shrink-0 mt-1 bg-[#2C4F85] p-3 rounded-lg shadow-lg group-hover:bg-[#F7B500] group-hover:text-[#1D3D6F] transition-all duration-300'>
                        <Mail className='h-5 w-5 text-[#F7B500] group-hover:text-[#1D3D6F]' />
                      </div>
                      <div className={direction === "rtl" ? "mr-4" : "ml-4"}>
                        <h3 className='text-[#F7B500] font-medium mb-1'>
                          {t("contact.email_address_label")}
                        </h3>
                        <p className='text-white/90'>info@kufe.edu.af</p>
                        <p className='text-white/70 text-sm mt-1'>
                          {t("contact.email_response")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='mt-10 relative z-10'>
                    <h3 className='text-xl font-semibold mb-6 text-white flex items-center'>
                      <Clock
                        className={
                          direction === "rtl"
                            ? "ml-3 h-5 w-5 text-[#F7B500]"
                            : "mr-3 h-5 w-5 text-[#F7B500]"
                        }
                      />
                      {t("contact.office_hours")}
                    </h3>
                    <div className='space-y-4 text-white'>
                      <div className='flex items-center bg-[#2C4F85]/50 backdrop-blur-sm p-4 rounded-lg hover:bg-[#2C4F85]/70 transition-colors duration-300 group'>
                        <div
                          className={
                            direction === "rtl"
                              ? "p-2 bg-[#F7B500]/20 rounded-lg ml-3"
                              : "p-2 bg-[#F7B500]/20 rounded-lg mr-3"
                          }
                        >
                          <Clock className='h-5 w-5 text-[#F7B500]' />
                        </div>
                        <span>{t("contact.monday_thursday")}</span>
                      </div>
                      <div className='flex items-center bg-[#2C4F85]/50 backdrop-blur-sm p-4 rounded-lg hover:bg-[#2C4F85]/70 transition-colors duration-300 group'>
                        <div
                          className={
                            direction === "rtl"
                              ? "p-2 bg-[#F7B500]/20 rounded-lg ml-3"
                              : "p-2 bg-[#F7B500]/20 rounded-lg mr-3"
                          }
                        >
                          <Clock className='h-5 w-5 text-[#F7B500]' />
                        </div>
                        <span>{t("contact.friday")}</span>
                      </div>
                      <div className='flex items-center bg-[#2C4F85]/50 backdrop-blur-sm p-4 rounded-lg hover:bg-[#2C4F85]/70 transition-colors duration-300 group'>
                        <div
                          className={
                            direction === "rtl"
                              ? "p-2 bg-[#F7B500]/20 rounded-lg ml-3"
                              : "p-2 bg-[#F7B500]/20 rounded-lg mr-3"
                          }
                        >
                          <Clock className='h-5 w-5 text-[#F7B500]' />
                        </div>
                        <span>{t("contact.saturday_sunday")}</span>
                      </div>
                    </div>
                  </div>

                  <div className='mt-10 relative z-10'>
                    <h3 className='text-xl font-semibold mb-6 text-white'>
                      {t("contact.follow_us")}
                    </h3>
                    <div className='flex space-x-4'>
                      <a
                        href='#'
                        className='bg-[#2C4F85]/70 hover:bg-[#F7B500] h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-[#F7B500]/30 transform hover:-translate-y-1'
                        aria-label='Facebook'
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
                        className='bg-[#2C4F85]/70 hover:bg-[#F7B500] h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-[#F7B500]/30 transform hover:-translate-y-1'
                        aria-label='Twitter'
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
                        className='bg-[#2C4F85]/70 hover:bg-[#F7B500] h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-[#F7B500]/30 transform hover:-translate-y-1'
                        aria-label='Instagram'
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
                        className='bg-[#2C4F85]/70 hover:bg-[#F7B500] h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-[#F7B500]/30 transform hover:-translate-y-1'
                        aria-label='LinkedIn'
                      >
                        <svg
                          className='h-5 w-5 text-white'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                          aria-hidden='true'
                        >
                          <path
                            fillRule='evenodd'
                            d='M19.7 3H4.3C3.582 3 3 3.582 3 4.3v15.4c0 .718.582 1.3 1.3 1.3h15.4c.718 0 1.3-.582 1.3-1.3V4.3c0-.718-.582-1.3-1.3-1.3zM8.339 18.338H5.667v-8.59h2.672v8.59zM7.004 8.574a1.548 1.548 0 11-.002-3.096 1.548 1.548 0 01.002 3.096zm11.335 9.764H15.67v-4.177c0-.996-.017-2.278-1.387-2.278-1.389 0-1.601 1.086-1.601 2.206v4.249h-2.667v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.779 3.203 4.092v4.711z'
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Google Maps Section with Enhanced Styling */}
      <div
        id='map'
        ref={mapRef}
        className={`mt-12 container mx-auto px-4 md:px-8 mb-16 transition-all duration-700 transform
          ${
            mapVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        style={{ transitionDelay: "0.7s" }}
      >
        <div className='text-center mb-10'>
          <h2 className='text-3xl font-bold text-[#1D3D6F] mb-4'>
            {t("contact.find_us_map")}
          </h2>
          <div className='w-20 h-1 bg-[#F7B500] mx-auto rounded-full'></div>
          <p className='mt-4 text-[#1D3D6F]/70 max-w-2xl mx-auto'>
            {t("contact.map_description")}
          </p>
        </div>

        <Card className='border-0 shadow-2xl rounded-3xl overflow-hidden transform hover:scale-[1.01] transition-all duration-500'>
          <CardContent className='p-0'>
            <div className='relative w-full h-0 pb-[56.25%]'>
              {/* 16:9 Aspect Ratio */}
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3390.0517185453!2d65.7008!3d31.6133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDM2JzQ3LjkiTiA2NcKwNDInMDIuOSJF!5e0!3m2!1sen!2sus!4v1619099477556!5m2!1sen!2sus'
                className='absolute inset-0 w-full h-full border-0 rounded-3xl'
                allowFullScreen=''
                loading='lazy'
                title='Kandahar University Map'
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>

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

export default ContactPage;
