import React from "react";
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Registration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student',
    image: '',
  });

  const [focusedField, setFocusedField] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFocus = (field) => setFocusedField(field);
  const handleBlur = (field) => {
    if (!formData[field]) setFocusedField('');
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Full Name is required.';
    if (!formData.email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return 'Enter a valid email address.';
    if (!formData.password.trim()) return 'Password is required.';
    if (formData.password.length < 6)
      return 'Password must be at least 6 characters long.';
    return null;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');
  
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }
  
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('fullName', formData.fullName);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('password', formData.password);
      formDataToSubmit.append('role', formData.role);
      // Check if an image is provided, if not set default image
      formDataToSubmit.append('image', formData.image || 'default-user.jpg');
  
      const response = await axios.post(
        'http://localhost:4400/api/v1/user/register',
        formDataToSubmit,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
  
      console.log('Registration successful:', response.data);
      localStorage.setItem('token', response.data.token);
  
      setSuccessMessage('Registration successful! Redirecting to login...');
  
      setTimeout(() => {
        navigate('/login');
      }, 2000);
  
      setFormData({
        fullName: '',
        email: '',
        password: '',
        role: 'student',
        image: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='bg-white border rounded-lg p-8 w-96'>
        <form onSubmit={handleSubmit}>
          <h1 className='text-3xl font-bold text-center text-gray-800 mb-6'>
            Create Your Account
          </h1>
          {error && <p className='text-red-500 text-center'>{error}</p>}
          {successMessage && <p className='text-green-500 text-center'>{successMessage}</p>}

          <div className='grid sm:grid-cols-2 gap-3 grid-cols-1'>
            <div className='mb-6 relative'>
              <label
                className={`absolute left-3 transform transition-all duration-200 ${
                  focusedField === 'fullName' || formData.fullName
                    ? 'top-[-1px] text-xs text-gray-700 font-semibold'
                    : 'top-2 text-gray-500'
                }`}
                htmlFor='fullName'
              >
                Name
              </label>
              <input
                type='text'
                name='fullName'
                id='fullName'
                className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-200 shadow-sm'
                value={formData.fullName}
                onChange={handleChange}
                onFocus={() => handleFocus('fullName')}
                onBlur={() => handleBlur('fullName')}
                required
              />
            </div>
            <div className='mb-6 relative'>
              <label
                className={`absolute left-3 transform transition-all duration-200 ${
                  focusedField === 'email' || formData.email
                    ? 'top-[-1px] text-xs text-gray-700 font-semibold'
                    : 'top-2 text-gray-500'
                }`}
                htmlFor='email'
              >
                Email
              </label>
              <input
                type='email'
                name='email'
                id='email'
                className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-200 shadow-sm'
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                required
              />
            </div>
            <div className='mb-6 relative'>
              <label
                className={`absolute left-3 transform transition-all duration-200 ${
                  focusedField === 'password' || formData.password
                    ? 'top-[-1px] text-xs text-gray-700 font-semibold'
                    : 'top-2 text-gray-500'
                }`}
                htmlFor='password'
              >
                Password
              </label>
              <input
                type='password'
                name='password'
                id='password'
                className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-200 shadow-sm'
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                required
              />
            </div>
            <div className='mb-6 relative'>
              <select
                name='role'
                id='role'
                className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-200 shadow-sm'
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value='admin'>Admin</option>
                <option value='faculty'>Faculty</option>
                <option value='student'>Student</option>
              </select>
            </div>
            <div className='mb-6 relative'>
              <label
                className='block text-sm font-semibold text-gray-700 mb-2'
                htmlFor='image'
              >
                Upload Image
              </label>
              <input
                type='file'
                name='image'
                id='image'
                className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-200 shadow-sm'
                onChange={handleChange}
                accept='image/*'
              />
            </div>
          </div>
          <button
            type='submit'
            className='w-full bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-900 transition duration-300 shadow-md'
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className='text-center mt-4 text-gray-600'>
          Already have an account?
          <Link
            to='/login'
            className='text-gray-700 font-semibold pl-2 hover:underline'
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Registration;
