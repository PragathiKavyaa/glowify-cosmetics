//Shop Menu

const shopMenu = document.querySelector(".shop-menu");
const shopLink = document.querySelector(".shop-link");

if (shopMenu && shopLink) {

    shopLink.addEventListener("click", function (e) {
        e.preventDefault();
        shopMenu.classList.toggle("active");
    });

    document.addEventListener("click", function (e) {
        if (!shopMenu.contains(e.target)) {
            shopMenu.classList.remove("active");
        }
    });

}

//Filter Heading

const filterHeadings = document.querySelectorAll(".filter-heading");

filterHeadings.forEach(heading => {

    heading.addEventListener("click", function () {

        this.parentElement.classList.toggle("closed");

    });

});

//Sort

const sortBtn = document.getElementById("sortBtn");
const sortMenu = document.getElementById("sortMenu");

if (sortBtn && sortMenu) {

    sortBtn.addEventListener("click", function (e) {

        e.stopPropagation();

        sortMenu.classList.toggle("show");

    });

    document.addEventListener("click", function () {

        sortMenu.classList.remove("show");

    });

}

const productsGrid = document.querySelector(".products-grid");

document.querySelectorAll("#sortMenu a").forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        const type = this.dataset.sort;

        const cards = Array.from(document.querySelectorAll(".product-card"));

        if (type === "low-high") {

            cards.sort((a, b) => a.dataset.price - b.dataset.price);

        }

        else if (type === "high-low") {

            cards.sort((a, b) => b.dataset.price - a.dataset.price);

        }

        else if (type === "rating") {

            cards.sort((a, b) => b.dataset.rating - a.dataset.rating);

        }

        else if (type === "offers") {

            cards.sort((a, b) => b.dataset.offer - a.dataset.offer);

        }

        cards.forEach(card => productsGrid.appendChild(card));

        sortMenu.classList.remove("show");

    });

});

//Apply Filters

// Filter

const filterCheckboxes = document.querySelectorAll(".filter-options input");

filterCheckboxes.forEach(box => {
    box.addEventListener("change", applyFilters);
});

function applyFilters() {

    const cards = document.querySelectorAll(".product-card");

    const brands = [...document.querySelectorAll('[data-filter="brand"]:checked')]
        .map(i => i.value);

    const colors = [...document.querySelectorAll('[data-filter="color"]:checked')]
        .map(i => i.value);

    const discounts = [...document.querySelectorAll('[data-filter="discount"]:checked')]
        .map(i => i.value);

    const prices = [...document.querySelectorAll('[data-filter="price"]:checked')]
        .map(i => i.value);

    cards.forEach(card => {

        let show = true;

        // Brand
        if (brands.length && !brands.includes(card.dataset.brand)) {
            show = false;
        }

        // Color
        if (colors.length && !colors.includes(card.dataset.color)) {
            show = false;
        }

        // Discount
        if (discounts.length && !discounts.includes(card.dataset.discount)) {
            show = false;
        }

        // Price
        if (prices.length) {

            const price = Number(card.dataset.price);

            let match = false;

            prices.forEach(range => {

                if (range === "0-500" && price < 500)
                    match = true;

                if (range === "500-1000" && price >= 500 && price <= 1000)
                    match = true;

                if (range === "1000-2000" && price > 1000 && price <= 2000)
                    match = true;

                if (range === "2000-3000" && price > 2000 && price <= 3000)
                    match = true;

                if (range === "3000+" && price > 3000)
                    match = true;
            });

            if (!match)
                show = false;
        }

        card.style.display = show ? "block" : "none";

    });

}

//Add to cart

async function addToCart(productId, name, image, price) {

    const userId = localStorage.getItem("userId");

    console.log("Logged User ID:", userId);
    console.log("Product ID:", productId);

    if (!userId) {
        alert("Please login first.");
        return;
    }

    if (!productId) {
        alert("Product ID is missing.");
        console.error("Product ID is missing:", productId);
        return;
    }

    const cart = {
        productId: Number(productId),
        productName: name,
        image: image,
        price: price,
        quantity: 1,
        userId: Number(userId)
    };

    console.log("Cart data being sent:", cart);

    try {

        const response = await fetch("/api/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cart)
        });

        if (response.ok) {

            alert("Added to Cart");

        } else {

            const errorText = await response.text();

            console.error("Backend error:", errorText);

            alert("Failed to add Cart");
        }

    } catch (error) {

        console.error("Add to cart error:", error);

        alert("Failed to add Cart");
    }
}

//Add to wishlist

async function addToWishlist(name, image, price) {

    const wishlist = {

        productName: name,

        image: image,

        price: price,

        userId: 1

    };

    const response = await fetch("/wishlist", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(wishlist)

    });

    if (response.ok) {

        alert("Added to Wishlist ❤️");

    }

    else {

        alert("Failed to add Wishlist");

    }

}

async function loadProducts() {

    const category = document.body.dataset.category;

    const response = await fetch(
        `/products/category/${encodeURIComponent(category)}`
    );

    if (!response.ok) {
        console.error("Failed to load products");
        return;
    }

    const products = await response.json();

    console.log("Category:", category);
    console.log("Products received:", products);

    const container = document.getElementById("products");

    if (!container) {
        console.error("Element with id='products' not found");
        return;
    }

    container.innerHTML = "";

    products.forEach(product => {

        container.innerHTML += `
        <div class="product-card"
            data-price="${product.price}"
            data-rating="${product.rating ?? 0}"
            data-brand="${product.brand}"
            data-discount="${product.discount ?? 0}"
            data-color="${product.color ?? ''}"
            data-offer="${product.discount ?? 0}">

            <span class="badge">${product.badge ?? ""}</span>

            <img src="${product.image}"
                 alt="${product.alt ?? product.name}">

            <h3>${product.name}</h3>

            <p>${product.description ?? ""}</p>

            <p class="rating">
                ⭐ ${product.rating ?? 0}
                (${product.reviewCount ?? 0} Reviews)
            </p>

            <p class="price">
                Price: ₹${product.price}
            </p>

            <div class="product-actions">

                <button class="cart-button"
                    onclick="addToCart(
                        ${product.id},
                        '${product.name}',
                        '${product.image}',
                        ${product.price}
                    )">
                    Add to Cart
                </button>

                <button class="heart-button"
                    onclick="addToWishlist(
                        '${product.name}',
                        '${product.image}',
                        ${product.price}
                    )">
                    <i class="fa-solid fa-heart"></i>
                </button>

            </div>

        </div>
        `;
    });
}

loadProducts();

async function performSearch(){

    const keyword = searchInput.value.trim();

    if(keyword==="") return;

    const response = await fetch(
    `/products/search?keyword=${encodeURIComponent(keyword)}`
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