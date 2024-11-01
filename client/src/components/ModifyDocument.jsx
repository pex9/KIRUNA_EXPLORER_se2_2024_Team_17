import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Row, Col, Container, Modal, ListGroup, FloatingLabel, FormGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../API';
function ModifyDocument() {
    const { documentId } = useParams();
    const [showAddConnection, setShowAddConnection] = useState(false);
    // document fields
    const [title, setTitle] = useState('');
    const [scale, setScale] = useState('');
    const [issuanceDate, setIssuanceDate] = useState('');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('');
    const [pages, setPages] = useState('');
    const [stakeholder, setStakeholder] = useState([]);
    const [type, setType] = useState('');

    const [selectedDocument, setSelectedDocument] = useState('');
    const [connectionType, setConnectionType] = useState('');
    const [connections, setConnections] = useState([]); // List of added connections
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [stakeholders, setStakeholders] = useState([]);
    const [types, setTypes] = useState([]);

    useEffect(() => {
        const getStakeholders = async () => {
            try {
                const res = await API.getAllStakeholders();
                console.log(res);
                setStakeholders(res);
            } catch (err) {
                console.error(err);
            }
        }
        const getTypes = async () => {
          try {
              const res = await API.getAllTypesDocument();
              console.log(res);
              setTypes(res);
          } catch (err) {
              console.error(err);
          }
      }
        const fetchDocument = async () => {
            try {
                const res = await API.getDocumentById(documentId);
                console.log(res);
                setDocument(res);
                setTitle(res.Title);
                setScale(res.Scale);
                setLanguage(res.Language);
                setPages(res.Pages);
                setIssuanceDate(res.Issuance_Date);
                setDescription(res.Description);

                const stakeholder = await API.getStakeholder(res.IdStakeholder);
                setStakeholder(stakeholder);
                const type = await API.getTypeDocument(res.IdType);
                setType(type);
            } catch (err) {
                console.error(err);
            }
        };

        getStakeholders();
        getTypes();

        if(documentId)
          fetchDocument();
        
        console.log(document);
    },[]);
    const handleUpdate = () => {
        if (document) {
            //onUpdate(documentId, document);
            navigate('/');
        } else {
            alert("Document not found. Unable to update.");
        }
    };
    const handleAddConnection = () => {
        if (selectedDocument && connectionType) {
            setConnections([...connections, { document: selectedDocument, type: connectionType }]);
            setSelectedDocument('');
            setConnectionType('');
            setShowAddConnection(false);
        } else {
            alert("Please complete all fields to add a connection.");
        }
    };
    return (
        <Card className="container my-5 p-4 bg-light rounded form">
            <h3 className="text-center mb-4">{documentId ? 'Update' : 'Create'} Document</h3>
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
                                onChange={(e) => setScale(e.target.value)}
                            />
                          </FloatingLabel>
                        </Form.Group>
                        
                        <Form.Group controlId="pages" className="mb-3">
                          <FloatingLabel controlId="pages" label="Pages" className="mb-3">
                            <Form.Control
                                type="number"
                                value={pages}
                                onChange={(e) => setScale(e.target.value)}
                            />
                          </FloatingLabel>
                        </Form.Group>
                        
                        <Form.Group controlId="issuanceDate" className="mb-3">
                          <FloatingLabel controlId="issuanceDate" label="Issuance Date" className="mb-3">
                            <Form.Control
                                type="date('mm-yyyy')"
                                
                                value={issuanceDate}
                                onChange={(e) => setIssuanceDate(e.target.value)}
                            />
                          </FloatingLabel>
                        </Form.Group>


                        <div className="mb-3">
                            <Form.Label>Connections</Form.Label>
                            {connections.length > 0 ? (
                                <ListGroup variant="flush" className="mb-2">
                                    {connections.map((conn, index) => (
                                        <ListGroup.Item key={index}>
                                            {conn.document} - {conn.type}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p className="text-muted">No connections added yet.</p>
                            )}
                            <Button variant="outline-primary" onClick={() => setShowAddConnection(true)}>
                                Add Connection
                            </Button>
                        </div>
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
                    <Form.Group controlId="description" className="mb-4">
                      <FloatingLabel  
                        controlId="description" label="Description" className="mb-3">
                        <Form.Control
                            as="textarea"
                            style={{height: '205px'}}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                      </FloatingLabel>
                    </Form.Group>

                    <div className="d-flex justify-content-center">
                        <Button variant="secondary" className='mx-3' onClick={() => navigate('/')}>
                            Cancel
                        </Button>
                        <Button variant="success" className='mx-3' onClick={handleUpdate}>
                            Save
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Modal for Adding a Connection */}
            <Modal show={showAddConnection} centered onHide={() => setShowAddConnection(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Connection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="connectionDocument" className="mb-3">
                        <Form.Label>Select Document</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter document name"
                            value={selectedDocument}
                            onChange={(e) => setSelectedDocument(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="connectionType">
                        <Form.Label>Connection Type</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter connection type"
                            value={connectionType}
                            onChange={(e) => setConnectionType(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowAddConnection(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddConnection}>
                        Add Connection
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
}

export default ModifyDocument;
