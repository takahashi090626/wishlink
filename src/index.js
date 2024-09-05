import React from 'react';
import ReactDOM from 'react-dom/client'; // 'react-dom/client' からインポート
import './styles/global.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// ルートを作成
const root = ReactDOM.createRoot(document.getElementById('root'));

// アプリをルートにレンダリング
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
