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
  title?: string;
  description?: string;
}
export const PageConfirmDialog = ({
  open,
  onCancel,
  onSubmit,
  title,
  description,
}: PageConfirmDialogProps) => {
  const { t } = useTranslation();
  const uTitle = title || t('leaving.title');
  const uDescription = description || t('leaving.confirmq');
  return (
    <Dialog open={open}>
      <DialogContent aria-describedby="confirm before leave">
        <DialogHeader>
          <DialogTitle>{uTitle}</DialogTitle>
          <DialogDescription>{uDescription}</DialogDescription>
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
