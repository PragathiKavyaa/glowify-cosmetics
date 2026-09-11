// ============================================
// AUTHENTICATION + NAVBAR
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("AUTH.JS LOADED");

    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");

    console.log("userId:", userId);
    console.log("userName:", userName);

    const loggedIn =
        userId &&
        userId !== "null" &&
        userId !== "undefined";


    // ============================================
    // USERNAME IN NAVBAR
    // ============================================

    const userLink = document.getElementById("userLink");
    const navbarUsername =
        document.getElementById("navbarUsername");

    if (loggedIn) {

        console.log("User is logged in");

        if (navbarUsername) {
            navbarUsername.textContent = userName || "Account";
        }

        if (userLink) {
            userLink.href = "#";
        }

    } else {

        console.log("User is NOT logged in");

        if (navbarUsername) {
            navbarUsername.textContent = "";
        }

        if (userLink) {
            userLink.href = "/html/login.html";
        }
    }


    // ============================================
    // NAVBAR LINKS
    // ============================================

    const navLinks =
        document.querySelectorAll(".nav-links a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const href = link.getAttribute("href");

            // Shop only opens dropdown
            if (link.classList.contains("shop-link")) {
                return;
            }

            // Empty links
            if (!href || href === "#") {
                return;
            }

            // Login and register are always allowed
            if (
                href.includes("login.html") ||
                href.includes("register.html")
            ) {
                return;
            }

            // Not logged in
            if (!loggedIn) {

                event.preventDefault();

                alert("Please login first to continue.");

                window.location.href =
                    "/html/login.html";
            }

        });

    });


    // ============================================
    // SHOP CATEGORY LINKS
    // ============================================

    const categoryLinks =
        document.querySelectorAll(".shop-dropdown a");

    categoryLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            if (!loggedIn) {

                event.preventDefault();

                event.stopPropagation();

                alert("Please login first to access products.");

                window.location.href =
                    "/html/login.html";
            }

        });

    });


    // ============================================
    // CART
    // ============================================

    const cartLink =
        document.querySelector(
            '.icons a[href*="cart.html"]'
        );

    if (cartLink) {

        cartLink.addEventListener("click", function (event) {

            if (!loggedIn) {

                event.preventDefault();

                alert("Please login first to access your cart.");

                window.location.href =
                    "/html/login.html";
            }

        });

    }


    // ============================================
    // WISHLIST
    // ============================================

    const wishlistLink =
        document.querySelector(
            '.icons a[href*="wishlist.html"]'
        );

    if (wishlistLink) {

        wishlistLink.addEventListener("click", function (event) {

            if (!loggedIn) {

                event.preventDefault();

                alert("Please login first to access your wishlist.");

                window.location.href =
                    "/html/login.html";
            }

        });

    }


    // ============================================
    // USER ICON
    // ============================================

    if (userLink) {

        userLink.addEventListener("click", function (event) {

            if (loggedIn) {
                event.preventDefault();
                console.log("Logged in as:", userName);
            }

        });

    }

});

document.addEventListener("DOMContentLoaded", function () {

    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");

    const userLink = document.getElementById("userLink");
    const navbarUsername = document.getElementById("navbarUsername");

    // =====================================
    // USER IS LOGGED IN
    // =====================================

    if (userId && userName) {

        // Display username
        if (navbarUsername) {
            navbarUsername.textContent = userName;
        }

        // Change user icon to logged-in style
        const userIcon = document.querySelector(".user-icon i");

        if (userIcon) {
            userIcon.classList.remove("fa-regular");
            userIcon.classList.remove("fa-user");

            userIcon.classList.add("fa-solid");
            userIcon.classList.add("fa-user");
        }

        // =====================================
        // LOGOUT WHEN USERNAME / ICON CLICKED
        // =====================================

        if (userLink) {

            userLink.href = "#";

            userLink.addEventListener("click", function (event) {

                event.preventDefault();

                const confirmLogout = confirm(
                    "Are you sure you want to logout?"
                );

                if (confirmLogout) {

                    // Remove login information
                    localStorage.removeItem("userId");
                    localStorage.removeItem("userName");
                    localStorage.removeItem("userEmail");

                    // Optional: remove other user session data
                    // localStorage.removeItem("cart");
                    // localStorage.removeItem("wishlist");

                    alert("Logged out successfully!");

                    // Redirect to login page
                    window.location.href = "/html/login.html";
                }

            });

        }

    }

    // =====================================
    // USER IS NOT LOGGED IN
    // =====================================

    else {

        if (navbarUsername) {
            navbarUsername.textContent = "";
        }

        if (userLink) {

            userLink.href = "/html/login.html";

        }

    }

});