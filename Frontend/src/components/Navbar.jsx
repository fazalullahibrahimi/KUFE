import React from "react";
import Logo from "../../public/Logo.jpg";

const Navbar = () => {
  return (
    <nav className='bg-white shadow-md fixed w-full z-50'>
      <div className='container mx-auto flex justify-between items-center py-4 px-6'>
        <div className='flex items-center space-x-4'>
          <img
            src={Logo}
            alt='Kandahar University Logo'
            className='h-12 w-12 object-cover'
          />
          <div>
            <h1 className='text-lg font-bold text-blue-900'>
              Kandahar University
            </h1>
            <p className='text-sm text-gray-500'>Faculty of Economics</p>
          </div>
        </div>
        <ul className='hidden md:flex space-x-6'>
          {[
            "Home",
            "Academics",
            "Research",
            "Admissions",
            "About",
            "Contact",
          ].map((item) => (
            <li
              key={item}
              className='text-gray-700 hover:text-blue-600 cursor-pointer'
            >
              {item}
            </li>
          ))}
        </ul>
        <button className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800'>
          Student Portal
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
