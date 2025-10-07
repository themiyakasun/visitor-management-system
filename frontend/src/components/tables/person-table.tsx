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
import type { Person, PersonPayload } from '@/index';
import { usePersonStore } from '@/stores/personStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import PersonUpdateForm from '../forms/update-person';

const PersonTable = ({
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
  data: Person[];
}) => {
  const { deletePerson, updatePerson } = usePersonStore();
  const totalPages = Math.ceil(total / pageSize);

  const handleDelete = async (id: string) => {
    const isConfirmed = confirm('Sure want to delete this visitor');
    if (isConfirmed) deletePerson(id);
  };

  const handleUpdate = async (values: PersonPayload) => {
    console.log(values);
    await updatePerson({ id: values.id!, payload: values });
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Persons List</CardTitle>
        </CardHeader>
        <CardContent>No departments found.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Persons List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>NIC</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((person) => (
              <TableRow key={person.id}>
                <TableCell>{person.name}</TableCell>
                <TableCell>{person.nic}</TableCell>
                <TableCell>{person.type}</TableCell>
                <TableCell>
                  <div className='flex gap-2 items-center'>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size='sm'>Edit</Button>
                      </DialogTrigger>
                      <DialogContent className='sm:max-w-[700px] max-h-[800px] overflow-scroll'>
                        <DialogHeader>
                          <DialogTitle>Edit Department</DialogTitle>
                        </DialogHeader>
                        <PersonUpdateForm
                          handleSubmit={handleUpdate}
                          person={{
                            ...person,
                            email:
                              person.email === null ? undefined : person.email,
                            phone:
                              person.phone === null ? undefined : person.phone,
                            address:
                              person.address === null
                                ? undefined
                                : person.address,
                            companyName:
                              person.companyName === null
                                ? undefined
                                : person.companyName,
                            type: person.type ?? 'employee',
                            nic: person.nic ?? '',
                            purpose:
                              person.purpose === null
                                ? undefined
                                : person.purpose,
                            passType:
                              person.passType === null
                                ? undefined
                                : String(person.passType),
                            passExpiryDate:
                              person.passExpiryDate === null
                                ? undefined
                                : person.passExpiryDate instanceof Date
                                ? person.passExpiryDate.toISOString()
                                : person.passExpiryDate,
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleDelete(person.id)}
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

export default PersonTable;
