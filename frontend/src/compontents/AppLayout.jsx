import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import { isAuthenticated, getUserRole, getTokenPayload } from "../utils/auth";

function AppLayout() {

    // Controls whether the mobile sidebar is open
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Check whether the user is authenticated
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // Retrieve authenticated user information
    const user = getTokenPayload();

    const userName = user?.sub || "User";
    const userRole = getUserRole();

    // Open or close the sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen((currentState) => !currentState);
    };

    // Close the sidebar
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen flex bg-gray-100">

            {/* Sidebar */}
            <Sidebar
                role={userRole}
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
            />

            {/* Main application area */}
            <div className="flex-1 min-w-0 flex flex-col">

                {/* Navbar */}
                <Navbar
                    userName={userName}
                    role={userRole}
                    onMenuClick={toggleSidebar}
                />

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default AppLayout;
