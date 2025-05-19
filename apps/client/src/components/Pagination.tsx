import { PaginationBaseDto } from '@donohub/shared';
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as SPagination,
} from './ui/pagination';
import { HTMLProps } from 'react';
import { cn } from '@/lib/utils';

interface PaginationProps
  extends Omit<PaginationBaseDto, 'size' | 'totalItems'> {
  update: (page: number) => void;
  className?: HTMLProps<HTMLElement>['className'];
}

export const Pagination = ({
  hasNext,
  hasPrev,
  page,
  totalPages,
  update,
  className,
}: PaginationProps) => {
  return (
    <SPagination className="select-none">
      <PaginationContent className={cn('gap-2', className)}>
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
          className={`cursor-pointer ${page !== totalPages && totalPages !== 0 ? '' : 'opacity-0'}`}
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
