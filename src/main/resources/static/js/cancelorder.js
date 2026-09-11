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

document.addEventListener(
    "DOMContentLoaded",
    loadCancelledOrders
);

async function loadCancelledOrders() {

    const userId = localStorage.getItem("userId");

    if (!userId) {

        document.getElementById(
            "cancelOrdersContainer"
        ).innerHTML = `
            <p>Please login to view cancelled orders.</p>
        `;

        return;
    }

    try {

        const response = await fetch(
            `/api/cancel-orders/user/${userId}`
        );

        if (!response.ok) {
            throw new Error("Unable to load cancellation requests");
        }

        const cancelOrders = await response.json();

        const container =
            document.getElementById(
                "cancelOrdersContainer"
            );

        container.innerHTML = "";

        if (cancelOrders.length === 0) {

            container.innerHTML = `
                <div class="empty-cancel">

                    <h3>No cancelled orders</h3>

                    <p>
                        Your cancelled products will appear here.
                    </p>

                </div>
            `;

            return;
        }

        for (const cancelOrder of cancelOrders) {

            const itemsResponse = await fetch(
                `/api/orders/${cancelOrder.orderId}/items`
            );

            const items = await itemsResponse.json();

            let productsHTML = "";

            items.forEach(item => {

                productsHTML += `
                    <div class="cancelled-product">

                        <img src="${item.image}"
                             alt="${item.productName}">

                        <div class="cancelled-product-info">

                            <h4>
                                ${item.productName}
                            </h4>

                            <p>
                                Quantity:
                                ${item.quantity}
                            </p>

                            <p>
                                Price:
                                ₹${item.price}
                            </p>

                        </div>

                    </div>
                `;
            });

            container.innerHTML += `

                <div class="cancelled-order-card">

                    <div class="cancelled-order-header">

                        <h3>
                            Order #${cancelOrder.orderId}
                        </h3>

                        <span>
                            ${cancelOrder.status}
                        </span>

                    </div>

                    <p>
                        Reason:
                        ${cancelOrder.reason}
                    </p>

                    <div class="cancelled-products">
                        ${productsHTML}
                    </div>

                </div>
            `;
        }

    } catch (error) {

        console.error(error);

        document.getElementById(
            "cancelOrdersContainer"
        ).innerHTML = `
            <p>
                Unable to load cancelled orders.
            </p>
        `;
    }
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