import request from 'supertest';
const { app, server } = require('../index.mjs'); 

describe('Document Type API', () => {
    let agent;

    beforeAll(async () => {
        agent = request.agent(app);
    });

    it('should retrieve all document types', async () => {
        const response = await agent.get('/api/types');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true); 

        if (response.body.length > 0) {
           
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('iconsrc');
            expect(response.body[0]).toHaveProperty('type');
        }
    });

    it('should retrieve a specific document type by ID', async () => {
        const typeId = 1; 
        
        const response = await agent.get(`/api/types/${typeId}`);
        
        console.log('Get Type by ID Response:', response.body);
        if (response.status === 200) {
            expect(response.body).toHaveProperty('id', typeId);
            expect(response.body).toHaveProperty('iconsrc');
            expect(response.body).toHaveProperty('type');
        } else {
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Type not found');
        }
    });

    it('should return 404 for a non-existent document type ID', async () => {
        const nonExistentTypeId = 10; 
        
        const response = await agent.get(`/api/types/${nonExistentTypeId}`);
        
        expect(response.body).toHaveProperty('error', 'Type not found.');
    });


});
