import { Board } from './components/Board';
import { Login } from './components/Login';
import { AIChatSidebar } from './components/AIChatSidebar';
import { AuthProvider, useAuth } from './AuthContext';
import { KanbanProvider } from './KanbanContext';

function AppContent() {
  const { isAuthenticated, username, logout } = useAuth();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-logo">KanbanBoard</h1>
        <div className="header-actions">
          {isAuthenticated ? (
            <div className="user-info">
              <span className="username-display">Hello, {username}</span>
              <button onClick={logout} className="logout-button">Logout</button>
            </div>
          ) : (
            <span className="version-badge">MVP VERSION</span>
          )}
        </div>
      </header>
      <main className="app-main">
        {isAuthenticated ? (
          <KanbanProvider>
            <Board />
            <AIChatSidebar />
          </KanbanProvider>
        ) : (
          <Login />
        )}
      </main>
    </div>
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
