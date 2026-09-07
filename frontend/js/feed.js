// ============================================
// SWAY - FEED JAVASCRIPT
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("🔥 Sway Feed JS loaded");


    // ============================================
    // API
    // ============================================

    const API_BASE = "http://localhost:5000";


    // ============================================
    // BASIC ELEMENTS
    // ============================================

    const feed =
        document.querySelector(".feed");

    const postContent =
        document.getElementById("post-content");

    const createPostButton =
        document.getElementById("create-post-button");

    const createPostModal =
        document.getElementById("create-post-modal");

    const openPostModal =
        document.getElementById("open-post-modal");

    const closePostModal =
        document.getElementById("close-post-modal");

    const mobileCreatePost =
        document.getElementById("mobile-create-post");


    // ============================================
    // IMAGE ELEMENTS
    // ============================================

    let postImageInput =
        document.getElementById("post-image");

    const postImagePreview =
        document.getElementById("post-image-preview");

    const postPreviewImage =
        document.getElementById("post-preview-image");

    const removePostImageButton =
        document.getElementById("remove-post-image");


    // ============================================
    // PHOTO BUTTON
    // ============================================

    let photoUploadButton =
        document.getElementById("photo-upload-button");


    if (!photoUploadButton) {

        photoUploadButton =
            document.getElementById(
                "composer-photo-button"
            );

    }


    // ============================================
    // CREATE IMAGE INPUT IF MISSING
    // ============================================

    if (!postImageInput) {

        postImageInput =
            document.createElement("input");

        postImageInput.type = "file";

        postImageInput.id = "post-image";

        postImageInput.name = "image";

        postImageInput.accept =
            "image/jpeg,image/png,image/webp,image/gif";

        postImageInput.style.display = "none";

        document.body.appendChild(
            postImageInput
        );

    }


    // ============================================
    // CHECK FEED
    // ============================================

    if (!feed) {

        console.error(
            "❌ .feed element not found."
        );

        return;

    }


    // ============================================
    // TOKEN
    // ============================================

    function getToken() {

        return localStorage.getItem(
            "sway_token"
        );

    }


    // ============================================
    // AUTH ERROR
    // ============================================

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


    // ============================================
    // CURRENT USER
    // ============================================

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


    // ============================================
    // CHECK IF USER LIKED POST
    // ============================================

    function hasCurrentUserLiked(post) {

        const currentUserId =
            getCurrentUserId();

        if (!currentUserId) {

            return false;

        }

        if (!Array.isArray(post.likes)) {

            return false;

        }

        return post.likes.some(
            like => {

                if (
                    like &&
                    typeof like === "object"
                ) {

                    const likeId =
                        like._id ||
                        like.id;

                    return (
                        likeId &&
                        String(likeId) ===
                        String(currentUserId)
                    );

                }

                return (
                    String(like) ===
                    String(currentUserId)
                );

            }
        );

    }


    // ============================================
    // NORMALIZE IMAGE URL
    // ============================================

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
            imageUrl.startsWith("http://") ||
            imageUrl.startsWith("https://")
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
            imageUrl.startsWith("uploads/")
        ) {

            return (
                API_BASE +
                "/" +
                imageUrl
            );

        }


        // uploads\image.jpg

        if (
            imageUrl.startsWith("uploads\\")
        ) {

            return (
                API_BASE +
                "/" +
                imageUrl.replace(/\\/g, "/")
            );

        }


        // filename only

        return (
            API_BASE +
            "/uploads/" +
            imageUrl
        );

    }


    // ============================================
    // OPEN MODAL
    // ============================================

    function openModal() {

        if (!createPostModal) {

            return;

        }

        createPostModal.classList.add(
            "active"
        );

        createPostModal.setAttribute(
            "aria-hidden",
            "false"
        );

        setTimeout(
            () => {

                if (postContent) {

                    postContent.focus();

                }

            },
            100
        );

    }


    // ============================================
    // CLOSE MODAL
    // ============================================

    function closeModal() {

        if (!createPostModal) {

            return;

        }

        createPostModal.classList.remove(
            "active"
        );

        createPostModal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    // ============================================
    // OPEN MODAL BUTTONS
    // ============================================

    if (openPostModal) {

        openPostModal.addEventListener(
            "click",
            openModal
        );

    }


    if (mobileCreatePost) {

        mobileCreatePost.addEventListener(
            "click",
            openModal
        );

    }


    // ============================================
    // CLOSE MODAL
    // ============================================

    if (closePostModal) {

        closePostModal.addEventListener(
            "click",
            closeModal
        );

    }


    // ============================================
    // CLICK OUTSIDE MODAL
    // ============================================

    if (createPostModal) {

        createPostModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    createPostModal
                ) {

                    closeModal();

                }

            }
        );

    }


    // ============================================
    // ESCAPE
    // ============================================

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                createPostModal &&
                createPostModal.classList.contains(
                    "active"
                )
            ) {

                closeModal();

            }

        }
    );


    // ============================================
    // PHOTO BUTTON
    // ============================================

    if (photoUploadButton) {

        photoUploadButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                postImageInput.click();

            }
        );

    }


    // ============================================
    // IMAGE SELECTED
    // ============================================

    postImageInput.addEventListener(
        "change",
        () => {

            const file =
                postImageInput.files &&
                postImageInput.files[0];


            if (!file) {

                return;

            }


            const allowedTypes = [

                "image/jpeg",
                "image/png",
                "image/webp",
                "image/gif"

            ];


            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {

                alert(
                    "Please select a JPG, PNG, WEBP or GIF image."
                );

                postImageInput.value = "";

                return;

            }


            const maxSize =
                5 * 1024 * 1024;


            if (
                file.size > maxSize
            ) {

                alert(
                    "Image size cannot exceed 5 MB."
                );

                postImageInput.value = "";

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                event => {

                    if (postPreviewImage) {

                        postPreviewImage.src =
                            event.target.result;

                    }

                    if (postImagePreview) {

                        postImagePreview.style.display =
                            "block";

                    }

                };


            reader.readAsDataURL(
                file
            );


            updatePostButtonState();

        }
    );


    // ============================================
    // REMOVE IMAGE
    // ============================================

    if (removePostImageButton) {

        removePostImageButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                postImageInput.value = "";


                if (postPreviewImage) {

                    postPreviewImage.src = "";

                }


                if (postImagePreview) {

                    postImagePreview.style.display =
                        "none";

                }


                updatePostButtonState();

            }
        );

    }


    // ============================================
    // UPDATE POST BUTTON
    // ============================================

    function updatePostButtonState() {

        const hasText =
            postContent &&
            postContent.value.trim().length > 0;


        const hasImage =
            postImageInput &&
            postImageInput.files &&
            postImageInput.files.length > 0;


        if (createPostButton) {

            createPostButton.disabled =
                !hasText && !hasImage;

        }

    }


    // ============================================
    // TEXT INPUT
    // ============================================

    if (postContent) {

        postContent.addEventListener(
            "input",
            updatePostButtonState
        );

    }


    // ============================================
    // CREATE POST BUTTON
    // ============================================

    if (createPostButton) {

        createPostButton.addEventListener(
            "click",
            createPost
        );

    }


    // ============================================
    // CREATE POST
    // ============================================

    async function createPost() {

        const content =
            postContent
                ? postContent.value.trim()
                : "";


        const hasImage =
            postImageInput &&
            postImageInput.files &&
            postImageInput.files.length > 0;


        if (
            !content &&
            !hasImage
        ) {

            alert(
                "Please write something or select an image."
            );

            return;

        }


        const token =
            getToken();


        if (!token) {

            alert(
                "Please login to create a post."
            );

            window.location.href =
                "./auth/login.html";

            return;

        }


        if (
            createPostButton &&
            createPostButton.dataset.posting ===
            "true"
        ) {

            return;

        }


        if (createPostButton) {

            createPostButton.dataset.posting =
                "true";

            createPostButton.disabled =
                true;

            createPostButton.textContent =
                "Posting...";

        }


        try {

            const formData =
                new FormData();


            formData.append(
                "content",
                content
            );


            if (hasImage) {

                formData.append(
                    "image",
                    postImageInput.files[0]
                );

            }


            const response =
                await fetch(
                    `${API_BASE}/api/posts`,
                    {

                        method: "POST",

                        headers: {

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body: formData

                    }
                );


            let data = {};

            try {

                data =
                    await response.json();

            } catch (error) {

                console.error(
                    "❌ Invalid server response"
                );

            }


            if (
                response.status === 401
            ) {

                handleAuthError();

                return;

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to create post."
                );

            }


            // Clear form

            if (postContent) {

                postContent.value = "";

            }


            postImageInput.value = "";


            if (postPreviewImage) {

                postPreviewImage.src = "";

            }


            if (postImagePreview) {

                postImagePreview.style.display =
                    "none";

            }


            closeModal();


            await loadPosts();


            console.log(
                "✅ Post created successfully"
            );


        } catch (error) {

            console.error(
                "❌ Create post error:",
                error
            );


            alert(
                error.message ||
                "Unable to create post."
            );


        } finally {

            if (createPostButton) {

                createPostButton.dataset.posting =
                    "false";

                createPostButton.textContent =
                    "Post";

                createPostButton.disabled =
                    false;

                updatePostButtonState();

            }

        }

    }


    // ============================================
    // LOAD POSTS
    // ============================================

    async function loadPosts() {

        console.log(
            "📡 Loading posts..."
        );


        try {

            const response =
                await fetch(
                    `${API_BASE}/api/posts`
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to load posts."
                );

            }


            const posts =
                Array.isArray(data.posts)
                    ? data.posts
                    : [];


            renderPosts(posts);


        } catch (error) {

            console.error(
                "❌ Feed error:",
                error
            );


            showFeedError();

        }

    }


    // ============================================
    // RENDER POSTS
    // ============================================

    function renderPosts(posts) {

        // Remove old generated posts

        const oldPosts =
            feed.querySelectorAll(
                ".sway-post"
            );


        oldPosts.forEach(
            post => {

                if (
                    !post.classList.contains(
                        "composer"
                    )
                ) {

                    post.remove();

                }

            }
        );


        // Remove old empty state

        const oldEmpty =
            feed.querySelector(
                ".feed-empty-state"
            );


        if (oldEmpty) {

            oldEmpty.remove();

        }


        const oldError =
            feed.querySelector(
                ".feed-error"
            );


        if (oldError) {

            oldError.remove();

        }


        const composer =
            feed.querySelector(
                ".composer"
            );


        // ========================================
        // EMPTY FEED
        // ========================================

        if (!posts.length) {

            const empty =
                document.createElement(
                    "article"
                );


            empty.className =
                "card sway-post feed-empty-state";


            empty.innerHTML = `

                <div class="feed-empty-content">

                    <h2>
                        Your feed is empty
                    </h2>

                    <p>
                        Be the first to share
                        something with the
                        Sway community.
                    </p>

                </div>

            `;


            if (composer) {

                composer.after(empty);

            } else {

                feed.appendChild(empty);

            }


            return;

        }


        // ========================================
        // CREATE ALL POSTS
        // ========================================

        const fragment =
            document.createDocumentFragment();


        posts.forEach(
            post => {

                if (
                    post &&
                    post._id
                ) {

                    fragment.appendChild(
                        createPostElement(post)
                    );

                }

            }
        );


        if (composer) {

            composer.after(fragment);

        } else {

            feed.appendChild(fragment);

        }

    }


    // ============================================
    // CREATE POST ELEMENT
    // ============================================

    function createPostElement(post) {

        const article =
            document.createElement(
                "article"
            );


        article.className =
            "card sway-post";


        article.dataset.postId =
            post._id;


        // ========================================
        // AUTHOR
        // ========================================

        const author =
            post.author || {};
        const currentUserId =
    getCurrentUserId();

const postAuthorId =
    author._id ||
    author.id ||
    null;

const isOwnPost =
    currentUserId &&
    postAuthorId &&
    String(currentUserId) ===
    String(postAuthorId);


        const name =
            author.name ||
            "Sway User";


        const username =
            author.username ||
            "user";


        const initials =
            getInitials(name);


        const time =
            formatTime(
                post.createdAt
            );


        // ========================================
        // CONTENT
        // ========================================

        const content =
            escapeHTML(
                post.content || ""
            );


        // ========================================
        // LIKES
        // ========================================

        const likesCount =
            Array.isArray(post.likes)
                ? post.likes.length
                : Number(
                    post.likesCount || 0
                );


        const isLiked =
            hasCurrentUserLiked(post);


        // ========================================
        // COMMENTS
        // ========================================

        const commentsCount =
            Number(
                post.commentsCount || 0
            );


        // ========================================
        // IMAGE
        // ========================================

        const rawImageUrl =
            post.imageUrl ||
            post.image ||
            post.photo ||
            post.mediaUrl ||
            "";


        const imageUrl =
            getImageUrl(
                rawImageUrl
            );


        let imageHTML = "";


        if (imageUrl) {

            imageHTML = `

                <div class="post-image-container">

                    <img
                        src="${escapeHTML(imageUrl)}"
                        alt="Post image"
                        class="post-image"
                        loading="lazy"
                        onerror="this.parentElement.style.display='none';"
                    >

                </div>

            `;

        }


        // ========================================
        // POST HTML
        // ========================================

        article.innerHTML = `

            <div class="post-inner">


               <div
    class="post-author"
    data-user-id="${escapeHTML(author._id || "")}"
    style="cursor: pointer;"
>

    <div class="avatar">
        ${escapeHTML(initials)}
    </div>

    <div class="post-author-info">

        <strong class="post-author-name">
            ${escapeHTML(name)}
        </strong>

        <div class="text-muted">
            @${escapeHTML(username)}
            <span class="post-dot">·</span>
            ${time}
        </div>

    </div>

</div>


                <!-- TEXT -->

                ${
                    content
                        ? `
                            <p class="post-content-text">

                                ${content}

                            </p>
                        `
                        : ""
                }


                <!-- IMAGE -->

                ${imageHTML}


                <!-- =====================================
                     SINGLE ACTION ROW
                     ===================================== -->

                <div class="post-actions">


                    <!-- LIKE -->

                    <button
                        type="button"
                        class="post-action-button post-like-button${isLiked ? " active" : ""}"
                        data-post-id="${escapeHTML(post._id)}"
                        aria-pressed="${isLiked}"
                    >

                        <span class="action-count like-count">

                            ${likesCount}

                        </span>

                        <span class="action-label">

                            Like

                        </span>

                    </button>


                    <!-- COMMENT -->

                    <button
                        type="button"
                        class="post-action-button post-comment-button"
                    >

                        <span class="action-count comment-count">

                            ${commentsCount}

                        </span>

                        <span class="action-label">

                            Comment

                        </span>

                    </button>


                    <!-- SHARE -->

                    <button
                        type="button"
                        class="post-action-button post-share-button"
                    >

                        <span class="action-label">

                            Share

                        </span>

                    </button>
               ${
    isOwnPost
        ? `
            <button
                type="button"
                class="post-action-button post-delete-button"
                data-post-id="${escapeHTML(post._id)}"
            >
                <span class="action-label">
                    Delete
                </span>
            </button>
        `
        : ""
}

                </div>


                <!-- COMMENTS -->

                <div class="post-comments">


                    <div class="comments-list">

                    </div>


                    <div class="comment-input-row">

                        <input
                            type="text"
                            class="comment-input"
                            placeholder="Write a comment..."
                            maxlength="280"
                        >


                        <button
                            type="button"
                            class="comment-submit-button"
                        >

                            Comment

                        </button>

                    </div>


                </div>


            </div>

        `;


        return article;

    }
