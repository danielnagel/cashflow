import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAccounts,
  getBankStatus,
  getMe,
  getMonthlySummary,
  getTransactions,
  lockBank,
  login,
  logout,
  selectAccount,
  startFetch,
  unlockBank,
  type TransactionQuery,
} from '@/lib/api';

const POLL_INTERVAL = 1000;

export const keys = {
  me: ['me'] as const,
  bankStatus: ['bank-status'] as const,
  accounts: ['accounts'] as const,
  summary: ['summary'] as const,
  transactions: ['transactions'] as const,
};

export function useMe() {
  return useQuery({ queryKey: keys.me, queryFn: getMe });
}

export function useBankStatus() {
  return useQuery({
    queryKey: keys.bankStatus,
    queryFn: getBankStatus,
    refetchInterval: (query) => (query.state.data?.fetching ? POLL_INTERVAL : false),
  });
}

export function useAccounts(fetching: boolean) {
  return useQuery({
    queryKey: keys.accounts,
    queryFn: getAccounts,
    refetchInterval: (query) => {
      const updating = query.state.data?.accounts.some(
        (a) => a.fetch.state === 'queued' || a.fetch.state === 'fetching',
      );
      return fetching || updating ? POLL_INTERVAL : false;
    },
  });
}

export function useMonthlySummary(accountId: string, from: string, to: string) {
  return useQuery({
    queryKey: [...keys.summary, accountId, from, to],
    queryFn: () => getMonthlySummary(accountId, from, to),
    placeholderData: keepPreviousData,
  });
}

export function useTransactions(query: TransactionQuery, enabled = true) {
  return useQuery({
    queryKey: [...keys.transactions, query],
    queryFn: () => getTransactions(query),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useLogin() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (credentials: { username: string; password: string; code: string }) =>
      login(credentials.username, credentials.password, credentials.code),
    onSuccess: () => client.invalidateQueries(),
  });
}

export function useLogout() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      client.setQueryData(keys.me, null);
      client.removeQueries({ predicate: (query) => query.queryKey[0] !== keys.me[0] });
    },
  });
}

/** Mutations that change the bank state; all of them refresh status and accounts. */
function useBankMutation<T>(mutationFn: (value: T) => Promise<unknown>) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSettled: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: keys.bankStatus }),
        client.invalidateQueries({ queryKey: keys.accounts }),
      ]),
  });
}

export function useUnlock() {
  return useBankMutation((pin: string) => unlockBank(pin));
}

export function useLock() {
  return useBankMutation(() => lockBank());
}

export function useStartFetch() {
  return useBankMutation(() => startFetch());
}

export function useSelectAccount() {
  return useBankMutation((accountId: string) => selectAccount(accountId));
}
