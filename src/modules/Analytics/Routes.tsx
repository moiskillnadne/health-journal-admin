import { Routes, Route, Navigate } from 'react-router-dom';
import Analytics from './Analytics';

export default function () {
  return (
    <Routes>
      <Route index element={<Analytics />} />
    </Routes>
  );
}
