const ApiError = require('../utils/ApiError');
const applicationsService = require('../services/applications.service');

// GET /applications — list, optionally filtered by status/workType query params
async function list(req, res) {
  const { status, workType } = req.query;
  const result = await applicationsService.listApplications({ status, workType });
  res.json(result);
}

// POST /applications — create a new application
async function create(req, res) {
  const application = await applicationsService.createApplication(req.body);
  res.status(201).json(application);
}

// GET /applications/:id — fetch one application, 404 if it doesn't exist
async function getById(req, res) {
  const application = await applicationsService.getApplicationById(req.params.id);
  if (!application) throw new ApiError(404, 'Application not found');
  res.json(application);
}

// PUT /applications/:id — full replace, 404 if it doesn't exist
async function update(req, res) {
  const application = await applicationsService.updateApplication(req.params.id, req.body);
  if (!application) throw new ApiError(404, 'Application not found');
  res.json(application);
}

// DELETE /applications/:id — 404 if it doesn't exist
async function remove(req, res) {
  const application = await applicationsService.deleteApplication(req.params.id);
  if (!application) throw new ApiError(404, 'Application not found');
  res.status(204).send();
}

module.exports = { list, create, getById, update, remove };
