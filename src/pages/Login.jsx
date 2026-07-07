import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Fingerprint, ShieldCheck, Terminal } from 'lucide-react';

function Login() {
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // On regarde ce que le backend (Discord) nous a renvoyé dans l'URL
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      // 1. On sauvegarde le token pour que App.jsx le voie
      localStorage.setItem('auth_token', token);
      
      // 2. On redirige vers l'accueil
      navigate('/');
    }

    if (error) {
      if (error === 'unauthorized') setErrorMsg("Accès refusé. Vous n'avez pas le grade requis (LSPD/BCSO).");
      else setErrorMsg("Erreur lors de l'authentification avec Discord.");
    }
  }, [location, navigate]);

  const handleDiscordLogin = () => {
    setIsScanning(true);
    // On redirige directement vers la route de ton backend qui gère Discord
    window.location.href = '/auth/discord';
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
      
      {/* GRILLE TACTIQUE ET ARRIÈRE-PLAN */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-0 opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* BOÎTE DE CONNEXION */}
      <div className="relative z-10 w-full max-w-md p-10 bg-[#050505]/90 backdrop-blur-2xl border border-neutral-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center text-center overflow-hidden">
        
        {/* Ligne de scan du terminal */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>

        {/* Icône principale */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
          {isScanning ? (
            <Fingerprint className="w-20 h-20 text-white animate-pulse relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
          ) : (
            <Lock className="w-20 h-20 text-neutral-400 relative z-10" />
          )}
        </div>

        {/* Textes */}
        <h1 className="text-3xl font-black text-white tracking-[0.2em] mb-2 uppercase">
          Accès <span className="font-light text-neutral-500">Restreint</span>
        </h1>
        <p className="text-neutral-500 text-xs mb-10 font-mono tracking-widest uppercase">
          Identification requise pour continuer
        </p>

        {/* AFFICHAGE DES ERREURS DISCORD */}
        {errorMsg && (
          <div className="w-full mb-6 py-3 px-4 bg-red-950/50 border border-red-500/50 rounded text-red-400 text-xs font-mono">
            {errorMsg}
          </div>
        )}

        {/* Bouton de connexion Discord */}
        <button 
          onClick={handleDiscordLogin}
          disabled={isScanning}
          className="group relative w-full py-4 bg-black border border-neutral-700 hover:border-white rounded text-neutral-400 hover:text-black hover:bg-white transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
        >
          {isScanning ? (
            <span className="font-mono text-sm tracking-[0.2em] uppercase font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4 animate-bounce" /> Redirection...
            </span>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5 group-hover:text-black transition-colors" />
              <span className="font-mono text-sm tracking-[0.2em] uppercase font-bold">
                Portail Discord
              </span>
            </>
          )}
        </button>

        {/* Message de sécurité (Whitelist) */}
        <div className="mt-8 pt-6 border-t border-neutral-900 w-full flex flex-col gap-2">
          <div className="flex items-center justify-center gap-2 text-[9px] text-neutral-600 font-mono tracking-widest">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            SYSTÈME SÉCURISÉ LSPD / BCSO
          </div>
          <div className="text-[9px] text-neutral-700 font-mono tracking-wider">
            Clearance level : 1427651124231405610 / 1427651123606589446
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;