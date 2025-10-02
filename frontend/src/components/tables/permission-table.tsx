import type { Permission, PermissionPayload } from '@/index';
import React from 'react';
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
import { usePermissionStore } from '@/stores/permissionStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import PermissionForm from '../forms/permission-form';

const PermissionTable = ({ data }: { data: Permission[] }) => {
  const { deletePermission, updatePermission } = usePermissionStore();

  const handleDelete = async (id: number) => {
    const isConfirmed = confirm('Sure want to delete this department');
    if (isConfirmed) await deletePermission(id);
  };

  const handleUpdate = async (values: PermissionPayload) => {
    await updatePermission({ id: values.id!, payload: values });
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permission List</CardTitle>
        </CardHeader>
        <CardContent>No permissions found.</CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permission List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell>{permission.resource}</TableCell>
                <TableCell>{permission.action}</TableCell>
                <TableCell>
                  <div className='flex gap-2 items-center'>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size='sm'>Edit</Button>
                      </DialogTrigger>
                      <DialogContent className='sm:max-w-[700px] max-h-[800px] overflow-scroll'>
                        <DialogHeader>
                          <DialogTitle>Edit Permission</DialogTitle>
                        </DialogHeader>
                        <PermissionForm
                          handleSubmit={handleUpdate}
                          initialData={permission}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleDelete(permission.id!)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PermissionTable;
