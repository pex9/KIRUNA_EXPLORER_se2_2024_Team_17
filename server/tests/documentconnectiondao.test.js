'use strict';

const documentConnectionDao = require('../dao/document-connection-dao');
const db = require('../db/db');
jest.mock('../db/db'); // Mock the db module

describe('documentConnectionDao', () => {

    describe('createConnection', () => {
        const documentId1 = 1;
        const documentId2 = 2;
        const connectionId = 3;
        const DocumentConnectionId= 1;

        it('should create a new document connection', async () => {
            db.run.mockImplementation(function (sql, params, callback) {
                callback.call({ lastID: DocumentConnectionId }, null); // Use `callback.call` to set `this.lastID`
            });

            const newConnection = await documentConnectionDao.createConnection(documentId1, documentId2, connectionId);
            expect(newConnection).toEqual(expect.any(Object)); // Test if an object (DocumentConnection) is returned
        });

        it('should reject if there is a database error', async () => {
            db.run.mockImplementation((sql, params, callback) => {
                callback(new Error('DB error'));
            });

            await expect(documentConnectionDao.createConnection(documentId1, documentId2, connectionId)).rejects.toThrow('DB error');
        });
    });

    describe('getAllConnections', () => {
        const mockRows = [
            { IdConnectionDocuments: 1, IdDocument1: 1, IdDocument2: 2, IdConnection: 3 },
            { IdConnectionDocuments: 2, IdDocument1: 4, IdDocument2: 5, IdConnection: 6 },
        ];

        it('should return all document connections', async () => {
            db.all.mockImplementation((sql, callback) => {
                callback(null, mockRows);
            });

            const connections = await documentConnectionDao.getAllConnections();
            expect(connections).toEqual(mockRows);
        });

        it('should reject if there is a database error', async () => {
            db.all.mockImplementation((sql, callback) => {
                callback(new Error('DB error'));
            });

            await expect(documentConnectionDao.getAllConnections()).rejects.toThrow('DB error');
        });
    });

    describe('getConnections', () => {
        const documentId = 1;
        const mockRows = [
            { IdConnectionDocuments: 1, IdDocument1: documentId, IdDocument2: 2, IdConnection: 3 },
        ];

        it('should return connections for the specified document', async () => {
            db.all.mockImplementation((sql, params, callback) => {
                callback(null, mockRows);
            });

            const connections = await documentConnectionDao.getConnections(documentId);
            expect(connections).toEqual(mockRows);
        });

        it('should reject if there is a database error', async () => {
            db.all.mockImplementation((sql, params, callback) => {
                callback(new Error('DB error'));
            });

            await expect(documentConnectionDao.getConnections(documentId)).rejects.toThrow('DB error');
        });
    });

    describe('updateConnection', () => {
        const connectionIdDocuments = 1;
        const newDocumentId1 = 10;
        const newDocumentId2 = 20;
        const newConnectionId = 30;

        it('should update the specified document connection', async () => {
            db.run.mockImplementation((sql, params, callback) => {
                callback(null); // Simulate success
            });

            const result = await documentConnectionDao.updateConnection(connectionIdDocuments, newDocumentId1, newDocumentId2, newConnectionId);
            expect(result).toBe(true);
        });

        it('should reject if there is a database error', async () => {
            db.run.mockImplementation((sql, params, callback) => {
                callback(new Error('DB error'));
            });

            await expect(documentConnectionDao.updateConnection(connectionIdDocuments, newDocumentId1, newDocumentId2, newConnectionId)).rejects.toThrow('DB error');
        });
    });

    describe('deleteConnection', () => {
        const connectionIdDocuments = 1;

        it('should delete the specified document connection', async () => {
            db.run.mockImplementation((sql, params, callback) => {
                callback(null); // Simulate success
            });

            const result = await documentConnectionDao.deleteConnection(connectionIdDocuments);
            expect(result).toBe(true);
        });

        it('should reject if there is a database error', async () => {
            db.run.mockImplementation((sql, params, callback) => {
                callback(new Error('DB error'));
            });

            await expect(documentConnectionDao.deleteConnection(connectionIdDocuments)).rejects.toThrow('DB error');
        });
    });

    describe('getAllConnectionsType', () => {
        const mockRows = [
            { IdConnection: 1, Name: 'Connection Type 1' },
            { IdConnection: 2, Name: 'Connection Type 2' },
        ];

        it('should return all connection types', async () => {
            db.all.mockImplementation((sql, callback) => {
                callback(null, mockRows);
            });

            const connectionTypes = await documentConnectionDao.getAllConnectionsType();
            expect(connectionTypes).toEqual(mockRows);
        });

        it('should reject if there is a database error', async () => {
            db.all.mockImplementation((sql, callback) => {
                callback(new Error('DB error'));
            });

            await expect(documentConnectionDao.getAllConnectionsType()).rejects.toThrow('DB error');
        });
    });

});
