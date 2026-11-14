import { useState } from 'react';
import MemberTable from "../compontents/MemberTable.jsx";

function Admin() {

    // Temporary member statistics
    const statistics = [
        {
            title: "Total Members",
            value: 120,
            description: "Registered members"
        },
        {
            title: "Active Members",
            value: 105,
            description: "Members with active accounts"
        },
        {
            title: "Inactive Members",
            value: 15,
            description: "Members with inactive accounts"
        }
    ];

    // Temporary member records
    const [members, setMembers] = useState([
        {
            id: 1,
            firstName: "John",
            lastName: "Smith",
            email: "john@example.com",
            contact: "0712345678",
            status: "ACTIVE"
        },
        {
            id: 2,
            firstName: "Sarah",
            lastName: "Johnson",
            email: "sarah@example.com",
            contact: "0723456789",
            status: "ACTIVE"
        },
        {
            id: 3,
            firstName: "Michael",
            lastName: "Brown",
            email: "michael@example.com",
            contact: "0734567890",
            status: "INACTIVE"
        },
        {
            id: 4,
            firstName: "Emily",
            lastName: "Davis",
            email: "emily@example.com",
            contact: "0745678901",
            status: "ACTIVE"
        },
        {
            id: 5,
            firstName: "David",
            lastName: "Wilson",
            email: "david@example.com",
            contact: "0756789012",
            status: "INACTIVE"
        }
    ]);

    // Search input state
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMember, setSelectedMember] = useState(null);

    // Filter members using the search input
    const filteredMembers = members.filter((member) => {

        const fullName = `${member.firstName} ${member.lastName}`;

        return (
            fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

    });

    // Activate or deactivate a member
    const toggleMemberStatus = (memberId) => {

        setMembers((currentMembers) =>

            currentMembers.map((member) => {

                if (member.id === memberId) {

                    return {
                        ...member,
                        status: member.status === "ACTIVE"
                            ? "INACTIVE"
                            : "ACTIVE"
                    };

                }

                return member;

            })

        );

    };

    return (
        <div className="space-y-8">

            {/* Page heading */}
            <div>
                <h1 className="text-3xl font-bold text-black">
                    Admin Management
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage library members and monitor their accounts.
                </p>
            </div>

            {/* Member statistics */}
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

            {/* Member management */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

                <div className="p-6 border-b border-gray-200">

                    <h2 className="text-lg font-bold text-black">
                        Member Management
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        View and manage registered library members.
                    </p>

                    {/* Search input */}
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

                {/* Members table */}
                <MemberTable
                    members={filteredMembers}
                    onToggleMemberStatus={toggleMemberStatus}
                    onViewMember={setSelectedMember}
                />

            </div>
            {/* Member details modal */}
            {selectedMember && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-lg bg-white rounded-xl shadow-xl">

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
                        <div className="p-6 space-y-5">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Member ID
                                </p>

                                <p className="font-semibold text-black mt-1">
                                    {selectedMember.id}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    First Name
                                </p>

                                <p className="font-semibold text-black mt-1">
                                    {selectedMember.firstName}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Last Name
                                </p>

                                <p className="font-semibold text-black mt-1">
                                    {selectedMember.lastName}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Email Address
                                </p>

                                <p className="font-semibold text-black mt-1">
                                    {selectedMember.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Contact Number
                                </p>

                                <p className="font-semibold text-black mt-1">
                                    {selectedMember.contact}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Account Status
                                </p>

                                <p className="font-semibold text-black mt-1">
                                    {selectedMember.status}
                                </p>
                            </div>

                        </div>

                        {/* Modal footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">

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
