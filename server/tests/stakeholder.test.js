import request from "supertest";
const { app, server } = require("../index.mjs");
const StakeholderDao = require("../dao/stakeholder-dao.js");
jest.mock("../dao/stakeholder-dao.js");

describe("Stakeholder API", () => {
  let agent;

  beforeAll(async () => {
    agent = request.agent(app);

    // Simulate login
    await agent
      .post("/api/sessions")
      .send({ username: "mario@test.it", password: "pwd" });
  });
  describe("GET /api/stakeholders", () => {
    it("should retrieve all stakeholders", async () => {
      const mockStakeholders = [
        { IdStakeholder: 1, Name: "LKAB", Color: "#000000" },
        { IdStakeholder: 2, Name: "Municipality", Color: "#8C6760" },
        { IdStakeholder: 3, Name: "Norrbotten Country", Color: "#702F36" },
      ];
      StakeholderDao.getStakeholders.mockResolvedValue(mockStakeholders);

      const response = await agent.get("/api/stakeholders");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStakeholders);
    });

    it("should handle errors", async () => {
      StakeholderDao.getStakeholders.mockRejectedValue(
        new Error("Database error")
      );

      const response = await agent.get("/api/stakeholders");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({});
    });
  });

  describe("GET /api/stakeholders/:stakeholderid", () => {
    it("should retrieve a stakeholder by ID", async () => {
      const stakeholderId = 1;
      const mockStakeholder = {
        IdStakeholder: stakeholderId,
        Name: "LKAB",
        Color: "#000000",
      };

      StakeholderDao.getStakeholderById.mockResolvedValue(mockStakeholder);

      const response = await agent.get(`/api/stakeholders/${stakeholderId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStakeholder);
    });

    it("should return 404 if the stakeholder is not found", async () => {
      StakeholderDao.getStakeholderById.mockResolvedValue(null);

      const response = await agent.get("/api/stakeholders/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Stakeholder not found" });
    });

    it("should return 500 for database errors", async () => {
      const stakeholderId = 1;
      StakeholderDao.getStakeholderById.mockRejectedValue(
        new Error("Database error")
      );

      const response = await agent.get(`/api/stakeholders/${stakeholderId}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({});
    });
  });
});
