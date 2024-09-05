import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Profile from './pages/Profile';
import FriendsPage from './pages/FriendsPage';
import NotFound from './pages/NotFound';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import { Auth } from './components/Auth';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {!user ? (
              <Auth />
            ) : (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/friends" element={<FriendsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;