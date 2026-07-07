import React from 'react';

function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-slate-950 text-slate-200 select-none">
      <header className="absolute top-0 left-0 w-full h-14 bg-slate-900/80 backdrop-blur-md z-[1000] flex items-center justify-between px-6 border-b border-slate-700/80 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
          <h1 className="text-xl font-black tracking-widest text-white">
            OPERATIONS <span className="text-slate-500">|</span> SAN ANDREAS
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-mono text-slate-400">
          <span className="bg-slate-800 px-3 py-1 rounded border border-slate-700">STATUS: ONLINE</span>
        </div>
      </header>

      <main className="flex-1 relative mt-14 flex items-center justify-center">
        <h2 className="text-2xl font-mono text-slate-500">Interface chargée. En attente du module Carte...</h2>
      </main>
    </div>
  );
}

export default App;