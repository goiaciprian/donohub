import {
  TableBody,
  Table as STable,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from './ui/table';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface BaseData {
  id: string;
}

interface TableProps<D> {
  columns: ColumnDef<D, any>[];
  data: D[];
}

export const Table = <Data extends BaseData>({
  columns,
  data,
}: TableProps<Data>) => {
  const table = useReactTable({
    state: {
      columnVisibility: {
        id: false,
      },
    },
    data,
    columns,
    getCoreRowModel: getCoreRowModel<Data>(),
  });

  return (
    <STable>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </STable>
  );
};
