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


const products = JSON.parse(localStorage.getItem("searchResults")) || [];

const resultContainer = document.getElementById("searchResults");

const heading = document.getElementById("searchHeading");



heading.innerHTML = `${products.length} Product(s) Found`;



if (products.length == 0) {

    resultContainer.innerHTML = `
            
                <div class="empty">

                    <i class="fa-solid fa-face-frown"></i>

                    <h2>No Products Found</h2>

                    <a href="/html/home.html">Continue Shopping</a>

                </div>

            `;

}

else {

    products.forEach((product, index) => {

        resultContainer.innerHTML += `
        <div class="product-card">
            <img src="${product.image}">
            <h3>${product.name}</h3>
            <p>${product.brand}</p>
            <h4>₹${product.price}</h4>

            <button onclick="viewProduct(${index})">
                View Product
            </button>
        </div>
    `;
    });

}

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

function viewProduct(index) {

    const products = JSON.parse(localStorage.getItem("searchResults")) || [];
    const product = products[index];

    const category = product.category.trim().toLowerCase();

    console.log("Category:", category);

    const pages = {
        "fragrance": "fragrance.html",
        "lipsticks": "lipsticks.html",
        "skincare": "skincare.html",
        "haircare": "haircare.html",
        "hair care": "haircare.html",
        "eye-makeup": "eyemakeup.html",
        "eyemakeup": "eyemakeup.html",
        "eye makeup": "eyemakeup.html",
        "nails": "nails.html"
    };

    if (pages[category]) {
        window.location.href = "/html/" + pages[category];
    } else {
        alert("Unknown category: " + category);
    }
}