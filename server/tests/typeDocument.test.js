import request from 'supertest'; // Import supertest for testing HTTP requests
const { app, server } = require('../index.mjs'); // Import the app and server from your entry point

describe('TypeDocument API', () => {
    let typeId;

    // Test for retrieving all types
    it('should retrieve all types of documents', async () => {
        const response = await request(app).get('/api/types');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);

        // Store a valid typeId for further tests if needed
        typeId = response.body[0].IdType;
    });

    // Test for retrieving a specific type by ID
    it('should retrieve a specific type by ID', async () => {
        const response = await request(app).get(`/api/types/${typeId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('IdType', typeId);
    });

    // Test for handling a non-existing type ID
    it('should return 404 if type is not found', async () => {
        const invalidTypeId = 9999; // Assuming 9999 does not exist
        const response = await request(app).get(`/api/types/${invalidTypeId}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Type not found' });
    });

    // Close the server after all tests have run
    afterAll(async () => {
        await new Promise(resolve => server.close(resolve)); // Close the server
    });
});
