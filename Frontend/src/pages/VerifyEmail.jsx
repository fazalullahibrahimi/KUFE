import React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import { useLanguage } from "../contexts/LanguageContext"

function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, language, isRTL } = useLanguage()

  // Get email from location state or localStorage
  const email = location.state?.email || localStorage.getItem("pendingVerificationEmail")
  const fromLogin = location.state?.fromLogin || false

  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(600) // 10 minutes in seconds
  const [currentImage, setCurrentImage] = useState("/image_for_login.jpg")

  // Handle image load error
  const handleImageError = () => {
    setCurrentImage("/Kandahar_Economic.jpg")
  }

  useEffect(() => {
    // Redirect to login if no email is found
    if (!email) {
      navigate("/login")
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [email, navigate])

  // Format countdown time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim()

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("")
      setOtp(newOtp)

      // Focus the last input after paste
      document.getElementById(`otp-input-5`).focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpValue = otp.join("")

    // Validate OTP
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post("http://localhost:4400/api/v1/user/verify-email-otp", {
        email,
        otp: otpValue,
      })

      setSuccess(true)
      localStorage.removeItem("pendingVerificationEmail")

      // Store user data and token if returned
      if (response.data.user && response.data.user.token) {
        localStorage.setItem("token", response.data.user.token)
      }

      // Redirect after a short delay
      setTimeout(() => {
        if (fromLogin) {
          navigate("/login", {
            state: {
              message: "Email verified successfully! You can now log in."
            }
          })
        } else {
          navigate("/verification-success")
        }
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    setError(null)

    try {
      await axios.post("http://localhost:4400/api/v1/user/resend-verification-otp", { email })
      setSuccess("OTP has been resent to your email")
      setCountdown(600) // Reset countdown to 10 minutes
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP. Please try again.")
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
            <div className={`flex items-center mb-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${isRTL ? 'ml-4' : 'mr-4'}`}
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
              <div className={isRTL ? 'text-right' : ''}>
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
                  {t("Kandahar University Faculty of Economics")}
                </p>
              </div>
            </div>

            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: "700",
                fontSize: "36px",
              }}
              className={`mb-4 mt-12 leading-tight ${isRTL ? 'text-right' : ''}`}
            >
              {t("Email Verification")}
              <br />
              {t("Portal")}
            </h2>
            <p className={`text-lg max-w-md opacity-90 mb-8 ${isRTL ? 'text-right' : ''}`}>
              {t("Verify your email to access all features of the Faculty of Economics portal.")}
            </p>
          </div>

          <div className={`mt-auto pb-6 text-sm opacity-80 ${isRTL ? 'text-right' : ''}`}>
            <p>
              © {new Date().getFullYear()} {t("Kandahar University")}. {t("All rights reserved")}.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Verification Form */}
      <div className={`md:w-1/2 flex items-center justify-center p-6 md:p-12 ${isRTL ? 'md:order-1' : ''}`}>
        <div className='w-full max-w-md bg-white rounded-xl shadow-lg p-8'>
          <div className={`text-center mb-8 ${isRTL ? 'text-right' : ''}`}>
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
              {t("Verify Your Email")}
            </h2>
            <p style={{ color: "#666666" }} className='mt-1'>
              {t("Access your KUFE account")}
            </p>

            {fromLogin && (
              <div
                className={`p-4 mb-6 flex items-center text-sm rounded-lg mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}
                style={{
                  backgroundColor: "rgba(0, 123, 255, 0.1)",
                  color: "#0056b3",
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className={`h-5 w-5 flex-shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`}
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
                <div>
                  <p className="font-medium">{t("Email verification required")}</p>
                  <p>{t("Please verify your email address to complete the login process.")}</p>
                </div>
              </div>
            )}

            <p style={{ color: "#666666" }} className='mt-2'>
              {t("We've sent a verification code to")} <span className="font-medium">{email}</span>
            </p>
            <p style={{ color: "#999999" }} className='text-sm mt-1'>
              {t("Enter the 6-digit code below to verify your email address")}
            </p>
            <p style={{ color: "#999999" }} className='text-sm mt-1'>
              {t("Code expires in")}: <span className="font-medium">{formatTime(countdown)}</span>
            </p>
          </div>

          {error && (
            <div
              className={`p-4 mb-6 flex items-center text-sm rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}
              style={{
                backgroundColor: "rgba(220, 38, 38, 0.1)",
                color: "#9B1C1C",
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className={`h-5 w-5 flex-shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`}
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
              className={`p-4 mb-6 flex items-center text-sm rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}
              style={{
                backgroundColor: "rgba(0, 128, 0, 0.1)",
                color: "#006400",
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className={`h-5 w-5 flex-shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`}
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
              <span>{typeof success === "string" ? success : t("OTP verified successfully!")}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className={`flex justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500"
                  style={{ backgroundColor: "#FFFFFF" }}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || countdown === 0}
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
                  {t("Verifying...")}
                </>
              ) : (
                <>
                  {t("Verify Email")}
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d={isRTL ? 'M19 12H5' : 'M5 12h14'}></path>
                    <path d={isRTL ? 'M12 19l-7-7 7-7' : 'M12 5l7 7-7 7'}></path>
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className={`text-center mt-6 ${isRTL ? 'text-right' : ''}`}>
            <p style={{ color: "#666666" }}>
              {t("Didn't receive the code?")}{" "}
              <button
                onClick={handleResendOTP}
                disabled={loading || countdown > 590} // Disable for first 10 seconds
                className="font-medium hover:underline disabled:opacity-50"
                style={{ color: "#004B87" }}
              >
                {t("Resend OTP")}
              </button>
            </p>
            <p className="text-sm mt-2" style={{ color: "#999999" }}>
              <button
                onClick={() => navigate("/login")}
                className="font-medium hover:underline"
                style={{ color: "#004B87" }}
              >
                {t("Back to Login")}
              </button>
            </p>
          </div>

          <div className='mt-8 pt-6 border-t border-gray-200'>
            <p className={`text-xs ${isRTL ? 'text-right' : 'text-center'}`} style={{ color: "#666666" }}>
              {t("By verifying, you agree to our")}{" "}
              <a href='#' className='underline' style={{ color: "#004B87" }}>
                {t("Terms of Service")}
              </a>{" "}
              {t("and")}{" "}
              <a href='#' className='underline' style={{ color: "#004B87" }}>
                {t("Privacy Policy")}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
