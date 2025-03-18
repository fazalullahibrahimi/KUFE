import React from "react";
import { useState } from 'react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:4400/api/v1/user/forgotPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen px-4'>
      <div className='w-full max-w-md p-8 rounded-lg border'>
        <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Forgot Password</h2>

        {!isSubmitted ? (
          <>
            <p className='text-gray-600 text-center mb-6'>
              Enter your email address and we will send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                  Email Address
                </label>
                <input
                  type='email'
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  className='w-full px-4 py-2 border border-gray-800 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  required
                />
              </div>

              {error && <p className='text-red-500 text-sm mt-1 mb-4'>{error}</p>}

              <div className='flex flex-col space-y-3 mt-6'>
                <button
                  type='submit'
                  className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50'
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button
                  type='button'
                  className='w-full bg-transparent hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-white font-medium py-2 px-4 border border-indigo-600 rounded-md transition duration-200'
                  onClick={() => window.history.back()}
                >
                  Back to Login
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className='text-center'>
            <p className='text-gray-700 dark:text-gray-300 mb-6'>
              If an account exists with the email{' '}
              <span className='font-semibold'>{email}</span>, you will receive a password reset link
              shortly.
            </p>
            <button
              type='button'
              className='w-full bg-transparent hover:bg-indigo-50 dark:hover:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium py-2 px-4 border border-indigo-600 dark:border-indigo-400 rounded-md transition duration-200'
              onClick={() => window.history.back()}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
