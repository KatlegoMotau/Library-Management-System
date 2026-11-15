import { useState, useEffect } from 'react';

import MemberTable from "../compontents/MemberTable.jsx";
import {getMembers, getMemberById, activateMember, deactivateMember} from "../services/memberService.js";
import {  getBooks, getBookById } from "../services/bookService.js";
import { getBorrowings } from "../services/borrowingService.js";
import StatisticsCard from "../compontents/StatisticsCard.jsx";

function Admin() {

    // Members retrieved from the backend
    const [members, setMembers] = useState([]);

    // Books retrieved from the backend
    const [books, setBooks] = useState([]);

    // Book loading and error states
    const [booksLoading, setBooksLoading] = useState(true);
    const [booksError, setBooksError] = useState("");

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Error state for member activation/deactivation
    const [actionError, setActionError] = useState("");

    // Search input state
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMember, setSelectedMember] = useState(null);

    // Borrowing records retrieved from the backend
    const [borrowings, setBorrowings] = useState([]);

    // Borrowing loading and error states
    const [borrowingsLoading, setBorrowingsLoading] = useState(true);
    const [borrowingsError, setBorrowingsError] = useState("");

    // Store member and book details for borrowing records
    const [borrowingDetails, setBorrowingDetails] = useState({});

    // Retrieve all registered members from the backend
    useEffect(() => {

        async function fetchMembers() {

            try
            {
                setLoading(true);
                setError("");

                const data = await getMembers();

                const formattedMembers = data.map((member) => ({
                    ...member,
                    status: member.status ? "ACTIVE" : "INACTIVE"
                }));

                setMembers(formattedMembers);
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

        fetchMembers();

    }, []);


    // Retrieve all books from the backend
    useEffect(() => {

        async function fetchBooks() {

            try
            {
                setBooksLoading(true);
                setBooksError("");

                const data = await getBooks();

                setBooks(data);
            }
            catch(error)
            {
                setBooksError(error.message);
            }
            finally
            {
                setBooksLoading(false);
            }

        }

        fetchBooks();

    }, []);


    // Retrieve all borrowing records from the backend
    useEffect(() => {

        async function fetchBorrowings() {

            try
            {
                setBorrowingsLoading(true);
                setBorrowingsError("");

                const data = await getBorrowings();

                setBorrowings(data);

            }
            catch(error)
            {
                setBorrowingsError(error.message);
            }
            finally
            {
                setBorrowingsLoading(false);
            }
        }

        fetchBorrowings();

    }, []);

    // Retrieve member and book details for each borrowing
    useEffect(() => {

        async function fetchBorrowingDetails() {

            if(borrowings.length === 0)
            {
                setBorrowingDetails({});
                return;
            }

            const details = {};

            await Promise.all(

                borrowings.map(async (borrowing) => {

                    // Default values for historical records
                    details[borrowing.id] = {
                        memberName: `Member ID: ${borrowing.memberId}`,
                        bookTitle: "Book no longer available",
                        bookAuthor: ""
                    };

                    // Retrieve member information independently
                    try
                    {
                        const member = await getMemberById(borrowing.memberId);

                        details[borrowing.id].memberName = `${member.firstName} ${member.lastName}`;

                    }
                    catch(error)
                    {
                        console.error(`Could not retrieve member ${borrowing.memberId}:`, error);
                    }

                    // Retrieve book information independently
                    try
                    {
                        const book = await getBookById(borrowing.bookId);

                        details[borrowing.id].bookTitle = book.title;
                        details[borrowing.id].bookAuthor = book.author;
                    }
                    catch(error)
                    {

                        console.error(`Could not retrieve book ${borrowing.bookId}:`, error);
                    }

                })

            );

            setBorrowingDetails(details);

        }

        fetchBorrowingDetails();

    }, [borrowings]);


    // Calculate book statistics using backend data
    const totalBooks = books.length;

    const totalCopies = books.reduce((total, book) => total + (book.totalCopies || 0), 0);

    const availableCopies = books.reduce(
        (total, book) => total + (book.availableCopies || 0), 0);

    // Calculate dashboard statistics using backend data
    const statistics = [
        {
            title: "Total Members",
            value: members.length,
            description: "Registered members"
        },
        {
            title: "Active Members",
            value: members.filter((member) => member.status === "ACTIVE").length,
            description: "Members with active accounts"
        },
        {
            title: "Inactive Members",
            value: members.filter((member) => member.status === "INACTIVE").length,
            description: "Members with inactive accounts"
        },
        {
            title: "Total Books",
            value: totalBooks,
            description: "Books registered in the library"
        },
        {
            title: "Total Copies",
            value: totalCopies,
            description: "Total copies in the library"
        },
        {
            title: "Available Copies",
            value: availableCopies,
            description: "Copies available for borrowing"
        }
    ];


    // Filter members using the search input
    const filteredMembers = members.filter((member) => {

        const fullName = `${member.firstName} ${member.lastName}`;

        return (
            fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

    });

    // Activate or deactivate a member through the backend
    const toggleMemberStatus = async (memberId) => {

        try
        {
            setActionError("");

            const member = members.find((item) => item.id === memberId);

            if(!member)
            {
                return;
            }

            let updatedMember;

            if(member.status === "ACTIVE")
            {
                updatedMember = await deactivateMember(memberId);
            }
            else
            {
                updatedMember = await activateMember(memberId);
            }

            const formattedMember = {
                ...updatedMember,
                status: updatedMember.status ? "ACTIVE" : "INACTIVE"
            };

            setMembers((currentMembers) =>
                currentMembers.map((item) =>
                    item.id === memberId ? formattedMember : item
                )
            );

            setSelectedMember((currentSelected) =>
                currentSelected?.id === memberId
                    ? formattedMember
                    : currentSelected
            );

        }
        catch (error)
        {
            setActionError(error.message);
        }

    };

    return (
        <div className="space-y-8 w-full min-w-0">

            {/* Page heading */}
            <div>
                <h1 className="text-3xl font-bold text-black">
                    Admin Management
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage library members and monitor their accounts.
                </p>
            </div>

            {/* Dashboard statistics */}
            <StatisticsCard
                statistics={statistics}
                loading={loading || booksLoading}
                error={error || booksError}
            />

            {/* Member management */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-w-0">

                <div className="p-6 border-b border-gray-200">

                    <h2 className="text-lg font-bold text-black">
                        Member Management
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        View and manage registered library members.
                    </p>

                    <div className="mt-5">

                        <input
                            type="text"
                            placeholder="Search members by name or email..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            className="w-full sm:max-w-md px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                        />

                    </div>

                </div>

                {loading && (
                    <p className="p-6 text-gray-500">
                        Loading registered members...
                    </p>
                )}

                {!loading && error && (
                    <p className="p-6 text-red-600">
                        Failed to retrieve members: {error}
                    </p>
                )}

                {actionError && (
                    <p className="px-6 py-3 text-red-600">
                        {actionError}
                    </p>
                )}

                {!loading && !error && (
                    <MemberTable
                        members={filteredMembers}
                        onToggleMemberStatus={toggleMemberStatus}
                        onViewMember={setSelectedMember}
                    />
                )}

            </div>

            {/* Borrowing management */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-w-0">

                <div className="p-5 sm:p-6 border-b border-gray-200">

                    <h2 className="text-lg font-bold text-black">
                        Borrowing Management
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Monitor all book borrowing records registered in the library.
                    </p>

                    <p className="text-sm text-gray-500 mt-3">
                        Total borrowing records: {borrowings.length}
                    </p>

                </div>

                {/* Loading message */}
                {borrowingsLoading && (
                    <p className="p-6 text-gray-500">
                        Loading borrowing records...
                    </p>
                )}

                {/* Error message */}
                {!borrowingsLoading && borrowingsError && (
                    <p className="p-6 text-red-600">
                        Failed to retrieve borrowing records: {borrowingsError}
                    </p>
                )}

                {/* Responsive borrowing table */}
                {!borrowingsLoading && !borrowingsError && (

                    <div className="w-full min-w-0">

                        <table className="w-full table-fixed text-left">

                            <thead className="bg-gray-50 border-b border-gray-200">

                            <tr>

                                <th className="w-[9%] px-2 py-3 text-[10px] sm:text-xs font-semibold text-gray-600 break-words">
                                    ID
                                </th>

                                <th className="w-[15%] px-2 py-3 text-[10px] sm:text-xs font-semibold text-gray-600 break-words">
                                    Member
                                </th>

                                <th className="w-[20%] px-2 py-3 text-[10px] sm:text-xs font-semibold text-gray-600 break-words">
                                    Book
                                </th>

                                <th className="w-[14%] px-2 py-3 text-[10px] sm:text-xs font-semibold text-gray-600 break-words">
                                    Borrowed
                                </th>

                                <th className="w-[14%] px-2 py-3 text-[10px] sm:text-xs font-semibold text-gray-600 break-words">
                                    Due Date
                                </th>

                                <th className="w-[14%] px-2 py-3 text-[10px] sm:text-xs font-semibold text-gray-600 break-words">
                                    Returned
                                </th>

                                <th className="w-[14%] px-2 py-3 text-[10px] sm:text-xs font-semibold text-gray-600 break-words">
                                    Status
                                </th>

                            </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-200">

                            {borrowings.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-3 py-8 text-center text-sm text-gray-500"
                                    >
                                        No borrowing records found.
                                    </td>
                                </tr>

                            ) : (

                                borrowings.map((borrowing) => {

                                    const details = borrowingDetails[borrowing.id];

                                    return (

                                        <tr
                                            key={borrowing.id}
                                            className="hover:bg-gray-50 transition"
                                        >

                                            {/* Borrowing ID */}
                                            <td className="px-2 py-4 text-[10px] sm:text-xs text-gray-700 break-words">
                                                {borrowing.id}
                                            </td>

                                            {/* Member name */}
                                            <td className="px-2 py-4 text-[10px] sm:text-xs text-gray-700 break-words">
                                                {details?.memberName || "Loading..."}
                                            </td>

                                            {/* Book details */}
                                            <td className="px-2 py-4 text-[10px] sm:text-xs break-words">

                                                <p className="font-medium text-black">
                                                    {details?.bookTitle || "Loading..."}
                                                </p>

                                                <p className="text-gray-500 mt-1">
                                                    {details?.bookAuthor || ""}
                                                </p>

                                            </td>

                                            {/* Borrowing date */}
                                            <td className="px-2 py-4 text-[10px] sm:text-xs text-gray-700 break-words">
                                                {borrowing.borrowingDate || "N/A"}
                                            </td>

                                            {/* Due date */}
                                            <td className="px-2 py-4 text-[10px] sm:text-xs text-gray-700 break-words">
                                                {borrowing.dueDate || "N/A"}
                                            </td>

                                            {/* Return date */}
                                            <td className="px-2 py-4 text-[10px] sm:text-xs text-gray-700 break-words">
                                                {borrowing.returnDate || "Not returned"}
                                            </td>

                                            {/* Borrowing status */}
                                            <td className="px-2 py-4 break-words">

                                                    <span
                                                        className={`inline-block px-1.5 py-1 rounded-full text-[9px] sm:text-[10px] font-semibold text-center break-words ${
                                                            borrowing.status === "BORROWED"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : borrowing.status === "RETURNED"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : borrowing.status === "OVERDUE"
                                                                        ? "bg-red-100 text-red-700"
                                                                        : "bg-gray-100 text-gray-700"
                                                        }`}
                                                    >
                                                        {borrowing.status}
                                                    </span>

                                            </td>

                                        </tr>

                                    );

                                })

                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* Member details modal */}
            {selectedMember && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-lg max-h-[90vh] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">

                        {/* Modal heading */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">

                            <h2 className="text-xl font-bold text-black">
                                Member Details
                            </h2>

                            <button
                                type="button"
                                onClick={() => setSelectedMember(null)}
                                className="text-gray-500 hover:text-black text-xl font-bold"
                            >
                                &times;
                            </button>

                        </div>

                        {/* Member information */}
                        <div className="p-6 space-y-5 overflow-y-auto">

                            <div>
                                <p className="text-sm text-gray-500">Member ID</p>
                                <p className="font-semibold text-black mt-1">
                                    {selectedMember.id}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">First Name</p>
                                <p className="font-semibold text-black mt-1">
                                    {selectedMember.firstName}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Last Name</p>
                                <p className="font-semibold text-black mt-1">
                                    {selectedMember.lastName}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Email Address</p>
                                <p className="font-semibold text-black mt-1">
                                    {selectedMember.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Contact Number</p>
                                <p className="font-semibold text-black mt-1">
                                    {selectedMember.contact}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Member Number</p>
                                <p className="font-semibold text-black mt-1">
                                    {selectedMember.memberNumber}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Account Status</p>
                                <p className="font-semibold text-black mt-1">
                                    {selectedMember.status}
                                </p>
                            </div>

                        </div>

                        {/* Modal footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end shrink-0">

                            <button
                                type="button"
                                onClick={() => setSelectedMember(null)}
                                className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Admin;
