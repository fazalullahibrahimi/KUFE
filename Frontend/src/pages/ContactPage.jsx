import React from "react"
import { useState, useEffect } from "react"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"

import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Textarea } from "../components/ui/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    department: "",
    message: "",
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  console.log("Departments Data:", departments)

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("http://127.0.0.1:4400/api/v1/departments/getdepartmentName")

        if (!response.ok) {
          throw new Error("Failed to fetch departments")
        }

        const data = await response.json()
        console.log("API Response:", data)

        if (data.status === "success" && data.data && data.data.departments) {
          setDepartments(data.data.departments)
          console.log("Departments set:", data.data.departments)
        } else {
          throw new Error("Invalid data format")
        }
      } catch (err) {
        console.error("Error fetching departments:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:4400/api/v1/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      // Form submitted successfully
      setFormSubmitted(true)

      // Reset form after 3 seconds
    } catch (err) {
      console.error("Error submitting form:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (formSubmitted) {
      const timer = setTimeout(() => {
        setFormSubmitted(false)
        setFormData({
          name: "",
          email: "",
          subject: "",
          department: "",
          message: "",
        })
      }, 3000)

      return () => clearTimeout(timer) // Cleanup timer on component unmount or state change
    }
  }, [formSubmitted])

  return (
    <div className="min-h-screen bg-[#E8ECEF]">
      <Navbar />
      {/* Header */}
      <div className="pt-12 relative bg-[#1D3D6F] text-white">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="flex justify-between items-center">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 text-white">Contact Us</h1>
              <p className="mt-2 text-white text-lg md:text-xl opacity-90">
                Get in touch with the Faculty of Economics
              </p>
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

      {/* Main content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact form */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-0 shadow-xl rounded-2xl">
              <CardContent className="p-0 z-50">
                <div className="bg-white p-8 md:p-10">
                  <h2 className="text-2xl font-bold mb-8 text-[#1D3D6F] border-b pb-4 border-[#E8ECEF]">
                    Send us a message
                  </h2>
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                      <p className="font-medium">Error: {error}</p>
                      <p className="text-sm mt-1">Please try again or contact support if the issue persists.</p>
                    </div>
                  )}

                  {formSubmitted ? (
                    <div className="bg-[#E8ECEF] border border-[#1D3D6F]/20 rounded-xl p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F7B500] text-[#1D3D6F] mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium text-[#1D3D6F] mb-2">
                        Thank you! Your message has been sent successfully.
                      </h3>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="name" className="text-[#1D3D6F] font-medium">
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="border-[#E8ECEF] rounded-lg focus:border-[#1D3D6F] focus:ring focus:ring-[#1D3D6F]/20"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="email" className="text-[#1D3D6F] font-medium">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="border-[#E8ECEF] rounded-lg focus:border-[#1D3D6F] focus:ring focus:ring-[#1D3D6F]/20"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="subject" className="text-[#1D3D6F] font-medium">
                            Subject
                          </Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            className="border-[#E8ECEF] rounded-lg focus:border-[#1D3D6F] focus:ring focus:ring-[#1D3D6F]/20"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="department" className="text-[#1D3D6F] font-medium">
                            Department
                          </Label>
                          <Select
                            name="department"
                            value={formData.department ?? ""}
                            onValueChange={(value) => setFormData({ ...formData, department: value })}
                          >
                            <SelectTrigger className="border-[#E8ECEF] rounded-lg focus:border-[#1D3D6F] focus:ring focus:ring-[#1D3D6F]/20">
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-[#E8ECEF] z-50">
                              {isLoading ? (
                                <SelectItem value="" disabled>
                                  Loading departments...
                                </SelectItem>
                              ) : error ? (
                                <SelectItem value="" disabled>
                                  Error loading departments
                                </SelectItem>
                              ) : departments && departments.length > 0 ? (
                                departments.map((department, index) => (
                                  <SelectItem key={index} value={department} className="hover:bg-[#E8ECEF] rounded-md">
                                    {department}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="" disabled>
                                  No departments available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="message" className="text-[#1D3D6F] font-medium">
                          Your Message
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          className="min-h-[180px] border-[#E8ECEF] rounded-lg focus:border-[#1D3D6F] focus:ring focus:ring-[#1D3D6F]/20"
                        />
                      </div>

                      <div className="pt-2">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full md:w-auto bg-[#1D3D6F] hover:bg-[#2C4F85] text-white font-medium py-2.5 px-6 rounded-lg shadow-lg hover:shadow-[#1D3D6F]/30 transition-all duration-200"
                        >
                          {isLoading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
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

          {/* Contact information */}
          <div>
            <CardContent className="p-0">
              <div className="bg-[#1D3D6F] text-white p-8 md:p-10 rounded-lg border border-slate-200  shadow-sm ">
                <h2 className="text-2xl font-bold mb-8 border-b border-[#2C4F85] pb-4">Contact Information</h2>

                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1 bg-[#2C4F85] p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-[#F7B500]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-white">Kandahar University, Faculty of Economics, Kandahar, Afghanistan</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-[#2C4F85] p-2 rounded-lg">
                      <Phone className="h-5 w-5 text-[#F7B500]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-white">+93 70 000 0000</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-[#2C4F85] p-2 rounded-lg">
                      <Mail className="h-5 w-5 text-[#F7B500]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-white">info@kufe.edu.af</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="text-xl font-semibold mb-6 text-white">Office Hours</h3>
                  <div className="space-y-4 text-white">
                    <div className="flex items-center bg-[#2C4F85] p-3 rounded-lg">
                      <Clock className="h-5 w-5 text-[#F7B500] mr-3" />
                      <span>Monday - Thursday: 8:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex items-center bg-[#2C4F85] p-3 rounded-lg">
                      <Clock className="h-5 w-5 text-[#F7B500] mr-3" />
                      <span>Friday: Closed</span>
                    </div>
                    <div className="flex items-center bg-[#2C4F85] p-3 rounded-lg">
                      <Clock className="h-5 w-5 text-[#F7B500] mr-3" />
                      <span>Saturday - Sunday: 8:00 AM - 12:00 PM</span>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="text-xl font-semibold mb-6 text-white">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="bg-[#2C4F85] hover:bg-[#F7B500] h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-[#F7B500]/30 transform hover:-translate-y-1"
                    >
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="bg-[#2C4F85] hover:bg-[#F7B500] h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-[#F7B500]/30 transform hover:-translate-y-1"
                    >
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="bg-[#2C4F85] hover:bg-[#F7B500] h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-[#F7B500]/30 transform hover:-translate-y-1"
                    >
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153 1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="bg-[#2C4F85] hover:bg-[#F7B500] h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-[#F7B500]/30 transform hover:-translate-y-1"
                    >
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M19.7 3H4.3C3.582 3 3 3.582 3 4.3v15.4c0 .718.582 1.3 1.3 1.3h15.4c.718 0 1.3-.582 1.3-1.3V4.3c0-.718-.582-1.3-1.3-1.3zM8.339 18.338H5.667v-8.59h2.672v8.59zM7.004 8.574a1.548 1.548 0 11-.002-3.096 1.548 1.548 0 01.002 3.096zm11.335 9.764H15.67v-4.177c0-.996-.017-2.278-1.387-2.278-1.389 0-1.601 1.086-1.601 2.206v4.249h-2.667v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.779 3.203 4.092v4.711z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
      <div className="mt-12 flex justify-center items-center  w-[100%] px-4 md:px-8">
        <Card className="border-0 w-[80%] shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="relative w-full h-0 pb-[56.25%]">
              {" "}
              {/* 16:9 Aspect Ratio */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3390.0517185453!2d65.7008!3d31.6133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDM2JzQ3LjkiTiA2NcKwNDInMDIuOSJF!5e0!3m2!1sen!2sus!4v1619099477556!5m2!1sen!2sus"
                className="absolute inset-0 w-full h-full border-0 rounded-3xl"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default ContactPage
