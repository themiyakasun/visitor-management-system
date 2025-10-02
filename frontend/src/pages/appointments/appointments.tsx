import AppointmentForm from '@/components/forms/appointment-form';
import Loader from '@/components/loader';
import AppointmentTable from '@/components/tables/appointment-table';
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
import type { AppointmentPayload } from '@/index';
import { useAppointmentStore } from '@/stores/appointmentStore';
import { useEffect, useState } from 'react';

const Appointments = () => {
  const {
    appointments,
    getAllAppointments,
    pagination,
    isLoading,
    createAppointment,
  } = useAppointmentStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAdd = async (values: AppointmentPayload) => {
    await createAppointment(values);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllAppointments({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
      });
    };
    fetchData();
  }, [currentPage, itemsPerPage, searchQuery, getAllAppointments]);
  return (
    <>
      {isLoading && <Loader />}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-semibold'>Appointments</h1>
          <p className='text-sm text-muted-foreground'>
            Manage organizational appointments
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Create Appointment</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[700px] max-h-[800px] overflow-scroll'>
              <DialogHeader>
                <DialogTitle>Create Appointment</DialogTitle>
              </DialogHeader>
              <AppointmentForm handleSubmit={handleAdd} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className='mb-4'>
        <Card>
          <CardContent>
            <div className='flex items-center gap-4 w-1/2'>
              <Input
                placeholder='Search appointments...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <AppointmentTable
        data={appointments}
        total={pagination.total}
        page={pagination.page}
        pageSize={pagination.limit}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default Appointments;
