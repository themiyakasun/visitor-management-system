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
import { useTenantStore } from '@/stores/tenantStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import TenantForm from '../forms/tenant-form';
import type { TenantPayload } from '@/index';

const TenantTable = ({
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
  data: TenantPayload[];
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const { deleteTenant, updateTenant } = useTenantStore();

  const handleDelete = async (id: string) => {
    const isConfirmed = confirm('Are you sure you want to delete this tenant?');
    if (isConfirmed) await deleteTenant(id);
  };

  const handleUpdate = async (values: TenantPayload) => {
    await updateTenant({ id: values.id!, payload: values });
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tenants List</CardTitle>
        </CardHeader>
        <CardContent>No tenants found.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell>{tenant.name}</TableCell>
                <TableCell>{tenant.email}</TableCell>
                <TableCell>{tenant.country}</TableCell>
                <TableCell>{tenant.phone}</TableCell>
                <TableCell>
                  <div className='flex gap-2 items-center'>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size='sm'>Edit</Button>
                      </DialogTrigger>
                      <DialogContent className='sm:max-w-[700px]'>
                        <DialogHeader>
                          <DialogTitle>Edit Tenant</DialogTitle>
                        </DialogHeader>
                        <TenantForm
                          handleSubmit={handleUpdate}
                          initialData={tenant}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleDelete(tenant.id!)}
                    >
                      Delete
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

export default TenantTable;
