const express = require('express');
const upload = require('../utils/upload.js');
const {
  createPerson,
  getPersons,
  getPersonById,
  deletePerson,
  bulkUploadPersons,
  updatePerson,
} = require('../controllers/personController.js');

const router = express.Router();

router.post('/', createPerson);
router.post('/bulk-upload', upload.single('file'), bulkUploadPersons);
router.get('/', getPersons);
router.get('/:id', getPersonById);
router.delete('/:id', deletePerson);
router.put('/:id', updatePerson);

module.exports = router;
