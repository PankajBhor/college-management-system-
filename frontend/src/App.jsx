import React from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './pages/DashboardLayout';
import HomePage from './pages/HomePage';

function AppContent() {
  const { user, setUser, logout } = useAuth();
  const [showLogin, setShowLogin] = React.useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return showLogin
      ? <LoginPage onLoginSuccess={handleLoginSuccess} onBackHome={() => setShowLogin(false)} />
      : <HomePage onLoginClick={() => setShowLogin(true)} />;
  }

  // Show dashboard layout if authenticated
  return (
    <DashboardLayout
      user={user}
      onLogout={handleLogout}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
