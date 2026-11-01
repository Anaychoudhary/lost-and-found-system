import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { BrowseItems } from '../BrowseItems';
import { Dashboard } from '../Dashboard';
import { ReportItem } from '../ReportItem';
import { SmartMatches } from '../SmartMatches';

const navigation = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/browse', label: 'Browse Items', end: false },
  { to: '/report', label: 'Report an Item', end: false },
  { to: '/matches', label: 'Smart Matches', end: false },
];

export function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <NavLink className="navbar-brand fw-bold" to="/">
              Lost &amp; Found Buddy
            </NavLink>
            <div className="navbar-nav ms-auto flex-row flex-wrap">
              {navigation.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `nav-link px-3${isActive ? ' active fw-semibold' : ''}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/browse" element={<BrowseItems />} />
          <Route path="/report" element={<ReportItem />} />
          <Route path="/matches" element={<SmartMatches />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="border-top bg-white py-3 mt-4">
        <div className="container small text-muted">
          Campus Lost &amp; Found · Frontend demo
        </div>
      </footer>
    </div>
  );
}
