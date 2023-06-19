import './assets/App.css';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import { Routes, Route } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import {Login} from "./components/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import NotFound from "./components/NotFound";
import {XMLViewer} from "./components/XMLViewer";


function App() {
    return (
        <Container className="mt-5 vh-100">
            <Routes>
                <Route exact path="/" element={<Login />} />
                {/*<Route exact path="/edit" element={<XMLViewer />} />*/}
                <Route exact path="/edit" element={
                    <ProtectedRoutes>
                        <XMLViewer />
                    </ProtectedRoutes>
                }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Container>

    );
}

export default App;
