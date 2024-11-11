import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Form, Card, Row, Col, Modal, ListGroup, FloatingLabel, FormGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../API';
function ModifyDocument() {
    const { documentId } = useParams();
    const [showAddConnection, setShowAddConnection] = useState(false);
  
    const location = useLocation(); 
    const { location: selectedLocation } = location.state || {};

    // document fields
    const [title, setTitle] = useState('');
    const [scale, setScale] = useState('');
    const [issuanceDate, setIssuanceDate] = useState('');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('');
    const [pages, setPages] = useState('');
    const [stakeholder, setStakeholder] = useState([]);
    const [type, setType] = useState('');
    const [latitude, setLatitude] = useState(selectedLocation && selectedLocation.lat != null ? selectedLocation.lat.toFixed(4) : 0);
    const [longitude, setLongitude] = useState(selectedLocation && selectedLocation.lng != null ? selectedLocation.lng.toFixed(4) : 0);

    const [selectedDocument, setSelectedDocument] = useState('');
    const [connectionType, setConnectionType] = useState('');
    const [connections, setConnections] = useState([]); // List of added connections
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [stakeholders, setStakeholders] = useState([]);
    const [types, setTypes] = useState([]);
    const [typeConnections, setTypeConnections] = useState([]);  

    const [documents, setDocuments] = useState([]); // List of all documents
    const [filteredDocuments, setFilteredDocuments] = useState([]); // used to filter documents

    useEffect(() => {
        const getStakeholders = async () => {
            try {
                const res = await API.getAllStakeholders();
                setStakeholders(res);
                setStakeholder(res[0].id);
            } catch (err) {
                console.error(err);
            }
        }
        const getTypes = async () => {
          try {
              const res = await API.getAllTypesDocument();
              setTypes(res);
              setType(res[0].id);
          } catch (err) {
              console.error(err);
          }
        }
        const fetchDocuments = async () => {
            try {
                const res = await API.getAllDocuments();
                setDocuments(res);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDocuments();
        const fetchDocument = async () => {
            try {
                const res = await API.getDocumentById(documentId);
                setDocument(res);
                setTitle(res.Title);
                setScale(res.Scale);
                setLanguage(res.Language);
                setPages(res.Pages);
                setIssuanceDate({
                  year: res.Issuance_Date.substring(0, 4) ? res.Issuance_Date.substring(0, 4) : null,
                  month: res.Issuance_Date.substring(5, 7) ? res.Issuance_Date.substring(5, 7) : null,
                  day: res.Issuance_Date.substring(8, 10) ? res.Issuance_Date.substring(8, 10) : null
                });
                setDescription(res.Description);

                const stakeholder = await API.getStakeholder(res.IdStakeholder);
                setStakeholder(stakeholder);
                const type = await API.getTypeDocument(res.IdType);
                setType(type);
            } catch (err) {
                console.error(err);
            }
        };

        const getAllTypeConnections = async () => {
            try {
                const res = await API.getAllTypeConnections();

                const typeConnectionId = res.reduce((acc, conn) => {
                    acc[conn.IdConnection] = conn;
                    return acc;
                }, {});
                console.log(res);
                setTypeConnections(typeConnectionId);
            } catch (err) {
                console.error(err);
            }
        };
        const getDocumentConnections = async () => {
            try {
                const res = await API.getDocumentConnection(documentId);
                setConnections(res);
            } catch (err) {
                console.error(err);
            }
        };

        getStakeholders();
        getTypes();
        getAllTypeConnections();
        getDocumentConnections();

        if(documentId)
          fetchDocument();
    },[]);
    const handleUpdate = async() => {
      if(!title || !scale || !issuanceDate || !description  || !stakeholder || !type){
        alert("Please complete all fields to add a document.");
      } else {
        if (documentId) {
          const result= await API.updateDocument(documentId, title,stakeholder.id ? stakeholder.id: stakeholder, scale, issuanceDate, language, pages,description,  type.id ? type.id: type); 
          navigate('/');
        } else {
              if( selectedLocation!= null && selectedLocation.lat != null && selectedLocation.lng != null){
                // insert the document which is a point 
                //console.log(selectedLocation);
                //console.log({ title, scale, issuanceDate, description, connections, language, pages, stakeholder: stakeholder, type: type, locationType : "Point", latitude : selectedLocation.lat , longitude: selectedLocation.lng, area_coordinates :"" });
                const result= await API.addDocument( title,stakeholder, scale, issuanceDate, language, pages,description,  type,  "Point",  selectedLocation.lat , selectedLocation.lng, "" );
                navigate('/');
              }
              else if (selectedLocation!= null && selectedLocation.Location_Type =="Area"){
                //insert the document inside an area
                const result = await API.addDocumentArea( title,stakeholder, scale, issuanceDate, language, pages,description,  type, selectedLocation.IdLocation );
                navigate('/');
            }
            // insert the document
            /*const result= await API.addDocument({ title, scale, issuanceDate, description, connections, language, pages, stakeholder: stakeholder.id, type: type.id });
            console.log(result);
            navigate('/');*/
          }
        }
        };
        const handleAddConnection = async() => {
        if (selectedDocument && connectionType) {
            await API.createDocumentConnection(documentId, selectedDocument.IdDocument, connectionType);
            // now i have to call again the document to update the connections
            const res = await API.getDocumentConnection(documentId);
            setConnections(res);
            setSelectedDocument('');
            setConnectionType('');
            setShowAddConnection(false);
        } else {
            alert("Please complete all fields to add a connection.");
        }
    };

    const handleSearchChange = (e) => {
        const searchValue = e.target.value;
        setSelectedDocument(searchValue);

        // Filter documents that match the input
        if (searchValue.length > 0) {
        const filtered = documents.filter((doc) =>
            doc.Title.toLowerCase().includes(searchValue.toLowerCase()) && doc.IdDocument != documentId
        );
        setFilteredDocuments(filtered);
        } else {
        setFilteredDocuments([]);
        }
    };
    const handleSelectDocument = (doc) => {
        setSelectedDocument(doc);
        setFilteredDocuments([]); // Clear suggestions after selection
    };
    return (
      <>
        <Card className="container my-5 bg-light rounded form">
          <Card.Title>
            <h3 className="text-center my-4">{documentId ? 'Update' : 'Create'} Document</h3>
          </Card.Title>
          <Card.Body>
            <Row>
                {/* Left Column: Document Fields and Connections */}
                <Col md={6}>
                  <Form>
                      <Form.Group controlId="title" className="mb-3">
                          <FloatingLabel controlId="title" label="Title" className="mb-3">
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                />
                        </FloatingLabel>
                      </Form.Group>
                      
                      <Form.Group controlId="scale" className="mb-3">
                        <FloatingLabel controlId="scale" label="Scale" className="mb-3">
                          <Form.Control
                              type="text"
                              value={scale}
                              onChange={(e) => setScale(e.target.value)}
                          />
                        </FloatingLabel>
                      </Form.Group>
                      
                      <Form.Group controlId="language" className="mb-3">
                        <FloatingLabel controlId="language" label="Language" className="mb-3">
                          <Form.Control
                              type="text"
                              value={language}
                              onChange={(e) => setLanguage(e.target.value)}
                              />
                        </FloatingLabel>
                      </Form.Group>
                      
                      <Form.Group controlId="pages" className="mb-3">
                        <FloatingLabel controlId="pages" label="Pages" className="mb-3">
                          <Form.Control
                              type="number"
                              value={pages}
                              onChange={(e) => setPages(e.target.value)}
                          />
                        </FloatingLabel>
                      </Form.Group>
                      
                      <Form.Group controlId="issuanceDate" className="ms-1 mb-3 d-flex align-items-center justify-content-center">
                        <label className='me-4'>Date:</label>
                        <Form.Control 
                          controlId='year' 
                          className='mx-2' 
                          type='number' 
                          style={{width:'10ch'}} 
                          placeholder='yyyy' 
                          maxLength={4} 
                          min={2000} 
                          max={2024} 
                          value={issuanceDate.year} 
                          onChange={(e)=>setIssuanceDate({year: e.target.value, month: issuanceDate.month, day: issuanceDate.day})} required
                        />
                        /
                        <Form.Control 
                          controlId='month' 
                          className='mx-2' 
                          type='number' 
                          placeholder='mm' 
                          maxLength={2} 
                          style={{width:'8ch'}} 
                          min={1} 
                          max={12} 
                          value={issuanceDate.month} 
                          onChange={(e)=>setIssuanceDate({year: issuanceDate.year, month: e.target.value, day: issuanceDate.day})}
                        />
                        /
                        <Form.Control 
                          controlId='day' 
                          className='mx-2' 
                          type='number' 
                          placeholder='dd' 
                          maxLength={2} 
                          style={{width:'8ch'}} 
                          min={1} 
                          max={31} 
                          value={issuanceDate.day}
                          onChange={(e)=>setIssuanceDate({year: issuanceDate.year, month: issuanceDate.month, day: e.target.value})}
                        />
                      </Form.Group>

                      {documentId &&
                        <div className="mb-3">
                          <Form.Label>Connections</Form.Label>
                          {connections.length > 0 ? (
                              <ListGroup variant="flush" className="mb-2">
                                  {connections.map((conn, index) => (
                                    <ListGroup.Item key={index}>
                                          {conn.IdDocument1 == documentId ? `${documents.find((document) => document.IdDocument == conn.IdDocument2).Title} - ${typeConnections[conn.IdConnection].Type}` : `${documents.find((document) => document.IdDocument == conn.IdDocument1).Title} - ${typeConnections[conn.IdConnection].Type}`}
                                      </ListGroup.Item>
                                  ))}
                              </ListGroup>
                          ) : (
                              <p className="text-muted">No connections added yet.</p>
                          )}
                          <Button variant="outline-dark" className='rounded-pill' onClick={() => setShowAddConnection(true)}>
                              Add Connection
                          </Button>
                        </div>}
                  </Form>
                </Col>

                {/* Right Column: Description and Action Buttons */}
                <Col md={6}>
                    <FormGroup controlId="stakeholder" className="mb-3">
                          <FloatingLabel controlId="stakeholder" label="Stakeholder" className="mb-3">
                            <Form.Select value={stakeholder.id} onChange={(e) => setStakeholder(e.target.value)}>
                              {stakeholders.map((stk) => 
                                <option key={stk.id} value={stk.id}>{stk.name}</option>
                                )
                              }
                            </Form.Select>
                          </FloatingLabel>  
                        </FormGroup>
                        
                        <FormGroup controlId="type" className="mb-3">
                          <FloatingLabel controlId="type" label="Document Type" className="mb-3">
                            <Form.Select value={type.id} onChange={(e) => setType(e.target.value)} >
                              {types.map((tp) => 
                                <option key={tp.id} value={tp.id}>{tp.type}</option>
                              )
                            }
                            </Form.Select>
                          </FloatingLabel>  
                    </FormGroup>
                    <Form.Group controlId="description" className="mb-3">
                      <FloatingLabel  
                        controlId="description" label="Description" className="mb-3">
                        <Form.Control
                            className='py-3'
                            as="textarea"
                            style={{height: '205px'}}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            />
                      </FloatingLabel>
                    </Form.Group>
                    {!documentId ? ( 
                        <>
                          {(latitude && longitude) ? (
                            <div className='mb-4 d-flex'>
                              <p className='mx-4 d-flex align-items-center'>
                                <strong className='me-2'>Latitude:</strong> <Form.Control value={latitude} onChange={(e) => setLatitude(e.target.value)}></Form.Control>
                              </p>
                              <p className='mx-4 d-flex align-items-center'>
                                <strong className='me-2'>Longitude:</strong> <Form.Control value={longitude} onChange={(e) => setLongitude(e.target.value)}></Form.Control>
                              </p>
                            </div>
                          ) : (
                            <p>
                              <strong>Location: </strong> Whole Municipal Area
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                            {(selectedLocation && selectedLocation.lat != null && selectedLocation.lng != null) ? (
                            <div className='mb-4 d-flex'>
                              <p className='mx-4 d-flex align-items-center'>
                                <strong className='me-2'>Latitude:</strong> <Form.Control value={latitude} onChange={(e) => setLatitude(e.target.value)}></Form.Control>
                              </p>
                              <p className='mx-4 d-flex align-items-center'>
                                <strong className='me-2'>Longitude:</strong> <Form.Control value={longitude} onChange={(e) => setLongitude(e.target.value)}></Form.Control>
                              </p>
                            </div>
                          ) : (
                            <p>
                              <strong>Location: </strong> Whole Municipal Area
                            </p>
                          )}
                        </>
                      )}
                  
                    <div className="d-flex justify-content-center my-2 mx-5">
                        <Button variant="outline-secondary" className='mx-2 rounded-pill px-4' onClick={() => navigate('/')}>
                            Cancel
                        </Button>
                        <Button variant="" className='mx-2 btn-document rounded-pill px-4' onClick={handleUpdate}>
                            Save
                        </Button>
                    </div>
                </Col>
            </Row>
            </Card.Body>
          </Card>

        {/* Modal for Adding a Connection */}
        <Modal show={showAddConnection} centered onHide={() => setShowAddConnection(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Add Connection</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="formDocument" style={{ position: 'relative' }}>
                    <Form.Label>Document</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Search for a document"
                        value={selectedDocument.Title}
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
                            onClick={() => handleSelectDocument(doc)}
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
                <Button variant="outline-secondary" onClick={() => setShowAddConnection(false)}>
                    Cancel
                </Button>
                <Button variant="" className='btn-document' onClick={handleAddConnection}>
                    Add Connection
                </Button>
            </Modal.Footer>
        </Modal>
          
      </>
    );
}

export default ModifyDocument;
