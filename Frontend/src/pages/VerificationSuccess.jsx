import React from "react"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Kandahar_Economic from "../../public/Kandahar_Economic.jpg"

function VerificationSuccess() {
  const navigate = useNavigate()

  // Redirect to dashboard after 5 seconds
  useEffect(() => {
    const token = localStorage.getItem("token")

    const timer = setTimeout(() => {
      if (token) {
        // If user is authenticated, redirect to dashboard
        navigate("/dashboard")
      } else {
        // Otherwise redirect to login
        navigate("/login")
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigate])

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
            Empowering minds, building futures through excellence in economic education.
          </p>
        </div>
      </div>

      {/* Right Side - Success Message */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-8 bg-white">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">Email Verified Successfully!</h1>

          <p className="text-gray-600 mb-8">
            Your email has been verified. You can now access all features of the Faculty of Economics portal.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/dashboardv1")}
              className="w-full bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-900 transition duration-300 shadow-md"
            >
              Go to Dashboard
            </button>

            <p className="text-sm text-gray-500">You will be redirected automatically in a few seconds...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerificationSuccess
