import { useContext, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents,  } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button, Modal, Card, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AppContext from '../AppContext';
import L from 'leaflet';
import API from '../API';
import '../App.css';


function MapComponent(locations, documents ,setSelectedLocation) {

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState('');
  const [connectionType, setConnectionType] = useState('');
  const [iconsVector, setIconsVector] = useState([]);
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const isLogged = context.loginState.loggedIn;
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

  useState(() => {

    const getTypeById = async (id) => {
      try {
        const type = await API.getTypeDocument(id);
        //console.log(type);
        setIconsVector((prev) => [...prev, type.iconsrc]);
      } catch (err) {
        throw console.error(err);
      }
    };
    
    locations.documents.forEach(async (document) => {
      await getTypeById(document.IdType);
    });


  },[]);

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

  console.log(locations);

  return (
    <>
      {documents.length  === 0  || locations.length === 0? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <MapContainer
          center={[67.8558, 20.2253]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker /> {/* This component listens for map clicks */}
          {
          locations.documents.map((document,index) => (
            <Marker
              icon={new L.Icon({
                  iconUrl: `src/icon/${iconsVector[index]}`,
                  iconSize: [32, 32],
                  iconAnchor: [16, 32],
                  popupAnchor: [0, -32],
                  html: `<span style="red" />`

                })
              }
              className='red'
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
          <Modal.Title>{selectedMarker?.Title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <Card.Text>
                <strong>Description:</strong> {selectedMarker?.Description}
              </Card.Text>
              <Card.Text>
                <strong>Date:</strong> {selectedMarker?.Issuance_Date}
              </Card.Text>
              <Card.Text>
                <strong>Scale:</strong> {selectedMarker?.Scale}
              </Card.Text>
              <Card.Text>
                <strong>Language:</strong> {selectedMarker?.Language}
              </Card.Text>
              <Card.Text>
                <strong>Pages:</strong> {selectedMarker?.Pages}
              </Card.Text>
              <Card.Text>
                <strong>Latitude:</strong> {locations.locations[selectedMarker?.IdLocation]?.Latitude.toFixed(2)}         
              </Card.Text>
              <Card.Text>
                <strong>Longitude:</strong> {locations.locations[selectedMarker?.IdLocation]?.Longitude.toFixed(2)}           
              </Card.Text>
            </Card.Body>
          </Card>
        </Modal.Body>
        {isLogged && (
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModifyDocument}>Modify</Button>
        </Modal.Footer>
        )}
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