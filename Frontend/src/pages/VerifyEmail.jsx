import React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import Kandahar_Economic from "../../public/Kandahar_Economic.jpg"

function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()

  // Get email from location state or localStorage
  const email = location.state?.email || localStorage.getItem("pendingVerificationEmail")

  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(600) // 10 minutes in seconds

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
        navigate("/verification-success")
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
      await axios.post("http://localhost:4400/api/users/resend-verification-otp", { email })
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
    <div className="flex min-h-screen">
      {/* Left Side - Image with Text */}
      <div
        className="hidden md:flex md:w-1/2 relative flex-col justify-center px-10 text-white bg-cover bg-center before:absolute before:inset-0 before:bg-black before:opacity-60 before:z-0"
        style={{
          backgroundImage: `url(${Kandahar_Economic})`,
        }}
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Kandahar University</h1>
          <h2 className="text-2xl font-semibold mb-4">Faculty of Economics</h2>
          <p className="text-sm max-w-sm">
            Verify your email to access all features of the Faculty of Economics portal.
          </p>
        </div>
      </div>

      {/* Right Side - Verification Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Verify Your Email</h1>
            <p className="text-gray-600 mt-2">
              We've sent a verification code to <span className="font-medium">{email}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">Enter the 6-digit code below to verify your email address</p>
            <p className="text-sm text-gray-500 mt-1">
              Code expires in: <span className="font-medium">{formatTime(countdown)}</span>
            </p>
          </div>

          {error && <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">{error}</div>}

          {success && (
            <div className="p-3 mb-4 text-sm text-green-800 bg-green-100 rounded-lg">
              {typeof success === "string" ? success : "OTP verified successfully!"}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
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
              className="w-full bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-900 transition duration-300 shadow-md disabled:bg-gray-400"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Didn't receive the code?{" "}
              <button
                onClick={handleResendOTP}
                disabled={loading || countdown > 590} // Disable for first 10 seconds
                className="text-blue-600 hover:underline disabled:text-gray-400"
              >
                Resend OTP
              </button>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              <button onClick={() => navigate("/login")} className="text-gray-700 hover:underline">
                Back to Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
