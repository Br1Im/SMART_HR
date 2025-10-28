import React from 'react';
import { Navigation } from './Navigation';

interface CrmLayoutProps {
  children: React.ReactNode;
}

export const CrmLayout: React.FC<CrmLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
};