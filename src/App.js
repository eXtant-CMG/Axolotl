import './App.css';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import * as AppUtil from './util/app-util'
import {useEffect, useState} from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import AnnotationContainer from "./AnnotationContainer";
import CodeMirrorCollab from "./CodeMirrorCollab";
import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

function App() {
    return (
        <XMLViewer />
    );
}

function XMLViewer() {
    // const [message, setMessage] = useState("")
    const [selectedZone, setSelectedZone] = useState("")
    const [layout, setLayout] = useState(AppUtil.sideBySideLayout)

    function resetLayout(newLayout) {
        if (newLayout === 'sbs') {
            setLayout(AppUtil.sideBySideLayout)
        }
        else if (newLayout === 'fw') {
            setLayout(AppUtil.fullWidthLayout)
        }
    }

    function onLayoutChange(layout, layouts) {
        setLayout(layouts)
    }


    return (
        <Container className="mt-5 vh-100">
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">Axolotl XML</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {/*<Nav.Link href="#home">Home</Nav.Link>*/}
                            <NavDropdown title="Set Layouts" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => resetLayout('sbs')}>Side by Side</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => resetLayout('fw')}>Full-Width</NavDropdown.Item>
                                {/*<NavDropdown.Divider />*/}
                                {/*<NavDropdown.Item href="#action/3.4">*/}
                                {/*    Separated link*/}
                                {/*</NavDropdown.Item>*/}
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div>
                <ResponsiveGridLayout
                    className="layout"
                    layouts={layout}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    // rowHeight={{lg: 30}}
                    draggableHandle=".drag-handle"
                    onLayoutChange={(layout, layouts) =>
                        onLayoutChange(layout, layouts)
                    }
                >
                    <div key="1">
                        <div className="border bg-light h-100 p-3">
                            <CodeMirrorCollab selection={selectedZone}/>
                        </div>
                    </div>
                    <div key="2">
                        <div className="border bg-light h-100 p-3">
                            <AnnotationContainer onSelection={setSelectedZone}/>
                        </div>
                    </div>

                </ResponsiveGridLayout>
            </div>
        </Container>
    )
}

export default App;
