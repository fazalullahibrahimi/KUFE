import React from "react";
import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import FormField from "../common/FormField";
import { useLanguage } from "../../context/LanguageContext";

const CommitteeMemberManagement = () => {
  const { t } = useLanguage();
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    userId: "",
    department: "",
    academicRank: "",
    committeePosition: "",
    email: "",
    phoneNumber: "",
  });

  // Academic ranks options
  const academicRanks = [
    { value: "Professor", label: "Professor" },
    { value: "Associate Professor", label: "Associate Professor" },
    { value: "Assistant Professor", label: "Assistant Professor" },
    { value: "Lecturer", label: "Lecturer" },
    { value: "Teaching Assistant", label: "Teaching Assistant" },
  ];

  // Committee positions options
  const committeePositions = [
    { value: "Chair", label: "Chair" },
    { value: "Secretary", label: "Secretary" },
    { value: "Member", label: "Member" },
    { value: "External Examiner", label: "External Examiner" },
    { value: "Advisor", label: "Advisor" },
  ];

  // Fetch committee members, departments and users
  useEffect(() => {
    // Simulating API calls
    const fetchData = async () => {
      try {
        // In a real application, these would be API calls
        // For now, we'll use mock data
        setCommitteeMembers(mockCommitteeMembers);
        setDepartments(mockDepartments);
        setUsers(mockUsers);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};

    if (!formData.userId) errors.userId = "User is required";
    if (!formData.department) errors.department = "Department is required";
    if (!formData.academicRank)
      errors.academicRank = "Academic rank is required";
    if (!formData.committeePosition)
      errors.committeePosition = "Committee position is required";

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\+?\d{10,15}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number (10-15 digits)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      userId: "",
      department: "",
      academicRank: "",
      committeePosition: "",
      email: "",
      phoneNumber: "",
    });
    setFormErrors({});
  };

  // Handle add committee member
  const handleAddMember = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // In a real application, this would be an API call
    const newMember = {
      _id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Get the full user and department objects based on IDs
      user: users.find((user) => user._id === formData.userId),
      departmentObj: departments.find(
        (dept) => dept._id === formData.department
      ),
    };

    setCommitteeMembers([...committeeMembers, newMember]);
    setIsAddModalOpen(false);
    resetForm();
  };

  // Handle edit committee member
  const handleEditMember = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // In a real application, this would be an API call
    const updatedMembers = committeeMembers.map((member) => {
      if (member._id === selectedMember._id) {
        return {
          ...member,
          ...formData,
          updatedAt: new Date().toISOString(),
          // Get the full user and department objects based on IDs
          user: users.find((user) => user._id === formData.userId),
          departmentObj: departments.find(
            (dept) => dept._id === formData.department
          ),
        };
      }
      return member;
    });

    setCommitteeMembers(updatedMembers);
    setIsEditModalOpen(false);
    resetForm();
  };

  // Handle delete committee member
  const handleDeleteMember = () => {
    // In a real application, this would be an API call
    const updatedMembers = committeeMembers.filter(
      (member) => member._id !== selectedMember._id
    );

    setCommitteeMembers(updatedMembers);
    setIsDeleteModalOpen(false);
  };

  // Open edit modal and populate form
  const openEditModal = (member) => {
    setSelectedMember(member);
    setFormData({
      userId: member.userId,
      department: member.department,
      academicRank: member.academicRank,
      committeePosition: member.committeePosition,
      email: member.email,
      phoneNumber: member.phoneNumber,
    });
    setIsEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (member) => {
    setSelectedMember(member);
    setIsViewModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (member) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  // Filter committee members based on search term
  const filteredMembers = committeeMembers.filter((member) => {
    const searchString = searchTerm.toLowerCase();
    return (
      member.user?.name?.toLowerCase().includes(searchString) ||
      member.email.toLowerCase().includes(searchString) ||
      member.academicRank.toLowerCase().includes(searchString) ||
      member.committeePosition.toLowerCase().includes(searchString) ||
      member.departmentObj?.name?.toLowerCase().includes(searchString)
    );
  });

  // Table columns configuration
  const columns = [
    {
      header: "Name",
      accessor: "user.name",
      render: (row) => row.user?.name || "N/A",
    },
    {
      header: "Department",
      accessor: "departmentObj.name",
      render: (row) => row.departmentObj?.name || "N/A",
    },
    {
      header: "Academic Rank",
      accessor: "academicRank",
    },
    {
      header: "Committee Position",
      accessor: "committeePosition",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Phone",
      accessor: "phoneNumber",
    },
  ];

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>
          {t("Committee Member Management")}
        </h1>
        <p className='text-gray-600'>
          {t("Manage committee members, their roles, and contact information")}
        </p>
      </div>

      {/* Search and Add */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <div className='relative w-full md:w-96'>
          <input
            type='text'
            placeholder={t("Search committee members...")}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87]'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
        </div>
        <button
          className='flex items-center gap-2 bg-[#004B87] text-white px-4 py-2 rounded-md hover:bg-[#003b6a] transition-colors'
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
        >
          <Plus size={18} />
          {t("Add Committee Member")}
        </button>
      </div>

      {/* Committee Members Table */}
      {isLoading ? (
        <div className='bg-white p-8 rounded-lg shadow text-center'>
          <p>{t("Loading committee members...")}</p>
        </div>
      ) : filteredMembers.length > 0 ? (
        <Table
          columns={columns}
          data={filteredMembers}
          actions={true}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      ) : (
        <div className='bg-white p-8 rounded-lg shadow text-center'>
          <p>
            {searchTerm
              ? t("No committee members found matching your search.")
              : t(
                  "No committee members found. Add your first committee member."
                )}
          </p>
        </div>
      )}

      {/* Add Committee Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={t("Add Committee Member")}
      >
        <form onSubmit={handleAddMember}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              label={t("User")}
              name='userId'
              type='select'
              value={formData.userId}
              onChange={handleInputChange}
              options={users.map((user) => ({
                value: user._id,
                label: user.name,
              }))}
              required
              error={formErrors.userId}
            />
            <FormField
              label={t("Department")}
              name='department'
              type='select'
              value={formData.department}
              onChange={handleInputChange}
              options={departments.map((dept) => ({
                value: dept._id,
                label: dept.name,
              }))}
              required
              error={formErrors.department}
            />
            <FormField
              label={t("Academic Rank")}
              name='academicRank'
              type='select'
              value={formData.academicRank}
              onChange={handleInputChange}
              options={academicRanks}
              required
              error={formErrors.academicRank}
            />
            <FormField
              label={t("Committee Position")}
              name='committeePosition'
              type='select'
              value={formData.committeePosition}
              onChange={handleInputChange}
              options={committeePositions}
              required
              error={formErrors.committeePosition}
            />
            <FormField
              label={t("Email")}
              name='email'
              type='email'
              value={formData.email}
              onChange={handleInputChange}
              placeholder='example@university.edu'
              required
              error={formErrors.email}
            />
            <FormField
              label={t("Phone Number")}
              name='phoneNumber'
              type='tel'
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder='+1234567890'
              required
              error={formErrors.phoneNumber}
            />
          </div>
          <div className='flex justify-end gap-3 mt-6'>
            <button
              type='button'
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              onClick={() => setIsAddModalOpen(false)}
            >
              {t("Cancel")}
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003b6a]'
            >
              {t("Add Committee Member")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Committee Member Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={t("Edit Committee Member")}
      >
        <form onSubmit={handleEditMember}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              label={t("User")}
              name='userId'
              type='select'
              value={formData.userId}
              onChange={handleInputChange}
              options={users.map((user) => ({
                value: user._id,
                label: user.name,
              }))}
              required
              error={formErrors.userId}
            />
            <FormField
              label={t("Department")}
              name='department'
              type='select'
              value={formData.department}
              onChange={handleInputChange}
              options={departments.map((dept) => ({
                value: dept._id,
                label: dept.name,
              }))}
              required
              error={formErrors.department}
            />
            <FormField
              label={t("Academic Rank")}
              name='academicRank'
              type='select'
              value={formData.academicRank}
              onChange={handleInputChange}
              options={academicRanks}
              required
              error={formErrors.academicRank}
            />
            <FormField
              label={t("Committee Position")}
              name='committeePosition'
              type='select'
              value={formData.committeePosition}
              onChange={handleInputChange}
              options={committeePositions}
              required
              error={formErrors.committeePosition}
            />
            <FormField
              label={t("Email")}
              name='email'
              type='email'
              value={formData.email}
              onChange={handleInputChange}
              placeholder='example@university.edu'
              required
              error={formErrors.email}
            />
            <FormField
              label={t("Phone Number")}
              name='phoneNumber'
              type='tel'
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder='+1234567890'
              required
              error={formErrors.phoneNumber}
            />
          </div>
          <div className='flex justify-end gap-3 mt-6'>
            <button
              type='button'
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              onClick={() => setIsEditModalOpen(false)}
            >
              {t("Cancel")}
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003b6a]'
            >
              {t("Update Committee Member")}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Committee Member Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={t("Committee Member Details")}
      >
        {selectedMember && (
          <div className='space-y-4'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-medium text-lg mb-2'>
                {selectedMember.user?.name || "N/A"}
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-500'>{t("Department")}</p>
                  <p>{selectedMember.departmentObj?.name || "N/A"}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>{t("Academic Rank")}</p>
                  <p>{selectedMember.academicRank}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>
                    {t("Committee Position")}
                  </p>
                  <p>{selectedMember.committeePosition}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>{t("Email")}</p>
                  <p>{selectedMember.email}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>{t("Phone Number")}</p>
                  <p>{selectedMember.phoneNumber}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>{t("Member Since")}</p>
                  <p>
                    {new Date(selectedMember.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className='flex justify-end'>
              <button
                className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
                onClick={() => setIsViewModalOpen(false)}
              >
                {t("Close")}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t("Confirm Deletion")}
      >
        <div className='p-4'>
          <p className='mb-4'>
            {t("Are you sure you want to delete this committee member?")}
            {selectedMember && (
              <span className='font-medium'>
                {" "}
                {selectedMember.user?.name || t("This member")}
              </span>
            )}
            ?
          </p>
          <p className='text-red-500 mb-4'>
            {t("This action cannot be undone.")}
          </p>
          <div className='flex justify-end gap-3'>
            <button
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              onClick={() => setIsDeleteModalOpen(false)}
            >
              {t("Cancel")}
            </button>
            <button
              className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
              onClick={handleDeleteMember}
            >
              {t("Delete")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Mock data for demonstration
const mockUsers = [
  { _id: "1", name: "Dr. Ahmad Ahmadi" },
  { _id: "2", name: "Prof. Sarah Johnson" },
  { _id: "3", name: "Dr. Mohammad Karimi" },
  { _id: "4", name: "Dr. Fatima Noori" },
  { _id: "5", name: "Prof. John Smith" },
];

const mockDepartments = [
  { _id: "1", name: "Economics" },
  { _id: "2", name: "Business Administration" },
  { _id: "3", name: "Finance" },
  { _id: "4", name: "Accounting" },
  { _id: "5", name: "Management" },
];

const mockCommitteeMembers = [
  {
    _id: "1",
    userId: "1",
    user: { _id: "1", name: "Dr. Ahmad Ahmadi" },
    department: "1",
    departmentObj: { _id: "1", name: "Economics" },
    academicRank: "Associate Professor",
    committeePosition: "Chair",
    email: "ahmad.ahmadi@ku.edu.af",
    phoneNumber: "+93700123456",
    createdAt: "2023-01-15T08:30:00.000Z",
    updatedAt: "2023-01-15T08:30:00.000Z",
  },
  {
    _id: "2",
    userId: "2",
    user: { _id: "2", name: "Prof. Sarah Johnson" },
    department: "2",
    departmentObj: { _id: "2", name: "Business Administration" },
    academicRank: "Professor",
    committeePosition: "Secretary",
    email: "sarah.johnson@ku.edu.af",
    phoneNumber: "+93700789012",
    createdAt: "2023-02-20T10:15:00.000Z",
    updatedAt: "2023-02-20T10:15:00.000Z",
  },
  {
    _id: "3",
    userId: "3",
    user: { _id: "3", name: "Dr. Mohammad Karimi" },
    department: "3",
    departmentObj: { _id: "3", name: "Finance" },
    academicRank: "Assistant Professor",
    committeePosition: "Member",
    email: "mohammad.karimi@ku.edu.af",
    phoneNumber: "+93700345678",
    createdAt: "2023-03-10T09:45:00.000Z",
    updatedAt: "2023-03-10T09:45:00.000Z",
  },
  {
    _id: "4",
    userId: "4",
    user: { _id: "4", name: "Dr. Fatima Noori" },
    department: "4",
    departmentObj: { _id: "4", name: "Accounting" },
    academicRank: "Lecturer",
    committeePosition: "Member",
    email: "fatima.noori@ku.edu.af",
    phoneNumber: "+93700567890",
    createdAt: "2023-04-05T11:30:00.000Z",
    updatedAt: "2023-04-05T11:30:00.000Z",
  },
  {
    _id: "5",
    userId: "5",
    user: { _id: "5", name: "Prof. John Smith" },
    department: "5",
    departmentObj: { _id: "5", name: "Management" },
    academicRank: "Professor",
    committeePosition: "External Examiner",
    email: "john.smith@ku.edu.af",
    phoneNumber: "+93700901234",
    createdAt: "2023-05-12T14:20:00.000Z",
    updatedAt: "2023-05-12T14:20:00.000Z",
  },
];

export default CommitteeMemberManagement;
