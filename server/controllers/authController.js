import { loadClient } from "../utils/index.js";
import { google } from "googleapis";

const SCOPES = ['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/userinfo.profile',];

const process_auth = async (req, res, next) => {
  try {
    const authClient = await loadClient();
    const authUrl = authClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: SCOPES,
    });
    res.status(302).json({authUrl});
  } catch (error) {
    next(error);
  }
}

const process_callback = async (req, res, next) => {
  try {
    const { oauthCode } = req.query;
    const oAuth2Client = await loadClient();
    const { tokens } = await oAuth2Client.getToken(oauthCode);
    oAuth2Client.setCredentials(tokens)
  
    const oauth2 = google.oauth2({
      version: "v2",
      auth: oAuth2Client
    })
    const userInfo = await oauth2.userinfo.get();
    res.status(302).json({tokens, userInfo});
    } catch (error) {
      next(error);
    }
}

const process_logout = async (req, res, next) => {
  try {
    const { token } = req.query;
    const oAuth2Client = await loadClient();
    oAuth2Client.setCredentials({access_token: token});

    await oAuth2Client.revokeToken(token);

    res.status(200).json({ message: 'Token revoked successfully' });
  } catch (error) {
    next(error);
  }
}

export { process_auth, process_callback, process_logout }