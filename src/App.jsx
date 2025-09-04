import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'

export default function App() {
  const loc = useLocation()
  return (
    <div className="app">
      <header className="app-header">
        <h1>Quiz App</h1>
        <nav>
          <Link to="/quiz" className={loc.pathname.startsWith('/quiz') || loc.pathname === '/' ? 'active' : ''}>Quiz</Link>
          <Link to="/results" className={loc.pathname.startsWith('/results') ? 'active' : ''}>Results</Link>
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">Built with React </footer>
    </div>
  )
}
