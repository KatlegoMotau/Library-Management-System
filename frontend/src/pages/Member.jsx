
function Member() {

    // Temporary member information
    const member = {
        firstName: "John",
        lastName: "Smith",
        email: "john@example.com",
        contact: "0712345678",
        memberNumber: "MEM001",
        status: "ACTIVE"
    };

    // Temporary borrowing statistics
    const statistics = [
        {
            title: "Total Borrowings",
            value: 12,
            description: "All borrowing records"
        },
        {
            title: "Active Borrowings",
            value: 3,
            description: "Books currently borrowed"
        },
        {
            title: "Returned Books",
            value: 9,
            description: "Books successfully returned"
        }
    ];


// Temporary borrowing records
    const borrowings = [
        {
            id: 1,
            book: "Clean Code",
            borrowDate: "2026-11-10",
            dueDate: "2026-11-20",
            returnDate: "-",
            status: "ACTIVE"
        },
        {
            id: 2,
            book: "Effective Java",
            borrowDate: "2026-11-05",
            dueDate: "2026-11-15",
            returnDate: "-",
            status: "OVERDUE"
        },
        {
            id: 3,
            book: "The Pragmatic Programmer",
            borrowDate: "2026-10-20",
            dueDate: "2026-10-30",
            returnDate: "2026-10-28",
            status: "RETURNED"
        },
        {
            id: 4,
            book: "Introduction to Algorithms",
            borrowDate: "2026-10-15",
            dueDate: "2026-10-25",
            returnDate: "2026-10-24",
            status: "RETURNED"
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
                        {member.status}
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
                        View your borrowing history and book return dates.
                    </p>

                </div>

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
                        </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-100">

                        {borrowings.map((borrowing) => (

                            <tr key={borrowing.id}>

                                <td className="px-6 py-4 text-sm font-medium text-black whitespace-nowrap">
                                    {borrowing.book}
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                    {borrowing.borrowDate}
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                    {borrowing.dueDate}
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                    {borrowing.returnDate}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">

                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                borrowing.status === "ACTIVE"
                                    ? "bg-gray-100 text-gray-700"
                                    : borrowing.status === "OVERDUE"
                                        ? "bg-black text-white"
                                        : "bg-gray-200 text-gray-500"
                            }`}>
                                {borrowing.status}
                            </span>

                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Member;
