import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getUserCommentsRequest } from '@/support';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pagination } from './Pagination';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import moment from 'moment';
import { DATE_FORMAT } from '@/utils';
import { Separator } from './ui/separator';

export const UserComments = () => {
  const [pagination, setPagination] = useState({ page: 1, size: 10 });
  const { page, size } = pagination;

  const { lang } = useParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useSearchParams();
  const [openedItems, setOpenedItems] = useState<string[]>(
    searchQuery.get('i')?.split(',') || [],
  );

  const { t } = useTranslation();

  const userCommentsRequestFn = useAuthRequest(getUserCommentsRequest);
  const userCommentsQuery = useSuspenseQuery({
    queryKey: ['userComments'],
    queryFn: () => userCommentsRequestFn({ params: { page, size } }),
  });

  const userCommentsData = userCommentsQuery.data;

  if (userCommentsData.totalItems === 0) {
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
      <Accordion
        type="multiple"
        value={openedItems}
        onValueChange={(i) => {
          setSearchQuery((prev) => {
            if (i.length === 0) {
              prev.delete('i');
            } else {
              prev.set('i', i.join(','));
            }
            return prev;
          });
          setOpenedItems(i);
        }}
      >
        {userCommentsData.items.map((dc) => {
          return (
            <AccordionItem
              key={dc.id}
              value={dc.id}
              className="border-2 px-8 rounded-xl border-b-4 last:border-b-4 mb-5"
            >
              <AccordionTrigger className="cursor-pointer">
                <div>
                  <h3
                    className="font-semibold md:text-xl underline"
                    onClick={() =>
                      navigate(`/${lang || 'en'}/donations/${dc.id}`, {
                        viewTransition: true,
                      })
                    }
                  >
                    {dc.title}
                  </h3>
                  <h3 className="text-muted-foreground">
                    {dc.comments.length} comments
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col">
                {dc.comments.map((c, index) => (
                  <div key={c.id} className="last:border-none">
                    <div className="flex gap-2 items-center">
                      <Avatar>
                        <AvatarImage src={c.userImage} />
                        <AvatarFallback>user image</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{c.full_name}</h3>
                        <h3 className="text-muted-foreground">
                          {moment(c.createdAt).format(DATE_FORMAT)}
                        </h3>
                      </div>
                    </div>
                    <p className="pt-2 pl-1">{c.text}</p>

                    <div className="my-5">
                      {index !== dc.comments.length - 1 && <Separator />}
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      <Pagination
        className="mb-5"
        hasNext={userCommentsData.hasNext}
        hasPrev={userCommentsData.hasPrev}
        page={userCommentsData.page}
        totalPages={userCommentsData.totalPages}
        update={(page) => setPagination((prev) => ({ ...prev, page }))}
      />
    </div>
  );
};
