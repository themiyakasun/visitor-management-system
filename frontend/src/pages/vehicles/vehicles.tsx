import VehicleForm from '@/components/forms/vehicle-form';
import Loader from '@/components/loader';
import VehicleTable from '@/components/tables/vehicle-table';
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
import type { VehiclePayload } from '@/index';
import { useVehicleStore } from '@/stores/vehicleStore';
import { useEffect, useState } from 'react';

const Vehicles = () => {
  const { vehicles, getAllVehicles, pagination, isLoading, createVehicle } =
    useVehicleStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAdd = async (values: VehiclePayload) => {
    await createVehicle(values);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllVehicles({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
      });
    };
    fetchData();
  }, [searchQuery, itemsPerPage, currentPage, getAllVehicles]);
  return (
    <>
      {isLoading && <Loader />}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-semibold'>Vehicles</h1>
          <p className='text-sm text-muted-foreground'>
            Manage organizational vehicles
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Add Vehicle</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[700px] max-h-[800px] overflow-scroll'>
              <DialogHeader>
                <DialogTitle>Add Vehicle</DialogTitle>
              </DialogHeader>
              <VehicleForm handleSubmit={handleAdd} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className='mb-4'>
        <Card>
          <CardContent>
            <div className='flex items-center gap-4 w-1/2'>
              <Input
                placeholder='Search vehicles...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <VehicleTable
        data={vehicles}
        total={pagination.total}
        page={pagination.page}
        pageSize={pagination.limit}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default Vehicles;
