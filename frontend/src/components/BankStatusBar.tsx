import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Account, BankStatus } from '@/lib/api';
import { useFormat } from '@/lib/format';

type Props = {
  status: BankStatus;
  account: Account;
  busy: boolean;
  onFetch: () => void;
  onLock: () => void;
  onUnlock: () => void;
};

export function BankStatusBar({ status, account, busy, onFetch, onLock, onUnlock }: Props) {
  const { t } = useTranslation();
  const format = useFormat();
  const unlocked = status.state === 'unlocked';
  const lastRun = account.last_run;

  return (
    <section aria-label={t('bank.region')} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="flex items-center gap-2" data-testid="bank-state">
          {t('bank.label')}:
          <Badge variant={unlocked ? 'default' : 'outline'}>
            {unlocked ? t('bank.unlocked') : t('bank.locked')}
          </Badge>
        </span>
        <span className="text-muted-foreground" role="status" data-testid="last-fetch">
          {status.fetching
            ? t('bank.fetching')
            : lastRun
              ? t('bank.lastFetch', {
                  date: format.dateTime(lastRun.finished_at),
                  new: lastRun.new_count,
                  skipped: lastRun.skipped_count,
                })
              : t('bank.neverFetched')}
        </span>
        {account.balance && (
          <span className="text-muted-foreground">
            {t('bank.balance', {
              amount: format.amount(account.balance.amount),
              date: format.date(account.balance.date),
            })}
          </span>
        )}
        <span className="ml-auto flex gap-2">
          <Button size="sm" disabled={!unlocked || status.fetching || busy} onClick={onFetch}>
            <RefreshCw className={status.fetching ? 'animate-spin' : undefined} />
            {t('bank.fetchNow')}
          </Button>
          {unlocked ? (
            <Button size="sm" variant="outline" disabled={busy} onClick={onLock}>
              {t('bank.lock')}
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={onUnlock}>
              {t('bank.unlock')}
            </Button>
          )}
        </span>
      </div>
      {status.error && (
        <Alert variant="destructive">
          <AlertTitle>{t('bank.fetchFailed')}</AlertTitle>
          <AlertDescription>{t(`errors.${status.error}`)}</AlertDescription>
        </Alert>
      )}
      {lastRun?.warning && (
        <Alert>
          <AlertDescription>{t(`warnings.${lastRun.warning}`)}</AlertDescription>
        </Alert>
      )}
      {account.gaps.map((gap) => (
        <Alert key={gap.start} data-testid="gap-warning">
          <AlertDescription>
            {t('bank.gap', { from: format.date(gap.start), to: format.date(gap.end) })}
          </AlertDescription>
        </Alert>
      ))}
    </section>
  );
}
