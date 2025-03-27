// import { DIGITAL_SERVICE_BASE_URL } from './constants.js';

// This global variable contains private and public key used to sign the message and verify the signature.
let inputMessageFieldId = "id-input-message"
let signedMessageFieldId = "id-signed-message"
let senderEmailFieldId = "id-input-email"
let verificationResultFiledId = "id-verification-result"

/**
 * This function generates RSA key pair using RSA-PSS algorithm and initialized global variable
 * refer https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey
 * @returns nothing
 *
 * Alternatively we can provide static value for public and private key but this funcition is used to create
 * private and public key each time page is loaded.
 */

async function signMessage() {
    const inputMessage = document.getElementById(inputMessageFieldId).value;

    if (!inputMessage || inputMessage.trim() === "") {
        alert("Please enter a non-empty message to sign.");
        return;
    }

    try {
        const response = await fetch(DIGITAL_SERVICE_BASE_URL + "/sign/", {
            method: "POST",
            headers: { "Content-Type": "application/json" ,
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({
                message: inputMessage
            })
        });
        const data = await response.json();
        if(response.status == 401) {
            window.location.href = "./login.html"; // Redirect to login page
        }
        console.log("Signature:", data.signature);
        return data.signature;
    } catch (error) {
        console.error("Error:", error);
        return "Error signing message";
    }
}

async function populateSignedMessage() {

    let signature = await signMessage()
    document.getElementById(signedMessageFieldId).value = signature;
}

/**
 * This function is used to check if signature is valid for the given message using public key.
 * @returns true if signature is valid, false otherwise.
 */
async function isSignatureValid() {
    const inputMessage = document.getElementById(inputMessageFieldId).value;
    const signatureBase64 = document.getElementById(signedMessageFieldId).value;
    const senderEmail = document.getElementById(senderEmailFieldId).value;

    if (!inputMessage || !signatureBase64 || !senderEmail
        || inputMessage.trim() === "" || signatureBase64.trim() === "" || senderEmail.trim() === "") {
        alert("Please provide message, signature and sender's email!");
        return false;
    }
    try {
        const response = await fetch(DIGITAL_SERVICE_BASE_URL + "/verify/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: inputMessage,
                signature: signatureBase64,
                user: senderEmail
            })
        });

        const data = await response.json();
        console.log("valid:", data.valid);

        return data.valid;
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}

/**
 * This function is used to check if signature is valid for the given message using public key and show relevant
 * message in UI.
 */
async function populateVerificationResult() {

    // Verify the signature
    const isValid = await isSignatureValid()

    // Show verification result
    const verificationResult = document.getElementById(verificationResultFiledId);
    if (isValid) {
        verificationResult.textContent = "Signature provided is valid!";
        verificationResult.style.color = "green";
    } else {
        verificationResult.textContent = "Signature provided is invalid.";
        verificationResult.style.color = "red";
    }
}