import React, { useState } from 'react';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';
import { TreeMorphState, AppState } from './types';

const App: React.FC = () => {
  const [morphState, setMorphState] = useState<TreeMorphState>(TreeMorphState.SCATTERED);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  const appState: AppState = {
    morphState,
    setMorphState,
    isRotating,
    setIsRotating,
  };

  return (
    <div className="relative w-full h-screen bg-neutral-950 overflow-hidden">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene appState={appState} />
      </div>

      {/* UI Overlay Layer */}
      <UIOverlay appState={appState} />
      
      {/* Vignette Overlay (CSS fallback) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-20"></div>
    </div>
  );
};

export default App;
