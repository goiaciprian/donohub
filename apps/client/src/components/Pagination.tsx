import { PaginationBaseDto } from '@donohub/shared';
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as SPagination,
} from './ui/pagination';

interface PaginationProps
  extends Omit<PaginationBaseDto, 'size' | 'totalItems'> {
  update: (page: number) => void;
}

export const Pagination = ({
  hasNext,
  hasPrev,
  page,
  totalPages,
  update,
}: PaginationProps) => {
  return (
    <SPagination className="select-none">
      <PaginationContent className="gap-15">
        <PaginationItem
          onClick={() => update(page - 1)}
          className={`cursor-pointer ${hasPrev ? undefined : 'opacity-0'}`}
        >
          <PaginationPrevious />
        </PaginationItem>
        <PaginationItem
          onClick={() => update(1)}
          className={`cursor-pointer ${page !== 1 ? '' : 'opacity-0'}`}
        >
          <PaginationLink>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive>{page}</PaginationLink>
        </PaginationItem>
        <PaginationItem
          className={`cursor-pointer ${page !== totalPages ? '' : 'opacity-0'}`}
          onClick={() => update(totalPages)}
        >
          <PaginationLink>{totalPages}</PaginationLink>
        </PaginationItem>
        <PaginationItem
          onClick={() => update(page + 1)}
          className={`cursor-pointer ${hasNext ? undefined : 'opacity-0'}`}
        >
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </SPagination>
  );
};
