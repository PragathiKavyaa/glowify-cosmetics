 const shopMenu = document.querySelector(".shop-menu");
    const shopLink = document.querySelector(".shop-link");

    shopLink.addEventListener("click", function (event) {
        event.preventDefault();
        shopMenu.classList.toggle("active");
    });

    document.addEventListener("click", function (event) {
        if (!shopMenu.contains(event.target)) {
            shopMenu.classList.remove("active");
        }
    });

    const filterHeadings = document.querySelectorAll(".filter-heading");

filterHeadings.forEach(function (heading) {
    heading.addEventListener("click", function () {
        this.parentElement.classList.toggle("closed");
    });
});

document.querySelectorAll(".cart-button").forEach(button => {

    button.addEventListener("click", async () => {

        const product = {

            productName: button.dataset.name,
            price: button.dataset.price,
            image: button.dataset.image,
            quantity: 1

        };

        const response = await fetch("/api/cart", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(product)

        });

        if (response.ok) {

            alert("Product Added Successfully");

            window.location.href = "/html/cart.html";

        } else {

            alert("Failed to add product.");

        }

    });

});

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

// Sort

const productsGrid = document.querySelector(".products-grid");
const sortLinks = document.querySelectorAll("#sortMenu a");

sortLinks.forEach(link => {

    link.addEventListener("click", function(e){

        e.preventDefault();

        const type = this.dataset.sort;

        const cards = Array.from(document.querySelectorAll(".product-card"));

        if(type === "low-high"){

            cards.sort((a,b)=>{
                return Number(a.dataset.price) - Number(b.dataset.price);
            });

        }

        else if(type === "high-low"){

            cards.sort((a,b)=>{
                return Number(b.dataset.price) - Number(a.dataset.price);
            });

        }

        else if(type === "rating"){

            cards.sort((a,b)=>{
                return Number(b.dataset.rating) - Number(a.dataset.rating);
            });

        }

        else if(type === "offers"){

            cards.sort((a,b)=>{
                return Number(b.dataset.offer) - Number(a.dataset.offer);
            });

        }

        cards.forEach(card=>{
            productsGrid.appendChild(card);
        });

        sortMenu.classList.remove("show");

    });

});

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

// =====================
// ADD TO WISHLIST (DATABASE)
// =====================

document.querySelectorAll(".heart-button").forEach(button => {

    button.addEventListener("click", async () => {

        const product = {
            productName: button.dataset.name,
            price: Number(button.dataset.price),
            image: button.dataset.image,
            userId: 1
        };

        try {

            const response = await fetch("/wishlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            });

            const text = await response.text();

            console.log("Status:", response.status);
            console.log("Response:", text);

            if (response.ok) {
                alert("Product Added to Wishlist ❤️");
            } else {
                alert("Error " + response.status + "\n" + text);
            }

        } catch (error) {
            console.error(error);
        }

    });

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