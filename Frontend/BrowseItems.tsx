import React, { useEffect, useState } from 'react';
import { api, type FoundItem, type ItemCategory, type ItemStatus, type LostItem } from './src/services/api';

interface BrowseItem {
  id?: number;
  title: string;
  category: ItemCategory;
  type: 'LOST' | 'FOUND';
  location: string;
  date: string;
  status?: ItemStatus;
  contact: string;
}

function toLostBrowseItem(item: LostItem): BrowseItem {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    type: 'LOST',
    location: item.location,
    date: item.dateLost,
    status: item.status,
    contact: item.reporterContact,
  };
}

function toFoundBrowseItem(item: FoundItem): BrowseItem {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    type: 'FOUND',
    location: item.location,
    date: item.dateFound,
    status: item.status,
    contact: item.finderContact,
  };
}

export const BrowseItems: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [items, setItems] = useState<BrowseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const timer = window.setTimeout(() => {
      const filters = {
        keyword: searchQuery.trim() || undefined,
        category: filterCategory === 'ALL' ? undefined : filterCategory as ItemCategory,
      };
      Promise.all([api.getLostItems(filters), api.getFoundItems(filters)])
        .then(([lostItems, foundItems]) => {
          if (active) {
            setItems([...lostItems.map(toLostBrowseItem), ...foundItems.map(toFoundBrowseItem)]);
          }
        })
        .catch((cause: unknown) => {
          if (active) setError(cause instanceof Error ? cause.message : 'Unable to load item reports.');
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [searchQuery, filterCategory]);

  const filteredItems = items.filter((item) => filterType === 'ALL' || item.type === filterType);

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-primary">Campus Item Directory</h2>

      {/* Filter Controls Bar */}
      <div className="row g-3 mb-4 bg-white p-3 rounded shadow-sm align-items-center">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="ALL">All Types (Lost & Found)</option>
            <option value="LOST">Lost Items Only</option>
            <option value="FOUND">Found Items Only</option>
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="ALL">All Categories</option>
            <option value="ELECTRONICS">Electronics</option>
            <option value="DOCUMENTS">ID & Documents</option>
            <option value="BAGS">Bags & Wallets</option>
          </select>
        </div>
      </div>

      {/* Cards Directory */}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {loading && <p role="status">Loading item reports…</p>}
      {!loading && !error && filteredItems.length === 0 && (
        <div className="alert alert-info">No item reports match these filters.</div>
      )}
      <div className="row g-4">
        {filteredItems.map((item) => (
          <div key={`${item.type}-${item.id ?? item.title}`} className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent d-flex justify-content-between align-items-center border-0 pt-3 px-3">
                <span className={`badge ${item.type === 'LOST' ? 'bg-danger' : 'bg-info text-white'}`}>
                  {item.type}
                </span>
                <span className="badge bg-secondary">#{item.id}</span>
              </div>
              <div className="card-body">
                <h5 className="card-title fw-bold mb-2">{item.title}</h5>
                <p className="card-text text-muted mb-1">
                  <strong>Location:</strong> {item.location}
                </p>
                <p className="card-text text-muted mb-2">
                  <strong>Date:</strong> {item.date}
                </p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className={`badge ${item.status === 'RECOVERED' ? 'bg-success' : item.status === 'EXPIRED' ? 'bg-secondary' : 'bg-warning text-dark'}`}>
                    Status: {item.status}
                  </span>
                  <small className="text-primary text-decoration-underline cursor-pointer">{item.contact}</small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};