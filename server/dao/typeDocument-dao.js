'use strict';

/* Data Access Object (DAO) module for accessing the types */

const db = require("../db/db");
const typeDocument = require('../models/typeDocument'); // Import the typeDocument class

/**
 * Retrieves all types .
 * @returns {Promise<array<Object>} A promise that resolves all types of documents.
 */
exports.getTypes = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM TypeDocument';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const types = rows.map(row => new typeDocument(row.IdType, row.IconSrc, row.Type));
            resolve(types);
        });
    });
};
/**
 * Retrieves the select type .
 * @param {Integer} IdType - the id of the type.
 * @returns {Promise<Object>} A promise that resolves with the type object.
 */
exports.getType = (IdType)=>{
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM TypeDocument WHERE IdType = ?';
        db.get(sql, [IdType], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: 'Type not found.' });
            } else {
                const type = new typeDocument(row.IdType, row.IconSrc, row.Type);
                resolve(type);
            }
        });
    });
}