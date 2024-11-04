import { useContext, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button, Card, Form, Spinner, Modal } from "react-bootstrap"; // Importing required components
import { useNavigate } from "react-router-dom";
import AppContext from '../AppContext';
import L from 'leaflet';
import API from '../API';
import '../App.css';

function MapComponent({ locations, documents, setSelectedLocation }) {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState('');
  const [connectionType, setConnectionType] = useState('');
  const [iconsVector, setIconsVector] = useState([]);
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const isLogged = context.loginState.loggedIn;

  useEffect(() => {
    const getTypeById = async (id) => {
      try {
        const type = await API.getTypeDocument(id);
        setIconsVector((prev) => [...prev, type.iconsrc]);
      } catch (err) {
        console.error(err);
      }
    };

    documents.forEach(async (document) => {
      await getTypeById(document.IdType);
    });
  }, [documents]);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setShowCard(true);
  };

  const handleModifyDocument = () => {
    if (selectedMarker) {
      navigate(`/documents/modify-document/${selectedMarker.IdDocument}`);
    }
  };

  const handleAddConnection = () => {
    if (selectedDocument && connectionType) {
      console.log("Adding connection:", {
        document: selectedDocument,
        type: connectionType,
        markerId: selectedMarker?.id,
      });
      setSelectedDocument('');
      setConnectionType('');
      setShowAddConnection(false);
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleDragEnd = (document, e) => {
    const { lat, lng } = e.target.getLatLng();
    console.log(`Marker for ${document.Title} moved to ${lat}, ${lng}`);

    // Update document position using the API
    API.updateLocationDocument(
      document.IdDocument,
      document.Location_Type,
      lat,
      lng,
      document.Area_Coordinates
    )
      .then(() => {
        console.log('Position updated successfully');
      })
      .catch((err) => {
        console.error('Error updating position:', err);
      });
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        console.log("Map clicked at:", lat, lng);
        setSelectedLocation({ lat, lng });
      },
    });
    return null;
  }

  return (
    <>
      {documents.length === 0 || locations.length === 0 ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <MapContainer center={[67.8558, 20.2253]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
          {documents.map((document, index) => {
            const location = locations[document.IdLocation];
            return (
              <Marker
                icon={
                  new L.Icon({
                    iconUrl: `src/icon/${iconsVector[index]}`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32],
                  })
                }
                draggable
                eventHandlers={{
                  dragend: (e) => handleDragEnd(document, e),
                  click: () => handleMarkerClick(document),
                }}
                key={index}
                position={[location.Latitude, location.Longitude]}
              >
                <Popup>{document.Title}</Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}

      {/* Marker Details Card */}
      {showCard && (
        <Card style={{ position: 'relative', marginTop: '20px', padding: '10px', zIndex: 1000 }}>
          <Button variant="close" onClick={() => setShowCard(false)} style={{ position: 'absolute', top: '10px', right: '10px' }} />
          <Card.Body>
            <Card.Title>{selectedMarker?.Title}</Card.Title>
            <Card.Text><strong>Description:</strong> {selectedMarker?.Description}</Card.Text>
            <Card.Text><strong>Date:</strong> {selectedMarker?.Issuance_Date}</Card.Text>
            <Card.Text><strong>Scale:</strong> {selectedMarker?.Scale}</Card.Text>
            <Card.Text><strong>Language:</strong> {selectedMarker?.Language}</Card.Text>
            <Card.Text><strong>Pages:</strong> {selectedMarker?.Pages}</Card.Text>
            <Card.Text>
              <strong>Latitude:</strong> {locations[selectedMarker?.IdLocation]?.Latitude.toFixed(2)}
            </Card.Text>
            <Card.Text>
              <strong>Longitude:</strong> {locations[selectedMarker?.IdLocation]?.Longitude.toFixed(2)}
            </Card.Text>
            {isLogged && (
              <Button variant="secondary" onClick={handleModifyDocument}>Modify</Button>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Add Connection Modal */}
      <Modal show={showAddConnection} onHide={() => setShowAddConnection(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Connection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDocument">
              <Form.Label>Document</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter document name"
                value={selectedDocument}
                onChange={(e) => setSelectedDocument(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formConnectionType">
              <Form.Label>Connection Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter connection type"
                value={connectionType}
                onChange={(e) => setConnectionType(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAddConnection}>Add Connection</Button>
          <Button variant="secondary" onClick={() => setShowAddConnection(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MapComponent;
