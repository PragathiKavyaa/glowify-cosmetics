// ===============================
// Dashboard
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

    loadOrders();

    loadNotifications();

    loadMessages();

    loadProducts();

    loadInventory();

    loadCancelRequests();

    loadContactMessages();

    loadOffers();   // Add this line

    loadSubscribers();

    const offerType = document.getElementById("offerType");

    if (offerType) {
        offerType.addEventListener("change", toggleOfferFields);
    }

});

// ===============================
// Dashboard Statistics
// ===============================

async function loadDashboard() {

    try {

        const response = await fetch("/api/admin/dashboard");

        const data = await response.json();

        document.getElementById("totalProducts").innerHTML =
            data.totalProducts;

        document.getElementById("totalOrders").innerHTML =
            data.totalOrders;

        document.getElementById("totalRevenue").innerHTML =
            "₹" + data.totalRevenue;

        document.getElementById("lowStock").innerHTML =
            data.lowStock;

        document.getElementById("stockCount").innerHTML =
            data.totalStock;

        document.getElementById("outStock").innerHTML =
            data.outOfStock;

        document.getElementById("lowStockCount").innerHTML =
            data.lowStock;

        document.getElementById("todaySales").innerHTML =
            "₹" + data.todaySales;

        document.getElementById("monthlySales").innerHTML =
            "₹" + data.monthlySales;

        document.getElementById("deliveredOrders").innerHTML =
            data.deliveredOrders;

    }

    catch (error) {

        console.log(error);

    }

}

// ===============================
// Orders
// ===============================

async function loadOrders() {

    try {

        const response = await fetch("/api/orders");

        const orders = await response.json();

        const body = document.getElementById("ordersBody");

        body.innerHTML = "";

        orders.forEach(order => {

            body.innerHTML += `

            <tr>

                <td>#${order.id}</td>

                <td>${order.firstName} ${order.lastName}</td>

                <td>₹${order.total}</td>

                <td>${order.orderStatus}</td>

                <td>

                    <select onchange="updateStatus(${order.id},this.value)">

                        <option value="ORDER_CONFIRMED"
                        ${order.orderStatus == "ORDER_CONFIRMED" ? "selected" : ""}>
                        ORDER_CONFIRMED
                        </option>

                        <option value="PROCESSING"
                        ${order.orderStatus == "PROCESSING" ? "selected" : ""}>
                        PROCESSING
                        </option>

                        <option value="SHIPPED"
                        ${order.orderStatus == "SHIPPED" ? "selected" : ""}>
                        SHIPPED
                        </option>

                        <option value="OUT_FOR_DELIVERY"
                        ${order.orderStatus == "OUT_FOR_DELIVERY" ? "selected" : ""}>
                        OUT_FOR_DELIVERY
                        </option>

                        <option value="DELIVERED"
                        ${order.orderStatus == "DELIVERED" ? "selected" : ""}>
                        DELIVERED
                        </option>

                    </select>

                </td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}

// ===============================
// Update Shipment Status
// ===============================

async function updateStatus(id, status) {

    try {

        const response = await fetch(

            `/api/orders/${id}/status?status=${status}`,

            {

                method: "PUT"

            }

        );

        if (response.ok) {

            alert("Shipment Status Updated");

            loadOrders();

        }

    }

    catch (error) {

        console.log(error);

    }

}

// ===============================
// Notifications
// ===============================

async function loadNotifications() {

    try {

        const response =
            await fetch("/api/admin/notifications");

        const notifications =
            await response.json();

        const list =
            document.getElementById("notificationList");

        list.innerHTML = "";

        notifications.forEach(notification => {

            list.innerHTML += `

            <li>

            ${notification.message}

            </li>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}

// ===============================
// Customer Messages
// ===============================

async function loadMessages() {

    try {

        const response =
            await fetch("/api/messages");

        const messages =
            await response.json();

        const container =
            document.getElementById(
                "messagesContainer"
            );

        container.innerHTML = "";

        const conversations = {};

        messages.forEach(message => {

            if (!conversations[
                message.conversationId
            ]) {

                conversations[
                    message.conversationId
                ] = [];

            }

            conversations[
                message.conversationId
            ].push(message);

        });

        Object.values(conversations)
            .forEach(conversation => {

                const first =
                    conversation[0];

                let chatHtml = "";

                conversation.forEach(message => {

                    if (
                        message.senderRole ===
                        "CUSTOMER"
                    ) {

                        chatHtml += `
                            <div class="chat-customer">
                                <strong>
                                    ${message.customerName}
                                </strong>

                                <p>
                                    ${message.message}
                                </p>
                            </div>
                        `;

                    } else {

                        chatHtml += `
                            <div class="chat-admin">
                                <strong>
                                    Admin
                                </strong>

                                <p>
                                    ${message.message}
                                </p>
                            </div>
                        `;

                    }

                });

                container.innerHTML += `

                    <div class="conversation">

                        <div class="conversation-header">

                            <strong>
                                ${first.customerName}
                            </strong>

                            <span>
                                Order #${first.orderId}
                            </span>

                        </div>

                        <div class="conversation-body">

                            ${chatHtml}

                        </div>

                        <button
                            class="reply-btn"
                            onclick="
                                replyToConversation(
                                    '${first.conversationId}',
                                    ${first.orderId},
                                    ${first.userId},
                                    '${first.customerName}'
                                )
                            ">

                            Reply

                        </button>

                    </div>

                `;

            });

    } catch (error) {

        console.log(error);

    }
}

async function replyMessage(messageId) {

    const reply = prompt("Enter your reply to the customer:");

    if (!reply || !reply.trim()) {
        return;
    }

    try {

        const response = await fetch(
            `/api/messages/${messageId}/reply`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    reply: reply
                })
            }
        );

        if (response.ok) {

            alert("Reply sent successfully.");

            loadMessages();

        } else {

            const errorText = await response.text();

            console.log("Reply failed:", errorText);

            alert("Failed to send reply.");

        }

    } catch (error) {

        console.log("Reply error:", error);

        alert("Error sending reply.");

    }

}

