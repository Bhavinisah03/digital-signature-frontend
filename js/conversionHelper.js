
// This function is used to convert an ArrayBuffer to a base64 string
function toBase64(inputArray) {
  let binary = '';
  const bytes = new Uint8Array(inputArray);
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// This function is used to convert base64 to an ArrayBuffer
function toArrayStream(base64) {
  const binaryString = window.atob(base64);
  const length = binaryString.length;
  const arrayBuffer = new ArrayBuffer(length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < length; i++) {
    view[i] = binaryString.charCodeAt(i);
  }
  return arrayBuffer;
}
