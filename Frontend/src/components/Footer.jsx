import React from "react";
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
  Calendar,
  BookOpen,
  Users,
  GraduationCap,
  Award,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useRoleAccess } from "../hooks/useAuthGuard";

const Footer = () => {
  const { t, direction } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { isStudent, isAdmin } = useRoleAccess();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      dir={direction}
      className='relative bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white'
    >
      {/* Decorative top border */}
      <div className='absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F4B400] via-[#F7B500] to-[#F4B400]'></div>

      {/* Subtle pattern overlay */}
      <div className='absolute inset-0 opacity-5'></div>

      <div className='container mx-auto px-4 pt-16 pb-8 relative z-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
          {/* University Info */}
          <div className='space-y-6'>
            <div
              className={`flex items-center ${
                direction === "rtl" ? "space-x-reverse space-x-3" : "space-x-3"
              }`}
            >
              <div className='h-10 w-10 rounded-full bg-gradient-to-r from-[#F4B400] to-[#F7B500] flex items-center justify-center'>
                <GraduationCap className='h-6 w-6 text-[#1D3D6F]' />
              </div>
              <h3 className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#F7B500]'>
                {t("KUFE_Footer")}
              </h3>
            </div>

            <p className='text-[#E8ECEF] leading-relaxed'>
              {t("Faculty_Description")}
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
            <div
              className={`flex items-center ${
                direction === "rtl" ? "space-x-reverse space-x-2" : "space-x-2"
              }`}
            >
              <div className='h-1 w-6 bg-[#F7B500] rounded-full'></div>
              <h3 className='text-xl font-bold text-white'>
                {t("Quick Links")}
              </h3>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3'>
              {[
                { name: t("Home"), href: "/", icon: BookOpen },
                { name: t("About Us"), href: "/about", icon: Users },
                {
                  name: t("Academics"),
                  href: "/academics",
                  icon: GraduationCap,
                },
                { name: t("Research"), href: "/research", icon: FileText },
                { name: t("News"), href: "/anounce", icon: Calendar },
                { name: t("Courses"), href: "/courses", icon: Award },
                { name: t("Contact"), href: "/contact", icon: Mail },
                // Quality Assurance - Only show for authenticated students (not admin)
                ...(isAuthenticated && isStudent() && !isAdmin()
                  ? [
                      {
                        name: "Quality Assurance",
                        href: "/quality-assurance",
                        icon: MessageSquare,
                      },
                    ]
                  : []),
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className='hover:text-[#F7B500] transition-colors flex items-center group'
                >
                  <span
                    className={`bg-[#F7B500]/20 h-6 w-6 rounded-full flex items-center justify-center ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    } group-hover:bg-[#F7B500]/30 transition-colors`}
                  >
                    <link.icon className='h-3 w-3 text-[#F7B500]' />
                  </span>
                  <span className='text-[#E8ECEF] group-hover:text-[#F7B500] transition-colors'>
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Academic Programs */}
          <div className='space-y-6'>
            <div
              className={`flex items-center ${
                direction === "rtl" ? "space-x-reverse space-x-2" : "space-x-2"
              }`}
            >
              <div className='h-1 w-6 bg-[#F7B500] rounded-full'></div>
              <h3 className='text-xl font-bold text-white'>
                Academic Programs
              </h3>
            </div>

            <div className='space-y-4 text-[#E8ECEF]'>
              <div className='flex items-center'>
                <div className='bg-[#F7B500]/20 h-6 w-6 rounded-full flex items-center justify-center mr-3'>
                  <GraduationCap className='h-3 w-3 text-[#F7B500]' />
                </div>
                <span className='text-sm'>Bachelor's Degree</span>
              </div>

              <div className='flex items-center'>
                <div className='bg-[#F7B500]/20 h-6 w-6 rounded-full flex items-center justify-center mr-3'>
                  <Award className='h-3 w-3 text-[#F7B500]' />
                </div>
                <span className='text-sm'>Master's Degree</span>
              </div>

              <div className='flex items-center'>
                <div className='bg-[#F7B500]/20 h-6 w-6 rounded-full flex items-center justify-center mr-3'>
                  <FileText className='h-3 w-3 text-[#F7B500]' />
                </div>
                <span className='text-sm'>Research Programs</span>
              </div>

              <div className='flex items-center'>
                <div className='bg-[#F7B500]/20 h-6 w-6 rounded-full flex items-center justify-center mr-3'>
                  <Users className='h-3 w-3 text-[#F7B500]' />
                </div>
                <span className='text-sm'>Professional Development</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className='space-y-6'>
            <div
              className={`flex items-center ${
                direction === "rtl" ? "space-x-reverse space-x-2" : "space-x-2"
              }`}
            >
              <div className='h-1 w-6 bg-[#F7B500] rounded-full'></div>
              <h3 className='text-xl font-bold text-white'>
                {t("Contact Us")}
              </h3>
            </div>

            <ul className='space-y-5 text-[#E8ECEF]'>
              <li className='flex items-start'>
                <MapPin
                  className={`h-5 w-5 text-[#F7B500] ${
                    direction === "rtl" ? "ml-3" : "mr-3"
                  } mt-0.5 flex-shrink-0`}
                />
                <span>{t("University_Address")}</span>
              </li>
              <li className='flex items-center'>
                <Phone
                  className={`h-5 w-5 text-[#F7B500] ${
                    direction === "rtl" ? "ml-3" : "mr-3"
                  } flex-shrink-0`}
                />
                <a
                  href='tel:+93700000000'
                  className='hover:text-[#F7B500] transition-colors'
                >
                  +93 70 000 0000
                </a>
              </li>
              <li className='flex items-center'>
                <Mail
                  className={`h-5 w-5 text-[#F7B500] ${
                    direction === "rtl" ? "ml-3" : "mr-3"
                  } flex-shrink-0`}
                />
                <a
                  href='mailto:info@kufe.edu.af'
                  className='hover:text-[#F7B500] transition-colors'
                >
                  info@kufe.edu.af
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className='mt-12 pt-6 border-t border-white/10'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            <p className='text-[#E8ECEF] text-sm text-center md:text-left'>
              &copy; {new Date().getFullYear()} {t("kandahar_university")}{" "}
              {t("faculty_of_economics")}. {t("All rights reserved")}
            </p>

            <div
              className={`flex ${
                direction === "rtl" ? "space-x-reverse space-x-4" : "space-x-4"
              }`}
            >
              <a
                href='/privacy'
                className='text-[#E8ECEF] hover:text-[#F7B500] text-sm transition-colors'
              >
                {t("Privacy Policy Footer")}
              </a>
              <a
                href='/terms'
                className='text-[#E8ECEF] hover:text-[#F7B500] text-sm transition-colors'
              >
                {t("Terms of Use")}
              </a>
              <button
                onClick={scrollToTop}
                className='text-[#E8ECEF] hover:text-[#F7B500] text-sm transition-colors flex items-center'
                aria-label='Back to top'
              >
                <span>{t("Back to top")}</span>
                <ChevronUp
                  className={`h-4 w-4 ${direction === "rtl" ? "mr-1" : "ml-1"}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
