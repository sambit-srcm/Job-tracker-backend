const { applications } = require('../db/schema');

const APPLICATION_STATUSES = ['Applied', 'Interviewing', 'Hired', 'Rejected'];
const WORK_TYPES = ['Remote', 'Hybrid', 'Onsite'];

module.exports = { applications, APPLICATION_STATUSES, WORK_TYPES };
