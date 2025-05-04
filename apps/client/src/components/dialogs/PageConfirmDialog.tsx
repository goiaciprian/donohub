import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';

interface PageConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}
export const PageConfirmDialog = ({
  open,
  onCancel,
  onSubmit,
}: PageConfirmDialogProps) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open}>
      <DialogContent aria-describedby="confirm before leave">
        <DialogHeader>
          <DialogTitle>{t('leaving.title')}</DialogTitle>
          <DialogDescription>{t('leaving.confirmq')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex w-full justify-end gap-3">
            <Button variant="secondary" onClick={onCancel}>
              {t('leaving.cancel')}
            </Button>
            <Button onClick={onSubmit}>{t('leaving.submit')}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
