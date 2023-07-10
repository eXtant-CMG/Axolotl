import './assets/App.css';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import {Routes, Route, Navigate} from "react-router-dom";
import {Login} from "./components/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import NotFound from "./components/NotFound";
import {XMLViewer} from "./components/XMLViewer";
import Cookies from "universal-cookie";
import {Col, Container, Nav, Row} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {brands} from '@fortawesome/fontawesome-svg-core/import.macro'
import React from "react";
import {Fragment} from "react";
const cookies = new Cookies();

function App() {
    return (
        <Fragment>
            <Routes>
                <Route exact path="/" element={cookies.get("TOKEN") ? <Navigate to='/edit' replace /> : <Login />} />
                <Route exact path="/edit" element={
                    <ProtectedRoutes>
                        <XMLViewer />
                    </ProtectedRoutes>
                }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Nav className="bg-light fixed-bottom">
                <Container>
                    <Row>
                        <Col className="align-self-center m-3">
                            <a href="https://github.com/eXtant-CMG/Axolotl" target="_blank" className="text-muted text-decoration-none">
                                <FontAwesomeIcon icon={brands("github")} />
                                <span className="m-2">View source</span>
                            </a>
                        </Col>
                        <Col className="text-end m-3" style={{fontSize: '10px'}}>
                            <div className="text-end">Created by <a className="text-muted text-decoration-none" href="https://github.com/NoonShin/" target="_blank">Nooshin S. Asadi</a></div>
                            <div className="text-end">At the <a className="text-muted text-decoration-none" href="https://www.uantwerpen.be/en/" target="_blank">University of Antwerp</a></div>
                        </Col>
                    </Row>
                </Container>
            </Nav>
        </Fragment>

    );
}

export default App;
