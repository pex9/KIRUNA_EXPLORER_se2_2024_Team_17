import { useState, useEffect } from 'react';
import MyNavbar from './MyNavbar';
import MapComponent from './Map';
import { Button, ToggleButtonGroup, ToggleButton, ListGroup, Spinner, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt } from 'react-icons/fa'; // Import document icon
import API from '../API'; // Import API module

function Home(props) {
    const [viewMode, setViewMode] = useState('map');
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [stakeholders, setStakeholders] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await API.getAllDocuments();
                setDocuments(res);
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
      
        const fetchStakeholders = async () => {
            try {
                const res = await API.getAllStakeholders();
                setStakeholders(res);
            } catch (err) {
                console.error(err);
            }
        };

        Promise.all([fetchDocuments(), fetchLocations(), fetchStakeholders()])
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

    const handleDocumentClick = (doc) => {
        setSelectedDocument(doc);
    };

    const handleModifyClick = () => {
        if (selectedDocument) {
            navigate(`documents/modify-document/${selectedDocument.title}`);
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
                    loading || locations.length==0 || documents.length ==0 ? (
                        <Spinner animation="border" variant="primary" />
                    ) : (
                        <MapComponent locations={locations} documents={documents} setSelectedLocation={setSelectedLocation} />
                    )
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
                                                    {doc.Title}
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
                                                <strong>{selectedDocument.Title}</strong>
                                                <FaFileAlt style={{ float: 'right', fontSize: '1.5em' }} />
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Text>
                                                    <strong>Description:</strong> {selectedDocument.Description} <br />
                                                    <strong>Scale:</strong> {selectedDocument.Scale} <br />
                                                    <strong>Issuance Date:</strong> {selectedDocument.Issuance_Date} <br />
                                                    <strong>Location:</strong> Lat: {locations[selectedDocument.IdLocation].Latitude} Long: {locations[selectedDocument.IdLocation].Longitude} <br />
                                                    <strong>StakeHolder:</strong> {stakeholders[selectedDocument.IdStakeholder - 1].name} <br />
                                                    <strong>Language:</strong> {selectedDocument.Language} <br />
                                                    <strong>Pages:</strong> {selectedDocument.Pages} <br />
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
            {selectedLocation ? (
                <div>
                    <h4>Selected Location:</h4>
                    <p>Latitude: {selectedLocation.lat.toFixed(4)}, Longitude: {selectedLocation.lng.toFixed(4)}</p>
                </div>
            ) : (
                <h4 className="text-muted">No location selected.</h4>
            )}
            <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('documents/create-document', { state: { location: selectedLocation } })}
                disabled={!selectedLocation} // Disable button if no location is selected
            >
                Add/Create Document
            </Button>
        </div>

        </>
    );
}

export default Home;
