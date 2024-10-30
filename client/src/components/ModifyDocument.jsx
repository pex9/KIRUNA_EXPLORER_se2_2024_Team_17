import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
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
        onUpdate(documentId, document);
        navigate('/');
    };

    if (!document) return null; // Handle case where document is not found

    return (
        <div className="container mt-5">
            <h3>Modify Document</h3>
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

                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={document.description}
                        onChange={(e) => setDocument({ ...document, description: e.target.value })}
                    />
                </Form.Group>

                <div className="mt-4">
                    <Button variant="danger" className="me-2" onClick={() => navigate('/')}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleUpdate}>
                        Update
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default ModifyDocument;
