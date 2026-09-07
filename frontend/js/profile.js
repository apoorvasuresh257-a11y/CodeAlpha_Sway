// ============================================
// SWAY - PROFILE JAVASCRIPT
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "👤 Sway Profile JS loaded"
        );


        // ========================================
        // API
        // ========================================

        const API_BASE =
            "http://localhost:5000";


        // ========================================
        // ELEMENTS
        // ========================================

        const profileAvatar =
            document.getElementById(
                "profile-avatar"
            );

        const profileName =
            document.getElementById(
                "profile-name"
            );

        const profileUsername =
            document.getElementById(
                "profile-username"
            );

        const profileBio =
            document.getElementById(
                "profile-bio"
            );

        const followButton =
            document.getElementById(
                "follow-button"
            );

        const followersCount =
            document.getElementById(
                "followers-count"
            );

        const followingCount =
            document.getElementById(
                "following-count"
            );

        const postsCount =
            document.getElementById(
                "posts-count"
            );

        const profilePosts =
            document.getElementById(
                "profile-posts"
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
        // CURRENT USER ID
        // ========================================

        function getCurrentUserId() {

            try {

                const storedUser =
                    localStorage.getItem(
                        "sway_user"
                    );

                if (!storedUser) {

                    return null;

                }

                const user =
                    JSON.parse(
                        storedUser
                    );

                return (
                    user._id ||
                    user.id ||
                    user.userId ||
                    null
                );

            } catch (error) {

                console.error(
                    "❌ Unable to read current user:",
                    error
                );

                return null;

            }

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


            if (
                parts.length === 1
            ) {

                return parts[0]
                    .charAt(0)
                    .toUpperCase();

            }


            return (

                parts[0]
                    .charAt(0)
                    .toUpperCase()

                +

                parts[
                    parts.length - 1
                ]
                    .charAt(0)
                    .toUpperCase()

            );

        }


        // ========================================
        // IMAGE URL
        // ========================================

        function getImageUrl(imageUrl) {

            if (!imageUrl) {

                return "";

            }


            imageUrl =
                String(imageUrl).trim();


            if (!imageUrl) {

                return "";

            }


            // Full URL

            if (
                imageUrl.startsWith(
                    "http://"
                ) ||
                imageUrl.startsWith(
                    "https://"
                )
            ) {

                return imageUrl;

            }


            // /uploads/image.jpg

            if (
                imageUrl.startsWith("/")
            ) {

                return (
                    API_BASE +
                    imageUrl
                );

            }


            // uploads/image.jpg

            if (
                imageUrl.startsWith(
                    "uploads/"
                )
            ) {

                return (
                    API_BASE +
                    "/" +
                    imageUrl
                );

            }


            // uploads\image.jpg

            if (
                imageUrl.startsWith(
                    "uploads\\"
                )
            ) {

                return (
                    API_BASE +
                    "/" +
                    imageUrl.replace(
                        /\\/g,
                        "/"
                    )
                );

            }


            // Filename only

            return (
                API_BASE +
                "/uploads/" +
                imageUrl
            );

        }


        // ========================================
        // ESCAPE HTML
        // ========================================

        function escapeHTML(value) {

            return String(
                value || ""
            )
                .replace(
                    /&/g,
                    "&amp;"
                )
                .replace(
                    /</g,
                    "&lt;"
                )
                .replace(
                    />/g,
                    "&gt;"
                )
                .replace(
                    /"/g,
                    "&quot;"
                )
                .replace(
                    /'/g,
                    "&#039;"
                );

        }


        // ========================================
        // FORMAT TIME
        // ========================================

        function formatTime(dateValue) {

            if (!dateValue) {

                return "just now";

            }


            const date =
                new Date(
                    dateValue
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return "just now";

            }


            const seconds =
                Math.floor(
                    (
                        Date.now() -
                        date.getTime()
                    ) / 1000
                );


            if (
                seconds < 60
            ) {

                return "just now";

            }


            const minutes =
                Math.floor(
                    seconds / 60
                );


            if (
                minutes < 60
            ) {

                return `${minutes}m`;

            }


            const hours =
                Math.floor(
                    minutes / 60
                );


            if (
                hours < 24
            ) {

                return `${hours}h`;

            }


            const days =
                Math.floor(
                    hours / 24
                );


            if (
                days < 7
            ) {

                return `${days}d`;

            }


            return date.toLocaleDateString();

        }


        // ========================================
        // GET PROFILE ID FROM URL
        // ========================================

        function getProfileUserId() {

            const urlParams =
                new URLSearchParams(
                    window.location.search
                );

            return urlParams.get(
                "id"
            );

        }


function updateFollowButton(
    user,
    profileUserId
) {

    const editProfileButton =
        document.getElementById(
            "edit-profile-button"
        );


    // ========================================
    // MY PROFILE
    // ========================================

    if (!profileUserId) {

        if (followButton) {

            followButton.style.display =
                "none";

        }

        if (editProfileButton) {

            editProfileButton.style.display =
                "inline-flex";

        }

        return;

    }


    // ========================================
    // OTHER USER PROFILE
    // ========================================

    if (editProfileButton) {

        editProfileButton.style.display =
            "none";

    }


    if (!followButton) {

        return;

    }


    followButton.style.display =
        "inline-flex";


    const isFollowing =
        user.isFollowing === true;


    followButton.textContent =
        isFollowing
            ? "Following"
            : "Follow";


    followButton.classList.toggle(
        "following",
        isFollowing
    );


    followButton.setAttribute(
        "aria-pressed",
        String(isFollowing)
    );

}


        // ========================================
        // LOAD PROFILE
        // ========================================

        async function loadProfile() {

            const token =
                getToken();


            if (!token) {

                alert(
                    "Please login to view your profile."
                );

                window.location.href =
                    "./auth/login.html";

                return;

            }


            const profileUserId =
                getProfileUserId();

            const editProfileButton =
    document.getElementById("edit-profile-button");

if (editProfileButton) {
    editProfileButton.style.display =
        profileUserId
            ? "none"
            : "inline-flex";
}
            try {

                let response;


                // ====================================
                // MY PROFILE
                // ====================================

                if (!profileUserId) {

                    response =
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

                }


                // ====================================
                // OTHER USER PROFILE
                // ====================================

                else {

                    response =
                        await fetch(
                            `${API_BASE}/api/users/${profileUserId}`,
                            {

                                method: "GET",

                                headers: {

                                    "Authorization":
                                        `Bearer ${token}`

                                }

                            }
                        );

                }


                const data =
                    await response.json();


                console.log(
                    "👤 Profile response:",
                    data
                );


                // ====================================
                // AUTH ERROR
                // ====================================

                if (
                    response.status === 401
                ) {

                    handleAuthError();

                    return;

                }


                // ====================================
                // OTHER ERROR
                // ====================================

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


                // ====================================
                // PROFILE INFORMATION
                // ====================================

                profileName.textContent =
                    user.name ||
                    "Sway User";


                profileUsername.textContent =
                    user.username
                        ? `@${user.username}`
                        : "@user";


                profileBio.textContent =
                    user.bio ||
                    "No bio yet.";


                // ====================================
                // FOLLOW BUTTON
                // ====================================

                updateFollowButton(
                    user,
                    profileUserId
                );


                // ====================================
                // FOLLOWER / FOLLOWING COUNT
                // ====================================

                followersCount.textContent =
                    user.followersCount || 0;


                followingCount.textContent =
                    user.followingCount || 0;


                // ====================================
                // PROFILE AVATAR
                // ====================================

                if (user.avatar) {

                    const avatarUrl =
                        getImageUrl(
                            user.avatar
                        );


                    profileAvatar.innerHTML = `

                        <img
                            src="${escapeHTML(avatarUrl)}"
                            alt="Profile avatar"
                        >

                    `;

                } else {

                    profileAvatar.textContent =
                        getInitials(
                            user.name
                        );

                }


                // ====================================
                // LOAD POSTS
                // ====================================

                await loadPosts(
                    user._id
                );


            } catch (error) {

                console.error(
                    "❌ Profile error:",
                    error
                );


                profileName.textContent =
                    "Unable to load profile";


                profilePosts.innerHTML = `

                    <div class="profile-error">

                        Unable to load profile.

                    </div>

                `;

            }

        }


        // ========================================
        // FOLLOW / UNFOLLOW USER
        // ========================================

        async function toggleFollowUser() {

            const token =
                getToken();


            if (!token) {

                alert(
                    "Please login first."
                );

                return;

            }


            const profileUserId =
                getProfileUserId();


            if (!profileUserId) {

                alert(
                    "User ID not found."
                );

                return;

            }


            if (
                followButton.disabled
            ) {

                return;

            }


            try {

                followButton.disabled =
                    true;


                followButton.textContent =
                    "Please wait...";


                const response =
                    await fetch(
                        `${API_BASE}/api/users/${profileUserId}/follow`,
                        {

                            method: "POST",

                            headers: {

                                "Authorization":
                                    `Bearer ${token}`

                            }

                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "👥 Follow response:",
                    data
                );


                // ====================================
                // AUTH ERROR
                // ====================================

                if (
                    response.status === 401
                ) {

                    handleAuthError();

                    return;

                }


                // ====================================
                // API ERROR
                // ====================================

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to update follow status."
                    );

                }


                // ====================================
                // UPDATE BUTTON
                // ====================================

                const isFollowing =
                    data.following === true;


                followButton.textContent =
                    isFollowing
                        ? "Following"
                        : "Follow";


                followButton.classList.toggle(
                    "following",
                    isFollowing
                );


                followButton.setAttribute(
                    "aria-pressed",
                    String(isFollowing)
                );


                // ====================================
                // UPDATE FOLLOWER COUNT
                // ====================================

                followersCount.textContent =
                    typeof data.followersCount ===
                    "number"
                        ? data.followersCount
                        : 0;


                console.log(
                    "✅ Follow status updated"
                );


            } catch (error) {

                console.error(
                    "❌ Follow error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to update follow status."
                );


                // Reload profile button state

                await loadProfile();


            } finally {

                if (followButton) {

                    followButton.disabled =
                        false;

                }

            }

        }


        // ========================================
        // FOLLOW BUTTON CLICK
        // ========================================

        if (followButton) {

            followButton.addEventListener(
                "click",
                toggleFollowUser
            );

        }


        // ========================================
        // LOAD USER POSTS
        // ========================================

        async function loadPosts(
            userId
        ) {

            const token =
                getToken();


            if (!userId) {

                profilePosts.innerHTML = `

                    <div class="profile-error">

                        Unable to find user posts.

                    </div>

                `;

                return;

            }


            try {

                const response =
                    await fetch(
                        `${API_BASE}/api/users/${userId}/posts`,
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
                    "📝 User posts response:",
                    data
                );


                // ====================================
                // AUTH ERROR
                // ====================================

                if (
                    response.status === 401
                ) {

                    handleAuthError();

                    return;

                }


                // ====================================
                // API ERROR
                // ====================================

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to load posts."
                    );

                }


                const posts =
                    Array.isArray(
                        data.posts
                    )
                        ? data.posts
                        : [];


                // ====================================
                // POSTS COUNT
                // ====================================

                postsCount.textContent =
                    posts.length;


                // ====================================
                // NO POSTS
                // ====================================

                if (
                    posts.length === 0
                ) {

                    profilePosts.innerHTML = `

                        <div class="profile-empty">

                            <i
                                data-lucide="file-text"
                            ></i>

                            <h3>
                                No posts yet
                            </h3>

                            <p>
                                ${
                                    getProfileUserId()
                                        ? "This user has not posted anything yet."
                                        : "Your posts will appear here."
                                }
                            </p>

                        </div>

                    `;


                    if (
                        typeof lucide !==
                        "undefined"
                    ) {

                        lucide.createIcons();

                    }


                    return;

                }


                // ====================================
                // RENDER POSTS
                // ====================================

                profilePosts.innerHTML =
                    posts
                        .map(
                            createPostHTML
                        )
                        .join("");


            } catch (error) {

                console.error(
                    "❌ Posts error:",
                    error
                );


                profilePosts.innerHTML = `

                    <div class="profile-error">

                        Unable to load posts.

                    </div>

                `;

            }

        }


        // ========================================
        // CREATE POST HTML
        // ========================================

        function createPostHTML(
            post
        ) {

            const author =
                post.author || {};


            const name =
                author.name ||
                "Sway User";


            const username =
                author.username ||
                "user";


            const initials =
                getInitials(
                    name
                );


            const content =
                post.content || "";


            const image =
                getImageUrl(
                    post.image ||
                    post.imageUrl ||
                    post.photo ||
                    post.mediaUrl
                );


            return `

                <article class="card profile-post">


                    <!-- POST HEADER -->

                    <div class="profile-post-header">


                        <div class="profile-post-avatar">

                            ${escapeHTML(initials)}

                        </div>


                        <div class="profile-post-author">

                            <strong>

                                ${escapeHTML(name)}

                            </strong>


                            <span>

                                @${escapeHTML(username)}

                                ·

                                ${escapeHTML(
                                    formatTime(
                                        post.createdAt
                                    )
                                )}

                            </span>

                        </div>


                    </div>


                    <!-- POST CONTENT -->

                    ${
                        content
                            ? `

                                <div class="profile-post-content">

                                    ${escapeHTML(content)}

                                </div>

                              `
                            : ""
                    }


                    <!-- POST IMAGE -->

                    ${
                        image
                            ? `

                                <div class="profile-post-image">

                                    <img
                                        src="${escapeHTML(image)}"
                                        alt="Post image"
                                        loading="lazy"
                                        onerror="this.parentElement.style.display='none';"
                                    >

                                </div>

                              `
                            : ""
                    }


                </article>

            `;

        }


        // ========================================
        // INITIAL LOAD
        // ========================================

        loadProfile();


        console.log(
            "✨ Profile initialized successfully"
        );

    }
);