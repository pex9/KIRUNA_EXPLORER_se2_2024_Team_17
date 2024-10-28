'use strict';

/* Data Access Object (DAO) module for accessing users */

const db = require("../db/db");
const crypto = require('crypto');
const User = require('../models/User'); // Import the User class


/**
 * Retrieves a user from the database that does login.
 * @param {String} email - the email of the user.
 * @param {String} password - the password of the user.
 * @returns {Promise<Object>} A promise that resolves to the user object.
 */
exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM User WHERE Email = ?';

        db.get(sql, [email], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve(false);
            } else {
                // Create an instance of User
                const user = new User(row.IdUser, row.Name,  row.Surname,row.Email, row.Role);
                
                const salt = row.Salt;
                crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
                    if (err) reject(err);

                    const passwordHex = Buffer.from(row.PasswordHash, 'hex');

                    if (!crypto.timingSafeEqual(passwordHex, hashedPassword)) {
                        resolve(false);
                    } else {
                        resolve(user); // Return the User instance
                    }
                });
            }
        });
    });
};

/**
 * Retrieves a user from the database using id.
 * @param {Integer} id - the id of the user.
 * @returns {Promise<Object>} A promise that resolves to the user object.
 */
exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM User WHERE IdUser = ?';

        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: 'User not found.' });
            } else {
                // Create an instance of User
                const user = new User(row.IdUser, row.Name, row.Surname,row.Email, row.Role);
                resolve(user); // Return the User instance
            }
        });
    });
};
