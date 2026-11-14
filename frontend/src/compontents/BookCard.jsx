function BookCard({book, role, onEdit, onDelete, onBorrow}) {

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">

            {/* Book information */}
            <h3 className="text-lg font-bold text-black">
                {book.title}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
                By {book.author}
            </p>

            <div className="space-y-3 mt-5 pt-5 border-t border-gray-100">

                <div>
                    <p className="text-xs text-gray-400 uppercase">
                        ISBN
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                        {book.isbn}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-gray-400 uppercase">
                        Category
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                        {book.category}
                    </p>
                </div>

                {/* Copy information */}
                <div>
                    <p className="text-xs text-gray-400 uppercase">
                        Copies
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                        {book.availableCopies} available out of {book.totalCopies}
                    </p>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between pt-2">

                    <span className="text-xs text-gray-500">
                        Availability
                    </span>

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        book.available
                            ? "bg-gray-100 text-gray-700"
                            : "bg-black text-white"
                    }`}>
                        {book.available ? "AVAILABLE" : "UNAVAILABLE"}
                    </span>

                </div>

            </div>

            {/* Administrator actions */}
            {role === "ADMIN" && (

                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100">

                    <button
                        type="button"
                        onClick={() => onEdit(book)}
                        className="text-sm font-semibold text-black hover:underline"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(book.id)}
                        className="text-sm font-semibold text-gray-500 hover:text-black hover:underline"
                    >
                        Delete
                    </button>

                </div>

            )}

            {/* Member action */}
            {role === "MEMBER" && book.available && (

                <button
                    type="button"
                    onClick={() => onBorrow(book)}
                    className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
                >
                    Borrow Book
                </button>

            )}

        </div>
    );
}

export default BookCard;
