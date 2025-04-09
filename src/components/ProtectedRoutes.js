import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";import Cookies from "universal-cookie";

const cookies = new Cookies();

const ProtectedRoutes = ({ children }) => {
    const token = cookies.get("TOKEN");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    try {
        const decoded = jwtDecode(token);

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
            cookies.remove("TOKEN");
            return <Navigate to="/" replace />;
        }

        // Token is valid
        return children;
    } catch (e) {
        // Token is malformed or can't be decoded
        cookies.remove("TOKEN");
        return <Navigate to="/" replace />;
    }
};

export default ProtectedRoutes;