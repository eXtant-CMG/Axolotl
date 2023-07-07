import {Fragment, useState} from "react";
import * as AppUtil from "../util/app-util";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import CodeMirrorCollab from "./CodeMirrorCollab";
import AnnotationContainer from "./AnnotationContainer";
import {Responsive, WidthProvider} from "react-grid-layout";
import logo from "./../assets/logo.png"
import Cookies from "universal-cookie";
const cookies = new Cookies();


const ResponsiveGridLayout = WidthProvider(Responsive);

export function XMLViewer() {
    const [selectedZone, setSelectedZone] = useState("")
    const [socketDisconnect, setSocketDisconnect] = useState(false)
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

    function handleLogout() {
        cookies.remove("TOKEN", { path: "/" });
        setSocketDisconnect(true)
        window.location.href = '/'
    }


    return (
        <Fragment>
            <Navbar bg="light" expand="lg" className="sticky-top">
                <Container>
                    <Navbar.Brand>
                        <span><img src={logo} alt={""} style={{"height": 64, "width": 64, "marginRight": "10px"}}/></span>
                        Axolotl XML Editor
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavDropdown title="Set Layouts" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => resetLayout('sbs')}>Side by Side</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => resetLayout('fw')}>Full-Width</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav className="m1-auto">
                            <Nav.Link onClick={() => handleLogout()}>Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
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
                            <CodeMirrorCollab selection={selectedZone} disconnect={socketDisconnect}/>
                        </div>
                    </div>
                    <div key="2">
                        <div className="border bg-light h-100 p-3">
                            <AnnotationContainer onSelection={setSelectedZone}/>
                        </div>
                    </div>

                </ResponsiveGridLayout>
            </Container>
        </Fragment>
    )
}