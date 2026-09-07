// ============================================
// SWAY - Session & User UI
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const token =
        localStorage.getItem("sway_token");

    const storedUser =
        localStorage.getItem("sway_user");


    // ========================================
    // PROTECT PAGE
    // ========================================

    if (!token || !storedUser) {

        window.location.href =
            "./auth/login.html";

        return;

    }


    // ========================================
    // PARSE USER
    // ========================================

    let user;

    try {

        user = JSON.parse(storedUser);

    } catch (error) {

        console.error(
            "❌ Invalid stored user data"
        );

        localStorage.removeItem("sway_token");
        localStorage.removeItem("sway_user");

        window.location.href =
            "./auth/login.html";

        return;

    }


    console.log(
        "🔐 Sway session active:",
        user.username
    );


    // ========================================
    // USER AVATARS
    // ========================================

    const avatarElements =
        document.querySelectorAll(
            ".user-avatar, .avatar"
        );


    avatarElements.forEach((avatar) => {

        // For now our user model stores
        // an avatar URL only if available.

        if (user.avatar) {

            avatar.innerHTML = `
                <img
                    src="${user.avatar}"
                    alt="${user.name}"
                >
            `;

        } else {

            avatar.textContent =
                getInitials(user.name);

        }

    });


    // ========================================
    // USER NAME ELEMENTS
    // ========================================

    const userNameElements =
        document.querySelectorAll(
            "[data-user-name]"
        );


    userNameElements.forEach((element) => {

        element.textContent =
            user.name;

    });


    // ========================================
    // USERNAME ELEMENTS
    // ========================================

    const usernameElements =
        document.querySelectorAll(
            "[data-user-username]"
        );


    usernameElements.forEach((element) => {

        element.textContent =
            `@${user.username}`;

    });


    // ========================================
    // INITIALS
    // ========================================

    function getInitials(name) {

        if (!name) {
            return "S";
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
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();

    }

});
// ============================================
// SWAY - LOGOUT
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const logoutButton =
        document.getElementById("logout-button");

    if (!logoutButton) {
        return;
    }

    logoutButton.addEventListener("click", () => {

        // Remove saved login information
        localStorage.removeItem("sway_token");
        localStorage.removeItem("sway_user");

        // Go back to login page
        window.location.href =
            "./auth/login.html";

    });

});