const CommitteeMember = require('../models/CommitteeMember');
const Department = require('../models/Department');
const User = require('../models/User'); // Optional: if you want to validate the user

// Create a new committee member
const createCommitteeMember = async (req, res) => {
  try {
    const {
      userId,
      department,
      academicRank,
      committeePosition,
      email,
      phoneNumber,
    } = req.body;

    // Check if the department exists
    const departmentExists = await Department.findById(department);
    if (!departmentExists) {
      return res.status(400).json({ message: 'Department not found' });
    }

    const newCommitteeMember = new CommitteeMember({
      userId,
      department,
      academicRank,
      committeePosition,
      email,
      phoneNumber,
    });

    const savedMember = await newCommitteeMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a committee member
const updateCommitteeMember = async (req, res) => {
  try {
    console.log('Update committee member request received');
    console.log('Request params ID:', req.params.id);
    console.log('Request body:', req.body);

    const {
      userId,
      department,
      academicRank,
      committeePosition,
      email,
      phoneNumber,
    } = req.body;

    // Check if the department exists
    const departmentExists = await Department.findById(department);
    if (!departmentExists) {
      console.log('Department not found:', department);
      return res.status(400).json({ message: 'Department not found' });
    }

    // Check if the user exists (if userId is provided)
    if (userId) {
      const User = require('../models/User');
      const userExists = await User.findById(userId);
      if (!userExists) {
        console.log('User not found:', userId);
        return res.status(400).json({ message: 'User not found' });
      }
    }

    console.log('Attempting to update committee member with ID:', req.params.id);

    const updateData = {
      userId,
      department,
      academicRank,
      committeePosition,
      email,
      phoneNumber,
    };

    console.log('Update data:', updateData);

    const updatedMember = await CommitteeMember.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
    .populate('department', 'name')
    .populate('userId', 'fullName email');

    if (!updatedMember) {
      console.log('Committee member not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Committee member not found' });
    }

    console.log('Committee member updated successfully:', updatedMember);
    res.status(200).json(updatedMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all committee members


// Get a committee member by userId
const getCommitteeMemberById = async (req, res) => {
  try {
    const member = await CommitteeMember.findById(req.params.id)
      .populate('department', 'name')
      .populate('userId', 'fullName email');

    if (!member) {
      return res.status(404).json({ message: 'Committee member not found' });
    }

    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



const getAllCommitteeMembers = async (req, res) => {
  try {
    const committeeMembers = await CommitteeMember.find()
      .populate('department', 'name')
      .populate('userId', 'fullName email');

    res.status(200).json({
      status: 'success',
      data: {
        committeeMembers,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a committee member
const deleteCommitteeMember = async (req, res) => {
  try {
    const deletedMember = await CommitteeMember.findByIdAndDelete(req.params.id);

    if (!deletedMember) {
      return res.status(404).json({ message: 'Committee member not found' });
    }

    res.status(200).json({ message: 'Committee member deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  createCommitteeMember,
  getAllCommitteeMembers,
  getCommitteeMemberById,
  updateCommitteeMember,
  deleteCommitteeMember,
};
