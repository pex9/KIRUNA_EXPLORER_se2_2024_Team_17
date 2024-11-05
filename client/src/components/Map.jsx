import { useContext, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button, Card, Form, Spinner, Modal, CardFooter, Col, Overlay } from "react-bootstrap"; // Importing required components
import { useNavigate } from "react-router-dom";
import AppContext from '../AppContext';
import L from 'leaflet';
import API from '../API';
import '../App.css';

function MapComponent({ locations, documents, setSelectedLocation, propsDocument, selectedLocation }) {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState('');
  const [connectionType, setConnectionType] = useState('');
  const [iconsVector, setIconsVector] = useState([]);
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const isLogged = context.loginState.loggedIn;
  const [modifyMode, setModifyMode] = useState(false);

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
    console.log(`Marker for ${document} moved to ${lat}, ${lng}`);
    console.log('Document:', document);

    // Update document position using the API
    
    
    API.updateLocationDocument(
      document.IdLocation,
      "Point",
      lat,
      lng,
      ""
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
        <div>
        <MapContainer center={[67.8558, 20.2253]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {modifyMode && <LocationMarker />}
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
                draggable={modifyMode} // Only make draggable if logged in
                eventHandlers={{
                  dragend: (e) => {
                    if (isLogged) {
                      handleDragEnd(document, e); // Only call dragend if logged in
                    }
                  },
                  click: () => handleMarkerClick(document),
                }}
                key={index}
                position={[location.Latitude, location.Longitude]}
              >
                <Popup>{document.Title}</Popup>
              </Marker>
            );
          })}
        {showCard && (
          <Card className='d-flex col-3 overlay' style={{marginLeft:'1%'}}>
            <Button variant="close" onClick={() => setShowCard(false)} style={{ position: 'absolute', top: '10px', right: '10px' }} />
              <Card.Header>
              <Card.Title>{selectedMarker?.Title}</Card.Title>
              </Card.Header>
            <Card.Body className='document-card text-start p-4'>
              <div className='d-flex'>
                
              <div className='col-6'>
              
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
              </div>
              <div>
              <Card.Text><strong>Description:</strong> {selectedMarker?.Description}</Card.Text>
              </div>
              </div>
            </Card.Body>
              {isLogged && (
            <Card.Footer className=' text-end' >
                <Button variant="secondary" onClick={handleModifyDocument}>Modify</Button>
            </Card.Footer>
              )}
          </Card>
        )}
        {selectedLocation && (
                    <div className='d-flex justify-content-end me-5'>
                            <Card className='text-start form p-3 overlay'>
                            <Button variant="link" style={{ color: 'black', position: 'absolute', right: '0px', top: '0px' }} onClick={() => setSelectedLocation(null)}>
                              <i className="bi bi-x h2"></i>
                            </Button>
                            <div className='m-3'>
                              <h4>Selected Location:</h4>
                              <p>Latitude: {selectedLocation.lat.toFixed(4)}, Longitude: {selectedLocation.lng.toFixed(4)}</p>
                            </div>
                            <div className='text-center'>
                              <Button
                                variant="dark"
                                className='py-1 rounded-pill btn-document'
                                size="sm"
                                onClick={() => navigate('documents/create-document', { state: { location: selectedLocation } })}
                                disabled={!selectedLocation} // Disable button if no location is selected
                              >
                                <h6>
                                  Add document
                                </h6>
                              </Button>
                            </div>
                          </Card>
                    </div>
                    )}
        </MapContainer>
        </div>
      )}
      <div className='d-flex mt-2 justify-content-end me-5'>
        {modifyMode && <strong className='col text-end mx-5 mt-1'>Drag / Add new location enabled</strong>}
        <Button variant='dark' className='rounded-pill px-4 mx-3 btn-document' onClick={() => setModifyMode((mode) => !mode)}>
          Enable drag / add new location for a document
        </Button>
      </div>
      {/* Marker Details Card */}

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
