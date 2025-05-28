window.global = window;

import { useEffect, useState } from 'react';
import {
  MeetingProvider,
  useMeetingManager,
  DeviceLabels,
  useAudioVideo,
  useLocalVideo,
  VideoTileGrid,
} from 'amazon-chime-sdk-component-library-react';
import { MeetingSessionConfiguration } from 'amazon-chime-sdk-js';

function MeetingView() {
  const { toggleVideo } = useLocalVideo();
  const audioVideo = useAudioVideo();

  useEffect(() => {
    audioVideo.startLocalVideoTile();
  }, [audioVideo]);

  return (
    <div className="mt-6 p-4 bg-white shadow-2xl w-[640px] h-[480px]">
      <VideoTileGrid layout="standard" />
      <button
        onClick={toggleVideo}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Toggle Camera
      </button>
    </div>
  );
}

const JoinMeeting = ({ setHasJoined, setUsername, username }) => {
  const meetingManager = useMeetingManager();

  const join = async () => {
    // 1) Call your backend
    try {
      const res = await fetch('http://localhost:4000/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'demo-room', username }),
    });
    const data = await res.json();
    // 2) Build the Chime config
    const config = new MeetingSessionConfiguration(
      data.Meeting,
      data.Attendee
    );

    // 3) Join & start (requests mic+cam)
    await meetingManager.join(config, {
      deviceLabels: DeviceLabels.AudioAndVideo,
    });

    meetingManager.getAttendee = async (chimeAttendeeId) => {
      const res = await fetch(`http://localhost:4000/attendee?title=demo-room&attendeeId=${chimeAttendeeId}`);
      const data = await res.json();
      return { name: data.name};
    };

    await meetingManager.start();
    setHasJoined(true);
    } catch (err) {
      console.error('Error joining meeting:', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="px-3 py-2 border rounded w-64"
      />
      <button
        onClick={join}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Join Meeting
      </button>
    </div>
  );
}

export default function App() {
  const [hasJoined, setHasJoined] = useState(false);
  const [username, setUsername] = useState('');

  return (
    <MeetingProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        {hasJoined ? (
          <MeetingView />
        ) : (
          <JoinMeeting
            setHasJoined={setHasJoined}
            username={username}
            setUsername={setUsername}
          />
        )}
      </div>
    </MeetingProvider>
  );
}
