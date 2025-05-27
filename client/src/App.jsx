import { useNavigate } from 'react-router-dom';
import { useState} from 'react';
import { 
  MeetingProvider,
  PreviewVideo,
  useLocalVideo
} from 'amazon-chime-sdk-component-library-react';

function PreJoinScreen() {

  const [displayName, setDisplayname] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const navigate = useNavigate();
  const { toggleVideo } = useLocalVideo();

  const handleJoin = () => {
    localStorage.setItem('displayname', displayName);
    localStorage.setItem('meetingId', meetingId);
    navigate('/meeting');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <p>Display Name:</p>
      <input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayname(e.target.value)}
        placeholder="Enter Here"
        className="text-center border border-gray-300 rounded px-2 py-1"
      />

      <p>Meeting ID:</p>
      <input
        type="text"
        value={meetingId}
        onChange={(e) => setMeetingId(e.target.value)}
        placeholder="Enter Here"
        className="text-center border border-gray-300 rounded px-2 py-1"
      />

      <PreviewVideo className="w-64 h-48 rounded shadow-md" />
      <button
        onClick={toggleVideo}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Toggle Camera
      </button>

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleJoin}
      >
        Go to Meeting
      </button>
    </div>
  );
}

export default function App() {
  return (
    <MeetingProvider>
      <PreJoinScreen />
    </MeetingProvider>
  );
};
