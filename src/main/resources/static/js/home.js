const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const searchBox = document.querySelector(".search-box");
const searchBtn = document.getElementById("searchBtn");

if (searchInput && clearSearch && searchBox) {
    searchInput.addEventListener("input", function () {
        searchBox.classList.toggle("has-text", searchInput.value.trim() !== "");
    });

    clearSearch.addEventListener("click", function () {
        searchInput.value = "";
        searchBox.classList.remove("has-text");
        searchInput.focus();
    });
}
 
 const shopMenu = document.querySelector(".shop-menu");
const shopLink = document.querySelector(".shop-link");

if (shopMenu && shopLink) {

    shopLink.addEventListener("click", function (event) {
        event.preventDefault();
        shopMenu.classList.toggle("active");
    });

    document.addEventListener("click", function (event) {
        if (!shopMenu.contains(event.target)) {
            shopMenu.classList.remove("active");
        }
    });

}

const slides = document.querySelectorAll(".slide");
const next = document.querySelector(".right");
const prev = document.querySelector(".left");

let index = 0;

function showSlide(i){

    slides.forEach(slide=>{
        slide.classList.remove("active");
    });

    slides[i].classList.add("active");

}

next.addEventListener("click",()=>{

    index++;

    if(index >= slides.length){

        index = 0;

    }

    showSlide(index);

});

prev.addEventListener("click",()=>{

    index--;

    if(index < 0){

        index = slides.length-1;

    }

    showSlide(index);

});

/* Auto Slide */

setInterval(()=>{

    index++;

    if(index >= slides.length){

        index = 0;

    }

    showSlide(index);

},4000);

//about

const img1=document.querySelector(".img1");
const img2=document.querySelector(".img2");

let swap=false;

setInterval(()=>{

    if(!swap){

        img1.style.left="180px";
        img1.style.top="130px";
        img1.style.zIndex="1";

        img2.style.left="0px";
        img2.style.top="20px";
        img2.style.zIndex="2";

    }
    else{

        img1.style.left="0px";
        img1.style.top="20px";
        img1.style.zIndex="2";

        img2.style.left="180px";
        img2.style.top="130px";
        img2.style.zIndex="1";

    }

    swap=!swap;

},2500);

//ingredients

const slider = document.querySelector(".ingredients-slider");

const cards = document.querySelectorAll(".ingredient-card");

cards.forEach(card=>{
    slider.appendChild(card.cloneNode(true));
});

let current = 0;

function slide(){

    current++;

    slider.style.transition = "transform .8s ease";

    slider.style.transform = `translateX(-${current * 50}%)`;

    if(current >= cards.length){

        setTimeout(()=>{

            slider.style.transition = "none";

            slider.style.transform = "translateX(0)";

            current = 0;

        },800);

    }

}

setInterval(slide,3000);

// ===============================
// CATEGORY SLIDER
// ===============================

const categorySlider = document.querySelector(".category");
const categoryCards = document.querySelectorAll(".category .cat");
const categoryPrev = document.querySelector(".category-container .left");
const categoryNext = document.querySelector(".category-container .right");
const categoryWrapper = document.querySelector(".category-wrapper");

let categoryIndex = 0;
let categoryAutoSlide;
let touchStartX = 0;

function getVisibleCards() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    if (window.innerWidth <= 1200) return 3;
    return 4;
}

function getCardWidth() {
    const firstCard = categoryCards[0];
    const gap = 30;

    return firstCard.offsetWidth + gap;
}

function updateCategorySlider() {
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, categoryCards.length - visibleCards);

    if (categoryIndex > maxIndex) {
        categoryIndex = 0;
    }

    categorySlider.style.transform =
        `translateX(-${categoryIndex * getCardWidth()}px)`;
}

function categoryNextSlide() {
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, categoryCards.length - visibleCards);

    categoryIndex++;

    if (categoryIndex > maxIndex) {
        categoryIndex = 0;
    }

    updateCategorySlider();
}

function categoryPrevSlide() {
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, categoryCards.length - visibleCards);

    categoryIndex--;

    if (categoryIndex < 0) {
        categoryIndex = maxIndex;
    }

    updateCategorySlider();
}

categoryNext.addEventListener("click", function (event) {
    event.stopPropagation();
    categoryNextSlide();
});

categoryPrev.addEventListener("click", function (event) {
    event.stopPropagation();
    categoryPrevSlide();
});

