import 'reflect-metadata';
import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { User } from './users/user.entity';

// Outside the Nest context (migrations CLI) the .env must be loaded manually.
// dotenv does not override vars already set (in prod they come from the platform).
loadEnv({ path: join(process.cwd(), '../../.env') });
loadEnv();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: databaseUrl,
  entities: [User],
  // __dirname = src (ts-node/CLI) or dist (compiled app) → covers both.
  migrations: [join(__dirname, 'database', 'migrations', '*.{ts,js}')],
  synchronize: false,
  // Managed Postgres (Neon, etc.) requires TLS; local docker does not.
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  logging: process.env.DB_LOGGING === 'true',
};

// Default export consumed by the TypeORM CLI (`-d src/data-source.ts`).
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
