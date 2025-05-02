import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ChevronUp,
  ExternalLink,
  Calendar,
  BookOpen,
  Users,
  GraduationCap,
  Award,
  FileText,
  Send,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    // Simple email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Here you would typically send this to your API
    console.log("Subscribing email:", email);
    setSubscribed(true);
    setEmailError("");
    setEmail("");

    // Reset subscription message after 5 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className='relative bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white'>
      {/* Decorative top border */}
      <div className='absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F4B400] via-[#F7B500] to-[#F4B400]'></div>

      {/* Subtle pattern overlay */}
      <div className='absolute inset-0 opacity-5'></div>

      <div className='container mx-auto px-4 py-16 relative z-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
          {/* University Info */}
          <div className='space-y-6'>
            <div className='flex items-center space-x-3'>
              <div className='h-10 w-10 rounded-full bg-gradient-to-r from-[#F4B400] to-[#F7B500] flex items-center justify-center'>
                <GraduationCap className='h-6 w-6 text-[#1D3D6F]' />
              </div>
              <h3 className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#F7B500]'>
                KUFE
              </h3>
            </div>

            <p className='text-[#E8ECEF] leading-relaxed'>
              Kandahar University Faculty of Economics provides quality
              education in economics, finance, business management, and
              statistics, preparing students for leadership roles in
              Afghanistan's economic development.
            </p>

            {/* Social Media Links */}
            <div className='flex space-x-4'>
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Youtube, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className='h-9 w-9 rounded-full bg-white/10 hover:bg-[#F7B500] hover:text-[#1D3D6F] flex items-center justify-center transition-all duration-300 group'
                  aria-label={`Visit our ${social.icon.name} page`}
                >
                  <social.icon className='h-4 w-4 transition-transform duration-300 group-hover:scale-110' />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-6'>
            <div className='flex items-center space-x-2'>
              <div className='h-1 w-6 bg-[#F7B500] rounded-full'></div>
              <h3 className='text-xl font-bold text-white'>Quick Links</h3>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3'>
              {[
                { name: "Home", href: "/", icon: BookOpen },
                { name: "About Us", href: "/about", icon: Users },
                { name: "Academics", href: "/academics", icon: GraduationCap },
                { name: "Research", href: "/research", icon: FileText },
                { name: "Events", href: "/events", icon: Calendar },
                { name: "Faculty", href: "/faculty", icon: Award },
                { name: "Contact", href: "/contact", icon: Mail },
                { name: "Student Portal", href: "/portal", icon: ExternalLink },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className='hover:text-[#F7B500] transition-colors flex items-center group'
                >
                  <span className='bg-[#F7B500]/20 h-6 w-6 rounded-full flex items-center justify-center mr-2 group-hover:bg-[#F7B500]/30 transition-colors'>
                    <link.icon className='h-3 w-3 text-[#F7B500]' />
                  </span>
                  <span className='text-[#E8ECEF] group-hover:text-[#F7B500] transition-colors'>
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className='space-y-6'>
            <div className='flex items-center space-x-2'>
              <div className='h-1 w-6 bg-[#F7B500] rounded-full'></div>
              <h3 className='text-xl font-bold text-white'>Contact Us</h3>
            </div>

            <ul className='space-y-5 text-[#E8ECEF]'>
              <li className='flex items-start'>
                <MapPin className='h-5 w-5 text-[#F7B500] mr-3 mt-0.5 flex-shrink-0' />
                <span>
                  Kandahar University, Aino Mena, Kandahar, Afghanistan
                </span>
              </li>
              <li className='flex items-center'>
                <Phone className='h-5 w-5 text-[#F7B500] mr-3 flex-shrink-0' />
                <a
                  href='tel:+93700000000'
                  className='hover:text-[#F7B500] transition-colors'
                >
                  +93 70 000 0000
                </a>
              </li>
              <li className='flex items-center'>
                <Mail className='h-5 w-5 text-[#F7B500] mr-3 flex-shrink-0' />
                <a
                  href='mailto:info@kufe.edu.af'
                  className='hover:text-[#F7B500] transition-colors'
                >
                  info@kufe.edu.af
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className='space-y-6'>
            <div className='flex items-center space-x-2'>
              <div className='h-1 w-6 bg-[#F7B500] rounded-full'></div>
              <h3 className='text-xl font-bold text-white'>Newsletter</h3>
            </div>

            <p className='text-[#E8ECEF]'>
              Subscribe to our newsletter to receive updates on events, news,
              and opportunities.
            </p>

            <form onSubmit={handleSubscribe} className='relative'>
              <div className='relative bg-white/10 backdrop-blur-sm rounded-lg p-1 overflow-hidden'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder='Your email address'
                  className='w-full bg-transparent border-0 text-white px-4 py-3 focus:outline-none focus:ring-0 placeholder-white/50'
                  aria-label='Email for newsletter'
                />
                <button
                  type='submit'
                  className='absolute right-1 top-1 bottom-1 bg-[#F7B500] text-[#1D3D6F] px-4 rounded-md font-medium flex items-center justify-center hover:bg-[#F4B400] transition-colors'
                  aria-label='Subscribe'
                >
                  <Send className='h-4 w-4 mr-1' />
                  <span>Subscribe</span>
                </button>
              </div>

              {emailError && (
                <p className='text-red-300 text-sm mt-2'>{emailError}</p>
              )}

              {subscribed && (
                <p className='text-green-300 text-sm mt-2'>
                  Thank you for subscribing!
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className='mt-16 pt-8 border-t border-white/10'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <p className='text-[#E8ECEF] text-sm text-center md:text-left'>
              &copy; {new Date().getFullYear()} Kandahar University Faculty of
              Economics. All rights reserved.
            </p>

            <div className='flex space-x-6 mt-4 md:mt-0'>
              <a
                href='/privacy'
                className='text-[#E8ECEF] hover:text-[#F7B500] text-sm transition-colors'
              >
                Privacy Policy
              </a>
              <a
                href='/terms'
                className='text-[#E8ECEF] hover:text-[#F7B500] text-sm transition-colors'
              >
                Terms of Use
              </a>
              <button
                onClick={scrollToTop}
                className='text-[#E8ECEF] hover:text-[#F7B500] text-sm transition-colors flex items-center'
                aria-label='Back to top'
              >
                <span>Back to top</span>
                <ChevronUp className='h-4 w-4 ml-1' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
