import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginMember } from "../services/authService";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Tracks login status
    const [loading, setLoading] = useState(false);

    // Stores error messages
    const [error, setError] = useState("");

    const handleLogin = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        // Data expected by LoginRequestDTO
        const loginData = {
            email,
            password
        };

        try {

            // Send login request to the backend
            const token = await loginMember(loginData);

            // Store the JWT token for future API requests
            sessionStorage.setItem("token", token);

            console.log("Login successful");

            // Navigate to dashboard
            navigate("/dashboard");

        } catch (err) {

            console.error("Login failed:", err);

            setError(err.message || "Invalid email or password.");

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4 py-10">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-10">

                {/* Page heading */}
                <div className="text-center mb-10">

                    <h1 className="text-3xl font-bold text-black">
                        Library Management System
                    </h1>

                    <p className="text-gray-500 mt-2 text-sm">
                        Sign in to your account
                    </p>

                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-5 p-3 bg-red-50 border border-red-300 rounded-lg text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin}>

                    {/* Email */}
                    <div className="mb-6">

                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-800 mb-2"
                        >
                            Email Address
                        </label>

                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="name@example.com"
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition duration-200"
                        />

                    </div>

                    {/* Password */}
                    <div className="mb-8">

                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-800 mb-2"
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition duration-200"
                        />

                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 active:scale-[0.99] transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>

                </form>

                {/* Register Link */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">

                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="text-black font-bold hover:underline underline-offset-4"
                        >
                            Create an account
                        </Link>

                    </p>

                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-8">
                    Library Management System
                </p>

            </div>

        </div>
    );
}

export default Login;