function startCategoryAutoSlide() {
    clearInterval(categoryAutoSlide);
    categoryAutoSlide = setInterval(categoryNextSlide, 3000);
}

categoryWrapper.addEventListener("mouseenter", function () {
    clearInterval(categoryAutoSlide);
});

categoryWrapper.addEventListener("mouseleave", function () {
    startCategoryAutoSlide();
});

categoryWrapper.addEventListener("touchstart", function (event) {
    touchStartX = event.touches[0].clientX;
});

categoryWrapper.addEventListener("touchend", function (event) {
    const touchEndX = event.changedTouches[0].clientX;

    if (touchStartX - touchEndX > 50) {
        categoryNextSlide();
    } else if (touchEndX - touchStartX > 50) {
        categoryPrevSlide();
    }
});

window.addEventListener("resize", function () {
    updateCategorySlider();
});

document.querySelectorAll(".category .image-box").forEach(function (box) {
    box.addEventListener("click", function (event) {
        event.stopPropagation();
        box.classList.toggle("flip");
    });
});

document.querySelectorAll(".category .shop").forEach(function(button){

    button.addEventListener("click", function(){

        if(button.classList.contains("loading")){
            return;
        }

        button.classList.add("loading");

        setTimeout(function(){

            button.classList.remove("loading");

        }, 2000);

    });

});

updateCategorySlider();
startCategoryAutoSlide();

// ===============================
// Flip Images
// ===============================

const imageBoxes=document.querySelectorAll(".image-box");

imageBoxes.forEach(box=>{

    box.addEventListener("click",()=>{

        box.classList.toggle("flip");

    });

});

// ===============================
// Swipe Support
// ===============================

let startX=0;

slider.addEventListener("touchstart",(e)=>{

    startX=e.touches[0].clientX;

});

slider.addEventListener("touchend",(e)=>{

    let endX=e.changedTouches[0].clientX;

    if(startX-endX>50){

        nextSlide();

    }

    else if(endX-startX>50){

        prevSlide();

    }

});

document.querySelectorAll(".image-box").forEach(box=>{

box.onclick=()=>{

box.classList.toggle("flip");

};

});

//Beauty Promise

document.addEventListener("DOMContentLoaded", function () {
    const featureButtons = document.querySelectorAll(".beauty-feature");

    /* Remove old classes if they exist */
    featureButtons.forEach(function (button) {
        button.classList.remove("active");
        button.classList.remove("show");
    });

    /* Start automatically after page opens */
    setTimeout(function () {
        featureButtons.forEach(function (button) {
            button.classList.add("show");
        });
    }, 300);
});

//Feedback

document.addEventListener("DOMContentLoaded", function () {
    const feedbackCards = document.querySelectorAll(".feedback1");
    const feedbackLeft = document.querySelector(".feedback-left");
    const feedbackRight = document.querySelector(".feedback-right");

    let feedbackIndex = 0;
    let feedbackTimer;

    function showFeedback(index) {
        feedbackCards.forEach(function (card, cardIndex) {
            card.classList.remove("active");

            if (cardIndex === index) {
                card.classList.add("active");
            }
        });
    }

    function nextFeedback() {
        feedbackIndex++;

        if (feedbackIndex >= feedbackCards.length) {
            feedbackIndex = 0;
        }

        showFeedback(feedbackIndex);
        restartFeedbackTimer();
    }

    function previousFeedback() {
        feedbackIndex--;

        if (feedbackIndex < 0) {
            feedbackIndex = feedbackCards.length - 1;
        }

        showFeedback(feedbackIndex);
        restartFeedbackTimer();
    }

    function restartFeedbackTimer() {
        clearInterval(feedbackTimer);
        feedbackTimer = setInterval(function () {
            feedbackIndex++;

            if (feedbackIndex >= feedbackCards.length) {
                feedbackIndex = 0;
            }

            showFeedback(feedbackIndex);
        }, 30000);
    }

    feedbackRight.addEventListener("click", nextFeedback);
    feedbackLeft.addEventListener("click", previousFeedback);

    showFeedback(feedbackIndex);
    restartFeedbackTimer();
});

//Join

const registerButton = document.querySelector(".register");

registerButton.addEventListener("click", function (event) {
    event.preventDefault();

    registerButton.classList.remove("loading");

    void registerButton.offsetWidth;

    registerButton.classList.add("loading");

    setTimeout(function () {
        registerButton.classList.remove("loading");
    }, 2200);
});

