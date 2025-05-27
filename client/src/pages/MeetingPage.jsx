import {
  MeetingProvider,
  MeetingStatus,
  AudioInputControl,
  VideoInputControl,
  ContentShareControl,
  VideoTileGrid
} from 'amazon-chime-sdk-component-library-react';
import { useEffect, useState } from 'react';

function MeetingPage() {
  const [meetingInfo, setMeetingInfo] = useState(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      const meetingId = localStorage.getItem('meetingId');
      const displayName = localStorage.getItem('displayName');

      const res = await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId, displayName }),
      });

      const data = await res.json();
      setMeetingInfo(data);
    };

    fetchMeeting();
  }, []);

  if (!meetingInfo) return <p className="text-center mt-10">Loading meeting...</p>;

  return (
    <MeetingProvider
      {...meetingInfo}
      onError={(e) => console.error('Chime error:', e)}
    >
      <div className="p-4">
        <MeetingStatus />
        <div className="flex justify-center my-4 gap-2">
          <AudioInputControl />
          <VideoInputControl />
          <ContentShareControl />
        </div>
        <VideoTileGrid className="grid grid-cols-2 gap-4" />
      </div>
    </MeetingProvider>
  );
}

export default MeetingPage;
