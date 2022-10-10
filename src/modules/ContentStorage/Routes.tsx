import { Routes, Route } from 'react-router-dom';
import ContentStorage from './ContentStorage';

export default function () {
  return (
    <Routes>
      <Route index element={<ContentStorage />} />
    </Routes>
  );
}
