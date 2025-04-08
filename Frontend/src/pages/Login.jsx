import React from "react";
import { useState } from "react";
import axios from "axios";

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

      // Handle successful login response
      if (response.data.success) {
        setLoginSuccess(true);

        // Store the JWT in localStorage
        localStorage.setItem("token", response.data.user.token);

        // Redirect based on user role
        const userRole = response.data.user.role; // Adjust according to your response structure
        const redirectPath = userRole === "admin" ? "/dashboard" : "/";

        setTimeout(() => {
          window.location.href = redirectPath; // Redirect to the appropriate page
        }, 3000); // Redirect after 3 seconds
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
    <div className='flex items-center w-screen h-screen justify-center'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg border'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight text-gray-900'>
            Welcome Back
          </h1>
          <p className='mt-2 text-sm text-gray-600'>Sign in to your account</p>
        </div>

        {loginSuccess && (
          <div
            className='p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg'
            role='alert'
          >
            Login successful! Redirecting...
          </div>
        )}

        {loginError && (
          <div
            className='p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg'
            role='alert'
          >
            {loginError}
          </div>
        )}

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email address
            </label>
            <div className='mt-1'>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
              {errors.email && (
                <p className='mt-2 text-sm text-red-600'>{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <div className='mt-1'>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
              {errors.password && (
                <p className='mt-2 text-sm text-red-600'>{errors.password}</p>
              )}
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                id='remember-me'
                name='rememberMe'
                type='checkbox'
                checked={formData.rememberMe}
                onChange={handleChange}
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
              <label
                htmlFor='remember-me'
                className='ml-2 block text-sm text-gray-900'
              >
                Remember me
              </label>
            </div>

            <div className='text-sm'>
              <a
                href='/forgatPassword'
                className='font-medium text-blue-600 hover:text-blue-500'
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={isSubmitting}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? (
                <span className='flex items-center'>Processing...</span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        <div className='text-center mt-4'>
          <p className='text-sm text-gray-600'>
            Don't have an account?
            <a
              href='/registration'
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
