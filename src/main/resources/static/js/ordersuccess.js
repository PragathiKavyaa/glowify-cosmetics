const id = new URLSearchParams(window.location.search).get("id");

fetch(`/api/orders/${id}`)

.then(response => response.json())

.then(order => {

    document.getElementById("orderNumber").innerHTML =
        "Order No #"+order.id;

    document.getElementById("orderDate").innerHTML =
        new Date(order.orderDate).toDateString();

    document.getElementById("customerName").innerHTML =
        order.firstName+" "+order.lastName;

    document.getElementById("customerAddress").innerHTML =
        order.address+", "+order.city+", "+order.state+" - "+order.pincode;

    document.getElementById("customerMobile").innerHTML =
        order.mobile;

    document.getElementById("deliveryDate").innerHTML =
        new Date(order.estimatedDelivery).toDateString();

    document.getElementById("subtotal").innerHTML =
        "₹"+order.subtotal;

    document.getElementById("shipping").innerHTML =
        "₹"+order.shippingCharge;

    document.getElementById("gst").innerHTML =
        "₹"+order.gst;

    document.getElementById("total").innerHTML =
        "₹"+order.total;

    const items=document.getElementById("orderItems");

    order.items.forEach(item=>{

        items.innerHTML+=`

        <div class="order-item">

            <img src="${item.image}" alt="${item.productName}">

            <div class="item-details">

                <h4>${item.productName}</h4>

                <p>Qty : ${item.quantity}</p>

            </div>

            <div class="item-price">

                ₹${item.price * item.quantity}

            </div>

        </div>

        `;

    });

});

const trackOrderBtn = document.getElementById("trackOrderBtn");

if (trackOrderBtn) {
    trackOrderBtn.addEventListener("click", () => {
        const id = new URLSearchParams(window.location.search).get("id");
        window.location.href = `/html/trackorder.html?id=${id}`;
    });
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