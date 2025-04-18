import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className='bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white mt-20'>
      <div className='container mx-auto px-4 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
          <div>
            <h3 className='text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#F7B500]'>
              KUFE
            </h3>
            <p className='text-[#E8ECEF] leading-relaxed'>
              Kandahar University Faculty of Economics provides quality
              education in economics, finance, business management, and
              statistics.
            </p>
          </div>

          <div>
            <h3 className='text-xl font-bold mb-6 text-white'>Quick Links</h3>
            <ul className='space-y-3 text-[#E8ECEF]'>
              {["Home", "About", "Academics", "Contact"].map((item, i) => (
                <li key={i}>
                  <a
                    href={`/${item.toLowerCase()}`}
                    className='hover:text-[#F7B500] transition-colors flex items-center'
                  >
                    <span className='bg-black h-1.5 w-1.5 rounded-full mr-2'></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='text-xl font-bold mb-6 text-white'>Contact</h3>
            <ul className='space-y-4 text-[#E8ECEF]'>
              <li className='flex items-center'>
                <MapPin className='h-5 w-5 text-[#F7B500] mr-3' />
                <span>Kandahar University, Afghanistan</span>
              </li>
              <li className='flex items-center'>
                <Phone className='h-5 w-5 text-[#F7B500] mr-3' />
                <span>+93 70 000 0000</span>
              </li>
              <li className='flex items-center'>
                <Mail className='h-5 w-5 text-[#F7B500] mr-3' />
                <span>info@kufe.edu.af</span>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-white/10 mt-10 pt-8 text-center text-[#E8ECEF]'>
          <p>
            &copy; {new Date().getFullYear()} Kandahar University Faculty of
            Economics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
