import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Kandahar_Economic from "../../public/image_for_home2.jpg";

function Registration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
    image: "",
  });

  const [focusedField, setFocusedField] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });

      // Calculate password strength
      if (name === "password") {
        const strength = calculatePasswordStrength(value);
        setPasswordStrength(strength);
      }
    }
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (!password) return score;

    // Length check
    if (password.length >= 8) score += 1;

    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return Math.min(score, 4);
  };

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "#FF4D4F";
      case 1:
        return "#FF4D4F";
      case 2:
        return "#FAAD14";
      case 3:
        return "#52C41A";
      case 4:
        return "#52C41A";
      default:
        return "#D9D9D9";
    }
  };

  const handleFocus = (field) => setFocusedField(field);
  const handleBlur = (field) => {
    if (!formData[field]) setFocusedField("");
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return "Full Name is required.";
    if (!formData.email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "Enter a valid email address.";
    if (!formData.password.trim()) return "Password is required.";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters long.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("fullName", formData.fullName);
      formDataToSubmit.append("email", formData.email);
      formDataToSubmit.append("password", formData.password);
      formDataToSubmit.append("role", formData.role);
      formDataToSubmit.append("image", formData.image || "default-user.jpg");

      // Make sure this endpoint matches your backend API
      const response = await axios.post(
        "http://localhost:4400/api/v1/user/register",
        formDataToSubmit,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Registration response:", response.data);

      // Store email for verification
      localStorage.setItem("pendingVerificationEmail", formData.email);

      setSuccessMessage(
        "Registration successful! Redirecting to verification page..."
      );

      // Redirect to resend-verification page after 3 seconds
      setTimeout(() => navigate("/resend-verification"), 3000);

      setFormData({
        fullName: "",
        email: "",
        password: "",
        role: "student",
        image: "",
      });
      setImagePreview(null);
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
            className='absolute inset-0 bg-gradient-to-r from-[#004B87] to-[#003A6A]'
            style={{ opacity: 0.9 }}
          ></div>
        </div>

        <div className='relative h-full flex flex-col justify-between p-8 md:p-12 text-white'>
          <div className='mb-auto pt-8'>
            <div className='flex items-center mb-10'>
              <div
                className='w-16 h-16 rounded-full flex items-center justify-center mr-4'
                style={{ backgroundColor: "rgba(244, 180, 0, 0.2)" }}
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
              Join Our
              <br />
              Academic Community
            </h2>
            <p className='text-lg max-w-md opacity-90 mb-8'>
              Create your account to access courses, research materials, and
              connect with faculty members.
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
                      <path d='M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'></path>
                      <circle cx='8.5' cy='7' r='4'></circle>
                      <line x1='20' y1='8' x2='20' y2='14'></line>
                      <line x1='23' y1='11' x2='17' y2='11'></line>
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
                      Create Your Profile
                    </h3>
                    <p className='text-sm opacity-90 mt-1'>
                      Set up your academic profile and customize your learning
                      experience
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
                      Join the Community
                    </h3>
                    <p className='text-sm opacity-90 mt-1'>
                      Connect with professors and fellow students
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
                      <path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20'></path>
                      <path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'></path>
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
                      Access Resources
                    </h3>
                    <p className='text-sm opacity-90 mt-1'>
                      Get immediate access to course materials and academic
                      resources
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

      {/* Right Panel - Registration Form */}
      <div className='md:w-1/2 flex items-center justify-center p-6 md:p-12'>
        <div
          className='w-full max-w-md bg-white rounded-xl shadow-xl p-8'
          style={{ boxShadow: "0 10px 25px rgba(0, 75, 135, 0.1)" }}
        >
          <div className='text-center mb-8'>
            <div
              className='inline-flex items-center justify-center w-20 h-20 rounded-full mb-4'
              style={{
                background:
                  "linear-gradient(135deg, rgba(0, 75, 135, 0.1) 0%, rgba(0, 75, 135, 0.2) 100%)",
              }}
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
                <path d='M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'></path>
                <circle cx='8.5' cy='7' r='4'></circle>
                <line x1='20' y1='8' x2='20' y2='14'></line>
                <line x1='23' y1='11' x2='17' y2='11'></line>
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
              Create Account
            </h2>
            <p style={{ color: "#666666" }} className='mt-1'>
              Join the KUFE academic community
            </p>
          </div>

          {error && (
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
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
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
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Progress Steps */}
            <div className='flex justify-between items-center mb-6'>
              <div className='flex flex-col items-center'>
                <div
                  className='w-8 h-8 rounded-full flex items-center justify-center'
                  style={{ backgroundColor: "#004B87", color: "white" }}
                >
                  1
                </div>
                <span className='text-xs mt-1' style={{ color: "#004B87" }}>
                  Account
                </span>
              </div>
              <div
                className='flex-1 h-1 mx-2'
                style={{ backgroundColor: "#E5E7EB" }}
              ></div>
              <div className='flex flex-col items-center'>
                <div className='w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-600'>
                  2
                </div>
                <span className='text-xs mt-1 text-gray-500'>Verification</span>
              </div>
              <div
                className='flex-1 h-1 mx-2'
                style={{ backgroundColor: "#E5E7EB" }}
              ></div>
              <div className='flex flex-col items-center'>
                <div className='w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-600'>
                  3
                </div>
                <span className='text-xs mt-1 text-gray-500'>Complete</span>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label
                className='block text-sm font-medium mb-1 text-gray-700'
                htmlFor='fullName'
              >
                Full Name
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
                    <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
                    <circle cx='12' cy='7' r='4'></circle>
                  </svg>
                </div>
                <input
                  type='text'
                  name='fullName'
                  id='fullName'
                  className='block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 border-gray-300 transition-all duration-200'
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder='Enter your full name'
                  required
                />
                {formData.fullName && (
                  <div className='absolute right-3 top-3 text-green-500'>
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
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                className='block text-sm font-medium mb-1 text-gray-700'
                htmlFor='email'
              >
                Email
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
                  className='block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 border-gray-300 transition-all duration-200'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Enter your email address'
                  required
                />
                {formData.email &&
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                    <div className='absolute right-3 top-3 text-green-500'>
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
                  )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className='block text-sm font-medium mb-1 text-gray-700'
                htmlFor='password'
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
                  className='block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 border-gray-300 transition-all duration-200'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Create a password'
                  required
                />
              </div>

              {/* Password strength indicator */}
              {formData.password && (
                <div className='mt-2'>
                  <div className='flex justify-between items-center mb-1'>
                    <div className='flex space-x-1'>
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className='w-6 h-1 rounded-full transition-all duration-300'
                          style={{
                            backgroundColor:
                              i < passwordStrength
                                ? getPasswordStrengthColor()
                                : "#E5E7EB",
                          }}
                        ></div>
                      ))}
                    </div>
                    <span
                      className='text-xs'
                      style={{ color: getPasswordStrengthColor() }}
                    >
                      {getPasswordStrengthLabel()}
                    </span>
                  </div>
                  <p className='text-xs text-gray-500'>
                    Use 8+ characters with a mix of letters, numbers & symbols
                  </p>
                </div>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label
                className='block text-sm font-medium mb-1 text-gray-700'
                htmlFor='role'
              >
                Select Your Role
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
                    <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'></path>
                    <circle cx='9' cy='7' r='4'></circle>
                    <path d='M23 21v-2a4 4 0 0 0-3-3.87'></path>
                    <path d='M16 3.13a4 4 0 0 1 0 7.75'></path>
                  </svg>
                </div>
                <select
                  name='role'
                  id='role'
                  className='block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 border-gray-300 appearance-none bg-white transition-all duration-200'
                  value={formData.role}
                  onChange={handleChange}
                  style={{
                    backgroundImage:
                      'url(\'data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23666" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>\')',
                    backgroundPosition: "right 1rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1em",
                  }}
                >
                  <option value='admin'>Admin</option>
                  <option value='teacher'>Teacher</option>
                  <option value='student'>Student</option>
                  <option value='committeeMember'>Committee Member</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
              <label
                className='block text-sm font-medium mb-2 text-gray-700'
                htmlFor='image'
              >
                Profile Image (Optional)
              </label>
              <div className='flex flex-col sm:flex-row items-center'>
                <div className='w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4 sm:mb-0 sm:mr-6 border-4 border-white shadow-md'>
                  {imagePreview ? (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt='Profile preview'
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-12 w-12 text-gray-400'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
                      <circle cx='12' cy='7' r='4'></circle>
                    </svg>
                  )}
                </div>
                <div className='flex-1'>
                  <label className='cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 inline-flex items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4 mr-2'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'></path>
                      <polyline points='17 8 12 3 7 8'></polyline>
                      <line x1='12' y1='3' x2='12' y2='15'></line>
                    </svg>
                    Upload Photo
                    <input
                      type='file'
                      name='image'
                      id='image'
                      className='sr-only'
                      onChange={handleChange}
                      accept='image/*'
                    />
                  </label>
                  <p className='mt-2 text-xs text-gray-500'>
                    JPG, PNG or GIF up to 2MB. This will be displayed on your
                    profile.
                  </p>
                </div>
              </div>
            </div>

            <div className='pt-4'>
              <button
                type='submit'
                disabled={loading}
                className='w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-white transition-all duration-300 disabled:opacity-50 relative overflow-hidden group'
                style={{
                  backgroundColor: "#004B87",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "600",
                }}
              >
                <span
                  className='absolute w-0 h-0 transition-all duration-300 rounded-full bg-white opacity-10 group-hover:w-full group-hover:h-full'
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                ></span>
                {loading ? (
                  <>
                    <svg
                      className='animate-spin -ml-1 mr-2 h-5 w-5 text-white'
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='ml-2 h-5 w-5'
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
            </div>
          </form>

          <div className='mt-8 text-center'>
            <p className='text-sm' style={{ color: "#666666" }}>
              Already have an account?{" "}
              <Link
                to='/login'
                className='font-medium hover:underline transition-all duration-200'
                style={{ color: "#004B87", fontWeight: "600" }}
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className='mt-8 pt-6 border-t border-gray-200'>
            <p className='text-xs text-center' style={{ color: "#666666" }}>
              By creating an account, you agree to our{" "}
              <a
                href='#'
                className='underline hover:text-blue-700 transition-all duration-200'
                style={{ color: "#004B87" }}
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href='#'
                className='underline hover:text-blue-700 transition-all duration-200'
                style={{ color: "#004B87" }}
              >
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

export default Registration;
