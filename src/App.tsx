/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FirebaseProvider, useAuth } from './components/FirebaseProvider';
import { LandingPage } from './components/LandingPage';
import { AppShell } from './components/AppShell';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f5f5f4]">
        <div className="animate-pulse text-sm font-medium tracking-widest uppercase">VIC — VERIFYING</div>
      </div>
    );
  }

  return user ? <AppShell /> : <LandingPage />;
}

export default function App() {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  );
}

