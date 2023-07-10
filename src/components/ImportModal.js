import Modal from "react-bootstrap/Modal";
import {Button, Form} from "react-bootstrap";
import {Fragment, useState} from "react";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();


export function ImportModal({show, switchShow}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginFailed, setLoginFailed] = useState(false);
    const [successfullyLoggedIn, setSuccessfullyLoggedIn] = useState(false);

    const handleTranskribusLogin = (e) => {
        const params = new URLSearchParams({ user: username, pw: password });
        axios.post('http://localhost:8000/transkribus-proxy', params)
            .then((result) => {
                setSuccessfullyLoggedIn(true);
                cookies.set("TR-TOKEN", result.data.data, {
                    path: "/edit",
                    maxAge: 2 * 60 * 60 * 1000
                })
            })
            .catch((error) => {
                setLoginFailed(true);
                // error = new Error();

            });
        // prevent the form from refreshing the whole page
        e.preventDefault();
    }

    return(
        <Modal show={show} onHide={switchShow}>
            <Modal.Header closeButton>
                <Modal.Title>Import from Transkribus</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {successfullyLoggedIn || cookies.get("TR-TOKEN") ?
                    <p> Successfully logged in! </p>
                    : <Fragment>
                        <p>Log in to Transkribus.</p>
                        <Form onSubmit={(e)=>handleTranskribusLogin(e)} className="w-50 m1-auto mt-1">
                            {/* username */}
                            <Form.Group controlId="formBasicEmail" className={"mt-2"}>
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                />
                            </Form.Group>

                            {/* password */}
                            <Form.Group controlId="formBasicPassword" className={"mt-2"}>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                />
                            </Form.Group>

                            {/* submit button */}
                            <Button
                                className={"mt-2"}
                                variant="primary"
                                type="submit"
                                onClick={(e) => handleTranskribusLogin(e)}
                            >
                                Login
                            </Button>
                            {loginFailed && <p className="text-danger">Username or password incorrect.</p>}

                        </Form>
                    </Fragment>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={switchShow}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={switchShow}>
                    Import and Load
                </Button>
            </Modal.Footer>
        </Modal>
    )
}