import AssignRolePermissionsForm from '@/components/forms/assign-role-permissions-form';
import AssignUserPermissionsForm from '@/components/forms/assign-user-permissions-form';
import PermissionAddForm from '@/components/forms/permission-add-form';
import PermissionTable from '@/components/tables/permission-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePermissionStore } from '@/stores/permissionStore';
import { useEffect } from 'react';

const Permissions = () => {
  const { getAllPermissions, permissions } = usePermissionStore();

  useEffect(() => {
    const fetchData = async () => {
      await getAllPermissions();
    };
    fetchData();
  }, [getAllPermissions]);

  return (
    <>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-semibold'>Permissions</h1>
          <p className='text-sm text-muted-foreground'>
            Manage organizational Permissions
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Add Permissions</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[700px]'>
              <DialogHeader>
                <DialogTitle>Add Permissions</DialogTitle>
              </DialogHeader>
              <PermissionAddForm />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Assign User Permissions</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[700px]'>
              <DialogHeader>
                <DialogTitle>Assign Permissions</DialogTitle>
              </DialogHeader>
              <AssignUserPermissionsForm />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Assign Role Permissions</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[700px]'>
              <DialogHeader>
                <DialogTitle>Assign Permissions</DialogTitle>
              </DialogHeader>
              <AssignRolePermissionsForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <PermissionTable data={permissions} />
    </>
  );
};

export default Permissions;
