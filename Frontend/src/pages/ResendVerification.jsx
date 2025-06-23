import React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import { useLanguage } from "../contexts/LanguageContext"

function ResendVerification() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, language, isRTL } = useLanguage()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [currentImage, setCurrentImage] = useState("/image_for_login.jpg")

  // Check if coming from login
  const fromLogin = location.state?.fromLogin || false

  // Handle image load error
  const handleImageError = () => {
    setCurrentImage("/Kandahar_Economic.jpg")
  }

  // Try to get email from localStorage or location state
  useEffect(() => {
    const locationEmail = location.state?.email
    const storedEmail = localStorage.getItem("pendingVerificationEmail")

    if (locationEmail) {
      setEmail(locationEmail)
    } else if (storedEmail) {
      setEmail(storedEmail)
    }
  }, [location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await axios.post("http://localhost:4400/api/v1/user/resend-verification-otp", { email })
      setSuccess(true)
      localStorage.setItem("pendingVerificationEmail", email)

      // Navigate to verification page after a short delay
      setTimeout(() => {
        if (fromLogin) {
          navigate("/verify-email", {
            state: { email, fromLogin: true },
          })
        } else {
          navigate("/verify-email", {
            state: { email },
          })
        }
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send verification email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row ${isRTL ? 'rtl' : 'ltr'}`}
      style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: "#F9F9F9" }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Left Panel - University Info */}
      <div className={`md:w-1/2 relative overflow-hidden ${isRTL ? 'md:order-2' : ''}`}>
        {/* Background Image with Error Handling */}
        <img
          src={currentImage}
          alt={t("Kandahar University")}
          className="absolute inset-0 w-full h-full object-cover"
          onError={handleImageError}
          style={{ zIndex: 1 }}
        />
        <div
          className='absolute inset-0'
          style={{ backgroundColor: "rgba(0, 75, 135, 0.85)", zIndex: 2 }}
        ></div>

        <div className='relative h-full flex flex-col justify-between p-8 md:p-12 text-white' style={{ zIndex: 3 }}>
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
              Email Verification
              <br />
              Portal
            </h2>
            <p className='text-lg max-w-md opacity-90 mb-8'>
              Verify your email to access all features of the Faculty of Economics portal.
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
                      Secure Access
                    </h3>
                    <p className='text-sm opacity-90 mt-1'>
                      Protect your account with email verification
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
                      <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'></path>
                      <polyline points='22,6 12,13 2,6'></polyline>
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
                      Email Confirmation
                    </h3>
                    <p className='text-sm opacity-90 mt-1'>
                      Receive verification codes directly to your email
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
                      <path d='M9 12l2 2 4-4'></path>
                      <path d='M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3'></path>
                      <path d='M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3'></path>
                      <path d='M13 12h3'></path>
                      <path d='M5 12h3'></path>
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
                      Quick Process
                    </h3>
                    <p className='text-sm opacity-90 mt-1'>
                      Fast and easy verification process
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

      {/* Right Panel - Verification Form */}
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
                <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'></path>
                <polyline points='22,6 12,13 2,6'></polyline>
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
              Email Verification
            </h2>
            <p style={{ color: "#666666" }} className='mt-1'>
              Confirm your email address
            </p>
          </div>

          {fromLogin && (
            <div
              className='p-4 mb-6 flex items-center text-sm rounded-lg'
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                color: "#1E40AF",
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
                <path d='M12 6v6l4 2'></path>
              </svg>
              <div>
                <p className="font-medium">Email verification required</p>
                <p>Please verify your email address to complete the login process.</p>
              </div>
            </div>
          )}

          <div className='mb-6'>
            <p style={{ color: "#666666" }} className='text-center'>
              Please confirm your email address to receive a verification code
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

          {success && (
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
              <span>Verification code sent successfully! Redirecting to verification page...</span>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500'
                  style={{ backgroundColor: "#FFFFFF" }}
                  placeholder='your@email.com'
                  required
                />
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white transition-colors disabled:opacity-50'
              style={{
                backgroundColor: "#004B87",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: "600",
              }}
            >
              {loading ? (
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
                  Sending...
                </>
              ) : (
                <>
                  Send Verification Code
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

          <div className='mt-8 text-center'>
            <p className='text-sm' style={{ color: "#666666" }}>
              Already verified?{" "}
              <button
                onClick={() => navigate("/login")}
                className='font-medium hover:underline'
                style={{ color: "#004B87", fontWeight: "600" }}
              >
                Back to Login
              </button>
            </p>
          </div>

          <div className='mt-8 pt-6 border-t border-gray-200'>
            <p className='text-xs text-center' style={{ color: "#666666" }}>
              By verifying, you agree to our{" "}
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
  )
}

export default ResendVerification
