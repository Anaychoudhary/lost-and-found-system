import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api, type DashboardStats } from './src/services/api';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api.getDashboardStats()
      .then((result) => {
        if (active) setStats(result);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Unable to load dashboard statistics.');
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="container py-4 py-lg-5">
      <section className="hero-banner rounded-4 p-4 p-lg-5 mb-4 mb-lg-5">
        <div className="py-lg-2">
          <p className="hero-kicker mb-3">A little help goes a long way</p>
          <h1 className="display-5 fw-bold mb-3">Lost something on campus?</h1>
          <p className="col-lg-8 fs-5 mb-0 opacity-75">
            Smart Campus Item Recovery Platform. Report misplaced items, connect with finders, and track recovery status seamlessly.
          </p>
          <div className="hero-actions d-flex flex-wrap gap-3 mt-4">
            <Link to="/report?type=lost" className="btn btn-gold btn-lg px-4">
              Report Lost Item
            </Link>
            <Link to="/report?type=found" className="btn btn-outline-light btn-lg px-4">
              Report Found Item
            </Link>
          </div>
        </div>
      </section>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <section className="row g-3 g-lg-4 mb-5" aria-label="Campus recovery statistics">
        <div className="col-md-4">
          <div className="custom-card metric-card h-100">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <span className="metric-label">Total lost</span>
              <span className="metric-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                  <path d="M5 8h14v11H5zM9 8V6.5a3 3 0 0 1 6 0V8m-3 4v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <div className="metric-value">{stats?.totalLost ?? '—'}</div>
            <p className="small text-body-secondary mb-0 mt-2">Items reported missing</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="custom-card metric-card h-100">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <span className="metric-label">Total found</span>
              <span className="metric-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                  <path d="m6 12 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                </svg>
              </span>
            </div>
            <div className="metric-value">{stats?.totalFound ?? '—'}</div>
            <p className="small text-body-secondary mb-0 mt-2">Items waiting to be reunited</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="custom-card metric-card h-100">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <span className="metric-label">Total recovered</span>
              <span className="metric-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                  <path d="m7 12 3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 12a8 8 0 1 1-4.2-7.05" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <div className="metric-value">{stats?.totalRecovered ?? '—'}</div>
            <p className="small text-body-secondary mb-0 mt-2">Successful campus reunions</p>
          </div>
        </div>
      </section>

      <section>
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end gap-2 mb-3">
          <div>
            <p className="page-eyebrow mb-2">Explore</p>
            <h2 className="h3 mb-0">Your next step</h2>
          </div>
          <p className="text-body-secondary mb-0">Everything you need to bring an item home.</p>
        </div>
        <div className="row g-3 g-lg-4">
          <div className="col-md-6">
            <article className="custom-card quick-link-card p-4 d-flex flex-column">
              <span className="quick-link-icon mb-3" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                  <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
                  <path d="m16 16 4 4M8 10.8h5.5m-2.75-2.75v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <h3 className="h5">Item directory</h3>
              <p className="text-body-secondary">Search lost and found reports across campus by keyword, category, and report type.</p>
              <Link to="/browse" className="btn btn-outline-navy mt-auto align-self-start">
                Browse items <span aria-hidden="true">→</span>
              </Link>
            </article>
          </div>
          <div className="col-md-6">
            <article className="custom-card quick-link-card p-4 d-flex flex-column">
              <span className="quick-link-icon mb-3" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                  <path d="M8.5 7.5h-2a3 3 0 0 0 0 6h3m6-6h2a3 3 0 0 1 0 6h-3m-6 0a3.5 3.5 0 0 0 7 0m-7-3a3.5 3.5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <h3 className="h5">Smart match engine</h3>
              <p className="text-body-secondary">Review promising lost-and-found pairs matched by location, category, and item details.</p>
              <Link to="/matches" className="btn btn-outline-navy mt-auto align-self-start">
                View suggestions <span aria-hidden="true">→</span>
              </Link>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}