const express = require('express');

const router = express.Router();
const familyController = require('../controllers/familyController');

router.get('/:id', familyController.getOne);
router.post('/', familyController.create);
router.put('/:id', familyController.update);
router.delete('/:id', familyController.delete);

module.exports = router;