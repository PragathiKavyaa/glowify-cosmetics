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

// Wishlist Toggle

document.querySelectorAll(".wishlist").forEach(btn => {

    btn.addEventListener("click", function (e) {

        e.stopPropagation();

        this.classList.toggle("active");

        if (this.classList.contains("active")) {

            this.innerHTML = "♥";

        }
        else {

            this.innerHTML = "♡";

        }

    });

});

window.onload = async function () {

    const cart = document.getElementById("cartProducts");
    const itemCount = document.getElementById("itemCount");
    const subTotal = document.getElementById("subTotal");
    const grandTotal = document.getElementById("grandTotal");

    const shipping = 0;

    let totalItems = 0;
    let totalPrice = 0;

    if (!cart) return;

    try {

        const userId = localStorage.getItem("userId");

        console.log("User ID:", userId);

        const response = await fetch(`/api/cart/user/${userId}`);

        if (!response.ok) {
            throw new Error("Unable to load cart");
        }

        const items = await response.json();

        cart.innerHTML = "";

        items.forEach(item => {

    // ===============================
    // OFFER TEXT
    // ===============================

    let offerText = "";

    if (item.offerType === "BUY_ONE_GET_ONE") {

        offerText = `
            <p class="offer-tag">
                🎁 Buy 1 Get 1 FREE
            </p>
        `;

    } else if (item.offerType === "PERCENTAGE") {

    offerText = `
        <p class="offer-tag">
            🔥 50% OFF
        </p>
    `;

}

    // ===============================
    // PRICE
    // ===============================

   const originalPrice = Number(item.originalPrice ?? item.price);

let unitPrice = Number(item.finalPrice ?? item.price);

let payableQuantity = Number(item.quantity);

// BUY ONE GET ONE
if (item.offerType === "BUY_ONE_GET_ONE") {

    // Example:
    // Quantity 2 = pay for 1
    // Quantity 4 = pay for 2
    // Quantity 6 = pay for 3

    payableQuantity = Math.ceil(item.quantity / 2);
}

// 50% / percentage offer
else if (item.offerType === "PERCENTAGE") {

    // finalPrice should already contain the 50% discounted price
    unitPrice = Number(item.finalPrice ?? originalPrice);

    payableQuantity = Number(item.quantity);
}

const itemTotal = unitPrice * payableQuantity;

totalItems += Number(item.quantity);
totalPrice += itemTotal;

    // ===============================
    // DISPLAY ITEM
    // ===============================

    cart.innerHTML += `
        <div class="cart-item">

            <div class="product-info">

                <img 
                    src="${item.image}" 
                    alt="${item.productName}" 
                    width="100"
                >

                <div>

                    <h3>${item.productName}</h3>

                    ${offerText}

                    <p>
                        ₹${item.finalPrice ?? item.price}

                        ${
                            item.offerType
                            ? `<strike>₹${item.originalPrice}</strike>`
                            : ""
                        }
                    </p>

                    <button 
                        class="remove-btn" 
                        data-id="${item.id}">
                        Remove
                    </button>

                </div>

            </div>

            <div class="quantity-box">

                <button 
                    class="minus-btn" 
                    data-id="${item.id}">
                    -
                </button>

                <span id="qty-${item.id}">
                    ${item.quantity}
                </span>

                ${
                    item.offerType === "BUY_ONE_GET_ONE"
                    ? `
                        <small class="free-item">
                            (${item.buyQuantity} + ${item.freeQuantity} FREE)
                        </small>
                      `
                    : ""
                }

                <button 
                    class="plus-btn" 
                    data-id="${item.id}">
                    +
                </button>

            </div>

            <p class="price">

                ₹${item.finalPrice ?? item.price}

                ${
                    item.offerType
                    ? `<br><strike>₹${item.originalPrice}</strike>`
                    : ""
                }

            </p>

            <p class="price">
                ₹${itemTotal}
            </p>

        </div>
    `;

});
        itemCount.textContent = totalItems + " Item(s)";
        subTotal.textContent = "₹" + totalPrice;
        grandTotal.textContent = "₹" + (totalPrice + shipping);

        document.querySelectorAll(".plus-btn").forEach(btn => {

    btn.addEventListener("click", async function () {

        const id = this.dataset.id;

        // Prevent multiple clicks
        this.disabled = true;

        try {

            const response = await fetch(
                `/api/cart/${id}/increase`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {

                const message = await response.text();

                alert(
                    message ||
                    "Unable to increase quantity"
                );

                return;
            }

            // Reload cart after successful update
            location.reload();
        
        } catch (error) {

            console.error(
                "Increase quantity error:",
                error
            );

            alert(
                "Something went wrong. Please try again."
            );

        } finally {

            this.disabled = false;

        }

    });

});
    

        document.querySelectorAll(".minus-btn").forEach(btn => {

    btn.addEventListener("click", async function () {

        const id = this.dataset.id;

        this.disabled = true;

        try {

            const response = await fetch(
                `/api/cart/${id}/decrease`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {

                const message = await response.text();

                alert(
                    message ||
                    "Unable to decrease quantity"
                );

                return;
            }

            location.reload();

        } catch (error) {

            console.error(
                "Decrease quantity error:",
                error
            );

            alert(
                "Something went wrong. Please try again."
            );

        } finally {

            this.disabled = false;

        }

    });

});

        document.querySelectorAll(".remove-btn").forEach(btn => {

    btn.addEventListener("click", async function () {

        const id = this.dataset.id;

        if (!confirm("Remove this product from your cart?")) {
            return;
        }

        this.disabled = true;

        try {

            const response = await fetch(
                `/api/cart/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {

                const message = await response.text();

                alert(
                    message ||
                    "Unable to remove product"
                );

                return;
            }

            location.reload();

        } catch (error) {

            console.error(
                "Remove cart item error:",
                error
            );

            alert(
                "Something went wrong. Please try again."
            );

        } finally {

            this.disabled = false;

        }

    });

});
} catch (error) {   

    console.error(error);

    cart.innerHTML = "<p>Unable to load cart items.</p>";

}

}; 

async function performSearch() {

    const keyword = searchInput.value.trim();

    if (keyword === "") return;

    const response = await fetch(
        `http://localhost:8080/products/search?keyword=${encodeURIComponent(keyword)}`
    );

    const products = await response.json();

    if (products.length === 0) {

        alert("No products found");
        return;

    }

    localStorage.setItem(
        "searchResults",
        JSON.stringify(products)
    );

    window.location.href = "/html/search.html";

}

if (searchInput && searchBtn) {

    searchBtn.addEventListener("click", performSearch);

    searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            performSearch();
        }
    });

}