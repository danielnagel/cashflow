import { useTranslation } from 'react-i18next';
import type { BarSelection } from '@/components/MonthlyChart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useFormat } from '@/lib/format';
import { useTransactions } from '@/lib/queries';
import { amountClass } from '@/lib/utils';

const PAGE_SIZE = 200;

type Props = { accountId: string; selection: BarSelection };

export function MonthTransactions({ accountId, selection }: Props) {
  const { t } = useTranslation();
  const format = useFormat();
  const { data, isPending } = useTransactions({
    accountId,
    month: selection.month,
    type: selection.kind,
    sort: 'booking_date',
    order: 'asc',
    pageSize: PAGE_SIZE,
  });
  const title = t(`overview.detail.${selection.kind}`, {
    month: format.month(selection.month),
  });

  return (
    <section aria-label={title} className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      {isPending ? (
        <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('transactions.counterparty')}</TableHead>
              <TableHead className="text-right">{t('transactions.amount')}</TableHead>
              <TableHead>{t('transactions.date')}</TableHead>
              <TableHead>{t('transactions.purpose')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.counterparty_name}</TableCell>
                <TableCell className={amountClass(item.amount)}>
                  {format.amount(item.amount)}
                </TableCell>
                <TableCell>{format.date(item.booking_date)}</TableCell>
                <TableCell className="max-w-md truncate text-muted-foreground">
                  {item.purpose || item.posting_text}
                </TableCell>
              </TableRow>
            ))}
            {data?.items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  {t('transactions.empty')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      {data && data.total > data.items.length && (
        <p className="text-sm text-muted-foreground">
          {t('overview.detail.truncated', { shown: data.items.length, total: data.total })}
        </p>
      )}
    </section>
  );
}
