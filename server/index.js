import express from "express";
import { google } from "googleapis";
import fs from "fs/promises";
import path from "path";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

const SCOPES = ['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/userinfo.profile',];

const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

async function loadClient() {
  try {
    // const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH));
    // const { client_secret, client_id, redirect_uris } = credentials.web;
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const redirect_uri = process.env.REDIRECT_URI;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
    return oAuth2Client;
  } catch (err) {
    console.log(err);
  }
}

app.get("/auth", async (req, res) => {
  const authClient = await loadClient();
  const authUrl = authClient.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
  res.status(302).json({authUrl});
});

app.get("/oauth2callback", async (req, res) => {
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
    console.log(error);
    res.status(400).send("Error: Missing code parameter.");
  }
});

app.get("/events", async (req, res) => {
  try {
    const tokens = JSON.parse(req.query.tokens);
    
    const oAuth2Client = await loadClient();
    oAuth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items;
    if (!events || events.length === 0) {
      res.send("No upcoming events found.");
    } else {
      res.status(200).json(events);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching events.");
  }
});

app.post('/events', async (req, res) => {
  try {
    const { data, tokens } = req.body;
    const oAuth2Client = await loadClient();
    oAuth2Client.setCredentials(tokens);
    const event = {
      'summary': data.event_name,
      'location': data.location,
      'description': data.description,
      'start': {
        'dateTime': data.start,
        'timeZone': 'Asia/Kolkata',
      },
      'end': {
        'dateTime': data.end,
        'timeZone': 'Asia/Kolkata',
      }
    };
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
    await calendar.events.insert({
      calendarId: "primary",
      auth: oAuth2Client,
      requestBody: event,
      conferenceDataVersion: 1
    })
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating event.");
  }
})

app.put('/events', async (req, res) => {
  try {
    const { data, tokens } = req.body;
    const oAuth2Client = await loadClient();
    oAuth2Client.setCredentials(tokens);
    const event = {
      'summary': data.event_name,
      'location': data.location,
      'description': data.description,
      'start': {
        'dateTime': data.start,
        'timeZone': 'Asia/Kolkata',
      },
      'end': {
        'dateTime': data.end,
        'timeZone': 'Asia/Kolkata',
      }
    };
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
    await calendar.events.update({
      calendarId: "primary",
      auth: oAuth2Client,
      eventId: data.id,
      requestBody: event,
      conferenceDataVersion: 1
    })
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating event.");
  }
})

app.delete('/events', async (req, res) => {
  try {
    const tokens = JSON.parse(req.query.tokens);
    const eventId = req.query.eventId;
    const oAuth2Client = await loadClient();
    oAuth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
    await calendar.events.delete({
      calendarId: "primary", 
      eventId,
    })
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating event.");
  }
})

app.get('/logout', async (req, res) => {
  try {
    const { token } = req.query;
    const oAuth2Client = await loadClient();
    oAuth2Client.setCredentials({access_token: token});

    await oAuth2Client.revokeToken(token);

    res.status(200).json({ message: 'Token revoked successfully' });
  } catch (error) {
    console.error('Error revoking token:', error.message);
    res.status(500).json({ error: 'Failed to revoke token' });
  }
})

app.get('/ping', (req, res) => {
  res.json('pong')
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
