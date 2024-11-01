import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button, Modal, Card, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
function MapComponent(locations, documents ,setSelectedLocation) {

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState('');
  const [connectionType, setConnectionType] = useState('');
  const navigate = useNavigate();


  const handleMarkerClick = (marker) => {
    console.log("Marker clicked:", marker);
    setSelectedMarker(marker);
    setShowModal(true);
  };

  const handleModifyDocument = () => {
    if (selectedMarker) {
      navigate(`/documents/modify-document/${selectedMarker.IdDocument}`);
    }
  };

  const handleAddConnection = () => {
    if (selectedDocument && connectionType) {
      console.log("Add connection:", {
        document: selectedDocument,
        type: connectionType,
        markerId: selectedMarker.id,
      });
      setSelectedDocument('');
      setConnectionType('');
      setShowAddConnection(false);
    } else {
      alert("Please fill in all fields.");
    }
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        console.log("Map clicked at:", lat, lng);
        locations.setSelectedLocation({ lat, lng });
      },
    });
    return null;
  }
  return (
    <>
      {documents.length  === 0  || locations.length === 0? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <MapContainer
          center={[67.8558, 20.2253]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "80vh", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker /> {/* This component listens for map clicks */}
          {
          locations.documents.map((document,index) => (
            <Marker
              key={index}
              position={[locations.locations[document.IdLocation].Latitude, locations.locations[document.IdLocation].Longitude]}
              eventHandlers={{
                click: () => handleMarkerClick(document),
              }}
            >
              <Popup>{document.Title}</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
  {/* Modal to display selected marker details */}
  <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedMarker?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <Card.Text>
                <strong>Title:</strong> {selectedMarker?.Title}
              </Card.Text>
              <Card.Text>
                <strong>Description:</strong> {selectedMarker?.Description}
              </Card.Text>
              <Card.Text>
                <strong>Date:</strong> {selectedMarker?.Issuance_Date}
              </Card.Text>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowAddConnection(true)}>Add Connection</Button>
          <Button variant="secondary" onClick={handleModifyDocument}>Modify</Button>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

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