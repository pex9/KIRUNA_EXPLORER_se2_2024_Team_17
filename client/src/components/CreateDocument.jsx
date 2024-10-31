import React, { useState } from 'react';
import { Button, Form, Modal, ListGroup, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function CreateDocument() {
    const [showAddConnection, setShowAddConnection] = useState(false);
    const [title, setTitle] = useState('');
    const [scale, setScale] = useState('');
    const [issuanceDate, setIssuanceDate] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDocument, setSelectedDocument] = useState('');
    const [connectionType, setConnectionType] = useState('');
    const [connections, setConnections] = useState([]); // List of added connections
    const navigate = useNavigate();

    const handleConfirm = () => {
        // Logic to save the document
        console.log('Document created:', { title, scale, issuanceDate, description, connections });
        navigate('/'); // Redirect to home after confirmation
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
        <Container className="my-5 p-4 bg-light rounded">
            <h3 className="text-center mb-4">Create Document</h3>
            <Row>
                {/* Left Column: Document Fields and Connections */}
                <Col md={6}>
                    <Form>
                        <Form.Group controlId="title" className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter document title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="scale" className="mb-3">
                            <Form.Label>Scale</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter scale"
                                value={scale}
                                onChange={(e) => setScale(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="issuanceDate" className="mb-3">
                            <Form.Label>Issuance Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={issuanceDate}
                                onChange={(e) => setIssuanceDate(e.target.value)}
                            />
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
                    <Form.Group controlId="description" className="mb-4">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={8}
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                        <Button variant="secondary" onClick={() => navigate('/')}>
                            Cancel
                        </Button>
                        <Button variant="success" onClick={handleConfirm}>
                            Save
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Modal for Adding a Connection */}
            <Modal show={showAddConnection} onHide={() => setShowAddConnection(false)}>
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
        </Container>
    );
}

export default CreateDocument;