// ============================================
// OPEN USER PROFILE
// ============================================

document.addEventListener("click", event => {

    const authorElement =
        event.target.closest(".post-author");

    if (!authorElement) {
        return;
    }

    const userId =
        authorElement.dataset.userId;

    if (!userId) {
        return;
    }

    window.location.href =
        `./profile.html?id=${encodeURIComponent(userId)}`;

});

    // ============================================
    // LIKE / COMMENT / SHARE CLICK HANDLER
    // ============================================

    document.addEventListener(
        "click",
        async event => {


            // LIKE

            const likeButton =
                event.target.closest(
                    ".post-like-button"
                );


            if (likeButton) {

                await handleLike(
                    likeButton
                );

                return;

            }


            // COMMENT TOGGLE

            const commentButton =
                event.target.closest(
                    ".post-comment-button"
                );


            if (commentButton) {

                handleCommentToggle(
                    commentButton
                );

                return;

            }


            // COMMENT SUBMIT

            const submitButton =
                event.target.closest(
                    ".comment-submit-button"
                );


            if (submitButton) {

                await handleCommentSubmit(
                    submitButton
                );

                return;

            }


            // SHARE

            const shareButton =
                event.target.closest(
                    ".post-share-button"
                );


            if (shareButton) {

                await handleShare(
                    shareButton
                );

            }
            // DELETE

const deleteButton =
    event.target.closest(
        ".post-delete-button"
    );

if (deleteButton) {

    await handleDeletePost(
        deleteButton
    );

    return;

}

        }
    );


    // ============================================
    // LIKE POST
    // ============================================

    async function handleLike(likeButton) {

        const postId =
            likeButton.dataset.postId;


        if (!postId) {

            return;

        }


        const token =
            getToken();


        if (!token) {

            alert(
                "Please login to like a post."
            );

            return;

        }


        if (likeButton.disabled) {

            return;

        }


        likeButton.disabled =
            true;


        try {

            const response =
                await fetch(
                    `${API_BASE}/api/posts/${postId}/like`,
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


            if (
                response.status === 401
            ) {

                handleAuthError();

                return;

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to like post."
                );

            }


            const likesCount =
                typeof data.likesCount === "number"
                    ? data.likesCount
                    : data.post &&
                      Array.isArray(data.post.likes)
                        ? data.post.likes.length
                        : 0;


            const isLiked =
                data.liked === true;


            const countElement =
                likeButton.querySelector(
                    ".like-count"
                );


            if (countElement) {

                countElement.textContent =
                    likesCount;

            }


            likeButton.classList.toggle(
                "active",
                isLiked
            );


            likeButton.setAttribute(
                "aria-pressed",
                String(isLiked)
            );


        } catch (error) {

            console.error(
                "❌ Like error:",
                error
            );


            alert(
                error.message ||
                "Unable to like post."
            );


        } finally {

            likeButton.disabled =
                false;

        }

    }


    // ============================================
    // COMMENT TOGGLE
    // ============================================

    function handleCommentToggle(
        commentButton
    ) {

        const postElement =
            commentButton.closest(
                ".sway-post"
            );


        if (!postElement) {

            return;

        }


        const commentSection =
            postElement.querySelector(
                ".post-comments"
            );


        if (!commentSection) {

            return;

        }


        const isOpen =
            commentSection.classList.contains(
                "open"
            );


        if (isOpen) {

            commentSection.classList.remove(
                "open"
            );

            return;

        }


        commentSection.classList.add(
            "open"
        );


        const input =
            commentSection.querySelector(
                ".comment-input"
            );


        if (input) {

            input.focus();

        }


        loadComments(
            postElement.dataset.postId,
            postElement
        );

    }


    // ============================================
    // LOAD COMMENTS
    // ============================================

    async function loadComments(
        postId,
        postElement
    ) {

        if (
            !postId ||
            !postElement
        ) {

            return;

        }


        const commentsList =
            postElement.querySelector(
                ".comments-list"
            );


        if (!commentsList) {

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_BASE}/api/comments/${postId}`
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to load comments."
                );

            }


            const comments =
                Array.isArray(data.comments)
                    ? data.comments
                    : [];


            commentsList.innerHTML = "";


            comments.forEach(
                comment => {

                    commentsList.appendChild(
                        createCommentElement(
                            comment
                        )
                    );

                }
            );


            const countElement =
                postElement.querySelector(
                    ".comment-count"
                );


            if (countElement) {

                countElement.textContent =
                    comments.length;

            }


        } catch (error) {

            console.error(
                "❌ Comment loading error:",
                error
            );

        }

    }


    // ============================================
    // CREATE COMMENT ELEMENT
    // ============================================

    function createCommentElement(
        comment
    ) {

        const element =
            document.createElement(
                "div"
            );


        element.className =
            "comment";


        const author =
            comment.author || {};


        const authorName =
            author.name ||
            "Sway User";


        const username =
            author.username ||
            "user";


        const avatar =
            getInitials(
                authorName
            );


        const content =
            comment.content ||
            "";


        element.innerHTML = `

            <div class="comment-avatar">

                ${escapeHTML(avatar)}

            </div>


            <div class="comment-content">

                <strong>

                    ${escapeHTML(authorName)}

                </strong>


                <div class="comment-username">

                    @${escapeHTML(username)}

                </div>


                <div class="comment-text">

                    ${escapeHTML(content)}

                </div>

            </div>

        `;


        return element;

    }


    // ============================================
    // ADD COMMENT
    // ============================================

    async function handleCommentSubmit(
        submitButton
    ) {

        const postElement =
            submitButton.closest(
                ".sway-post"
            );


        if (!postElement) {

            return;

        }


        const postId =
            postElement.dataset.postId;


        const input =
            postElement.querySelector(
                ".comment-input"
            );


        const commentsList =
            postElement.querySelector(
                ".comments-list"
            );


        if (
            !postId ||
            !input ||
            !commentsList
        ) {

            return;

        }


        const content =
            input.value.trim();


        if (!content) {

            input.focus();

            return;

        }


        const token =
            getToken();


        if (!token) {

            alert(
                "Please login to comment."
            );

            return;

        }


        if (submitButton.disabled) {

            return;

        }


        submitButton.disabled =
            true;

        submitButton.textContent =
            "Posting...";


        try {

            const response =
                await fetch(
                    `${API_BASE}/api/comments/${postId}`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            content:
                                content

                        })

                    }
                );


            const data =
                await response.json();


            if (
                response.status === 401
            ) {

                handleAuthError();

                return;

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to add comment."
                );

            }


            if (!data.comment) {

                throw new Error(
                    "Server did not return the comment."
                );

            }


            commentsList.appendChild(
                createCommentElement(
                    data.comment
                )
            );


            const countElement =
                postElement.querySelector(
                    ".comment-count"
                );


            if (countElement) {

                const currentCount =
                    Number(
                        countElement.textContent
                    ) || 0;


                countElement.textContent =
                    currentCount + 1;

            }


            input.value = "";

            input.focus();


        } catch (error) {

            console.error(
                "❌ Comment error:",
                error
            );


            alert(
                error.message ||
                "Unable to add comment."
            );


        } finally {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "Comment";

        }

    }


    // ============================================
    // ENTER KEY FOR COMMENTS
    // ============================================

    document.addEventListener(
        "keydown",
        async event => {

            if (
                event.key !== "Enter" ||
                event.shiftKey
            ) {

                return;

            }


            const input =
                event.target.closest(
                    ".comment-input"
                );


            if (!input) {

                return;

            }


            event.preventDefault();


            const postElement =
                input.closest(
                    ".sway-post"
                );


            if (!postElement) {

                return;

            }


            const submitButton =
                postElement.querySelector(
                    ".comment-submit-button"
                );


            if (submitButton) {

                await handleCommentSubmit(
                    submitButton
                );

            }

        }
    );


    // ============================================
    // SHARE
    // ============================================

    async function handleShare(
        shareButton
    ) {

        const postElement =
            shareButton.closest(
                ".sway-post"
            );


        if (!postElement) {

            return;

        }


        const postId =
            postElement.dataset.postId;


        if (!postId) {

            return;

        }


        const shareUrl =
            `${window.location.origin}` +
            `${window.location.pathname}` +
            `?post=${postId}`;


        try {

            await navigator.clipboard.writeText(
                shareUrl
            );


            const originalText =
                shareButton.innerHTML;


            shareButton.innerHTML =
                `<span class="action-label">Copied!</span>`;


            setTimeout(
                () => {

                    shareButton.innerHTML =
                        originalText;

                },
                1200
            );


        } catch (error) {

            console.error(
                "❌ Share error:",
                error
            );


            window.prompt(
                "Copy this post link:",
                shareUrl
            );

        }

    }

// ============================================
// DELETE POST
// ============================================

async function handleDeletePost(
    deleteButton
) {

    const postElement =
        deleteButton.closest(
            ".sway-post"
        );

    if (!postElement) {

        return;

    }


    const postId =
        deleteButton.dataset.postId;

    if (!postId) {

        return;

    }


    const token =
        getToken();

    if (!token) {

        alert(
            "Please login to delete a post."
        );

        return;

    }


    // ========================================
    // CONFIRM DELETE
    // ========================================

    const confirmed =
        confirm(
            "Are you sure you want to delete this post?"
        );

    if (!confirmed) {

        return;

    }


    // ========================================
    // DISABLE BUTTON
    // ========================================

    deleteButton.disabled =
        true;

    deleteButton.querySelector(
        ".action-label"
    ).textContent =
        "Deleting...";


    try {

        const response =
            await fetch(
                `${API_BASE}/api/posts/${postId}`,
                {

                    method: "DELETE",

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
                "Unable to delete post."
            );

        }


        // ====================================
        // REMOVE FROM FEED
        // ====================================

        postElement.remove();


        console.log(
            "🗑️ Post deleted successfully"
        );


    } catch (error) {

        console.error(
            "❌ Delete post error:",
            error
        );


        alert(
            error.message ||
            "Unable to delete post."
        );


        deleteButton.disabled =
            false;

        deleteButton.querySelector(
            ".action-label"
        ).textContent =
            "Delete";

    }

}
    // ============================================
    // GET INITIALS
    // ============================================

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

            parts[0].charAt(0) +

            parts[
                parts.length - 1
            ].charAt(0)

        ).toUpperCase();

    }


    // ============================================
    // FORMAT TIME
    // ============================================

    function formatTime(
        dateValue
    ) {

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


    // ============================================
    // ESCAPE HTML
    // ============================================

    function escapeHTML(value) {

        return String(value)

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


    // ============================================
    // FEED ERROR
    // ============================================

    function showFeedError() {

        const existing =
            feed.querySelector(
                ".feed-error"
            );


        if (existing) {

            return;

        }


        const errorElement =
            document.createElement(
                "article"
            );


        errorElement.className =
            "card sway-post feed-error";


        errorElement.innerHTML = `

            <div class="feed-empty-content">

                <h2>
                    Unable to load feed
                </h2>

                <p>
                    Please make sure the
                    Sway server is running.
                </p>

            </div>

        `;


        feed.appendChild(
            errorElement
        );

    }


    // ============================================
    // INITIAL BUTTON STATE
    // ============================================

    updatePostButtonState();


    // ============================================
    // INITIAL LOAD
    // ============================================

    loadPosts();


    console.log(
        "✨ Sway feed initialized successfully"
    );

});