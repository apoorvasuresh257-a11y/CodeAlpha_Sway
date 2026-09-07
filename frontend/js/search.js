// ============================================
// SWAY - SEARCH JAVASCRIPT
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("🔎 Sway Search JS loaded");


    // ========================================
    // API
    // ========================================

    const API_BASE = "http://localhost:5000";


    // ========================================
    // ELEMENTS
    // ========================================

    const searchInput =
        document.getElementById("search-input");

    const searchResults =
        document.getElementById("search-results");


    // ========================================
    // CHECK ELEMENTS
    // ========================================

    if (!searchInput || !searchResults) {

        console.log(
            "ℹ️ Search elements not found on this page."
        );

        return;

    }


    // ========================================
    // TOKEN
    // ========================================

    function getToken() {

        return localStorage.getItem(
            "sway_token"
        );

    }


    // ========================================
    // ESCAPE HTML
    // ========================================

    function escapeHTML(value) {

        return String(value || "")

            .replace(/&/g, "&amp;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;")

            .replace(/"/g, "&quot;")

            .replace(/'/g, "&#039;");

    }


    // ========================================
    // GET INITIALS
    // ========================================

    function getInitials(name) {

        if (!name) {

            return "SU";

        }


        const parts =
            name
                .trim()
                .split(/\s+/);


        if (parts.length === 1) {

            return parts[0]
                .charAt(0)
                .toUpperCase();

        }


        return (

            parts[0]
                .charAt(0)
                .toUpperCase()

            +

            parts[parts.length - 1]
                .charAt(0)
                .toUpperCase()

        );

    }


    // ========================================
    // SEARCH USERS
    // ========================================

    async function searchUsers(query) {

        const token = getToken();


        if (!token) {

            searchResults.innerHTML = `

                <div class="search-message">

                    Please login to search users.

                </div>

            `;

            return;

        }


        try {

            searchResults.innerHTML = `

                <div class="search-message">

                    Searching...

                </div>

            `;


            const response =
                await fetch(
                    `${API_BASE}/api/search/users?q=${encodeURIComponent(query)}`,
                    {

                        method: "GET",

                        headers: {

                            "Authorization":
                                `Bearer ${token}`

                        }

                    }
                );


            const data =
                await response.json();


            // ====================================
            // AUTH ERROR
            // ====================================

            if (response.status === 401) {

                localStorage.removeItem(
                    "sway_token"
                );

                localStorage.removeItem(
                    "sway_user"
                );

                alert(
                    "Your session has expired. Please login again."
                );

                window.location.href =
                    "./auth/login.html";

                return;

            }


            // ====================================
            // API ERROR
            // ====================================

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to search users."
                );

            }


            const users =
                Array.isArray(data.users)
                    ? data.users
                    : [];


            // ====================================
            // NO RESULTS
            // ====================================

            if (!users.length) {

                searchResults.innerHTML = `

                    <div class="search-message">

                        No users found.

                    </div>

                `;

                return;

            }


            // ====================================
            // RENDER RESULTS
            // ====================================

            searchResults.innerHTML =
                users
                    .map(createUserResult)
                    .join("");


        } catch (error) {

            console.error(
                "❌ Search error:",
                error
            );


            searchResults.innerHTML = `

                <div class="search-message">

                    Unable to search users.

                </div>

            `;

        }

    }


    // ========================================
    // CREATE USER RESULT
    // ========================================

    function createUserResult(user) {

        const name =
            user.name ||
            "Sway User";


        const username =
            user.username ||
            "user";


        const initials =
            getInitials(name);


        const bio =
            user.bio ||
            "";


        return `

            <a
                href="./profile.html?id=${encodeURIComponent(user._id)}"
                class="search-user-result"
            >

                <div class="search-user-avatar">

                    ${escapeHTML(initials)}

                </div>


                <div class="search-user-info">

                    <strong>

                        ${escapeHTML(name)}

                    </strong>


                    <span>

                        @${escapeHTML(username)}

                    </span>


                    ${
                        bio
                            ? `

                                <small>

                                    ${escapeHTML(bio)}

                                </small>

                              `
                            : ""
                    }

                </div>

            </a>

        `;

    }


    // ========================================
    // SEARCH INPUT
    // ========================================

    let searchTimer;


    searchInput.addEventListener(
        "input",
        () => {

            const query =
                searchInput.value.trim();


            clearTimeout(searchTimer);


            // ====================================
            // EMPTY SEARCH
            // ====================================

            if (!query) {

                searchResults.innerHTML = `

                    <div class="search-message">

                        Search for people on Sway.

                    </div>

                `;

                return;

            }


            // ====================================
            // DELAY SEARCH
            // ====================================

            searchTimer =
                setTimeout(
                    () => {

                        searchUsers(query);

                    },
                    300
                );

        }
    );


    // ========================================
    // INITIAL MESSAGE
    // ========================================

    searchResults.innerHTML = `

        <div class="search-message">

            Search for people on Sway.

        </div>

    `;


    console.log(
        "✨ Search initialized successfully"
    );

});