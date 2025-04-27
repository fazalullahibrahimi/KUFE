import React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Kandahar_Economic from "../../public/Kandahar_Economic.jpg"

function ResendVerification() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Try to get email from localStorage if available
  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingVerificationEmail")
    if (storedEmail) {
      setEmail(storedEmail)
    }
  }, [])

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
        navigate("/verify-email", {
          state: { email },
        })
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send verification email. Please try again.")
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

      {/* Right Side - Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Email Verification</h1>
            <p className="text-gray-600 mt-2">Please confirm your email address to receive a verification code</p>
          </div>

          {error && <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">{error}</div>}

          {success && (
            <div className="p-3 mb-4 text-sm text-green-800 bg-green-100 rounded-lg">
              Verification code sent successfully! Redirecting to verification page...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 shadow-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-900 transition duration-300 shadow-md disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already verified?{" "}
              <button onClick={() => navigate("/login")} className="text-gray-700 font-semibold hover:underline">
                Back to Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResendVerification
