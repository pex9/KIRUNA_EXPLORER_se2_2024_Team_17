"use strict";

/* Data Access Object (DAO) module for accessing document infomration */

const db = require("../db/db");
const Document = require("../models/document"); // Import the Document class
const locationDao = require("./location-dao");

/**
 * Adds a new document to the database.
 *
 * @function addDocument
 * @param {String} title - Title of the document.
 * @param {Number} idStakeholder - Unique identifier of the stakeholder associated with the document.
 * @param {String} scale - The scale of the document (e.g., 'National', 'Regional').
 * @param {String} issuance_Date - The issuance date of the document in 'MM/DD/YYYY' format.
 * @param {String} language - Language of the document (e.g., 'English').
 * @param {Number} pages - The number of pages in the document.
 * @param {String} description - A brief description of the document's contents.
 * @param {Number} idtype - Unique identifier of the document type.
 * @param {Number} idlocation - The location of a specific document
 * @returns {Promise<Number>} Resolves with newly object.
 */
exports.addDocument = async (title,idStakeholder,scale,issuance_Date,language,pages,description,idtype,idlocation) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Document (Title, IdStakeholder, Scale, Issuance_Date, Language, Pages, Description, IdType, IdLocation) VALUES (?,?,?,?,?,?,?,?,?)";
    db.run(
      sql,[title,idStakeholder,scale,issuance_Date,language,pages,description,idtype,idlocation],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        const newdocument = new Document(this.lastID,title,idStakeholder,scale,issuance_Date,language,pages,description,idtype,idlocation);
        resolve(newdocument);
      }
    );
  });
};
// here other function es get document
exports.getDocuments = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Document';

        db.all(sql, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row)
                };
            })
    });
};
exports.getDocumentById = (documentId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Document WHERE IdDocument = ?';

        db.get(sql, [documentId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row)
            };
            }) 
        });
    };
/**
 * Updating the document id of a document.
 * @param {Number} documentId - ID of the document to update.
 * @returns {Promise<Boolean>} resolved with the new object update.
 */
exports.updateDocument = (documentId, title,idStakeholder,scale,issuance_Date,language,pages,description,idtype,idlocation) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE Document SET Title = ?, IdStakeholder = ?, Scale = ?, Issuance_Date = ?, Language = ?, Pages = ?, Description = ?, IdType = ?, IdLocation = ? WHERE IdDocument = ?";
    db.run(sql, [title,idStakeholder,scale,issuance_Date,language,pages,description,idtype,idlocation,documentId], function (err) {
      if (err) {
        reject(new Error("Failed to update document."));
        return;
      }
      resolve(true);
    });
  })};
