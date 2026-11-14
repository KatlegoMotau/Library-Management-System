import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerMember } from "../services/authService";

function Register() {

    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [password, setPassword] = useState("");

    // Controls password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Tracks registration status
    const [loading, setLoading] = useState(false);

    // Stores success or error messages
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        // Data expected by MemberRequestDTO
        const memberData = {
            firstName,
            lastName,
            email,
            contact,
            password
        };

        try {

            // Send registration request to the backend
            const response = await registerMember(memberData);

            console.log("Registration successful:", response);

            setMessage("Account created successfully! You can now sign in.");

            // Redirect to login after successful registration
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {

            console.error("Registration failed:", err);

            setError(err.message || "Registration failed. Please try again.");

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4 py-10">

            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 sm:p-10">

                {/* Page heading */}
                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-black">
                        Create Account
                    </h1>

                    <p className="text-sm text-gray-500 mt-2">
                        Register
                    </p>

                </div>

                {/* Success message */}
                {message && (
                    <div className="mb-5 p-3 bg-gray-100 border border-gray-300 rounded-lg text-sm text-black">
                        {message}
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="mb-5 p-3 bg-red-50 border border-red-300 rounded-lg text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Register form */}
                <form onSubmit={handleRegister} className="space-y-5">

                    {/* First Name */}
                    <div>

                        <label htmlFor="firstName"
                               className="block text-sm font-semibold text-gray-800 mb-2">
                            First Name
                        </label>

                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            placeholder="Enter your first name"
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition duration-200"
                        />

                    </div>

                    {/* Last Name */}
                    <div>

                        <label htmlFor="lastName"
                               className="block text-sm font-semibold text-gray-800 mb-2">
                            Last Name
                        </label>

                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            placeholder="Enter your last name"
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition duration-200"
                        />

                    </div>

                    {/* Email */}
                    <div>

                        <label htmlFor="email"
                               className="block text-sm font-semibold text-gray-800 mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Enter your email"
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition duration-200"
                        />

                    </div>

                    {/* Contact */}
                    <div>

                        <label htmlFor="contact"
                               className="block text-sm font-semibold text-gray-800 mb-2">
                            Contact Number
                        </label>

                        <input
                            type="tel"
                            id="contact"
                            value={contact}
                            onChange={(event) => setContact(event.target.value)}
                            placeholder="Enter your contact number"
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition duration-200"
                        />

                    </div>

                    {/* Password */}
                    <div>

                        <label htmlFor="password"
                               className="block text-sm font-semibold text-gray-800 mb-2">
                            Password
                        </label>

                        <div className="relative">

                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter your password"
                                minLength={8}
                                required
                                disabled={loading}
                                className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition duration-200"
                            />

                            {/* Show / Hide password */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-600 hover:text-black"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>

                        </div>

                        <p className="text-xs text-gray-400 mt-1">
                            Password must contain at least 8 characters.
                        </p>

                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 active:scale-[0.99] transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                {/* Login link */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">

                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="text-black font-bold hover:underline underline-offset-4"
                        >
                            Sign in
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;
