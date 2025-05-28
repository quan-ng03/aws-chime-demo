import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  ChimeSDKMeetingsClient,
  CreateMeetingCommand,
  CreateAttendeeCommand,
} from "@aws-sdk/client-chime-sdk-meetings";
import { fromIni } from "@aws-sdk/credential-provider-ini";

dotenv.config();
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const client = new ChimeSDKMeetingsClient({
  region: "us-east-1",
  credentials: fromIni({ profile: "default" }),
});

// In-memory cache (resets when server restarts)
const meetingStore = {};  // title => meeting
const attendeeStore = {}; // title => { attendeeId: attendee }

app.post("/join", async (req, res) => {
  const { title, username } = req.body;

  if (!title || !username) {
    return res.status(400).json({ error: 'Missing title or username' });
  }

  try {
    // Reuse existing meeting if it exists
    if (!meetingStore[title]) {
      const meetingResponse = await client.send(
        new CreateMeetingCommand({
          ClientRequestToken: title, // using title as idempotent token
          MediaRegion: 'us-east-1',
          ExternalMeetingId: title.substring(0, 64) // required to be <= 64 chars
        })
      );
      meetingStore[title] = meetingResponse.Meeting;
      attendeeStore[title] = {};
    }

    const meeting = meetingStore[title];

    const attendeeResponse = await client.send(new CreateAttendeeCommand({
      MeetingId: meeting.MeetingId,
      ExternalUserId: username
    }));

    attendeeStore[title][attendeeResponse.Attendee.AttendeeId] = {
      ...attendeeResponse.Attendee,
      name: username
    };

    res.json({
      Meeting: meeting,
      Attendee: {
        attendeeId: attendeeResponse.Attendee.AttendeeId,
        joinToken: attendeeResponse.Attendee.JoinToken,
      },
    });

    console.log(`[JOIN] ${username} joined ${title}`);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/attendee', (req, res) => {
  const { title, attendeeId } = req.query;

  const attendeeInfo = attendeeStore[title]?.[attendeeId];
  if (!attendeeInfo) {
    return res.status(404).json({ name: 'Unknown' });
  }

  res.json({ name: attendeeInfo.name });
});


app.listen(port, () => {
  console.log(`Chime backend listening at http://localhost:${port}`);
});
