import React, { useState, useEffect } from "react";
import {
  User,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Camera,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Modal from "./common/Modal";
import FormField from "./common/FormField";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

const AdminProfile = ({ isOpen, onClose }) => {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();

  // Helper function to get user image URL
  const getUserImageUrl = () => {
    if (user?.image && user.image !== 'default-user.jpg' && user.image.trim() !== '') {
      return `http://localhost:4400/public/img/users/${user.image}`;
    }
    return null;
  };

  // State for admin profile data - initialize with actual user data
  const [adminData, setAdminData] = useState({
    name: user?.fullName || "User",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    role: user?.role || "User",
    department: user?.department || "",
    joinDate: user?.joinDate || "",
    avatar: getUserImageUrl() || "/placeholder.svg?height=120&width=120",
  });

  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...adminData });
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Get auth token from local storage
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Create headers with auth token
  const createHeaders = (includeContentType = true) => {
    const token = getAuthToken();
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
    };

    if (includeContentType) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  };

  // Load admin profile data
  useEffect(() => {
    if (isOpen && user) {
      // Update adminData when user data changes
      setAdminData({
        name: user?.fullName || "User",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        role: user?.role || "User",
        department: user?.department || "",
        joinDate: user?.joinDate || "",
        avatar: getUserImageUrl() || "/placeholder.svg?height=120&width=120",
      });
      setEditData({
        name: user?.fullName || "User",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        role: user?.role || "User",
        department: user?.department || "",
        joinDate: user?.joinDate || "",
        avatar: getUserImageUrl() || "/placeholder.svg?height=120&width=120",
      });
    }
  }, [isOpen, user]);

  const fetchAdminProfile = async () => {
    try {
      // This would be replaced with actual API call
      // const response = await fetch("http://127.0.0.1:4400/api/v1/admin/profile", {
      //   headers: createHeaders(),
      // });
      // const data = await response.json();
      // if (data.success) {
      //   setAdminData(data.admin);
      //   setEditData(data.admin);
      // }
      
      // For now, using mock data
      console.log("Loading admin profile...");
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const handleSaveProfile = async () => {
    try {
      // This would be replaced with actual API call
      // const response = await fetch("http://127.0.0.1:4400/api/v1/admin/profile", {
      //   method: "PUT",
      //   headers: createHeaders(),
      //   body: JSON.stringify(editData),
      // });
      // const data = await response.json();
      // if (data.success) {
      //   setAdminData(editData);
      //   setIsEditing(false);
      //   alert("Profile updated successfully!");
      // }
      
      // For now, using mock update
      setAdminData(editData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    try {
      // This would be replaced with actual API call
      // const response = await fetch("http://127.0.0.1:4400/api/v1/admin/change-password", {
      //   method: "POST",
      //   headers: createHeaders(),
      //   body: JSON.stringify({
      //     currentPassword: passwordData.currentPassword,
      //     newPassword: passwordData.newPassword,
      //   }),
      // });
      // const data = await response.json();
      // if (data.success) {
      //   setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      //   setIsChangePasswordOpen(false);
      //   alert("Password changed successfully!");
      // }
      
      // For now, using mock update
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsChangePasswordOpen(false);
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password. Please try again.");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData({
          ...editData,
          avatar: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const cancelEdit = () => {
    setEditData({ ...adminData });
    setIsEditing(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Profile Management"
        size="lg"
      >
        <div className={`space-y-6 ${isRTL ? "rtl" : "ltr"}`}>
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#E8ECEF]/50 to-[#E8ECEF]/30 p-6 rounded-xl border border-[#E8ECEF]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-[#1D3D6F] rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {(isEditing ? editData.avatar : adminData.avatar) &&
                     (isEditing ? editData.avatar : adminData.avatar) !== "/placeholder.svg?height=120&width=120" ? (
                      <img
                        src={isEditing ? editData.avatar : adminData.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallbackDiv = e.target.parentElement.querySelector('.fallback-icon');
                          if (fallbackDiv) {
                            fallbackDiv.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div className={`fallback-icon w-full h-full flex items-center justify-center ${
                      (isEditing ? editData.avatar : adminData.avatar) &&
                      (isEditing ? editData.avatar : adminData.avatar) !== "/placeholder.svg?height=120&width=120" ? 'hidden' : 'flex'
                    }`}>
                      <User className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-[#1D3D6F] text-white p-2 rounded-full cursor-pointer hover:bg-[#2C4F85] transition-colors">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1D3D6F]">
                    {adminData.name}
                  </h3>
                  <p className="text-[#2C4F85] font-medium capitalize">
                    {adminData.role === 'admin' ? 'System Administrator' : adminData.role}
                  </p>
                  {adminData.department && (
                    <p className="text-gray-600 text-sm">{adminData.department}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-[#1D3D6F] text-white rounded-lg hover:bg-[#2C4F85] transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Full Name"
              name="name"
              type="text"
              value={isEditing ? editData.name : adminData.name}
              onChange={handleInputChange}
              readOnly={!isEditing}
              icon={<User className="h-4 w-4" />}
            />
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={isEditing ? editData.email : adminData.email}
              onChange={handleInputChange}
              readOnly={!isEditing}
              icon={<Mail className="h-4 w-4" />}
            />
            <FormField
              label="Phone Number"
              name="phone"
              type="tel"
              value={isEditing ? editData.phone : adminData.phone}
              onChange={handleInputChange}
              readOnly={!isEditing}
              icon={<Phone className="h-4 w-4" />}
            />
            <FormField
              label="Department"
              name="department"
              type="text"
              value={isEditing ? editData.department : adminData.department}
              onChange={handleInputChange}
              readOnly={!isEditing}
              icon={<Shield className="h-4 w-4" />}
            />
            <FormField
              label="Address"
              name="address"
              type="text"
              value={isEditing ? editData.address : adminData.address}
              onChange={handleInputChange}
              readOnly={!isEditing}
              icon={<MapPin className="h-4 w-4" />}
              className="md:col-span-2"
            />
            <FormField
              label="Join Date"
              name="joinDate"
              type="date"
              value={isEditing ? editData.joinDate : adminData.joinDate}
              onChange={handleInputChange}
              readOnly={!isEditing}
              icon={<Calendar className="h-4 w-4" />}
            />
            <FormField
              label="Role"
              name="role"
              type="text"
              value={adminData.role}
              readOnly={true}
              icon={<Shield className="h-4 w-4" />}
              className="bg-gray-50"
            />
          </div>

          {/* Security Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-[#1D3D6F] flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Security Settings
              </h4>
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="flex items-center px-4 py-2 bg-[#F7B500] text-white rounded-lg hover:bg-[#F7B500]/90 transition-colors"
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </button>
            </div>
            <div className="bg-[#E8ECEF]/30 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Last password change: 30 days ago
              </p>
              <p className="text-sm text-gray-600">
                Two-factor authentication: Enabled
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        title="Change Password"
      >
        <div className="space-y-4">
          <div className="relative">
            <FormField
              label="Current Password"
              name="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="relative">
            <FormField
              label="New Password"
              name="newPassword"
              type={showPasswords.new ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="relative">
            <FormField
              label="Confirm New Password"
              name="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsChangePasswordOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleChangePassword}
              className="px-4 py-2 bg-[#1D3D6F] text-white rounded-lg hover:bg-[#2C4F85]"
            >
              Change Password
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminProfile;
