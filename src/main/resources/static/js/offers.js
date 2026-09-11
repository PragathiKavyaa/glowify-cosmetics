//Shop Menu

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

const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const searchBox = document.querySelector(".search-box");

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

const API="http://localhost:8080/api/offers/active";

async function loadOffers(){

const response=await fetch(API);

const offers=await response.json();

const container=document.getElementById("offerContainer");

container.innerHTML="";

offers.forEach(offer=>{

container.innerHTML+=createCard(offer);

});

}

loadOffers();

function createCard(offer){

let priceHTML="";

if(offer.offerType==="PERCENTAGE"){

priceHTML=`

<p class="price">

₹${offer.offerPrice}

<strike>

₹${offer.originalPrice}

</strike>

</p>

`;

}

if(offer.offerType==="BUY_ONE_GET_ONE"){

priceHTML=`

<p class="price">

Buy ${offer.buyQuantity}

Get ${offer.freeQuantity} FREE

</p>

`;

}

return `

<div class="card">

<div class="image-box">

<img src="${offer.productImage}">

</div>

<h3>

${offer.productName}

</h3>

<p>

${offer.offerTitle}

</p>

${priceHTML}

<button class="cart" onclick="addOfferToCart(${offer.id})">

Add To Cart

</button>

</div>

`;

}

async function addOfferToCart(offerId){

const userId = localStorage.getItem("userId");

if(!userId){

alert("Please login");

return;

}

await fetch(

`http://localhost:8080/api/offers/cart/${offerId}?userId=${userId}`,

{

method:"POST"

});

alert("Offer Added Successfully");

}

// ==========================================
// JOIN THE INNER CIRCLE - SUBSCRIBE
// ==========================================

const registerBtn = document.querySelector("#registerBtn");
const emailInput = document.querySelector("#subscriberEmail");

if (registerBtn && emailInput) {

    registerBtn.addEventListener("click", async () => {

        const email = emailInput.value.trim();

        if (!email) {
            alert("Please enter your email.");
            return;
        }

        try {

            const response = await fetch("/api/subscribers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email
                })
            });

            const message = await response.text();

            console.log("Backend response:", message);

            if (response.ok) {

                alert("Subscribed Successfully!");

                emailInput.value = "";

            } else if (response.status === 409) {

                alert("This email is already subscribed.");

            } else {

                alert("Unable to subscribe. Please try again.");

            }

        } catch (error) {

            console.error("Subscriber error:", error);

            alert("Unable to subscribe. Please try again.");
        }
    });
}