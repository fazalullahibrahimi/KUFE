import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Search,
  Loader,
  AlertCircle,
  XCircle,
  BookOpen,
  Activity,
  Building2,
  BarChart3,
  User,
  Award
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';
import { useLanguage } from '../../contexts/LanguageContext';
import Table from '../common/Table';

const SemesterManagement = () => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ps' || language === 'dr';

  const [semesters, setSemesters] = useState([]);
  const [departments, setDepartments] = useState([]);
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

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_URL}/departments`);
      if (response.data.status === 'success') {
        setDepartments(response.data.data.departments || []);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchSemesters();
    fetchDepartments();
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
    if (window.confirm(t('confirmDelete'))) {
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
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative bg-gradient-to-br from-[#004B87] via-[#1D3D6F] to-[#2C4F85] rounded-3xl p-8 text-white overflow-hidden shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4B400] rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#16A085] rounded-full translate-y-32 -translate-x-32 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-ping delay-2000"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30 mr-4">
                <Calendar className="h-8 w-8 text-[#F4B400]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-[#F4B400] to-white bg-clip-text text-transparent">
                  {t("semesterManagement")}
                </h1>
                <p className="text-white/90 text-lg">
                  {t("manageAcademicSemesters")}
                </p>
              </div>
            </div>
            <div className="flex items-center text-white/70">
              <div className="w-2 h-2 bg-[#F4B400] rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">
                {t("manageAcademicSemesters")} • {semesters.length} {t("semesters")}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="text-right mb-3 sm:mb-0">
              <div className="text-2xl font-bold text-[#F4B400]">
                {semesters.length}
              </div>
              <div className="text-white/60 text-sm">
                {t("totalSemesters")}
              </div>
            </div>
            <button
              className="group bg-white/20 hover:bg-[#F4B400] px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-[#F4B400] hover:scale-105 hover:shadow-xl flex items-center"
              onClick={() => {
                resetForm();
                setEditingSemester(null);
                setShowModal(true);
              }}
              disabled={loading}
            >
              <Plus className="h-5 w-5 mr-2 transition-all duration-300 group-hover:text-[#004B87] text-white" />
              <span className="font-medium transition-all duration-300 group-hover:text-[#004B87] text-white">
                {t("addNewSemester")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Semesters Card */}
        <div className="group bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{t("totalSemesters")}</h3>
              </div>
              <p className="text-3xl font-bold">{semesters.length}</p>
              <p className="text-white/80 text-sm mt-1">{t("academicSemester")}</p>
            </div>
          </div>
        </div>

        {/* Active Semesters Card */}
        <div className="group bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{t("activeSemesters")}</h3>
              </div>
              <p className="text-3xl font-bold">{semesters.length}</p>
              <p className="text-white/80 text-sm mt-1">{t("currentYear")}</p>
            </div>
          </div>
        </div>

        {/* Current Year Card */}
        <div className="group bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{t("currentYear")}</h3>
              </div>
              <p className="text-3xl font-bold">{new Date().getFullYear()}</p>
              <p className="text-white/80 text-sm mt-1">{t("academicYear")}</p>
            </div>
          </div>
        </div>

        {/* Departments Card */}
        <div className="group bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{t("departments")}</h3>
              </div>
              <p className="text-3xl font-bold">{departments.length}</p>
              <p className="text-white/80 text-sm mt-1">{t("semestersByYear")}</p>
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

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      )}

      {/* Semester Table */}
      <Table
        columns={[
          {
            header: t("semesterName"),
            accessor: "name",
            render: (row) => (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-md mr-3">
                  <Calendar size={16} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{row.name}</div>
                  <div className="text-sm text-gray-500">{t("academicSemester")}</div>
                </div>
              </div>
            )
          },
          {
            header: t("academicYear"),
            accessor: "year",
            render: (row) => (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date().getFullYear()}
              </div>
            )
          },
          {
            header: t("status"),
            accessor: "status",
            render: (row) => (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <Activity className="h-3 w-3 mr-1" />
                {t("active")}
              </div>
            )
          },
          {
            header: t("startDate"),
            accessor: "createdAt",
            render: (row) => (
              <div className="text-sm text-gray-900">
                {new Date(row.createdAt || Date.now()).toLocaleDateString()}
              </div>
            )
          }
        ]}
        data={filteredSemesters}
        actions={true}
        onEdit={(semester) => handleEdit(semester)}
        onDelete={(semester) => handleDelete(semester._id)}
      />



      {/* Modal for Add/Edit Semester */}
      {showModal && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] bg-clip-text text-transparent">
                  {editingSemester ? t('editSemester') : t('addNewSemester')}
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
                    {t('semesterName')} *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3D6F] focus:border-transparent"
                    placeholder={t('semesterExample')}
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
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-[#1D3D6F] to-[#2C4F85] text-white rounded-lg hover:from-[#2C4F85] hover:to-[#1D3D6F] transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin mr-2" />
                        {editingSemester ? t('updating') : t('creating')}
                      </>
                    ) : (
                      <>
                        {editingSemester ? t('updateSemester') : t('createSemester')}
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
