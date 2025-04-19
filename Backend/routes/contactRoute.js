const express = require('express');
const router = express.Router();
const {
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require('../controllers/contactController');

router.post('/', createContact);
router.get('/', getContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;
