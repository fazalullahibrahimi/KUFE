import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "../components/Navbar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
} from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        dateOfBirth: user.dateOfBirth || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement profile update API call
      console.log("Saving profile:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      dateOfBirth: user.dateOfBirth || "",
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen={true} message='Loading profile...' />;
  }

  if (!user) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Navbar />
        <div className='pt-20 flex items-center justify-center'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Access Denied
            </h2>
            <p className='text-gray-600'>Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='pt-20 pb-12'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-6'>
            <div className='px-6 py-8'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-6'>
                  {/* Profile Picture */}
                  <div className='relative'>
                    <div className='w-24 h-24 bg-[#1D3D6F] rounded-full flex items-center justify-center'>
                      <User className='h-12 w-12 text-white' />
                    </div>
                    <button className='absolute bottom-0 right-0 w-8 h-8 bg-[#F7B500] rounded-full flex items-center justify-center hover:bg-[#F7B500]/90 transition-colors'>
                      <Camera className='h-4 w-4 text-[#1D3D6F]' />
                    </button>
                  </div>

                  {/* User Info */}
                  <div>
                    <h1 className='text-2xl font-bold text-gray-900'>
                      {user.fullName}
                    </h1>
                    <p className='text-gray-600'>{user.email}</p>
                    <span className='inline-block mt-2 px-3 py-1 text-sm font-medium bg-[#1D3D6F] text-white rounded-full capitalize'>
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <div className='flex space-x-3'>
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        className='flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
                      >
                        <X className='h-4 w-4' />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className='flex items-center space-x-2 px-4 py-2 bg-[#1D3D6F] text-white rounded-lg hover:bg-[#2C4F85] transition-colors disabled:opacity-50'
                      >
                        {isSaving ? (
                          <LoadingSpinner size='small' color='white' />
                        ) : (
                          <Save className='h-4 w-4' />
                        )}
                        <span>{isSaving ? "Saving..." : "Save"}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className='flex items-center space-x-2 px-4 py-2 bg-[#F7B500] text-[#1D3D6F] rounded-lg hover:bg-[#F7B500]/90 transition-colors'
                    >
                      <Edit className='h-4 w-4' />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
            <div className='px-6 py-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-6'>
                Profile Information
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Full Name */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <User className='inline h-4 w-4 mr-2' />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type='text'
                      name='fullName'
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3D6F] focus:border-transparent'
                    />
                  ) : (
                    <p className='text-gray-900 py-2'>
                      {user.fullName || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <Mail className='inline h-4 w-4 mr-2' />
                    Email Address
                  </label>
                  <p className='text-gray-900 py-2'>{user.email}</p>
                  <p className='text-xs text-gray-500'>
                    Email cannot be changed
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <Phone className='inline h-4 w-4 mr-2' />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type='tel'
                      name='phone'
                      value={formData.phone}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3D6F] focus:border-transparent'
                    />
                  ) : (
                    <p className='text-gray-900 py-2'>
                      {user.phone || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <Calendar className='inline h-4 w-4 mr-2' />
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type='date'
                      name='dateOfBirth'
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3D6F] focus:border-transparent'
                    />
                  ) : (
                    <p className='text-gray-900 py-2'>
                      {user.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString()
                        : "Not provided"}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <MapPin className='inline h-4 w-4 mr-2' />
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name='address'
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3D6F] focus:border-transparent'
                    />
                  ) : (
                    <p className='text-gray-900 py-2'>
                      {user.address || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 mt-6'>
            <div className='px-6 py-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-6'>
                Account Information
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    User ID
                  </label>
                  <p className='text-gray-900 py-2 font-mono text-sm'>
                    {user.id || user._id}
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Account Type
                  </label>
                  <p className='text-gray-900 py-2 capitalize'>{user.role}</p>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Member Since
                  </label>
                  <p className='text-gray-900 py-2'>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Last Updated
                  </label>
                  <p className='text-gray-900 py-2'>
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
