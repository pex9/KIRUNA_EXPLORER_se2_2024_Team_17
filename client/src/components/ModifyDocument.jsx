import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Row, Col, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

function ModifyDocument({ documents, onUpdate }) {
    const { documentId } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);

    useEffect(() => {
        const doc = documents.find(doc => doc.id === documentId);
        setDocument(doc);
    }, [documentId, documents]);

    const handleUpdate = () => {
        if (document) {
            onUpdate(documentId, document);
            navigate('/');
        } else {
            alert("Document not found. Unable to update.");
        }
    };

    if (!document) {
        // Hardcoded view when document is not found
        return (
            <Container className="mt-5">
                <Card>
                    <Card.Body>
                        <Card.Title>Document Not Found</Card.Title>
                        <Card.Text>
                            The document you are trying to modify does not exist.
                        </Card.Text>
                        <Card.Title>Document Details</Card.Title>
                        <Form>
                            <Form.Group controlId="title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" placeholder="Title" disabled />
                            </Form.Group>

                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Description" disabled />
                            </Form.Group>

                            <Form.Group controlId="connections">
                                <Form.Label>Connections Number</Form.Label>
                                <Form.Control type="text" value="0" readOnly />
                            </Form.Group>

                            <div className="mt-4">
                                <Button variant="secondary" className="me-2" onClick={() => navigate('/')}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={() => alert('Confirm action!')}>
                                    Confirm
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h3>Modify Document</h3>
            <Row>
                <Col md={6}>
                    <Form>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={document.title}
                                onChange={(e) => setDocument({ ...document, title: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="scale">
                            <Form.Label>Scale</Form.Label>
                            <Form.Control
                                type="text"
                                value={document.scale}
                                onChange={(e) => setDocument({ ...document, scale: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="issuanceDate">
                            <Form.Label>Issuance Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={document.issuanceDate}
                                onChange={(e) => setDocument({ ...document, issuanceDate: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="connections">
                            <Form.Label>Connections Number</Form.Label>
                            <Form.Control type="text" value={document.connections ? document.connections.length : 0} readOnly />
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={document.description}
                            onChange={(e) => setDocument({ ...document, description: e.target.value })}
                        />
                    </Form.Group>

                    <div className="mt-4 d-flex justify-content-end">
                        <Button variant="danger" className="me-2" onClick={() => navigate('/')}>
                            Cancel
                        </Button>
                        <Button variant="success" onClick={handleUpdate}>
                            Update
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ModifyDocument;