// ===============================
// Buttons
// ===============================

document.getElementById("addProduct").onclick = () => {
    document.getElementById("addProductModal").style.display = "flex";
};

const updateStockBtn = document.getElementById("updateStock");
if (updateStockBtn) {
    updateStockBtn.onclick = () => {
        document.getElementById("stockModal").style.display = "flex";
    };
}

const changePriceBtn = document.getElementById("changePrice");
if (changePriceBtn) {
    changePriceBtn.onclick = () => {
        document.getElementById("priceModal").style.display = "flex";
    };
}

const discountBtn = document.getElementById("discount");
if (discountBtn) {
    discountBtn.onclick = () => {
        document.getElementById("discountModal").style.display = "flex";
    };
}

function closeModal(id) {

    document.getElementById(id).style.display = "none";

}

function openOfferModal() {

    document.getElementById("offerId").value = "";
    document.getElementById("offerProductId").value = "";
    document.getElementById("offerTitle").value = "";
    document.getElementById("offerDiscountPercent").value = "";
    document.getElementById("offerPrice").value = "";
    document.getElementById("buyQuantity").value = "";
    document.getElementById("freeQuantity").value = "";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
    document.getElementById("offerActive").checked = true;

    document.getElementById("offerModal").style.display = "flex";

    toggleOfferFields();

}

