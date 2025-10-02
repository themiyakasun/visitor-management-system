import GateActionForm from '@/components/forms/gate-action-form';
import Loader from '@/components/loader';
import GateLogTable from '@/components/tables/gate-log-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useGateStore } from '@/stores/gateStore';
import { useEffect, useState } from 'react';

const GateLogs = () => {
  const { getAllActivity, pagination, gatelogs, isLoading } = useGateStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      await getAllActivity({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
      });
    };
    fetchData();
  }, [currentPage, itemsPerPage, searchQuery, getAllActivity]);

  return (
    <>
      {isLoading && <Loader />}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-semibold'>Gatelogs</h1>
          <p className='text-sm text-muted-foreground'>
            Manage organizational gatelogs
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Add Gatelog</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[700px]'>
              <DialogHeader>
                <DialogTitle>Add Gatelog</DialogTitle>
              </DialogHeader>
              <GateActionForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className='mb-4'>
        <Card>
          <CardContent>
            <div className='flex items-center gap-4 w-1/4'>
              <Input
                placeholder='Search activity...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <GateLogTable
        data={gatelogs}
        total={pagination.total}
        page={pagination.page}
        pageSize={pagination.limit}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default GateLogs;
