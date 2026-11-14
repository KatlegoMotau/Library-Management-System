import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Member from './pages/Member';
import Books from './pages/Books';

import AppLayout from "./compontents/AppLayout.jsx";
import RoleBasedRoute from "./compontents/RoleBasedRoute.jsx";

function App() {

    return (
        <Routes>

            {/* Authentication pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected application pages */}
            <Route element={<AppLayout />}>

                {/* Pages available to both MEMBER and ADMIN */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/books" element={<Books />} />

                {/* ADMIN-only pages */}
                <Route
                    path="/admin"
                    element={
                        <RoleBasedRoute allowedRoles={["ADMIN"]}>
                            <Admin />
                        </RoleBasedRoute>
                    }
                />

                <Route
                    path="/member"
                    element={
                        <RoleBasedRoute allowedRoles={["ADMIN"]}>
                            <Member />
                        </RoleBasedRoute>
                    }
                />

            </Route>

            {/* Default route */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Unknown routes */}
            <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
    );
}

export default App;
