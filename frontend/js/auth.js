// ============================================
// SWAY - Authentication JavaScript
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("🔥 Sway authentication loaded");

    // ========================================
    // INITIALIZE LUCIDE
    // ========================================

    if (window.lucide) {
        lucide.createIcons();
    }


    // ========================================
    // COMMON ELEMENTS
    // ========================================

    const authAlert =
        document.getElementById("auth-alert");

    const passwordToggle =
        document.getElementById("password-toggle");

    const passwordInput =
        document.getElementById("password");


    // ========================================
    // PASSWORD VISIBILITY
    // ========================================

    if (passwordToggle && passwordInput) {

        passwordToggle.addEventListener(
            "click",
            () => {

                const showingPassword =
                    passwordInput.type === "password";

                passwordInput.type =
                    showingPassword
                        ? "text"
                        : "password";


                passwordToggle.setAttribute(
                    "aria-label",
                    showingPassword
                        ? "Hide password"
                        : "Show password"
                );


                passwordToggle.innerHTML = `
                    <i data-lucide="${
                        showingPassword
                            ? "eye-off"
                            : "eye"
                    }"></i>
                `;


                if (window.lucide) {
                    lucide.createIcons();
                }

            }
        );

    }


    // ========================================
    // SHOW MESSAGE
    // ========================================

    function showMessage(
        message,
        type = "error"
    ) {

        if (!authAlert) {
            return;
        }

        authAlert.textContent = message;

        authAlert.classList.toggle(
            "success",
            type === "success"
        );

        authAlert.hidden = false;

    }


    // ========================================
    // HIDE MESSAGE
    // ========================================

    function hideMessage() {

        if (!authAlert) {
            return;
        }

        authAlert.hidden = true;

        authAlert.textContent = "";

        authAlert.classList.remove("success");

    }


    // ========================================
    // LOADING STATE
    // ========================================

    function setLoading(
        button,
        isLoading
    ) {

        if (!button) {
            return;
        }

        const buttonText =
            button.querySelector(".button-text");

        const buttonLoading =
            button.querySelector(".button-loading");


        button.disabled = isLoading;


        if (buttonText) {
            buttonText.hidden = isLoading;
        }

        if (buttonLoading) {
            buttonLoading.hidden = !isLoading;
        }

    }


    // ========================================
    // LOGIN
    // ========================================

    const loginForm =
        document.getElementById("login-form");


    if (loginForm) {

        const emailInput =
            document.getElementById("email");

        const loginPasswordInput =
            document.getElementById("password");

        const loginSubmit =
            document.getElementById("login-submit");


        loginForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                hideMessage();


                const email =
                    emailInput.value.trim();

                const password =
                    loginPasswordInput.value;


                // ----------------------------
                // VALIDATION
                // ----------------------------

                if (!email || !password) {

                    showMessage(
                        "Please enter your email and password."
                    );

                    return;

                }


                setLoading(
                    loginSubmit,
                    true
                );


                try {

                    // ------------------------
                    // LOGIN API
                    // ------------------------

                    const response =
                        await fetch(
                            "http://localhost:5000/api/auth/login",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    email,
                                    password
                                })
                            }
                        );


                    const data =
                        await response.json();


                    // ------------------------
                    // API ERROR
                    // ------------------------

                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Login failed"
                        );

                    }


                    // ------------------------
                    // SAVE JWT
                    // ------------------------

                    localStorage.setItem(
                        "sway_token",
                        data.token
                    );


                    // ------------------------
                    // SAVE USER
                    // ------------------------

                    localStorage.setItem(
                        "sway_user",
                        JSON.stringify(
                            data.user
                        )
                    );


                    // ------------------------
                    // SUCCESS
                    // ------------------------

                    showMessage(
                        "Login successful. Welcome back!",
                        "success"
                    );


                    // ------------------------
                    // REDIRECT
                    // ------------------------

                    setTimeout(() => {

                        window.location.href =
                            "../index.html";

                    }, 500);

                } catch (error) {

                    console.error(
                        "❌ Login error:",
                        error
                    );


                    showMessage(
                        error.message ||
                        "Unable to connect to Sway."
                    );

                } finally {

                    setLoading(
                        loginSubmit,
                        false
                    );

                }

            }
        );

    }


    // ========================================
    // REGISTER
    // ========================================

    const registerForm =
        document.getElementById("register-form");


    if (registerForm) {

        const nameInput =
            document.getElementById("name");

        const usernameInput =
            document.getElementById("username");

        const emailInput =
            document.getElementById("email");

        const registerPasswordInput =
            document.getElementById("password");

        const registerSubmit =
            document.getElementById("register-submit");


        registerForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                hideMessage();


                const name =
                    nameInput.value.trim();

                const username =
                    usernameInput.value.trim();

                const email =
                    emailInput.value.trim();

                const password =
                    registerPasswordInput.value;


                // ----------------------------
                // BASIC VALIDATION
                // ----------------------------

                if (
                    !name ||
                    !username ||
                    !email ||
                    !password
                ) {

                    showMessage(
                        "Please fill in all fields."
                    );

                    return;

                }


                // ----------------------------
                // NAME VALIDATION
                // ----------------------------

                if (name.length < 2) {

                    showMessage(
                        "Name must be at least 2 characters."
                    );

                    return;

                }


                // ----------------------------
                // USERNAME VALIDATION
                // ----------------------------

                if (username.length < 3) {

                    showMessage(
                        "Username must be at least 3 characters."
                    );

                    return;

                }


                // ----------------------------
                // PASSWORD VALIDATION
                // ----------------------------

                if (password.length < 6) {

                    showMessage(
                        "Password must be at least 6 characters."
                    );

                    return;

                }


                setLoading(
                    registerSubmit,
                    true
                );


                try {

                    // ------------------------
                    // REGISTER API
                    // ------------------------

                    const response =
                        await fetch(
                            "http://localhost:5000/api/auth/register",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    name,

                                    username,

                                    email,

                                    password

                                })
                            }
                        );


                    const data =
                        await response.json();


                    // ------------------------
                    // API ERROR
                    // ------------------------

                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Registration failed"
                        );

                    }


                    // ------------------------
                    // SUCCESS
                    // ------------------------

                    showMessage(
                        "Account created successfully!",
                        "success"
                    );


                    // ------------------------
                    // AUTO LOGIN
                    // ------------------------

                    /*
                     * Register endpoint intentionally
                     * does not return a JWT.
                     *
                     * So we redirect to login instead
                     * of automatically authenticating.
                     */

                    setTimeout(() => {

                        window.location.href =
                            "./login.html";

                    }, 800);


                } catch (error) {

                    console.error(
                        "❌ Registration error:",
                        error
                    );


                    showMessage(
                        error.message ||
                        "Unable to create your account."
                    );

                } finally {

                    setLoading(
                        registerSubmit,
                        false
                    );

                }

            }
        );

    }

});