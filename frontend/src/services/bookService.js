import { apiRequest } from "./api";

// Retrieve all books
async function getBooks() {

    return await apiRequest("/api/books", {
        method: "GET"
    });

}

// Retrieve one book by ID
async function getBookById(id) {

    return await apiRequest(`/api/books/${id}`, {
        method: "GET"
    });

}

// Create a new book
async function createBook(bookData) {

    return await apiRequest("/api/books/create", {
        method: "POST",
        body: JSON.stringify(bookData)
    });

}

// Update an existing book
async function updateBook(id, bookData) {

    return await apiRequest(`/api/books/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(bookData)
    });

}

// Delete a book
async function deleteBook(id) {

    return await apiRequest(`/api/books/delete/${id}`, {
        method: "DELETE"
    });

}

// Check book availability
async function checkAvailability(id) {

    return await apiRequest(`/api/books/availability/${id}`, {
        method: "GET"
    });

}

// Borrow a copy
async function borrowCopy(id) {

    return await apiRequest(`/api/books/borrow-copy/${id}`, {
        method: "POST"
    });

}

// Return a copy
async function returnCopy(id) {

    return await apiRequest(`/api/books/return-copy/${id}`, {
        method: "POST"
    });

}

export {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    checkAvailability,
    borrowCopy,
    returnCopy
};
