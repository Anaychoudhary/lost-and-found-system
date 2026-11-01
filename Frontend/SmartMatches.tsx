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
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="text-primary">Smart Match Engine</h2>
        <p className="text-muted">Automated rule-based matching based on location proximity, category, and title similarity.</p>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {notice && <div className="alert alert-success" role="status">{notice}</div>}
      {loading && <p role="status">Loading smart matches…</p>}
      {!loading && !error && matches.length === 0 && (
        <div className="alert alert-info shadow-sm">No pending high-confidence matches found.</div>
      )}

      {matches.map((match) => {
        const key = matchKey(match);
        return (
          <div key={key} className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <span className="fw-bold">Lost #{match.lostItem.id} ↔ Found #{match.foundItem.id}</span>
              <span className="badge bg-warning text-dark fs-6">{match.matchConfidenceScore}% Similarity Match</span>
            </div>
            <div className="card-body p-4">
              <div className="row text-center text-md-start">
                <div className="col-md-5 border-end">
                  <span className="badge bg-danger mb-2">LOST REPORT</span>
                  <h4>{match.lostItem.title}</h4>
                  <p className="mb-1"><strong>Location:</strong> {match.lostItem.location}</p>
                  <p className="text-muted"><strong>Owner Contact:</strong> {match.lostItem.reporterContact}</p>
                </div>

                <div className="col-md-2 d-flex align-items-center justify-content-center my-3 my-md-0">
                  <div className="rounded-circle bg-light p-3 shadow-sm text-primary fw-bold">↔</div>
                </div>

                <div className="col-md-5">
                  <span className="badge bg-info text-white mb-2">FOUND REPORT</span>
                  <h4>{match.foundItem.title}</h4>
                  <p className="mb-1"><strong>Location:</strong> {match.foundItem.location}</p>
                  <p className="text-muted"><strong>Finder Contact:</strong> {match.foundItem.finderContact}</p>
                </div>
              </div>

              {match.matchReasons.length > 0 && (
                <>
                  <hr />
                  <p className="fw-semibold mb-2">Why these reports match</p>
                  <ul className="mb-3">
                    {match.matchReasons.map((reason) => <li key={reason}>{reason}</li>)}
                  </ul>
                </>
              )}

              <hr />
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  disabled={resolvingKey !== null}
                  onClick={() => handleResolveMatch(match)}
                  className="btn btn-success fw-semibold"
                >
                  {resolvingKey === key ? 'Updating reports…' : 'Confirm and mark both recovered'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
