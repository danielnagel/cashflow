import { useTranslation } from 'react-i18next';
import type { Account } from '@/lib/api';
import { useFormat } from '@/lib/format';
import { cn } from '@/lib/utils';

type Props = {
  accounts: Account[];
  selectedId: string;
  onSelect: (accountId: string) => void;
};

function useAccountStatus() {
  const { t } = useTranslation();
  const format = useFormat();

  return (account: Account): { text: string; tone: string } => {
    switch (account.fetch.state) {
      case 'queued':
      case 'fetching':
        return { text: t('accounts.status.fetching'), tone: 'bg-warning animate-pulse' };
      case 'done':
        return { text: t('accounts.status.done'), tone: 'bg-income' };
      case 'failed':
        return { text: t('accounts.status.failed'), tone: 'bg-expense' };
      case 'idle':
        return account.last_run
          ? {
              text: t('accounts.status.asOf', {
                date: format.dateTime(account.last_run.finished_at),
              }),
              tone: 'bg-muted-foreground',
            }
          : { text: t('accounts.status.never'), tone: 'bg-muted-foreground' };
    }
  };
}

export function AccountSwitcher({ accounts, selectedId, onSelect }: Props) {
  const { t } = useTranslation();
  const statusOf = useAccountStatus();

  return (
    <nav aria-label={t('accounts.switcher')} className="flex flex-wrap gap-2">
      {accounts.map((account) => {
        const status = statusOf(account);
        const selected = account.id === selectedId;
        return (
          <button
            key={account.id}
            type="button"
            aria-pressed={selected}
            className={cn(
              'flex flex-col items-start rounded-md border px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent',
              selected && 'border-primary bg-accent',
            )}
            onClick={() => {
              if (!selected) {
                onSelect(account.id);
              }
            }}
          >
            <span className="font-medium">
              {account.name} ··· {account.iban.slice(-4)}
            </span>
            <span
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
              data-testid="account-status"
            >
              <span className={cn('size-2 rounded-full', status.tone)} aria-hidden="true" />
              {status.text}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
