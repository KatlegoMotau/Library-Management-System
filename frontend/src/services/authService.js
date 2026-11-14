import { apiRequest } from "./api";

// Register a new member
async function registerMember(memberData) {

    return await apiRequest("/api/members/create", {
        method: "POST",
        body: JSON.stringify(memberData),
        requiresAuth: false
    });

}

// Login an existing member
async function loginMember(loginData) {

    return await apiRequest("/api/members/login", {
        method: "POST",
        body: JSON.stringify(loginData),
        requiresAuth: false
    });

}

export {
    registerMember,
    loginMember
};
