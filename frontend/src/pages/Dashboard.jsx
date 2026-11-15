import { useState, useEffect } from "react";

import StatisticsCard from "../compontents/StatisticsCard.jsx";
import { getBooks, getBookById } from "../services/bookService.js";
import {getMyProfile, getMemberById, getMembers} from "../services/memberService.js";
import {getBorrowings, getMemberBorrowings} from "../services/borrowingService.js";

// Retrieve the role from the JWT token
function getUserRole() {

    const token = sessionStorage.getItem("token");

    if(!token)
    {
        throw new Error("You are not logged in. Please log in again.");
    }

    try
    {
        // A JWT contains three parts separated by dots
        const tokenParts = token.split(".");

        if(tokenParts.length !== 3)
        {
            throw new Error("Invalid authentication token.");
        }

        // Retrieve the payload section
        const base64Payload = tokenParts[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const paddedPayload = base64Payload.padEnd(
            Math.ceil(base64Payload.length / 4) * 4,
            "="
        );

        const binaryPayload = atob(paddedPayload);

        const jsonPayload = decodeURIComponent(
            Array.from(binaryPayload)
                .map(character =>
                    "%" + character.charCodeAt(0)
                        .toString(16)
                        .padStart(2, "0")
                )
                .join("")
        );

        const payload = JSON.parse(jsonPayload);

        return payload.role;

    }
    catch(error)
    {
        throw new Error("Could not retrieve your account role. Please log in again.");
    }
}

function Dashboard() {

    // Books retrieved from the backend
    const [books, setBooks] = useState([]);

    // Members retrieved from the backend (ADMIN only)
    const [members, setMembers] = useState([]);

    // Borrowing records
    const [borrowings, setBorrowings] = useState([]);

    // Authenticated member's profile
    const [currentMember, setCurrentMember] = useState(null);

    // Authenticated user's role
    const [role, setRole] = useState("");

    // Member and book details for borrowing records
    const [borrowingDetails, setBorrowingDetails] = useState({});

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Retrieve dashboard data
    useEffect(() => {

        let isMounted = true;

        async function fetchDashboardData() {

            try
            {
                setLoading(true);
                setError("");

                // Determine the authenticated user's role
                const userRole = getUserRole();

                if(userRole !== "ADMIN" && userRole !== "MEMBER")
                {
                    throw new Error("Your account has an unsupported role.");
                }

                if(isMounted)
                {
                    setRole(userRole);
                }

                // Retrieve books for both roles
                const booksPromise = getBooks();

                if(userRole === "ADMIN")
                {
                    // ADMIN can retrieve all library information
                    const [booksData, membersData, borrowingsData] =
                        await Promise.all([
                            booksPromise,
                            getMembers(),
                            getBorrowings()
                        ]);

                    if(isMounted)
                    {
                        setBooks(booksData);
                        setMembers(membersData);
                        setBorrowings(borrowingsData);
                        setCurrentMember(null);
                    }

                }
                else
                {
                    // MEMBER retrieves only their own profile and borrowings
                    const [booksData, profileData] = await Promise.all([
                        booksPromise,
                        getMyProfile()
                    ]);

                    const borrowingsData = await getMemberBorrowings(
                        profileData.id
                    );

                    if(isMounted)
                    {
                        setBooks(booksData);
                        setCurrentMember(profileData);
                        setBorrowings(borrowingsData);
                        setMembers([]);
                    }

                }

            }
            catch(error)
            {
                if(isMounted)
                {
                    setError(error.message);
                }

            }
            finally
            {
                if(isMounted)
                {
                    setLoading(false);
                }
            }

        }

        fetchDashboardData();

        return () => {
            isMounted = false;
        };

    }, []);

    // Retrieve member and book details for borrowing records
    useEffect(() => {

        let isMounted = true;

        async function fetchBorrowingDetails() {

            if(borrowings.length === 0)
            {
                setBorrowingDetails({});
                return;
            }

            const details = {};

            await Promise.all(

                borrowings.map(async (borrowing) => {

                    // Default values
                    details[borrowing.id] = {
                        memberName: role === "MEMBER" && currentMember
                            ? `${currentMember.firstName} ${currentMember.lastName}`
                            : `Member ID: ${borrowing.memberId}`,

                        bookTitle: "Book no longer available"
                    };

                    // Retrieve member details (ADMIN only)
                    if(role === "ADMIN")
                    {
                        try
                        {
                            const member = await getMemberById(borrowing.memberId);

                            details[borrowing.id].memberName =
                                `${member.firstName} ${member.lastName}`;

                        }
                        catch (error)
                        {
                            console.warn(`Could not retrieve member ${borrowing.memberId}:`, error.message);
                        }
                    }

                    // Retrieve book details
                    try
                    {
                        const book = await getBookById(borrowing.bookId);

                        details[borrowing.id].bookTitle = book.title;

                    }
                    catch (error)
                    {
                        console.warn(`Could not retrieve book ${borrowing.bookId}:`, error.message);
                    }
                })

            );

            if (isMounted)
            {
                setBorrowingDetails(details);
            }
        }

        if(role)
        {
            fetchBorrowingDetails();
        }

        return () => {
            isMounted = false;
        };

    }, [borrowings, role, currentMember]);

    // Calculate dashboard statistics
    const activeBorrowings = borrowings.filter(borrowing => borrowing.status === "BORROWED").length;

    const overdueBorrowings = borrowings.filter(borrowing => borrowing.status === "OVERDUE").length;

    const returnedBoorrwoings = borrowings.filter(borrowing => borrowing.status == "RETURNED").length;

    // ADMIN and MEMBER have different statistics
    const statistics = role === "ADMIN"
        ? [
            {
                title: "Total Books",
                value: books.length,
                description: "Books registered in the library"
            },
            {
                title: "Total Members",
                value: members.length,
                description: "Registered library members"
            },
            {
                title: "Active Borrowings",
                value: activeBorrowings,
                description: "Books currently borrowed"
            },
            {
                title: "Returned Borrowings",
                value: returnedBoorrwoings,
                description: "Books currently borrowed"
            },
            {
                title: "Overdue Borrowings",
                value: overdueBorrowings,
                description: "Borrowings past their due date"
            }
        ]
        : [
            {
                title: "Total Books",
                value: books.length,
                description: "Books registered in the library"
            },
            {
                title: "My Active Borrowings",
                value: activeBorrowings,
                description: "Books you currently have"
            },
            {
                title: "My Overdue Borrowings",
                value: overdueBorrowings,
                description: "Your borrowings past their due date"
            },
            {
                title: "My Total Borrowings",
                value: borrowings.length,
                description: "Your borrowing history"
            }
        ];

    // Retrieve the four most recent borrowing records
    const recentBorrowings = [...borrowings]
        .sort((first, second) =>
            new Date(second.borrowingDate) -
            new Date(first.borrowingDate)
        )
        .slice(0, 4);

    return (

        <div className="space-y-8">

            {/* Dashboard heading */}
            <div>

                <h1 className="text-3xl font-bold text-black">
                    Dashboard
                </h1>

                <p className="text-gray-500 mt-2">

                    {role === "ADMIN"
                        ? "Welcome to your Library Management System. Here's an overview of your library."
                        : "Welcome to your Library Management System. Here's an overview of your borrowing activity."
                    }

                </p>

            </div>

            {/* Summary cards */}
            <StatisticsCard
                statistics={statistics}
                loading={loading}
                error={error}
            />

            {/* Recent borrowings */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

                <div className="px-6 py-5 border-b border-gray-200">

                    <h2 className="text-lg font-bold text-black">

                        {role === "ADMIN"
                            ? "Recent Borrowings"
                            : "My Borrowing History"
                        }

                    </h2>

                    <p className="text-sm text-gray-500 mt-1">

                        {role === "ADMIN"
                            ? "Overview of recently borrowed books."
                            : "Overview of your recent borrowing activity."
                        }

                    </p>

                </div>

                {/* Loading message */}
                {loading && (

                    <p className="p-6 text-gray-500">
                        Loading borrowing records...
                    </p>

                )}

                {/* Error message */}
                {!loading && error && (

                    <p className="p-6 text-red-600">
                        Failed to retrieve dashboard information: {error}
                    </p>

                )}

                {/* Borrowing table */}
                {!loading && !error && (

                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead className="bg-gray-50">

                            <tr>

                                {/* Only ADMIN sees the member column */}
                                {role === "ADMIN" && (

                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                        Member
                                    </th>

                                )}

                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                    Book
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                    Borrow Date
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                    Due Date
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                    Status
                                </th>

                            </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-100">

                            {recentBorrowings.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={role === "ADMIN" ? 5 : 4}
                                        className="px-6 py-8 text-center text-sm text-gray-500"
                                    >
                                        No borrowing records found.
                                    </td>

                                </tr>

                            ) : (

                                recentBorrowings.map((borrowing) => (

                                    <tr key={borrowing.id}>

                                        {/* Member name (ADMIN only) */}
                                        {role === "ADMIN" && (

                                            <td className="px-6 py-4 text-sm font-medium text-black whitespace-nowrap">

                                                {borrowingDetails[borrowing.id]?.memberName || "Loading..."}

                                            </td>

                                        )}

                                        {/* Book title */}
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">

                                            {borrowingDetails[borrowing.id]?.bookTitle || "Loading..."}

                                        </td>

                                        {/* Borrow date */}
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">

                                            {borrowing.borrowingDate || "N/A"}

                                        </td>

                                        {/* Due date */}
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">

                                            {borrowing.dueDate || "N/A"}

                                        </td>

                                        {/* Borrowing status */}
                                        <td className="px-6 py-4 whitespace-nowrap">

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        borrowing.status === "BORROWED"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : borrowing.status === "OVERDUE"
                                                                ? "bg-red-100 text-red-700"
                                                                : borrowing.status === "RETURNED"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-gray-100 text-gray-700"
                                                    }`}
                                                >

                                                    {borrowing.status}

                                                </span>

                                        </td>

                                    </tr>

                                ))

                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}

export default Dashboard;
