const db = require("../db/db");
const Location = require("../models/location"); // Import the Location class


/**
 * Adds a new location to the database.
 * @function addLocation
 * @param {String} location_type - Type of location.
 * @param {Number} latitude - Latitude of the location.
 * @param {Number} longitude - Longitude of the location.
 * @param {String} area_coordinates - Area coordinates of the location.
 * @returns {Promise<Number>} Resolves with the id created location.
 */
exports.addLocation = (location_type,latitude,longitude,area_coordinates,area_name) => {

  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Location (Location_type, Latitude, Longitude, Area_coordinates,Area_Name) VALUES (?,?,?,?,?)";
    db.run(
      sql,[location_type,latitude,longitude,JSON.stringify(area_coordinates),area_name],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        const newlocation = new Location(this.lastID,location_type,latitude,longitude,area_coordinates,area_name);
        resolve(this.lastID);
      }
    );
  });
};
/**
 * Get locatios point to the database.
 * @function getLocations
 * @returns {Promise<Number>} Resolves with all locations point.
 */
exports.getLocationsPoint = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Location WHERE Location_Type = "Point"';

        db.all(sql, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row)
                };
            })
    });
};
/**
 * Get locations area to the database .
 * @function getLocations
 * @returns {Promise<Number>} Resolves with all locations area.
 */
exports.getLocationsArea = () => {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM Location WHERE Location_Type = "Area"';

      db.all(sql, (err, row) => {
          if (err) {
              reject(err);
          } else {
              resolve(row)
              };
          })
  });
};
/**
 * get all locationa to the database.
 * @function getLocations
 * @param {Integer} locationId - id of location.
 * @returns {Promise<Number>} Resolves with the location.
 */
exports.getLocationById = (locationId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Location WHERE IdLocation = ?';

        db.get(sql, [locationId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row)
                };
            })
    });
};
/**
 * Updates the location giving the id to the database.
 * @function updateLocation
 * @param {Integer} locationId - integer of location.
 * @param {String} location_type - Type of location.
 * @param {Number} latitude - Latitude of the location.
 * @param {Number} longitude - Longitude of the location.
 * @param {String} area_coordinates - Area coordinates of the location.
 * @returns {Promise<Number>} Resolves with the update location.
 */
exports.updateLocation = (locationId, location_type,latitude,longitude,area_coordinates) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE Location SET Location_type = ?, Latitude = ?, Longitude = ?, Area_coordinates = ? WHERE IdLocation = ?";
        db.run(sql, [location_type,latitude,longitude,area_coordinates,locationId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}