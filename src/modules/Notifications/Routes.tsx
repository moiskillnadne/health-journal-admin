import { Routes, Route, Navigate } from 'react-router-dom';
import CustomForm from './CustomForm';
import NotificationTabs from './NotificationTabs';
import PredefinedForm from './PredefinedForm';

export default function () {
  return (
    <Routes>
      <Route index element={<NotificationTabs />} />
      <Route path="add-custom-notification" element={<CustomForm />} />
      <Route path="edit-predefined-notification" element={<PredefinedForm />} />
      <Route path="edit-custom-notification" element={<CustomForm />} />
    </Routes>
  );
}
