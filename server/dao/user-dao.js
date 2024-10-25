'use strict';

/* Data Access Object (DAO) module for accessing users */

const db = require("../db/db");
const crypto = require('crypto');
const User = require('../models/User'); // Import the User class

exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';

        db.get(sql, [email], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve(false);
            } else {
                // Create an instance of User
                const user = new User(row.id, row.name, row.email, row.admin);
                
                const salt = row.salt;
                crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
                    if (err) reject(err);

                    const passwordHex = Buffer.from(row.hash, 'hex');

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

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE id = ?';

        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: 'User not found.' });
            } else {
                // Create an instance of User
                const user = new User(row.id, row.name, row.email, row.admin);
                resolve(user); // Return the User instance
            }
        });
    });
};
