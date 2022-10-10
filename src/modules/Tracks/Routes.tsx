import { Routes, Route, Navigate } from 'react-router-dom';
import NewTrack from './NewTrack';
import Tracks from './Tracks';

export default function () {
  return (
    <Routes>
      <Route index element={<Tracks />} />
      <Route path="new-track" element={<NewTrack />} />
      <Route path="edit-track" element={<NewTrack />} />
    </Routes>
  );
}
