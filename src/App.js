import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import WishLinkStylish from './components/WishLinkStylish';
import Home from './pages/Home';
import Profile from './pages/Profile';
import FriendsPosts from './components/Friends/FriendsPosts';
import NotFound from './pages/NotFound';
import { Auth } from './components/Auth';
import { useAuth } from './hooks/useAuth';
import FriendsList from './components/Friends/FriendsList';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <Router>
        <WishLinkStylish>
          {!user ? (
            <Auth />
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/friendspost" element={<FriendsPosts />} />
              <Route path="/friendslist" element={<FriendsList />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </WishLinkStylish>
      </Router>
    </AuthProvider>
  );
}

export default App;