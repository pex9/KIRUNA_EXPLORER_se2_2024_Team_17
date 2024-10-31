import React, { useState } from 'react';
import MyNavbar from './MyNavbar';
import MapComponent from './Map';
import { Button, ToggleButtonGroup, ToggleButton, ListGroup, Spinner, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt } from 'react-icons/fa'; // Import document icon

function Home(props) {
    const [viewMode, setViewMode] = useState('map');
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const navigate = useNavigate();

    // Simulated fetch for documents
    React.useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            setTimeout(() => {
                setDocuments([
                    { title: "Building Permit", description: "A permit for a new building.", scale: "1:100", issuanceDate: "2023-01-01", location: "Downtown", author: "City Planning Office" },
                    { title: "Environmental Report", description: "Environmental impact assessment for the area.", scale: "1:500", issuanceDate: "2023-02-15", location: "North Park", author: "Green Solutions" },
                    { title: "Site Plan", description: "Detailed layout of the construction site.", scale: "1:200", issuanceDate: "2023-03-12", location: "Eastside", author: "Urban Design Ltd" },
                    { title: "Renovation License", description: "Approval for property renovation.", scale: "1:150", issuanceDate: "2023-04-05", location: "Uptown", author: "Historic Preservation Office" },
                    { title: "Zoning Map", description: "Zoning regulations for the city area.", scale: "1:1000", issuanceDate: "2023-05-20", location: "City Center", author: "City Zoning Committee" },
                    { title: "Traffic Study", description: "Analysis of traffic flow in the city.", scale: "1:200", issuanceDate: "2023-06-15", location: "Main Street", author: "Traffic Authority" },
                    { title: "Historic Preservation Report", description: "Guidelines for historic site preservation.", scale: "1:250", issuanceDate: "2023-07-01", location: "Old Town", author: "Historic Society" },
                    { title: "Community Engagement Plan", description: "Plan for community involvement in projects.", scale: "1:300", issuanceDate: "2023-08-10", location: "City Hall", author: "Community Development" },
                    { title: "Urban Development Strategy", description: "Long-term strategy for urban growth.", scale: "1:500", issuanceDate: "2023-09-15", location: "West End", author: "Development Agency" },
                    { title: "Public Transport Plan", description: "Plans for enhancing public transport.", scale: "1:600", issuanceDate: "2023-10-01", location: "Suburban Area", author: "Transit Authority" },
                    { title: "City Green Spaces Initiative", description: "Proposal for new green spaces in urban areas.", scale: "1:800", issuanceDate: "2023-11-05", location: "Citywide", author: "Parks Department" },
                    { title: "Waste Management Strategy", description: "Strategic plan for waste collection and recycling.", scale: "1:500", issuanceDate: "2023-11-15", location: "Metropolitan Area", author: "Environmental Agency" },
                    { title: "Renewable Energy Plan", description: "Plan for implementing renewable energy sources.", scale: "1:1000", issuanceDate: "2023-12-01", location: "Citywide", author: "Energy Commission" },
                    { title: "Public Safety Assessment", description: "Assessment of public safety measures in the city.", scale: "1:750", issuanceDate: "2024-01-10", location: "Downtown", author: "Public Safety Office" },
                    { title: "Cultural Heritage Project", description: "Plan to promote and preserve cultural heritage.", scale: "1:1200", issuanceDate: "2024-02-20", location: "Historic District", author: "Cultural Affairs" },
                    { title: "Smart City Implementation Plan", description: "Blueprint for implementing smart technologies in the city.", scale: "1:500", issuanceDate: "2024-03-15", location: "Citywide", author: "Smart City Initiative" },

                ]);
                setLoading(false);
            }, 1000);
        };

        fetchDocuments();
    }, []);

    const handleToggle = (value) => {
        setViewMode(value);
        setSelectedDocument(null);
    };

    const handleDocumentClick = (doc) => {
        setSelectedDocument(doc);
    };

    const handleModifyClick = () => {
        if (selectedDocument) {
            navigate(`documents/modify-document/${selectedDocument.title}`); // Adjust route as needed
        }
    };

    return (
        <>
            <MyNavbar type={props.type} />

            <div className='d-flex justify-content-center mb-3'>
                <ToggleButtonGroup type="radio" name="options" value={viewMode} onChange={handleToggle}>
                    <ToggleButton id="tbg-map" value="map">Map</ToggleButton>
                    <ToggleButton id="tbg-list" value="list">List</ToggleButton>
                </ToggleButtonGroup>
            </div>

            <div className='d-flex mapContainer'>
                {viewMode === 'map' ? (
                    <MapComponent />
                ) : (
                    <Card className="w-100">
                        <div className='d-flex p-3'>
                            <div className='me-3' style={{ width: '350px', overflowY: 'auto', maxHeight: '600px' }}>
                                {loading ? (
                                    <Spinner animation="border" variant="primary" />
                                ) : (
                                    <Card>
                                        <Card.Header>Document List</Card.Header>
                                        <ListGroup>
                                            {documents.map((doc, index) => (
                                                <ListGroup.Item
                                                    key={index}
                                                    onClick={() => handleDocumentClick(doc)}
                                                    style={{ cursor: 'pointer', fontWeight: selectedDocument === doc ? 'bold' : 'normal' }}
                                                >
                                                    {doc.title}
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Card>
                                )}
                            </div>

                            <div style={{ flexGrow: 1 }}>
                                <Card className="mb-3" style={{ minWidth: '400px' }}>
                                    {selectedDocument ? (
                                        <>
                                            <Card.Header>
                                                <strong>{selectedDocument.title}</strong>
                                                <FaFileAlt style={{ float: 'right', fontSize: '1.5em' }} /> {/* Document icon */}
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Text>
                                                    <strong>Description:</strong> {selectedDocument.description} <br />
                                                    <strong>Scale:</strong> {selectedDocument.scale} <br />
                                                    <strong>Issuance Date:</strong> {selectedDocument.issuanceDate} <br />
                                                    <strong>Location:</strong> {selectedDocument.location} <br />
                                                    <strong>Author:</strong> {selectedDocument.author}
                                                </Card.Text>
                                                <div className="text-center mt-3">
                                                    <Button variant="success" className="me-2">Add Connection</Button>
                                                    <Button variant="primary" className="me-2" onClick={handleModifyClick}>Modify</Button>
                                                    <Button variant="danger" onClick={() => setSelectedDocument(null)}>Cancel</Button>
                                                </div>
                                            </Card.Body>
                                        </>
                                    ) : (
                                        <div className="text-muted">Select a document to view its specifications.</div>
                                    )}
                                </Card>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            <div className='text-center mt-3'>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('documents/create-document')}
                >
                    Add/Create Document
                </Button>
            </div>
        </>
    );
}

export default Home;
