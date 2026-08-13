const { Router } = require('express');
const applicationsRoutes = require('./applications.routes');

const router = Router();

router.use('/applications', applicationsRoutes);

module.exports = router;
