const ContactMessage = require('../models/contactModel');

// CREATE contact message
const createContact = async (req, res) => {
  try {
    const { name, email, subject, department, message } = req.body;

    const newMessage = await ContactMessage.create({
      name,
      email,
      subject,
      department,
      message,
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// READ/GET all contact messages
const getContact = async (req, res) => {
  try {
    const contacts = await ContactMessage.find();
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// UPDATE a contact message
const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, subject, department, message } = req.body;

    const updatedContact = await ContactMessage.findByIdAndUpdate(
      id,
      { name, email, subject, department, message },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.status(200).json({ success: true, data: updatedContact });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE a contact message
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await ContactMessage.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.status(200).json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
