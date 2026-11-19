import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Account } from '@/lib/api';
import { formatIban } from '@/lib/format';

type Props = {
  accounts: Account[];
  pending: boolean;
  onSelect: (accountId: string) => void;
};

export function AccountSelection({ accounts, pending, onSelect }: Props) {
  const { t } = useTranslation();

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>
          <h2 className="text-xl font-semibold">{t('accounts.chooseTitle')}</h2>
        </CardTitle>
        <CardDescription>{t('accounts.chooseDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2">
          {accounts.map((account) => (
            <li key={account.id}>
              <Button
                variant="outline"
                className="h-auto w-full flex-col items-start gap-0.5 py-3"
                disabled={pending}
                onClick={() => {
                  onSelect(account.id);
                }}
              >
                <span className="font-medium">{account.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatIban(account.iban)} · {account.owner_name}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
