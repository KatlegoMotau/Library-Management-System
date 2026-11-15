import { apiRequest } from "./api";

// Borrow a book with a selected due date
async function borrowBook(bookId, dueDate) {

    return await apiRequest("/api/borrowings/borrow", {
        method: "POST",
        body: JSON.stringify({
            bookId: bookId,
            dueDate: dueDate
        })
    });

}

// Return a borrowed book
async function returnBook(borrowingId) {

    return await apiRequest(`/api/borrowings/return/${borrowingId}`, {
        method: "PUT"
    });

}

// Get all borrowing records
async function getBorrowings() {

    return await apiRequest("/api/borrowings", {
        method: "GET"
    });

}

// Get borrowing records belonging to a member
async function getMemberBorrowings(memberId) {

    return await apiRequest(`/api/borrowings/member/${memberId}`, {
        method: "GET"
    });

}

// Get active borrowing records belonging to a member
async function getActiveBorrowings(memberId) {

    return await apiRequest(`/api/borrowings/member/${memberId}/active`, {
        method: "GET"
    });

}

export {borrowBook, returnBook, getBorrowings, getMemberBorrowings, getActiveBorrowings};
