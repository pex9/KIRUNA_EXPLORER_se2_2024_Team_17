import { useContext, useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polygon, useMap, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button, Card, Form, Spinner, Modal, CardFooter, Col, Overlay } from "react-bootstrap"; // Importing required components
import { redirect, useNavigate } from "react-router-dom";
import AppContext from '../AppContext';
import L from 'leaflet';
import API from '../API';
import '../App.css';
import CardDocument from './CardDocument';

function MapComponent({ locations, setLocations, locationsArea, documents, setSelectedLocation, propsDocument, selectedLocation, handleDocumentClick, numberofconnections}) {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState('');
  const [connectionType, setConnectionType] = useState('');
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const isLogged = context.loginState.loggedIn;
  const [documentTypes, setDocumentTypes] = useState([]);
  const [modifyMode, setModifyMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const offsetDistance = 0.0020; //offset distance between markers
  const mapRef = useRef(null); // To get a reference to the map instance

  // Custom hook to handle zooming behavior
  function CustomZoomHandler() {
    const map = useMap(); // Get the map instance

    useEffect(() => {
      // Disable default scroll zoom
      map.scrollWheelZoom.disable();

      // Custom zoom behavior with Ctrl + scroll
      const handleWheel = (event) => {
        if (event.ctrlKey) {
          event.preventDefault(); // Prevent default page scrolling

          if (event.deltaY < 0) {
            map.zoomIn(); // Zoom in when scroll is up (negative deltaY)
          } else {
            map.zoomOut(); // Zoom out when scroll is down (positive deltaY)
          }
        }
      };

      // Attach the event listener to the map container
      const mapContainer = map.getContainer();
      mapContainer.addEventListener('wheel', handleWheel);

      // Cleanup the event listener when component unmounts
      return () => {
        mapContainer.removeEventListener('wheel', handleWheel);
      };
    }, [map]);

    return null; // This component does not render any UI
  }

  useEffect(() => {
    setLoading(true);
    const fetchDocumentTypes = async () => {
      try {
        const res = await API.getAllTypesDocument();

        setDocumentTypes(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDocumentTypes();
    setLoading(false);
  }, [documents]);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setShowCard(true);
    setSelectedLocation(null);
    handleDocumentClick(marker);
  };

  const handleAddConnection = () => {
    if (selectedDocument && connectionType) {
      setSelectedDocument('');
      setConnectionType('');
      setShowAddConnection(false);
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleDragEnd = (document, e) => {
    const { lat, lng } = e.target.getLatLng();
    if (locationsArea[document.IdLocation] && locationsArea[document.IdLocation].Location_Type === "Area") {
      alert("You can't move a document that belong in an area");
      // Update local state to reflect the new position
      const updatedLocations = { ...locations };
      if (updatedLocations[document.IdLocation]) {
        updatedLocations[document.IdLocation] = {
          ...updatedLocations[document.IdLocation],
          Latitude: lat,
          Longitude: lng
        };
      }
      setLocations(updatedLocations); // Update the state for immediate UI reflection

    }
    else {
      API.updateLocationDocument(
        document.IdLocation,
        "Point",
        lat,
        lng,
        ""
      )
        .then(() => {
          console.log('Position updated successfully');

          // Update local state to reflect the new position
          const updatedLocations = { ...locations };
          if (updatedLocations[document.IdLocation]) {
            updatedLocations[document.IdLocation] = {
              ...updatedLocations[document.IdLocation],
              Latitude: lat,
              Longitude: lng
            };
          }
          setLocations(updatedLocations); // Update the state for immediate UI reflection
        })
        .catch((err) => {
          console.error('Error updating position:', err);
        });
    }

  };


  function LocationMarker() {
    useMapEvents({
      click(e) {
        if (modifyMode) {
          const { lat, lng } = e.latlng;
          setSelectedLocation({ lat, lng });
        }
      },
    });
    return null;
  }


  return (
    <>
      {loading == true ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <div>
          <MapContainer ref={mapRef} center={[67.8558, 20.2253]} zoom={12.4}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {(locationsArea[selectedMarker?.IdLocation] && locationsArea) &&
              Object.values(locationsArea).map((area, index) => {
                // Parse the coordinates string into a proper array

                const coordinates = Array.isArray(area.Area_Coordinates)
                  ? area.Area_Coordinates
                  : JSON.parse(area.Area_Coordinates);  // If Area_Coordinates is a string, parse it
                return (
                  <Polygon
                    key={index}
                    positions={coordinates} // Use the parsed array as positions
                    pathOptions={{
                      color: 'blue',
                      fillColor: 'blue',
                      fillOpacity: 0.1
                    }}
                  />
                );
              })}
            <LocationMarker />
            {selectedLocation && modifyMode && <Marker position={selectedLocation} /> }
            {documents.map((document, index) => {

              //used to not overleap the documents
              const offsetIndex = index * offsetDistance;
              const location = locationsArea[document.IdLocation] ? locationsArea[document.IdLocation] : locations[document.IdLocation];
              if (location) {
                let position=[];
                if(location.Location_Type === "Point"){
                   position = [
                    location.Latitude,
                    location.Longitude,
                  ];
                }
                else{
                   position = [
                    location.Latitude + (index % 2 === 0 ? offsetIndex : -offsetIndex),
                    location.Longitude + (index % 2 === 0 ? -offsetIndex : offsetIndex),
                  ];
                }   
                return (
                  <Marker
                    icon={
                      new L.Icon({
                        iconUrl: `src/icon/${documentTypes[document.IdType - 1]?.iconsrc}`,
                        iconSize: [32, 32],
                        iconAnchor: [16, 32],
                        popupAnchor: [0, -32],
                      })
                    }
                    draggable={
                      modifyMode
                    } // Only make draggable if logged in
                    eventHandlers={{
                      dragend: (e) => {
                        if (isLogged) {
                          handleDragEnd(document, e); // Only call dragend if logged in
                        }
                      },
                      click: () => handleMarkerClick(document),
                    }}
                    key={index}
                    position={position}
                  >
                    <Popup>{document.Title}</Popup>
                  </Marker>
                );
              }
            })}
            {showCard && (
              <div 
                onClick={(e)=>e.stopPropagation()} 
                className='d-flex document-card overlay col-lg-4 col-md-7 col-sm-10' 
                style={{ marginLeft: '1%'}}
              >
                <CardDocument 
                  document={selectedMarker} 
                  locationType={locationsArea[selectedMarker?.IdLocation] ? "Area" : "Point"} 
                  latitude={locations[selectedMarker?.IdLocation]?.Latitude.toFixed(4)} 
                  longitude={locations[selectedMarker?.IdLocation]?.Longitude.toFixed(4)} 
                  setShowCard={setShowCard} 
                  setSelectedDocument={setSelectedMarker} 
                  isLogged={isLogged} 
                  viewMode='map'
                  numberofconnections={numberofconnections}
                />
              {/*<Card className='d-flex document-card overlay' style={{ marginLeft: '1%', width: '30%' }}>
                <Button 
                  variant="close"
                  onClick={() => {
                    setShowCard(false);
                    setSelectedMarker(null);
                  }} 
                  style={{ 
                    position: 'absolute', 
                    top: '2%', 
                    right: '2%' 
                    }} 
                    />
                <Card.Header className='document'>
                  <Card.Title><strong>{selectedMarker?.Title}</strong></Card.Title>
                </Card.Header>
                <Card.Body className='document-card text-start p-4'>
                  <div className='d-flex'>

                    <div className='col-6'>

                      <Card.Text style={{ fontSize: '16px' }}><strong>Date:</strong> {selectedMarker?.Issuance_Date}</Card.Text>
                      <Card.Text style={{ fontSize: '16px' }}><strong>Scale:</strong> {selectedMarker?.Scale}</Card.Text>
                      <Card.Text style={{ fontSize: '16px' }}><strong>Language:</strong> {selectedMarker?.Language}</Card.Text>
                      <Card.Text style={{ fontSize: '16px' }}><strong>Pages:</strong> {selectedMarker?.Pages}</Card.Text>
                      <Card.Text style={{ fontSize: '16px' }}>
                        <strong>Latitude:</strong> {locationsArea[selectedMarker?.IdLocation] ? locationsArea[selectedMarker?.IdLocation]?.Latitude.toFixed(2) : locations[selectedMarker?.IdLocation]?.Latitude.toFixed(2)}
                      </Card.Text>
                      <Card.Text style={{ fontSize: '16px' }}>
                        <strong>Longitude:</strong> {locationsArea[selectedMarker?.IdLocation] ? locationsArea[selectedMarker?.IdLocation]?.Longitude.toFixed(2) : locations[selectedMarker?.IdLocation]?.Longitude.toFixed(2)}
                      </Card.Text>
                      <Card.Text style={{ fontSize: '16px' }}><strong>Type </strong> {locationsArea[selectedMarker?.IdLocation] ? "Area" : "Point"}</Card.Text>
                    </div>
                    <div>
                      <Card.Text style={{ fontSize: '16px' }}><strong>Description:</strong> {selectedMarker?.Description}</Card.Text>
                    </div>
                  </div>
                </Card.Body>
                {isLogged && (
                  <Card.Footer className=' text-end' >
                    <Button variant="secondary" className='btn-document rounded-pill px-3' onClick={handleModifyDocument}>Modify</Button>
                  </Card.Footer>
                )}
              </Card>*/}
            </div>
            )}
            {modifyMode &&
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
                          <h6><strong>Latitude:</strong> {selectedLocation?.lat.toFixed(4)}<br></br>
                            <strong>Longitude:</strong> {selectedLocation?.lng.toFixed(4)}</h6>
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
            <CustomZoomHandler />
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
                  className='px-4 py-2 me-5 rounded-pill btn-document'
                  size="md"
                  onClick={() => {
                    if (!selectedLocation) {
                      const firstArea = locationsArea ? Object.values(locationsArea)[0] : null;
                      setSelectedLocation(firstArea);
                      navigate('documents/create-document', { state: { location: firstArea } })
                    }
                    else {
                      navigate('documents/create-document', { state: { location: selectedLocation } })
                    }
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
