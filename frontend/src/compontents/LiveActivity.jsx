import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

function LiveActivity() {

    const [activities, setActivities] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState("CONNECTING");

    useEffect(() => {

        const token = sessionStorage.getItem("token");

        if (!token)
        {
            setConnectionStatus("UNAUTHENTICATED");
            return;
        }

        // Create a STOMP client
        const client = new Client({

            brokerURL: "ws://localhost:8083/ws",

            // Send JWT during STOMP connection
            connectHeaders: {Authorization: `Bearer ${token}`},

            reconnectDelay: 5000,

            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,

            // Successful connection
            onConnect: () => {

                setConnectionStatus("CONNECTED");

                // Subscribe to administrator activity
                client.subscribe(
                    "/topic/admin/activity",
                    (message) => {

                        try
                        {
                            const event = JSON.parse(message.body);

                            const activity = {
                                ...event,
                                receivedAt: new Date().toISOString()
                            };

                            setActivities(previousActivities => [
                                activity,
                                ...previousActivities
                            ].slice(0, 20));

                        }
                        catch (error)
                        {
                            console.error("Could not process borrowing notification:", error);
                        }

                    }
                );

            },

            // Broker reports an STOMP error
            onStompError: (frame) => {

                console.error("STOMP error:", frame.headers.message);

                setConnectionStatus("ERROR");

            },

            // WebSocket connection closes
            onWebSocketClose: () => {

                setConnectionStatus("DISCONNECTED");

            },

            // WebSocket error
            onWebSocketError: (error) => {

                console.error("WebSocket error:", error);

                setConnectionStatus("ERROR");

            }

        });

        client.activate();

        // Disconnect when component is removed
        return () => {

            client.deactivate();

        };

    }, []);

    // Display connection status
    const statusStyles = {

        CONNECTED: "bg-green-100 text-green-700",
        CONNECTING: "bg-yellow-100 text-yellow-700",
        DISCONNECTED: "bg-gray-100 text-gray-700",
        UNAUTHENTICATED: "bg-red-100 text-red-700",
        ERROR: "bg-red-100 text-red-700"

    };

    return (

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

            {/* Panel heading */}
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">

                <div>

                    <h2 className="text-lg font-bold text-black">
                        Live Library Activity
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Real-time borrowing notifications.
                    </p>

                </div>

                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[connectionStatus]}`}
                >
                    {connectionStatus}
                </span>

            </div>

            {/* Activity list */}
            <div className="divide-y divide-gray-100">

                {activities.length === 0 ? (

                    <p className="p-6 text-sm text-gray-500 text-center">

                        {connectionStatus === "CONNECTED"
                            ? "Waiting for new borrowing activity..."
                            : "Waiting for a connection to the notification service..."
                        }

                    </p>

                ) : (

                    activities.map((activity, index) => (

                        <div
                            key={`${activity.borrowingId}-${index}`}
                            className="px-6 py-4 flex justify-between items-center gap-4"
                        >

                            <div>

                                <p className="text-sm font-semibold text-gray-800">

                                    {activity.event === "BOOK_BORROWED"
                                        ? "A book was borrowed"
                                        : activity.event
                                    }

                                </p>

                                <p className="text-xs text-gray-500 mt-1">

                                    Member ID: {activity.memberId}
                                    {" · "}
                                    Book ID: {activity.bookId}

                                </p>

                                <p className="text-xs text-gray-400 mt-1">

                                    Borrowing ID: {activity.borrowingId}

                                </p>

                            </div>

                            <span className="text-xs text-gray-500 whitespace-nowrap">

                                {new Date(activity.receivedAt).toLocaleTimeString()}

                            </span>

                        </div>

                    ))

                )}

            </div>

            {/* Activity count */}
            {activities.length > 0 && (

                <div className="px-6 py-3 border-t border-gray-100">

                    <p className="text-xs text-gray-500">

                        Showing the latest {activities.length} notifications.

                    </p>

                </div>

            )}

        </div>

    );

}

export default LiveActivity;