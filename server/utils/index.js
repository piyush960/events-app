import { google } from "googleapis";

const loadClient = async () => {
  try {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const redirect_uri = process.env.REDIRECT_URI;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
    return oAuth2Client;
  } catch (err) {
    throw err;
  }
}

export { loadClient }