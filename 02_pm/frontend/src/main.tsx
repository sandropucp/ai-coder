import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { KanbanProvider } from './KanbanContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KanbanProvider>
      <App />
    </KanbanProvider>
  </React.StrictMode>,
)
