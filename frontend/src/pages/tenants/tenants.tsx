import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTenantStore } from '@/stores/tenantStore';
import { useEffect, useState } from 'react';
import Loader from '@/components/loader';
import TenantForm from '@/components/forms/tenant-form';
import TenantTable from '@/components/tables/tenant-table';
import type { TenantPayload } from '@/index';

const Tenants = () => {
  const { getAllTenants, createTenant, isLoading, pagination, tenants } =
    useTenantStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      await getAllTenants({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
      });
    };
    fetchData();
  }, [currentPage, itemsPerPage, searchQuery, getAllTenants]);

  const handleAdd = async (values: TenantPayload) => {
    await createTenant(values);
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-semibold'>Tenants</h1>
          <p className='text-sm text-muted-foreground'>
            Manage registered tenants and their details
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Add Tenant</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[700px]'>
              <DialogHeader>
                <DialogTitle>Add Tenant</DialogTitle>
              </DialogHeader>
              <TenantForm handleSubmit={handleAdd} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className='mb-4'>
        <Card>
          <CardContent>
            <div className='flex items-center gap-4 w-1/4'>
              <Input
                placeholder='Search tenants...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <TenantTable
        data={tenants}
        total={pagination.total}
        page={pagination.page}
        pageSize={pagination.limit}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default Tenants;
