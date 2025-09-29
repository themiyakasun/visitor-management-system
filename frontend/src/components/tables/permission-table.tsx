import type { Permission } from '@/index';
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

const PermissionTable = ({ data }: { data: Permission[] }) => {
  const { deletePermission } = usePermissionStore();

  const handleDelete = async (id: number) => {
    const isConfirmed = confirm('Sure want to delete this department');
    if (isConfirmed) await deletePermission(id);
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
                    <Button size='sm'>Edit</Button>
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
