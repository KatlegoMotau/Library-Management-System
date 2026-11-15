import { useState, useEffect } from 'react';

import {
    getBooks,
    createBook,
    updateBook,
    deleteBook
} from "../services/bookService";

import { borrowBook } from "../services/borrowingService";
import { getUserRole } from "../utils/auth";

import BookForm from "../compontents/BookForm.jsx";
import BookCard from "../compontents/BookCard.jsx";

function Books() {

    // Retrieve the logged-in user's role from the JWT
    const role = getUserRole();

    // Books retrieved from the backend
    const [books, setBooks] = useState([]);

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Borrowing feedback
    const [borrowMessage, setBorrowMessage] = useState("");
    const [borrowError, setBorrowError] = useState("");

    // Selected book for borrowing
    const [selectedBorrowBook, setSelectedBorrowBook] = useState(null);

    // Selected due date
    const [dueDate, setDueDate] = useState("");

    // Borrowing submission state
    const [borrowing, setBorrowing] = useState(false);

    // Search input state
    const [searchTerm, setSearchTerm] = useState("");

    // Selected book for editing
    const [selectedBook, setSelectedBook] = useState(null);

    // Form visibility state
    const [showBookForm, setShowBookForm] = useState(false);

    // Calculate allowed borrowing dates
    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const maximumDueDate = new Date(today);
    maximumDueDate.setDate(maximumDueDate.getDate() + 14);

    // Format date for HTML date inputs
    const formatDate = (date) => {

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;

    };

    const minimumDate = formatDate(tomorrow);
    const maximumDate = formatDate(maximumDueDate);

    // Retrieve books from the backend
    useEffect(() => {

        async function fetchBooks() {

            try
            {
                setLoading(true);
                setError("");

                const booksData = await getBooks();

                setBooks(booksData);
            }
            catch (error)
            {
                setError(error.message);
            }
            finally
            {
                setLoading(false);
            }

        }

        fetchBooks();

    }, []);

    const handleEditBook = (book) => {
        setSelectedBook(book);
        setShowBookForm(true);
    };

    const handleDeleteBook = async (bookId) => {

        try
        {
            setError("");

            await deleteBook(bookId);

            const updatedBooks = await getBooks();
            setBooks(updatedBooks);
        }
        catch (error)
        {
            setError(error.message);
        }

    };

    // Add or update a book
    const handleBookSubmit = async (bookData) => {

        try
        {
            setError("");

            if (selectedBook)
            {
                await updateBook(selectedBook.id, bookData);
            }
            else
            {
                await createBook(bookData);
            }

            const updatedBooks = await getBooks();

            setBooks(updatedBooks);

            setShowBookForm(false);
            setSelectedBook(null);

        }
        catch (error)
        {
            setError(error.message);
        }

    };

    // Open the borrowing form
    const handleBorrowBook = (book) => {

        setSelectedBorrowBook(book);

        setDueDate("");

        setBorrowMessage("");
        setBorrowError("");

    };

    // Confirm borrowing
    const handleConfirmBorrowing = async (event) => {

        event.preventDefault();

        if(!selectedBorrowBook || !dueDate)
        {
            setBorrowError("Please select a due date.");

            return;
        }

        if(dueDate < minimumDate || dueDate > maximumDate)
        {

            setBorrowError("Please select a due date within the next 14 days.");

            return;
        }

        try
        {
            setBorrowing(true);

            setBorrowMessage("");
            setBorrowError("");

            // Send book ID and selected due date to the backend
            await borrowBook(selectedBorrowBook.id, dueDate);

            // Retrieve updated book information
            const updatedBooks = await getBooks();

            setBooks(updatedBooks);

            setBorrowMessage(`Successfully borrowed "${selectedBorrowBook.title}".`);

            // Close borrowing form
            setSelectedBorrowBook(null);
            setDueDate("");

        }
        catch (error)
        {
            setBorrowError(error.message);
        }
        finally
        {
            setBorrowing(false);
        }

    };

    // Calculate book statistics
    const totalBooks = books.length;

    const availableBooks = books.reduce((total, book) => total + book.availableCopies, 0);

    const borrowedBooks = books.reduce((total, book) => total + (book.totalCopies - book.availableCopies), 0);

    // Book statistics
    const statistics = [
        {
            title: "Total Books",
            value: totalBooks,
            description: "Books in the catalogue"
        },
        {
            title: "Available Copies",
            value: availableBooks,
            description: "Copies available for borrowing"
        },
        {
            title: "Borrowed Copies",
            value: borrowedBooks,
            description: "Copies currently borrowed"
        },
    ];

    // Filter books
    const filteredBooks = books.filter((book) => {

        return (
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

    });

    return (

        <div className="space-y-8">

            {/* Borrow Book Modal */}
            {selectedBorrowBook && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">

                        <h2 className="text-xl font-bold text-black mb-2">
                            Borrow Book
                        </h2>

                        <p className="text-sm text-gray-500 mb-6">
                            You are borrowing:

                            <span className="font-semibold text-black">
                                {" "}{selectedBorrowBook.title}
                            </span>
                        </p>

                        <form
                            onSubmit={handleConfirmBorrowing}
                            className="space-y-5"
                        >

                            {/* Due date */}
                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expected Return Date
                                </label>

                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(event) => setDueDate(event.target.value)}
                                    min={minimumDate}
                                    max={maximumDate}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                                />

                                <p className="text-xs text-gray-400 mt-2">
                                    Choose a date between tomorrow and the next 14 days.
                                </p>

                            </div>

                            {/* Borrowing error */}
                            {borrowError && (

                                <p className="text-sm text-red-600">
                                    {borrowError}
                                </p>

                            )}

                            {/* Form actions */}
                            <div className="flex justify-end gap-3 pt-3">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedBorrowBook(null);
                                        setDueDate("");
                                        setBorrowError("");
                                    }}
                                    disabled={borrowing}
                                    className="px-5 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={borrowing}
                                    className="px-5 py-3 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {borrowing ? "Processing..." : "Confirm Borrowing"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* Add/Edit Book Modal */}
            {showBookForm && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">

                        <h2 className="text-xl font-bold text-black mb-6">
                            {selectedBook ? "Edit Book" : "Add New Book"}
                        </h2>

                        <BookForm
                            book={selectedBook}
                            onSubmit={handleBookSubmit}
                            onCancel={() => {
                                setShowBookForm(false);
                                setSelectedBook(null);
                            }}
                        />

                    </div>

                </div>

            )}

            {/* Page heading */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                    <h1 className="text-3xl font-bold text-black">
                        Books Catalogue
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Browse and manage books in the library.
                    </p>

                    {role === "ADMIN" && (

                        <button
                            type="button"
                            onClick={() => {
                                setSelectedBook(null);
                                setShowBookForm(true);
                            }}
                            className="bg-black text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition mt-4"
                        >
                            Add New Book
                        </button>

                    )}

                </div>

            </div>

            {/* Borrowing feedback */}
            {borrowMessage && (

                <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">

                    <p className="text-sm text-black">
                        {borrowMessage}
                    </p>

                </div>

            )}

            {borrowError && !selectedBorrowBook && (

                <div className="bg-white border border-red-200 rounded-lg p-4">

                    <p className="text-sm text-red-600">
                        Borrowing failed: {borrowError}
                    </p>

                </div>

            )}

            {/* Book statistics */}
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

            {/* Book search */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">

                <h2 className="text-lg font-bold text-black mb-4">
                    Find Books
                </h2>

                <input
                    type="text"
                    placeholder="Search by book title, author or category..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full sm:max-w-md px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                />

            </div>

            {/* Books catalogue */}
            <div>

                <div className="flex items-center justify-between mb-5">

                    <h2 className="text-xl font-bold text-black">
                        All Books
                    </h2>

                    <p className="text-sm text-gray-500">
                        {filteredBooks.length} books found
                    </p>

                </div>

                {/* Loading state */}
                {loading && (

                    <p className="text-gray-500">
                        Loading books...
                    </p>

                )}

                {/* Error state */}
                {!loading && error && (

                    <div className="bg-white p-6 rounded-xl border border-red-200">

                        <p className="text-red-600">
                            Failed to retrieve books: {error}
                        </p>

                    </div>

                )}

                {/* Books catalogue */}
                {!loading && !error && (

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

                        {filteredBooks.length > 0 ? (

                            filteredBooks.map((book) => (

                                <BookCard
                                    key={book.id}
                                    book={book}
                                    role={role}
                                    onBorrow={handleBorrowBook}
                                    onEdit={handleEditBook}
                                    onDelete={handleDeleteBook}
                                />

                            ))

                        ) : (

                            <div className="col-span-full bg-white p-8 rounded-xl border border-gray-200 text-center">

                                <p className="text-gray-500">
                                    No books found matching your search.
                                </p>

                            </div>

                        )}

                    </div>

                )}

            </div>

        </div>

    );

}

export default Books;
