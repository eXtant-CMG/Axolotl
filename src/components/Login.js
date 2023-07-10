import {useState, Fragment} from "react";
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";
import Container from "react-bootstrap/Container";
import {CustomNavbar} from "./CustomNavbar";
const cookies = new Cookies();

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginFailed, setLoginFailed] = useState(false);

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
                    maxAge: 2 * 60 * 60 * 1000
                });
                window.location.href = "/edit";
            })
            .catch((error) => {
                setLoginFailed(true);
                // error = new Error();

            });
        // prevent the form from refreshing the whole page
        e.preventDefault();
    }


    return(
        <Fragment>
            <CustomNavbar />
            <Container>
                <Form onSubmit={(e)=>handleSubmit(e)} className="w-50 mx-auto mt-5">
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
                        onClick={(e) => handleSubmit(e)}
                    >
                        Login
                    </Button>
                    {loginFailed && <p className="text-danger">Username or password incorrect.</p>}

                </Form>
            </Container>
        </Fragment>
    )
}
