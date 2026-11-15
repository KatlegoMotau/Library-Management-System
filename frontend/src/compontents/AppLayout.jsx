import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import { isAuthenticated, getUserRole } from "../utils/auth";
import { getMyProfile } from "../services/memberService.js";

function AppLayout() {

    // Controls whether the mobile sidebar is open
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Stores the authenticated user's profile
    const [user, setUser] = useState(null);

    // Check whether the user is authenticated
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // Retrieve the authenticated user's role
    const userRole = getUserRole();

    // Retrieve the authenticated user's profile
    useEffect(() => {

        let isMounted = true;

        async function fetchUserProfile() {

            try
            {
                const profile = await getMyProfile();

                if(isMounted)
                {
                    setUser(profile);
                }
            }
            catch(error)
            {
                console.error("Could not retrieve user profile:", error);
            }

        }

        fetchUserProfile();

        return () => {
            isMounted = false;
        };

    }, []);

    // Open or close the sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen((currentState) => !currentState);
    };

    // Close the sidebar
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    // Display the user's first and last name
    const userName = user
        ? `${user.firstName} ${user.lastName}`
        : "Loading...";

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
