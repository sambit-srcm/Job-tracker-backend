const { Router } = require('express');
const controller = require('../controllers/applications.controller');
const validateApplicationBody = require('../middlewares/validateApplication');
const validateUuidParam = require('../middlewares/validateUuidParam');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();
const validateId = validateUuidParam('id');

router.get('/', asyncHandler(controller.list));
router.post('/', validateApplicationBody, asyncHandler(controller.create));
router.get('/:id', validateId, asyncHandler(controller.getById));
router.put('/:id', validateId, validateApplicationBody, asyncHandler(controller.update));
router.delete('/:id', validateId, asyncHandler(controller.remove));

module.exports = router;
