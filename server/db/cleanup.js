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
    //await runQuery("DELETE FROM COUNTER_SERVICE");
}

module.exports = { cleanup }; // Export the cleanup function