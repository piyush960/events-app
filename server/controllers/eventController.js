import { loadClient } from "../utils/index.js";
import { google } from "googleapis";

const get_events = async (req, res, next) => {
  try {
    const tokens = JSON.parse(req.query.tokens);
    const isFilterByDate = req.query.filterByDate;
    const filterDate = req.query.filterDate;
    const isFilterByQuery = req.query.filterByQuery;
    const filterQuery = req.query.filterQuery;

    const oAuth2Client = await loadClient();
    oAuth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
    console.log(filterDate);
    const calendarOptions = {
      calendarId: "primary",
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
      ...(isFilterByDate && {
        timeMin: new Date(`${filterDate.split('T')[0]}T00:00:00.000Z`).toISOString(),
        timeMax: new Date(`${filterDate.split('T')[0]}T23:59:59.999Z`).toISOString(),
      }),
      ...(isFilterByQuery && {
        q: filterQuery,
      }),
    };

    console.log(calendarOptions);

    const response = await calendar.events.list(calendarOptions);

    const events = response.data.items;

    if (!events || events.length === 0) {
      res.send("No upcoming events found.");
    } else {
      res.status(200).json(events);
    }
  } catch (err) {
    next(err);
  }
}

async function getEventsByDate(req, res, next) {
  try {
    const tokens = JSON.parse(req.query.tokens);
    const filterDate = req.query.filterDate;
    console.log(req.query);
    const oAuth2Client = await loadClient();
    oAuth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const response = await calendar.events.list({
      calendarId: "primary",
      // timeMin: new Date(filterDate).toISOString(),
      // timeMax: new Date(filterDate).toISOString(),
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
    next(err);
  }
}

const create_event = async (req, res, next) => {
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
    next(error);
  }
}


const udpate_event = async (req, res, next) => {
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
    next(error);
  }
}


const delete_event = async (req, res, next) => {
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
    next(error);
  }
}

export { get_events, create_event, udpate_event, delete_event, getEventsByDate }