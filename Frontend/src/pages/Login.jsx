import React, { useState } from "react";
import axios from "axios";
import Kandahar_Economic from "../../public/Kandahar_Economic.jpg";
import { Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setLoginError(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:4400/api/v1/user/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.data.success) {
        setLoginSuccess(true);
        localStorage.setItem("token", response.data.user.token);

        const userRole = response.data.user.role;
        const redirectPath = userRole === "admin" ? "/dashboardv1" : "/";

        setTimeout(() => {
          window.location.href = redirectPath;
        }, 3000);
      }
    } catch (error) {
      setLoginError(
        error.response ? error.response.data.message : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen grid grid-cols-1 md:grid-cols-2'>
      <div
        className='hidden md:flex relative flex-col justify-center px-10 text-white bg-cover bg-center before:absolute before:inset-0 before:bg-black before:opacity-60 before:z-0'
        style={{
          backgroundImage: `url(${Kandahar_Economic})`,
        }}
      >
        <div className='relative z-10'>
          <h1 className='text-4xl font-bold mb-2'>Kandahar University</h1>
          <h2 className='text-2xl font-semibold mb-4'>Faculty of Economics</h2>
          <p className='text-sm max-w-sm'>
            Empowering minds, building futures through excellence in economic
            education.
          </p>
        </div>
      </div>

      <div className='flex items-center justify-center bg-gray-50 p-6'>
        <div className='w-full max-w-sm'>
          <div className='text-center mb-6'>
            <div className='w-24 h-24 mx-auto bg-gray-200 rounded-full mb-4' />
            <h1 className='text-xl font-semibold text-gray-800'>
              Welcome Back
            </h1>
            <p className='text-sm text-gray-500 mt-1'>
              Please sign in to your account
            </p>
          </div>

          {loginSuccess && (
            <div className='p-3 mb-4 text-sm text-green-800 bg-green-100 rounded-lg'>
              Login successful! Redirecting...
            </div>
          )}

          {loginError && (
            <div className='p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg'>
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email Address
              </label>
              <input
                type='email'
                name='email'
                id='email'
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder='your@email.com'
              />
              {errors.email && (
                <p className='mt-1 text-xs text-red-600'>{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <input
                type='password'
                name='password'
                id='password'
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder='••••••••'
              />
              {errors.password && (
                <p className='mt-1 text-xs text-red-600'>{errors.password}</p>
              )}
            </div>

            <div className='flex items-center justify-between'>
              <label className='flex items-center space-x-2 text-sm text-gray-600'>
                <input
                  type='checkbox'
                  name='rememberMe'
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className='rounded border-gray-300 focus:ring-blue-400'
                />
                <span>Remember me</span>
              </label>
              <Link
                to='/forgotPassword'
                className='text-sm text-blue-600 hover:underline'
              >
                Forgot password?
              </Link>
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 transition-all rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50'
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className='text-sm text-center text-gray-500 mt-6'>
            Don’t have an account?{" "}
            <Link to='/registration' className='text-blue-600 hover:underline'>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
