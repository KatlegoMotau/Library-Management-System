import { apiRequest } from "./api";

// Retrieve the authenticated member's profile
async function getMyProfile() {
    return await apiRequest("/api/members/me", {
        method: "GET"
    });
}

// Retrieve a member using their database ID
async function getMemberById(id) {
    return await apiRequest(`/api/members/${id}`, {
        method: "GET"
    });
}

// Retrieve all registered members (ADMIN)
async function getMembers() {
    return await apiRequest("/api/members", {
        method: "GET"
    });
}

// Deactivate a member account (ADMIN)
async function deactivateMember(id) {
    return await apiRequest(`/api/members/deactivate/${id}`, {
        method: "PATCH"
    });
}

// Activate a member account (ADMIN)
async function activateMember(id) {
    return await apiRequest(`/api/members/activate/${id}`, {
        method: "PATCH"
    });
}

export {getMyProfile, getMemberById, getMembers, deactivateMember, activateMember};
