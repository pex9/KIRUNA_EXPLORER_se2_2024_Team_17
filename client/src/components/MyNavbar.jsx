import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Button, Col } from 'react-bootstrap';
import AppContext from '../AppContext';

export function MyNavbar() {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const loginState = context.loginState;

  return (
    <Navbar sticky='top' bg="light" variant="dark">
      <Container fluid>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-between">
          <div className="d-flex align-items-center">
            <div className="ms-3 mx-auto text-center main-color"><h1 className='site-title'> Kiruna eXplorer </h1></div>
          </div>
          <div className='d-flex'>
            {loginState.loggedIn ? (
              <>
                <div className='me-4'>
                <Navbar.Text style={{color:'black'}}>
                  {'Signed in as: ' + loginState.user.name}
                  <br></br>
                  {' Role: ' + loginState.user.role}
                </Navbar.Text>
                </div>
                <div>
                <Button className='mx-2 rounded-pill btn-main' variant='' onClick={() => navigate('/')}>
                  {'Home '}
                  <i className="bi bi-house-fill" />
                </Button>
                </div>
                <div>
                <Button className='mx-2 rounded-pill btn-logout' variant='' onClick={() => {
                  loginState.doLogout();
                  navigate('/');
                }}>
                  {'Logout '}
                  <i className="bi bi-person-fill" />
                </Button>
                  </div>
              </>
            ) : (
              <>
                <Button className='mx-2 rounded-pill btn-main' variant='' onClick={() => navigate('/')}>
                  {'Home '}
                  <i className="bi bi-house-fill" />
                </Button>
                <Button className='mx-2 rounded-pill btn-main' variant='' onClick={() => navigate('/login')}>
                  {'Login '}
                  <i className="bi bi-person-fill" />
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default MyNavbar;
