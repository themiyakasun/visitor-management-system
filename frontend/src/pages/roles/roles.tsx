import RoleForm from '@/components/forms/role-form';
import Loader from '@/components/loader';
import RoleTable from '@/components/tables/role-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { RolePayload } from '@/index';
import { useRoleStore } from '@/stores/roleStore';
import { useEffect } from 'react';

const Roles = () => {
  const { roles, getAllRoles, createRole, isLoading } = useRoleStore();

  useEffect(() => {
    const fetchData = async () => {
      await getAllRoles();
    };
    fetchData();
  }, [getAllRoles]);

  const handleAdd = async (values: RolePayload) => {
    await createRole(values);
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-semibold'>Roles</h1>
          <p className='text-sm text-muted-foreground'>
            Manage organizational roles
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Add Roles</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[700px]'>
              <DialogHeader>
                <DialogTitle>Add Roles</DialogTitle>
              </DialogHeader>
              <RoleForm handleSubmit={handleAdd} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <RoleTable data={roles} />
    </>
  );
};

export default Roles;
