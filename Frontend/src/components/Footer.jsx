import React from "react";

const Footer = () => {
  return (
    <footer className='bg-blue-900 text-white py-10 px-6'>
    <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6'>
      <div>
        <h3 className='text-lg font-bold'>Contact Us</h3>
        <p>Kandahar University, Afghanistan</p>
        <p>📞 +93 700 000 000</p>
        <p>📧 info@kufe.edu.af</p>
      </div>
      <div>
        <h3 className='text-lg font-bold'>Quick Links</h3>
        <ul className='text-gray-300'>
          <li>
            <a href='#'>Academic Calendar</a>
          </li>
          <li>
            <a href='#'>Library</a>
          </li>
          <li>
            <a href='#'>Research</a>
          </li>
          <li>
            <a href='#'>Student Life</a>
          </li>
        </ul>
      </div>
      <div>
        <h3 className='text-lg font-bold'>Resources</h3>
        <ul className='text-gray-300'>
          <li>
            <a href='#'>Student Portal</a>
          </li>
          <li>
            <a href='#'>Faculty Portal</a>
          </li>
          <li>
            <a href='#'>E-Learning</a>
          </li>
          <li>
            <a href='#'>Downloads</a>
          </li>
        </ul>
      </div>
      <div>
        <h3 className='text-lg font-bold'>Follow Us</h3>
        <div className='flex space-x-4'>
          <a href='#'>
            <i className='fab fa-facebook-f'></i>
          </a>
          <a href='#'>
            <i className='fab fa-twitter'></i>
          </a>
          <a href='#'>
            <i className='fab fa-instagram'></i>
          </a>
          <a href='#'>
            <i className='fab fa-linkedin'></i>
          </a>
        </div>
      </div>
    </div>
    <p className='text-center mt-6 text-gray-300'>
      © 2025 Kandahar University Faculty of Economics. All rights reserved.
    </p>
  </footer>
  );
};

export default Footer;
