import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import type { GateLog } from '@/index';

const GateLogTable = ({
  total,
  page,
  pageSize,
  onPageChange,
  data,
}: {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  data: GateLog[];
}) => {
  const totalPages = Math.ceil(total / pageSize);

  if (!data || data.length === 0) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Gate Activity List</CardTitle>
          </CardHeader>
          <CardContent>No gate activity found.</CardContent>
        </Card>
      </>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gate Activity List</CardTitle>
      </CardHeader>
      <CardContent>
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Person</TableHead>
                <TableHead>Person Type</TableHead>
                <TableHead>Vehicle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{log.type}</TableCell>
                  <TableCell>{log.person?.name}</TableCell>
                  <TableCell>{log.person?.type}</TableCell>
                  <TableCell>
                    {log.vehicle ? log.vehicle.numberPlate : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className='flex justify-end mt-6'>
            <Pagination>
              <PaginationContent>
                <PaginationPrevious
                  onClick={() => page > 1 && onPageChange(page - 1)}
                />
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      isActive={page === idx + 1}
                      onClick={() => onPageChange(idx + 1)}
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationNext
                  onClick={() => page < totalPages && onPageChange(page + 1)}
                />
              </PaginationContent>
            </Pagination>
          </div>
        </>
      </CardContent>
    </Card>
  );
};

export default GateLogTable;
