const db = require("../db/db");
const documentDao = require("../dao/document-dao");
const Document = require("../models/document");

jest.mock("../db/db");

describe("documentDao", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("getDocuments", () => {
    it("should return an array of documents", async () => {
      const mockDocuments = [
        { id: 1, title: "Document 1" },
        { id: 2, title: "Document 2" },
      ];

      db.all.mockImplementation((sql, callback) => {
        callback(null, mockDocuments);
      });

      const documents = await documentDao.getDocuments();
      expect(documents).toEqual(mockDocuments);
    });
  });

  describe("getDocumentById", () => {
    it("should return a document by ID", async () => {
      const mockDocument = {
        id: 1,
        title: "Sample Document",
        idStakeholder: 1,
        scale: "National",
        issuance_Date: "01/01/2023",
        language: "English",
        pages: 10,
        description: "Sample description",
        idtype: 2,
        idlocation: 1,
      };

      db.get.mockImplementation((sql, params, callback) => {
        callback(null, mockDocument);
      });

      const document = await documentDao.getDocumentById(1);
      expect(document).toEqual(mockDocument);
    });
  });

  describe("updateDocument", () => {
    it("should update the document and return true", async () => {
      const mockDocumentId = 1;
      const mockTitle = "Updated Title";
      const mockIdStakeholder = 1;
      const mockScale = "Regional";
      const mockIssuanceDate = "02/02/2023";
      const mockLanguage = "Spanish";
      const mockPages = 15;
      const mockDescription = "Updated description";
      const mockIdType = 3;

      db.run.mockImplementation((sql, params, callback) => {
        callback(null); // No error
      });

      const result = await documentDao.updateDocument(
        mockDocumentId,
        mockTitle,
        mockIdStakeholder,
        mockScale,
        mockIssuanceDate,
        mockLanguage,
        mockPages,
        mockDescription,
        mockIdType
      );

      expect(result).toBe(true);
    });

    it("should return an error when update fails", async () => {
      db.run.mockImplementation((sql, params, callback) => {
        callback(new Error("Failed to update document"));
      });

      await expect(
        documentDao.updateDocument(
          1,
          "Title",
          1,
          "Scale",
          "Date",
          "Language",
          10,
          "Description",
          2
        )
      ).rejects.toThrow("Failed to update document.");
    });
  });
});