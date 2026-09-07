// ============================================
// SWAY - Frontend Entry Point
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // INITIALIZE LUCIDE ICONS
    // ========================================

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }


    // ========================================
    // CREATE POST MODAL
    // ========================================

    const openPostModal =
        document.getElementById("open-post-modal");

    const mobileCreatePost =
        document.getElementById("mobile-create-post");

    const closePostModal =
        document.getElementById("close-post-modal");

    const postModal =
        document.getElementById("create-post-modal");

    const postTextarea =
        document.getElementById("post-content");


    function openCreatePostModal() {

        if (!postModal) return;

        postModal.classList.add("active");

        postModal.setAttribute(
            "aria-hidden",
            "false"
        );

        if (postTextarea) {
            postTextarea.focus();
        }

    }


    function closeCreatePostModal() {

        if (!postModal) return;

        postModal.classList.remove("active");

        postModal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (openPostModal) {

        openPostModal.addEventListener(
            "click",
            openCreatePostModal
        );

    }


    if (mobileCreatePost) {

        mobileCreatePost.addEventListener(
            "click",
            openCreatePostModal
        );

    }


    if (closePostModal) {

        closePostModal.addEventListener(
            "click",
            closeCreatePostModal
        );

    }


    if (postModal) {

        postModal.addEventListener(
            "click",
            (event) => {

                if (event.target === postModal) {

                    closeCreatePostModal();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                postModal &&
                postModal.classList.contains("active")
            ) {

                closeCreatePostModal();

            }

        }
    );


    // ========================================
    // FEED TABS
    // ========================================

    const feedTabs =
        document.querySelectorAll(".feed-tab");


    feedTabs.forEach((tab) => {

        tab.addEventListener(
            "click",
            () => {

                feedTabs.forEach((item) => {

                    item.classList.remove(
                        "active"
                    );

                    item.setAttribute(
                        "aria-selected",
                        "false"
                    );

                });


                tab.classList.add("active");

                tab.setAttribute(
                    "aria-selected",
                    "true"
                );

            }
        );

    });


    // ========================================
    // POST INTERACTIONS
    // ========================================

    const postActions =
        document.querySelectorAll(".post-action");


    postActions.forEach((action) => {

        action.addEventListener(
            "click",
            async (event) => {

                const actionType =
                    action.dataset.action;


                // ====================================
                // LIKE
                // ====================================

                if (actionType === "like") {

                    event.preventDefault();

                    await handleLike(action);

                    return;

                }


                // ====================================
                // COMMENT
                // ====================================

                if (actionType === "comment") {

                    action.classList.add(
                        "feedback"
                    );


                    setTimeout(() => {

                        action.classList.remove(
                            "feedback"
                        );

                    }, 700);


                    console.log(
                        "💬 Comment interaction triggered"
                    );

                    return;

                }


                // ====================================
                // SHARE
                // ====================================

                if (actionType === "share") {

                    action.classList.add(
                        "feedback"
                    );


                    const label =
                        action.querySelector("span");


                    if (!label) return;


                    const originalText =
                        label.textContent;


                    label.textContent =
                        "Shared ✓";


                    setTimeout(() => {

                        label.textContent =
                            originalText;

                        action.classList.remove(
                            "feedback"
                        );

                    }, 1200);

                }

            }
        );

    });


    // ========================================
    // LIKE HANDLER
    // ========================================

    async function handleLike(action) {

        // Prevent double clicks while request
        // is being processed.

        if (action.dataset.loading === "true") {

            return;

        }


        // ----------------------------------------
        // FIND POST ID
        // ----------------------------------------

        const postId =
            action.dataset.postId ||
            action.closest(".post")?.dataset.postId;


        if (!postId) {

            console.error(
                "❌ Like failed: Post ID not found"
            );

            return;

        }


        // ----------------------------------------
        // GET TOKEN
        // ----------------------------------------

        const token =
            localStorage.getItem("token");


        if (!token) {

            alert(
                "Please login to like this post."
            );

            return;

        }


        try {

            action.dataset.loading =
                "true";


            action.disabled =
                true;


            // ------------------------------------
            // CALL BACKEND
            // ------------------------------------

            const response =
                await fetch(
                    `http://localhost:5000/api/posts/${postId}/like`,
                    {

                        method: "POST",

                        headers: {

                            "Authorization":
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"

                        }

                    }
                );


            const data =
                await response.json();


            console.log(
                "❤️ Like response:",
                data
            );


            // ------------------------------------
            // ERROR
            // ------------------------------------

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to like post"
                );

            }


            // ------------------------------------
            // UPDATE LIKE STATE
            // ------------------------------------

            const isLiked =
                data.liked === true;


            action.classList.toggle(
                "active",
                isLiked
            );


            action.setAttribute(
                "aria-pressed",
                String(isLiked)
            );


            // ------------------------------------
            // UPDATE COUNT FROM SERVER
            // ------------------------------------

            const count =
                action.querySelector(
                    ".post-action-count"
                );


            if (count) {

                count.textContent =
                    data.likesCount;

            }


            // ------------------------------------
            // UPDATE HEART ICON
            // ------------------------------------

            const icon =
                action.querySelector(
                    ".post-action-icon"
                );


            if (icon) {

                icon.textContent =
                    isLiked
                        ? "♥"
                        : "♡";

            }


            // ------------------------------------
            // POP ANIMATION
            // ------------------------------------

            action.classList.remove(
                "pop"
            );


            void action.offsetWidth;


            action.classList.add(
                "pop"
            );


        } catch (error) {

            console.error(
                "❌ Like error:",
                error
            );


            alert(
                error.message ||
                "Server error while liking post"
            );

        } finally {

            action.dataset.loading =
                "false";

            action.disabled =
                false;

        }

    }


    // ========================================
    // COMMENTS
    // ========================================

    const commentAction =
        document.querySelector(
            '[data-action="comment"]'
        );


    const commentsSection =
        document.getElementById(
            "comments-section"
        );


    const commentInput =
        document.getElementById(
            "comment-input"
        );


    const commentSubmit =
        document.getElementById(
            "comment-submit"
        );


    const commentsList =
        document.getElementById(
            "comments-list"
        );


    if (commentAction) {

        commentAction.addEventListener(
            "click",
            () => {

                if (!commentsSection) {
                    return;
                }


                commentsSection.classList.toggle(
                    "active"
                );


                if (
                    commentsSection.classList.contains(
                        "active"
                    )
                ) {

                    if (commentInput) {

                        commentInput.focus();

                    }

                }

            }
        );

    }

