document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    console.log("token: " + token)
    if (!token) {
        // Redirect to login if no token is found
        console.log("token:" + token)
        window.location.href = "./login.html";
    } else {
        // Optionally, verify token with backend
        fetch("http://127.0.0.1:8000/verify_token", {
            method: "GET",
            headers: {"Authorization": "Bearer " + token}
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Invalid token");
                }
                console.log("Valid token: " + token)
                return response.json();
            })
            .catch(() => {
                console.log("Removing invalid token: " + token)
                localStorage.removeItem("token"); // Clear invalid token
                window.location.href = "./login.html"; // Redirect to login
            });
    }
});