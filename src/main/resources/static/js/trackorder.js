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

//const id = new URLSearchParams(window.location.search).get("id");
const userId = localStorage.getItem("userId");

if (!userId) {
    window.location.href = "/html/login.html";
}

// loadUserMessages();

fetch(`/api/orders/user/${userId}`)
    .then(response => response.json())
     .then(async orders => {

        const messageResponse = await fetch(`/api/messages/user/${userId}`);

        const messages = messageResponse.ok
            ? await messageResponse.json()
            : [];

        const conversations = {};

        messages
        .filter(msg => msg.messageType === "ORDER_MESSAGE")
        .forEach(msg => {

        if (!conversations[msg.conversationId]) {
            conversations[msg.conversationId] = [];
        }

        conversations[msg.conversationId].push(msg);

    });
            
        const container = document.getElementById("ordersContainer");

        container.innerHTML = "";

        orders.forEach(order => {

            const productName = order.items?.length ? order.items[0].productName : "No Product";

            const orderConversations = Object.values(conversations).filter(conversation =>
            conversation.some(msg => msg.orderId === order.id)
            );

            let conversationHtml = "";

orderConversations.forEach(conversation => {

    conversationHtml += `
        <div class="order-conversation">

            <h4>Conversation with Admin</h4>

            ${conversation.map(msg => `
                <div class="${msg.senderRole === "CUSTOMER"
                    ? "customer-message"
                    : "admin-message"}">

                    <strong>
                        ${msg.senderRole === "CUSTOMER"
                            ? "You"
                            : "Admin"}
                    </strong>

                    <p>
                        ${msg.message}
                    </p>

                </div>
            `).join("")}

        </div>
    `;

});

            const cancellationMessage = messages.find(msg =>
                msg.orderId === order.id &&
                msg.messageType === "CANCELLATION_REJECTED"
            );

            let message = "";

            let confirmed = "";
            let processing = "";
            let shipped = "";
            let delivery = "";

            switch (order.orderStatus) {

                case "ORDER_CONFIRMED":

                    confirmed = "active";
                    message = "Your order has been confirmed.";
                    break;

                case "PROCESSING":

                    confirmed = "completed";
                    processing = "active";
                    message = "Your order is being prepared.";
                    break;

                case "SHIPPED":

                    confirmed = "completed";
                    processing = "completed";
                    shipped = "active";
                    message = "Your order has been shipped.";
                    break;

                case "OUT_FOR_DELIVERY":

                    confirmed = "completed";
                    processing = "completed";
                    shipped = "completed";
                    delivery = "active";
                    message = "Your order is out for delivery.";
                    break;

                case "DELIVERED":

                    confirmed = "completed";
                    processing = "completed";
                    shipped = "completed";
                    delivery = "completed";
                    message = "Delivered successfully.";
                    break;

                case "CANCELLATION_REQUESTED":

                    confirmed = "completed";
                    message = "Cancellation request has been sent to the admin.";
                    break;

                case "CANCELLED":

                    confirmed = "completed";
                    message = "Your order has been cancelled.";
                    break;

            }

            container.innerHTML += `
<div class="order-wrapper">

    <div class="tracking-panel">

        <div class="tracking-header">
           <h3>${productName}</h3>
        </div>

        <div class="status-steps">

            <div class="step ${confirmed}">
                <span class="step-icon">
                    <i class="fa-solid fa-check"></i>
                </span>
                <p>Order<br>Confirmed</p>
            </div>

            <div class="step ${processing}">
                <span class="step-icon">
                    <i class="fa-solid fa-check"></i>
                </span>
                <p>Processing</p>
            </div>

            <div class="step ${shipped}">
                <span class="step-icon">
                    <i class="fa-solid fa-truck"></i>
                </span>
                <p>Shipped</p>
            </div>

            <div class="step ${delivery}">
                <span class="step-icon">
                    <i class="fa-solid fa-house"></i>
                </span>
                <p>Out for Delivery</p>
            </div>

        </div>

        <p class="delivery-message">${message}</p>

        <div class="map-box">
            <img src="/html/Cosmetics website/360_F_537051575_QMgTmcn9DVgwzPdboJHx6fqSge02BRzM.jpg">

            <div class="delivery-pin">
                <i class="fa-solid fa-box"></i>
            </div>

            <button class="view-map-btn">
                <i class="fa-solid fa-location-dot"></i>
                View on Map
            </button>
        </div>

    </div>

    <aside class="delivery-card">

        <h3>Delivery Details</h3>

        <div class="delivery-row">
            <i class="fa-solid fa-user"></i>
            <div>
                <span>Name</span>
                <p>${order.firstName} ${order.lastName}</p>
            </div>
        </div>

        <div class="delivery-row">
            <i class="fa-solid fa-phone"></i>
            <div>
                <span>Phone Number</span>
                <p>${order.mobile}</p>
            </div>
        </div>

        <div class="delivery-row">
            <i class="fa-solid fa-location-dot"></i>
            <div>
                <span>Shipping Address</span>
                <p>${order.address}, ${order.city}, ${order.state} - ${order.pincode}</p>
            </div>
        </div>

        <div class="delivery-row">
            <i class="fa-solid fa-calendar-days"></i>
            <div>
                <span>Expected Delivery</span>
                <p>${new Date(order.estimatedDelivery).toDateString()}</p>
            </div>
        </div>

        <div class="order-actions">

            <button class="cancel-btn"
                onclick="cancelOrder(${order.id})">
                Cancel Order
            </button>

            <button class="message-btn"
                onclick="openMessage(${order.id})">
                Message Admin
            </button>

        </div>

    </aside>

    ${conversationHtml}

    ${
    cancellationMessage
    ? `
        <div class="cancel-not-approved">

            <strong>
                Cancellation Not Approved
            </strong>

            <h4>${productName}</h4>

            <p>
                ${cancellationMessage.message}
            </p>

            ${
                cancellationMessage.reply
                ? `
                    <p class="admin-reply">
                        ${cancellationMessage.reply}
                    </p>
                `
                : ""
            }

        </div>
      `
    : ""
}

</div>
`;

        });

    })
    .catch(err => console.log(err));

