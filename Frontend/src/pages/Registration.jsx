// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import Kandahar_Economic from "../../public/Kandahar_Economic.jpg";

// function Registration() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     role: "student",
//     image: "",
//   });

//   const [focusedField, setFocusedField] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: name === "image" ? files[0] : value,
//     });
//   };

//   const handleFocus = (field) => setFocusedField(field);
//   const handleBlur = (field) => {
//     if (!formData[field]) setFocusedField("");
//   };

//   const validateForm = () => {
//     if (!formData.fullName.trim()) return "Full Name is required.";
//     if (!formData.email.trim()) return "Email is required.";
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
//       return "Enter a valid email address.";
//     if (!formData.password.trim()) return "Password is required.";
//     if (formData.password.length < 6)
//       return "Password must be at least 6 characters long.";
//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccessMessage("");

//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       setLoading(false);
//       return;
//     }

//     try {
//       const formDataToSubmit = new FormData();
//       formDataToSubmit.append("fullName", formData.fullName);
//       formDataToSubmit.append("email", formData.email);
//       formDataToSubmit.append("password", formData.password);
//       formDataToSubmit.append("role", formData.role);
//       formDataToSubmit.append("image", formData.image || "default-user.jpg");

//       const response = await axios.post(
//         "http://localhost:4400/api/v1/user/register",
//         formDataToSubmit,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       localStorage.setItem("token", response.data.token);
//       setSuccessMessage("Registration successful! Redirecting to login...");

//       setTimeout(() => navigate("/login"), 2000);

//       setFormData({
//         fullName: "",
//         email: "",
//         password: "",
//         role: "student",
//         image: "",
//       });
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className='flex min-h-screen'>
//       {/* Left Side - Image with Text */}
//       <div
//         className='hidden md:flex md:w-1/2 relative flex-col justify-center px-10 text-white bg-cover bg-center before:absolute before:inset-0 before:bg-black before:opacity-60 before:z-0'
//         style={{
//           backgroundImage: `url(${Kandahar_Economic})`,
//         }}
//       >
//         <div className='relative z-10'>
//           <h1 className='text-4xl font-bold mb-2'>Kandahar University</h1>
//           <h2 className='text-2xl font-semibold mb-4'>Faculty of Economics</h2>
//           <p className='text-sm max-w-sm'>
//             Empowering minds, building futures through excellence in economic
//             education.
//           </p>
//         </div>
//       </div>

//       {/* Right Side - Form */}
//       <div className='flex items-center justify-center w-full md:w-1/2 p-8 bg-white'>
//         <div className='w-full max-w-md'>
//           <form onSubmit={handleSubmit}>
//             <h1 className='text-3xl font-bold text-center text-gray-800 mb-6'>
//               Create Your Account
//             </h1>
//             {error && <p className='text-red-500 text-center'>{error}</p>}
//             {successMessage && (
//               <p className='text-green-500 text-center'>{successMessage}</p>
//             )}

//             <div className='space-y-4'>
//               {/* Full Name */}
//               <div className='relative'>
//                 <label
//                   className={`absolute left-3 transition-all ${
//                     focusedField === "fullName" || formData.fullName
//                       ? "top-[-6px] text-xs text-gray-700 font-semibold bg-white px-1"
//                       : "top-3 text-gray-500"
//                   }`}
//                   htmlFor='fullName'
//                 >
//                   Full Name
//                 </label>
//                 <input
//                   type='text'
//                   name='fullName'
//                   id='fullName'
//                   className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 shadow-sm'
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   onFocus={() => handleFocus("fullName")}
//                   onBlur={() => handleBlur("fullName")}
//                   required
//                 />
//               </div>

//               {/* Email */}
//               <div className='relative'>
//                 <label
//                   className={`absolute left-3 transition-all ${
//                     focusedField === "email" || formData.email
//                       ? "top-[-6px] text-xs text-gray-700 font-semibold bg-white px-1"
//                       : "top-3 text-gray-500"
//                   }`}
//                   htmlFor='email'
//                 >
//                   Email
//                 </label>
//                 <input
//                   type='email'
//                   name='email'
//                   id='email'
//                   className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 shadow-sm'
//                   value={formData.email}
//                   onChange={handleChange}
//                   onFocus={() => handleFocus("email")}
//                   onBlur={() => handleBlur("email")}
//                   required
//                 />
//               </div>

//               {/* Password */}
//               <div className='relative'>
//                 <label
//                   className={`absolute left-3 transition-all ${
//                     focusedField === "password" || formData.password
//                       ? "top-[-6px] text-xs text-gray-700 font-semibold bg-white px-1"
//                       : "top-3 text-gray-500"
//                   }`}
//                   htmlFor='password'
//                 >
//                   Password
//                 </label>
//                 <input
//                   type='password'
//                   name='password'
//                   id='password'
//                   className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 shadow-sm'
//                   value={formData.password}
//                   onChange={handleChange}
//                   onFocus={() => handleFocus("password")}
//                   onBlur={() => handleBlur("password")}
//                   required
//                 />
//               </div>

