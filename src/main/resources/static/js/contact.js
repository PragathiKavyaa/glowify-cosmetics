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

const form = document.querySelector("form");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const request = {

        fullName: document.getElementById("fullName").value,

        email: document.getElementById("email").value,

        mobile: document.getElementById("mobile").value,

        subject: document.getElementById("subject").value,

        message: document.getElementById("message").value
    };

    const response = await fetch("/api/contact-messages", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(request)
    });

    if (response.ok) {

        alert("Message sent successfully.");

        form.reset();

    } else {

        alert("Unable to send message.");

    }

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