import 'bootstrap-icons/font/bootstrap-icons.css';
import { Row, Col, Form, Alert, Button, Container, Card, FloatingLabel } from 'react-bootstrap';
import { useContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import API from '../API';
import AppContext from '../AppContext';
import MyNavbar from './MyNavbar';


function LoginForm(props) {
    // state per username e password
    const [username, setUsername] = useState('mario@test.it');
    const [password, setPassword] = useState('pwd');
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();
    const context = useContext(AppContext);
    const loginState = context.loginState;

    function doLogIn(credentials) {
        API.login(credentials)
            .then(user => {
                setErrMsg('');
                loginState.loginSuccessful(user);
                navigate('/');
            })
            .catch(err => {
                setErrMsg('Wrong username and/or password');
            })
    }

    function handleSubmit(event) {
        event.preventDefault();
        setErrMsg('');
        const credentials = { username, password };

        //Form validation
        if (username === '')
            setErrMsg('Username is a required field!');
        else if (password === '')
            setErrMsg('Password is a required field!');
        else
            doLogIn(credentials);
    }

    /*
    return (
        <Container >
            <Row className='my-5 justify-content-center'>
                <Col className='col-6'>
                    <Row>
                        <Col>
                            <Card className='form border-color-main'>
                                <Card.Header as='h2' className='bg-color-main'>Login</Card.Header>
                                <Card.Body>
                                    <Form onSubmit={handleSubmit}>
                                        {errMsg ? <Alert variant='danger' dismissible onClick={() => setErrMsg('')}>{errMsg}</Alert> : undefined}
                                        <FloatingLabel controlId="username" label="Username" className="mb-3">
                                            <Form.Control type="email" name='username' value={username} onChange={ev => setUsername(ev.target.value)} />
                                        </FloatingLabel>
                                        <FloatingLabel controlId="password" label="Password" className="mb-3">
                                            <Form.Control type="password" name='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                                        </FloatingLabel>
                                        <Button type='submit' className='my-2 rounded-pill'>Login</Button>
                                        <Button className='mx-3 rounded-pill' variant='danger' onClick={() => {
                                            navigate('/');
                                        }} >Cancel</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );

    */

    return (
      <Container className='my-5 col-9 col-md-6 col-lg-4'>
        <Card className='px-5 pb-3 form border-color-main bg-color-main-light'>
          <Form onSubmit={handleSubmit}>
            <Form.Label as='h2' className='my-4 text-center'>Login</Form.Label>
            {errMsg ? <Alert variant='danger' dismissible onClick={() => setErrMsg('')}>{errMsg}</Alert> : undefined}
            <Form.Group className='col-3 d-flex justify-content-center '>
              <FloatingLabel controlId="username" label="Username" className="mb-3">
                  <Form.Control type="email" name='username' value={username} onChange={ev => setUsername(ev.target.value)} />
              </FloatingLabel>
            </Form.Group>
            <FloatingLabel controlId="password" label="Password" className="mb-3">
                <Form.Control type="password" name='password' value={password} onChange={ev => setPassword(ev.target.value)} />
            </FloatingLabel>
            <Button type='submit' className='my-2 p-2 px-4 rounded-pill bg-color-main border-color-main' style={{fontWeight:600, fontSize:18}}>Confirm</Button>
            {/*<Button className='mx-3 rounded-pill' variant='danger' onClick={() => {
                navigate('/');
            }} >Cancel</Button>*/}
          </Form>
        </Card>
      </Container>
  );

}

function LoginRoute() {

    return (
        <>
            <Link to={'..'}>
              <i className="bi bi-arrow-left-circle-fill main-color d-sm-block" style={{ fontSize:'40px', position:'fixed', top:'10px',left:'30px'}}></i>
            </Link>
            <h1 style={{fontSize:80,fontWeight:600, fontFamily:'Calibri'}} className='main-color my-5'>Kiruna eXplorer</h1>
            <LoginForm />
        </>
    );
}

export default LoginRoute;