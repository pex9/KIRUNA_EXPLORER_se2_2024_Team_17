import request from "supertest";

const { app, server } = require("../index.mjs");

const DocumentConnectionDao = require("../dao/document-connection-dao.js");
const UserDao = require("../dao/user-dao.js");
jest.mock("../dao/document-connection-dao.js");
// jest.mock("../dao/user-dao");

describe("Document Connections API", () => {
  describe("GET /api/document-connections", () => {
    it("should retrieve all document connections", async () => {
      const mockConnections = [
        { IdDocument1: 1, IdDocument2: 2, IdConnection: 1 },
        { IdDocument1: 3, IdDocument2: 4, IdConnection: 2 },
      ];
      DocumentConnectionDao.getAllConnections.mockResolvedValue(
        mockConnections
      );
      const response = await request(app).get("/api/document-connections");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockConnections);
    });

    it("should handle errors", async () => {
      DocumentConnectionDao.getAllConnections.mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app).get("/api/document-connections");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error" });
    });
  });

  describe("GET /api/document-connections/:documentId", () => {
    it("should retrieve all connections for a specific document", async () => {
      const documentId = 1;

      const mockConnections = [
        {
          IdConnectionDocuments: 1,
          IdDocument1: documentId,
          IdDocument2: 2,
          IdConnection: 3,
        },
      ];

      DocumentConnectionDao.getConnections.mockResolvedValue(mockConnections);

      const response = await request(app).get(
        `/api/document-connections/${documentId}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockConnections);
    });

    it("should return 500 for database errors", async () => {
      DocumentConnectionDao.getConnections.mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app).get("/api/document-connections/1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error" });
    });
  });

  let agent;

  beforeAll(async () => {
    agent = request.agent(app);

    // Simulate login to maintain session state for future requests
    await agent
      .post("/api/sessions")
      .send({ username: "mario@test.it", password: "pwd" });
  });

  describe("POST /api/document-connections", () => {
    it("should create a new document connection when authenticated", async () => {
      const newConnection = {
        IdDocument1: 1,
        IdDocument2: 2,
        IdConnection: 3,
      };

      DocumentConnectionDao.createConnection.mockResolvedValue(newConnection);

      const response = await agent
        .post("/api/document-connections")
        .send(newConnection);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newConnection);
    });

    it("should return 400 if required fields are missing", async () => {
      const incompleteConnection = {
        IdDocument1: 1,
        IdConnection: 3,
      };

      const response = await agent
        .post("/api/document-connections")
        .send(incompleteConnection);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "The request body must contain all the required fields",
      });
    });

    it("should return 400 if a document tries to connect to itself", async () => {
      const invalidConnection = {
        IdDocument1: 1,
        IdDocument2: 1,
        IdConnection: 3,
      };

      const response = await agent
        .post("/api/document-connections")
        .send(invalidConnection);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "A document cannot be connected to itself",
      });
    });

    it("should return 500 for database errors", async () => {
      const validConnection = {
        IdDocument1: 1,
        IdDocument2: 2,
        IdConnection: 3,
      };
      DocumentConnectionDao.createConnection.mockRejectedValue(
        new Error("Database error")
      );

      const response = await agent
        .post("/api/document-connections")
        .send(validConnection);

      expect(response.status).toBe(500);
    });
  });

  describe("PATCH /api/documents/:documentId/connection", () => {
    it("should update the document connection successfully", async () => {
      const documentId = 1;
      const requestBody = {
        IdDocument2: 2,
        IdConnection: 3,
      };

      DocumentConnectionDao.updateDocumentConnection.mockResolvedValue(true);

      const response = await agent
        .patch(`/api/documents/${documentId}/connection`)
        .send(requestBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Connection updated successfully.",
      });
    });

    it("should return 400 if newDocumentId2 or newConnectionId is missing", async () => {
      const documentId = 1;
      const incompleteRequestBody = {
        IdDocument2: 2,
        // Missing IdConnection
      };

      const response = await agent
        .patch(`/api/documents/${documentId}/connection`)
        .send(incompleteRequestBody);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "newDocumentId2 and newConnectionId are required.",
      });
    });

    it("should return 500 if updating the document connection fails", async () => {
      const documentId = 1;
      const requestBody = {
        IdDocument2: 2,
        IdConnection: 3,
      };

      DocumentConnectionDao.updateDocumentConnection.mockResolvedValue(false);

      const response = await agent
        .patch(`/api/documents/${documentId}/connection`)
        .send(requestBody);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to update connection." });
    });

    it("should return 500 for database errors", async () => {
      const documentId = 1;
      const requestBody = {
        IdDocument2: 2,
        IdConnection: 3,
      };

      DocumentConnectionDao.updateDocumentConnection.mockRejectedValue(
        new Error("Database error")
      );

      const response = await agent
        .patch(`/api/documents/${documentId}/connection`)
        .send(requestBody);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Database error" });
    });

    // Close the server after all tests have run
    afterAll(async () => {
      await new Promise((resolve) => {
        server.close(resolve);
      });
    });
  });
});
