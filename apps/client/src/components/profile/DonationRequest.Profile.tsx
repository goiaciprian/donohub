import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getDonationRequests, resolveDonationRequest } from '@/support';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import moment from 'moment';
import { DATE_FORMAT } from '@/utils';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { DonationEvaluationType } from '@donohub/shared';
import { PageConfirmDialog } from '../dialogs/PageConfirmDialog';
import { displayEnum } from '@/lib/utils';

export const DonationRequests = () => {
  const navigate = useNavigate();
  const { lang } = useParams();

  const queryClient = useQueryClient();

  const [{ size, page }, setPagination] = useState({ page: 1, size: 20 });
  const { t } = useTranslation();

  const [selectedItem, setSelectedItem] = useState<{
    id: string | null;
    state: DonationEvaluationType | null;
  }>({ id: null, state: null });

  const getDonationUserRequestsFn = useAuthRequest(getDonationRequests);
  const getDonationUserRequestsQuery = useSuspenseQuery({
    queryKey: ['dontionsUserRequests'],
    queryFn: () => getDonationUserRequestsFn({ params: { page, size } }),
  });

  const resolveDonationRequestFn = useAuthRequest(resolveDonationRequest);
  const resolveDonationRequestMutation = useMutation({
    mutationKey: ['resolveDonation'],
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: DonationEvaluationType;
    }) =>
      resolveDonationRequestFn({
        pathParams: [
          { key: ':requestId', value: id },
          { key: ':status', value: status },
        ],
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dontionsUserRequests'] })
  });

  const donationsRequests = getDonationUserRequestsQuery.data;

  if (donationsRequests.totalItems === 0) {
    return (
      <div className="w-full">
        <h2 className="text-center pt-20 font-bold md:text-xl">
          {t('internal.notFoundAnything')}
        </h2>
      </div>
    );
  }

  return (
    <div>
      <Accordion type="multiple" className="flex flex-col gap-3 pb-10">
        {donationsRequests.items.map((r) => {
          return (
            <AccordionItem
              value={r.id}
              key={r.id}
              className="border-2 px-8 rounded-xl border-b-4 last:border-b-4"
            >
              <AccordionTrigger className="cursor-pointer">
                <div>
                  <h3
                    className="font-bold md:text-xl underline"
                    onClick={() =>
                      navigate(`/${lang}/donations/${r.id}`, {
                        viewTransition: true,
                      })
                    }
                  >
                    {r.title}
                  </h3>
                  <h3 className="text-muted-foreground">
                    {r.requests.length} requests
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  {r.requests.map((dr) => {
                    return (
                      <div key={dr.id}>
                        <div className="flex flex-row gap-2 items-center">
                          <Avatar>
                            <AvatarFallback>user image</AvatarFallback>
                            <AvatarImage src={dr.userImage} />
                          </Avatar>
                          <div>
                            <h4 className="font-bold">
                              {dr.userName} ({displayEnum(dr.status)})
                            </h4>
                            <h4 className="font-bold text-muted-foreground text-sm">
                              {moment(dr.createdAt).format(DATE_FORMAT)}
                            </h4>
                          </div>
                          {(dr.status as string) === 'IN_PROGRESS' && (
                            <div className="flex flex-row gap-2 ml-auto">
                              <Button
                                variant="ghost"
                                className="cursor-pointer hover:bg-red-200"
                                onClick={() =>
                                  setSelectedItem({
                                    id: dr.id,
                                    state: 'DECLINED',
                                  })
                                }
                              >
                                Decline
                              </Button>
                              <Button
                                variant="ghost"
                                className="cursor-pointer hover:bg-green-200"
                                onClick={() =>
                                  setSelectedItem({
                                    id: dr.id,
                                    state: 'ACCEPTED',
                                  })
                                }
                              >
                                Accept
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="pt-3">
                          {dr.comment || 'No comment left'}
                        </p>
                        <Separator className="my-3 last:hidden" />
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      <PageConfirmDialog
        title={t('dialogRequest.title')}
        description={t('dialogRequest.confirm')}
        onCancel={() => setSelectedItem({ id: null, state: null })}
        open={!!(selectedItem.id && selectedItem.state)}
        onSubmit={() => {
          if(selectedItem.id && selectedItem.state) {
            resolveDonationRequestMutation.mutate({
              id: selectedItem.id,
              status: selectedItem.state
            })

          }
          setSelectedItem({ id: null, state: null });
        }}
      />
    </div>
  );
};
