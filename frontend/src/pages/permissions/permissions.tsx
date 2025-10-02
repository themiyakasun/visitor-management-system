import AssignRolePermissionsForm from '@/components/forms/assign-role-permissions-form';
import AssignUserPermissionsForm from '@/components/forms/assign-user-permissions-form';
import PermissionForm from '@/components/forms/permission-form';
import Loader from '@/components/loader';
import PermissionTable from '@/components/tables/permission-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { PermissionPayload } from '@/index';
import { usePermissionStore } from '@/stores/permissionStore';
import { useEffect } from 'react';

const Permissions = () => {
  const { getAllPermissions, permissions, isLoading, createPermission } =
    usePermissionStore();

  const handleAdd = async (values: PermissionPayload) => {
    await createPermission(values);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllPermissions();
    };
    fetchData();
  }, [getAllPermissions]);

  return (
    <>
      {isLoading && <Loader />}
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
              <PermissionForm handleSubmit={handleAdd} />
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
