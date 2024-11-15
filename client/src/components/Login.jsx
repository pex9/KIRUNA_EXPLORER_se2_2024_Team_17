import 'bootstrap-icons/font/bootstrap-icons.css';
import { Row, Col, Form, Alert, Button, Container, Card, FloatingLabel } from 'react-bootstrap';
import { useContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import API from '../API';
import AppContext from '../AppContext';
import '../App.css';

function LoginForm(props) {
    // state for username and password
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
                navigate('/home');
            })
            .catch(err => {
                setErrMsg('Wrong username and/or password');
            })
    }

    function handleSubmit(event) {
        event.preventDefault();
        setErrMsg('');
        const credentials = { username, password };

        // Form validation
        if (username === '')
            setErrMsg('Username is a required field!');
        else if (password === '')
            setErrMsg('Password is a required field!');
        else
            doLogIn(credentials);
    }

    return (
        <Card className='px-5 pb-3 form border-color-main bg-color-main-light'>
            <Form onSubmit={handleSubmit}>
                <Form.Label as='h2' className='my-4 text-center'>Login</Form.Label>
                {errMsg ? <Alert variant='danger' dismissible onClick={() => setErrMsg('')}>{errMsg}</Alert> : undefined}
                <FloatingLabel controlId="username" label="Username" className="mb-3">
                    <Form.Control type="email" name='username' value={username} onChange={ev => setUsername(ev.target.value)} />
                </FloatingLabel>
                <FloatingLabel controlId="password" label="Password" className="mb-3">
                    <Form.Control type="password" name='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                </FloatingLabel>
                <Button type='submit' className='my-2 p-2 px-4 rounded-pill bg-color-main border-color-main' style={{ fontWeight: 600, fontSize: 18 }}>Confirm</Button>
            </Form>
        </Card>
    );
}

function Login() {
    return (
        <div className="login-page" style={{

            backgroundImage: `url('/kiruna0.png')`,
            backgroundSize: 'cover', // Ensures the image covers the entire container
            backgroundPosition: 'center', // Centers the image within the container
            backgroundRepeat: 'no-repeat', // Prevents repeating the image
            minHeight: '100vh', // Full height of the viewport
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            color: '#fff',
            width: '100%', // Ensures the container takes up full width
            overflow: 'hidden' // Hides any overflow if the image is slightly cropped
        }}>
            <Link to={'..'}>
                <i className="bi bi-arrow-left-circle-fill main-color" style={{
                    fontSize: '40px', position: 'absolute', top: '10px', left: '30px'
                }}></i>
            </Link>
            <h1 style={{
                fontSize: '80px',
                fontWeight: 600,
                fontFamily: 'Calibri',
                color: '#fff',
                marginBottom: '40px'
            }}>Kiruna eXplorer</h1>
            <Container className="text-center">
                <Row className="justify-content-center">
                    <Col md={6} lg={4}>
                        <LoginForm />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;
