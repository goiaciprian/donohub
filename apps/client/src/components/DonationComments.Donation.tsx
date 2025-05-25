import { useAppForm } from '@/support/form';
import { SignedIn } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { Label } from './ui/label';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getComments, postComment } from '@/support';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CommentDto,
  CommentPaginatedDto,
  CommentPostDto,
} from '@donohub/shared';
import { Spinner } from './spinner/Spinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { CalendarPlus } from 'lucide-react';
import moment from 'moment';
import { DATE_FORMAT } from '@/utils';
import { toast } from 'sonner';
import React from 'react';
import { Pagination } from './Pagination';

export const DonationComments = ({ donationId }: { donationId: string }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [page, setPage] = React.useState(1);

  const getCommentsFn = useAuthRequest(getComments);
  const commentsQuery = useQuery<CommentPaginatedDto>({
    queryKey: ['comments', donationId, page],
    queryFn: () =>
      getCommentsFn({
        pathParams: [{ key: ':donationId', value: donationId }],
        params: {
          page,
          size: 6,
        },
      }),
  });

  const postCommentFn = useAuthRequest(postComment);
  const commentMutation = useMutation<CommentDto, Error, CommentPostDto>({
    mutationKey: ['comment', donationId],
    mutationFn: (body) =>
      postCommentFn({
        pathParams: [{ key: ':donationId', value: donationId }],
        body,
      }),
    onError: () => toast.error(t('internal.error')),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      form.reset();
      toast.success(t('internal.create'));
    },
  });

  const form = useAppForm({
    defaultValues: {
      comment: '',
    },
    onSubmit: ({ value }) => {
      commentMutation.mutate({ message: value.comment });
    },
  });

  const renderForm = () => (
    <SignedIn>
      <div>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppField
            name="comment"
            validators={{
              onChange: (comment) =>
                comment.value.length === 0
                  ? t('internal.validations.comments')
                  : undefined,
            }}
            children={(field) => (
              <>
                <Label htmlFor={field.name}>
                  {t(`donation.${field.name}`)}
                </Label>
                <field.Textarea
                  id={field.name}
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  maxLength={150}
                  disabled={commentMutation.isPending}
                />
                {field.state.meta.isBlurred && (
                  <p className="text-red-600">
                    {field.state.meta.errors.map((e) => e)}
                  </p>
                )}
              </>
            )}
          />
          <form.AppForm>
            <form.Button
              className="w-min"
              type="submit"
              loading={commentMutation.isPending}
            >
              {t('donation.post')}
            </form.Button>
          </form.AppForm>
        </form>
      </div>
    </SignedIn>
  );

  if (commentsQuery.isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (commentsQuery.isError || !commentsQuery.data) {
    return (
      <div>
        {renderForm()}
        <div>Something went wrong</div>
      </div>
    );
  }

  if (commentsQuery.data.totalItems === 0) {
    return (
      <div>
        {renderForm()}
        <h2 className="text-2xl font-semibold">
          {t('internal.notFoundAnything')}
        </h2>
      </div>
    );
  }

  return (
    <div>
      {renderForm()}
      <div>
        {commentsQuery.data.items.map((comment) => {
          const createdAt = moment(comment.createdAt);
          const fromNow = moment().diff(createdAt, 'hours') < 3;
          return (
            <Card className="my-4" key={comment.id}>
              <CardHeader>
                <CardTitle className="flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage src={comment.userImage} />
                    <AvatarFallback>
                      {comment.fullName} profile image
                    </AvatarFallback>
                  </Avatar>

                  <p>{comment.fullName}</p>
                </CardTitle>
                <CardDescription className="flex flex-row items-center gap-1">
                  <CalendarPlus size="18" />
                  <p className={'text-sm'}>
                    {fromNow
                      ? createdAt.fromNow()
                      : createdAt.format(DATE_FORMAT)}
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{comment.text}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="py-12">
        <Pagination
          hasNext={commentsQuery.data.hasNext}
          hasPrev={commentsQuery.data.hasPrev}
          page={commentsQuery.data.page}
          totalPages={commentsQuery.data.totalPages}
          update={setPage}
        />
      </div>
    </div>
  );
};
