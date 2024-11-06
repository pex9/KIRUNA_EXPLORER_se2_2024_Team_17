import { useContext, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button, Card, Form, Spinner, Modal, CardFooter, Col, Overlay } from "react-bootstrap"; // Importing required components
import { redirect, useNavigate } from "react-router-dom";
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
    setSelectedLocation(null);
  };

  const handleModifyDocument = () => {
    if (selectedMarker) {
      navigate(`/documents/modify-document/${selectedMarker.IdDocument}`, { state: { document: selectedMarker } });
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
        setShowCard(false);
        if(modifyMode) {
          const { lat, lng } = e.latlng;
          console.log("Map clicked at:", lat, lng);
          setSelectedLocation({ lat, lng });
        }
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
          <Card className='d-flex document-card overlay' style={{marginLeft:'1%', width:'30%'}}>
            <Button variant="close" onClick={() => setShowCard(false)} style={{ position: 'absolute', top: '2%', right: '2%' }} />
              <Card.Header className='document'>
              <Card.Title><strong>{selectedMarker?.Title}</strong></Card.Title>
              </Card.Header>
            <Card.Body className='document-card text-start p-4'>
              <div className='d-flex'>
                
              <div className='col-6'>
              
              <Card.Text style={{fontSize:'16px'}}><strong>Date:</strong> {selectedMarker?.Issuance_Date}</Card.Text>
              <Card.Text style={{fontSize:'16px'}}><strong>Scale:</strong> {selectedMarker?.Scale}</Card.Text>
              <Card.Text style={{fontSize:'16px'}}><strong>Language:</strong> {selectedMarker?.Language}</Card.Text>
              <Card.Text style={{fontSize:'16px'}}><strong>Pages:</strong> {selectedMarker?.Pages}</Card.Text>
              <Card.Text style={{fontSize:'16px'}}>
                <strong>Latitude:</strong> {locations[selectedMarker?.IdLocation]?.Latitude.toFixed(2)}
              </Card.Text>
              <Card.Text style={{fontSize:'16px'}}>
                <strong>Longitude:</strong> {locations[selectedMarker?.IdLocation]?.Longitude.toFixed(2)}
              </Card.Text>
              </div>
              <div>
              <Card.Text style={{fontSize:'16px'}}><strong>Description:</strong> {selectedMarker?.Description}</Card.Text>
              </div>
              </div>
            </Card.Body>
              {isLogged && (
            <Card.Footer className=' text-end' >
                <Button variant="secondary" className='btn-document rounded-pill px-3' onClick={handleModifyDocument}>Modify</Button>
            </Card.Footer>
              )}
          </Card>
        )}
            { modifyMode && 
            <div className='d-flex justify-content-end me-5'>
                    <Card className='text-start form overlay'>
                      <Card.Header>
                        <Card.Title className='me-5 mt-1'><strong>
                          Add New Document
                          </strong>
                          </Card.Title>
                        <Button 
                          hidden={!selectedLocation}
                          variant="link" 
                          style={{ color: 'black', position: 'absolute', right: '0px', top: '0px' }} 
                          onClick={() => setSelectedLocation(null)}>
                          <i className="bi bi-x h2"></i>
                        </Button>
                      </Card.Header>
                      <Card.Body>
                      

                        <div className='mx-3'>
                          <h5>Selected Location:</h5>
                          {selectedLocation ? (
                            <>
                              <h6><strong>Latitude:</strong> {selectedLocation.lat.toFixed(4)}<br></br>
                              <strong>Longitude:</strong> {selectedLocation.lng.toFixed(4)}</h6>
                            </>
                          ) : (
                            <h6 className='mb-4'>Whole Municipal area</h6>
                          )
                        }
                        </div>
                      </Card.Body>
                    </Card>
            </div> 
          }
        </MapContainer>
        </div>
      )}
      {isLogged &&
      <>
        <div className='d-flex mt-2 align-items-center justify-content-between mx-5'>
          <div className='d-flex align-items-center'>
          <Button variant='dark' className='rounded-pill mt-2 px-4 mx-2 btn-document' onClick={() => setModifyMode((mode) => !mode)}>
            Enable drag / add new location for a document
          </Button>

          <div className=''>
          {modifyMode && <strong className='col text-end mx-5 mt-1'>Drag / Add new document enabled</strong>}
          </div>
          </div>
          {modifyMode &&
          <div className='me-4'>
            <Button
              variant="dark"
              className='px-3 me-5 rounded-pill btn-document'
              size="sm"
              onClick={() => {
                if(!selectedLocation)
                  setSelectedLocation({lat: 67.8558, lng: 20.2253 }) //if the selected location is "whole area"
                console.log('Selected location:', selectedLocation);
                navigate('documents/create-document', { state: { location: selectedLocation} })
              }}
              >
                  Add document
              
            </Button>
            </div>
          }
        </div>
      
      </>
    }
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
