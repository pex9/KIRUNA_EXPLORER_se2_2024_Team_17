import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function CreateDocument() {
    const [showAddConnection, setShowAddConnection] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState('');
    const [connectionType, setConnectionType] = useState('');
    const [connections, setConnections] = useState([]); // To store added connections
    const navigate = useNavigate(); // Hook for navigation

    const handleConfirm = () => {
        // Logic for confirming the document creation
        console.log('Document created!'); // You can replace this with actual logic
        navigate('/'); // Navigate back to the home page
    };

    const handleAddConnection = () => {
        // Add the selected connection to the list
        if (selectedDocument && connectionType) {
            const newConnection = { document: selectedDocument, type: connectionType };
            setConnections([...connections, newConnection]); // Update connections state
            // Reset the modal fields
            setSelectedDocument('');
            setConnectionType('');
            setShowAddConnection(false); // Close the modal
        } else {
            alert("Please fill in all fields."); // Simple validation
        }
    };

    return (
        <div className="container mt-5">
            <h3>Create Document</h3>
            <Form>
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="Enter document title" />
                </Form.Group>

                <Form.Group controlId="scale">
                    <Form.Label>Scale</Form.Label>
                    <Form.Control type="text" placeholder="Enter scale" />
                </Form.Group>

                <Form.Group controlId="issuanceDate">
                    <Form.Label>Issuance Date</Form.Label>
                    <Form.Control type="date" />
                </Form.Group>

                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Enter description" />
                </Form.Group>

                <div className="mt-3">
                    <Form.Label>Connections</Form.Label>
                    {connections.length > 0 ? (
                        connections.map((conn, index) => (
                            <p key={index}>
                                {conn.document} - {conn.type}
                            </p>
                        ))
                    ) : (
                        <p>No connections added yet</p>
                    )}
                    <Button variant="secondary" onClick={() => setShowAddConnection(true)}>
                        Add Connection
                    </Button>
                </div>

                <div className="mt-4">
                    <Button variant="danger" className="me-2" onClick={() => navigate('/')}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </div>
            </Form>

            {/* Add Connection Modal */}
            <Modal show={showAddConnection} onHide={() => setShowAddConnection(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Connection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="connectionDocument">
                        <Form.Label>Select Document</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Choose document..."
                            value={selectedDocument}
                            onChange={(e) => setSelectedDocument(e.target.value)} // Update state
                        />
                    </Form.Group>
                    <Form.Group controlId="connectionType" className="mt-2">
                        <Form.Label>Connection Type</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter connection type"
                            value={connectionType}
                            onChange={(e) => setConnectionType(e.target.value)} // Update state
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddConnection(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddConnection}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CreateDocument;
