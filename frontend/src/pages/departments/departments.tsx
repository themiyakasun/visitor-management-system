import { ArrowDownToLine } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import DepartmentAddForm from '@/components/forms/department-add-form';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import DepartmentTable from '@/components/tables/department-table';
import { useDepartmentStore } from '@/stores/departmentStore';
import { useEffect, useState } from 'react';
import type { DepartmentPayload } from '@/index';

const Departments = () => {
  const { getAllDepartments, pagination, departments, createDepartment } =
    useDepartmentStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      await getAllDepartments({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
      });
    };

    fetchData();
  }, [currentPage, itemsPerPage, searchQuery, getAllDepartments]);

  const handleAdd = async (values: DepartmentPayload) => {
    await createDepartment(values);
  };
  return (
    <>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-semibold'>Departments</h1>
          <p className='text-sm text-muted-foreground'>
            Manage organizational departments
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Add Department</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[700px]'>
              <DialogHeader>
                <DialogTitle>Add Department</DialogTitle>
              </DialogHeader>
              <DepartmentAddForm handleSubmit={handleAdd} />
            </DialogContent>
          </Dialog>

          <Button>
            <ArrowDownToLine />
            Export
          </Button>
        </div>
      </div>

      <div className='mb-4'>
        <Card>
          <CardContent>
            <div className='flex items-center gap-4 w-1/4'>
              <Input
                placeholder='Search departments...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <DepartmentTable
        data={departments}
        total={pagination.total}
        page={pagination.page}
        pageSize={pagination.limit}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default Departments;
