const request = require('supertest');
const express = require('express');
const app = require('../app'); 

describe('Event API Tests', () => {
    it('should create a new event', async () => {
        const response = await request(app).post('/api/events').send({
            name: 'Test Event',
            description: 'This is a test event',
            date: '2025-03-25',
            time: '12:00 PM',
            category: 'Meetings',
            userId: 1
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    it('should fetch all events', async () => {
        const response = await request(app).get('/api/events');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

