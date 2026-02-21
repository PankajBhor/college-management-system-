import React from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './pages/DashboardLayout';

function AppContent() {
  const { user, setUser, logout } = useAuth();

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logout();
  };

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
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
