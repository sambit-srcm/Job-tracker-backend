jest.mock('../../../src/db/client', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const { db } = require('../../../src/db/client');
const applicationsService = require('../../../src/services/applications.service');

// Builds a chainable, thenable stand-in for a drizzle query builder that
// resolves to `result` whichever method the code under test awaits from.
function createQueryBuilder(result) {
  const builder = {};
  const chain = () => builder;
  ['from', 'where', 'orderBy', 'limit', 'values', 'set'].forEach((method) => {
    builder[method] = jest.fn(chain);
  });
  builder.returning = jest.fn(() => Promise.resolve(result));
  builder.then = (resolve, reject) => Promise.resolve(result).then(resolve, reject);
  return builder;
}

describe('applications.service', () => {
  describe('listApplications', () => {
    it('returns all rows when no filters are given', async () => {
      const rows = [{ id: '1' }, { id: '2' }];
      const builder = createQueryBuilder(rows);
      db.select.mockReturnValue(builder);

      const result = await applicationsService.listApplications({});

      expect(result).toEqual(rows);
      expect(builder.where).not.toHaveBeenCalled();
    });

    it('applies a where clause when status or workType filters are given', async () => {
      const rows = [{ id: '1', status: 'Applied' }];
      const builder = createQueryBuilder(rows);
      db.select.mockReturnValue(builder);

      const result = await applicationsService.listApplications({
        status: 'Applied',
        workType: 'Remote',
      });

      expect(result).toEqual(rows);
      expect(builder.where).toHaveBeenCalledTimes(1);
    });

    it('defaults to no filters when called without arguments', async () => {
      const rows = [];
      const builder = createQueryBuilder(rows);
      db.select.mockReturnValue(builder);

      const result = await applicationsService.listApplications();

      expect(result).toEqual(rows);
      expect(builder.where).not.toHaveBeenCalled();
    });
  });

  describe('getApplicationById', () => {
    it('returns the application when found', async () => {
      const row = { id: 'abc', company: 'Acme' };
      db.select.mockReturnValue(createQueryBuilder([row]));

      const result = await applicationsService.getApplicationById('abc');

      expect(result).toEqual(row);
    });

    it('returns null when no application matches the id', async () => {
      db.select.mockReturnValue(createQueryBuilder([]));

      const result = await applicationsService.getApplicationById('missing');

      expect(result).toBeNull();
    });
  });

  describe('createApplication', () => {
    it('inserts the data and returns the created row', async () => {
      const data = { company: 'Acme', role: 'Engineer' };
      const created = { id: 'new-id', ...data };
      const builder = createQueryBuilder([created]);
      db.insert.mockReturnValue(builder);

      const result = await applicationsService.createApplication(data);

      expect(result).toEqual(created);
      expect(builder.values).toHaveBeenCalledWith(data);
    });
  });

  describe('updateApplication', () => {
    it('updates the row, bumps updatedAt, and returns the updated row', async () => {
      const updated = { id: 'abc', company: 'New Co' };
      const builder = createQueryBuilder([updated]);
      db.update.mockReturnValue(builder);

      const result = await applicationsService.updateApplication('abc', { company: 'New Co' });

      expect(result).toEqual(updated);
      expect(builder.set).toHaveBeenCalledWith(
        expect.objectContaining({ company: 'New Co', updatedAt: expect.any(Date) })
      );
    });

    it('returns null when the id does not exist', async () => {
      db.update.mockReturnValue(createQueryBuilder([]));

      const result = await applicationsService.updateApplication('missing', { company: 'X' });

      expect(result).toBeNull();
    });
  });

  describe('deleteApplication', () => {
    it('deletes the row and returns its id', async () => {
      const builder = createQueryBuilder([{ id: 'abc' }]);
      db.delete.mockReturnValue(builder);

      const result = await applicationsService.deleteApplication('abc');

      expect(result).toEqual({ id: 'abc' });
    });

    it('returns null when the id does not exist', async () => {
      db.delete.mockReturnValue(createQueryBuilder([]));

      const result = await applicationsService.deleteApplication('missing');

      expect(result).toBeNull();
    });
  });
});
