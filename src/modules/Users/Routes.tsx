import { Routes, Route } from 'react-router-dom';
import Users from './Users';

export default function () {
  return (
    <Routes>
      <Route index element={<Users />} />
    </Routes>
  );
}
