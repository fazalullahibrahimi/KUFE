import React from "react";
import {
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
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AboutPage() {
  return (
    <div className='min-h-screen bg-[#E8ECEF]'>
      <Navbar />
      {/* Header */}
      <div className='pt-12 relative bg-[#1D3D6F] text-white'>
        <div className='container mx-auto px-4 py-10 md:py-16'>
          <div className='flex justify-between items-center'>
            <div className='max-w-2xl'>
              <h1 className='text-3xl md:text-5xl font-bold tracking-tight mb-2 text-white'>
                About Us
              </h1>
              <p className='mt-2 text-white text-lg md:text-xl opacity-90'>
                Learn about the Faculty of Economics at Kandahar University
              </p>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className='absolute bottom-0 left-0 right-0 h-12 overflow-hidden'>
          <svg
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
            className='absolute bottom-0 left-0 w-full h-full text-[#E8ECEF] fill-current'
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
            <h2 className='text-3xl font-bold mb-6 text-[#1D3D6F] text-center'>
              Faculty Overview
            </h2>
            <p className='text-lg text-[#1D3D6F] leading-relaxed'>
              The Faculty of Economics at Kandahar University is one of the
              leading educational institutions in Afghanistan dedicated to
              providing quality education in economics, finance, business
              management, and statistics. Established in 2002, our faculty has
              been committed to academic excellence and preparing students for
              successful careers in the economic and business sectors.
            </p>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className='mb-16'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <Card className='border-0 shadow-xl rounded-2xl overflow-hidden'>
              <CardContent className='p-0'>
                <div className='bg-[#1D3D6F] p-6 text-white'>
                  <BookOpen className='h-8 w-8 mb-4 text-[#F7B500]' />
                  <h3 className='text-xl font-bold mb-2'>Our Mission</h3>
                </div>
                <div className='p-6 bg-white'>
                  <p className='text-[#1D3D6F]'>
                    To provide high-quality education in economics and business
                    disciplines, conduct impactful research, and contribute to
                    the economic development of Afghanistan through knowledge
                    creation and dissemination.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className='border-0 shadow-xl rounded-2xl overflow-hidden'>
              <CardContent className='p-0'>
                <div className='bg-[#1D3D6F] p-6 text-white'>
                  <Award className='h-8 w-8 mb-4 text-[#F7B500]' />
                  <h3 className='text-xl font-bold mb-2'>Our Vision</h3>
                </div>
                <div className='p-6 bg-white'>
                  <p className='text-[#1D3D6F]'>
                    To be recognized as a center of excellence in economics
                    education and research in Afghanistan and the region,
                    producing graduates who are innovative, ethical, and capable
                    of addressing complex economic challenges.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className='border-0 shadow-xl rounded-2xl overflow-hidden'>
              <CardContent className='p-0'>
                <div className='bg-[#1D3D6F] p-6 text-white'>
                  <Users className='h-8 w-8 mb-4 text-[#F7B500]' />
                  <h3 className='text-xl font-bold mb-2'>Our Values</h3>
                </div>
                <div className='p-6 bg-white'>
                  <ul className='space-y-3'>
                    {[
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
                    ].map((value, index) => (
                      <li key={index} className='flex items-start'>
                        <ChevronRight className='h-5 w-5 text-[#F7B500] mt-0.5 mr-2 flex-shrink-0' />
                        <div>
                          <span className='font-medium text-[#1D3D6F]'>
                            {value.title}:
                          </span>{" "}
                          <span className='text-[#1D3D6F]'>
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
                <div className='bg-[#1D3D6F] p-8 text-white'>
                  <h3 className='text-2xl font-bold mb-6'>Dean's Message</h3>
                  <div className='mb-6'>
                    <div className='w-32 h-32 rounded-full bg-white border-4 border-[#F7B500] mx-auto flex items-center justify-center text-4xl font-bold text-[#1D3D6F]'>
                      AA
                    </div>
                  </div>
                  <div className='text-center'>
                    <h4 className='text-xl font-semibold'>Dr. Ahmad Ahmadi</h4>
                    <p className='text-white mt-1 opacity-80'>
                      Dean, Faculty of Economics
                    </p>
                  </div>
                </div>
                <div className='md:col-span-2 p-8 bg-white'>
                  <p className='text-[#1D3D6F] leading-relaxed mb-6'>
                    Welcome to the Faculty of Economics at Kandahar University.
                    Our faculty is dedicated to providing a stimulating learning
                    environment where students can develop their knowledge and
                    skills in economics and business disciplines. We are
                    committed to academic excellence, innovative research, and
                    community engagement. Our goal is to prepare our graduates
                    to become future leaders who can contribute to the economic
                    development of Afghanistan. I invite you to explore our
                    programs and join our academic community.
                  </p>
                  <Button className='bg-[#1D3D6F] hover:bg-[#2C4F85] text-white'>
                    Read Full Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold mb-10 text-[#1D3D6F] text-center'>
            Faculty at a Glance
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            <Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:-translate-y-1 bg-white'>
              <CardContent className='p-6 text-center'>
                <div className='text-4xl font-bold text-[#1D3D6F] mb-2'>
                  1200+
                </div>
                <div className='text-[#1D3D6F]'>Students</div>
              </CardContent>
            </Card>
            <Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:-translate-y-1 bg-white'>
              <CardContent className='p-6 text-center'>
                <div className='text-4xl font-bold text-[#1D3D6F] mb-2'>
                  45+
                </div>
                <div className='text-[#1D3D6F]'>Faculty Members</div>
              </CardContent>
            </Card>
            <Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:-translate-y-1 bg-white'>
              <CardContent className='p-6 text-center'>
                <div className='text-4xl font-bold text-[#1D3D6F] mb-2'>8</div>
                <div className='text-[#1D3D6F]'>Academic Programs</div>
              </CardContent>
            </Card>
            <Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:-translate-y-1 bg-white'>
              <CardContent className='p-6 text-center'>
                <div className='text-4xl font-bold text-[#1D3D6F] mb-2'>
                  20+
                </div>
                <div className='text-[#1D3D6F]'>Years of Excellence</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Departments */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold mb-10 text-[#1D3D6F] text-center'>
            Our Departments
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {[
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
            ].map((dept, index) => (
              <Card
                key={index}
                className='border-0 shadow-xl rounded-2xl overflow-hidden'
              >
                <CardContent className='p-0'>
                  <div className='bg-[#1D3D6F] p-6 text-white'>
                    <h3 className='text-xl font-bold'>{dept.name}</h3>
                  </div>
                  <div className='p-6 bg-white'>
                    <p className='text-[#1D3D6F] mb-4'>{dept.description}</p>
                    <div className='flex items-center text-sm font-medium'>
                      <Calendar className='h-4 w-4 mr-2 text-[#F7B500]' />
                      <span className='text-[#1D3D6F]'>{dept.programs}</span>
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
            <h2 className='text-3xl font-bold mb-6 text-[#1D3D6F] text-center'>
              Our History
            </h2>
            <Card className='border-0 shadow-xl rounded-2xl overflow-hidden'>
              <CardContent className='p-8 bg-white'>
                <div className='flex flex-col md:flex-row gap-8 items-center'>
                  <div className='md:w-1/3'>
                    <div className='relative'>
                      <div className='aspect-square rounded-2xl bg-[#E8ECEF] overflow-hidden'>
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <div className='text-6xl font-bold text-[#1D3D6F]'>
                            2002
                          </div>
                        </div>
                      </div>
                      <div className='absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-[#F7B500] flex items-center justify-center'>
                        <div className='text-2xl font-bold text-[#1D3D6F]'>
                          20+
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='md:w-2/3'>
                    <p className='text-[#1D3D6F] leading-relaxed'>
                      The Faculty of Economics at Kandahar University was
                      established in 2002 as part of the university's expansion
                      efforts. Starting with just two departments and a handful
                      of students, the faculty has grown significantly over the
                      years. In 2010, we introduced our first Master's program,
                      and by 2015, we had expanded to four specialized
                      departments. Throughout our history, we have remained
                      committed to providing quality education and contributing
                      to Afghanistan's economic development through research and
                      community engagement.
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
                <div className='bg-[#1D3D6F] p-8 text-white'>
                  <h3 className='text-2xl font-bold mb-6'>Contact Us</h3>
                  <div className='space-y-6'>
                    <div className='flex items-start'>
                      <div className='flex-shrink-0 mt-1 bg-[#2C4F85] p-2 rounded-lg'>
                        <MapPin className='h-5 w-5 text-[#F7B500]' />
                      </div>
                      <div className='ml-4'>
                        <p className='text-white'>
                          Kandahar University, Faculty of Economics, Kandahar,
                          Afghanistan
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 bg-[#2C4F85] p-2 rounded-lg'>
                        <Phone className='h-5 w-5 text-[#F7B500]' />
                      </div>
                      <div className='ml-4'>
                        <p className='text-white'>+93 70 000 0000</p>
                      </div>
                    </div>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 bg-[#2C4F85] p-2 rounded-lg'>
                        <Mail className='h-5 w-5 text-[#F7B500]' />
                      </div>
                      <div className='ml-4'>
                        <p className='text-white'>info@kufe.edu.af</p>
                      </div>
                    </div>
                  </div>
                  <div className='mt-8'>
                    <Button className='bg-[#F7B500] hover:bg-[#F7B500]/90 text-[#1D3D6F] font-bold'>
                      Visit Us
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
      <Footer />
    </div>
  );
}

export default AboutPage;
