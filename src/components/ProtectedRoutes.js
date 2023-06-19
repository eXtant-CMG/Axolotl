
import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

// receives component and any other props represented by ...rest
export default function ProtectedRoutes({ children }) {
    const token = cookies.get("TOKEN");
    if (token) {
        return children;
    }
    else {
        return (<Navigate to='/' replace />);
    }
}