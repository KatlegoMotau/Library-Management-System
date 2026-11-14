function Dashboard() {

    // Temporary dashboard statistics
    const statistics = [
        {
            title: "Total Books",
            value: 250,
            description: "Books available in the library"
        },
        {
            title: "Total Members",
            value: 120,
            description: "Registered library members"
        },
        {
            title: "Active Borrowings",
            value: 45,
            description: "Books currently borrowed"
        },
        {
            title: "Overdue Borrowings",
            value: 8,
            description: "Borrowings past their due date"
        }
    ];

    // Temporary recent borrowing records
    const recentBorrowings = [
        {
            id: 1,
            member: "John Smith",
            book: "Clean Code",
            borrowDate: "2026-11-10",
            dueDate: "2026-11-20",
            status: "ACTIVE"
        },
        {
            id: 2,
            member: "Sarah Johnson",
            book: "Effective Java",
            borrowDate: "2026-11-08",
            dueDate: "2026-11-18",
            status: "ACTIVE"
        },
        {
            id: 3,
            member: "Michael Brown",
            book: "The Pragmatic Programmer",
            borrowDate: "2026-11-01",
            dueDate: "2026-11-10",
            status: "OVERDUE"
        },
        {
            id: 4,
            member: "Emily Davis",
            book: "Introduction to Algorithms",
            borrowDate: "2026-11-05",
            dueDate: "2026-11-15",
            status: "RETURNED"
        }
    ];

    return (
        <div className="space-y-8">

            {/* Dashboard heading */}
            <div>
                <h1 className="text-3xl font-bold text-black">
                    Dashboard
                </h1>

                <p className="text-gray-500 mt-2">
                    Welcome to your Library Management System.
                    Here's an overview of your library.
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

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

            {/* Recent borrowings */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

                <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-black">
                        Recent Borrowings
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Overview of recently borrowed books.
                    </p>
                </div>

                <div className="overflow-x-auto">

                    <table className="w-full text-left">

                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                Member
                            </th>

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
                                Status
                            </th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">

                        {recentBorrowings.map((borrowing) => (

                            <tr key={borrowing.id}>

                                <td className="px-6 py-4 text-sm font-medium text-black whitespace-nowrap">
                                    {borrowing.member}
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                    {borrowing.book}
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                    {borrowing.borrowDate}
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                    {borrowing.dueDate}
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

export default Dashboard;
