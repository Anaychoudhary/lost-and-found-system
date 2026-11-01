import { afterEach, describe, expect, it, vi } from 'vitest';
import { api, type FoundItem, type LostItem, type MatchResponse } from './api';

function mockFetch(response: Response) {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('backend API client', () => {
  it('requests dashboard statistics from the backend endpoint', async () => {
    const stats = { totalLost: 2, totalFound: 3, totalRecovered: 1 };
    const fetchMock = mockFetch(jsonResponse(stats));

    await expect(api.getDashboardStats()).resolves.toEqual(stats);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/dashboard/stats',
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    );
  });

  it('omits empty filters and sends populated lost-item filters', async () => {
    const fetchMock = mockFetch(jsonResponse([]));

    await api.getLostItems({ keyword: 'blue bag', category: 'BAGS' });

    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://localhost:8080/api/v1/lost-items?keyword=blue+bag&category=BAGS',
    );
    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({ Accept: 'application/json' });
  });

  it('posts the expected lost and found report fields', async () => {
    const lostItem: LostItem = {
      title: 'Blue bag',
      category: 'BAGS',
      description: 'Small blue backpack',
      location: 'Central Library',
      dateLost: '2026-10-28',
      reporterContact: 'student@example.edu',
    };
    const foundItem: FoundItem = {
      title: 'Blue bag',
      category: 'BAGS',
      description: 'Small blue backpack',
      location: 'Central Library',
      dateFound: '2026-10-29',
      finderContact: 'finder@example.edu',
      storageLocation: 'Library desk',
    };
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({}))
      .mockResolvedValueOnce(jsonResponse({}));
    vi.stubGlobal('fetch', fetchMock);

    await api.createLostItem(lostItem);
    await api.createFoundItem(foundItem);

    expect(fetchMock.mock.calls.map(([url, options]) => [url, options?.method, options?.body])).toEqual([
      ['http://localhost:8080/api/v1/lost-items', 'POST', JSON.stringify(lostItem)],
      ['http://localhost:8080/api/v1/found-items', 'POST', JSON.stringify(foundItem)],
    ]);
  });

  it('updates both report statuses through their matching endpoints', async () => {
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({}))
      .mockResolvedValueOnce(jsonResponse({}));
    vi.stubGlobal('fetch', fetchMock);

    await api.updateLostItemStatus(3, 'RECOVERED');
    await api.updateFoundItemStatus(4, 'RECOVERED');

    expect(fetchMock.mock.calls.map(([url, options]) => [url, options?.method])).toEqual([
      ['http://localhost:8080/api/v1/lost-items/3/status?status=RECOVERED', 'PUT'],
      ['http://localhost:8080/api/v1/found-items/4/status?status=RECOVERED', 'PUT'],
    ]);
  });

  it('handles the no-content response from delete endpoints', async () => {
    const fetchMock = mockFetch(new Response(null, { status: 204 }));

    await expect(api.deleteLostItem(3)).resolves.toBeUndefined();
    await expect(api.deleteFoundItem(4)).resolves.toBeUndefined();

    expect(fetchMock.mock.calls.map(([url, options]) => [url, options?.method])).toEqual([
      ['http://localhost:8080/api/v1/lost-items/3', 'DELETE'],
      ['http://localhost:8080/api/v1/found-items/4', 'DELETE'],
    ]);
  });

  it('loads matches using the backend response field names', async () => {
    const match: MatchResponse = {
      lostItem: {
        id: 1,
        title: 'Blue bag',
        category: 'BAGS',
        description: '',
        location: 'Central Library',
        dateLost: '2026-10-28',
        reporterContact: 'student@example.edu',
      },
      foundItem: {
        id: 2,
        title: 'Blue backpack',
        category: 'BAGS',
        description: '',
        location: 'Central Library',
        dateFound: '2026-10-29',
        finderContact: 'finder@example.edu',
        storageLocation: 'Library desk',
      },
      matchConfidenceScore: 90,
      matchReasons: ['Exact category match'],
    };
    const fetchMock = mockFetch(jsonResponse([match]));

    await expect(api.getSmartMatches()).resolves.toEqual([match]);
    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8080/api/v1/matches');
  });

  it('surfaces backend errors with their HTTP status', async () => {
    mockFetch(new Response('Database unavailable', { status: 503, statusText: 'Service Unavailable' }));

    await expect(api.getDashboardStats()).rejects.toThrow('API Error (503): Database unavailable');
  });
});
