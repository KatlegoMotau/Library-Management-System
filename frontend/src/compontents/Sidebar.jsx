import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ role }) {

    // Controls whether the mobile sidebar is open
    const [isOpen, setIsOpen] = useState(false);

    // Navigation links available to both roles
    const commonLinks = [
        {
            name: "Dashboard",
            path: "/dashboard"
        },
        {
            name: "Books",
            path: "/books"
        }
    ];

    // Additional links available to administrators
    const adminLinks = [
        {
            name: "Admin",
            path: "/admin"
        },
        {
            name: "Members",
            path: "/member"
        }
    ];

    const navigate = useNavigate();

    // Log out the current user
    function handleLogout() {

        // Remove the saved JWT
        sessionStorage.removeItem("token");

        // Close the mobile sidebar
        setIsOpen(false);

        // Redirect to the login page
        navigate("/login", { replace: true });

    }

    // Add administrator links when the role is ADMIN
    const navigationLinks = role === "ADMIN"
        ? [...commonLinks, ...adminLinks]
        : commonLinks;

    return (
        <>
            {/* Mobile menu button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed bottom-5 left-5 z-50 bg-black text-white px-5 py-3 rounded-lg shadow-lg"
            >
                {isOpen ? "Close Menu" : "Open Menu"}
            </button>

            {/* Dark background behind the mobile sidebar */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="md:hidden fixed inset-0 bg-black/50 z-30"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 min-h-screen bg-black text-white flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >

                {/* Sidebar heading */}
                <div className="px-6 py-7 border-b border-gray-800">

                    <h2 className="text-xl font-bold">
                        Library Management
                    </h2>

                    <p className="text-sm text-gray-400 mt-1">
                        System Navigation
                    </p>

                </div>

                {/* Navigation links */}
                <nav className="flex-1 px-4 py-6">

                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
                        Main Menu
                    </p>

                    <div className="space-y-2">

                        {navigationLinks.map((link) => (

                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block px-4 py-3 rounded-lg text-sm font-medium transition duration-200 ${
                                        isActive
                                            ? "bg-white text-black"
                                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>

                        ))}

                    </div>

                </nav>

                {/* Sidebar footer */}
                <div className="px-6 py-5 border-t border-gray-800">

                    {/* Logout button */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-3 rounded-lg transition duration-200 mb-5"
                    >
                        Logout
                    </button>

                    <p className="text-xs text-gray-500">
                        Library Management System
                    </p>

                    <p className="text-xs text-gray-600 mt-1">
                        Navigation Panel
                    </p>

                </div>

            </aside>
        </>
    );
}

export default Sidebar;
