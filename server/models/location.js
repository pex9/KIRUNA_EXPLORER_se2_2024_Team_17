class Location{
    constructor(idLocation,location_type,latitude,longitude,area_coordinates) {
        this.idLocation = idLocation;
        this.location_type = location_type;
        this.latitude = latitude;
        this.longitude = longitude;
        this.area_coordinates = area_coordinates;
    }
}
module.exports = Location;