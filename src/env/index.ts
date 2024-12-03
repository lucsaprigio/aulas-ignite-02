import { config } from 'dotenv';
import { z } from 'zod';

// NODE_ENV -> development, test, productioon

if (process.env.NODE_ENV === 'test') {
    config({ path: '.env.test' });

} else {
    config();
}

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_CLIENT: z.enum(['sqlite3', 'pg']),
    DATABASE_URL: z.string()
})

// Quando usamos o parse, o zod valida o objeto e retorna um objeto com os valores tipados
const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
    console.error('Invalid environment variables', _env.error.format());

    throw new Error('Invalid environment variables');
}

export const env = _env.data

