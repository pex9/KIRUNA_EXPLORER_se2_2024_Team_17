import { useContext, useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polygon, useMap, LayersControl, LayerGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button, Card, Form, Spinner, Modal, CardFooter, Col, Overlay } from "react-bootstrap"; // Importing required components
import { redirect, useLinkClickHandler, useNavigate } from "react-router-dom";
import AppContext from '../AppContext';
import L, { DivOverlay, popup } from 'leaf\let';
import API from '../API';
import '../App.css';
import CardDocument from './CardDocument';

function MapComponent({ locations, setLocations, locationsArea, documents, setSelectedLocation, propsDocument, selectedLocation, handleDocumentClick, numberofconnections}) {
  const selectedDocument = useContext(AppContext).selectedDocument;
  const setSelectedDocument = useContext(AppContext).setSelectedDocument;
  const [selectedMarker, setSelectedMarker] = useState(selectedDocument);
  const [showCard, setShowCard] = useState(false);
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [connectionType, setConnectionType] = useState('');
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const isLogged = context.loginState.loggedIn;
  const [documentTypes, setDocumentTypes] = useState([]);
  const [modifyMode, setModifyMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const offsetDistance = 0.0020; //offset distance between markers
  const mapRef = useRef(null); // To get a reference to the map instance
  const markerRef = useRef(); // To get a reference to the marker instance
  
  
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
    setSelectedDocument(marker);
    setSelectedLocation(null);
    handleDocumentClick(marker);
  };

  const handleDragEnd = (document, e) => {
    const { lat, lng } = e.target.getLatLng();
    if (locationsArea[document.IdLocation] && locationsArea[document.IdLocation].Location_Type === "Area") {
      alert("You can't move a document that belongs to an area");
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
            {/* Location listener */}
            <LocationMarker />
            
            {/* Layers */}
            <LayersControl position="topright" collapsed={false}>
              <LayersControl.BaseLayer checked name="Satellite">
                <TileLayer
                  url='https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                  subdomains={['mt1','mt2','mt3']}
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Street Map">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
            </LayersControl>
            
            {/* Areas */}
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
              })
            }
            
            {/* Marker for selected location */}
            {selectedLocation && modifyMode && <Marker position={selectedLocation} /> }
            
            {/* Markers */}
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
                    ref={markerRef}
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
            <CustomZoomHandler />
          </MapContainer>

          {/* Overlay components*/ }
          {/* Document Card */}
          {selectedDocument && (
            <div  
            className='document-card overlay col-lg-3 col-md-6 col-sm-9' 
            style={{ marginLeft: '1%', bottom: '18%', width: '28%'}}
            >
              <CardDocument 
                document={selectedMarker} 
                locationType={locationsArea[selectedMarker?.IdLocation] ? "Area" : "Point"} 
                latitude={locations[selectedMarker?.IdLocation]?.Latitude.toFixed(4)} 
                longitude={locations[selectedMarker?.IdLocation]?.Longitude.toFixed(4)} 
                setShowCard={setSelectedDocument} 
                setSelectedDocument={setSelectedMarker} 
                isLogged={isLogged} 
                viewMode='map'
                numberofconnections={numberofconnections}
                />
          </div>
          )}
          {/* Card location for creating new document */}
          {modifyMode &&
            <div className='d-flex justify-content-end me-4'>
              <Card className='text-start form overlay' style={{bottom:'8%'}}>
                <Card.Header>
                  <Card.Title className='text.center mx-4 mt-1'>
                    <strong>Add New Document</strong>
                  </Card.Title>
                  <Button
                    hidden={!selectedLocation}
                    variant="link"
                    style={{ color: 'darkred', position: 'absolute', right: '0px', bottom: '50%' }}
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
                      <h6 className='mb-3'>Whole Municipal area</h6>
                    )
                  }
                  </div>
                </Card.Body>
                <div className='d-flex justify-content-center'>
                  <Button
                    variant="dark"
                    className='px-4 py-2 mb-2 rounded-pill btn-document'
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
              </Card>
            </div>
          }
          {/* Button enable */}
          {isLogged &&
            <>
              <div className='d-flex mt-2 align-items-center justify-content-between ms-3'>
                <div className='d-flex align-items-center'>
                  <Button variant='dark' className='rounded-pill mt-2 overlay px-4 mx-2 btn-document' style={{bottom:'7%'}} onClick={() => setModifyMode((mode) => !mode)}>
                    <span className='h6' style={{fontSize:'16px'}}>{modifyMode ? 'Disable' : 'Enable'} drag / add new location for a document</span>
                  </Button>
    
                  <div>
                    {modifyMode && <span className='col text-end mx-5 mb-1' style={{position: 'absolute', zIndex:1000, textShadow:'#000000 0px 0px 20px',left:'5%', bottom:'11%',color:'white'}}>Drag / Add new document enabled</span>}
                  </div>
                </div>
              </div>
    
            </>
          }
      </div>
    )}
    </>
  );
}

export default MapComponent;
