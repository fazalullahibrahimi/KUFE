import React from "react";
import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import FormField from "../common/FormField";
import { useLanguage } from "../../contexts/LanguageContext";

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

  // Get auth token from local storage
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Create headers with auth token
  const createHeaders = () => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // Fetch committee members, departments and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const headers = createHeaders();

        // Fetch users
        const usersResponse = await fetch(
          "http://localhost:4400/api/v1/user/justNameOfComiteeMembers",
          {
            headers,
          }
        );
        const usersData = await usersResponse.json();
        console.log("Users data:", usersData);
        setUsers(usersData);

        // Fetch departments
        const departmentsResponse = await fetch(
          "http://localhost:4400/api/v1/departments/",
          {
            headers,
          }
        );
        const departmentsData = await departmentsResponse.json();
        console.log("Departments data:", departmentsData);
        setDepartments(departmentsData.data.departments);

        // Fetch committee members
        try {
          const committeeMembersResponse = await fetch(
            "http://127.0.0.1:4400/api/v1/committee-members/",
            {
              headers,
            }
          );
          const committeeMembersData = await committeeMembersResponse.json();
          console.log("Committee members data:", committeeMembersData);

          if (
            committeeMembersData &&
            committeeMembersData.data &&
            committeeMembersData.data.committeeMembers &&
            Array.isArray(committeeMembersData.data.committeeMembers)
          ) {
            setCommitteeMembers(committeeMembersData.data.committeeMembers);
          } else if (
            committeeMembersData &&
            committeeMembersData.data &&
            Array.isArray(committeeMembersData.data)
          ) {
            setCommitteeMembers(committeeMembersData.data);
          } else {
            console.warn(
              "Committee members data structure is not as expected:",
              committeeMembersData
            );
            setCommitteeMembers([]);
          }
        } catch (error) {
          console.error("Error fetching committee members:", error);
          setCommitteeMembers([]);
        }

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
  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch(
        "http://127.0.0.1:4400/api/v1/committee-members/",
        {
          method: "POST",
          headers: createHeaders(),
          body: JSON.stringify({
            userId: formData.userId,
            department: formData.department,
            academicRank: formData.academicRank,
            committeePosition: formData.committeePosition,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Add member response:", data);

        // Refresh the committee members list
        const refreshResponse = await fetch(
          "http://127.0.0.1:4400/api/v1/committee-members/",
          {
            headers: createHeaders(),
          }
        );
        const refreshData = await refreshResponse.json();

        if (
          refreshData &&
          refreshData.data &&
          refreshData.data.committeeMembers &&
          Array.isArray(refreshData.data.committeeMembers)
        ) {
          setCommitteeMembers(refreshData.data.committeeMembers);
        } else if (
          refreshData &&
          refreshData.data &&
          Array.isArray(refreshData.data)
        ) {
          setCommitteeMembers(refreshData.data);
        }

        setIsAddModalOpen(false);
        resetForm();
      } else {
        const errorData = await response.json();
        console.error("Error adding committee member:", errorData);
      }
    } catch (error) {
      console.error("Error adding committee member:", error);
    }
  };

  // Handle edit committee member
  const handleEditMember = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:4400/api/v1/committee-members/${selectedMember._id}`,
        {
          method: "PATCH",
          headers: createHeaders(),
          body: JSON.stringify({
            userId: formData.userId,
            department: formData.department,
            academicRank: formData.academicRank,
            committeePosition: formData.committeePosition,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
          }),
        }
      );

      if (response.ok) {
        // Refresh the committee members list
        const refreshResponse = await fetch(
          "http://127.0.0.1:4400/api/v1/committee-members/",
          {
            headers: createHeaders(),
          }
        );
        const refreshData = await refreshResponse.json();

        if (
          refreshData &&
          refreshData.data &&
          refreshData.data.committeeMembers &&
          Array.isArray(refreshData.data.committeeMembers)
        ) {
          setCommitteeMembers(refreshData.data.committeeMembers);
        } else if (
          refreshData &&
          refreshData.data &&
          Array.isArray(refreshData.data)
        ) {
          setCommitteeMembers(refreshData.data);
        }

        setIsEditModalOpen(false);
        resetForm();
      } else {
        const errorData = await response.json();
        console.error("Error updating committee member:", errorData);
      }
    } catch (error) {
      console.error("Error updating committee member:", error);
    }
  };

  // Handle delete committee member
  const handleDeleteMember = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:4400/api/v1/committee-members/${selectedMember._id}`,
        {
          method: "DELETE",
          headers: createHeaders(),
        }
      );

      if (response.ok) {
        // Refresh the committee members list
        const refreshResponse = await fetch(
          "http://127.0.0.1:4400/api/v1/committee-members/",
          {
            headers: createHeaders(),
          }
        );
        const refreshData = await refreshResponse.json();

        if (
          refreshData &&
          refreshData.data &&
          refreshData.data.committeeMembers &&
          Array.isArray(refreshData.data.committeeMembers)
        ) {
          setCommitteeMembers(refreshData.data.committeeMembers);
        } else if (
          refreshData &&
          refreshData.data &&
          Array.isArray(refreshData.data)
        ) {
          setCommitteeMembers(refreshData.data);
        }

        setIsDeleteModalOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Error deleting committee member:", errorData);
      }
    } catch (error) {
      console.error("Error deleting committee member:", error);
    }
  };

  // Open edit modal and populate form
  const openEditModal = (member) => {
    console.log("Opening edit modal with member:", member);

    // Store the selected member
    setSelectedMember(member);

    // Get the user ID from the member
    let userId = "";
    if (
      member.userId &&
      typeof member.userId === "object" &&
      member.userId._id
    ) {
      userId = member.userId._id;
    } else if (typeof member.userId === "string") {
      userId = member.userId;
    }

    // Get the department ID from the member
    let departmentId = "";
    if (
      member.department &&
      typeof member.department === "object" &&
      member.department._id
    ) {
      departmentId = member.department._id;
    } else if (typeof member.department === "string") {
      departmentId = member.department;
    }

    console.log(
      "Setting form data with userId:",
      userId,
      "and departmentId:",
      departmentId
    );

    // Set the form data
    setFormData({
      userId: userId,
      department: departmentId,
      academicRank: member.academicRank || "",
      committeePosition: member.committeePosition || "",
      email: member.email || "",
      phoneNumber: member.phoneNumber || "",
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
  const filteredMembers = Array.isArray(committeeMembers)
    ? committeeMembers.filter((member) => {
        const searchString = searchTerm.toLowerCase();
        return (
          (member.userId?.fullName || "")
            .toLowerCase()
            .includes(searchString) ||
          (member.email || "").toLowerCase().includes(searchString) ||
          (member.academicRank || "").toLowerCase().includes(searchString) ||
          (member.committeePosition || "")
            .toLowerCase()
            .includes(searchString) ||
          (member.department?.name || "").toLowerCase().includes(searchString)
        );
      })
    : [];

  // Table columns configuration
  const columns = [
    {
      header: "Name",
      accessor: "userId.fullName",
      render: (row) => row.userId?.fullName || "N/A",
    },
    {
      header: "Department",
      accessor: "department.name",
      render: (row) => row.department?.name || "N/A",
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

  // Debug function to check if a user is selected in the dropdown
  const debugUserSelection = () => {
    console.log("Current formData.userId:", formData.userId);
    console.log("Available users:", users);
    const selectedUser = users.find((user) => user._id === formData.userId);
    console.log("Selected user:", selectedUser);
  };

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
                label: user.fullName,
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
              type='text'
              value={formData.academicRank}
              onChange={handleInputChange}
              placeholder='Enter academic rank'
              required
              error={formErrors.academicRank}
            />
            <FormField
              label={t("Committee Position")}
              name='committeePosition'
              type='text'
              value={formData.committeePosition}
              onChange={handleInputChange}
              placeholder='Enter committee position'
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
        onOpen={debugUserSelection} // Debug when modal opens
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
                label: user.fullName,
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
              type='text'
              value={formData.academicRank}
              onChange={handleInputChange}
              placeholder='Enter academic rank'
              required
              error={formErrors.academicRank}
            />
            <FormField
              label={t("Committee Position")}
              name='committeePosition'
              type='text'
              value={formData.committeePosition}
              onChange={handleInputChange}
              placeholder='Enter committee position'
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
                {selectedMember.userId?.fullName || "N/A"}
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-500'>{t("Department")}</p>
                  <p>{selectedMember.department?.name || "N/A"}</p>
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
                {selectedMember.userId?.fullName || t("This member")}
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

export default CommitteeMemberManagement;
