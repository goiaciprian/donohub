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
        {hasPrev && (
          <PaginationItem
            onClick={() => update(page - 1)}
            className={`cursor-pointer`}
          >
            <PaginationPrevious />
          </PaginationItem>
        )}
        {page !== 1 && (
          <PaginationItem
            onClick={() => update(1)}
            className={`cursor-pointer`}
          >
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink isActive>{page}</PaginationLink>
        </PaginationItem>
        {page !== totalPages && totalPages !== 0 && (
          <PaginationItem
            className={`cursor-pointer`}
            onClick={() => update(totalPages)}
          >
            <PaginationLink>{totalPages}</PaginationLink>
          </PaginationItem>
        )}
        {hasNext && (
          <PaginationItem
            onClick={() => update(page + 1)}
            className={`cursor-pointer`}
          >
            <PaginationNext />
          </PaginationItem>
        )}
      </PaginationContent>
    </SPagination>
  );
};
