// ============================================
// SWAY - EDIT PROFILE JAVASCRIPT
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "✏️ Sway Edit Profile JS loaded"
        );


        // ========================================
        // API
        // ========================================

        const API_BASE =
            "http://localhost:5000";


        // ========================================
        // ELEMENTS
        // ========================================

        const form =
            document.getElementById(
                "edit-profile-form"
            );

        const nameInput =
            document.getElementById(
                "name"
            );

        const usernameInput =
            document.getElementById(
                "username"
            );

        const bioInput =
            document.getElementById(
                "bio"
            );

        const avatarInput =
            document.getElementById(
                "avatar"
            );

        const saveButton =
            document.getElementById(
                "save-profile-button"
            );

        const message =
            document.getElementById(
                "profile-message"
            );


        // ========================================
        // TOKEN
        // ========================================

        function getToken() {

            return localStorage.getItem(
                "sway_token"
            );

        }


        // ========================================
        // AUTH ERROR
        // ========================================

        function handleAuthError() {

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

        }


        // ========================================
        // SHOW MESSAGE
        // ========================================

        function showMessage(
            text,
            type = "success"
        ) {

            if (!message) {
                return;
            }

            message.textContent =
                text;

            message.className =
                `profile-message ${type}`;

        }


        // ========================================
        // LOAD CURRENT PROFILE
        // ========================================

        async function loadProfile() {

            const token =
                getToken();


            if (!token) {

                alert(
                    "Please login to edit your profile."
                );

                window.location.href =
                    "./auth/login.html";

                return;

            }


            try {

                const response =
                    await fetch(
                        `${API_BASE}/api/users/profile/me`,
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


                console.log(
                    "👤 Current profile:",
                    data
                );


                // --------------------------------
                // AUTH ERROR
                // --------------------------------

                if (
                    response.status === 401
                ) {

                    handleAuthError();

                    return;

                }


                // --------------------------------
                // OTHER ERROR
                // --------------------------------

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to load profile."
                    );

                }


                if (!data.user) {

                    throw new Error(
                        "Profile data not found."
                    );

                }


                const user =
                    data.user;


                // --------------------------------
                // FILL FORM
                // --------------------------------

                nameInput.value =
                    user.name || "";


                usernameInput.value =
                    user.username || "";


                bioInput.value =
                    user.bio || "";


                avatarInput.value =
                    user.avatar || "";


                console.log(
                    "✅ Profile loaded into form"
                );

            } catch (error) {

                console.error(
                    "❌ Load profile error:",
                    error
                );

                showMessage(
                    error.message ||
                    "Unable to load profile.",
                    "error"
                );

            }

        }


        // ========================================
        // UPDATE PROFILE
        // ========================================

        async function updateProfile(
            event
        ) {

            event.preventDefault();


            const token =
                getToken();


            if (!token) {

                alert(
                    "Please login first."
                );

                window.location.href =
                    "./auth/login.html";

                return;

            }


            // --------------------------------
            // GET FORM VALUES
            // --------------------------------

            const name =
                nameInput.value.trim();

            const username =
                usernameInput.value.trim();

            const bio =
                bioInput.value.trim();

            const avatar =
                avatarInput.value.trim();


            // --------------------------------
            // BASIC VALIDATION
            // --------------------------------

            if (
                name.length < 2 ||
                name.length > 50
            ) {

                showMessage(
                    "Name must be between 2 and 50 characters.",
                    "error"
                );

                nameInput.focus();

                return;

            }


            if (
                username.length < 3 ||
                username.length > 30
            ) {

                showMessage(
                    "Username must be between 3 and 30 characters.",
                    "error"
                );

                usernameInput.focus();

                return;

            }


            if (
                bio.length > 160
            ) {

                showMessage(
                    "Bio cannot exceed 160 characters.",
                    "error"
                );

                bioInput.focus();

                return;

            }


            // --------------------------------
            // DISABLE BUTTON
            // --------------------------------

            saveButton.disabled =
                true;

            saveButton.textContent =
                "Saving...";


            showMessage(
                "Saving your profile...",
                "loading"
            );


            try {

                const response =
                    await fetch(
                        `${API_BASE}/api/users/profile/me`,
                        {

                            method: "PUT",

                            headers: {

                                "Authorization":
                                    `Bearer ${token}`,

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    name,

                                    username,

                                    bio,

                                    avatar

                                })

                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "✏️ Update profile response:",
                    data
                );


                // --------------------------------
                // AUTH ERROR
                // --------------------------------

                if (
                    response.status === 401
                ) {

                    handleAuthError();

                    return;

                }


                // --------------------------------
                // ERROR
                // --------------------------------

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to update profile."
                    );

                }


                // --------------------------------
                // UPDATE LOCAL USER
                // --------------------------------

                if (data.user) {

                    const currentUser =
                        localStorage.getItem(
                            "sway_user"
                        );


                    let storedUser = {};


                    try {

                        storedUser =
                            currentUser
                                ? JSON.parse(
                                    currentUser
                                )
                                : {};

                    } catch (error) {

                        storedUser = {};

                    }


                    const updatedUser = {

                        ...storedUser,

                        ...data.user

                    };


                    localStorage.setItem(

                        "sway_user",

                        JSON.stringify(
                            updatedUser
                        )

                    );

                }


                // --------------------------------
                // SUCCESS
                // --------------------------------

                showMessage(
                    "Profile updated successfully!",
                    "success"
                );


                console.log(
                    "✅ Profile updated successfully"
                );


                // --------------------------------
                // RETURN TO PROFILE
                // --------------------------------

                setTimeout(
                    () => {

                        window.location.href =
                            "./profile.html";

                    },
                    1000
                );


            } catch (error) {

                console.error(
                    "❌ Update profile error:",
                    error
                );


                showMessage(
                    error.message ||
                    "Unable to update profile.",
                    "error"
                );

            } finally {

                saveButton.disabled =
                    false;

                saveButton.textContent =
                    "Save Changes";

            }

        }


        // ========================================
        // FORM SUBMIT
        // ========================================

        if (form) {

            form.addEventListener(
                "submit",
                updateProfile
            );

        }


        // ========================================
        // INITIAL LOAD
        // ========================================

        loadProfile();


        console.log(
            "✨ Edit Profile initialized successfully"
        );

    }
);