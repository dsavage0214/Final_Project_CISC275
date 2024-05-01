import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../CSS/NavBar.css"


export function NavB() {
  return (
    <Navbar bg="nav-root" variant="dark" className="nav-root">
      <Container fluid className="p-0">
        <Navbar.Brand as={Link} to="/" id="nav-brand">Career Finder</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/basic-test"> Basic Test</Nav.Link>
          <Nav.Link as={Link} to="/detailed-test"> Detailed Test</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
