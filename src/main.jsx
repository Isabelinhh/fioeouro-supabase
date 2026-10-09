import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';

// Obs.: sem <React.StrictMode> aqui de propósito — o App.jsx faz manipulação
// direta do DOM (mesma lógica do site original) dentro de um único useEffect,
// e o StrictMode do React 18 roda os efeitos duas vezes em desenvolvimento,
// o que duplicaria listeners de evento.
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
