// Retrieve the current user's JWT
function getToken() {
    return sessionStorage.getItem("token");
}

// Decode the JWT payload
function getTokenPayload() {

    const token = getToken();

    if (!token) {
        return null;
    }

    try {

        // JWT contains three parts separated by dots
        const tokenParts = token.split(".");

        // Retrieve the payload section
        const payload = tokenParts[1];

        // Decode Base64URL format
        const base64 = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        return JSON.parse(atob(base64));

    } catch (error) {

        console.error("Unable to decode JWT:", error);

        return null;

    }

}

// Check whether the JWT exists and has not expired
function isAuthenticated() {

    const payload = getTokenPayload();

    if (!payload || !payload.exp) {
        return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp > currentTime;

}

// Retrieve the current user's role
function getUserRole() {

    const payload = getTokenPayload();

    return payload?.role || null;

}

export {
    getToken,
    getTokenPayload,
    isAuthenticated,
    getUserRole
};
