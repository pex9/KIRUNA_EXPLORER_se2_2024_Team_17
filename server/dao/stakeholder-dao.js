'use strict';

/* Data Access Object (DAO) module for accessing the stakeholder */

const db = require("../db/db");
const stakeholder = require('../models/stakeholder'); // Import the stakeholder class


/**
 * Retrieves all stakeholder .
 * @returns {Promise<array<Object>} A promise that resolves all stakeholders.
 */
exports.getStakeholders = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Stakeholder';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const stakeholders = rows.map(row => new stakeholder(row.IdStakeholder, row.Name, row.Description, row.IconSrc));
            resolve(stakeholders);
        });
    });
};
/**
 * Retrieves a stakeholder given the id .
 * @param {Integer} id - the id of the stakeholder.
 * @returns {Promise<Object>} A promise that resolves to the stakeholder object.
 */
exports.getStakeholderById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Stakeholder WHERE IdStakeholder = ?';

        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: 'Stakeholder not found.' });
            } else {
                const stakeholder = new stakeholder(row.IdStakeholder, row.Name, row.Description, row.IconSrc);
                resolve(stakeholder);
            }
        });
    });
}