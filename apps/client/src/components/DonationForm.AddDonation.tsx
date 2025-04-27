import { useAuthRequest } from '@/hooks/useAuthRequest';
import {
  getCategories,
  getLocations,
  postDonations,
  postLocation,
} from '@/support';
import { useAppForm } from '@/support/form';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { CategoryDto, PostLocationDto } from '@donohub/shared';
import { Button } from './ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import React from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';

export const AddDonationForm = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const queryClient = useQueryClient();
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
    text: t(`categories.${ctg.name}`),
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
            children={(field) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="font-semibold text-xl pb-2"
                >
                  {t('addDonation.title')}
                </Label>
                <field.Input
                  id={field.name}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />

          <form.AppField
            name="description"
            children={(field) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="font-semibold text-xl pb-2"
                >
                  {t('addDonation.description')}
                </Label>
                <field.Input
                  id={field.name}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />
          <form.AppField
            name="quantity"
            children={(field) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="font-semibold text-xl pb-2"
                >
                  {t('addDonation.quantity')}
                </Label>
                <field.Input
                  id={field.name}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />

          <form.AppField
            name="phone"
            children={(field) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="font-semibold text-xl pb-2"
                >
                  {t('addDonation.phone')}
                </Label>
                <field.Input
                  id={field.name}
                  type="number"
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />

          <div className="flex gap-10 w-full">
            <form.AppField
              name="categoryId"
              children={(field) => (
                <div className="flex-1/2">
                  <Label
                    htmlFor={field.name}
                    className="font-semibold text-xl pb-2"
                  >
                    {t('donations.category')}
                  </Label>
                  <field.Select onValueChange={field.handleChange}>
                    <field.SelectTrigger className="w-full">
                      <field.SelectValue />
                    </field.SelectTrigger>
                    <field.SelectContent>
                      {categories.map((ctg) => (
                        <field.SelectItem value={ctg.value} key={ctg.value}>
                          {ctg.text}
                        </field.SelectItem>
                      ))}
                    </field.SelectContent>
                  </field.Select>
                </div>
              )}
            />
            <form.AppField
              name="locationId"
              children={(field) => (
                <div className="flex-1/2">
                  <Label
                    htmlFor={field.name}
                    className="font-semibold text-xl pb-2"
                  >
                    {t('donations.location')}
                  </Label>
                  <field.Select onValueChange={field.handleChange}>
                    <field.SelectTrigger className="w-full">
                      <field.SelectValue />
                    </field.SelectTrigger>
                    <field.SelectContent>
                      {locations.map((loc) => (
                        <field.SelectItem value={loc.value} key={loc.value}>
                          {loc.text}
                        </field.SelectItem>
                      ))}
                    </field.SelectContent>
                  </field.Select>
                  <Button onClick={() => setSheetOpen(true)} variant="link">
                    {t('addDonation.addLocation')}
                  </Button>
                </div>
              )}
            />
          </div>
          <form.AppField
            name="attachements"
            children={(field) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="font-semibold text-xl pb-2"
                >
                  {t('addDonation.attachements')}
                </Label>
                <Input
                  className="h-full"
                  id={field.name}
                  type="file"
                  multiple
                  accept={'image/png, image/jpg, image/jpeg'}
                  onChange={(e) => field.handleChange(e.target.files)}
                />
              </div>
            )}
          />
          <form.AppForm>
            <form.Button className="w-max self-end" type="submit">
              {t('internal.submit')}
            </form.Button>
          </form.AppForm>
        </form>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t('location.title')}</SheetTitle>
          </SheetHeader>
          <div className="h-full">
            <form
              className="flex flex-col flex-1 h-full py-5 px-3"
              onSubmit={(e) => {
                e.preventDefault();
                locationForm.handleSubmit();
              }}
            >
              <locationForm.AppField
                name="county"
                children={(field) => (
                  <div>
                    <Label htmlFor={field.name} className="font-semibold pb-2">
                      {t('location.county')}
                    </Label>
                    <Input
                      id={field.name}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              />
              <locationForm.AppField
                name="city"
                children={(field) => (
                  <div>
                    <Label htmlFor={field.name} className="font-semibold pb-2">
                      {t('location.city')}
                    </Label>
                    <Input
                      id={field.name}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
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
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              />

              <form.AppForm>
                <SheetFooter className="flex flex-row justify-end mt-auto">
                  <SheetClose asChild>
                    <Button variant="secondary">{t('internal.close')}</Button>
                  </SheetClose>
                  <Button type="submit">{t('internal.submit')}</Button>
                </SheetFooter>
              </form.AppForm>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
