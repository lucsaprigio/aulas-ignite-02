import fastfy from "fastify";
import cookie from '@fastify/cookie';
import { transactionRoutes } from './routes/transaction';

export const app = fastfy();

app.register(cookie);
app.register(transactionRoutes, {
    prefix: 'transactions'
});
