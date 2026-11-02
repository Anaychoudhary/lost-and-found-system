import { Navigate, Route, Routes } from 'react-router-dom';
import { BrowseItems } from '../BrowseItems';
import { Dashboard } from '../Dashboard';
import { ReportItem } from '../ReportItem';
import { SmartMatches } from '../SmartMatches';
import { Navbar } from './components/Navbar';

export function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/browse" element={<BrowseItems />} />
          <Route path="/report" element={<ReportItem />} />
          <Route path="/matches" element={<SmartMatches />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="campus-footer">
        <div className="container d-flex flex-column flex-sm-row justify-content-between gap-2">
          <span>Lost &amp; Found Buddy</span>
          <span>Helping our campus community reconnect with what matters.</span>
        </div>
      </footer>
    </div>
  );
}
