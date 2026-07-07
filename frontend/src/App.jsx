import React from 'react';
import Map from './components/Map/Map';
// Les autres composants seront importés ici au fur et à mesure

function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col">
      {/* Header Tactique */}
      <header className="absolute top-0 left-0 w-full h-14 glass-panel z-[1000] flex items-center justify-between px-6 border-b border-slate-700/80">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
          <h1 className="text-xl font-black tracking-widest text-white">
            OPERATIONS <span className="text-slate-500">|</span> SAN ANDREAS
          </h1>
        </div>
        
        <div className="flex items-center gap-4 text-sm font-mono text-slate-400">
          <span>IRIS'STUDIO SYSTEM</span>
          <span className="bg-slate-800 px-3 py-1 rounded border border-slate-700">STATUS: ONLINE</span>
        </div>
      </header>

      {/* Zone principale (Carte + UI superposée) */}
      <main className="flex-1 relative mt-14">
        {/* La carte est en fond (z-0) */}
        <Map />
        
        {/* Les futurs panneaux viendront se superposer ici (z-10+) */}
        {/* <Units /> */}
        {/* <History /> */}
      </main>
    </div>
  );
}

export default App;