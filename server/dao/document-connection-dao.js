"use strict";

/* Data Access Object (DAO) module for accessing documents connection */

const db = require("../db/db");
const DocumentConnection = require("../models/document-connection"); // Import the DocumentConnection class

/**
 * Creates a new connection between two documents.
 * @param {Number} documentId1 - ID of the first document
 * @param {Number} documentId2 - ID of the second document
 * @param {Number} connectionId - ID of the connection type
 * @returns {Promise<Boolean>} Resolves to true if the connection was created successfully, false otherwise
 */

exports.createConnection = (documentId1, documentId2, connectionId) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO DocumentConnection (IdDocument1, IdDocument2, IdConnection) VALUES (?, ?, ?)";
    db.run(sql, [documentId1, documentId2, connectionId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      const newConnection = new DocumentConnection(
        this.lastID,
        documentId1,
        documentId2,
        connectionId
      );
      resolve(newConnection);
    });
  });
};

/**
 * Retrieving all connections for a specific document from the DocumentConnection table
 * @param {Number} documentId - ID of the document to retrieve connections for
 * @returns {Promise<Array>} Resolves to an array of connection objects for the document
 */

exports.getConnections = (documentId) => {
  return new Promise((resolve, reject) => {
    const sql =
      " SELECT IdConnectionDocuments, IdDocument1, IdDocument2, IdConnection FROM DocumentConnection WHERE IdDocument1 = ? OR IdDocument2 = ? ";
    db.all(sql, [documentId, documentId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};

/**
 * Updating the connection type of an existing document connection in the DocumentConnection table
 * @param {Number} connectionIdDocuments - ID of the document connection to update
 * @param {Number} newConnectionId - The new connection ID to set for the connection
 * @returns {Promise<Boolean>} Resolves to true if the connection was updated successfully, false otherwise
 */
exports.updateConnection = (connectionIdDocuments, newConnectionId) => {
  return new Promise((resolve, reject) => {
    const sql =
      " UPDATE DocumentConnection SET IdConnection = ? WHERE IdConnectionDocuments = ? ";
    db.run(sql, [newConnectionId, connectionIdDocuments], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

/**
 * Deleting a document connection by its ID from the DocumentConnection table
 * @param {Number} connectionIdDocuments - ID of the document connection to delete
 * @returns {Promise<Boolean>} Resolves to true if the connection was deleted successfully, false otherwise
 */
exports.deleteConnection = (connectionIdDocuments) => {
  return new Promise((resolve, reject) => {
    const sql =
      " DELETE FROM DocumentConnection WHERE IdConnectionDocuments = ?";
    db.run(sql, [connectionIdDocuments], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

/**
 * Updating the connection type of an existing document connection in the DocumentConnection table
 * @param {Number} connectionIdDocuments - ID of the document connection to update
 * @param {Number} newDocumentId1 - The new ID for the first document
 * @param {Number} newDocumentId2 - The new ID for the second document
 * @param {Number} newConnectionId - The new connection ID to set for the connection type
 * @returns {Promise<Boolean>} Resolves to true if the connection was updated successfully, false otherwise
 */
exports.updateConnection = (
  connectionIdDocuments,
  newDocumentId1,
  newDocumentId2,
  newConnectionId
) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE DocumentConnection SET IdDocument1 = ?, IdDocument2 = ?, IdConnection = ? WHERE IdConnectionDocuments = ?";
    db.run(
      sql,
      [newDocumentId1, newDocumentId2, newConnectionId, connectionIdDocuments],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      }
    );
  });
};
