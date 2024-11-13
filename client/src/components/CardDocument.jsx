import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CardDocument ({document, locationType, latitude, longitude, setShowCard, setSelectedDocument, isLogged, viewMode, areaName, numberofconnections}) {
  const navigate = useNavigate();
  
  
  const handleModifyDocument = () => {
    if (document) {
      navigate(`/documents/modify-document/${document.IdDocument}`, { state: { document: document , selectedLocation: (latitude && longitude) ? {lat: latitude, lng: longitude} : null, area: areaName ? areaName : null} });
    }
  };
  
  
  return (
    <Card>
      <Button 
        variant="close"
        onClick={() => {
          if(viewMode == 'map') {
          setShowCard(false);
          }
          setSelectedDocument(null);
        }} 
        style={{ 
          position: 'absolute', 
          top: '2%', 
          right: '2%' 
          }} 
          />
      <Card.Header className='document px-4'>
        <Card.Title><strong>{document?.Title}</strong></Card.Title>
      </Card.Header>
      <Card.Body className='document-card text-start'>
        <div className='d-flex'>

          <div className='col-6 m-1'>

            <Card.Text style={{ fontSize: '16px' }}><strong>Date:</strong> {document?.Issuance_Date}</Card.Text>
            <Card.Text style={{ fontSize: '16px' }}><strong>Scale:</strong> {document?.Scale}</Card.Text>
            <Card.Text style={{ fontSize: '16px' }}><strong>Language:</strong> {document?.Language}</Card.Text>
            <Card.Text style={{ fontSize: '16px' }}><strong>Pages:</strong> {document?.Pages}</Card.Text>
            {/*<Card.Text style={{ fontSize: '16px' }}><strong>Type: </strong> {locationType}</Card.Text>*/}
            <Card.Text style={{ fontSize: '16px'}}><strong>Connections:</strong> {numberofconnections}</Card.Text>
            {isLogged &&
              <div style={{paddingTop:'70px'}}>
              {locationType == 'Point' ?

                <div  >
                <Card.Text style={{ fontSize: '16px' }}>
                <strong>Latitude:</strong> {latitude}
                </Card.Text>
                <Card.Text style={{ fontSize: '16px' }}>
                    <strong>Longitude:</strong> {longitude}
                  </Card.Text>
                </div>
                :
                <div style={{marginTop:'40px'}}>
                <Card.Text style={{ fontSize: '16px'}}>
                <strong>Area:</strong> {areaName}
                </Card.Text>
                </div>
              }
              </div>
            }
          </div>
          <div className="m-1"> 
            <strong style={{fontSize:'16px'}}>Description:</strong>
            <Card.Text style={{marginTop:'5px',height: '300px', overflowY: 'auto' , fontSize: '16px' }}>{document?.Description}</Card.Text>
          </div>
        </div>
      </Card.Body>
      {isLogged && (
        <Card.Footer className=' text-end' >
          <Button variant="secondary" className='btn-document rounded-pill px-3' onClick={handleModifyDocument}>Modify</Button>
        </Card.Footer>
      )}
    </Card>
  )
}

export default CardDocument;