import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PresenterPage from './pages/PresenterPage';
import ParticipantPage from './pages/ParticipantPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/present" element={<PresenterPage />} />
        <Route path="/join" element={<ParticipantPage />} />
        <Route path="*" element={<Navigate to="/present" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
