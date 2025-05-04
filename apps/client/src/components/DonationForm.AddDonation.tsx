import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getCategories, getLocations, postDonations } from '@/support';
import { useAppForm } from '@/support/form';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { CategoryDto } from '@donohub/shared';
import { Button } from './ui/button';
import React from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { AddLocation } from './AddLocation.AddDonation';
import { UploadCloud, X } from 'lucide-react';
import { usePrompt } from '@/hooks/usePrompt';
import { PageConfirmDialog } from './dialogs/PageConfirmDialog';
import { LocaleCategoriesHeleper } from '@/lib/utils';

export const AddDonationForm = () => {
  const { t } = useTranslation(['translation', 'categories']);
  const { lang } = useParams();
  const navigate = useNavigate();

  const [sheetOpen, setSheetOpen] = React.useState(false);

  const getCategoriesFn = useAuthRequest(getCategories);
  const categoriesQuery = useSuspenseQuery<CategoryDto[]>({
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

  const postDonationFn = useAuthRequest(postDonations);
  const postDonationMutation = useMutation({
    mutationKey: ['donation'],
    mutationFn: (body: FormData) => postDonationFn({ body }),
    onSuccess: (resp) => {
      form.reset();
      toast.success(t('internal.create'));
      navigate(`/${lang}/donations/${resp.id}`);
    },
    onError: () => toast.error(t('internal.error')),
  });

  const form = useAppForm({
    defaultValues: {
      title: '',
      description: '',
      quantity: null as null | string,
      phone: null as null | string,
      locationId: '',
      categoryId: '',
      attachements: null as FileList | null,
    },
    onSubmit: ({ value }) => {
      if (value.attachements === null) {
        return;
      }

      const formData = new FormData();
      formData.append('title', value.title);
      formData.append('description', value.description);
      formData.append('categoryId', value.categoryId);
      formData.append('locationId', value.locationId);
      formData.append('qunatity', value.quantity as string);
      formData.append('phone', value.phone as string);

      for (let i = 0; i < value.attachements.length; i++) {
        const file = value.attachements.item(i);
        if (!file) {
          continue;
        }
        formData.append('attachements', file);
      }

      postDonationMutation.mutateAsync(formData);
    },
  });

  const preventDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const selectFirst4 = (fileList: FileList | null): FileList | null => {
    if (!fileList) {
      return null;
    }
    if (fileList.length > 4) {
      // @ts-expect-error cannot remove items from filelist in an ok way this works
      return Array.prototype.slice.call(fileList, 0, 4);
    }
    return fileList;
  };

  const [showPrompt, confirmNavigation, cancelNavigation] = usePrompt(
    () => form.state.isDirty,
  );

  // console.log(form.state);

  return (
    <>
      <div className="h-full">
        <form
          className="flex flex-col gap-5 py-10 lg:md:px-25"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppField
            name="title"
            validators={{
              onChange: ({ value }) =>
                value.length === 0
                  ? t('internal.validations.required')
                  : undefined,
            }}
            children={(field) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="font-semibold text-md pb-2"
                >
                  {t('addDonation.title')}
                </Label>
                <field.Input
                  id={field.name}
                  value={field.state.value}
                  disabled={postDonationMutation.isPending}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {/* {field.state.meta.isBlurred && */}
                {field.state.meta.errors.map((e, index) => {
                  return (
                    <p key={index} className="text-red-600">
                      {e}
                    </p>
                  );
                })}
              </div>
            )}
          />

          <form.AppField
            name="description"
            validators={{
              onChange: ({ value }) =>
                value.length === 0
                  ? t('internal.validations.required')
                  : undefined,
            }}
            children={(field) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="font-semibold text-md pb-2"
                >
                  {t('addDonation.description')}
                </Label>
                <field.Input
                  id={field.name}
                  disabled={postDonationMutation.isPending}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {/* {field.state.meta.isBlurred && */}
                  {field.state.meta.errors.map((e, index) => (
                    <p key={index} className="text-red-600">
                      {e}
                    </p>
                  ))}
              </div>
            )}
          />
          <form.AppField
            name="quantity"
            children={(field) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="font-semibold text-md pb-2"
                >
                  {t('addDonation.quantity')}
                </Label>
                <field.Input
                  id={field.name}
                  value={field.state.value ?? ''}
                  disabled={postDonationMutation.isPending}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />

          <form.AppField
            name="phone"
            validators={{
              onChange: ({ value }) =>
                value
                  ? /[0-9]{10}/.test(value)
                    ? undefined
                    : t('internal.validations.phone')
                  : undefined,
            }}
            children={(field) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="font-semibold text-md pb-2"
                >
                  {t('addDonation.phone')}
                </Label>
                <field.Input
                  id={field.name}
                  value={field.state.value ?? ''}
                  type="number"
                  disabled={postDonationMutation.isPending}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isBlurred &&
                  field.state.meta.errors.map((e, index) => (
                    <p key={index} className="text-red-600">
                      {e}
                    </p>
                  ))}
              </div>
            )}
          />

          <div className="flex gap-10 w-full">
            <form.AppField
              name="categoryId"
              validators={{
                onChange: ({ value }) =>
                  value.length === 0
                    ? t('internal.validations.required')
                    : undefined,
              }}
              children={(field) => (
                <div className="flex-1/2">
                  <Label
                    htmlFor={field.name}
                    className="font-semibold text-md pb-2"
                  >
                    {t('donations.category')}
                  </Label>
                  <field.Select
                    onValueChange={field.handleChange}
                    disabled={postDonationMutation.isPending}
                  >
                    <field.SelectTrigger
                      className="w-full"
                      value={field.state.value}
                    >
                      <field.SelectValue />
                    </field.SelectTrigger>
                    <field.SelectContent onBlur={field.handleBlur}>
                      {categories.map((ctg) => (
                        <field.SelectItem value={ctg.value} key={ctg.value}>
                          {ctg.text}
                        </field.SelectItem>
                      ))}
                    </field.SelectContent>
                  </field.Select>
                  {/* {field.state.meta.isBlurred && */}
                    {field.state.meta.errors.map((e, index) => (
                      <p key={index} className="text-red-600">
                        {e}
                      </p>
                    ))}
                </div>
              )}
            />
            <form.AppField
              name="locationId"
              validators={{
                onChange: ({ value }) =>
                  value.length === 0
                    ? t('internal.validations.required')
                    : undefined,
              }}
              children={(field) => (
                <div className="flex-1/2">
                  <Label
                    htmlFor={field.name}
                    className="font-semibold text-md pb-2"
                  >
                    {t('donations.location')}
                  </Label>
                  <field.Select
                    onValueChange={field.handleChange}
                    disabled={postDonationMutation.isPending}
                  >
                    <field.SelectTrigger
                      className="w-full"
                      value={field.state.value}
                    >
                      <field.SelectValue />
                    </field.SelectTrigger>
                    <field.SelectContent onBlur={field.handleBlur}>
                      {locations.map((loc) => (
                        <field.SelectItem value={loc.value} key={loc.value}>
                          {loc.text}
                        </field.SelectItem>
                      ))}
                    </field.SelectContent>
                  </field.Select>
                  {/* {field.state.meta.isBlurred && */}
                    {field.state.meta.errors.map((e, index) => (
                      <p key={index} className="text-red-600">
                        {e}
                      </p>
                    ))}
                  <Button onClick={() => setSheetOpen(true)} variant="link">
                    {t('addDonation.addLocation')}
                  </Button>
                </div>
              )}
            />
          </div>
          <form.AppField
            name="attachements"
            validators={{
              onSubmit: ({ value }) =>
                (value?.length ?? 0) === 0
                  ? t('internal.validations.required')
                  : undefined,
              // onChange: ({ value }) =>
              //   (value?.length ?? 0) === 0
              //     ? t('internal.validations.required')
              //     : undefined,
            }}
            children={(field) => {
              const length = field.state.value?.length ?? 0;
              return (
                <div>
                  <Label
                    htmlFor={field.name}
                    className="font-semibold text-md pb-2"
                  >
                    {t('addDonation.attachements')}
                  </Label>
                  <div>
                    <label
                      htmlFor={field.name}
                      onDragEnter={preventDrag}
                      onDragOver={preventDrag}
                      onDragLeave={preventDrag}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        field.handleChange(selectFirst4(e.dataTransfer.files));
                      }}
                    >
                      <div className="border-2 w-full h-50 rounded-2xl shadow-xs cursor-pointer">
                        <div className="flex w-full justify-center items-center h-full flex-col focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                          <UploadCloud size={25} />
                          <p>{t('internal.fields.attachement1')}</p>
                          <p className="text-sm text-gray-400 ">
                            {t('internal.fields.attachement2')}
                          </p>
                          {length !== 0 && (
                            <div className="flex flex-row gap-2 items-center">
                              <p>
                                {length === 1 ? '1 file' : `${length} files`}
                              </p>
                              <Button
                                className="z-10"
                                onClick={(e) => {
                                  e.preventDefault();
                                  field.setValue(null);
                                }}
                                size="icon"
                              >
                                <X />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                    <Input
                      id={field.name}
                      hidden
                      type="file"
                      multiple
                      disabled={postDonationMutation.isPending}
                      onBlur={field.handleBlur}
                      accept={'image/png, image/jpg, image/jpeg'}
                      onChange={(e) =>
                        field.handleChange(selectFirst4(e.target.files))
                      }
                    />
                  </div>
                  <div>
                    {field.state.meta.errors &&
                      field.state.meta.errors.map((e, index) => (
                        <p key={index} className="text-red-600 z-10">
                          {e}
                        </p>
                      ))}
                  </div>
                </div>
              );
            }}
          />
          <form.AppForm>
            <form.Button className="w-max self-end" type="submit">
              {t('internal.submit')}
            </form.Button>
          </form.AppForm>
        </form>
      </div>
      <AddLocation setSheetOpen={setSheetOpen} sheetOpen={sheetOpen} />
      <PageConfirmDialog
        open={showPrompt}
        onCancel={cancelNavigation}
        onSubmit={confirmNavigation}
      />
    </>
  );
};
