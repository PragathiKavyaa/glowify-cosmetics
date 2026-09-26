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

const wishlistContainer = document.getElementById("wishlistItems");

let wishlist = [];

async function loadWishlist() {

    try {

        const response = await fetch("/wishlist/1");

        wishlist = await response.json();

        displayWishlist();

    } catch (error) {

        console.error(error);

    }

}

function displayWishlist() {

    wishlistContainer.innerHTML = "";

    if (wishlist.length === 0) {

        wishlistContainer.innerHTML = `
        
        <div class="empty-wishlist">

            <i class="fa-regular fa-heart"></i>

            <h2>Your Wishlist is Empty</h2>

            <p>Add your favourite products to see them here.</p>

        </div>

        `;

        return;
    }

    wishlist.forEach((item, index) => {

        wishlistContainer.innerHTML += `

        <div class="wishlist-card">

            <div class="wishlist-left">

                <img src="${item.image}" alt="${item.productName}">

                <div class="product-details">

                    <h2>${item.productName}</h2>

                    <p>Beauty Product</p>

                    <div class="price">₹${item.price}</div>

                </div>

            </div>

            <div class="wishlist-right">

                <button class="cart-btn" onclick="moveToCart(${index})">

                    <i class="fa-solid fa-cart-shopping"></i>

                    Add to Cart

                </button>

                <button class="remove-btn" onclick="removeWishlist(${item.id})">

                    <i class="fa-solid fa-trash"></i>

                    Remove

                </button>

            </div>

        </div>

        `;

    });

}

async function removeWishlist(id) {

    try {

        const response = await fetch("/wishlist/" + id, {

            method: "DELETE"

        });

        if (response.ok) {

            // Remove from the array
            wishlist = wishlist.filter(item => item.id !== id);

            // Refresh the page content
            await loadWishlist();

            alert("Product removed from wishlist.");

        } else {

            alert("Failed to remove product.");

        }

    } catch (error) {

        console.error(error);

    }

}

async function moveToCart(index) {

    const item = wishlist[index];

    try {

        // Add to Cart
        const cartResponse = await fetch("/api/cart", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                productName: item.productName,
                price: item.price,
                image: item.image,
                quantity: 1

            })

        });

        if (cartResponse.ok) {

            // Remove from Wishlist
            const deleteResponse = await fetch("/wishlist/" + item.id, {

                method: "DELETE"

            });

            if (deleteResponse.ok) {

                wishlist = wishlist.filter(product => product.id !== item.id);

                displayWishlist();

                alert("Moved to Cart Successfully");

            }

        } else {

            alert("Failed to add product to cart.");

        }

    } catch (error) {

        console.error(error);

    }

}

loadWishlist();

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