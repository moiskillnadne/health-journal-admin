import { Routes, Route, Navigate } from 'react-router-dom';

import {
  Authentication,
  Analytics,
  ContentStorage,
  Gallery,
  Notifications,
  Tracks,
  Users,
} from './modules';

import { ProtectedRoute } from './utils/components';
import Layout from './components/Layout';

export default function () {
  return (
    <Routes>
      <Route path="/*" element={<Authentication />} />
      <Route path="admin" element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="gallery" replace />} />;
          <Route path="analytics/*" element={<Analytics />} />
          <Route path="content-storage/*" element={<ContentStorage />} />
          <Route path="gallery/*" element={<Gallery />} />
          <Route path="notifications/*" element={<Notifications />} />
          <Route path="tracks/*" element={<Tracks />} />
          <Route path="admin-users/*" element={<Users />} />
        </Route>
      </Route>
    </Routes>
  );
}
