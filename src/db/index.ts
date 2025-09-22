import { drizzle } from 'drizzle-orm/neon-http';

export const db = drizzle(process.env.'postgresql://neondb_owner:npg_doHhpA4CqS9z@ep-nameless-river-adxz741w-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
