const { eq, and, desc } = require('drizzle-orm');
const { db } = require('../db/client');
const { applications } = require('../models/application.model');

// Lists applications, optionally filtered by status and/or workType, newest date first
async function listApplications({ status, workType } = {}) {
  const conditions = [];
  if (status) conditions.push(eq(applications.status, status));
  if (workType) conditions.push(eq(applications.workType, workType));

  const query = db.select().from(applications).orderBy(desc(applications.date));

  if (conditions.length === 0) return query;
  return query.where(and(...conditions));
}

// Fetches a single application by id, or null if it doesn't exist
async function getApplicationById(id) {
  const [application] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);
  return application ?? null;
}

// Inserts a new application row
async function createApplication(data) {
  // .returning() is required — Postgres inserts don't hand back the row otherwise
  const [application] = await db.insert(applications).values(data).returning();
  return application;
}

// Replaces an application's fields and bumps updatedAt; returns null if the id doesn't exist
async function updateApplication(id, data) {
  const [application] = await db
    .update(applications)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(applications.id, id))
    .returning();
  return application ?? null;
}

// Deletes an application by id; returns null if the id doesn't exist
async function deleteApplication(id) {
  // only need id back to confirm a row was actually deleted (for the 404 check)
  const [application] = await db
    .delete(applications)
    .where(eq(applications.id, id))
    .returning({ id: applications.id });
  return application ?? null;
}

module.exports = {
  listApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
};
