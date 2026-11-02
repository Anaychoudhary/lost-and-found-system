import React, { useEffect, useState } from 'react';
import { api, type MatchResponse } from './src/services/api';

function matchKey(match: MatchResponse): string {
  return `${match.lostItem.id}-${match.foundItem.id}`;
}

export const SmartMatches: React.FC = () => {
  const [matches, setMatches] = useState<MatchResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingKey, setResolvingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api.getSmartMatches()
      .then((result) => {
        if (active) setMatches(result);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Unable to load smart matches.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleResolveMatch = async (match: MatchResponse) => {
    const lostItemId = match.lostItem.id;
    const foundItemId = match.foundItem.id;
    if (lostItemId === undefined || foundItemId === undefined) {
      setError('Cannot resolve a match without both report IDs.');
      return;
    }

    setResolvingKey(matchKey(match));
    setError(null);
    setNotice(null);

    const results = await Promise.allSettled([
      api.updateLostItemStatus(lostItemId, 'RECOVERED'),
      api.updateFoundItemStatus(foundItemId, 'RECOVERED'),
    ]);

    if (results.every((result) => result.status === 'fulfilled')) {
      setMatches((current) => current.filter((entry) => matchKey(entry) !== matchKey(match)));
      setNotice('Both reports were marked as recovered.');
    } else {
      const failures = results
        .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
        .map((result) => result.reason instanceof Error ? result.reason.message : 'Request failed');
      setError(`One or more reports could not be updated: ${failures.join('; ')}`);
      try {
        setMatches(await api.getSmartMatches());
      } catch (cause: unknown) {
        setError((current) => `${current ?? 'Could not refresh matches.'} ${cause instanceof Error ? cause.message : ''}`.trim());
      }
    }

    setResolvingKey(null);
  };

  return (
    <div className="container py-4 py-lg-5">
      <div className="mb-4 mb-lg-5">
        <p className="page-eyebrow mb-2">A promising connection</p>
        <h1 className="h2 mb-2">Smart match engine</h1>
        <p className="text-body-secondary mb-0">
          Review suggested lost-and-found pairs based on location, category, and item details.
        </p>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {notice && <div className="alert alert-success" role="status">{notice}</div>}
      {loading && <p className="text-body-secondary py-3" role="status">Finding promising matches…</p>}
      {!loading && !error && matches.length === 0 && (
        <div className="alert alert-info py-3">No pending matches right now. New suggestions will appear as reports come in.</div>
      )}

      {matches.map((match) => {
        const key = matchKey(match);
        return (
          <article key={key} className="custom-card match-card mb-4">
            <header className="match-card-heading p-3 p-md-4 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
              <div>
                <p className="small text-white-50 mb-1">Suggested pair</p>
                <h2 className="h5 mb-0">Lost report #{match.lostItem.id} <span className="text-white-50 mx-1">↔</span> Found report #{match.foundItem.id}</h2>
              </div>
              <span className="badge-gold align-self-start align-self-sm-center">
                {match.matchConfidenceScore}% match confidence
              </span>
            </header>

            <div className="p-3 p-md-4 p-lg-5">
              <div className="row g-3 align-items-stretch">
                <div className="col-md-5">
                  <section className="match-pair">
                    <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
                      <span className="badge-navy">LOST ITEM</span>
                      <span className="small text-body-secondary">#{match.lostItem.id}</span>
                    </div>
                    <h3 className="h5 mb-3">{match.lostItem.title}</h3>
                    <p className="item-meta d-flex align-items-center gap-2 mb-2">
                      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
                        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="1.8" />
                        <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                      {match.lostItem.location}
                    </p>
                    <p className="small text-body-secondary mb-0">
                      Owner contact: <span className="contact-link">{match.lostItem.reporterContact}</span>
                    </p>
                  </section>
                </div>

                <div className="col-md-2 d-flex align-items-center justify-content-center py-1">
                  <span className="quick-link-icon rounded-circle" aria-label="Matched with" role="img">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
                      <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>

                <div className="col-md-5">
                  <section className="match-pair">
                    <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
                      <span className="badge-gold">FOUND ITEM</span>
                      <span className="small text-body-secondary">#{match.foundItem.id}</span>
                    </div>
                    <h3 className="h5 mb-3">{match.foundItem.title}</h3>
                    <p className="item-meta d-flex align-items-center gap-2 mb-2">
                      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
                        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="1.8" />
                        <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                      {match.foundItem.location}
                    </p>
                    <p className="small text-body-secondary mb-0">
                      Finder contact: <span className="contact-link">{match.foundItem.finderContact}</span>
                    </p>
                  </section>
                </div>
              </div>

              {match.matchReasons.length > 0 && (
                <section className="mt-4 pt-4 border-top">
                  <h3 className="h6 mb-2">Why these reports match</h3>
                  <ul className="match-reasons">
                    {match.matchReasons.map((reason) => <li key={reason}>{reason}</li>)}
                  </ul>
                </section>
              )}

              <div className="d-flex justify-content-end mt-4 pt-4 border-top">
                <button
                  type="button"
                  disabled={resolvingKey !== null}
                  onClick={() => handleResolveMatch(match)}
                  className="btn btn-navy px-4 py-2"
                >
                  {resolvingKey === key ? 'Updating reports…' : 'Confirm & mark as recovered'}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