//Flash Sale

const flashBanner = document.querySelector(".flash1");

for (let i = 0; i < 22; i++) {
    const sparkle = document.createElement("span");

    sparkle.classList.add("sparkle");

    sparkle.style.left = Math.random() * 95 + "%";
    sparkle.style.top = Math.random() * 85 + "%";

    sparkle.style.animationDelay = Math.random() * 3 + "s";
    sparkle.style.animationDuration = 1.8 + Math.random() * 2 + "s";

    flashBanner.appendChild(sparkle);
}

/* Button click animation */
const shopButton = document.querySelector(".shop-now");

shopButton.addEventListener("click", function () {
    shopButton.classList.remove("loading");

    void shopButton.offsetWidth;

    shopButton.classList.add("loading");

    setTimeout(function () {
        shopButton.classList.remove("loading");
    }, 1400);
});

async function performSearch(){

    const keyword = searchInput.value.trim();

    if(keyword==="") return;

    const response = await fetch(
    `http://localhost:8080/products/search?keyword=${encodeURIComponent(keyword)}`
);

    const products = await response.json();

    if(products.length===0){

        alert("No products found");
        return;

    }

    localStorage.setItem(
        "searchResults",
        JSON.stringify(products)
    );

    window.location.href="/html/search.html";

}

if (searchInput && searchBtn) {

    searchBtn.addEventListener("click", performSearch);

    searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            performSearch();
        }
    });

}

// ==========================================
// JOIN THE INNER CIRCLE - SUBSCRIBE
// ==========================================

const registerBtn = document.querySelector("#registerBtn");
const emailInput = document.querySelector("#subscriberEmail");

if (registerBtn && emailInput) {

    registerBtn.addEventListener("click", async () => {

        const email = emailInput.value.trim();

        if (!email) {
            alert("Please enter your email.");
            return;
        }

        try {

            const response = await fetch("/api/subscribers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email
                })
            });

            const message = await response.text();

            console.log("Backend response:", message);

            if (response.ok) {

                alert("Subscribed Successfully!");

                emailInput.value = "";

            } else if (response.status === 409) {

                alert("This email is already subscribed.");

            } else {

                alert("Unable to subscribe. Please try again.");

            }

        } catch (error) {

            console.error("Subscriber error:", error);

            alert("Unable to subscribe. Please try again.");
        }
    });
}

// ======================================================
// FEATURED PRODUCTS
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    loadFeaturedProducts();

});


// ======================================================
// LOAD FEATURED PRODUCTS FROM ALL 6 CATEGORIES
// ======================================================

async function loadFeaturedProducts() {

    const featuredContainer = document.getElementById("featuredProducts");

    if (!featuredContainer) {
        return;
    }

    const categories = [
        "Eye Makeup",
        "Fragrance",
        "Hair Care",
        "Lipsticks",
        "Nails",
        "Skincare"
    ];

    try {

        featuredContainer.innerHTML = `
            <div class="featured-loading">
                <p>Loading featured products...</p>
            </div>
        `;

        // Fetch products from all six categories
        const categoryRequests = categories.map(category =>
            fetch(`/products/category/${encodeURIComponent(category)}`)
                .then(response => {

                    if (!response.ok) {
                        throw new Error(
                            `Failed to load ${category} products`
                        );
                    }

                    return response.json();

                })
                .then(products => ({
                    category: category,
                    products: products
                }))
        );

        const categoryResults = await Promise.all(categoryRequests);

        // ------------------------------------------------
        // Select ONE product from each category
        // ------------------------------------------------

        const featuredProducts = [];

        categoryResults.forEach(result => {

            if (result.products && result.products.length > 0) {

                const product = result.products[0];

                featuredProducts.push({
                    ...product,
                    featuredCategory: result.category
                });

            }

        });

        // ------------------------------------------------
        // Check whether products are available
        // ------------------------------------------------

        if (featuredProducts.length === 0) {

            featuredContainer.innerHTML = `
                <div class="featured-loading">
                    <p>No featured products available.</p>
                </div>
            `;

            return;
        }

        // ------------------------------------------------
        // Display products
        // ------------------------------------------------

        featuredContainer.innerHTML = "";

        featuredProducts.forEach(product => {

            const productCard = createFeaturedProductCard(product);

            featuredContainer.insertAdjacentHTML(
                "beforeend",
                productCard
            );

        });

        // Activate cart and wishlist buttons
        addFeaturedProductEvents();

    } catch (error) {

        console.error(
            "Error loading featured products:",
            error
        );

        featuredContainer.innerHTML = `
            <div class="featured-loading">
                <p>Unable to load featured products.</p>
            </div>
        `;
    }
}


