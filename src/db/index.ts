import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon('postgresql://neondb_owner:npg_doHhpA4CqS9z@ep-nameless-river-adxz741w-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
export const db = drizzle(sql);
