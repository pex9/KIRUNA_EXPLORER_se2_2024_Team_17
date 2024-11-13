import request from "supertest";
const { app, server } = require("../index.mjs");
const locationDao = require("../dao/location-dao.js");

describe("Document API with Session Authentication", () => {
  let agent;
  let documentId;

  beforeAll(async () => {
    agent = request.agent(app);

    const loginResponse = await agent
      .post("/api/sessions")
      .send({ username: "mario@test.it", password: "pwd" });
    expect(loginResponse.status).toBe(200);
  });

  it("should retrieve all documents", async () => {
    const response = await agent.get("/api/documents");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should create a new document with valid data", async () => {
    const documentData = {
      title: "Sample Title",
      idStakeholder: 1,
      scale: "National",
      issuance_Date: "04/2019",
      language: "English",
      pages: 50,
      description: "A description for the document",
      idtype: 2,
      locationType: "Point",
      latitude: 19,
      longitude: 23,
      area_coordinates: "",
    };

    const response = await agent.post("/api/documents").send(documentData);
    expect(response.status).toBe(201);

    documentId = response.body.IdDocument || response.body.idDocument;
    expect(documentId).toBeDefined();
  });

  it("should return 400 for a document with invalid data", async () => {
    const invalidDocumentData = {
      title: "Sample Title",
      idStakeholder: 1,
      scale: "National",
      issuance_Date: "04/2019",
    };
    const response = await agent.post("/api/documents").send(invalidDocumentData);
    expect(response.status).toBe(400);
  });

  it("should return 500 if error to insert location", async () => {
    const invalidDocumentData = {
      title: "Sample Title",
      idStakeholder: 1,
      scale: "National",
      issuance_Date: "04/2019",
      language: "English",
      pages: 50,
      description: "A description for the document",
      idtype: 2,
    };

    // Mocking locationDao to simulate failure in location insertion
    locationDao.addLocation = jest.fn().mockResolvedValue(null);

    const response = await agent.post("/api/documents").send(invalidDocumentData);
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to add location.");
  });

  it("should update an existing document", async () => {
    const updatedDocumentData = {
      title: "Updated Sample Title",
      idStakeholder: 2,
      scale: "Regional",
      issuance_Date: "05/2020",
      language: "Spanish",
      pages: 100,
      description: "Updated description for the document",
      idtype: 3
    };

    const updateResponse = await agent
      .patch(`/api/documents/${documentId}`)
      .send(updatedDocumentData);
    expect(updateResponse.status).toBe(200);

    const retrieveResponse = await agent.get(`/api/documents/${documentId}`);
    expect(retrieveResponse.status).toBe(200);
    expect(retrieveResponse.body).toMatchObject({
      IdDocument: documentId,
      Title: "Updated Sample Title",
      IdStakeholder: 2,
      Scale: "Regional",
      Issuance_Date: "05/2020",
      Language: "Spanish",
      Pages: 100,
      Description: "Updated description for the document",
      IdType: 3
    });
  });

  it("should return 404 for a non-existent document ID", async () => {
    const nonExistentDocumentId = 9999;
    const response = await agent.get(`/api/documents/${nonExistentDocumentId}`);
    expect(response.status).toBe(404);
  });

  

  it("should retrieve a document by ID", async () => {
    const response = await agent.get(`/api/documents/${documentId}`);
    if (response.status === 200) {
      expect(response.body).toHaveProperty("IdDocument", documentId);
      expect(response.body).toHaveProperty("Title");
    } else {
      expect(response.status).toBe(404);
    }
  });

  it("should return 400 for not insert all data", async () => {
    const updatedDocumentData = {
      scale: "Regional",
      issuance_Date: "05/2020",
      language: "Spanish",
      pages: 100,
      description: "Updated description for the document",
      idtype: 3
    };
    const updateResponse = await agent
      .patch(`/api/documents/${documentId}`)
      .send(updatedDocumentData);
    expect(updateResponse.status).toBe(400);
  });
});
