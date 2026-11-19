export type Health = {
  status: 'ok' | 'unavailable';
  database: 'ok' | 'unreachable';
};

export type ErrorCode =
  | 'pin_wrong'
  | 'tan_required'
  | 'account_locked'
  | 'bank_unreachable'
  | 'bank_error'
  | 'bank_not_configured'
  | 'statement_invalid'
  | 'internal_error';

export type FetchWarning = 'statement_inconsistent' | 'balance_mismatch';

export type Me = { username: string };

export type BankStatus = {
  state: 'unlocked' | 'locked';
  fetching: boolean;
  error: ErrorCode | null;
};

export type AccountFetchState = 'idle' | 'queued' | 'fetching' | 'done' | 'failed';

export type Account = {
  id: string;
  iban: string;
  name: string;
  product_name: string;
  owner_name: string;
  covered_from: string | null;
  covered_to: string | null;
  fetch: { state: AccountFetchState; error: ErrorCode | null };
  last_run: {
    finished_at: string;
    new_count: number;
    skipped_count: number;
    warning: FetchWarning | null;
  } | null;
  gaps: { start: string; end: string }[];
  balance: { amount: string; date: string } | null;
};

export type AccountList = { selected_id: string | null; accounts: Account[] };

export type MonthSummary = {
  month: string;
  income: string;
  expense: string;
  diff: string;
  complete: boolean;
};

export type Transaction = {
  id: string;
  booking_date: string;
  value_date: string | null;
  amount: string;
  currency: string;
  counterparty_name: string;
  counterparty_iban: string | null;
  purpose: string;
  posting_text: string;
  card_payment: boolean;
  balance_after: string | null;
};

export type PendingTransaction = {
  id: string;
  booking_date: string;
  amount: string;
  counterparty_name: string;
  purpose: string;
};

export type TransactionList = {
  items: Transaction[];
  total: number;
  page: number;
  page_size: number;
  pending: PendingTransaction[];
};

export type Kind = 'all' | 'income' | 'expense';
export type SortField = 'booking_date' | 'amount' | 'counterparty_name';

export type TransactionQuery = {
  accountId: string;
  month?: string;
  fromDate?: string;
  toDate?: string;
  type?: Kind;
  q?: string;
  sort?: SortField;
  order?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
};

/** An error answer of the backend; `code` is a key for the translated message. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string) {
    super(`API request failed with status ${status}: ${code}`);
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
  });
  if (!response.ok) {
    let code = 'unknown';
    try {
      const body = (await response.json()) as { detail?: unknown };
      if (typeof body.detail === 'string') {
        code = body.detail;
      }
    } catch {
      // Not JSON, e.g. a proxy error page.
    }
    throw new ApiError(response.status, code);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function fetchHealth(): Promise<Health> {
  const response = await fetch('/api/health');
  if (!response.ok && response.status !== 503) {
    throw new Error(`Health check failed with status ${response.status}`);
  }
  return (await response.json()) as Health;
}

export async function getMe(): Promise<Me | null> {
  try {
    return await request<Me>('/api/auth/me');
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

export function login(username: string, password: string, code: string): Promise<void> {
  return post('/api/auth/login', { username, password, code });
}

export function logout(): Promise<void> {
  return post('/api/auth/logout');
}

export function getBankStatus(): Promise<BankStatus> {
  return request('/api/bank/status');
}

export function unlockBank(pin: string): Promise<{ result: string }> {
  return post('/api/bank/unlock', { pin });
}

export function lockBank(): Promise<void> {
  return post('/api/bank/lock');
}

export function startFetch(): Promise<{ result: string }> {
  return post('/api/fetch');
}

export function getAccounts(): Promise<AccountList> {
  return request('/api/accounts');
}

export function selectAccount(accountId: string): Promise<void> {
  return request('/api/session/account', {
    method: 'PUT',
    body: JSON.stringify({ account_id: accountId }),
  });
}

export function getMonthlySummary(
  accountId: string,
  from: string,
  to: string,
): Promise<MonthSummary[]> {
  const params = new URLSearchParams({ account_id: accountId, from, to });
  return request(`/api/summary/monthly?${params.toString()}`);
}

export function getTransactions(query: TransactionQuery): Promise<TransactionList> {
  const params = new URLSearchParams({ account_id: query.accountId });
  const optional: Record<string, string | number | undefined> = {
    month: query.month,
    from_date: query.fromDate,
    to_date: query.toDate,
    type: query.type,
    q: query.q,
    sort: query.sort,
    order: query.order,
    page: query.page,
    page_size: query.pageSize,
  };
  for (const [key, value] of Object.entries(optional)) {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  }
  return request(`/api/transactions?${params.toString()}`);
}
