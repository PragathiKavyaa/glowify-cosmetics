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

let shippingCharge = 50;

const placeOrder = document.getElementById("placeOrder");

placeOrder.addEventListener("click", async function () {

    if (!validateForm()) {
        return;
    }

    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("Please login first.");
        window.location.href = "/html/login.html";
        return;
    }

    const request = {

        userId: Number(userId),
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        mobile: document.getElementById("mobile").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        pincode: document.getElementById("pincode").value,

        paymentMethod: document.querySelector(".payment-btn.active").innerText,

        shippingMethod: document.querySelector(".shipping-card.active h4").innerText,

        shippingCharge: shippingCharge
    };

    console.log("Order Request:", request);

    try {

        placeOrder.disabled = true;
        placeOrder.innerHTML = "Placing Order...";

        const response = await fetch("/api/orders", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(request)

        });

        if (!response.ok) {

            throw new Error("Unable to place order");

        }

        const order = await response.json();

        console.log(order);

        alert("Order ID = " + order.id);

        window.location.href =
            `/html/ordersuccess.html?id=${order.id}`;

    }
    catch (error) {

        console.error(error);

        alert("Unable to place order.");

        placeOrder.disabled = false;
        placeOrder.innerHTML = "Place Order";

    }

});

document.addEventListener("DOMContentLoaded", () => {
    loadCartItems();
    initializeShipping();
    initializePaymentTabs();
});

async function loadCartItems() {

    try {

        const userId = localStorage.getItem("userId");

        const response = await fetch(`/api/cart/user/${userId}`);

        if (!response.ok) {
            throw new Error("Unable to load cart");
        }

        const items = await response.json();

        console.log(items);

        const orderItems = document.getElementById("orderItems");

        orderItems.innerHTML = "";

        let subtotal = 0;

        items.forEach(item => {

            subtotal += item.price * item.quantity;

            orderItems.innerHTML += `
                <div class="order-item">

                    <img src="${item.image}" width="70">

                    <div class="item-details">
                        <h4>${item.productName}</h4>
                        <p>Qty : ${item.quantity}</p>
                    </div>

                    <div>
                        ₹${item.price * item.quantity}
                    </div>

                </div>
            `;

        });

        const gst = subtotal * 0.18;

        document.getElementById("subtotal").innerHTML = "₹" + subtotal;
        document.getElementById("gst").innerHTML = "₹" + gst.toFixed(0);
        document.getElementById("shippingCharge").innerHTML = "₹" + shippingCharge;
        document.getElementById("grandTotal").innerHTML =
            "₹" + (subtotal + gst + shippingCharge).toFixed(0);

    } catch (e) {

        console.error(e);

    }

}

function initializeShipping() {

    document.querySelectorAll(".shipping-card").forEach(card => {

        card.addEventListener("click", function () {

            document.querySelectorAll(".shipping-card")
                .forEach(c => c.classList.remove("active"));

            this.classList.add("active");

            shippingCharge =
                Number(this.querySelector("input").value);

            loadCartItems();

        });

    });

}

function initializePaymentTabs() {

    const buttons = document.querySelectorAll(".payment-btn");

    buttons.forEach(button => {

        button.addEventListener("click", function () {

            buttons.forEach(b => b.classList.remove("active"));

            this.classList.add("active");

            document.querySelectorAll(".payment-content")
                .forEach(tab => tab.classList.remove("active"));

            document
                .getElementById(this.dataset.tab)
                .classList.add("active");

        });

    });

}

function validateForm() {

    if (document.getElementById("firstName").value.trim() === "") {
        alert("Enter First Name");
        return false;
    }

    if (document.getElementById("mobile").value.trim() === "") {
        alert("Enter Mobile Number");
        return false;
    }

    return true;

}

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