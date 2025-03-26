// This global variable contains private and public key used to sign the message and verify the signature.
let rsaKeyPair;
let signature;
let inputMessageFieldId = "id-input-message"
let signedMessageFieldId = "id-signed-message"
let senderEmailFieldId = "id-input-email"
let verificationResultFiledId = "id-verification-result"

/**
 * This function generates RSA key pair using RSA-PSS algorithm and initialized global variable rsaKeyPair
 * refer https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey
 * @returns nothing
 *
 * Alternatively we can provide static value for public and private key but this funcition is used to create
 * private and public key each time page is loaded.
 */
async function initializeKeyPairWithRSAAlgorithm() {
    rsaKeyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-PSS",
            modulusLength: 2048, // Key size
            publicExponent: new Uint8Array([1, 0, 1]), // 65537
            hash: "SHA-256",
        },
        true,
        ["sign", "verify"] // Use keys to sign and verify messages.
    );
}

async function signMessage() {
    const inputMessage = document.getElementById(inputMessageFieldId).value;

    if (!inputMessage || inputMessage.trim() === "") {
        alert("Please enter a non-empty message to sign.");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/sign/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: inputMessage,
                user: "bhavini.1@gmail.com"
            })
        });

        const data = await response.json();
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
    // const verificationResult = document.getElementById(verificationResultFiledId);
    // verificationResult.textContent = "";
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
        const response = await fetch("http://127.0.0.1:8000/verify/", {
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

    // // Convert the signature back from base64 to Uint8Array
    // let based64Signature;
    // try {
    //     based64Signature = toArrayStream(signatureBase64);
    // } catch (error) {
    //     // console.error('Signature is not valid base 64 version:', error.message);
    //     return false;
    // }
    //
    // // Convert message to ArrayBuffer
    // const textEncoder = new TextEncoder();
    // const encodedInputMessage = textEncoder.encode(inputMessage);
    //
    // // Verify the signature
    // const isValid = await window.crypto.subtle.verify(
    //     {
    //         name: "RSA-PSS",
    //         saltLength: 32,
    //     },
    //     rsaKeyPair.publicKey,
    //     based64Signature,
    //     encodedInputMessage
    // );
    // return isValid;
}


/**
 * This function is used to check if signature is valid for the given message using public key and show relevant
 * message in UI.
 */
async function populateVerificationResult() {

    // Verify the signature
    const isValid = await isSignatureValid()

    // alert(isValid)

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

// Initialize the RSA key pair when the page loads
window.onload = initializeKeyPairWithRSAAlgorithm;
