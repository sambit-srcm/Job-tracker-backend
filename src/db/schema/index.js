const { sql } = require('drizzle-orm');
const {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  date,
  index,
  check,
} = require('drizzle-orm/pg-core');

const applications = pgTable(
  'applications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    company: varchar('company', { length: 255 }).notNull(),
    role: varchar('role', { length: 255 }).notNull(),
    status: varchar('status', { length: 20 }).notNull().default('Applied'),
    workType: varchar('work_type', { length: 10 }).notNull().default('Remote'),
    location: varchar('location', { length: 255 }),
    date: date('date').notNull(),
    notes: text('notes').default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check('status_check', sql`${table.status} IN ('Applied', 'Interviewing', 'Hired', 'Rejected')`),
    check('work_type_check', sql`${table.workType} IN ('Remote', 'Hybrid', 'Onsite')`),
    check(
      'location_required_unless_remote',
      sql`${table.workType} = 'Remote' OR (${table.location} IS NOT NULL AND btrim(${table.location}) <> '')`
    ),
    index('idx_applications_status').on(table.status),
    index('idx_applications_date').on(table.date.desc()),
  ]
);

module.exports = { applications };
