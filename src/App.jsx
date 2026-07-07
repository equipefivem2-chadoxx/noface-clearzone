import React from 'react';

function App() {
  return (
    <div style={{ 
      backgroundColor: '#020617', 
      height: '100vh', 
      width: '100vw', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'monospace',
      margin: 0,
      padding: 0
    }}>
      <h1 style={{ fontSize: '2rem', letterSpacing: '0.1em', marginBottom: '10px' }}>
        IRIS'STUDIO - CLEARZONE
      </h1>
      <p style={{ color: '#64748b' }}>STATUS: ONLINE</p>
    </div>
  );
}

export default App;