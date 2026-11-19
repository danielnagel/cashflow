import {
  createColumnHelper,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type SortingState,
  type Updater,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { SortField, Transaction } from '@/lib/api';
import { useFormat } from '@/lib/format';
import { useTransactions } from '@/lib/queries';
import { amountClass, cn } from '@/lib/utils';

const PAGE_SIZE = 50;
const SEARCH_DELAY_MS = 300;

const features = tableFeatures({ rowSortingFeature });
const column = createColumnHelper<typeof features, Transaction>();

export function TransactionsPage({ accountId }: { accountId: string }) {
  const { t } = useTranslation();
  const format = useFormat();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'booking_date', desc: true }]);
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search);
      setPage(1);
    }, SEARCH_DELAY_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const sort = sorting[0] ?? { id: 'booking_date', desc: true };
  const { data } = useTransactions({
    accountId,
    fromDate,
    toDate,
    q: query,
    sort: sort.id as SortField,
    order: sort.desc ? 'desc' : 'asc',
    page,
    pageSize: PAGE_SIZE,
  });

  const columns = useMemo(
    () =>
      column.columns([
        column.accessor('booking_date', {
          header: t('transactions.date'),
          cell: (info) => format.date(info.getValue()),
        }),
        column.accessor('counterparty_name', {
          header: t('transactions.counterparty'),
          cell: (info) => <span className="font-medium">{info.getValue()}</span>,
        }),
        column.accessor('purpose', {
          header: t('transactions.purpose'),
          enableSorting: false,
          cell: (info) => (
            <span className="block max-w-md truncate text-muted-foreground">
              {info.getValue() || info.row.original.posting_text}
            </span>
          ),
        }),
        column.accessor('amount', {
          header: t('transactions.amount'),
          cell: (info) => format.amount(info.getValue()),
        }),
        column.accessor('balance_after', {
          header: t('transactions.balanceAfter'),
          enableSorting: false,
          cell: (info) => {
            const value = info.getValue();
            return value === null ? '–' : format.amount(value);
          },
        }),
      ]),
    [t, format],
  );

  const table = useTable({
    features,
    columns,
    data: data?.items ?? [],
    state: { sorting },
    onSortingChange: (updater: Updater<SortingState>) => {
      setSorting(typeof updater === 'function' ? updater(sorting) : updater);
      setPage(1);
    },
    manualSorting: true,
    enableSortingRemoval: false,
  });

  const pages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;
  const pending = page === 1 ? (data?.pending ?? []) : [];

  return (
    <div className="flex flex-col gap-4">
      <form
        className="flex flex-wrap items-end gap-4"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="from-date">{t('transactions.from')}</Label>
          <Input
            id="from-date"
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="to-date">{t('transactions.to')}</Label>
          <Input
            id="to-date"
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex min-w-64 flex-1 flex-col gap-2">
          <Label htmlFor="search">{t('transactions.search')}</Label>
          <Input
            id="search"
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </form>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => {
                const sorted = header.column.getIsSorted();
                const numeric =
                  header.column.id === 'amount' || header.column.id === 'balance_after';
                return (
                  <TableHead
                    key={header.id}
                    className={cn(numeric && 'text-right')}
                    aria-sort={
                      sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined
                    }
                  >
                    {header.column.getCanSort() ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 hover:text-foreground"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <table.FlexRender header={header} />
                        {sorted === 'asc' && <ArrowUp className="size-3" aria-hidden="true" />}
                        {sorted === 'desc' && <ArrowDown className="size-3" aria-hidden="true" />}
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {pending.map((item) => (
            <TableRow key={item.id} className="text-muted-foreground" data-testid="pending-row">
              <TableCell>{format.date(item.booking_date)}</TableCell>
              <TableCell className="font-medium">
                {item.counterparty_name}{' '}
                <Badge variant="outline">{t('transactions.pending')}</Badge>
              </TableCell>
              <TableCell>
                <span className="block max-w-md truncate">{item.purpose}</span>
              </TableCell>
              <TableCell className={amountClass(item.amount)}>
                {format.amount(item.amount)}
              </TableCell>
              <TableCell />
            </TableRow>
          ))}
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-testid="transaction-row">
              {row.getAllCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    cell.column.id === 'amount' && amountClass(row.original.amount),
                    cell.column.id === 'balance_after' && 'text-right tabular-nums',
                  )}
                >
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
          {data?.items.length === 0 && pending.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground">
                {t('transactions.empty')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {t('transactions.count', { count: data?.total ?? 0 })}
        </span>
        <span className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => {
              setPage(page - 1);
            }}
          >
            {t('transactions.previousPage')}
          </Button>
          <span>{t('transactions.page', { page, pages })}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pages}
            onClick={() => {
              setPage(page + 1);
            }}
          >
            {t('transactions.nextPage')}
          </Button>
        </span>
      </div>
    </div>
  );
}
