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
      <section className="row g-4 mb-4" aria-label="Report an item">
        <div className="col-md-6">
          <article className="action-card action-card-lost h-100 d-flex flex-column justify-content-between gap-4">
            <div>
              <span className="action-card-icon mb-4" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="23" height="23" fill="none">
                  <path d="M5 8h14v11H5zM9 8V6.5a3 3 0 0 1 6 0V8m-3 4v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="action-card-kicker mb-2">Let’s help bring it home</p>
              <h1 className="h2 mb-2">Report a Lost Item</h1>
              <p className="action-card-description mb-0">
                Tell the campus community what went missing and where you last saw it.
              </p>
            </div>
            <Link to="/report?type=lost" className="btn btn-coral align-self-start">
              Report lost item <span aria-hidden="true">→</span>
            </Link>
          </article>
        </div>
        <div className="col-md-6">
          <article className="action-card action-card-found h-100 d-flex flex-column justify-content-between gap-4">
            <div>
              <span className="action-card-icon mb-4" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="23" height="23" fill="none">
                  <path d="m6 12 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                </svg>
              </span>
              <p className="action-card-kicker mb-2">Found something?</p>
              <h2 className="h2 mb-2">Report a Found Item</h2>
              <p className="action-card-description mb-0">
                Share a helpful find so its owner can reconnect with it.
              </p>
            </div>
            <Link to="/report?type=found" className="btn btn-blush align-self-start">
              Report found item <span aria-hidden="true">→</span>
            </Link>
          </article>
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
    </div>
  );
}