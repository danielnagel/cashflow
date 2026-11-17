import { useTranslation } from 'react-i18next';
import { HealthStatus } from '@/components/HealthStatus';

export function App() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center gap-4 p-6">
      <h1 className="text-3xl font-semibold tracking-tight">{t('app.name')}</h1>
      <p className="text-muted-foreground">{t('app.tagline')}</p>
      <HealthStatus />
    </main>
  );
}
