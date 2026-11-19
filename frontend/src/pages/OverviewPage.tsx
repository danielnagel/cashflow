import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MonthlyChart, type BarSelection } from '@/components/MonthlyChart';
import { MonthTransactions } from '@/components/MonthTransactions';
import { Button } from '@/components/ui/button';
import { useFormat } from '@/lib/format';
import { monthOf, monthWindow } from '@/lib/months';
import { useMonthlySummary } from '@/lib/queries';

const MONTHS_SHOWN = 4;

type Props = { accountId: string; today?: Date };

export function OverviewPage({ accountId, today = new Date() }: Props) {
  const { t } = useTranslation();
  const format = useFormat();
  const [offset, setOffset] = useState(0);
  const [selection, setSelection] = useState<BarSelection | null>(null);
  const range = monthWindow(monthOf(today), offset, MONTHS_SHOWN);
  const summary = useMonthlySummary(accountId, range.from, range.to);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="mr-auto text-lg font-semibold" data-testid="chart-range">
          {format.month(range.from)} – {format.month(range.to)}
        </h2>
        <Button
          variant="outline"
          size="icon"
          aria-label={t('overview.previous')}
          onClick={() => {
            setOffset(offset + 1);
          }}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label={t('overview.next')}
          disabled={offset === 0}
          onClick={() => {
            setOffset(offset - 1);
          }}
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          disabled={offset === 0}
          onClick={() => {
            setOffset(0);
          }}
        >
          {t('overview.today')}
        </Button>
      </div>
      {summary.data ? (
        <MonthlyChart data={summary.data} selected={selection} onSelect={setSelection} />
      ) : (
        <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
      )}
      {selection && <MonthTransactions accountId={accountId} selection={selection} />}
    </div>
  );
}