//               {/* Role */}
//               <select
//                 name='role'
//                 id='role'
//                 className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 shadow-sm'
//                 value={formData.role}
//                 onChange={handleChange}
//               >
//                 <option value='admin'>Admin</option>
//                 <option value='faculty'>Faculty</option>
//                 <option value='student'>Student</option>
//               </select>

//               {/* Image Upload */}
//               <div>
//                 <label
//                   className='block text-sm font-semibold text-gray-700 mb-2'
//                   htmlFor='image'
//                 >
//                   Upload Image
//                 </label>
//                 <input
//                   type='file'
//                   name='image'
//                   id='image'
//                   className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 shadow-sm'
//                   onChange={handleChange}
//                   accept='image/*'
//                 />
//               </div>

//               <button
//                 type='submit'
//                 className='w-full bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-900 transition duration-300 shadow-md'
//                 disabled={loading}
//               >
//                 {loading ? "Registering..." : "Register"}
//               </button>
//             </div>
//           </form>

//           <p className='text-center mt-4 text-gray-600'>
//             Already have an account?
//             <Link
//               to='/login'
//               className='text-gray-700 font-semibold pl-2 hover:underline'
//             >
//               Login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Registration;





import React from "react"

import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import Kandahar_Economic from "../../public/Kandahar_Economic.jpg"

function Registration() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
    image: "",
  })

  const [focusedField, setFocusedField] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData({
      ...formData,
      [name]: name === "image" ? files[0] : value,
    })
  }

  const handleFocus = (field) => setFocusedField(field)
  const handleBlur = (field) => {
    if (!formData[field]) setFocusedField("")
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) return "Full Name is required."
    if (!formData.email.trim()) return "Email is required."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Enter a valid email address."
    if (!formData.password.trim()) return "Password is required."
    if (formData.password.length < 6) return "Password must be at least 6 characters long."
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setLoading(false)
      return
    }

    try {
      const formDataToSubmit = new FormData()
      formDataToSubmit.append("fullName", formData.fullName)
      formDataToSubmit.append("email", formData.email)
      formDataToSubmit.append("password", formData.password)
      formDataToSubmit.append("role", formData.role)
      formDataToSubmit.append("image", formData.image || "default-user.jpg")

      // Make sure this endpoint matches your backend API
      const response = await axios.post("http://localhost:4400/api/v1/user/register", formDataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      console.log("Registration response:", response.data)

      // Store email for verification
      localStorage.setItem("pendingVerificationEmail", formData.email)

      // No need to look for a token during registration - it's correct that there isn't one

      setSuccessMessage("Registration successful! Redirecting to verification page...")

      // Redirect to resend-verification page after 3 seconds
      setTimeout(() => navigate("/resend-verification"), 3000)

      setFormData({
        fullName: "",
        email: "",
        password: "",
        role: "student",
        image: "",
      })
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message)
      setError(err.response?.data?.message || "Something went wrong")
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
            Empowering minds, building futures through excellence in economic education.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-8 bg-white">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit}>
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Your Account</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

            <div className="space-y-4">
              {/* Full Name */}
              <div className="relative">
                <label
                  className={`absolute left-3 transition-all ${
                    focusedField === "fullName" || formData.fullName
                      ? "top-[-6px] text-xs text-gray-700 font-semibold bg-white px-1"
                      : "top-3 text-gray-500"
                  }`}
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 shadow-sm"
                  value={formData.fullName}
                  onChange={handleChange}
                  onFocus={() => handleFocus("fullName")}
                  onBlur={() => handleBlur("fullName")}
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <label
                  className={`absolute left-3 transition-all ${
                    focusedField === "email" || formData.email
                      ? "top-[-6px] text-xs text-gray-700 font-semibold bg-white px-1"
                      : "top-3 text-gray-500"
                  }`}
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 shadow-sm"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus("email")}
                  onBlur={() => handleBlur("email")}
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label
                  className={`absolute left-3 transition-all ${
                    focusedField === "password" || formData.password
                      ? "top-[-6px] text-xs text-gray-700 font-semibold bg-white px-1"
                      : "top-3 text-gray-500"
                  }`}
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 shadow-sm"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus("password")}
                  onBlur={() => handleBlur("password")}
                  required
                />
              </div>

              {/* Role */}
              <select
                name="role"
                id="role"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 shadow-sm"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="admin">Admin</option>
                <option value="faculty">Faculty</option>
                <option value="student">Student</option>
                <option value="committeeMember">Commitee Member</option>
              </select>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="image">
                  Upload Image
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 shadow-sm"
                  onChange={handleChange}
                  accept="image/*"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-900 transition duration-300 shadow-md"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          <p className="text-center mt-4 text-gray-600">
            Already have an account?
            <Link to="/login" className="text-gray-700 font-semibold pl-2 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Registration
