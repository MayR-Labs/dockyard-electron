/**
 * Profile Picker Entry Point
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ProfilePickerApp } from './components/ProfilePicker/ProfilePickerApp';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import './styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ProfilePickerApp />
    </ErrorBoundary>
  </React.StrictMode>
);
