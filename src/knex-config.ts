import { config as dotenvConfig } from 'dotenv';
import { knex as setupKnex, Knex } from 'knex';
import { env } from './env';

if (process.env.NODE_ENV === 'test') {
    dotenvConfig({ path: '.env.test' });
} else {
    dotenvConfig();
}

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set');
}

export const config: Knex.Config = {
    client: 'sqlite3',
    connection: env.DATABASE_CLIENT === 'sqlite3'
        ? {
            filename: env.DATABASE_URL
        }
        : env.DATABASE_URL,
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations'
    }
}

export const knex = setupKnex(config)