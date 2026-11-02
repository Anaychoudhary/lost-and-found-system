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

function formatCategory(category: ItemCategory): string {
  const labels: Record<ItemCategory, string> = {
    ELECTRONICS: 'Electronics',
    DOCUMENTS: 'ID & documents',
    BAGS: 'Bags & wallets',
    KEYS: 'Keys',
    CLOTHING: 'Clothing',
    OTHER: 'Other',
  };
  return labels[category];
}

function contactHref(contact: string): string | undefined {
  const trimmedContact = contact.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedContact)) {
    return `mailto:${trimmedContact}`;
  }

  const phoneNumber = trimmedContact.replace(/[^\d+]/g, '');
  if (/^\+?\d{7,15}$/.test(phoneNumber)) {
    return `tel:${phoneNumber}`;
  }
  return undefined;
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
    <div className="container py-4 py-lg-5">
      <div className="mb-4">
        <p className="page-eyebrow mb-2">Campus community</p>
        <h1 className="h2 mb-2">Item directory</h1>
        <p className="text-body-secondary mb-0">Browse recent reports and help reunite a neighbor with what they’ve lost.</p>
      </div>

      <div className="filter-bar row g-3 mb-4 p-3 p-lg-4 align-items-end">
        <div className="col-lg-5">
          <label className="form-label" htmlFor="item-search">Keyword</label>
          <input
            id="item-search"
            type="text"
            className="form-control"
            placeholder="Try “blue backpack”"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-sm-6 col-lg-3">
          <label className="form-label" htmlFor="type-filter">Report type</label>
          <select id="type-filter" className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="ALL">All types</option>
            <option value="LOST">Lost items</option>
            <option value="FOUND">Found items</option>
          </select>
        </div>
        <div className="col-sm-6 col-lg-4">
          <label className="form-label" htmlFor="category-filter">Category</label>
          <select id="category-filter" className="form-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="ALL">All categories</option>
            <option value="ELECTRONICS">Electronics</option>
            <option value="DOCUMENTS">ID &amp; documents</option>
            <option value="BAGS">Bags &amp; wallets</option>
            <option value="KEYS">Keys</option>
            <option value="CLOTHING">Clothing &amp; accessories</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {loading && <p className="text-body-secondary py-3" role="status">Loading item reports…</p>}
      {!loading && !error && filteredItems.length === 0 && (
        <div className="alert alert-info py-3">No item reports match these filters. Try changing your search or filters.</div>
      )}
      <div className="row g-3 g-lg-4">
        {filteredItems.map((item) => (
          <div key={`${item.type}-${item.id ?? item.title}`} className="col-md-6 col-lg-4">
            <article className="custom-card item-card h-100 d-flex flex-column">
              <div className="item-card-header d-flex justify-content-between align-items-center px-4 py-3">
                <span className={`badge rounded-pill px-3 py-2 ${item.type === 'LOST' ? 'item-type-lost' : 'item-type-found'}`}>
                  {item.type === 'LOST' ? 'LOST ITEM' : 'FOUND ITEM'}
                </span>
                <span className="small text-body-secondary">{item.id ? `Report #${item.id}` : 'Campus report'}</span>
              </div>
              <div className="p-4 d-flex flex-column flex-grow-1">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="badge-navy">{formatCategory(item.category)}</span>
                  <span className={`badge rounded-pill px-3 py-2 ${item.status === 'RECOVERED' ? 'item-status-recovered' : 'item-status'}`}>
                    {item.status ?? 'REPORTED'}
                  </span>
                </div>
                <h2 className="h5 mb-3">{item.title}</h2>
                <div className="item-meta d-flex align-items-center gap-2 mb-2">
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
                    <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  <span>{item.location}</span>
                </div>
                <div className="item-meta d-flex align-items-center gap-2 mb-4">
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
                    <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M8 3v4m8-4v4M4 10h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <time dateTime={item.date}>{item.date}</time>
                </div>
                <div className="mt-auto pt-3 border-top d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <span className="small text-body-secondary">{item.type === 'LOST' ? 'Reported by' : 'Found by'}</span>
                  {contactHref(item.contact) ? (
                    <a className="contact-link" href={contactHref(item.contact)}>{item.contact}</a>
                  ) : (
                    <span className="contact-link">{item.contact}</span>
                  )}
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
};
