import { useState, useEffect } from 'react';

import {getBooks, createBook, updateBook, deleteBook} from "../services/bookService";
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

    // Search input state
    const [searchTerm, setSearchTerm] = useState("");

    // Selected book for editing
    const [selectedBook, setSelectedBook] = useState(null);

    // Form visibility state
    const [showBookForm, setShowBookForm] = useState(false);

    // Retrieve books from the backend
    useEffect(() => {

        async function fetchBooks() {

            try {

                setLoading(true);
                setError("");

                const booksData = await getBooks();

                setBooks(booksData);

            } catch (error) {

                setError(error.message);

            } finally {

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
        try {
            setError("");

            await deleteBook(bookId);

            const updatedBooks = await getBooks();
            setBooks(updatedBooks);

        } catch (error) {
            setError(error.message);
        }
    };

    // Add or update a book
    const handleBookSubmit = async (bookData) => {

        try {

            // Clear previous messages
            setError("");

            // Check whether we are editing or adding a book
            if (selectedBook) {

                // Update existing book
                await updateBook(selectedBook.id, bookData);

            } else {

                // Create a new book
                await createBook(bookData);

            }

            // Retrieve updated books from the backend
            const updatedBooks = await getBooks();

            setBooks(updatedBooks);

            // Close the form
            setShowBookForm(false);
            setSelectedBook(null);

        } catch (error) {

            setError(error.message);

        }

    };

    // Borrow a book
    const handleBorrowBook = async (book) => {

        try {

            setBorrowMessage("");
            setBorrowError("");

            // Send borrowing request to the backend
            await borrowBook(book.id);

            // Retrieve updated book information
            const updatedBooks = await getBooks();

            setBooks(updatedBooks);

            setBorrowMessage(
                `Successfully borrowed "${book.title}".`
            );

        } catch (error) {

            setBorrowError(error.message);

        }

    };

    // Calculate book statistics
    const totalBooks = books.length;

    const availableBooks = books.reduce(
        (total, book) => total + book.availableCopies,
        0
    );

    const borrowedBooks = books.reduce(
        (total, book) => total + (book.totalCopies - book.availableCopies),
        0
    );

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
        }
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
                            className="bg-black text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
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

            {borrowError && (
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
