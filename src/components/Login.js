import {useState, Fragment} from "react";
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "../assets/logo.png";
const cookies = new Cookies();

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(false);

    const handleSubmit = (e) => {
        const configuration = {
            method: "post",
            url: "https://axolotl-server-db50b102d293.herokuapp.com/login",
            data: {
                username: username,
                password,
            },
        };

        axios(configuration)
            .then((result) => {
                cookies.set("TOKEN", result.data.token, {
                    path: "/",
                });
                window.location.href = "/edit";
                setLogin(true);
            })
            .catch((error) => {
                error = new Error();
            });
        // prevent the form from refreshing the whole page
        e.preventDefault();
    }


    return(
        <Fragment>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand>
                        <span><img src={logo} alt={""} style={{"height": 64, "width": 64, "marginRight": "10px"}}/></span>
                        Axolotl XML Editor
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                </Container>
            </Navbar>
            <Form onSubmit={(e)=>handleSubmit(e)}>
                {/* email */}
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter email"
                    />
                </Form.Group>

                {/* password */}
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </Form.Group>

                {/* submit button */}
                <Button
                    variant="primary"
                    type="submit"
                    onClick={(e) => handleSubmit(e)}
                >
                    Login
                </Button>
            </Form>
        </Fragment>
    )
}
