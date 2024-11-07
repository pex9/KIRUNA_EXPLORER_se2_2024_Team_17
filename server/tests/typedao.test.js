'use strict';

import typesDao from '../dao/typeDocument-dao';
const db = require('../db/db');
jest.mock('../db/db'); // Mock the db module

describe('typesDao', () => {

    describe('getTypes', () => {
        let mockRows, mockTypes;

        beforeEach(() => {
            // Mock data representing rows returned from the database
            mockRows = [
                { IdType: 1, IconSrc: 'icon1.png', Type: 'Type1' },
                { IdType: 2, IconSrc: 'icon2.png', Type: 'Type2' },
            ];

            // Expected array of typeDocument instances
            const typeDocument = require('../models/typeDocument');
            mockTypes = mockRows.map(row => new typeDocument(row.IdType, row.IconSrc, row.Type));
        });

        it('should return all types of documents', async () => {
            db.all.mockImplementation((sql, params, callback) => {
                callback(null, mockRows); // Simulate db returning rows
            });

            const types = await typesDao.getTypes();
            expect(types).toEqual(mockTypes);
        });

        it('should reject if there is a database error', async () => {
            db.all.mockImplementation((sql, params, callback) => {
                callback(new Error('DB error'), null);
            });

            await expect(typesDao.getTypes()).rejects.toThrow('DB error');
        });
    });

    describe('getType', () => {
        let idType, mockRow, mockType;

        beforeEach(() => {
            idType = 1;

            // Mock row returned from database
            mockRow = { IdType: idType, IconSrc: 'icon1.png', Type: 'Type1' };

            // Expected typeDocument instance
            const typeDocument = require('../models/typeDocument');
            mockType = new typeDocument(mockRow.IdType, mockRow.IconSrc, mockRow.Type);
        });

        it('should return the type if the ID exists', async () => {
            db.get.mockImplementation((sql, params, callback) => {
                callback(null, mockRow); // Simulate db returning a valid row
            });

            const type = await typesDao.getType(idType);
            expect(type).toEqual(mockType);
        });

        it('should return error if the ID does not exist', async () => {
            db.get.mockImplementation((sql, params, callback) => {
                callback(null, undefined); // Simulate db returning no row
            });

            const result = await typesDao.getType(idType);
            expect(result).toEqual({ error: 'Type not found.' });
        });

        it('should reject if there is a database error', async () => {
            db.get.mockImplementation((sql, params, callback) => {
                callback(new Error('DB error'), null);
            });

            await expect(typesDao.getType(idType)).rejects.toThrow('DB error');
        });
    });
});
