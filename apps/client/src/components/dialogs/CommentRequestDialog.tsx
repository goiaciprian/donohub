import { useAppForm } from '@/support/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import { Label } from '../ui/label';
import { DonationEvaluationType } from '@donohub/shared';

interface CommentRequestDialogProps {
  title: string;
  id: string | null;
  isLoading: boolean;
  onResponse: (values: {
    id: string;
    status: DonationEvaluationType;
    comment: string | null;
  }) => void;
  onClose: () => void;
  description?: string;
  closeText?: string;
  submitText?: string;
  closeButton?: boolean;
}

type SubmitMeta = {
  submitAction: DonationEvaluationType | null;
};

const initialMeta: SubmitMeta = {
  submitAction: null,
};

export const CommentRequestDialog = ({
  title,
  id,
  isLoading,
  onClose,
  onResponse,
  closeButton = false,
  description: descriptionRaw,
  closeText: closeTextRaw,
  submitText: submitTextRaw,
}: CommentRequestDialogProps) => {
  const { t } = useTranslation();

  const description = descriptionRaw || 'Comment required when denying';
  const closeText = closeTextRaw || t('internal.deny');
  const submitText = submitTextRaw || t('internal.approve');

  const commentForm = useAppForm({
    defaultValues: {
      comment: '',
    },
    onSubmitMeta: initialMeta,
    onSubmit: ({ value, meta }) => {
      if (!id || !meta.submitAction) {
        console.error("if you see this then it's a bug");
        return;
      }
      onClose();
      onResponse({
        id: id,
        comment: value.comment ? value.comment : null,
        status: meta.submitAction,
      });
    },
  });

  const closeWrapper = (s: boolean) => {
    if (!s) {
      commentForm.reset();
      onClose();
    }
  };

  return (
    <Dialog open={!!id} onOpenChange={closeWrapper}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <commentForm.AppField
              name="comment"
              children={(field) => {
                return (
                  <div>
                    <Label htmlFor={field.name} className="pb-3">
                      {t('donation.comment')}
                    </Label>
                    <field.Textarea
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isLoading}
                    />
                    {commentForm.state.isBlurred && (
                      <p>{field.state.meta.errors.map((e) => e)}</p>
                    )}
                  </div>
                );
              }}
            />
            <commentForm.Subscribe
              selector={(state) => [state.isSubmitting, state.values.comment]}
              children={([isSubmitting, comment]) => {
                return (
                  <div className="pt-3 w-full flex justify-end">
                    <commentForm.Button
                      variant="ghost"
                      className={closeButton ? "cursor-pointer" : 'hover:bg-red-200 cursor-pointer'}
                      disabled={
                        !closeButton &&
                        (!!isSubmitting || !comment || isLoading)
                      }
                      onClick={() =>
                        commentForm.handleSubmit({ submitAction: 'DECLINED' })
                      }
                    >
                      {closeText}
                    </commentForm.Button>
                    <commentForm.Button
                      variant="ghost"
                      className="hover:bg-green-200 cursor-pointer"
                      loading={!!isSubmitting || isLoading}
                      onClick={() =>
                        commentForm.handleSubmit({ submitAction: 'ACCEPTED' })
                      }
                    >
                      {submitText}
                    </commentForm.Button>
                  </div>
                );
              }}
            />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
