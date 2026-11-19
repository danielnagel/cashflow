import { useState, type SubmitEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  open: boolean;
  /** Shown when the last PIN was rejected by the bank. */
  rejected: boolean;
  pending: boolean;
  onUnlock: (pin: string) => void;
  onSkip: () => void;
};

export function PinDialog({ open, rejected, pending, onUnlock, onSkip }: Props) {
  const { t } = useTranslation();
  const [pin, setPin] = useState('');

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    if (pin) {
      onUnlock(pin);
      setPin('');
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          onSkip();
        }
      }}
    >
      <DialogContent showCloseButton={false}>
        <form className="flex flex-col gap-4" onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>{t('pin.title')}</DialogTitle>
            <DialogDescription>{t('pin.description')}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pin">{t('pin.label')}</Label>
            <Input
              id="pin"
              type="password"
              autoComplete="off"
              autoFocus
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
              }}
            />
          </div>
          {rejected && (
            <Alert variant="destructive">
              <AlertDescription>{t('errors.pin_wrong')}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onSkip}>
              {t('pin.skip')}
            </Button>
            <Button type="submit" disabled={!pin || pending}>
              {t('pin.unlock')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
