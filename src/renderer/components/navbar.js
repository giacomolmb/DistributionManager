import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

export default function AppNavbar() {
  return (
    <Navbar collapseOnSelect={true} expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">Distribution Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link eventKey={1} as={Link} to="/">Homepage</Nav.Link>
            <Nav.Link eventKey={2} as={Link} to="/add">Add Person</Nav.Link>
            <Nav.Link eventKey={3} as={Link} to="/associations">Associations</Nav.Link>
            {/* <Nav.Link eventKey={6} as={Link} to="/persons">Persons</Nav.Link> */}
            <Nav.Link eventKey={4} as={Link} to="/projects">Projects</Nav.Link>
            <Nav.Link eventKey={5} as={Link} to="/import">Import data</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

