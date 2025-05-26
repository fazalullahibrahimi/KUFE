import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Search,
  Loader,
  AlertCircle,
  XCircle
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';

const SemesterManagement = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [formData, setFormData] = useState({
    name: ''
  });

  // Fetch semesters
  const fetchSemesters = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/semesters`);
      if (response.data.status === 'success') {
        setSemesters(response.data.data.semesters || []);
      }
    } catch (error) {
      console.error('Error fetching semesters:', error);
      setError('Failed to fetch semesters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (editingSemester) {
        // Update semester
        await axios.patch(`${API_URL}/semesters/${editingSemester._id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        // Create new semester
        await axios.post(`${API_URL}/semesters`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      }

      setShowModal(false);
      setEditingSemester(null);
      resetForm();
      fetchSemesters();
    } catch (error) {
      console.error('Error saving semester:', error);
      setError(error.response?.data?.message || 'Failed to save semester');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: ''
    });
  };

  // Handle edit
  const handleEdit = (semester) => {
    setEditingSemester(semester);
    setFormData({
      name: semester.name
    });
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (semesterId) => {
    if (window.confirm('Are you sure you want to delete this semester?')) {
      try {
        await axios.delete(`${API_URL}/semesters/${semesterId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchSemesters();
      } catch (error) {
        console.error('Error deleting semester:', error);
        setError(error.response?.data?.message || 'Failed to delete semester');
      }
    }
  };

  // Filter semesters
  const filteredSemesters = semesters.filter(semester =>
    semester.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div className={`space-y-6 transition-all duration-300 ${showModal ? 'filter brightness-75 pointer-events-none' : ''}`}>
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#E8ECEF]/30 to-[#E8ECEF]/50 rounded-2xl border border-[#E8ECEF]/50 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3D6F]/5 via-transparent to-[#2C4F85]/5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#F7B500]/10 to-transparent rounded-full blur-3xl"></div>

        <div className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-[#1D3D6F] to-[#2C4F85] rounded-xl shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#000000] via-[#1D3D6F] to-[#2C4F85] bg-clip-text text-transparent">
                  Semester Management
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage academic semesters
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingSemester(null);
                setShowModal(true);
              }}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white rounded-lg hover:from-[#2C4F85] hover:to-[#1D3D6F] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Semester
            </button>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Semesters</p>
                  <p className="text-2xl font-bold text-[#1D3D6F]">{semesters.length}</p>
                </div>
                <div className="p-3 bg-[#E8ECEF] rounded-lg">
                  <Calendar className="h-6 w-6 text-[#1D3D6F]" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Year</p>
                  <p className="text-2xl font-bold text-[#2C4F85]">{new Date().getFullYear()}</p>
                </div>
                <div className="p-3 bg-[#E8ECEF] rounded-lg">
                  <Calendar className="h-6 w-6 text-[#2C4F85]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 font-medium">{error}</p>
          <button
            onClick={() => setError('')}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Search and Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search semesters..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3D6F] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Semesters List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-[#1D3D6F]" />
            <span className="ml-2 text-gray-600">Loading semesters...</span>
          </div>
        ) : filteredSemesters.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Semesters Found</h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'No semesters match your search criteria.'
                : 'Get started by adding your first semester.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSemesters.map((semester) => (
              <div
                key={semester._id}
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#E8ECEF] rounded-lg">
                    <Calendar className="h-5 w-5 text-[#1D3D6F]" />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(semester)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit Semester"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(semester._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete Semester"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {semester.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(semester.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* Modal for Add/Edit Semester */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] bg-clip-text text-transparent">
                  {editingSemester ? 'Edit Semester' : 'Add New Semester'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingSemester(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3D6F] focus:border-transparent"
                    placeholder="e.g., Fall 2024, Spring 2025"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingSemester(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white rounded-lg hover:from-[#2C4F85] hover:to-[#1D3D6F] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin mr-2" />
                        {editingSemester ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        {editingSemester ? 'Update Semester' : 'Create Semester'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemesterManagement;
