import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  real,
  primaryKey,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['Admin', 'HOD', 'Faculty', 'Student', 'Advisor']);
export const leaveTypeEnum = pgEnum('leave_type', ['Leave', 'OD']);
export const leaveStatusEnum = pgEnum('leave_status', ['Pending Advisor', 'Pending HOD', 'Pending Admin', 'Approved', 'Rejected']);


export const users = pgTable('users', {
  id: varchar('id', { length: 50 }).primaryKey(), // e.g., 'STU001', 'USR005'
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password'), // Should be hashed in a real app
  role: userRoleEnum('role').notNull(),
  department: varchar('department', { length: 255 }),
  imageUrl: text('image_url'),
  classId: varchar('class_id', { length: 50 }),
  rollNumber: varchar('roll_number', { length: 50 }),
  registerNumber: varchar('register_number', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const predictions = pgTable('predictions', {
  id: varchar('id', { length: 50 }).primaryKey(),
  userId: varchar('user_id', { length: 50 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  label: varchar('label', { length: 50 }).notNull(), // e.g., 'compliant', 'non_compliant'
  confidence: real('confidence').notNull(),
  imageId: text('image_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const leaveRequests = pgTable('leave_requests', {
  id: varchar('id', { length: 50 }).primaryKey(),
  userId: varchar('user_id', { length: 50 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: leaveTypeEnum('type').notNull(),
  status: leaveStatusEnum('status').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  reason: text('reason').notNull(),
  aiSummary: text('ai_summary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});