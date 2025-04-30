// controllers/committeeMemberController.js

const CommitteeMember = require('../models/CommitteeMember');
const Department = require('../models/Department'); // Assuming you have a Department model

// Create a new committee member
const createCommitteeMember = async (req, res) => {
  try {
    const { memberId, name, department } = req.body;

    // Check if the department exists
    const departmentExists = await Department.findById(department);
    if (!departmentExists) {
      return res.status(400).json({ message: 'Department not found' });
    }

    const newCommitteeMember = new CommitteeMember({
      memberId,
      name,
      department,
    });

    const savedMember = await newCommitteeMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all committee members
const getAllCommitteeMembers = async (req, res) => {
  try {
    const committeeMembers = await CommitteeMember.find().populate('department', 'name');
    res.status(200).json(committeeMembers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a committee member by memberId
const getCommitteeMemberById = async (req, res) => {
  try {
    const member = await CommitteeMember.findOne({ memberId: req.params.memberId }).populate('department', 'name');
    if (!member) {
      return res.status(404).json({ message: 'Committee member not found' });
    }
    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a committee member
const updateCommitteeMember = async (req, res) => {
  try {
    const { memberId, name, department } = req.body;

    // Check if the department exists
    const departmentExists = await Department.findById(department);
    if (!departmentExists) {
      return res.status(400).json({ message: 'Department not found' });
    }

    const updatedMember = await CommitteeMember.findOneAndUpdate(
      { memberId: req.params.memberId },
      { name, department },
      { new: true }
    ).populate('department', 'name');

    if (!updatedMember) {
      return res.status(404).json({ message: 'Committee member not found' });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a committee member
const deleteCommitteeMember = async (req, res) => {
  try {
    const deletedMember = await CommitteeMember.findOneAndDelete({ memberId: req.params.memberId });

    if (!deletedMember) {
      return res.status(404).json({ message: 'Committee member not found' });
    }

    res.status(200).json({ message: 'Committee member deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports={
    createCommitteeMember,
    getAllCommitteeMembers,
    getCommitteeMemberById,
    updateCommitteeMember,
    deleteCommitteeMember
}