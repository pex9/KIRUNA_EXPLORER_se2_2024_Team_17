import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Container, Button, Nav, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';
import AppContext from '../AppContext';
import '../App.css'

export function MyNavbar() {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const location = useLocation();
  const loginState = context.loginState;
  const setViewMode = context.viewMode.setViewMode;
  const viewMode = context.viewMode.viewMode;

  const handleToggle = (value) => {
    setViewMode(value);
  };

  return (
    <Navbar sticky='top' bg="light" variant="dark">
      <Container fluid>
        <Navbar.Brand>
          <div className="d-flex align-items-center">
            <Link onClick={() => navigate('/')} className="ms-3 mx-auto text-center main-color h1">Kiruna eXplorer</Link>
          </div>
        </Navbar.Brand>
        <Nav>
          {loginState.loggedIn && location.pathname === '/' &&
            <div className=' d-flex justify-content-center mt-3'>
              <ToggleButtonGroup
                type="radio"
                name="options"
                value={viewMode}
                onChange={handleToggle}
              >
                <ToggleButton
                  id="tbg-map"
                  value="map"
                  variant="outline-primary"
                  className="px-4"
                  style={{
                    color: viewMode === "map" ? "white" : "#A89559",
                    borderColor: "#A89559",
                    backgroundColor: viewMode === "map" ? "#A89559" : "transparent",
                  }}
                >
                  Map
                </ToggleButton>
                <ToggleButton
                  id="tbg-list"
                  value="list"
                  variant="outline-primary"
                  className="px-4"
                  style={{
                    color: viewMode === "list" ? "white" : "#A89559",
                    borderColor: "#A89559",
                    backgroundColor: viewMode === "list" ? "#A89559" : "transparent",
                  }}
                >
                  List
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          }
        </Nav>
        <Nav className=" d-flex justify-content-end">
            {loginState.loggedIn ? (
              <>
                <div className='me-4'>
                  <Navbar.Text style={{color:'black'}}>
                    <span>Signed in as: <strong>{loginState.user.name}</strong></span>
                    <br></br>
                    <span>Role: <strong>{loginState.user.role}</strong></span>
                  </Navbar.Text>
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
                <Button className='mx-2 rounded-pill btn-main' variant='' onClick={() => navigate('/login')}>
                  {'Login '}
                  <i className="bi bi-person-fill" />
                </Button>
              </>
            )}
        </Nav>
      </Container>
    </Navbar>
  );
}
export default MyNavbar;
