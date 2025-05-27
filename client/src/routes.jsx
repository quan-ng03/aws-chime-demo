import { Routes, Route } from 'react-router-dom';
import App from './App';
import MeetingPage from './pages/MeetingPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/meeting" element={<MeetingPage />} />
    </Routes>
  )
}
