import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import type { Department } from '@/index';
import { ArrowDownToLine } from 'lucide-react';

const DepartmentTable = ({
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
  data: Department[];
}) => {
  const totalPages = Math.ceil(total / pageSize);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((department) => (
              <TableRow key={department.id}>
                <TableCell>{department.name}</TableCell>
                <TableCell>{department.description}</TableCell>
                <TableCell>
                  <div className='flex gap-2 items-center'>
                    <Button size='sm'>Edit</Button>
                    <Button variant='destructive' size='sm'>
                      Delete
                    </Button>
                    <Button>
                      <ArrowDownToLine />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className='flex justify-end mt-10'>
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
      </CardContent>
    </Card>
  );
};

export default DepartmentTable;
