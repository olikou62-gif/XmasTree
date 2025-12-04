import React from 'react';
import { TreeMorphState, AppState } from '../types';
import { Layers, Box, RotateCw, Music } from 'lucide-react';

interface UIOverlayProps {
  appState: AppState;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ appState }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10 text-white select-none">
      
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(255,0,127,0.8)]">
            ARIX SIGNATURE
          </h1>
          <p className="text-xs text-cyan-300 font-mono mt-1 tracking-[0.3em] opacity-80">
            INTERACTIVE CHRISTMAS PROJECT // V.2.0.24
          </p>
        </div>
        <div className="border border-pink-500/50 p-2 bg-black/40 backdrop-blur-md rounded-sm">
           <div className="flex items-center gap-2 text-pink-400 animate-pulse">
             <div className="w-2 h-2 bg-green-400 rounded-full"></div>
             <span className="text-xs font-mono">SYSTEM ONLINE</span>
           </div>
        </div>
      </div>

      {/* Center Reticle (Decorative) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none flex items-center justify-center">
        <div className="w-[380px] h-[380px] border border-white/5 rounded-full border-dashed animate-spin-slow" style={{ animationDuration: '20s' }}></div>
      </div>

      {/* Controls Footer */}
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4 pointer-events-auto">
        
        {/* State Toggles */}
        <div className="flex gap-4">
          <button
            onClick={() => appState.setMorphState(TreeMorphState.SCATTERED)}
            className={`
              group relative px-6 py-3 font-mono text-sm border-2 transition-all duration-300 overflow-hidden
              ${appState.morphState === TreeMorphState.SCATTERED 
                ? 'border-cyan-400 text-black bg-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.6)]' 
                : 'border-cyan-400/30 text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] bg-black/50'}
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Layers size={16} /> CHAOS_MODE
            </span>
          </button>

          <button
            onClick={() => appState.setMorphState(TreeMorphState.TREE_SHAPE)}
            className={`
              group relative px-6 py-3 font-mono text-sm border-2 transition-all duration-300
              ${appState.morphState === TreeMorphState.TREE_SHAPE 
                ? 'border-pink-500 text-black bg-pink-500 shadow-[0_0_20px_rgba(255,0,127,0.6)]' 
                : 'border-pink-500/30 text-pink-500 hover:border-pink-500 hover:shadow-[0_0_15px_rgba(255,0,127,0.4)] bg-black/50'}
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Box size={16} /> TREE_FORM
            </span>
          </button>
        </div>

        {/* Action Toggles */}
        <div className="flex gap-2">
           <button 
             onClick={() => appState.setIsRotating(!appState.isRotating)}
             className={`p-3 border transition-all duration-300 ${appState.isRotating ? 'border-green-400 text-green-400 bg-green-400/20' : 'border-white/20 text-white/50 hover:text-white hover:border-white'}`}
           >
             <RotateCw size={20} className={appState.isRotating ? 'animate-spin' : ''} />
           </button>
        </div>

      </div>
      
      {/* Decorative Glitch Text */}
      <div className="absolute bottom-6 right-6 md:right-auto md:left-1/2 md:-translate-x-1/2 text-[10px] text-white/30 font-mono text-center leading-tight">
        DATA STREAM: CONNECTED<br/>
        PARTICLES: 3650<br/>
        FPS: STABLE
      </div>

    </div>
  );
};

export default UIOverlay;
