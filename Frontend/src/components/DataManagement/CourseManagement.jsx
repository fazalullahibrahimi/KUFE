import React from "react";
import { useState } from "react";
import { Plus, Save } from "lucide-react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import FormField from "../common/FormField";

const CourseManagement = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      code: "STAT30344",
      name: "Applied Statistics",
      description:
        "Covers statistical methods including hypothesis testing, regression analysis, and statistical computing using R and Python.",
      credits: 4,
      department_id: "67de9a869c45e2657b66b78f",
      instructor: "Dr. Michael Lee",
      semester: "Summer",
      level: "Graduate",
      schedule: "Mon/Wed 3:00 PM - 5:00 PM",
      location: "Room 310, Statistics Dept",
      prerequisites: ["Intro to Statistics", "Calculus I"],
      image: "Kandahar_Economic.jpg",
      status: "Active",
    },
    {
      id: 2,
      code: "ECO101",
      name: "Principles of Economics",
      description: "Introduction to basic economic principles and theories.",
      credits: 3,
      department_id: "67de9a869c45e2657b66b78f",
      instructor: "Dr. Ahmad Ahmadi",
      semester: "Fall",
      level: "Undergraduate",
      schedule: "Tue/Thu 10:00 AM - 11:30 AM",
      location: "Room 101, Economics Dept",
      prerequisites: [],
      image: "economics_101.jpg",
      status: "Active",
    },
    {
      id: 3,
      code: "FIN201",
      name: "Financial Management",
      description: "Study of financial planning, analysis, and management.",
      credits: 4,
      department_id: "67de9a869c45e2657b66b78f",
      instructor: "Prof. Mohammad Karimi",
      semester: "Spring",
      level: "Undergraduate",
      schedule: "Mon/Wed/Fri 1:00 PM - 2:00 PM",
      location: "Room 205, Finance Dept",
      prerequisites: ["Principles of Economics"],
      image: "finance_201.jpg",
      status: "Active",
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    credits: "",
    department_id: "",
    instructor: "",
    semester: "",
    level: "",
    schedule: "",
    location: "",
    prerequisites: "",
    image: "",
  });

  // Table columns configuration
  const columns = [
    { header: "Code", accessor: "code" },
    { header: "Name", accessor: "name" },
    { header: "Credits", accessor: "credits" },
    { header: "Instructor", accessor: "instructor" },
    { header: "Semester", accessor: "semester" },
    { header: "Level", accessor: "level" },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span className='px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs'>
          {row.status}
        </span>
      ),
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddCourse = () => {
    // Convert prerequisites from string to array
    const prerequisites = formData.prerequisites
      ? formData.prerequisites.split(",").map((item) => item.trim())
      : [];

    const newCourse = {
      id: courses.length + 1,
      ...formData,
      prerequisites,
      status: "Active",
    };

    setCourses([...courses, newCourse]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditCourse = () => {
    // Convert prerequisites from string to array if it's a string
    const prerequisites =
      typeof formData.prerequisites === "string"
        ? formData.prerequisites.split(",").map((item) => item.trim())
        : formData.prerequisites;

    const updatedCourses = courses.map((course) =>
      course.id === currentCourse.id
        ? { ...course, ...formData, prerequisites }
        : course
    );

    setCourses(updatedCourses);
    setIsEditModalOpen(false);
  };

  const handleDeleteCourse = (course) => {
    if (window.confirm(`Are you sure you want to delete ${course.name}?`)) {
      setCourses(courses.filter((c) => c.id !== course.id));
    }
  };

  const openEditModal = (course) => {
    // Convert prerequisites array to string for form
    const courseData = {
      ...course,
      prerequisites: Array.isArray(course.prerequisites)
        ? course.prerequisites.join(", ")
        : course.prerequisites,
    };

    setCurrentCourse(course);
    setFormData(courseData);
    setIsEditModalOpen(true);
  };

  const openViewModal = (course) => {
    setCurrentCourse(course);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      credits: "",
      department_id: "",
      instructor: "",
      semester: "",
      level: "",
      schedule: "",
      location: "",
      prerequisites: "",
      image: "",
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold text-gray-800'>
          Course Management
        </h2>
        <button
          className='flex items-center px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
        >
          <Plus size={18} className='mr-2' />
          Add New Course
        </button>
      </div>

      {/* Course Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-[#004B87] bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-[#004B87] font-bold'>{courses.length}</span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Total Courses</p>
            <p className='text-lg font-semibold text-gray-800'>
              Active Courses
            </p>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-[#F4B400] bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-[#F4B400] font-bold'>
              {new Set(courses.map((course) => course.instructor)).size}
            </span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Unique Instructors</p>
            <p className='text-lg font-semibold text-gray-800'>
              Teaching Staff
            </p>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6 flex items-center'>
          <div className='w-12 h-12 rounded-full bg-green-500 bg-opacity-10 flex items-center justify-center mr-4'>
            <span className='text-green-500 font-bold'>
              {courses.reduce(
                (total, course) => total + Number.parseInt(course.credits),
                0
              )}
            </span>
          </div>
          <div>
            <p className='text-gray-500 text-sm'>Total Credits</p>
            <p className='text-lg font-semibold text-gray-800'>Credit Hours</p>
          </div>
        </div>
      </div>

      {/* Course Table */}
      <Table
        columns={columns}
        data={courses}
        actions={true}
        onView={openViewModal}
        onEdit={openEditModal}
        onDelete={handleDeleteCourse}
      />

      {/* Add Course Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title='Add New Course'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddCourse();
          }}
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              label='Course Code'
              name='code'
              value={formData.code}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Course Name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Credits'
              name='credits'
              type='number'
              value={formData.credits}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Instructor'
              name='instructor'
              value={formData.instructor}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Department ID'
              name='department_id'
              value={formData.department_id}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Semester'
              name='semester'
              type='select'
              value={formData.semester}
              onChange={handleInputChange}
              options={[
                { value: "Fall", label: "Fall" },
                { value: "Spring", label: "Spring" },
                { value: "Summer", label: "Summer" },
                { value: "Winter", label: "Winter" },
              ]}
              required
            />
            <FormField
              label='Level'
              name='level'
              type='select'
              value={formData.level}
              onChange={handleInputChange}
              options={[
                { value: "Undergraduate", label: "Undergraduate" },
                { value: "Graduate", label: "Graduate" },
              ]}
              required
            />
            <FormField
              label='Schedule'
              name='schedule'
              value={formData.schedule}
              onChange={handleInputChange}
            />
            <FormField
              label='Location'
              name='location'
              value={formData.location}
              onChange={handleInputChange}
            />
            <FormField
              label='Prerequisites (comma separated)'
              name='prerequisites'
              value={formData.prerequisites}
              onChange={handleInputChange}
            />
            <FormField
              label='Image'
              name='image'
              value={formData.image}
              onChange={handleInputChange}
            />
          </div>

          <FormField
            label='Description'
            name='description'
            type='textarea'
            value={formData.description}
            onChange={handleInputChange}
            required
          />

          <div className='mt-6 flex justify-end space-x-3'>
            <button
              type='button'
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
            >
              <Save size={18} className='inline mr-2' />
              Save Course
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title='Edit Course'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditCourse();
          }}
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              label='Course Code'
              name='code'
              value={formData.code}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Course Name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Credits'
              name='credits'
              type='number'
              value={formData.credits}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Instructor'
              name='instructor'
              value={formData.instructor}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Department ID'
              name='department_id'
              value={formData.department_id}
              onChange={handleInputChange}
              required
            />
            <FormField
              label='Semester'
              name='semester'
              type='select'
              value={formData.semester}
              onChange={handleInputChange}
              options={[
                { value: "Fall", label: "Fall" },
                { value: "Spring", label: "Spring" },
                { value: "Summer", label: "Summer" },
                { value: "Winter", label: "Winter" },
              ]}
              required
            />
            <FormField
              label='Level'
              name='level'
              type='select'
              value={formData.level}
              onChange={handleInputChange}
              options={[
                { value: "Undergraduate", label: "Undergraduate" },
                { value: "Graduate", label: "Graduate" },
              ]}
              required
            />
            <FormField
              label='Schedule'
              name='schedule'
              value={formData.schedule}
              onChange={handleInputChange}
            />
            <FormField
              label='Location'
              name='location'
              value={formData.location}
              onChange={handleInputChange}
            />
            <FormField
              label='Prerequisites (comma separated)'
              name='prerequisites'
              value={formData.prerequisites}
              onChange={handleInputChange}
            />
            <FormField
              label='Image'
              name='image'
              value={formData.image}
              onChange={handleInputChange}
            />
          </div>

          <FormField
            label='Description'
            name='description'
            type='textarea'
            value={formData.description}
            onChange={handleInputChange}
            required
          />

          <div className='mt-6 flex justify-end space-x-3'>
            <button
              type='button'
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-[#004B87] text-white rounded-md hover:bg-[#003a6a] transition-colors'
            >
              <Save size={18} className='inline mr-2' />
              Update Course
            </button>
          </div>
        </form>
      </Modal>

      {/* View Course Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title='Course Details'
      >
        {currentCourse && (
          <div className='space-y-4'>
            <div className='flex flex-col md:flex-row gap-6'>
              <div className='md:w-1/3'>
                <img
                  src={`/placeholder.svg?height=200&width=300&text=${currentCourse.name}`}
                  alt={currentCourse.name}
                  className='w-full h-auto rounded-lg'
                />
              </div>
              <div className='md:w-2/3'>
                <h3 className='text-2xl font-bold text-gray-800'>
                  {currentCourse.name}
                </h3>
                <p className='text-sm text-gray-500 mb-2'>
                  Code: {currentCourse.code}
                </p>
                <p className='text-gray-700 mb-4'>
                  {currentCourse.description}
                </p>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Credits</p>
                    <p className='text-gray-800'>{currentCourse.credits}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>
                      Instructor
                    </p>
                    <p className='text-gray-800'>{currentCourse.instructor}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>
                      Semester
                    </p>
                    <p className='text-gray-800'>{currentCourse.semester}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Level</p>
                    <p className='text-gray-800'>{currentCourse.level}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>
                      Schedule
                    </p>
                    <p className='text-gray-800'>{currentCourse.schedule}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>
                      Location
                    </p>
                    <p className='text-gray-800'>{currentCourse.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-2'>
                Prerequisites
              </h4>
              {currentCourse.prerequisites &&
              currentCourse.prerequisites.length > 0 ? (
                <ul className='list-disc pl-5'>
                  {Array.isArray(currentCourse.prerequisites) ? (
                    currentCourse.prerequisites.map((prereq, index) => (
                      <li key={index} className='text-gray-700'>
                        {prereq}
                      </li>
                    ))
                  ) : (
                    <li className='text-gray-700'>
                      {currentCourse.prerequisites}
                    </li>
                  )}
                </ul>
              ) : (
                <p className='text-gray-700'>No prerequisites</p>
              )}
            </div>

            <div>
              <h4 className='text-lg font-medium text-gray-800 mb-2'>
                Course Materials
              </h4>
              {currentCourse.materials && currentCourse.materials.length > 0 ? (
                <div className='space-y-2'>
                  {currentCourse.materials.map((material, index) => (
                    <div
                      key={index}
                      className='flex items-center p-2 border rounded-md'
                    >
                      <div className='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3'>
                        <span className='text-xs font-medium'>
                          {material.type}
                        </span>
                      </div>
                      <div>
                        <p className='text-sm font-medium'>{material.title}</p>
                        <p className='text-xs text-gray-500'>{material.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-gray-700'>No materials available</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CourseManagement;
