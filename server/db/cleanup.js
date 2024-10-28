"use strict";

const db = require('./db');
/**
 * Deletes all data from the database.
 * This function must be called before any integration test to ensure a clean database state for each test run.
 */

function runQuery(query) {
    return new Promise((resolve, reject) => {
        db.run(query, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function cleanup() {
    await runQuery("DELETE FROM Document");
    await runQuery("DELETE FROM DocumentConnection");
    await runQuery("DELETE FROM Connection");
    await runQuery("DELETE FROM TypeDocument");
    await runQuery("DELETE FROM Stakeholder");
    await runQuery("DELETE FROM Location");
    await runQuery("DELETE FROM User");
    
}

module.exports = { cleanup }; // Export the cleanup function