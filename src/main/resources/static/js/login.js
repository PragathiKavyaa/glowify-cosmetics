const form = document.getElementById("loginForm");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const loginData = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    try {

        const response = await fetch("/api/users/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(loginData)

        });

        if (response.ok) {

            const user = await response.json();

            localStorage.setItem("userId", user.id);
            localStorage.setItem("userName", user.name);
            localStorage.setItem("userEmail", user.email);

            // const user = await response.json();

            // console.log(user);

            alert("Login Successful!");

            window.location.href = "/html/home.html";

        } else {

            const message = await response.text();

            alert(message);

        }
    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");

    }

});

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