async function saveProduct() {

    const product = {

        name: document.getElementById("productName").value,

        brand: document.getElementById("brand").value,

        description: document.getElementById("description").value,

        category: document.getElementById("category").value,

        price: Number(document.getElementById("price").value),

        stock: Number(document.getElementById("stock").value),

        discount: Number(document.getElementById("discountValue").value),

        rating: Number(document.getElementById("rating").value),

        reviewCount: Number(document.getElementById("reviewCount").value),

        badge: document.getElementById("badge").value,

        image: document.getElementById("image").value,

        alt: document.getElementById("altText").value
    };

    const response = await fetch("http://localhost:8080/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });

    if (response.ok) {
        alert("Product Added Successfully");

        closeModal("addProductModal");

        loadProducts();

        loadInventory();

        loadDashboard();
    }
    else {
        alert("Failed to Add Product");
    }
}

async function updateStock() {

    const id = document.getElementById("stockProductId").value;

    const stock = document.getElementById("newStock").value;

    await fetch(`/api/admin/products/${id}/stock?stock=${stock}`, {

        method: "PUT"

    });

    alert("Stock Updated");

    closeModal("stockModal");

    loadProducts();

    loadInventory();

    loadDashboard();

}

async function changePrice() {

    const id = document.getElementById("priceProductId").value;

    const price = document.getElementById("newPrice").value;

    await fetch(`/api/admin/products/${id}/price?price=${price}`, {

        method: "PUT"

    });

    alert("Price Updated");

    closeModal("priceModal");

    loadProducts();

}

async function addDiscount() {

    const id = document.getElementById("discountProductId").value;

    const discount = document.getElementById("discountPercent").value;

    await fetch(`/api/admin/products/${id}/discount?discount=${discount}`, {

        method: "PUT"

    });

    alert("Discount Updated");

    closeModal("discountModal");

    loadProducts();

}

window.onclick = function (event) {

    if (event.target.classList.contains("modal")) {

        event.target.style.display = "none";

    }

}

window.onload = () => {

    document.querySelectorAll(".modal").forEach(modal => {
        modal.style.display = "none";
    });

};

async function loadProducts() {

    try {

        const response = await fetch("http://localhost:8080/products");

        const products = await response.json();

        const table = document.getElementById("productTableBody");

        table.innerHTML = "";

        products.forEach(product => {

            table.innerHTML += `

            <tr>

                <td>${product.id}</td>

                <td>
                    <img src="${product.image}" width="60">
                </td>

                <td>${product.name}</td>

                <td>${product.brand}</td>

                <td>${product.category}</td>

                <td>₹${product.price}</td>

                <td>
                    <span class="${product.stock <= 10 ? 'low-stock' : 'normal-stock'}">
                    ${product.stock}
                    </span>
                </td>

                <td>${product.discount}%</td>

                <td>

                    <button class="edit-btn"
                    onclick="editProduct(${product.id})">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button class="delete-btn"
                    onclick="deleteProduct(${product.id})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}

async function deleteProduct(id) {

    if (!confirm("Delete this product?")) {

        return;

    }

    const response = await fetch(

        `http://localhost:8080/products/${id}`,

        {

            method: "DELETE"

        }

    );

    if (response.ok) {

        alert("Product Deleted Successfully");

        loadProducts();

        loadInventory();

        loadDashboard();

    }

}

async function editProduct(id) {

    try {

        const response = await fetch(`http://localhost:8080/products/${id}`);

        const product = await response.json();

        document.getElementById("editId").value = product.id;
        document.getElementById("editName").value = product.name;
        document.getElementById("editBrand").value = product.brand;
        document.getElementById("editCategory").value = product.category;
        document.getElementById("editPrice").value = product.price;
        document.getElementById("editStock").value = product.stock;
        document.getElementById("editDiscount").value = product.discount;
        document.getElementById("editImage").value = product.image;
        document.getElementById("editAlt").value = product.alt;
        document.getElementById("editDescription").value = product.description;
        document.getElementById("editRating").value = product.rating ?? "";
        document.getElementById("editReviewCount").value = product.reviewCount ?? "";

        document.getElementById("editProductModal").style.display = "flex";

    } catch (error) {

        console.log(error);

    }

}

async function updateProduct() {

    const id = document.getElementById("editId").value;

    const product = {

        name: document.getElementById("editName").value,

        brand: document.getElementById("editBrand").value,

        category: document.getElementById("editCategory").value,

        price: Number(document.getElementById("editPrice").value),

        stock: Number(document.getElementById("editStock").value),

        discount: Number(document.getElementById("editDiscount").value),

        rating: Number(document.getElementById("editRating").value),

        reviewCount: Number(document.getElementById("editReviewCount").value),

        image: document.getElementById("editImage").value,

        alt: document.getElementById("editAlt").value,

        description: document.getElementById("editDescription").value

    };

    const response = await fetch(`http://localhost:8080/products/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(product)

    });

    if (response.ok) {

        alert("Product Updated Successfully");

        closeModal("editProductModal");

        loadProducts();

    } else {

        alert("Product Updated Successfully");

        closeModal("editProductModal");

        loadProducts();

        loadInventory();

        loadDashboard();

    }

}

async function loadInventory() {

    try {

        const response = await fetch("http://localhost:8080/products");

        const products = await response.json();

        const body = document.getElementById("inventoryBody");

        body.innerHTML = "";

        products.forEach(product => {

            let status = "";
            let css = "";

            if (product.stock == 0) {

                status = "Out of Stock";
                css = "out-stock";

            } else if (product.stock <= 10) {

                status = "Low Stock";
                css = "low-stock";

            } else {

                status = "In Stock";
                css = "in-stock";
            }

            body.innerHTML += `

            <tr>

                <td>${product.name}</td>

                <td>${product.category}</td>

                <td class="${css}">
                    ${product.stock}
                </td>

                <td class="${css}">
                    ${status}
                </td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}

async function loadCancelRequests() {

    try {

        const response = await fetch("/api/cancel-orders");

        const requests = await response.json();

        const table = document.getElementById("cancelTable");

        table.innerHTML = "";

        requests.forEach(req => {

            const statusClass =
                req.status === "Approved"
                    ? "status-approved"
                    : req.status === "Not Approved"
                        ? "status-not-approved"
                        : "status-pending";

            table.innerHTML += `
                <tr>

                    <td>${req.orderId}</td>

                    <td>${req.customerName}</td>

                    <td>${req.reason}</td>

                    <td>
                        <span class="${statusClass}">
                            ${req.status}
                        </span>
                    </td>

                    <td>

                        ${
                            req.status === "Pending"
                            ? `
                                <button class="approve-btn"
                                    onclick="approveCancel(${req.id})">
                                    Approve
                                </button>

                                <button class="reject-btn"
                                    onclick="rejectCancel(${req.id})">
                                    Not Approve
                                </button>
                              `
                            : `
                                <span class="request-completed">
                                    Completed
                                </span>
                              `
                        }

                    </td>

                </tr>
            `;

        });

    } catch (error) {

        console.log(error);

    }

}

async function approveCancel(id) {

    const response = await fetch(`/api/cancel-orders/${id}/approve`, {
        method: "PUT"
    });

    if (response.ok) {
        alert("Cancellation Approved");
        loadCancelRequests();
        loadOrders();
    } else {
        alert("Failed to approve request");
    }
}

async function rejectCancel(id) {

    const response = await fetch(`/api/cancel-orders/${id}/reject`, {
        method: "PUT"
    });

    if (response.ok) {
        alert("Cancellation request rejected.");
        loadCancelRequests(); // Reload the table
    } else {
        alert("Failed to reject request.");
    }
}

async function replyToConversation(
    conversationId,
    orderId,
    userId,
    customerName
) {

    const reply =
        prompt("Enter your reply:");

    if (!reply || !reply.trim()) {
        return;
    }

    const request = {

        conversationId:
            conversationId,

        orderId:
            orderId,

        userId:
            userId,

        customerName:
            customerName,

        message:
            reply

    };

    const response = await fetch(
        "/api/messages/reply",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(request)
        }
    );

    if (response.ok) {

        alert("Reply sent successfully");

        loadMessages();

    } else {

        alert("Failed to send reply");

    }
}

async function loadContactMessages() {

    try {

        const response = await fetch("/api/contact-messages");

        console.log("Response Status:", response.status);

        const messages = await response.json();

        console.log("Messages:", messages);

        const body = document.getElementById("contactMessageBody");

        console.log("Table Body:", body);

        if (!body) {
            console.error("contactMessageBody not found!");
            return;
        }

        body.innerHTML = "";

        messages.forEach(msg => {

            body.innerHTML += `
                <tr>
                    <td>${msg.fullName}</td>
                    <td>${msg.email}</td>
                    <td>${msg.mobile}</td>
                    <td>${msg.subject}</td>
                    <td>${msg.message}</td>
                </tr>
            `;

        });

    } catch (error) {

        console.error("Error loading contact messages:", error);

    }

}

// async function performSearch(){

//     const keyword = searchInput.value.trim();

//     if(keyword==="") return;

//     const response = await fetch(
//     `http://localhost:8080/products/search?keyword=${encodeURIComponent(keyword)}`
// );

//     const products = await response.json();

//     if(products.length===0){

//         alert("No products found");
//         return;

//     }

//     localStorage.setItem(
//         "searchResults",
//         JSON.stringify(products)
//     );

//     window.location.href="/html/search.html";

// }

// if (searchInput && searchBtn) {

//     searchBtn.addEventListener("click", performSearch);

//     searchInput.addEventListener("keydown", function (e) {
//         if (e.key === "Enter") {
//             performSearch();
//         }
//     });

// }

const OFFER_API = "http://localhost:8080/api/offers";


async function loadOffers() {

    const response = await fetch(OFFER_API);

    const offers = await response.json();

    const tbody = document.getElementById("offerTableBody");

    tbody.innerHTML = "";

    offers.forEach(offer => {

        tbody.innerHTML += `

        <tr>

            <td>${offer.id}</td>

            <td>${offer.productId}</td>

            <td>${offer.offerTitle}</td>

            <td>${offer.offerType}</td>

            <td>

                ${
                    offer.offerType==="PERCENTAGE"
                    ? offer.discountPercent+"%"
                    : "Buy "+offer.buyQuantity+
                      " Get "+offer.freeQuantity
                }

            </td>

            <td>

                ${
                    offer.active
                    ? "<span class='active'>Active</span>"
                    : "<span class='inactive'>Inactive</span>"
                }

            </td>

            <td>

                <button onclick="editOffer(${offer.id})">

                    Edit

                </button>

                <button onclick="deleteOffer(${offer.id})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}

async function saveOffer() {

    const offerId = document.getElementById("offerId").value;

    const offerType = document.getElementById("offerType").value;

    let discountPercent = null;
    let offerPrice = null;
    let buyQuantity = null;
    let freeQuantity = null;

    if (offerType === "PERCENTAGE") {

        discountPercent = Number(document.getElementById("offerDiscountPercent").value);

        offerPrice = Number(document.getElementById("offerPrice").value);

    }

    if (offerType === "BUY_ONE_GET_ONE") {

        buyQuantity = Number(document.getElementById("buyQuantity").value);

        freeQuantity =
            Number(
                document.getElementById("freeQuantity").value
            );
    }

    const offer = {

        productId:
            Number(
                document.getElementById("offerProductId").value
            ),

        offerTitle:
            document.getElementById("offerTitle").value,

        offerType:
            offerType,

        discountPercent:
            discountPercent,

        offerPrice:
            offerPrice,

        buyQuantity:
            buyQuantity,

        freeQuantity:
            freeQuantity,

        startDate:
            document.getElementById("startDate").value,

        endDate:
            document.getElementById("endDate").value,

        active:
            document.getElementById("offerActive").checked
    };

    console.log("Offer being sent:", offer);

    let url = OFFER_API;
    let method = "POST";

    if (offerId) {

        url = OFFER_API + "/" + offerId;
        method = "PUT";

    }

    try {

        const response = await fetch(url, {

            method: method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(offer)

        });

        if (response.ok) {

            alert("Offer Saved Successfully");

            closeModal("offerModal");

            loadOffers();

        } else {

            const error = await response.text();

            console.error(
                "Offer save failed:",
                error
            );

            alert("Failed to save offer");

        }

    } catch (error) {

        console.error(
            "Offer error:",
            error
        );

        alert("Error saving offer");

    }
}

async function deleteOffer(id){

if(!confirm("Delete Offer?")) return;

await fetch(OFFER_API+"/"+id,{

method:"DELETE"

});

loadOffers();

}

async function editOffer(id){

const response=await fetch(OFFER_API);

const offers=await response.json();

const offer=offers.find(o=>o.id===id);

document.getElementById("offerId").value=offer.id;

document.getElementById("offerProductId").value=offer.productId;

document.getElementById("offerTitle").value=offer.offerTitle;

document.getElementById("offerType").value=offer.offerType;

document.getElementById("offerDiscountPercent").value=offer.discountPercent;

document.getElementById("offerPrice").value=offer.offerPrice;

document.getElementById("buyQuantity").value=offer.buyQuantity;

document.getElementById("freeQuantity").value=offer.freeQuantity;

document.getElementById("startDate").value=offer.startDate;

document.getElementById("endDate").value=offer.endDate;

document.getElementById("offerActive").checked=offer.active;

document.getElementById("offerModal").style.display="flex";

toggleOfferFields();

}

document.addEventListener("DOMContentLoaded", () => {

    const offerType = document.getElementById("offerType");

    if (offerType) {
        offerType.addEventListener("change", toggleOfferFields);
    }

});

function toggleOfferFields(){

const type=document.getElementById("offerType").value;

const discount=document.getElementById("offerDiscountPercent");

const offerPrice=document.getElementById("offerPrice");

const buy=document.getElementById("buyQuantity");

const free=document.getElementById("freeQuantity");

if(type==="BUY_ONE_GET_ONE"){

discount.disabled=true;

offerPrice.disabled=true;

buy.disabled=false;

free.disabled=false;

}
else{

discount.disabled=false;

offerPrice.disabled=false;

buy.disabled=true;

free.disabled=true;

}

}

// ==========================================
// LOAD SUBSCRIBERS
// ==========================================

async function loadSubscribers() {

    try {

        const response = await fetch("/api/subscribers");

        if (!response.ok) {
            throw new Error("Failed to load subscribers");
        }

        const subscribers = await response.json();

        console.log("Subscribers:", subscribers);

        const tbody = document.getElementById("subscriberTableBody");

        if (!tbody) {
            console.error("subscriberTableBody not found");
            return;
        }

        tbody.innerHTML = "";

        subscribers.forEach(subscriber => {

            const row = document.createElement("tr");

            // Highlight unread subscribers
            if (!subscriber.read) {
                row.classList.add("unread-subscriber");
            }

            row.innerHTML = `
                
                <td>${subscriber.id}</td>

                <td>${subscriber.email}</td>

                <td>
                    <span class="subscriber-status">
                        ${subscriber.read ? "Read" : "New"}
                    </span>
                </td>

                <td>

                    <button 
                        class="view-subscriber-btn"
                        onclick="markSubscriberAsRead(${subscriber.id}, this)">
                        ${subscriber.read ? "Viewed" : "View"}
                    </button>

                </td>

            `;

            tbody.appendChild(row);

        });

    } catch (error) {

        console.error("Error loading subscribers:", error);

    }
}

// ==========================================
// MARK SUBSCRIBER AS READ
// ==========================================

async function markSubscriberAsRead(id, button) {

    try {

        const response = await fetch(`/api/subscribers/${id}/read`, {

            method: "PUT"

        });

        if (!response.ok) {
            throw new Error("Failed to mark subscriber as read");
        }

        const row = button.closest("tr");

        // Remove highlight
        row.classList.remove("unread-subscriber");

        // Change status
        const status = row.querySelector(".subscriber-status");

        if (status) {
            status.textContent = "Read";
        }

        // Change button
        button.textContent = "Viewed";

    } catch (error) {

        console.error("Error marking subscriber as read:", error);

    }
}