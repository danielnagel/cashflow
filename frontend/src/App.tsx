import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, NavLink, Route, Routes } from 'react-router';
import { AccountSelection } from '@/components/AccountSelection';
import { AccountSwitcher } from '@/components/AccountSwitcher';
import { BankStatusBar } from '@/components/BankStatusBar';
import { PinDialog } from '@/components/PinDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { AccountList, BankStatus } from '@/lib/api';
import {
  keys,
  useAccounts,
  useBankStatus,
  useLock,
  useLogout,
  useMe,
  useSelectAccount,
  useStartFetch,
  useUnlock,
} from '@/lib/queries';
import { cn } from '@/lib/utils';
import { LoginPage } from '@/pages/LoginPage';
import { OverviewPage } from '@/pages/OverviewPage';
import { TransactionsPage } from '@/pages/TransactionsPage';

export function App() {
  const { t } = useTranslation();
  const me = useMe();

  if (me.isPending) {
    return <p className="p-6 text-muted-foreground">{t('common.loading')}</p>;
  }
  if (!me.data) {
    return <LoginPage />;
  }
  return <Authenticated username={me.data.username} />;
}

/**
 * Reloads the accounts once a fetch has ended, and the ledger data whenever the fetch of an
 * account has finished.
 */
function useRefreshAfterFetch(fetching: boolean, accounts: AccountList | undefined) {
  const client = useQueryClient();
  const wasFetching = useRef(fetching);
  useEffect(() => {
    if (wasFetching.current && !fetching) {
      void client.invalidateQueries({ queryKey: keys.accounts });
    }
    wasFetching.current = fetching;
  }, [client, fetching]);

  const finished = accounts?.accounts.map((a) => a.last_run?.finished_at ?? '').join() ?? '';
  const previous = useRef(finished);
  useEffect(() => {
    if (previous.current !== finished) {
      previous.current = finished;
      void client.invalidateQueries({ queryKey: keys.summary });
      void client.invalidateQueries({ queryKey: keys.transactions });
    }
  }, [client, finished]);
}

function Authenticated({ username }: { username: string }) {
  const { t } = useTranslation();
  const status = useBankStatus();
  const fetching = status.data?.fetching ?? false;
  const accounts = useAccounts(fetching);
  const unlock = useUnlock();
  const lock = useLock();
  const startFetch = useStartFetch();
  const selectAccount = useSelectAccount();
  const logout = useLogout();
  const [pinSkipped, setPinSkipped] = useState(false);
  useRefreshAfterFetch(fetching, accounts.data);

  if (!status.data || !accounts.data) {
    return <p className="p-6 text-muted-foreground">{t('common.loading')}</p>;
  }

  const bank: BankStatus = status.data;
  const list = accounts.data.accounts;
  const selected = list.find((a) => a.id === accounts.data.selected_id);

  const pinDialog = (
    <PinDialog
      open={bank.state === 'locked' && !pinSkipped}
      rejected={bank.error === 'pin_wrong'}
      pending={unlock.isPending}
      onUnlock={(pin) => {
        unlock.mutate(pin);
      }}
      onSkip={() => {
        setPinSkipped(true);
      }}
    />
  );

  let content;
  if (list.length === 0) {
    content = (
      <div className="mx-auto flex max-w-lg flex-col gap-4">
        {bank.fetching ? (
          <p role="status">{t('accounts.loading')}</p>
        ) : (
          <>
            {bank.error && bank.error !== 'pin_wrong' && (
              <Alert variant="destructive">
                <AlertDescription>{t(`errors.${bank.error}`)}</AlertDescription>
              </Alert>
            )}
            <p>{t('accounts.none')}</p>
            {bank.state === 'locked' ? (
              <Button
                onClick={() => {
                  setPinSkipped(false);
                }}
              >
                {t('bank.unlock')}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  startFetch.mutate();
                }}
              >
                {t('bank.fetchNow')}
              </Button>
            )}
          </>
        )}
      </div>
    );
  } else if (!selected) {
    content = (
      <AccountSelection
        accounts={list}
        pending={selectAccount.isPending}
        onSelect={(id) => {
          selectAccount.mutate(id);
        }}
      />
    );
  } else {
    content = (
      <div className="flex flex-col gap-6">
        <AccountSwitcher
          accounts={list}
          selectedId={selected.id}
          onSelect={(id) => {
            selectAccount.mutate(id);
          }}
        />
        <BankStatusBar
          status={bank}
          account={selected}
          busy={lock.isPending || startFetch.isPending}
          onFetch={() => {
            startFetch.mutate();
          }}
          onLock={() => {
            // Locking is deliberate: do not ask for the PIN again right away.
            setPinSkipped(true);
            lock.mutate();
          }}
          onUnlock={() => {
            setPinSkipped(false);
          }}
        />
        <Routes>
          <Route path="/" element={<OverviewPage key={selected.id} accountId={selected.id} />} />
          <Route
            path="/transactions"
            element={<TransactionsPage key={selected.id} accountId={selected.id} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    );
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent',
      isActive && 'bg-accent text-accent-foreground',
    );

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-6 p-6">
      <header className="flex flex-wrap items-center gap-4 border-b pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">{t('app.name')}</h1>
        {selected && (
          <nav aria-label={t('nav.label')} className="flex gap-1">
            <NavLink to="/" end className={navClass}>
              {t('nav.overview')}
            </NavLink>
            <NavLink to="/transactions" className={navClass}>
              {t('nav.transactions')}
            </NavLink>
          </nav>
        )}
        <span className="ml-auto text-sm text-muted-foreground">{username}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            logout.mutate();
          }}
        >
          {t('nav.logout')}
        </Button>
      </header>
      <main className="flex flex-col gap-6">{content}</main>
      {pinDialog}
    </div>
  );
}
