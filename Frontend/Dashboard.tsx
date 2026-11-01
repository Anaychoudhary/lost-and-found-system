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
    <div className="container py-4">
      {/* Hero Banner */}
      <div className="p-5 mb-4 bg-primary text-white rounded-3 shadow-sm">
        <div className="container-fluid py-3">
          <h1 className="display-5 fw-bold">Lost & Found Buddy</h1>
          <p className="col-md-8 fs-5">
            Smart Campus Item Recovery Platform. Report misplaced items, connect with finders, and track recovery status seamlessly.
          </p>
          <div className="d-flex gap-3 mt-4">
            <Link to="/report?type=lost" className="btn btn-warning btn-lg fw-semibold">
              Report Lost Item
            </Link>
            <Link to="/report?type=found" className="btn btn-light btn-lg fw-semibold text-primary">
              Report Found Item
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Counter Cards */}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm border-start border-danger border-4 h-100 p-3">
            <div className="card-body">
              <h6 className="text-muted text-uppercase fw-bold">Total Lost Reported</h6>
              <h2 className="display-4 fw-bold text-danger mb-0">{stats?.totalLost ?? '—'}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm border-start border-info border-4 h-100 p-3">
            <div className="card-body">
              <h6 className="text-muted text-uppercase fw-bold">Total Found Reported</h6>
              <h2 className="display-4 fw-bold text-info mb-0">{stats?.totalFound ?? '—'}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm border-start border-success border-4 h-100 p-3">
            <div className="card-body">
              <h6 className="text-muted text-uppercase fw-bold">Successfully Recovered</h6>
              <h2 className="display-4 fw-bold text-success mb-0">{stats?.totalRecovered ?? '—'}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm p-4">
            <h4>Browse All Campus Items</h4>
            <p className="text-muted">Search through active lost and found reports using filters like location and category.</p>
            <Link to="/browse" className="btn btn-outline-primary mt-auto align-self-start">
              Open Directory &rarr;
            </Link>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm p-4">
            <h4>Smart Match Engine</h4>
            <p className="text-muted">View automatically paired lost and found items calculated by location and category similarity.</p>
            <Link to="/matches" className="btn btn-outline-primary mt-auto align-self-start">
              View Suggestions &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};