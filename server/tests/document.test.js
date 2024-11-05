import request from 'supertest';
const { app, server } = require('../index.mjs');

describe('Document API with Session Authentication', () => {
    let agent;
    let documentId;

    beforeAll(async () => {
        agent = request.agent(app);

        const loginResponse = await agent
            .post('/api/sessions')
            .send({ username: 'mario@test.it', password: 'pwd' });

        console.log('Login Response:', loginResponse.body);
        expect(loginResponse.status).toBe(200);
    });

    it('should create a new document with valid data', async () => {
        const documentData = {
            title: "Sample Title",
            idStakeholder: 1,
            scale: "National",
            issuance_Date: "04/2019",
            language: "English",
            pages: 50,
            description: "A description for the document",
            idType: 2,
            locationType: "Point",
            latitude: 19,
            longitude: 23,
            area_coordinates: ""
        };

        const response = await agent
            .post('/api/documents')
            .send(documentData);

        console.log('Create Document Response:', response.body);
        expect(response.status).toBe(201);

        
        documentId = response.body.IdDocument || response.body.idDocument;
        console.log('Assigned Document ID:', documentId);
        expect(documentId).toBeDefined(); 
    });

    it('should update an existing document', async () => {
        const updatedDocumentData = {
            title: "Updated Sample Title",
            idStakeholder: 2,
            scale: "Regional",
            issuance_Date: "05/2020",
            language: "Spanish",
            pages: 100,
            description: "Updated description for the document",
            idType: 3,
            locationType: "Point",
            latitude: 20,
            longitude: 30,
            area_coordinates: ""
        };

        console.log('Attempting update with documentId:', documentId);
        const updateResponse = await agent
            .put(`/api/documents/${documentId}`)
            .send(updatedDocumentData);

        console.log('Update Document Response:', updateResponse.body);
        expect(updateResponse.status).toBe(200);

        const retrieveResponse = await agent
            .get(`/api/documents/${documentId}`);

        console.log('Retrieve Updated Document Response:', retrieveResponse.body);
        expect(retrieveResponse.status).toBe(200);
        expect(retrieveResponse.body).toMatchObject({
            IdDocument: documentId,
            Title: 'Updated Sample Title',
            IdStakeholder: 2,
            Scale: 'Regional',
            Issuance_Date: '05/2020',
            Language: 'Spanish',
            Pages: 100,
            Description: 'Updated description for the document',
            IdType: 3,
            IdLocation: null
        });
    });
    it('should retrieve all documents', async () => {
                const response = await agent.get('/api/documents');
        
                console.log('Get All Documents Response:', response.body);
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
        
                if (response.body.length > 0) {
                    expect(response.body[0]).toHaveProperty('documentId'); 
                    expect(response.body[0]).toHaveProperty('title'); 
                }
            });

            it('should retrieve a document by ID', async () => {
                const response = await agent.get(`/api/documents/${documentId}`);
        
                console.log('Get Document By ID Response:', response.body);
                if (response.status === 200) {
                    expect(response.body).toHaveProperty('IdDocument', documentId); 
                    expect(response.body).toHaveProperty('Title'); 
                } else {
                    expect(response.status).toBe(404);
                }
            });
            it('should return 404 for a non-existent document ID', async () => {
                const nonExistentDocumentId = 9999;
        
                const response = await agent.get(`/api/documents/${nonExistentDocumentId}`);
        
                console.log('Get Non-Existent Document Response:', response.body);
                expect(response.status).toBe(404);
            });
        
            afterAll(async () => {
                await new Promise(resolve => {
                    server.close(resolve);
                });
            });


    afterAll(async () => {
        await new Promise(resolve => server.close(resolve));
    });
});
