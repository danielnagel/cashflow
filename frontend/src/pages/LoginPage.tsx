import { useState, type SubmitEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { HealthStatus } from '@/components/HealthStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiError } from '@/lib/api';
import { useLogin } from '@/lib/queries';

export function LoginPage() {
  const { t } = useTranslation();
  const loginMutation = useLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    loginMutation.mutate(
      { username, password, code },
      {
        onError: () => {
          setCode('');
        },
      },
    );
  };

  const error = loginMutation.error;
  let message: string | null = null;
  if (error instanceof ApiError && error.code === 'too_many_attempts') {
    message = t('login.tooManyAttempts');
  } else if (error) {
    message = t('login.failed');
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-sm flex-col justify-center gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl font-semibold tracking-tight">{t('app.name')}</h1>
          </CardTitle>
          <CardDescription>{t('app.tagline')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={submit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">{t('login.username')}</Label>
              <Input
                id="username"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">{t('login.password')}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="code">{t('login.code')}</Label>
              <Input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                required
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.trim());
                }}
              />
            </div>
            {message && (
              <Alert variant="destructive">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={loginMutation.isPending}>
              {t('login.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
      <HealthStatus />
    </main>
  );
}
