import request from 'supertest';
const { app, server } = require('../index.mjs');
const DocumentDao = require('../dao/document-dao.js'); // Assumes a DocumentDao for CRUD ops on documents

jest.mock('../dao/document-dao.js');

describe("Document API", () => {

    describe("GET /api/documents", () => {
        it("should retrieve all documents", async () => {
            const mockDocuments = [
                { id: 1, title: "Document A", content: "Sample content A" },
                { id: 2, title: "Document B", content: "Sample content B" },
            ];
            DocumentDao.getAllDocuments.mockResolvedValue(mockDocuments);
            const response = await request(app).get("/api/documents");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockDocuments);
        });

        it("should handle errors", async () => {
            DocumentDao.getAllDocuments.mockRejectedValue(new Error("Database error"));
            const response = await request(app).get("/api/documents");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal server error" });
        });
    });

    describe("GET /api/documents/:documentId", () => {
        it("should retrieve a specific document by ID", async () => {
            const documentId = 1;
            const mockDocument = { id: documentId, title: "Document A", content: "Sample content A" };
            DocumentDao.getDocumentById.mockResolvedValue(mockDocument);

            const response = await request(app).get(`/api/documents/${documentId}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockDocument);
        });

        it("should return 404 if document is not found", async () => {
            DocumentDao.getDocumentById.mockResolvedValue(null);
            const response = await request(app).get("/api/documents/99");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Document not found" });
        });

        it("should handle errors", async () => {
            DocumentDao.getDocumentById.mockRejectedValue(new Error("Database error"));
            const response = await request(app).get("/api/documents/1");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal server error" });
        });
    });

    describe("POST /api/documents", () => {
        it("should create a new document", async () => {
            const newDocument = { title: "New Document", content: "New content" };
            const savedDocument = { id: 1, ...newDocument };
            DocumentDao.createDocument.mockResolvedValue(savedDocument);

            const response = await request(app).post("/api/documents").send(newDocument);
            expect(response.status).toBe(201);
            expect(response.body).toEqual(savedDocument);
        });

        it("should return 400 if required fields are missing", async () => {
            const incompleteDocument = { content: "Content without title" };
            const response = await request(app).post("/api/documents").send(incompleteDocument);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Title is required" });
        });

        it("should handle errors", async () => {
            DocumentDao.createDocument.mockRejectedValue(new Error("Database error"));
            const response = await request(app).post("/api/documents").send({ title: "Test" });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal server error" });
        });
    });

    describe("PUT /api/documents/:documentId", () => {
        it("should update an existing document", async () => {
            const documentId = 1;
            const updatedDocument = { title: "Updated Document", content: "Updated content" };
            DocumentDao.updateDocument.mockResolvedValue({ id: documentId, ...updatedDocument });

            const response = await request(app).put(`/api/documents/${documentId}`).send(updatedDocument);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ id: documentId, ...updatedDocument });
        });

        it("should return 404 if document to update is not found", async () => {
            DocumentDao.updateDocument.mockResolvedValue(null);
            const response = await request(app).put("/api/documents/99").send({ title: "Updated Title" });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Document not found" });
        });

        it("should handle errors", async () => {
            DocumentDao.updateDocument.mockRejectedValue(new Error("Database error"));
            const response = await request(app).put("/api/documents/1").send({ title: "Test" });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal server error" });
        });
    });

    describe("DELETE /api/documents/:documentId", () => {
        it("should delete a document by ID", async () => {
            DocumentDao.deleteDocument.mockResolvedValue(true);
            const response = await request(app).delete("/api/documents/1");

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Document deleted successfully" });
        });

        it("should return 404 if document to delete is not found", async () => {
            DocumentDao.deleteDocument.mockResolvedValue(false);
            const response = await request(app).delete("/api/documents/99");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Document not found" });
        });

        it("should handle errors", async () => {
            DocumentDao.deleteDocument.mockRejectedValue(new Error("Database error"));
            const response = await request(app).delete("/api/documents/1");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Internal server error" });
        });
    });

    // Close the server after all tests
    afterAll(async () => {
        await new Promise((resolve) => server.close(resolve));
    });
});
