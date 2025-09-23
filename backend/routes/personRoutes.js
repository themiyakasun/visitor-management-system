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
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createPerson);
router.post('/bulk-upload', upload.single('file'), bulkUploadPersons);
router.get('/', getPersons);
router.get('/:id', getPersonById);
router.delete('/:id', deletePerson);
router.put('/:id', updatePerson);

module.exports = router;