// ======================================================
// CREATE FEATURED PRODUCT CARD
// ======================================================

function createFeaturedProductCard(product) {

    const productName = product.name || "Product";

    const brand = product.brand || "";

    const description =
        product.description ||
        "Premium beauty product from Glowify.";

    const price = Number(product.price || 0);

    const discount = Number(product.discount || 0);

    const image =
        product.image ||
        "/html/Cosmetics website/logo.png";

    const category =
        product.featuredCategory ||
        product.category ||
        "";

    // Calculate discounted price
    let finalPrice = price;

    if (discount > 0) {
    finalPrice = Math.round(
        price - (price * discount / 100)
    );
}

    return `
        <div class="cart"
             data-product-id="${product.id || ""}"
             data-category="${category}"
             data-price="${finalPrice}">

            <img
                src="${image}"
                alt="${product.alt || productName}"
                onerror="this.src='/html/Cosmetics website/logo.png'"
            >

            <span class="featured-category">
                ${category}
            </span>

            <h4>${brand ? brand + " - " : ""}${productName}</h4>

            <p>${description}</p>

            <p class="featured-price">
                
            <p class="featured-price"> ₹${finalPrice.toFixed(0)} </p>

            <div class="cart-footer">

                <button
                    class="cart-button featured-cart-button"
                    data-id="${product.id || ""}"
                    data-name="${escapeHtml(productName)}"
                    data-price="${finalPrice}"
                    data-image="${escapeHtml(image)}"
                    data-category="${escapeHtml(category)}">

                    Add to cart

                </button>

                <button
                    class="wishlist featured-wishlist-button"
                    data-id="${product.id || ""}"
                    data-name="${escapeHtml(productName)}"
                    data-price="${finalPrice}"
                    data-image="${escapeHtml(image)}"
                    data-category="${escapeHtml(category)}">

                    ♡

                </button>

            </div>

        </div>
    `;
}


// ======================================================
// CART + WISHLIST EVENTS
// ======================================================

function addFeaturedProductEvents() {

   // -----------------------------
// ADD TO CART
// -----------------------------

const cartButtons =
    document.querySelectorAll(
        ".featured-cart-button"
    );

cartButtons.forEach(button => {

    button.addEventListener("click", async function () {

        const userId =
            localStorage.getItem("userId");

        if (!userId) {

            alert("Please login to add products to cart.");

            window.location.href =
                "/html/login.html";

            return;
        }

        const productName =
            this.dataset.name;

        const price =
            Number(this.dataset.price);

        const image =
            this.dataset.image;

        try {

            const response = await fetch(
                "/api/cart",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        productName: productName,

                        price: price,

                        image: image,

                        userId: Number(userId)

                    })
                }
            );

            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Cart API Error:",
                    response.status,
                    errorText
                );

                throw new Error(
                    "Unable to add product to cart"
                );
            }

            alert(
                `${productName} added to cart`
            );

        } catch (error) {

            console.error(
                "Cart error:",
                error
            );

            alert(
                "Unable to add product to cart."
            );
        }

    });

});


    // -----------------------------
    // WISHLIST
    // -----------------------------

    const wishlistButtons =
        document.querySelectorAll(
            ".featured-wishlist-button"
        );

    wishlistButtons.forEach(button => {

        button.addEventListener("click", async function () {

            const userId =
                localStorage.getItem("userId");

            if (!userId) {

                alert("Please login to add products to wishlist.");

                window.location.href =
                    "/html/login.html";

                return;
            }

            const productName =
                this.dataset.name;

            const price =
                Number(this.dataset.price);

            const image =
                this.dataset.image;

            try {

                const response = await fetch(
                    "/wishlist",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            productName: productName,

                            price: price,

                            image: image,

                            userId: Number(userId)

                        })
                    }
                );

                if (!response.ok) {

                    throw new Error(
                        "Unable to add to wishlist"
                    );

                }

                this.innerHTML = "♥";

                alert(
                    `${productName} added to wishlist`
                );

            } catch (error) {

                console.error(
                    "Wishlist error:",
                    error
                );

                alert(
                    "Unable to add product to wishlist."
                );
            }

        });

    });

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

