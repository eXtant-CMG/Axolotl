import logo from './logo.svg';
import pic from './img.jpg'
import './App.css';
import {Component, useEffect, useState} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image'
import AnnotationContainer from "./AnnotationContainer";
import Editor from "./Editor";
import CodeMirrorCollab from "./CodeMirrorCollab";

function App() {
    return (
        // <div className="App">
        //   <header className="App-header">
        //     <img src={logo} className="App-logo" alt="logo" />
        //     <p>
        //       Edit <code>src/App.js</code> and save to reload.
        //     </p>
        //     <a
        //       className="App-link"
        //       href="https://reactjs.org"
        //       target="_blank"
        //       rel="noopener noreferrer"
        //     >
        //       Learn React
        //     </a>
        //   </header>
        <XMLViewer />
        // </div>
    );
}

function XMLViewer() {
    const [message, setMessage] = useState("")
    useEffect(() => {
        fetch('http://localhost:8000/message')
            .then(res => res.json())
            .then(data => setMessage(data.message));
    }, [])

    return (
        <Container className="mt-5 vh-100">
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">XML Viewer</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">
                                    Another action
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">
                                    Separated link
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Row className="h-50 g-5 pt-3">
                <Col>
                    <div className="border bg-light p-3">This is where the text goes
                        <h1>{message}</h1>
                        <CodeMirrorCollab/>
                        {/*<Editor/>*/}
                        {/*<Image src={pic} className="img-fluid p-3"></Image>*/}
                    </div>
                </Col>
                <Col>
                    <div className="border bg-light h-100 p-3">This is where the image goes
                        <AnnotationContainer  />
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default App;
