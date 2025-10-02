import type { Appointment } from '@/index';
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
import { useAppointmentStore } from '@/stores/appointmentStore';

const AppointmentTable = ({
  total,
  page,
  pageSize,
  onPageChange,
  data,
  showActions = true,
}: {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  data: Appointment[];
  showActions?: boolean;
}) => {
  const { updateAppointment } = useAppointmentStore();
  const totalPages = Math.ceil(total / pageSize);

  const handleCancel = async (id: string) => {
    await updateAppointment({ id, payload: { status: 'cancelled' } });
  };

  if (!data || data.length === 0) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Appointments List</CardTitle>
          </CardHeader>
          <CardContent>No appointments found.</CardContent>
        </Card>
      </>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appoinment List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Expected Duration</TableHead>
              <TableHead>Visitor</TableHead>
              <TableHead>Arrival Time</TableHead>
              <TableHead>Departure Time</TableHead>
              <TableHead>Status</TableHead>
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  {new Date(appointment.datetime).toLocaleString()}
                </TableCell>
                <TableCell>{appointment.purpose}</TableCell>
                <TableCell>{appointment.expectedDuration}</TableCell>
                <TableCell>{appointment.visitor.name}</TableCell>
                <TableCell>
                  {appointment.actualArrival === null ? (
                    <span>Still not updated</span>
                  ) : (
                    new Date(appointment.actualArrival).toLocaleString()
                  )}
                </TableCell>
                <TableCell>
                  {appointment.actualDeparture === null ? (
                    <span>Still not updated</span>
                  ) : (
                    new Date(appointment.actualDeparture).toLocaleString()
                  )}
                </TableCell>
                <TableCell>{appointment.status}</TableCell>
                {showActions && (
                  <TableCell>
                    <div className='flex gap-2 items-center'>
                      <Button size='sm'>Edit</Button>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => handleCancel(appointment.id)}
                      >
                        Cancel Appointment
                      </Button>
                    </div>
                  </TableCell>
                )}
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

export default AppointmentTable;
