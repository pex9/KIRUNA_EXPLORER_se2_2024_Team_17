import React, { useState } from 'react';
import MyNavbar from './MyNavbar';
import MapComponent from './Map';
import { Button, ToggleButtonGroup, ToggleButton, ListGroup, Spinner, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Home(props) {
    const [viewMode, setViewMode] = useState('map'); // State to track the current view mode
    const [documents, setDocuments] = useState([]); // State for documents
    const [loading, setLoading] = useState(true); // State for loading
    const [selectedDocument, setSelectedDocument] = useState(null); // State for selected document
    const navigate = useNavigate();

    // Simulated fetch for documents
    React.useEffect(() => {
        const fetchDocuments = async () => {
            // Simulate an API call with a timeout
            setLoading(true);
            setTimeout(() => {
                // Example documents with specifications
                setDocuments([
                    { title: "Document 1", description: "Description for Document 1", scale: "1:100", issuanceDate: "2023-01-01" },
                    { title: "Document 2", description: "Description for Document 2", scale: "1:200", issuanceDate: "2023-02-01" },
                    { title: "Document 3", description: "Description for Document 3", scale: "1:300", issuanceDate: "2023-03-01" }
                ]);
                setLoading(false);
            }, 1000);
        };

        fetchDocuments();
    }, []);

    const handleToggle = (value) => {
        setViewMode(value);
        setSelectedDocument(null); // Reset selected document on toggle
    };

    const handleDocumentClick = (doc) => {
        setSelectedDocument(doc); // Set the selected document when clicked
    };

    return (
        <>
            <MyNavbar type={props.type} />

            {/* Toggle for Map/List View */}
            <div className='d-flex justify-content-center mb-3'>
                <ToggleButtonGroup type="radio" name="options" value={viewMode} onChange={handleToggle}>
                    <ToggleButton id="tbg-map" value="map">
                        Map
                    </ToggleButton>
                    <ToggleButton id="tbg-list" value="list">
                        List
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>

            <div className='d-flex mapContainer'>
                {viewMode === 'map' ? (
                    <MapComponent />
                ) : (
                    <div className='d-flex'>
                        <div className='me-3' style={{ width: '300px', overflowY: 'auto', maxHeight: '400px' }}>
                            {loading ? (
                                <Spinner animation="border" variant="primary" />
                            ) : (
                                <ListGroup>
                                    {documents.map((doc, index) => (
                                        <ListGroup.Item 
                                            key={index} 
                                            onClick={() => handleDocumentClick(doc)} // Handle document click
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {doc.title}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </div>

                        {/* Document Specifications */}
                        <div style={{ flexGrow: 1 }}>
                            {selectedDocument ? (
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Card.Title>{selectedDocument.title}</Card.Title>
                                        <Card.Text>
                                            <strong>Description:</strong> {selectedDocument.description} <br />
                                            <strong>Scale:</strong> {selectedDocument.scale} <br />
                                            <strong>Issuance Date:</strong> {selectedDocument.issuanceDate}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            ) : (
                                <div>Select a document to view its specifications.</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Document Button */}
            <div className='text-center mt-3'>
                <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={() => navigate('documents/create-document')}
                >
                    Add Document
                </Button>
            </div>
        </>
    );
}

export default Home;
