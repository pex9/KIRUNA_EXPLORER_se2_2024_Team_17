'use strict';

const userDao = require('../dao/user-dao');
const db = require('../db/db');
const crypto = require('crypto');
jest.mock('../db/db'); // Mock the db module

describe('userDao', () => {

    describe('getUser', () => {
        let email, password, mockRow, mockUser;
        
        beforeEach(() => {
            email = 'test@example.com';
            password = 'password123';

            // Sample data to mock a database response
            mockRow = {
                IdUser: 1,
                Name: 'Test',
                Surname: 'User',
                Email: 'test@example.com',
                Role: 'admin',
                Salt: 'randomSalt',
                PasswordHash: crypto.scryptSync(password, 'randomSalt', 32).toString('hex'),
            };

            // Expected User instance
            const User = require('../models/User');
            mockUser = new User(mockRow.IdUser, mockRow.Name, mockRow.Surname, mockRow.Email, mockRow.Role);
        });

        it('should return the user if email and password match', async () => {
            db.get.mockImplementation((sql, params, callback) => {
                callback(null, mockRow); // Simulate db returning a valid row
            });

            const user = await userDao.getUser(email, password);
            expect(user).toEqual(mockUser);
        });

        it('should return false if email does not exist', async () => {
            db.get.mockImplementation((sql, params, callback) => {
                callback(null, undefined); // Simulate db returning no row
            });

            const result = await userDao.getUser(email, password);
            expect(result).toBe(false);
        });

        it('should return false if password does not match', async () => {
            db.get.mockImplementation((sql, params, callback) => {
                callback(null, mockRow); // Simulate db returning a valid row
            });

            const result = await userDao.getUser(email, 'wrongPassword');
            expect(result).toBe(false);
        });

        it('should reject if there is a database error', async () => {
            db.get.mockImplementation((sql, params, callback) => {
                callback(new Error('DB error'), null);
            });

            await expect(userDao.getUser(email, password)).rejects.toThrow('DB error');
        });
    });

    describe('getUserById', () => {
        let userId, mockRow, mockUser;

        beforeEach(() => {
            userId = 1;

            // Mock row returned from database
            mockRow = {
                IdUser: userId,
                Name: 'Test',
                Surname: 'User',
                Email: 'test@example.com',
                Role: 'admin',
            };

            // Expected User instance
            const User = require('../models/User');
            mockUser = new User(mockRow.IdUser, mockRow.Name, mockRow.Surname, mockRow.Email, mockRow.Role);
        });

        it('should return the user if the ID exists', async () => {
            db.get.mockImplementation((sql, params, callback) => {
                callback(null, mockRow); // Simulate db returning a valid row
            });

            const user = await userDao.getUserById(userId);
            expect(user).toEqual(mockUser);
        });

        it('should return error if the ID does not exist', async () => {
            db.get.mockImplementation((sql, params, callback) => {
                callback(null, undefined); // Simulate db returning no row
            });

            const result = await userDao.getUserById(userId);
            expect(result).toEqual({ error: 'User not found.' });
        });

        it('should reject if there is a database error', async () => {
            db.get.mockImplementation((sql, params, callback) => {
                callback(new Error('DB error'), null);
            });

            await expect(userDao.getUserById(userId)).rejects.toThrow('DB error');
        });
    });
});
