function StatisticsCard({ statistics, loading, error }) {

    return (
        <div className="space-y-4">

            {loading && (
                <p className="text-gray-500">
                    Loading statistics...
                </p>
            )}

            {!loading && error && (
                <p className="text-red-600">
                    Failed to retrieve statistics: {error}
                </p>
            )}

            {!loading && !error && (
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
            )}

        </div>
    );
}

export default StatisticsCard;
