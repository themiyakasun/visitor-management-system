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
import type { InOutGate } from '@/index';

const GateInOutTable = ({
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
  data: InOutGate[];
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
                <TableHead>Person</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>In Time</TableHead>
                <TableHead>Out Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{log.person}</TableCell>
                  <TableCell>{log.vehicle}</TableCell>
                  <TableCell>{new Date(log.inTime).toLocaleString()}</TableCell>
                  <TableCell>
                    {log.outTime !== null ? (
                      new Date(log.outTime!).toLocaleString()
                    ) : (
                      <>-</>
                    )}
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

export default GateInOutTable;
