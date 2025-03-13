const request = require('supertest');
const express = require('express');
const app = require('../app'); // Ensure this is the correct path to your Express app

describe('User API Tests', () => {
    it('should create a new user', async () => {
        const response = await request(app).post('/api/users').send({
            username: 'test_user',
            password: 'testpassword'
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.username).toBe('test_user');
    });

    it('should prevent duplicate usernames', async () => {
        await request(app).post('/api/users').send({
            username: 'duplicate_user',
            password: 'password123'
        });

        const response = await request(app).post('/api/users').send({
            username: 'duplicate_user',
            password: 'password456'
        });

        expect(response.status).toBe(400); // Assuming you implement duplicate check
        expect(response.body.message).toBe('Username already exists');
    });

    it('should return all users', async () => {
        const response = await request(app).get('/api/users');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
})

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});
