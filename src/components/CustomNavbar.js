import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "../assets/logo.png";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import {useRef} from "react";

export function CustomNavbar({loggedIn=false, setImportedFile, setImportedImg, helperFunctions={}}) {

    const hiddenFileInput = useRef(null);
    const hiddenImgInput = useRef(null);

    // Function to open the file dialog
    const handleFileClick = (type) => {
        type === 'file' ? hiddenFileInput.current.click() : hiddenImgInput.current.click();
    };

    // Function to handle file selection
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setImportedFile(await file.text());
    };

    const handleImgChange = (event) => {
        const img = event.target.files[0];
        setImportedImg(img);
    };

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
                            <NavDropdown title="Import" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={helperFunctions.transkribusModal}>from
                                    Transkribus</NavDropdown.Item>
                                <NavDropdown.Item onClick>from eScriptorium</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => handleFileClick('img')}>Image from local file</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => handleFileClick('file')}>XML from local file</NavDropdown.Item>
                            </NavDropdown>
                            <input
                                type="file"
                                ref={hiddenFileInput}
                                onChange={handleFileChange}
                                style={{display: 'none'}} // Hide the file input
                            />
                            <input
                                type="file"
                                ref={hiddenImgInput}
                                onChange={handleImgChange}
                                style={{display: 'none'}} // Hide the file input
                            />
                            <NavDropdown title="Set Layouts" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => helperFunctions.resetLayout('sbs')}>Side by
                                    Side</NavDropdown.Item>
                                <NavDropdown.Item
                                    onClick={() => helperFunctions.resetLayout('fw')}>Full-Width</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav className="m1-auto">
                            <Nav.Link onClick={helperFunctions.handleLogout}>Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    : null}
            </Container>
        </Navbar>
    )
}