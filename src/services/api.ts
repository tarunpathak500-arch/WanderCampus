import { FoundItem, Claim, CampusStats, RegisterData, User } from '../types';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('campus_retriever_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function registerStudent(data: RegisterData): Promise<{ token: string; user: User; message: string }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.error || 'Failed to create account');
  return resData;
}

export async function getFoundItems(params?: {
  search?: string;
  block?: string;
  category?: string;
  status?: string;
}): Promise<{ items: FoundItem[]; total: number }> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.block) query.set('block', params.block);
  if (params?.category) query.set('category', params.category);
  if (params?.status) query.set('status', params.status);

  const res = await fetch(`/api/items?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to load found items feed');
  return res.json();
}

export async function getFoundItemById(id: string): Promise<FoundItem> {
  const res = await fetch(`/api/items/${encodeURIComponent(id)}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Item not found');
  const data = await res.json();
  return data.item;
}

export async function createFoundItem(itemData: Partial<FoundItem>): Promise<{ item: FoundItem; message: string }> {
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(itemData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit found item');
  return data;
}

export async function submitOwnershipClaim(
  itemId: string,
  claimData: {
    ownership_proof_description: string;
    proof_document_url?: string;
    proof_document_name?: string;
    pickup_scheduled_date: string;
    pickup_scheduled_time: string;
    claimant_name: string;
    claimant_reg_no: string;
    claimant_phone: string;
    claimant_email: string;
  }
): Promise<{ claim: Claim; item: FoundItem; message: string }> {
  const res = await fetch(`/api/items/${encodeURIComponent(itemId)}/claim`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(claimData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit ownership claim');
  return data;
}

export async function getClaims(myClaimsOnly = false): Promise<{ claims: (Claim & { item?: FoundItem | null })[]; count: number }> {
  const res = await fetch(`/api/claims?myClaimsOnly=${myClaimsOnly}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to load claims');
  return res.json();
}

export async function updateClaimStatus(
  claimId: string,
  verification_status: 'approved' | 'rejected' | 'pending',
  admin_notes?: string
): Promise<{ claim: Claim; item?: FoundItem; message: string }> {
  const res = await fetch(`/api/admin/claims/${encodeURIComponent(claimId)}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ verification_status, admin_notes }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update claim');
  return data;
}

export async function markItemAsReturned(
  itemId: string,
  returned_to_claimant: string,
  handover_officer_name?: string,
  claim_id?: string
): Promise<{ item: FoundItem; message: string }> {
  const res = await fetch(`/api/admin/items/${encodeURIComponent(itemId)}/return`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ returned_to_claimant, handover_officer_name, claim_id }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to finalize item return');
  return data;
}

export async function getCampusAnalytics(): Promise<CampusStats> {
  const res = await fetch('/api/analytics');
  if (!res.ok) throw new Error('Failed to load campus statistics');
  return res.json();
}

export async function resetCampusDatabase(): Promise<{ message: string }> {
  const res = await fetch('/api/seed/reset', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset demo database');
  return res.json();
}
