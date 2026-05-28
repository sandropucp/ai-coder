import { Board } from './components/Board';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-logo">KanbanBoard</h1>
        <div className="header-actions">
          <span className="version-badge">MVP VERSION</span>
        </div>
      </header>
      <main className="app-main">
        <Board />
      </main>
    </div>
  );
}

export default App;
