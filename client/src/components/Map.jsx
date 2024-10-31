import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import { Button, Modal, Card, Form } from "react-bootstrap"; // Import Form for input fields
import L from "leaflet";
import { useNavigate } from "react-router-dom";

// Sample data for markers within the initial view
const markers = [
  {
    id: 1,
    title: "Document Location 1",
    description: "Description for Document 1",
    additionalInfo: "More details about Document 1",
    position: [67.8558, 20.2253],
  },
  {
    id: 2,
    title: "Document Location 2",
    description: "Description for Document 2",
    additionalInfo: "More details about Document 2",
    position: [67.8600, 20.2300],
  },
  {
    id: 3,
    title: "Document Location 3",
    description: "Description for Document 3",
    additionalInfo: "More details about Document 3",
    position: [67.8585, 20.2350],
  },
];

function MapComponent() {
  const [selectedMarker, setSelectedMarker] = useState(null); // Track selected marker
  const [showModal, setShowModal] = useState(false); // Modal visibility for marker details
  const [showAddConnection, setShowAddConnection] = useState(false); // Modal visibility for adding connection
  const [selectedDocument, setSelectedDocument] = useState(''); // State for document input
  const [connectionType, setConnectionType] = useState(''); // State for connection type
  const navigate = useNavigate(); // Navigation hook

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setShowModal(true);
  };

  const handleModifyDocument = () => {
    navigate(`/documents/modify-document/${selectedMarker.id}`);
  };

  const handleAddConnection = () => {
    if (selectedDocument && connectionType) {
      console.log("Add connection:", {
        document: selectedDocument,
        type: connectionType,
        markerId: selectedMarker.id,
      });
      // Reset fields after adding connection
      setSelectedDocument('');
      setConnectionType('');
      setShowAddConnection(false);
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <>
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

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            eventHandlers={{
              click: () => handleMarkerClick(marker),
            }}
          >
            <Popup>{marker.title}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Modal to display selected marker details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedMarker?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <Card.Text>
                <strong>Description:</strong> {selectedMarker?.description}
              </Card.Text>
              <Card.Text>
                <strong>Additional Info:</strong> {selectedMarker?.additionalInfo}
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

