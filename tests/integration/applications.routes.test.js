jest.mock('../../src/services/applications.service');

const request = require('supertest');
const app = require('../../src/app');
const applicationsService = require('../../src/services/applications.service');

const VALID_ID = '123e4567-e89b-12d3-a456-426614174000';

const validPayload = {
  company: 'Acme Corp',
  role: 'Backend Engineer',
  status: 'Applied',
  workType: 'Remote',
  date: '2026-01-15',
};

describe('applications API', () => {
  describe('GET /applications', () => {
    it('returns 200 with the list of applications', async () => {
      const rows = [{ id: VALID_ID, ...validPayload }];
      applicationsService.listApplications.mockResolvedValue(rows);

      const res = await request(app).get('/applications');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(rows);
    });

    it('forwards status/workType query params to the service', async () => {
      applicationsService.listApplications.mockResolvedValue([]);

      await request(app).get('/applications?status=Applied&workType=Remote');

      expect(applicationsService.listApplications).toHaveBeenCalledWith({
        status: 'Applied',
        workType: 'Remote',
      });
    });
  });

  describe('POST /applications', () => {
    it('returns 201 with the created application for a valid payload', async () => {
      const created = { id: VALID_ID, ...validPayload, location: null, notes: '' };
      applicationsService.createApplication.mockResolvedValue(created);

      const res = await request(app).post('/applications').send(validPayload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(created);
    });

    it('returns 400 when a required field is missing', async () => {
      const payload = { ...validPayload };
      delete payload.company;

      const res = await request(app).post('/applications').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('company is required');
      expect(applicationsService.createApplication).not.toHaveBeenCalled();
    });

    it('returns 400 for an invalid status', async () => {
      const res = await request(app)
        .post('/applications')
        .send({ ...validPayload, status: 'Ghosted' });

      expect(res.status).toBe(400);
      expect(applicationsService.createApplication).not.toHaveBeenCalled();
    });

    it('returns 400 when location is missing for a non-Remote workType', async () => {
      const res = await request(app)
        .post('/applications')
        .send({ ...validPayload, workType: 'Onsite', location: '' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('location is required unless workType is Remote');
    });
  });

  describe('GET /applications/:id', () => {
    it('returns 200 with the application when found', async () => {
      const application = { id: VALID_ID, ...validPayload };
      applicationsService.getApplicationById.mockResolvedValue(application);

      const res = await request(app).get(`/applications/${VALID_ID}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(application);
    });

    it('returns 404 when the application does not exist', async () => {
      applicationsService.getApplicationById.mockResolvedValue(null);

      const res = await request(app).get(`/applications/${VALID_ID}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Application not found');
    });

    it('returns 400 for a malformed id', async () => {
      const res = await request(app).get('/applications/not-a-uuid');

      expect(res.status).toBe(400);
      expect(applicationsService.getApplicationById).not.toHaveBeenCalled();
    });
  });

  describe('PUT /applications/:id', () => {
    it('returns 200 with the updated application', async () => {
      const application = { id: VALID_ID, ...validPayload };
      applicationsService.updateApplication.mockResolvedValue(application);

      const res = await request(app).put(`/applications/${VALID_ID}`).send(validPayload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(application);
    });

    it('returns 404 when the application does not exist', async () => {
      applicationsService.updateApplication.mockResolvedValue(null);

      const res = await request(app).put(`/applications/${VALID_ID}`).send(validPayload);

      expect(res.status).toBe(404);
    });

    it('returns 400 for an invalid body before hitting the service', async () => {
      const res = await request(app)
        .put(`/applications/${VALID_ID}`)
        .send({ ...validPayload, date: 'bad-date' });

      expect(res.status).toBe(400);
      expect(applicationsService.updateApplication).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /applications/:id', () => {
    it('returns 204 when the application is deleted', async () => {
      applicationsService.deleteApplication.mockResolvedValue({ id: VALID_ID });

      const res = await request(app).delete(`/applications/${VALID_ID}`);

      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
    });

    it('returns 404 when the application does not exist', async () => {
      applicationsService.deleteApplication.mockResolvedValue(null);

      const res = await request(app).delete(`/applications/${VALID_ID}`);

      expect(res.status).toBe(404);
    });

    it('returns 400 for a malformed id', async () => {
      const res = await request(app).delete('/applications/not-a-uuid');

      expect(res.status).toBe(400);
      expect(applicationsService.deleteApplication).not.toHaveBeenCalled();
    });
  });

  describe('unmatched routes', () => {
    it('returns 404 for an unknown path', async () => {
      const res = await request(app).get('/does-not-exist');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Not found' });
    });
  });
});