// ========================================
// ADD COMMENT
// ========================================

async function addComment() {

    if (!commentInput || !commentsList) {
        return;
    }


    // ----------------------------------------
    // GET COMMENT TEXT
    // ----------------------------------------

    const text =
        commentInput.value.trim();


    if (!text) {

        commentInput.focus();

        return;

    }


    // ----------------------------------------
    // GET POST ID
    // ----------------------------------------

    const commentAction =
        document.querySelector(
            '[data-action="comment"]'
        );


    const postId =
        commentAction?.dataset.postId ||
        commentAction?.closest(".post")?.dataset.postId;


    if (!postId) {

        console.error(
            "❌ Comment failed: Post ID not found"
        );

        alert(
            "Unable to identify this post."
        );

        return;

    }


    // ----------------------------------------
    // GET TOKEN
    // ----------------------------------------

    const token =
        localStorage.getItem("token");


    if (!token) {

        alert(
            "Please login to comment."
        );

        return;

    }


    try {

        // ------------------------------------
        // DISABLE BUTTON
        // ------------------------------------

        if (commentSubmit) {

            commentSubmit.disabled =
                true;

        }


        // ------------------------------------
        // SEND COMMENT TO BACKEND
        // ------------------------------------

        const response =
            await fetch(
                `http://localhost:5000/api/comments/${postId}`,
                {

                    method: "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        content: text

                    })

                }
            );


        const data =
            await response.json();


        console.log(
            "💬 Comment response:",
            data
        );


        // ------------------------------------
        // HANDLE ERROR
        // ------------------------------------

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to add comment"
            );

        }


        // ------------------------------------
        // GET CREATED COMMENT
        // ------------------------------------

        const newComment =
            data.comment;


        // ------------------------------------
        // CREATE COMMENT ELEMENT
        // ------------------------------------

        const comment =
            document.createElement(
                "div"
            );


        comment.className =
            "comment";


        const author =
            newComment.author || {};


        const authorName =
            author.name ||
            "Sway User";


        const avatar =
            author.avatar ||
            authorName.charAt(0).toUpperCase();


        comment.innerHTML = `

            <div class="comment-avatar">
                ${escapeHtml(avatar)}
            </div>

            <div class="comment-content">

                <div class="comment-author">
                    ${escapeHtml(authorName)}
                </div>

                <div class="comment-text">
                    ${escapeHtml(
                        newComment.content
                    )}
                </div>

            </div>

        `;


        // ------------------------------------
        // ADD TO COMMENT LIST
        // ------------------------------------

        commentsList.appendChild(
            comment
        );


        // ------------------------------------
        // CLEAR INPUT
        // ------------------------------------

        commentInput.value = "";


        commentInput.focus();


        console.log(
            "✅ Comment added successfully"
        );


    } catch (error) {

        console.error(
            "❌ Comment error:",
            error
        );


        alert(
            error.message ||
            "Server error while adding comment"
        );


    } finally {

        if (commentSubmit) {

            commentSubmit.disabled =
                false;

        }

    }

}


    // ========================================
    // HTML ESCAPING
    // ========================================

    function escapeHtml(value) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            value;


        return div.innerHTML;

    }


    // ========================================
    // FRONTEND READY
    // ========================================

    console.log(
        "✨ Sway frontend loaded"
    );

});