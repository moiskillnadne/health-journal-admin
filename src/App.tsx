import { StrictMode } from 'react';

import { ApplicationProvider } from './providers';

import { i18nManager } from './i18n';

import Routes from './Routes';

import './global.css';

i18nManager.initialize();

export default function App() {
  return (
    <StrictMode>
      <ApplicationProvider>
        <Routes />
      </ApplicationProvider>
    </StrictMode>
  );
}
