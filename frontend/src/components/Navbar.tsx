import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  let isAuthenticated = localStorage.getItem('accessToken') !== null;

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/';
    isAuthenticated = false
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/play">Play</Nav.Link>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/puzzleSelect">Puzzles</Nav.Link>
                <Nav.Link as={Link} to="/account">Account</Nav.Link>
                <Dropdown>
                  <Dropdown.Toggle>Logout</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleLogout}>Confirm?</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;