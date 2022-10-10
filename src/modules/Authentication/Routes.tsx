import { Routes, Navigate, Route } from 'react-router-dom';
import { Layout } from './Layout';
import LogIn from './LogIn';
import ConfirmNewPassword from './ConfirmNewPassword';
import RestorePassword from './RestorePassword';

export default function () {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="login" replace />} />;
        <Route path="login" element={<LogIn />} />
        <Route path="restore-password" element={<RestorePassword />} />
        <Route path="restore-password-request" element={<ConfirmNewPassword />} />
      </Route>
    </Routes>
  );
}
