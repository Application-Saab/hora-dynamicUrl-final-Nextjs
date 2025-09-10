'use client';
import React, { useEffect, useState } from 'react';

export default function A2HSPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
  const dismissed = localStorage.getItem('a2hsDismissed1');
  if (dismissed === 'true') return;

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isiOS = /iphone|ipad|ipod/.test(userAgent);
  const isChromeIOS = /crios/.test(userAgent);
  const isSafariIOS = isiOS && !isChromeIOS && /safari/.test(userAgent);
  const isStandalone = window.navigator.standalone === true;

  if ((isiOS && isChromeIOS) || isSafariIOS) {
    if (!isStandalone) {
      setShowIOSPrompt(true);
    }
    return;
  }

  const handleBeforeInstallPrompt = (e) => {
    e.preventDefault();
    setDeferredPrompt(e);
    setShowPrompt(true);
  };

  // ✅ Wait for user gesture before attaching the listener
  const waitForInteraction = () => {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    document.removeEventListener('click', waitForInteraction);
  };

  document.addEventListener('click', waitForInteraction); // wait for first click

  return () => {
    document.removeEventListener('click', waitForInteraction);
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  };
}, []);

  // useEffect(() => {
  //   const dismissed = localStorage.getItem('a2hsDismissed1');
  //   if (dismissed === 'true') return;

  //   const userAgent = window.navigator.userAgent.toLowerCase();
  //   const isiOS = /iphone|ipad|ipod/.test(userAgent);
  //   const isChromeIOS = /crios/.test(userAgent);    
  //   const isSafariIOS = isiOS && !isChromeIOS && /safari/.test(userAgent);
  //   const isStandalone = window.navigator.standalone === true;

  //   if ((isiOS && isChromeIOS) || isSafariIOS) {
  //     if (!isStandalone) {
  //       setShowIOSPrompt(true);
  //     }
  //     return; 
  //   }

  //   const handleBeforeInstallPrompt = (e) => {
  //     e.preventDefault();
  //     setDeferredPrompt(e);
  //     setShowPrompt(true);
  //   };

  //   window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  //   return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  // }, []);

  const handleAddToHomeScreen = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      if (outcome === 'accepted') {
        localStorage.setItem('a2hsDismissed1', 'true');
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleClose = () => {
    localStorage.setItem('a2hsDismissed1', 'true');
    setShowPrompt(false);
    setShowIOSPrompt(false);
  };

  if (showIOSPrompt) {
    return (
      <div style={styles.popup}>
        <p>📱 Install this app on your Home Screen:</p>
        <p>1. Tap the <strong>Share</strong> icon (⬆️ or ⋮)</p>
        <p>2. Scroll and tap <strong>“Add to Home Screen”</strong></p>
        <button onClick={handleClose} style={styles.closeBtn}>Close</button>
      </div>
    );
  }

  if (!showPrompt) return null;

  return (
    <div style={styles.popup}>
      <p>📲 Add this app to your home screen for a better experience!</p>
      <button onClick={handleAddToHomeScreen} style={styles.addBtn}>Add to Home Screen</button>
      <button onClick={handleClose} style={styles.closeBtn}>No, Thanks</button>
    </div>
  );
}

const styles = {
  popup: {
    position: 'fixed',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#fff',
    padding: '16px 24px',
    borderRadius: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 999,
    textAlign: 'center',
    maxWidth: '320px',
    width: '90%',
  },
  addBtn: {
    marginTop: 10,
    padding: '8px 16px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    marginRight: 8,
  },
  closeBtn: {
    marginTop: 10,
    padding: '8px 16px',
    backgroundColor: '#ddd',
    color: '#333',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
};
