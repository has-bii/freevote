export function generateRandomName(extension = "") {
  const timestamp = Date.now(); // Current timestamp
  const randomNum = Math.floor(Math.random() * 100000); // Random number
  const fileExtension = extension.startsWith(".") ? extension : `.${extension}`;
  return `file_${timestamp}_${randomNum}${fileExtension}`;
}
