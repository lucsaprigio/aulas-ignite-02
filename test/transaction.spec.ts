import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest';
import { execSync } from 'node:child_process';
import request from 'supertest';
import { app } from '../src/app';

// Enunciado: O usuário consegue criar uma nova transação
// Function: transactionRoutes

describe('Transaction routes', () => {
    beforeAll(async () => { // hook que roda antes de todos os testes
        await app.ready(); // espera o app estar pronto
    });

    afterAll(async () => {
        await app.close(); // fecha o app
    });

    // Utilizamos o child_process para rodar os comandos do knex, pois o bando de teste não estava sendo criado 
    beforeEach(() => {
        execSync('npx knex migrate:rollback --all');
        execSync('npx knex migrate:latest');
    });


    it('should be able to a create a new transaction', async () => {
        // fazer a chamada HTTP para a rota de criação de transação
        await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transactions',
                amount: 5000,
                type: 'credit'
            })
            // validação
            .expect(201)
    })

    it('should be able to list all transactions', async () => {
        // Neste caso temos que criar uma transação antes de listar, pois a lista de transações é vazia
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transactions',
                amount: 5000,
                type: 'credit'
            })

        const cookies = createTransactionResponse.get('Set-Cookie'); // Pega o cookie da resposta

        const listTransactionsReponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies!)
            .expect(200)

        expect(listTransactionsReponse.body.transactions).toEqual([ // Espero que o corpo da resposta seja igual a um array com um objeto
            expect.objectContaining({ // Espero que o objeto contenha essas propriedades
                title: 'New transactions',
                amount: 5000,
            })
        ])
    })

    it('should be able to get a specific transaction', async () => {
        // Neste caso temos que criar uma transação antes de listar, pois a lista de transações é vazia
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transactions',
                amount: 5000,
                type: 'credit'
            })

        const cookies = createTransactionResponse.get('Set-Cookie'); // Pega o cookie da resposta


        const listTransactionsReponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies!)
            .expect(200)

        const transactionId = listTransactionsReponse.body.transactions[0].id; // Pega o id da transação criada

        const getTransactionResponse = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies!)
            .expect(200)

        expect(getTransactionResponse.body.transaction).toEqual( // Espero que o corpo da resposta seja igual a um array com um objeto
            expect.objectContaining({ // Espero que o objeto contenha essas propriedades
                title: 'New transactions',
                amount: 5000,
            })
        )
    })


    it('should be able to get the summary', async () => {
        // Neste caso temos que criar uma transação antes de listar, pois a lista de transações é vazia
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'Credit transaction',
                amount: 5000,
                type: 'credit'
            })

        const cookies = createTransactionResponse.get('Set-Cookie'); // Pega o cookie da resposta

        await request(app.server)
            .post('/transactions')
            .set('Cookie', cookies!)
            .send({
                title: 'Debit transaction',
                amount: 2000,
                type: 'debit'
            })

        const summaryResponse = await request(app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies!)
            .expect(200)

        expect(summaryResponse.body.summary).toEqual({
            amount: 3000 // 5000 - 2000
        })
    })
});