import { useState, useEffect, useContext } from 'react';
import MyNavbar from './MyNavbar';
import MapComponent from './Map';
import { Button, ToggleButtonGroup, ToggleButton, ListGroup, Spinner, Card, Row, Col, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt } from 'react-icons/fa'; // Import document icon
import API from '../API'; // Import API module
import context from 'react-bootstrap/esm/AccordionContext';
import { Form } from 'react-bootstrap';
import AppContext from '../AppContext';
import '../App.css';
import { Modal } from 'react-bootstrap';


function Home(props) {
  const [viewMode, setViewMode] = useState('map');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [stakeholders, setStakeholders] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locationsArea, setLocationsArea] = useState([]);
  const [numberofconnections, setNumberofconnections] = useState(0);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [srcicon, setSrcicon] = useState("");
  const [showAddConnection, setShowAddConnection] = useState(false);

  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [connectionType, setConnectionType] = useState('');
  const [typeConnections, setTypeConnections] = useState({});
  const [selectDocumentSearch, setSelectDocumentSearch] = useState('');

  
  
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const isLogged = context.loginState.loggedIn;

  // get all documents, locations and stakeholders
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await API.getAllDocuments();
        setDocuments(res);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchDocumentTypes = async () => {
      try {
        const res = await API.getAllTypesDocument();
        //console.log('Document Types:', res);

        setDocumentTypes(res);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchLocations = async () => {
      setLoading(true);
      API.getAllLocations()
        .then((res) => {
          // Convert the array into an object with IdLocation as the key
          const locationsById = res.reduce((acc, location) => {
            acc[location.IdLocation] = location;
            return acc;
          }, {});
          // Set the transformed object to state
          setLocations(locationsById);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };
    const fetchLocationsArea = async () => {
      setLoading(true);
      API.getAllLocationsArea()
        .then((res) => {
          const locationsById = res.reduce((acc, location) => {
            acc[location.IdLocation] = location;
            return acc;
          }, {});
          // Set the transformed object to state
          console.log("SONO FOGLIA"); 
          console.log(locationsById);
          setLocationsArea(locationsById);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };
    const getAllTypeConnections = async () => {
      try {
          const res = await API.getAllTypeConnections();

          const typeConnectionId = res.reduce((acc, conn) => {
              acc[conn.IdConnection] = conn;
              return acc;
          }, {});
          setTypeConnections(typeConnectionId);
      } catch (err) {
          console.error(err);
      }
    };

    const fetchStakeholders = async () => {
      try {
        const res = await API.getAllStakeholders();
        setStakeholders(res);
      } catch (err) {
        console.error(err);
      }
    };

    Promise.all([fetchDocuments(), fetchLocations(), fetchStakeholders(), fetchDocumentTypes(),getAllTypeConnections(),fetchLocationsArea()])
      .then(() => setLoading(false))
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleToggle = (value) => {
    setViewMode(value);
    setSelectedDocument(null);
  };

  const handleDocumentClick = async (doc) => {
    // Fetch the number of connections for the selected document
    const res = await API.getDocumentConnection(doc.IdDocument);
    setNumberofconnections(res.length);
    setSelectedDocument(doc);
    setSrcicon("src/icon/" + documentTypes[doc.IdType].iconsrc);

  };

  const handleModifyClick = () => {
    if (selectedDocument) {
      navigate(`documents/modify-document/${selectedDocument.IdDocument}`);
    }
  };
  const handleAddConnection = async() => {
    console.log(selectDocumentSearch);
    if (selectedDocument && connectionType) {
        console.log(connectionType);
        await API.createDocumentConnection(selectedDocument.IdDocument,selectDocumentSearch.IdDocument , connectionType);
        // now i have to call again the document to update the connections
        const res = await API.getDocumentConnection(selectedDocument.IdDocument);
        setSelectedDocument('');
        setConnectionType('');
        setShowAddConnection(false);
    } else {
        alert("Please complete all fields to add a connection.");
    }
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSelectDocumentSearch(searchValue);

    // Filter documents that match the input
    if (searchValue.length > 0) {
    const filtered = documents.filter((doc) =>
        doc.Title.toLowerCase().includes(searchValue.toLowerCase()) && doc.IdDocument != selectedDocument.IdDocument
    );
    setFilteredDocuments(filtered);
    } else {
    setFilteredDocuments([]);
    }
  };
  const handleSelectionDocument = (doc) => {
    console.log("ho modificato");
    console.log(doc);
    setSelectDocumentSearch(doc);
    setFilteredDocuments([]);
  }
  const closeModal = () => {
    setShowAddConnection(false);
    selectDocumentSearch('');
  }

  return (
    <>
      {isLogged &&
        <div className=' d-flex justify-content-center mt-3'>
          <ToggleButtonGroup type="radio" name="options" value={viewMode} onChange={handleToggle}>
            <ToggleButton id="tbg-map" value="map" variant='' className='px-4'>Map</ToggleButton>
            <ToggleButton id="tbg-list" value="list" variant='' className='px-4'>List</ToggleButton>
          </ToggleButtonGroup>
        </div>
      }

      <Container fluid className='justify-content-center mt-3' style={{ width: '95vw' }} >
        {viewMode === 'map' ? (
          loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (

            <>
              <MapComponent locations={locations} locationsArea={locationsArea} documents={documents} setSelectedLocation={setSelectedLocation} setSelectedDocument={setSelectedDocument} selectedLocation={selectedLocation}/>
            </>
          )

        ) : (
          loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
          <>
            <Card className="mt-3">
              <div className='d-flex p-3'>
                <div className='me-3' style={{ width: '30%', overflowY: 'auto', maxHeight: '600px' }}>
                  {loading ? (
                    <Spinner animation="border" variant="primary" />
                  ) : (
                    <Card>
                      <Card.Header>Document List</Card.Header>
                      <ListGroup style={{maxHeight:'355px', overflowY:'auto'}}>
                        {documents.map((doc, index) => (
                          <ListGroup.Item
                            key={index}
                            onClick={() => handleDocumentClick(doc)}
                            style={{ cursor: 'pointer', fontWeight: selectedDocument === doc ? 'bold' : 'normal' }}
                          >
                            {doc.Title}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card>
                  )}
                </div>
                <div style={{ flexGrow: 1 }}>
                  {selectedDocument ? (
                    <Card className="mb-3 document-card" style={{ height: '400px' }}>
                      <Card.Header className='document'>
                        <strong>{selectedDocument.Title}</strong>
                        <img src={srcicon} alt="Document Icon" style={{ float: 'right', width: '24px', height: '24px' }} />
                      </Card.Header>
                      <Card.Body className='document-card text-start p-4'>
                        <div className='d-flex'>
              
                        <div className='col-6 px-5'>
                        
                        <Card.Text style={{fontSize:'16px'}}><strong>Date:</strong> {selectedDocument?.Issuance_Date}</Card.Text>
                        <Card.Text style={{fontSize:'16px'}}><strong>Scale:</strong> {selectedDocument?.Scale}</Card.Text>
                        <Card.Text style={{fontSize:'16px'}}><strong>Language:</strong> {selectedDocument?.Language}</Card.Text>
                        <Card.Text style={{fontSize:'16px'}}><strong>Pages:</strong> {selectedDocument?.Pages}</Card.Text>
                        <Card.Text style={{fontSize:'16px'}}>
                        <strong>Latitude:</strong> {locationsArea[selectedDocument?.IdLocation] ? locationsArea[selectedDocument?.IdLocation]?.Latitude.toFixed(2) : locations[selectedDocument?.IdLocation]?.Latitude.toFixed(2)}
                        </Card.Text>
                        <Card.Text style={{fontSize:'16px'}}>
                          <strong>Longitude:</strong> {locationsArea[selectedDocument?.IdLocation] ? locationsArea[selectedDocument?.IdLocation]?.Longitude.toFixed(2) : locations[selectedDocument?.IdLocation]?.Longitude.toFixed(2)}
                        </Card.Text>
                        <Card.Text style={{fontSize:'16px'}}><strong>Type </strong> {locationsArea[selectedDocument?.IdLocation] ? "Area": "Point"}</Card.Text>

                        </div>
                        <div>
                        <Card.Text style={{fontSize:'16px'}}><strong>Description:</strong> {selectedDocument?.Description}</Card.Text>
                        </div>
                        </div>
                      </Card.Body>
                      <Card.Footer>
                        <div className="text-center my-3">
                          <Button variant="secondary" className="me-2 btn-document rounded-pill" onClick={handleModifyClick}>Modify</Button>
                        </div>
                      </Card.Footer>
                    </Card>
                    ) : (
                      <div className="text-muted">Select a document to view its specifications.</div>
                    )}
                </div>
              </div>
            </Card>
            {/*<div className='text-end mt-4 me-5'>
              <Button
                variant="dark"
                className='rounded-pill btn-document py-1'
                size="lg"
                onClick={() => navigate('documents/create-document', { state: { location: selectedLocation } })}
              >
                <h6>
                  Add new document
                </h6>
              </Button>
            </div>*/}
          </>
          )
        )
      }
    </Container>

      <Modal show={showAddConnection} centered onHide={() => setShowAddConnection(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Add Connection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group controlId="formDocument" style={{ position: 'relative' }}>
                <Form.Label>Document</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter document name"
                    value={selectDocumentSearch?.Title || ""}
                    onChange={handleSearchChange}
                    autoComplete="off" // Prevents browser autocomplete
                />

                {/* Render the dropdown list of suggestions */}
                {filteredDocuments.length > 0 && (
                    <ListGroup style={{ position: 'absolute', top: '100%', zIndex: 1, width: '100%' }}>
                    {filteredDocuments.map((doc) => (
                        <ListGroup.Item
                        key={doc.IdDocument}
                        action
                        onClick={() => handleSelectionDocument(doc)}
                        >
                        {doc.Title}
                        </ListGroup.Item>
                    ))}
                    </ListGroup>
                )}
            </Form.Group>
            <Form.Group controlId="connectionTypeSelect" className="mb-3">
                <Form.Label>Connection Type</Form.Label>
                <Form.Select
                    value={connectionType}
                    onChange={(e) => setConnectionType(e.target.value)}
                >
                    <option value="">Select connection type</option>
                    {Object.values(typeConnections).map((type) => (
                        <option key={type.IdConnection} value={type.IdConnection}>
                            {type.Type}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => closeModal()}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleAddConnection}>
                Add Connection
            </Button>
        </Modal.Footer>
    </Modal>

    </>
  );
}

export default Home;
