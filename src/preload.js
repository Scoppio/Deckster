const fs = require('fs').promises;
const path = require('path');


async function loadTokenFromCredentialsFile() {
  console.log("Loading token from credentials file");
  const userProfile = process.env.USERPROFILE;
  const possiblePaths = [
    path.join(userProfile, "OneDrive\\Documents\\deckster_creds.json"), 
    path.join(userProfile, "OneDrive\\Documentos\\deckster_creds.json"),
    path.join(userProfile, "Documents\\deckster_creds.json"),
    path.join(userProfile, "Documentos\\deckster_creds.json")
  ];

  for (const p of possiblePaths) {
    try {
      await fs.access(p);
      // If fs.access succeeds, the file exists, and we can attempt to read it
      const data = await fs.readFile(p, 'utf8');
      console.log("Token loaded from credentials file");
      return JSON.parse(data).token; // Assuming the JSON structure contains a "token" field
    } catch (error) {
      // If an error occurs (file doesn't exist or can't be read), continue to the next path
      continue;
    }
  }

  // If none of the paths are valid, throw an error or handle it as needed
  throw new Error("Credentials file not found in any of the possible paths.");
}

(async () => {
  try {
    const token = await loadTokenFromCredentialsFile();
    window.userToken = token; // Expose the token on the window object immediately
  } catch (error) {
    console.error("Failed to load token:", error);
  }
})();