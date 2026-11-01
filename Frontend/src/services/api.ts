const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1').replace(/\/$/, '');

// Enums matching Java Enums
export type ItemStatus = 'REPORTED' | 'MATCHED' | 'RECOVERED' | 'EXPIRED';
export type ItemCategory = 'ELECTRONICS' | 'DOCUMENTS' | 'BAGS' | 'KEYS' | 'CLOTHING' | 'OTHER';

// Interfaces matching Java DTOs
export interface LostItem {
  id?: number;
  title: string;
  category: ItemCategory;
  description: string;
  location: string;
  dateLost: string; // ISO format: YYYY-MM-DD
  reporterContact: string;
  rewardOffered?: number;
  status?: ItemStatus;
  createdAt?: string;
  itemType?: string;
}

export interface FoundItem {
  id?: number;
  title: string;
  category: ItemCategory;
  description: string;
  location: string;
  dateFound: string; // ISO format: YYYY-MM-DD
  finderContact: string;
  storageLocation: string;
  status?: ItemStatus;
  createdAt?: string;
  itemType?: string;
}

export interface DashboardStats {
  totalLost: number;
  totalFound: number;
  totalRecovered: number;
}

export interface MatchResponse {
  lostItem: LostItem;
  foundItem: FoundItem;
  matchConfidenceScore: number;
  matchReasons: string[];
}

export interface ItemFilters {
  keyword?: string;
  status?: ItemStatus;
  category?: ItemCategory;
}

// Generic HTTP Helper
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
  }

  // Handle HTTP 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

function buildQuery(filters?: ItemFilters): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters ?? {})) {
    if (value) {
      query.set(key, value);
    }
  }
  return query.toString();
}

// ==========================================
// API Methods
// ==========================================

export const api = {
  // --- Dashboard API ---
  getDashboardStats: (): Promise<DashboardStats> => {
    return request<DashboardStats>('/dashboard/stats');
  },

  // --- Lost Items API ---
  createLostItem: (item: LostItem): Promise<LostItem> => {
    return request<LostItem>('/lost-items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  getLostItems: (params?: ItemFilters): Promise<LostItem[]> => {
    const query = buildQuery(params);
    return request<LostItem[]>(`/lost-items${query ? `?${query}` : ''}`);
  },

  updateLostItemStatus: (id: number, status: ItemStatus): Promise<LostItem> => {
    return request<LostItem>(`/lost-items/${id}/status?status=${status}`, {
      method: 'PUT',
    });
  },

  deleteLostItem: (id: number): Promise<void> => {
    return request<void>(`/lost-items/${id}`, {
      method: 'DELETE',
    });
  },

  // --- Found Items API ---
  createFoundItem: (item: FoundItem): Promise<FoundItem> => {
    return request<FoundItem>('/found-items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  getFoundItems: (params?: ItemFilters): Promise<FoundItem[]> => {
    const query = buildQuery(params);
    return request<FoundItem[]>(`/found-items${query ? `?${query}` : ''}`);
  },

  updateFoundItemStatus: (id: number, status: ItemStatus): Promise<FoundItem> => {
    return request<FoundItem>(`/found-items/${id}/status?status=${status}`, {
      method: 'PUT',
    });
  },

  deleteFoundItem: (id: number): Promise<void> => {
    return request<void>(`/found-items/${id}`, {
      method: 'DELETE',
    });
  },

  // --- Smart Matches API ---
  getSmartMatches: (): Promise<MatchResponse[]> => {
    return request<MatchResponse[]>('/matches');
  },
};