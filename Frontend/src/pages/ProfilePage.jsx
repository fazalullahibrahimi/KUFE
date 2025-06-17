import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "../components/Navbar";
import { User, Edit, Save, X, Camera } from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import axios from "axios";

const ProfilePage = () => {
  const { user, isLoading, updateUser } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Helper function to get user image URL
  const getUserImageUrl = () => {
    // Priority 1: Newly selected image preview (blob URL)
    if (imagePreview && imagePreview.startsWith('blob:')) {
      console.log('Using blob preview:', imagePreview);
      return imagePreview;
    }

    // Priority 2: Existing image preview (http URL)
    if (imagePreview && imagePreview.startsWith('http')) {
      console.log('Using http preview:', imagePreview);
      return imagePreview;
    }

    // Priority 3: User image from user object
    if (user?.image && user.image !== 'default-user.jpg' && user.image.trim() !== '') {
      const imageUrl = `http://localhost:4400/public/img/users/${user.image}`;
      console.log('Using user image URL:', imageUrl);
      return imageUrl;
    }

    console.log('No image available, user data:', user);
    return null;
  };

  useEffect(() => {
    if (user) {
      console.log('User data in ProfilePage:', user);

      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
      });

      // Force image preview update
      if (user.image && user.image !== 'default-user.jpg' && user.image.trim() !== '') {
        const imageUrl = `http://localhost:4400/public/img/users/${user.image}`;
        console.log('Setting image URL:', imageUrl);
        setImagePreview(imageUrl);

        // Preload the image to ensure it's available
        const img = new Image();
        img.onload = () => console.log('Image preloaded successfully:', imageUrl);
        img.onerror = () => console.error('Failed to preload image:', imageUrl);
        img.src = imageUrl;
      } else {
        console.log('No valid user image, setting preview to null');
        setImagePreview(null);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      console.log("Setting preview URL:", previewUrl); // Debug log
      setImagePreview(previewUrl);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      const response = await axios.patch(
        "http://localhost:4400/api/v1/user/profile",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status === 'success') {
        // Update the user data in AuthContext with the new data
        const updatedUserData = {
          ...user,
          fullName: response.data.data.user.fullName,
          email: response.data.data.user.email,
          image: response.data.data.user.image,
          role: response.data.data.user.role,
        };

        // Update the user data in context and localStorage
        updateUser(updatedUserData);

        // Update the form data state
        setFormData({
          fullName: response.data.data.user.fullName,
          email: response.data.data.user.email
        });

        // Update image preview with new image URL
        if (response.data.data.user.image && response.data.data.user.image !== 'default-user.jpg') {
          setImagePreview(`http://localhost:4400/public/img/users/${response.data.data.user.image}`);
        } else {
          setImagePreview(null);
        }

        alert("Profile updated successfully");
        setIsEditing(false);
        setSelectedImage(null);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert(error.response?.data?.message || "Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
    });

    // Reset image preview to original user image
    if (user.image && user.image !== 'default-user.jpg') {
      setImagePreview(`http://localhost:4400/public/img/users/${user.image}`);
    } else {
      setImagePreview(null);
    }

    setSelectedImage(null);
    setIsEditing(false);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen={true} message="Loading profile..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600">Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="px-6 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {/* Profile Picture */}
                  <div className="relative">
                    <div className="w-24 h-24 bg-[#1D3D6F] rounded-full flex items-center justify-center overflow-hidden">
                      {getUserImageUrl() ? (
                        <img
                          src={getUserImageUrl()}
                          alt={user?.fullName || 'Profile'}
                          className="w-full h-full object-cover"
                          onLoad={() => console.log('Image loaded successfully')}
                          onError={(e) => {
                            console.error("Image load error for URL:", e.target.src);
                            e.target.style.display = 'none';
                            const fallbackDiv = e.target.parentElement.querySelector('.fallback-icon');
                            if (fallbackDiv) {
                              fallbackDiv.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div className={`fallback-icon w-full h-full flex items-center justify-center ${getUserImageUrl() ? 'hidden' : 'flex'}`}>
                        <User className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#F7B500] rounded-full flex items-center justify-center hover:bg-[#F7B500]/90 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Camera className="h-4 w-4 text-[#1D3D6F]" />
                    </label>
                  </div>

                  {/* User Info */}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user.fullName}
                    </h1>
                    <p className="text-gray-600">{user.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 text-sm font-medium bg-[#1D3D6F] text-white rounded-full capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="flex space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center space-x-2 px-4 py-2 bg-[#1D3D6F] text-white rounded-lg hover:bg-[#2C4F85] transition-colors disabled:opacity-50"
                      >
                        {isSaving ? (
                          <LoadingSpinner size="small" color="white" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        <span>{isSaving ? "Saving..." : "Save"}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-[#F7B500] text-[#1D3D6F] rounded-lg hover:bg-[#F7B500]/90 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Profile Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3D6F] focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {user.fullName || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <p className="text-gray-900 py-2">{user.email}</p>
                  <p className="text-xs text-gray-500">
                    Email cannot be changed
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
