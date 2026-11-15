import { useState, useEffect } from "react";

import { getMyProfile } from "../services/memberService";
import {getMemberBorrowings, returnBook} from "../services/borrowingService";
import { getBookById } from "../services/bookService";

function Member() {

    // Stores the authenticated member's profile
    const [member, setMember] = useState(null);

    // Tracks whether the profile is loading
    const [loading, setLoading] = useState(true);

    // Stores profile errors
    const [error, setError] = useState("");

    // Stores the member's borrowing history
    const [borrowings, setBorrowings] = useState([]);

    // Stores borrowing history errors
    const [borrowingsError, setBorrowingsError] = useState("");

    // Stores book details retrieved from the Book Service
    const [bookDetails, setBookDetails] = useState({});

    // Tracks which borrowing is currently being returned
    const [returningBorrowingId, setReturningBorrowingId] = useState(null);

    // Stores successful return messages
    const [returnMessage, setReturnMessage] = useState("");

    // Stores return errors
    const [returnError, setReturnError] = useState("");

    // Retrieve borrowing history and associated book details
    async function loadBorrowings(memberId) {

        setBorrowingsError("");

        // Retrieve the member's borrowing history
        const borrowingData = await getMemberBorrowings(memberId);

        setBorrowings(borrowingData);

        // Retrieve details for each borrowed book
        const bookPromises = borrowingData.map(async (borrowing) => {

            try
            {
                const bookData = await getBookById(borrowing.bookId);

                return {
                    bookId: borrowing.bookId,
                    title: bookData.title,
                    author: bookData.author
                };

            }
            catch (error)
            {
                console.error(`Unable to retrieve book ${borrowing.bookId}:`, error);

                return {
                    bookId: borrowing.bookId,
                    title: `Book ID: ${borrowing.bookId}`,
                    author: "Book details unavailable"
                };

            }

        });

        // Wait until all book details have been retrieved
        const books = await Promise.all(bookPromises);

        // Convert the results into an object indexed by book ID
        const booksMap = {};

        books.forEach((book) => {
            booksMap[book.bookId] = book;
        });

        setBookDetails(booksMap);
    }

    // Retrieve the authenticated member's profile and borrowing history
    useEffect(() => {

        async function loadMemberProfile() {

            try
            {
                setLoading(true);
                setError("");

                // Retrieve the authenticated member's profile
                const memberData = await getMyProfile();

                setMember(memberData);

                // Retrieve the member's borrowing history
                try
                {
                    await loadBorrowings(memberData.id);
                }
                catch(error)
                {
                    setBorrowingsError(error.message);
                }

            }
            catch(error)
            {
                setError(error.message);
            }
            finally
            {
                setLoading(false);

            }

        }

        loadMemberProfile();

    }, []);

    // Handle returning a borrowed book
    async function handleReturnBook(borrowingId) {

        try
        {
            setReturningBorrowingId(borrowingId);

            setReturnMessage("");
            setReturnError("");

            // Call the existing backend return endpoint
            await returnBook(borrowingId);

            // Display a successful return message
            setReturnMessage("Book returned successfully.");

            // Refresh borrowing history and book details
            try
            {
                await loadBorrowings(member.id);
            }
            catch(error)
            {
                setBorrowingsError(
                    "The book was returned, but the borrowing history could not be refreshed. Please reload the page."
                );

            }

        }
        catch (error)
        {
            setReturnError(error.message);
        }
        finally
        {
            setReturningBorrowingId(null);
        }

    }

    // Display loading message while retrieving the profile
    if(loading)
    {
        return (
            <div className="p-6">

                <p className="text-gray-500">
                    Loading your profile...
                </p>

            </div>
        );

    }

    // Display an error if the profile could not be retrieved
    if(error)
    {
        return (
            <div className="p-6">

                <p className="text-red-600">
                    Unable to load your profile: {error}
                </p>

            </div>
        );

    }

    // Handle an empty profile response
    if(!member)
    {
        return (
            <div className="p-6">

                <p className="text-gray-500">
                    No member profile found.
                </p>

            </div>
        );

    }

    // Calculate borrowing statistics from actual backend records
    const statistics = [

        {
            title: "Total Borrowings",
            value: borrowings.length,
            description: "All borrowing records"
        },
        {
            title: "Active Borrowings",
            value: borrowings.filter(
                (borrowing) => borrowing.status === "BORROWED"
            ).length,
            description: "Books currently borrowed"
        },
        {
            title: "Returned Books",
            value: borrowings.filter(
                (borrowing) => borrowing.status === "RETURNED"
            ).length,
            description: "Books successfully returned"
        },
        {
            title: "Overdue Books",
            value: borrowings.filter(
                (borrowing) => borrowing.status === "OVERDUE"
            ).length,
            description: "Books currently overdue"
        }
    ];

    return (

        <div className="space-y-8">

            {/* Page heading */}
            <div>

                <h1 className="text-3xl font-bold text-black">
                    My Account
                </h1>

                <p className="text-gray-500 mt-2">
                    View your profile and borrowing activity.
                </p>

            </div>

            {/* Member profile */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div>

                        <h2 className="text-xl font-bold text-black">
                            {member.firstName} {member.lastName}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Member Number: {member.memberNumber}
                        </p>

                    </div>

                    <span className="w-fit px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                        {member.status ? "ACTIVE" : "INACTIVE"}
                    </span>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">

                    <div>

                        <p className="text-sm text-gray-500">
                            Email Address
                        </p>

                        <p className="text-sm font-semibold text-black mt-1">
                            {member.email}
                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-gray-500">
                            Contact Number
                        </p>

                        <p className="text-sm font-semibold text-black mt-1">
                            {member.contact}
                        </p>

                    </div>

                </div>

            </div>

            {/* Borrowing statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

                {statistics.map((statistic) => (

                    <div
                        key={statistic.title}
                        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                    >

                        <h2 className="text-sm font-medium text-gray-500">
                            {statistic.title}
                        </h2>

                        <p className="text-3xl font-bold text-black mt-3">
                            {statistic.value}
                        </p>

                        <p className="text-sm text-gray-400 mt-2">
                            {statistic.description}
                        </p>

                    </div>

                ))}

            </div>

            {/* My Borrowings */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

                {/* Section heading */}
                <div className="px-6 py-5 border-b border-gray-200">

                    <h2 className="text-lg font-bold text-black">
                        My Borrowings
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        View your borrowing history and return books.
                    </p>

                </div>

                {/* Return success message */}
                {returnMessage && (

                    <div className="mx-6 mt-5 p-4 bg-gray-100 border border-gray-200 rounded-lg">

                        <p className="text-sm text-gray-700 font-medium">
                            {returnMessage}
                        </p>

                    </div>

                )}

                {/* Return error message */}
                {returnError && (

                    <div className="mx-6 mt-5 p-4 bg-red-50 border border-red-200 rounded-lg">

                        <p className="text-sm text-red-600">
                            Unable to return book: {returnError}
                        </p>

                    </div>

                )}

                {/* Borrowings table */}
                <div className="overflow-x-auto">

                    <table className="w-full text-left">

                        <thead className="bg-gray-50">

                        <tr>

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
                                Return Date
                            </th>

                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                Status
                            </th>

                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                Action
                            </th>

                        </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-100">

                        {borrowingsError ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="px-6 py-8 text-center text-red-600 text-sm"
                                >
                                    Unable to load borrowing history: {borrowingsError}
                                </td>

                            </tr>

                        ) : borrowings.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="px-6 py-8 text-center text-gray-500 text-sm"
                                >
                                    You have no borrowing records yet.
                                </td>

                            </tr>

                        ) : (

                            borrowings.map((borrowing) => (

                                <tr key={borrowing.id}>

                                    <td className="px-6 py-4 text-sm text-black whitespace-nowrap">

                                        <p className="font-medium">
                                            {bookDetails[borrowing.bookId]?.title || `Book ID: ${borrowing.bookId}`}
                                        </p>

                                        <p className="text-xs text-gray-500 mt-1">
                                            {bookDetails[borrowing.bookId]?.author || "Loading book details..."}
                                        </p>

                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                        {borrowing.borrowingDate}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                        {borrowing.dueDate}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                        {borrowing.returnDate || "-"}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">

                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                borrowing.status === "BORROWED"
                                                    ? "bg-gray-100 text-gray-700"
                                                    : borrowing.status === "OVERDUE"
                                                        ? "bg-black text-white"
                                                        : "bg-gray-200 text-gray-500"
                                            }`}>
                                                {borrowing.status}
                                            </span>

                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">

                                        {(
                                            borrowing.status === "BORROWED" ||
                                            borrowing.status === "OVERDUE"
                                        ) ? (

                                            <button
                                                type="button"
                                                onClick={() => handleReturnBook(borrowing.id)}
                                                disabled={returningBorrowingId !== null}
                                                className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            >

                                                {returningBorrowingId === borrowing.id
                                                    ? "Returning..."
                                                    : "Return Book"
                                                }

                                            </button>

                                        ) : (

                                            <span className="text-xs text-gray-400">
                                                    -
                                                </span>

                                        )}

                                    </td>

                                </tr>

                            ))

                        )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default Member;
