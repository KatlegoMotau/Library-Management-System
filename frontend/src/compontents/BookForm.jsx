import { useState } from 'react';

function BookForm({ book, onSubmit, onCancel }) {

    // Form input state
    const [formData, setFormData] = useState({
        title: book?.title || "",
        author: book?.author || "",
        isbn: book?.isbn || "",
        category: book?.category || "",
        totalCopies: book?.totalCopies ?? 1
    });

    // Update form fields
    const handleChange = (event) => {

        const { name, value } = event.target;

        // Only allow digits in the ISBN field
        if (name === "isbn" && !/^\d*$/.test(value)) {
            return;
        }

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }));

    };

    // Submit form
    const handleSubmit = (event) => {

        event.preventDefault();

        // Prepare cleaned form data
        const cleanedData = {
            title: formData.title.trim(),
            author: formData.author.trim(),
            isbn: formData.isbn.trim(),
            category: formData.category.trim(),
            totalCopies: Number(formData.totalCopies)
        };

        onSubmit(cleanedData);

    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >

            {/* Book title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book Title
                </label>

                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter book title"
                    minLength={2}
                    maxLength={150}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                />
            </div>

            {/* Author */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                </label>

                <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Enter author name"
                    minLength={2}
                    maxLength={100}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                />
            </div>

            {/* ISBN */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISBN
                </label>

                <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    placeholder="Enter 10 or 13 digit ISBN"
                    minLength={10}
                    maxLength={13}
                    pattern="(\d{10}|\d{13})"
                    inputMode="numeric"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                />

                <p className="text-xs text-gray-400 mt-1">
                    ISBN must contain exactly 10 or 13 digits.
                </p>
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                </label>

                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Enter book category"
                    minLength={2}
                    maxLength={50}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                />
            </div>

            {/* Total copies */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Copies
                </label>

                <input
                    type="number"
                    name="totalCopies"
                    value={formData.totalCopies}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                />

                <p className="text-xs text-gray-400 mt-1">
                    Enter the total number of copies available in the library.
                </p>
            </div>

            {/* Form actions */}
            <div className="flex justify-end gap-3 pt-4">

                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="px-5 py-3 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800"
                >
                    {book ? "Update Book" : "Add Book"}
                </button>

            </div>

        </form>
    );
}

export default BookForm;
