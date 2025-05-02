import { useTranslation } from 'react-i18next';
import { Page } from './Page';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getUnlistedDonations } from '@/support';
import React from 'react';
import { Table } from '../Table';
import { createColumnHelper } from '@tanstack/react-table';
import { PaginatedDonationDto } from '@donohub/shared';
import { Pagination } from '../Pagination';
import { Button } from '../ui/button';
import { useNavigate, useParams } from 'react-router-dom';

type TableDonation = Pick<
  PaginatedDonationDto['items'][0],
  'id' | 'title' | 'description' | 'category' | 'quantity' | 'status'
> & {
  location: string;
  action: undefined;
};
const columnHelper = createColumnHelper<TableDonation>();

const UnlistedDonations = () => {
  const [pagination, setPagination] = React.useState({ page: 1, size: 1 });

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

  const columns = React.useCallback(
    () => [
      columnHelper.accessor('id', {
        enableHiding: true,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('title', {
        header: 'Title',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('location', {
        header: 'Location',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('quantity', {
        header: 'Qunatity',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('status', {
        header: 'State',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: (info) => {
          return (
            <div className="flex flwx-row gap-2">
              <Button variant="ghost" className="hover:bg-green-200">
                Approve
              </Button>
              <Button variant="ghost" className="hover:bg-red-200">
                Deny
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
                See details
              </Button>
            </div>
          );
        },
      }),
    ],
    [lang, navigate],
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
            location: `${d.location.county} ${d.location.city} ${d.location.street} ${d.location.number} ${d.location.number}`,
            status: d.status,
            quantity: d.quantity,
            action: undefined,
          }) as TableDonation,
      ),
    [unlistedDonationsQuery],
  );

  return (
    <div>
      <Table columns={columns()} data={unlistedDonationsTable()} />
      <div>
        <Pagination
          hasNext={unlistedDonationsData.hasNext}
          hasPrev={unlistedDonationsData.hasPrev}
          page={unlistedDonationsData.page}
          totalPages={unlistedDonationsData.totalPages}
          update={(page) => setPagination((prev) => ({ ...prev, page }))}
        />
      </div>
    </div>
  );
};

export const EvaluateDonations = () => {
  const { t } = useTranslation();

  return (
    <Page
      className={'select-none mx-[5%]'}
      staticFirst={
        <div className="">
          <h1 className="font-bold text-4xl py-5">
            {t('internal.evaluation.donation.title')}
          </h1>
        </div>
      }
      dynamicComponent={<UnlistedDonations />}
    />
  );
};
