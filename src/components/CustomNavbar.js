import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "../assets/logo.png";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

export function CustomNavbar({loggedIn=false, helperFunctions={}}) {

    return(
        <Navbar bg="light" expand="lg" className="sticky-top">
            <Container>
                <Navbar.Brand>
                    <span><img src={logo} alt={""} style={{"height": 64, "width": 64, "marginRight": "10px"}}/></span>
                    Axolotl XML Editor
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                {loggedIn ?
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {/*<NavDropdown title="Import" id="basic-nav-dropdown">*/}
                            {/*    <NavDropdown.Item onClick={helperFunctions.transkribusModal}>from Transkribus</NavDropdown.Item>*/}
                            {/*    <NavDropdown.Item onClick>from eScriptorium</NavDropdown.Item>*/}
                            {/*    <NavDropdown.Item onClick>from local file</NavDropdown.Item>*/}
                            {/*</NavDropdown>*/}
                            {/*<NavDropdown title="Set Layouts" id="basic-nav-dropdown">*/}
                            {/*    <NavDropdown.Item onClick={() => helperFunctions.resetLayout('sbs')}>Side by Side</NavDropdown.Item>*/}
                            {/*    <NavDropdown.Item onClick={() => helperFunctions.resetLayout('fw')}>Full-Width</NavDropdown.Item>*/}
                            {/*</NavDropdown>*/}
                        </Nav>
                        <Nav className="m1-auto">
                            <Nav.Link onClick={helperFunctions.handleLogout}>Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                : null }
            </Container>
        </Navbar>
    )
}