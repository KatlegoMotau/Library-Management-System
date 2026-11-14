import { apiRequest } from "./api";

// Borrow a book
async function borrowBook(bookId) {

    return await apiRequest("/api/borrowings/borrow", {
        method: "POST",
        body: JSON.stringify({
            bookId: bookId
        })
    });

}

// Return a borrowed book
async function returnBook(borrowingId) {

    return await apiRequest(`/api/borrowings/return/${borrowingId}`, {
        method: "PUT"
    });

}

// Retrieve all borrowing records
async function getBorrowings() {

    return await apiRequest("/api/borrowings", {
        method: "GET"
    });

}

// Retrieve borrowing history for a member
async function getMemberBorrowings(memberId) {

    return await apiRequest(`/api/borrowings/member/${memberId}`, {
        method: "GET"
    });

}

// Retrieve active borrowings for a member
async function getActiveBorrowings(memberId) {

    return await apiRequest(`/api/borrowings/member/${memberId}/active`, {
        method: "GET"
    });

}

export {
    borrowBook,
    returnBook,
    getBorrowings,
    getMemberBorrowings,
    getActiveBorrowings
};
