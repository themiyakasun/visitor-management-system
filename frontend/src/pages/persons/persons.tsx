import BulkUploadPerson from '@/components/forms/bulk-upload-person';
import PersonAddForm from '@/components/forms/create-person';
import Loader from '@/components/loader';
import PersonTable from '@/components/tables/person-table';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PersonPayload } from '@/index';
import { usePersonStore } from '@/stores/personStore';
import { Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

const personTypes = ['all', 'employee', 'driver', 'helper', 'visitor'];

const Persons = () => {
  const { persons, getAllPersons, pagination, isLoading, createPerson } =
    usePersonStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [type, setType] = useState('all');

  const handleAdd = async (values: PersonPayload) => {
    await createPerson(values);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllPersons({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        type,
      });
    };
    fetchData();
  }, [currentPage, itemsPerPage, searchQuery, getAllPersons, type]);
  return (
    <>
      {isLoading && <Loader />}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-semibold'>Persons</h1>
          <p className='text-sm text-muted-foreground'>
            Manage organizational persons
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Add Person</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[700px] max-h-[800px] overflow-scroll'>
              <DialogHeader>
                <DialogTitle>Add Person</DialogTitle>
              </DialogHeader>
              <PersonAddForm handleSubmit={handleAdd} />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Upload /> Upload
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[700px] max-h-[800px] overflow-scroll'>
              <DialogHeader>
                <DialogTitle>Bulk Upload</DialogTitle>
              </DialogHeader>
              <BulkUploadPerson />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className='mb-4'>
        <Card>
          <CardContent>
            <div className='flex items-center gap-4 w-1/2'>
              <Select
                onValueChange={(value: string) => setType(value)}
                value={type}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select Types' />
                </SelectTrigger>
                <SelectContent>
                  {personTypes.map((type, index) => (
                    <SelectItem value={type} key={index}>
                      <span className='capitalize'>{type}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder='Search persons...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <PersonTable
        data={persons}
        total={pagination.total}
        page={pagination.page}
        pageSize={pagination.limit}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default Persons;
