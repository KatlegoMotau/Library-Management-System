import { Navigate } from "react-router-dom";

import { isAuthenticated, getUserRole } from "../utils/auth";

function RoleBasedRoute({ allowedRoles, children }) {

    // Check authentication
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // Retrieve the user's role
    const userRole = getUserRole();

    // Check whether the user's role is allowed
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/dashboard" replace />;
    }

    // Allow access to the requested page
    return children;
}

export default RoleBasedRoute;
