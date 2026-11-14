function Navbar({
                    userName = "Guest User",
                    role = "MEMBER",
                    onMenuClick
                }) {

    // Get the first letter of the user's name
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <header className="w-full bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">

            {/* Left section */}
            <div className="flex items-center gap-3 min-w-0">

                {/* Mobile menu button */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="md:hidden p-2 rounded-lg text-black hover:bg-gray-100"
                    aria-label="Toggle navigation menu"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </button>

                {/* Application name */}
                <div className="min-w-0">
                    <h1 className="text-lg sm:text-xl font-bold text-black">
                        Library Management System
                    </h1>

                    <p className="hidden sm:block text-sm text-gray-500">
                        Manage your library with ease
                    </p>
                </div>

            </div>

            {/* User information */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">

                {/* User profile indicator */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    {userInitial}
                </div>

                {/* User details */}
                <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-black">
                        {userName}
                    </p>

                    <p className="text-xs text-gray-500">
                        {role}
                    </p>
                </div>

            </div>

        </header>
    );
}

export default Navbar;
