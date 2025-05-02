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
    const {
      department,
      academicRank,
      committeePosition,
      email,
      phoneNumber,
    } = req.body;

    const departmentExists = await Department.findById(department);
    if (!departmentExists) {
      return res.status(400).json({ message: 'Department not found' });
    }

    const updatedMember = await CommitteeMember.findOneAndUpdate(
      { userId: req.params.userId },
      {
        department,
        academicRank,
        committeePosition,
        email,
        phoneNumber,
      },
      { new: true }
    ).populate('department', 'name').populate('userId', 'fullName email');

    if (!updatedMember) {
      return res.status(404).json({ message: 'Committee member not found' });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all committee members
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

// Get a committee member by userId
const getCommitteeMemberById = async (req, res) => {
  try {
    const member = await CommitteeMember.findOne({ userId: req.params.userId })
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

// Delete a committee member
const deleteCommitteeMember = async (req, res) => {
  try {
    const deletedMember = await CommitteeMember.findOneAndDelete({ userId: req.params.userId });

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
