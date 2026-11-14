const API_BASE_URL = "http://localhost:8080";

async function apiRequest(endpoint, options = {}) {

    // Determine whether this request requires authentication
    const { requiresAuth = true, ...fetchOptions } = options;

    // Retrieve the saved JWT
    const token = sessionStorage.getItem("token");

    // Set request headers
    const headers = {
        "Content-Type": "application/json",
        ...fetchOptions.headers
    };

    // Attach JWT only when authentication is required
    if (requiresAuth && token) {
        headers.Authorization = `Bearer ${token}`;
    }

    // Send HTTP request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers
    });

    // Clear expired or invalid authentication tokens
    if (response.status === 401 && requiresAuth) {
        sessionStorage.removeItem("token");
    }

    // Handle responses without a body
    if (response.status === 204) {
        return null;
    }

    // Read response data
    const contentType = response.headers.get("content-type");

    const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

    // Handle unsuccessful responses
    if (!response.ok) {
        const message = typeof data === "object"
            ? data.message || "Something went wrong"
            : data || "Something went wrong";

        throw new Error(message);
    }

    return data;
}

export { API_BASE_URL, apiRequest };
