import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type BarShapeProps,
} from 'recharts';
import type { MonthSummary } from '@/lib/api';
import { useFormat } from '@/lib/format';

export type BarKind = 'income' | 'expense';
export type BarSelection = { month: string; kind: BarKind };

type Props = {
  data: MonthSummary[];
  selected: BarSelection | null;
  onSelect: (selection: BarSelection) => void;
};

type ChartPoint = {
  month: string;
  income: number;
  expense: number;
  diff: number;
  complete: boolean;
};

const COLORS: Record<BarKind, string> = { income: 'var(--income)', expense: 'var(--expense)' };
const SERIES = ['income', 'expense', 'diff'];

export function MonthlyChart({ data, selected, onSelect }: Props) {
  const { t } = useTranslation();
  const format = useFormat();
  const points: ChartPoint[] = data.map((m) => ({
    month: m.month,
    income: Number(m.income),
    expense: Number(m.expense),
    diff: Number(m.diff),
    complete: m.complete,
  }));

  // Every bar is its own button, so it can be clicked, focused and found by screen readers.
  const barShape = (kind: BarKind) =>
    function BarButton(props: BarShapeProps) {
      const point = props.payload as ChartPoint;
      const isSelected = selected?.month === point.month && selected.kind === kind;
      const select = () => {
        onSelect({ month: point.month, kind });
      };
      return (
        <rect
          x={props.x}
          y={props.y}
          width={props.width}
          height={props.height}
          fill={COLORS[kind]}
          fillOpacity={point.complete ? 1 : 0.45}
          stroke={isSelected ? 'var(--foreground)' : 'none'}
          strokeWidth={2}
          role="button"
          tabIndex={0}
          aria-pressed={isSelected}
          aria-label={t(`chart.bar.${kind}`, {
            month: format.month(point.month),
            amount: format.amount(point[kind]),
          })}
          className="cursor-pointer outline-none focus-visible:stroke-ring"
          onClick={select}
          onKeyDown={(event: KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              select();
            }
          }}
        />
      );
    };

  return (
    <div className="h-80 w-full" data-testid="monthly-chart">
      <ResponsiveContainer>
        <ComposedChart data={points} margin={{ top: 24, right: 16, bottom: 0, left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="month"
            tickFormatter={(month: string) => format.month(month, 'short')}
            stroke="var(--muted-foreground)"
          />
          <YAxis
            tickFormatter={(value: number) => format.difference(value)}
            stroke="var(--muted-foreground)"
            width={80}
          />
          <ReferenceLine y={0} stroke="var(--muted-foreground)" />
          <Tooltip
            cursor={{ fill: 'var(--muted)', opacity: 0.5 }}
            labelFormatter={(month) => (typeof month === 'string' ? format.month(month) : '')}
            formatter={(value) => format.amount(Number(value))}
            contentStyle={{ background: 'var(--popover)', borderColor: 'var(--border)' }}
            itemSorter={(item) => SERIES.indexOf(String(item.dataKey))}
          />
          <Legend itemSorter={null} />
          <Bar
            dataKey="income"
            name={t('chart.income')}
            fill={COLORS.income}
            shape={barShape('income')}
            isAnimationActive={false}
          />
          <Bar
            dataKey="expense"
            name={t('chart.expense')}
            fill={COLORS.expense}
            shape={barShape('expense')}
            isAnimationActive={false}
          />
          <Line
            dataKey="diff"
            name={t('chart.difference')}
            stroke="var(--foreground)"
            strokeWidth={2}
            dot={{ r: 4, fill: 'var(--foreground)' }}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="diff"
              position="top"
              offset={12}
              formatter={(value) => format.difference(Number(value))}
              fill="var(--foreground)"
              fontSize={12}
              fontWeight={600}
            />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
