import { MapContainer, TileLayer } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapComponent() {
  return (
    <>
      <MapContainer
        center={[67.8558, 20.2253]}
        zoom={13}
        scrollWheelZoom={false}
        className="map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </>
  );
}
/*
    nb center={[67.8558, 20.2253] is the position of the map when it is loaded es kiruna
    marker position is for the document and can we can also put some icon so here we call the get document to see all the markers
    const markers = [
    {
        geocode: [48.86, 2.3522],
        popUp: "Hello, I am pop up 1"
    },
    {
        geocode: [48.85, 2.3522],
        popUp: "Hello, I am pop up 2"
    },
    {
        geocode: [48.855, 2.34],
        popUp: "Hello, I am pop up 3"
    }
    ]; // like this and then foreach above to show all the markers in the map
*/
/*
    to change the view of the map we can use the leaflet providers and put the url in the url of the tilelayer(see video on youtube)
    https://leaflet-extras.github.io/leaflet-providers/preview/
*/
export default MapComponent;
