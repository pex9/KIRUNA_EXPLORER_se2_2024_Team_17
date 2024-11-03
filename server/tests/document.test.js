import request from 'supertest'; // Import supertest for testing HTTP requests
const { app, server } = require('../index.mjs'); // Import the app and server from your entry point

describe('Document API', () => {
    // Sample document data
    const sampleDocument = {
        title: "Test Document",
        idStakeholder: 1,
        scale: "National",
        issuance_Date: "2022-01-01",
        language: "English",
        pages: 100,
        description: "This is a test document",
        idType: 2,
        idLocation: 3,
    };

    let documentId;

    // Test for adding a new document
    it('should add a new document', async () => {
        const response = await request(app)
            .post('/api/documents')
            .send(sampleDocument)
            .set('Authorization', 'Bearer <valid_token>'); // Use a valid token if required
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('title', sampleDocument.title);
        documentId = response.body.id; // Store the document ID for later tests
        console.log("Document added with ID:", documentId);
    });

    // Test for retrieving all documents
    it('should retrieve all documents', async () => {
        const response = await request(app).get('/api/documents');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    // Test for retrieving a document by ID
    it('should retrieve a document by ID', async () => {
        const response = await request(app).get(`/api/documents/${documentId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', documentId);
        expect(response.body).toHaveProperty('title', sampleDocument.title);
    });

    // Test for updating a document
    it('should update a document', async () => {
        const updatedDocument = { ...sampleDocument, title: "Updated Test Document" };
        const response = await request(app)
            .put(`/api/documents/${documentId}`)
            .send(updatedDocument)
            .set('Authorization', 'Bearer <valid_token>'); // Use a valid token if required
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('title', "Updated Test Document");
    });

    // Test for deleting a document (if delete functionality exists)
    it('should delete a document', async () => {
        const response = await request(app)
            .delete(`/api/documents/${documentId}`)
            .set('Authorization', 'Bearer <valid_token>'); // Use a valid token if required
        expect(response.status).toBe(200);
    });

    // Close the server after all tests have run
    afterAll(async () => {
        await new Promise(resolve => server.close(resolve)); // Close the server
    });
});
