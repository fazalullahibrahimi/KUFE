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
        `${
          import.meta.env.VITE_API_URL || "http://127.0.0.1:4400/api/v1"
        }/user/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.data.success) {
        setLoginSuccess(true);
        localStorage.setItem("token", response.data.user.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

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

  // Social login handlers (to be implemented with actual OAuth)
  const handleGoogleLogin = () => {
    // Implement Google OAuth login
    console.log("Google login clicked");
  };

  const handleGithubLogin = () => {
    // Implement GitHub OAuth login
    console.log("GitHub login clicked");
  };

  return (
    <div
      className='min-h-screen flex flex-col md:flex-row'
      style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: "#F9F9F9" }}
    >
      {/* Left Panel - University Info */}
      <div className='md:w-1/2 relative overflow-hidden'>
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{ backgroundImage: `url(${Kandahar_Economic})` }}
        >
          <div
            className='absolute inset-0'
            style={{ backgroundColor: "rgba(0, 75, 135, 0.85)" }}
          ></div>
        </div>

        <div className='relative h-full flex flex-col justify-between p-8 md:p-12 text-white'>
          <div className='mb-auto pt-8'>
            <div className='flex items-center mb-10'>
              <div
                className='w-16 h-16 rounded-full flex items-center justify-center mr-4'
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-10 w-10'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M22 10v6M2 10l10-5 10 5-10 5z'></path>
                  <path d='M6 12v5c3 3 9 3 12 0v-5'></path>
                </svg>
              </div>
              <div>
                <h1
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "700",
                    fontSize: "28px",
                  }}
                >
                  KUFE
                </h1>
                <p className='text-sm opacity-90'>
                  Kandahar University Faculty of Economics
                </p>
              </div>
            </div>

            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: "700",
                fontSize: "36px",
              }}
              className='mb-4 mt-12 leading-tight'
            >
              Welcome to the
              <br />
              Academic Portal
            </h2>
            <p className='text-lg max-w-md opacity-90 mb-8'>
              Access your courses, research materials, and academic resources in
              one place.
            </p>

            <div className='hidden md:block'>
              <div className='mt-12 space-y-6'>
                <div className='flex items-start'>
                  <div
                    className='w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1'
                    style={{ backgroundColor: "rgba(244, 180, 0, 0.3)" }}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path>
                      <polyline points='22 4 12 14.01 9 11.01'></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: "600",
                        fontSize: "18px",
                      }}
                    >
                      Academic Excellence
                    </h3>
                    <p className='text-sm opacity-90 mt-1'>
                      Access to world-class educational resources and research
                      materials
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div
                    className='w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1'
                    style={{ backgroundColor: "rgba(244, 180, 0, 0.3)" }}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'></path>
                      <circle cx='9' cy='7' r='4'></circle>
                      <path d='M23 21v-2a4 4 0 0 0-3-3.87'></path>
                      <path d='M16 3.13a4 4 0 0 1 0 7.75'></path>
                    </svg>
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: "600",
                        fontSize: "18px",
                      }}
                    >
                      Community Engagement
                    </h3>
                    <p className='text-sm opacity-90 mt-1'>
                      Connect with faculty members and fellow students
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div
                    className='w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1'
                    style={{ backgroundColor: "rgba(244, 180, 0, 0.3)" }}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <rect
                        x='2'
                        y='7'
                        width='20'
                        height='14'
                        rx='2'
                        ry='2'
                      ></rect>
                      <path d='M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'></path>
                    </svg>
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: "600",
                        fontSize: "18px",
                      }}
                    >
                      Digital Resources
                    </h3>
                    <p className='text-sm opacity-90 mt-1'>
                      Access your course materials anytime, anywhere
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-auto pb-6 text-sm opacity-80'>
            <p>
              © {new Date().getFullYear()} Kandahar University. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className='md:w-1/2 flex items-center justify-center p-6 md:p-12'>
        <div className='w-full max-w-md bg-white rounded-xl shadow-lg p-8'>
          <div className='text-center mb-8'>
            <div
              className='inline-flex items-center justify-center w-20 h-20 rounded-full mb-4'
              style={{ backgroundColor: "rgba(0, 75, 135, 0.1)" }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-10 w-10'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#004B87'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
                <circle cx='12' cy='7' r='4'></circle>
              </svg>
            </div>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: "700",
                fontSize: "28px",
                color: "#333333",
              }}
            >
              Sign In
            </h2>
            <p style={{ color: "#666666" }} className='mt-1'>
              Access your KUFE account
            </p>
          </div>

          {loginSuccess && (
            <div
              className='p-4 mb-6 flex items-center text-sm rounded-lg'
              style={{
                backgroundColor: "rgba(0, 128, 0, 0.1)",
                color: "#006400",
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 mr-2 flex-shrink-0'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path>
                <polyline points='22 4 12 14.01 9 11.01'></polyline>
              </svg>
              <span>Login successful! Redirecting you shortly...</span>
            </div>
          )}

          {loginError && (
            <div
              className='p-4 mb-6 flex items-center text-sm rounded-lg'
              style={{
                backgroundColor: "rgba(220, 38, 38, 0.1)",
                color: "#9B1C1C",
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 mr-2 flex-shrink-0'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='12' cy='12' r='10'></circle>
                <line x1='12' y1='8' x2='12' y2='12'></line>
                <line x1='12' y1='16' x2='12.01' y2='16'></line>
              </svg>
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium mb-1'
                style={{ color: "#333333" }}
              >
                Email Address
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 text-gray-400'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'></path>
                    <polyline points='22,6 12,13 2,6'></polyline>
                  </svg>
                </div>
                <input
                  type='email'
                  name='email'
                  id='email'
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-2 focus:ring-offset-0 focus:ring-blue-500"
                  }`}
                  style={{ backgroundColor: "#FFFFFF" }}
                  placeholder='your@email.com'
                />
              </div>
              {errors.email && (
                <p
                  className='mt-1 text-sm flex items-center'
                  style={{ color: "#DC2626" }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 mr-1'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <circle cx='12' cy='12' r='10'></circle>
                    <line x1='12' y1='8' x2='12' y2='12'></line>
                    <line x1='12' y1='16' x2='12.01' y2='16'></line>
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium mb-1'
                style={{ color: "#333333" }}
              >
                Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 text-gray-400'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <rect
                      x='3'
                      y='11'
                      width='18'
                      height='11'
                      rx='2'
                      ry='2'
                    ></rect>
                    <path d='M7 11V7a5 5 0 0 1 10 0v4'></path>
                  </svg>
                </div>
                <input
                  type='password'
                  name='password'
                  id='password'
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-2 focus:ring-offset-0 focus:ring-blue-500"
                  }`}
                  style={{ backgroundColor: "#FFFFFF" }}
                  placeholder='••••••••'
                />
              </div>
              {errors.password && (
                <p
                  className='mt-1 text-sm flex items-center'
                  style={{ color: "#DC2626" }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 mr-1'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <circle cx='12' cy='12' r='10'></circle>
                    <line x1='12' y1='8' x2='12' y2='12'></line>
                    <line x1='12' y1='16' x2='12.01' y2='16'></line>
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            <div className='flex items-center justify-between'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  name='rememberMe'
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className='h-4 w-4 rounded border-gray-300 focus:ring-offset-0 focus:ring-2'
                  style={{ color: "#004B87" }}
                />
                <span className='ml-2 text-sm' style={{ color: "#666666" }}>
                  Remember me
                </span>
              </label>
              <Link
                to='/forgotPassword'
                className='text-sm font-medium hover:underline'
                style={{ color: "#004B87" }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white transition-colors disabled:opacity-50'
              style={{
                backgroundColor: "#004B87",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: "600",
              }}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='ml-2 h-4 w-4'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M5 12h14'></path>
                    <path d='M12 5l7 7-7 7'></path>
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>
                  Or continue with
                </span>
              </div>
            </div>

            <div className='mt-6 grid grid-cols-2 gap-3'>
              <button
                onClick={handleGoogleLogin}
                className='w-full flex items-center justify-center py-2.5 px-4 border rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors'
                style={{ borderColor: "#DDDDDD" }}
              >
                <svg
                  className='h-5 w-5 mr-2'
                  viewBox='0 0 24 24'
                  width='24'
                  height='24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g transform='matrix(1, 0, 0, 1, 27.009001, -39.238998)'>
                    <path
                      fill='#4285F4'
                      d='M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z'
                    />
                    <path
                      fill='#34A853'
                      d='M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z'
                    />
                    <path
                      fill='#FBBC05'
                      d='M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z'
                    />
                    <path
                      fill='#EA4335'
                      d='M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z'
                    />
                  </g>
                </svg>
                Google
              </button>
              <button
                onClick={handleGithubLogin}
                className='w-full flex items-center justify-center py-2.5 px-4 border rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors'
                style={{ borderColor: "#DDDDDD" }}
              >
                <svg
                  className='h-5 w-5 mr-2'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M12 0C5.374 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9 23.126 9 22.81V20.576C5.662 21.302 4.967 19.16 4.967 19.16C4.421 17.773 3.634 17.404 3.634 17.404C2.545 16.659 3.717 16.675 3.717 16.675C4.922 16.759 5.556 17.912 5.556 17.912C6.626 19.746 8.363 19.216 9.048 18.909C9.155 18.134 9.466 17.604 9.81 17.305C7.145 17 4.343 15.971 4.343 11.374C4.343 10.063 4.812 8.993 5.579 8.153C5.455 7.85 5.044 6.629 5.696 4.977C5.696 4.977 6.704 4.655 8.997 6.207C9.954 5.941 10.98 5.808 12 5.803C13.02 5.808 14.047 5.941 15.006 6.207C17.297 4.655 18.303 4.977 18.303 4.977C18.956 6.63 18.545 7.851 18.421 8.153C19.191 8.993 19.656 10.064 19.656 11.374C19.656 15.983 16.849 16.998 14.177 17.295C14.607 17.667 15 18.397 15 19.517V22.81C15 23.129 15.192 23.504 15.801 23.386C20.566 21.797 24 17.3 24 12C24 5.373 18.627 0 12 0Z'
                    fill='currentColor'
                  />
                </svg>
                GitHub
              </button>
            </div>
          </div>

          <div className='mt-8 text-center'>
            <p className='text-sm' style={{ color: "#666666" }}>
              Don't have an account?{" "}
              <Link
                to='/registration'
                className='font-medium hover:underline'
                style={{ color: "#004B87", fontWeight: "600" }}
              >
                Register here
              </Link>
            </p>
          </div>

          <div className='mt-8 pt-6 border-t border-gray-200'>
            <p className='text-xs text-center' style={{ color: "#666666" }}>
              By signing in, you agree to our{" "}
              <a href='#' className='underline' style={{ color: "#004B87" }}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a href='#' className='underline' style={{ color: "#004B87" }}>
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
