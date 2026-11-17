import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchHealth } from '@/lib/api';
import { cn } from '@/lib/utils';

export function HealthStatus() {
  const { t } = useTranslation();
  const { data, isPending, isError } = useQuery({ queryKey: ['health'], queryFn: fetchHealth });

  let text = t('health.checking');
  let tone = 'bg-muted-foreground';
  if (isError) {
    text = t('health.error');
    tone = 'bg-expense';
  } else if (!isPending) {
    const ok = data.status === 'ok';
    text = ok ? t('health.ok') : t('health.unavailable');
    tone = ok ? 'bg-income' : 'bg-expense';
  }

  return (
    <p className="flex items-center gap-2 text-sm" role="status">
      <span className={cn('size-2 rounded-full', tone)} aria-hidden="true" />
      <span className="text-muted-foreground">{t('health.label')}:</span>
      <span>{text}</span>
    </p>
  );
}
