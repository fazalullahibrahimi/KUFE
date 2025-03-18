
import React from "react";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const { token } = useParams(); // Extract token from URL path
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:4400/api/v1/user/resetPassword/${token}`,
        { password }
      );

      if (response.status === 200) {
        setIsSubmitted(true);
        setError('');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4'>
      <div className='w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white'>
          Reset Password
        </h2>

        {!isSubmitted ? (
          <>
            <p className='text-gray-600 dark:text-gray-300 text-center mb-6'>
              Please enter your new password below.
            </p>

            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  New Password
                </label>
                <input
                  type='password'
                  id='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter new password'
                  className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white'
                  required
                />
              </div>

              <div className='mb-4'>
                <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Confirm New Password
                </label>
                <input
                  type='password'
                  id='confirmPassword'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm new password'
                  className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white'
                  required
                />
              </div>

              {error && <p className='text-red-500 text-sm mt-1 mb-4'>{error}</p>}

              <div className='flex flex-col space-y-3 mt-6'>
                <button type='submit' className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200'>
                  Reset Password
                </button>
                <button type='button' className='w-full bg-transparent hover:bg-indigo-50 dark:hover:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium py-2 px-4 border border-indigo-600 dark:border-indigo-400 rounded-md transition duration-200' onClick={() => navigate('/login')}>
                  Back to Login
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className='text-center'>
            <p className='text-gray-700 dark:text-gray-300 mb-6'>
              Your password has been successfully reset!
            </p>
            <button type='button' className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 mb-3' onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
