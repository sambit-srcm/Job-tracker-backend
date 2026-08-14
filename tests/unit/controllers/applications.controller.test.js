jest.mock('../../../src/services/applications.service');

const applicationsService = require('../../../src/services/applications.service');
const controller = require('../../../src/controllers/applications.controller');
const ApiError = require('../../../src/utils/ApiError');

function buildRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

describe('applications.controller', () => {
  describe('list', () => {
    it('passes status/workType query params to the service and returns the result', async () => {
      const rows = [{ id: '1' }];
      applicationsService.listApplications.mockResolvedValue(rows);
      const req = { query: { status: 'Applied', workType: 'Remote' } };
      const res = buildRes();

      await controller.list(req, res);

      expect(applicationsService.listApplications).toHaveBeenCalledWith({
        status: 'Applied',
        workType: 'Remote',
      });
      expect(res.json).toHaveBeenCalledWith(rows);
    });
  });

  describe('create', () => {
    it('creates an application and responds 201 with the created row', async () => {
      const body = { company: 'Acme' };
      const created = { id: '1', ...body };
      applicationsService.createApplication.mockResolvedValue(created);
      const req = { body };
      const res = buildRes();

      await controller.create(req, res);

      expect(applicationsService.createApplication).toHaveBeenCalledWith(body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });
  });

  describe('getById', () => {
    it('returns the application when found', async () => {
      const application = { id: '1', company: 'Acme' };
      applicationsService.getApplicationById.mockResolvedValue(application);
      const req = { params: { id: '1' } };
      const res = buildRes();

      await controller.getById(req, res);

      expect(res.json).toHaveBeenCalledWith(application);
    });

    it('throws a 404 ApiError when not found', async () => {
      applicationsService.getApplicationById.mockResolvedValue(null);
      const req = { params: { id: 'missing' } };
      const res = buildRes();

      await expect(controller.getById(req, res)).rejects.toThrow(ApiError);
      await expect(controller.getById(req, res)).rejects.toMatchObject({
        statusCode: 404,
        message: 'Application not found',
      });
    });
  });

  describe('update', () => {
    it('returns the updated application when found', async () => {
      const application = { id: '1', company: 'New Co' };
      applicationsService.updateApplication.mockResolvedValue(application);
      const req = { params: { id: '1' }, body: { company: 'New Co' } };
      const res = buildRes();

      await controller.update(req, res);

      expect(applicationsService.updateApplication).toHaveBeenCalledWith('1', {
        company: 'New Co',
      });
      expect(res.json).toHaveBeenCalledWith(application);
    });

    it('throws a 404 ApiError when not found', async () => {
      applicationsService.updateApplication.mockResolvedValue(null);
      const req = { params: { id: 'missing' }, body: {} };
      const res = buildRes();

      await expect(controller.update(req, res)).rejects.toMatchObject({
        statusCode: 404,
        message: 'Application not found',
      });
    });
  });

  describe('remove', () => {
    it('responds 204 with no body when the application is deleted', async () => {
      applicationsService.deleteApplication.mockResolvedValue({ id: '1' });
      const req = { params: { id: '1' } };
      const res = buildRes();

      await controller.remove(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalledWith();
    });

    it('throws a 404 ApiError when not found', async () => {
      applicationsService.deleteApplication.mockResolvedValue(null);
      const req = { params: { id: 'missing' } };
      const res = buildRes();

      await expect(controller.remove(req, res)).rejects.toMatchObject({
        statusCode: 404,
        message: 'Application not found',
      });
    });
  });
});
