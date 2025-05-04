import { EvaluationDialog } from "@/components/dialogs/EvaluationDialog";
import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuthRequest } from "@/hooks/useAuthRequest";
import { LocaleCategoriesHeleper } from "@/lib/utils";
import { getUnlistedDonations, evaluateDonation } from "@/support";
import { PaginatedDonationDto, DonationEvaluationType, PutDonationEvaluationDto } from "@donohub/shared";
import { useQueryClient, useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

type TableDonation = Pick<
  PaginatedDonationDto['items'][0],
  'id' | 'title' | 'description' | 'category' | 'quantity' | 'status'
> & {
  location: string;
  action: undefined;
};
const columnHelper = createColumnHelper<TableDonation>();

export const UnlistedDonations = () => {
  const { t } = useTranslation(['translation', 'categories']);
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const [pagination, setPagination] = React.useState({ page: 1, size: 15 });

  const navigate = useNavigate();
  const { lang } = useParams();

  const getUnlistedDonationsFn = useAuthRequest(getUnlistedDonations);
  const unlistedDonationsQuery = useSuspenseQuery({
    queryKey: ['evaluateDonations', pagination],
    queryFn: () =>
      getUnlistedDonationsFn({
        params: { page: pagination.page, size: pagination.size },
      }),
  });

  const evaluateDonationFn = useAuthRequest(evaluateDonation);
  const evaluateDonationMutation = useMutation({
    mutationKey: ['evaluateDonation'],
    mutationFn: ({
      id,
      status,
      body,
    }: {
      id: string;
      status: DonationEvaluationType;
      body: PutDonationEvaluationDto;
    }) =>
      evaluateDonationFn({
        pathParams: [
          { key: ':id', value: id },
          { key: ':status', value: status },
        ],
        body,
      }),
    onError: () => toast.error(t('internal.error')),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluateDonations'] });
      toast.success(t('internal.success'));
    },
  });

  const columns = React.useCallback(
    () => [
      columnHelper.accessor('id', {
        enableHiding: true,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('title', {
        header: t('addDonation.title'),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('description', {
        header: t('addDonation.description'),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('location', {
        header: t('addDonation.location'),
        cell: (info) => {
          return (
            <Tooltip>
              <TooltipTrigger>{info.getValue()}</TooltipTrigger>
              <TooltipContent>
                {t('location.county')}, {t('location.city')},{' '}
                {t('location.street')}, {t('location.number')},{' '}
                {t('location.postalCode')}
              </TooltipContent>
            </Tooltip>
          );
        },
      }),
      columnHelper.accessor('category', {
        header: t('addDonation.category'),
        cell: (info) => {
          const key =
            `categories:${info.getValue()}` as LocaleCategoriesHeleper;
          return t(key);
        },
      }),
      columnHelper.accessor('quantity', {
        header: t('addDonation.quantity'),
        cell: (info) => info.getValue() || '-',
      }),
      columnHelper.accessor('status', {
        header: t('addDonation.status'),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('action', {
        header: t('internal.action'),
        cell: (info) => {
          return (
            <div className="flex flwx-row gap-2">
              <Button
                variant={'ghost'}
                className="hover:bg-amber-200"
                onClick={() => setSelectedId(info.row.original.id)}
              >
                Evaluate
              </Button>
              <Button
                variant="ghost"
                className="hover:bg-gray-200"
                onClick={() =>
                  navigate(`/${lang}/donations/${info.row.original.id}`, {
                    viewTransition: true,
                  })
                }
              >
                {t('donationCard.details')}
              </Button>
            </div>
          );
        },
      }),
    ],
    [lang, navigate, t],
  );

  const unlistedDonationsData = unlistedDonationsQuery.data;

  const unlistedDonationsTable = React.useCallback(
    () =>
      unlistedDonationsQuery.data.items.map(
        (d) =>
          ({
            id: d.id,
            title: d.title,
            category: d.category,
            description: d.description,
            location: `${d.location.county}, ${d.location.city}, ${d.location.street || '-'}, ${d.location.number || '-'}, ${d.location.number || '-'}`,
            status: d.status,
            quantity: d.quantity,
            action: undefined,
          }) as TableDonation,
      ),
    [unlistedDonationsQuery],
  );

  return (
    <>
      <div className="flex flex-col">
        <div>
          <Table columns={columns()} data={unlistedDonationsTable()} />
        </div>
        <div className="justify-end py-5">
          <Pagination
            hasNext={unlistedDonationsData.hasNext}
            hasPrev={unlistedDonationsData.hasPrev}
            page={unlistedDonationsData.page}
            totalPages={unlistedDonationsData.totalPages}
            update={(page) => setPagination((prev) => ({ ...prev, page }))}
          />
        </div>
      </div>
      <EvaluationDialog
        id={selectedId}
        isLoading={evaluateDonationMutation.isPending}
        title={t('internal.evaluation.donation.title')}
        onClose={() => setSelectedId(null)}
        onResponse={(values) => {
          evaluateDonationMutation.mutate({
            id: values.id,
            status: values.status,
            body: { comment: values.comment },
          });
        }}
      />
    </>
  );
};
