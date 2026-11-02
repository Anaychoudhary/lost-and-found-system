import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navigation = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/browse', label: 'Browse Items', end: false },
  { to: '/report', label: 'Report an Item', end: false },
  { to: '/matches', label: 'Smart Matches', end: false },
];

export function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <header className="app-header">
      <nav className="navbar navbar-expand-lg navbar-dark app-navbar">
        <div className="container">
          <NavLink className="navbar-brand fw-bold" to="/">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="23" height="23" fill="none">
                <path d="M4 8.5h16v11H4zM8 8.5V6a4 4 0 0 1 8 0v2.5M8 13h8m-8 3h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>Lost &amp; Found Buddy</span>
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="main-navigation"
            aria-expanded={isExpanded}
            aria-label="Toggle navigation"
            onClick={() => setIsExpanded((expanded) => !expanded)}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse${isExpanded ? ' show' : ''}`} id="main-navigation">
            <div className="navbar-nav ms-auto">
              {navigation.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={() => setIsExpanded(false)}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