async function cancelOrder(orderId) {

    const reason = prompt("Reason for cancellation");

    if (!reason) return;

    const request = {

        orderId: orderId,

        userId: localStorage.getItem("userId"),

        customerName: localStorage.getItem("userName"),

        reason: reason,

        status: "Pending"

    };

    const response = await fetch("/api/cancel-orders/request", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(request)

    });

    if (response.ok) {

    alert("Cancellation request sent");

    location.reload();

} else {

    alert("Failed to send cancellation request");

}

}

async function openMessage(orderId) {

    const message = prompt("Enter your message to the admin");

    if (!message || !message.trim()) {
        return;
    }

    // Every click starts a new conversation
    const conversationId =
        crypto.randomUUID();

    const request = {

        orderId: orderId,

        userId: Number(
            localStorage.getItem("userId")
        ),

        customerName:
            localStorage.getItem("userName"),

        message: message,

        messageType: "ORDER_MESSAGE",

        senderRole: "CUSTOMER",

        conversationId: conversationId

    };

    const response = await fetch(
        "/api/messages",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify(request)
        }
    );

    if (response.ok) {

        alert("Message sent to Admin");

    } else {

        alert("Failed to send message");

    }
}

let selectedOrderId = null;

async function openCancelModal(orderId) {

    selectedOrderId = orderId;

    try {

        const response = await fetch(
            `/api/orders/${orderId}/items`
        );

        if (!response.ok) {
            throw new Error("Unable to get order products");
        }

        const products = await response.json();

        const container =
            document.getElementById("cancelProducts");

        container.innerHTML = "";

        products.forEach(product => {

            container.innerHTML += `
                <div class="cancel-product">

                    <img src="${product.image}"
                         alt="${product.productName}">

                    <div class="cancel-product-info">

                        <h4>${product.productName}</h4>

                        <p>
                            Quantity: ${product.quantity}
                        </p>

                        <p>
                            ₹${product.price}
                        </p>

                    </div>

                </div>
            `;
        });

        document
            .getElementById("cancelModal")
            .classList.add("show");

    } catch (error) {

        console.error(error);

        alert("Unable to load order products.");
    }
}

async function confirmCancelOrder() {

    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");

    const reason =
        document.getElementById("cancelReason").value;

    if (!userId) {
        alert("Please login first.");
        return;
    }

    if (!reason) {
        alert("Please select a reason.");
        return;
    }

    const request = {

        orderId: selectedOrderId,

        userId: Number(userId),

        customerName: userName,

        reason: reason,

        status: "Pending"

    };

    try {

        const response = await fetch(
            "/api/cancel-orders/request",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(request)
            }
        );

        if (!response.ok) {
            throw new Error("Cancellation failed");
        }

        alert("Cancellation request submitted successfully.");

        closeCancelModal();

        loadOrders();

    } catch (error) {

        console.error(error);

        alert("Unable to submit cancellation request.");
    }
}

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
