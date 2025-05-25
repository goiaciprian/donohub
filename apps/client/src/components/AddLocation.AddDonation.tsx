import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Label } from './ui/label';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import { postLocation } from '@/support';
import { useAppForm } from '@/support/form';
import { PostLocationDto } from '@donohub/shared';
import { toast } from 'sonner';
import { useCallback, useState } from 'react';
import { PageConfirmDialog } from './dialogs/PageConfirmDialog';

export const AddLocation = ({
  sheetOpen,
  setSheetOpen,
}: {
  sheetOpen: boolean;
  setSheetOpen: (v: boolean) => void;
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [confirmDialog, setConfirmDialog] = useState(false);

  const postLocationFn = useAuthRequest(postLocation);
  const locationMutation = useMutation({
    mutationKey: ['location'],
    mutationFn: (body: PostLocationDto) => postLocationFn({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setSheetOpen(false);
      toast.success(t('internal.create'));
    },
    onError: () => toast.error(t('internal.error')),
  });

  const locationForm = useAppForm({
    defaultValues: {
      city: '',
      county: '',
      street: null as null | string,
      number: null as null | string,
      postalCode: null as null | string,
    },
    onSubmit: ({ value }) => {
      locationMutation.mutate(value);
    },
  });

  const closeAndStay = useCallback(() => {
    setConfirmDialog(false);
  }, []);

  const closeAndLeave = useCallback(() => {
    setConfirmDialog(false);
    locationForm.reset();
    setSheetOpen(false);
  }, []);

  const closeCheck = useCallback((nextValue: boolean) => {
    if (locationForm.state.isDirty && !nextValue) {
      setConfirmDialog(true);
      return;
    }
    setSheetOpen(nextValue);
    locationForm.reset();
  }, []);

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={closeCheck}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-xl">{t('location.title')}</SheetTitle>
          </SheetHeader>
          <div className="h-full">
            <form
              className="flex flex-col flex-1 h-full py-5 px-3 gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                locationForm.handleSubmit();
              }}
            >
              <locationForm.AppField
                name="county"
                validators={{
                  onChange: ({ value }) =>
                    value.length === 0
                      ? t('internal.validations.required')
                      : undefined,
                }}
                children={(field) => (
                  <div>
                    <Label htmlFor={field.name} className="font-semibold pb-2">
                      {t('location.county')}
                    </Label>
                    <Input
                      onBlur={field.handleBlur}
                      disabled={locationMutation.isPending}
                      id={field.name}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.map((e, index) => (
                      <p className="text-red-600" key={index}>
                        {e}
                      </p>
                    ))}
                  </div>
                )}
              />
              <locationForm.AppField
                name="city"
                validators={{
                  onChange: ({ value }) =>
                    value.length === 0
                      ? t('internal.validations.required')
                      : undefined,
                }}
                children={(field) => (
                  <div>
                    <Label htmlFor={field.name} className="font-semibold pb-2">
                      {t('location.city')}
                    </Label>
                    <Input
                      onBlur={field.handleBlur}
                      disabled={locationMutation.isPending}
                      id={field.name}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.map((e, index) => (
                      <p className="text-red-600" key={index}>
                        {e}
                      </p>
                    ))}
                  </div>
                )}
              />
              <locationForm.AppField
                name="street"
                children={(field) => (
                  <div>
                    <Label htmlFor={field.name} className="font-semibold pb-2">
                      {t('location.street')}
                    </Label>
                    <Input
                      id={field.name}
                      onBlur={field.handleBlur}
                      disabled={locationMutation.isPending}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              />
              <locationForm.AppField
                name="number"
                children={(field) => (
                  <div>
                    <Label htmlFor={field.name} className="font-semibold pb-2">
                      {t('location.number')}
                    </Label>
                    <Input
                      disabled={locationMutation.isPending}
                      onBlur={field.handleBlur}
                      id={field.name}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              />
              <locationForm.AppField
                name="postalCode"
                children={(field) => (
                  <div>
                    <Label htmlFor={field.name} className="font-semibold pb-2">
                      {t('location.postalCode')}
                    </Label>
                    <Input
                      id={field.name}
                      onBlur={field.handleBlur}
                      disabled={locationMutation.isPending}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              />

              <locationForm.AppForm>
                <locationForm.Subscribe
                  selector={(s) => s.isSubmitting}
                  children={(isSubmitting) => (
                    <SheetFooter className="flex flex-row justify-end mt-auto">
                      <SheetClose asChild>
                        <Button
                          disabled={locationMutation.isPending || isSubmitting}
                          variant="secondary"
                        >
                          {t('internal.close')}
                        </Button>
                      </SheetClose>
                      <Button
                        loading={locationMutation.isPending || isSubmitting}
                        type="submit"
                      >
                        {t('internal.submit')}
                      </Button>
                    </SheetFooter>
                  )}
                />
              </locationForm.AppForm>
            </form>
          </div>
        </SheetContent>
      </Sheet>
      <PageConfirmDialog
        open={confirmDialog}
        onCancel={closeAndStay}
        onSubmit={closeAndLeave}
      />
    </>
  );
};
