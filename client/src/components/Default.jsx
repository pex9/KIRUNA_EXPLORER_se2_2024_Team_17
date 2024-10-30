import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Default() {
    const navigate = useNavigate();
    return (
        <Container fluid>
            <Row className="my-5">
                <Col></Col>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as='h1'>No information found</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Card.Subtitle as='h4'>This route is not what you're looking for!</Card.Subtitle>
                            <Row className="my-2 text-center">
                                <Col>
                                    <Button className='rounded-pill' variant="dark" onClick={() => {
                                        navigate('/');
                                    }}>
                                        Home
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    );
}

export default Default;