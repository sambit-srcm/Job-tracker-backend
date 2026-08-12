const { pgTable, serial, varchar, timestamp } = require('drizzle-orm/pg-core');

const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('applied'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

module.exports = { jobs };
