function MemberTable({members, onToggleMemberStatus, onViewMember}) {

    return (
        <div className="overflow-x-auto">

            <table className="w-full text-left">

                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Member
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Email
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Contact
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                        Actions
                    </th>
                </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                {members.length > 0 ? (

                    members.map((member) => (

                        <tr key={member.id}>

                            <td className="px-6 py-4 text-sm font-medium text-black whitespace-nowrap">
                                {member.firstName} {member.lastName}
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                {member.email}
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                {member.contact}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        member.status === "ACTIVE"
                                            ? "bg-gray-100 text-gray-700"
                                            : "bg-black text-white"
                                    }`}>
                                        {member.status}
                                    </span>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">

                                <div className="flex items-center gap-4">

                                    <button
                                        type="button"
                                        onClick={() => onViewMember(member)}
                                        className="text-sm font-semibold text-black hover:underline"
                                    >
                                        View
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onToggleMemberStatus(member.id)}
                                        className="text-sm font-semibold text-gray-500 hover:text-black hover:underline"
                                    >
                                        {member.status === "ACTIVE"
                                            ? "Deactivate"
                                            : "Activate"}
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))

                ) : (

                    <tr>
                        <td
                            colSpan="5"
                            className="px-6 py-8 text-center text-sm text-gray-500"
                        >
                            No members found.
                        </td>
                    </tr>

                )}

                </tbody>

            </table>

        </div>
    );
}

export default MemberTable;
