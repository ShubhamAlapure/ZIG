import React from 'react';
import { useAppStore } from '@/app/store';
import { ParkLoginView } from './components/ParkLoginView';
import { MuseumView } from './components/MuseumView';

export const App: React.FC = () => {
  const { isAuthenticated } = useAppStore();

  return (
    <div className="w-full h-full min-h-screen bg-[#0D0A08] text-[#F5F0E8] overflow-hidden">
      {isAuthenticated ? (
        <MuseumView key="museum-view" />
      ) : (
        <ParkLoginView key="login-view" />
      )}
    </div>
  );
};

export default App;
