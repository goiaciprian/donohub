import { useAppForm } from '@/support/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { PaginatedEvaluatedDonationDto } from '@donohub/shared';
import { Label } from '../ui/label';
import { useTranslation } from 'react-i18next';
import { Input } from '../ui/input';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getCategories, getLocations, updateDonation } from '@/support';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { LocaleCategoriesHeleper } from '@/lib/utils';
import { AddLocation } from '../AddLocation.AddDonation';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
type FormMetadata = {
  submitType: 'SUBMIT' | 'CANCEL' | null;
};

const initialMetadata: FormMetadata = {
  submitType: null,
};

type EditDonationDialogProps = {
  onClose: () => void;
  donation: PaginatedEvaluatedDonationDto['items'][number] | null;
};

export const EditDonationDialog = ({
  onClose,
  donation,
}: EditDonationDialogProps) => {
  const { t } = useTranslation(['translation', 'categories']);
  const queryClient = useQueryClient();
  const [locationSheet, setLocationSheet] = useState(false);

  const getCategoriesFn = useAuthRequest(getCategories);
  const categoriesQuery = useSuspenseQuery({
    queryKey: ['categories'],
    queryFn: () => getCategoriesFn({}),
  });

  const getLocationsFn = useAuthRequest(getLocations);
  const locationsQuery = useSuspenseQuery({
    queryKey: ['locations'],
    queryFn: () => getLocationsFn({}),
  });

  const categories = categoriesQuery.data.map((ctg) => ({
    value: ctg.id,
    text: t(`categories:${ctg.name}` as LocaleCategoriesHeleper),
  }));
  const locations = locationsQuery.data.map((loc) => ({
    value: loc.id,
    text: `${loc.street ?? ''} ${loc.number ?? ''} ${loc.city}, ${loc.county} ${loc.postalCode ? `(${loc.postalCode})` : ''}`,
  }));

  const updateDonationFn = useAuthRequest(updateDonation);
  const updateDonationMutation = useMutation({
    mutationKey: ['updateDonation', donation?.id],
    mutationFn: (body: FormData) =>
      updateDonationFn({
        pathParams: [{ key: ':id', value: donation?.id ?? '' }],
        body,
      }),
    onError: () => toast.error(t('internal.error')),
    onSuccess: () => {
      closeWrapper(false);
      queryClient.invalidateQueries({ queryKey: ['selfDonations'] });
      toast.success(t('internal.submit'));
    },
  });

  const closeWrapper = (s: boolean) => {
    if (!s) {
      form.reset();
      onClose();
    }
  };

  const form = useAppForm({
    defaultValues: {
      title: undefined as string | undefined,
      description: undefined as string | undefined,
      quantity: undefined as string | undefined,
      phone: undefined as string | undefined,
      categoryId: undefined as string | undefined,
      locationId: undefined as string | undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      attachements: undefined as any,
    },
    onSubmitMeta: initialMetadata,
    onSubmit: ({ value, meta }) => {
      if (meta.submitType === 'CANCEL') {
        closeWrapper(false);
        return;
      }
      const formData = new FormData();

      const { attachements, ...rest } = value;

      Object.entries(rest).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      if (attachements) {
        for (let i = 0; i < attachements.length; i++) {
          const file = attachements.item(i);
          if (!file) {
            continue;
          }
          formData.append('attachements', file);
        }
      }

      updateDonationMutation.mutate(formData);
    },
  });

  const images = useCallback(() => {
    return donation?.attachements ?? [];
  }, [donation]);

  const [newImages, setNewImages] = useState<string[]>([]);

  useEffect(() => {
    const img: string[] = [];
    const attachements = form.state.values.attachements;
    if (attachements) {
      for (let i = 0; i < attachements.length; i++) {
        const path = attachements.item(i);
        if (path) img.push(URL.createObjectURL(path));
      }
    }
    setNewImages(img);
  }, [form.state.values.attachements, setNewImages]);
  return (
    <>
      <Dialog open={!!donation} onOpenChange={closeWrapper}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit donation</DialogTitle>
            <DialogDescription>
              We recomend editing only the fields mentioned by the reviewer
            </DialogDescription>
          </DialogHeader>
          <div>
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <form.AppField
                name={'title'}
                children={(field) => (
                  <div>
                    <Label htmlFor={field.name} className="pb-2">
                      {t('addDonation.title')}
                    </Label>
                    <Input
                      id={field.name}
                      defaultValue={donation?.title ?? ''}
                      disabled={updateDonationMutation.isPending}
                      onChange={(e) =>
                        field.handleChange(e.target.value || undefined)
                      }
                      onBlur={field.handleBlur}
                    />
                  </div>
                )}
              />
              <form.AppField
                name={'description'}
                children={(field) => (
                  <div>
                    <Label htmlFor={field.name} className="pb-2">
                      {t('addDonation.description')}
                    </Label>
                    <Input
                      id={field.name}
                      defaultValue={donation?.description ?? ''}
                      disabled={updateDonationMutation.isPending}
                      onChange={(e) =>
                        field.handleChange(e.target.value || undefined)
                      }
                      onBlur={field.handleBlur}
                    />
                  </div>
                )}
              />

              <div className="flex gap-2">
                <form.AppField
                  name={'quantity'}
                  children={(field) => (
                    <div className="flex-1">
                      <Label htmlFor={field.name} className="pb-2">
                        {t('addDonation.quantity')}
                      </Label>
                      <Input
                        id={field.name}
                        defaultValue={donation?.quantity ?? ''}
                        disabled={updateDonationMutation.isPending}
                        onChange={(e) =>
                          field.handleChange(e.target.value || undefined)
                        }
                        onBlur={field.handleBlur}
                      />
                    </div>
                  )}
                />
                <form.AppField
                  name={'phone'}
                  children={(field) => (
                    <div className="flex-1">
                      <Label htmlFor={field.name} className="pb-2">
                        {t('addDonation.phone')}
                      </Label>
                      <Input
                        id={field.name}
                        defaultValue={donation?.phone ?? ''}
                        disabled={updateDonationMutation.isPending}
                        onChange={(e) =>
                          field.handleChange(e.target.value || undefined)
                        }
                        onBlur={field.handleBlur}
                      />
                    </div>
                  )}
                />
              </div>

              <div className="flex gap-2">
                <form.AppField
                  name={'categoryId'}
                  children={(field) => (
                    <div className="flex-1">
                      <Label htmlFor={field.name} className="pb-2">
                        {t('addDonation.category')}
                      </Label>
                      <field.Select
                        disabled={updateDonationMutation.isPending}
                        onValueChange={field.handleChange}
                        defaultValue={donation?.categoryId ?? ''}
                      >
                        <field.SelectTrigger className="w-full" id={field.name}>
                          <field.SelectValue />
                        </field.SelectTrigger>
                        <field.SelectContent>
                          {categories.map((c) => (
                            <field.SelectItem value={c.value} key={c.value}>
                              {c.text}
                            </field.SelectItem>
                          ))}
                        </field.SelectContent>
                      </field.Select>
                    </div>
                  )}
                />
                <form.AppField
                  name={'locationId'}
                  children={(field) => (
                    <div className="flex-1">
                      <Label htmlFor={field.name} className="pb-2">
                        {t('addDonation.location')}
                      </Label>
                      <field.Select
                        disabled={updateDonationMutation.isPending}
                        onValueChange={field.handleChange}
                        defaultValue={donation?.locationId ?? ''}
                      >
                        <field.SelectTrigger className="w-full" id={field.name}>
                          <field.SelectValue />
                        </field.SelectTrigger>
                        <field.SelectContent>
                          {locations.map((c) => (
                            <field.SelectItem value={c.value} key={c.value}>
                              {c.text}
                            </field.SelectItem>
                          ))}
                        </field.SelectContent>
                      </field.Select>
                      <Button
                        className={'pl-0'}
                        variant="link"
                        onClick={(e) => {
                          e.preventDefault();
                          setLocationSheet(true);
                        }}
                        disabled={updateDonationMutation.isPending}
                      >
                        {t('addDonation.addLocation')}
                      </Button>
                    </div>
                  )}
                />
              </div>
              <form.AppField
                name={'attachements'}
                validators={{
                  onChange: ({ value }) => {
                    const length = (donation?.attachements ?? []).length;
                    return value && value.length > length
                      ? `Only 4 images allowed`
                      : undefined;
                  },
                }}
                children={(field) => {
                  return (
                    <div>
                      <div className="pb-3">
                        <p className="font-semibold">Images</p>
                        <div className={'flex flex-row gap-2'}>
                          <div className="flex flex-row gap-2">
                            {images().map((url) => (
                              <div key={url} className="relative">
                                <img
                                  src={url}
                                  className={'w-20 h-20'}
                                  alt={donation?.title ?? ''}
                                />
                                <div className="absolute top-0 left-0 bottom-0 right-0 w-full h-full opacity-0 hover:opacity-50 hover:bg-black" />
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-row gap-2">
                            {newImages.map((url, index) => {
                              return (
                                <img
                                  key={url}
                                  className="max-w-20 max-h-20"
                                  src={url}
                                  alt={`new ${index}`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <Input
                        id={field.name}
                        type="file"
                        accept={'image/png, image/jpg, image/jpeg'}
                        multiple
                        disabled={updateDonationMutation.isPending}
                        onChange={(e) =>
                          field.handleChange(e.target.files || undefined)
                        }
                        onBlur={field.handleBlur}
                      />
                      <div>
                        {field.state.meta.errors.map((e, index) => (
                          <p key={index} className="text-red-500">
                            {e}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                }}
              />
              <form.AppForm>
                <div className="flex gap-2 justify-end">
                  <form.Button
                    disabled={updateDonationMutation.isPending}
                    className="cursor-pointer"
                    onClick={() => form.handleSubmit({ submitType: 'CANCEL' })}
                    variant="secondary"
                  >
                    {t('internal.close')}
                  </form.Button>
                  <form.Button
                    loading={updateDonationMutation.isPending}
                    className="cursor-pointer"
                    onClick={() => form.handleSubmit({ submitType: 'SUBMIT' })}
                  >
                    {t('internal.submit')}
                  </form.Button>
                </div>
              </form.AppForm>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      <AddLocation sheetOpen={locationSheet} setSheetOpen={setLocationSheet} />
    </>
  );
};
