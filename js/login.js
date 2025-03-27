// import { DIGITAL_SERVICE_BASE_URL } from './constants.js';

// This global variable contains private and public key used to login and logout.
let authorEmailFieldId = "id-input-email"
let authorPasswordFieldId = "id-input-password"
let errorMessageFiledId = "id-error-message"

/**
 * This function generates RSA key pair using RSA-PSS algorithm and initialized global variable
 * refer https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey
 * @returns nothing
 *
 * Alternatively we can provide static value for public and private key but this funcition is used to create
 * private and public key each time page is loaded.
 */

async function authorLogin() {
    const authorEmail = document.getElementById(authorEmailFieldId).value;
    const authorPassword = document.getElementById(authorPasswordFieldId).value;
    const errorMessageFiled = document.getElementById(errorMessageFiledId);

    if (!authorEmail || authorEmail.trim() === "" || !authorPassword || authorPassword.trim() === "") {
        errorMessageFiled.textContent = "Please enter a non-empty email and password to login."
        return;
    }

    try {
        const response = await fetch(DIGITAL_SERVICE_BASE_URL + "/author_login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "username": authorEmail,
                "password": authorPassword
            })
        });
        const data = await response.json();
        if(data.valid) {
            localStorage.setItem("token", data.access_token); // Save token
            window.location.href = "./generate_signature.html"; // Redirect to sign page
        } else {
            errorMessageFiled.textContent = "Invalid email or password!"
        }
    } catch (error) {
        let errorMsg = "Could not validate credentials. Please try after some time";
        console.error(errorMsg, error);
        errorMessageFiled.textContent = errorMsg;
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "./login.html";  // Redirect to login page
}