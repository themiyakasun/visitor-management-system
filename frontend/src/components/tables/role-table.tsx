import { usePermissionStore } from '@/stores/permissionStore';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import type { Role } from '@/index';
import { useRoleStore } from '@/stores/roleStore';

const RoleTable = ({ data }: { data: Role[] }) => {
  const { deleteRole } = useRoleStore();
  const { removeRolePermissions } = usePermissionStore();

  const handleDelete = async (id: string) => {
    await deleteRole(id);
  };

  const removePermission = async ({
    roleId,
    permissionId,
  }: {
    roleId: string;
    permissionId: number;
  }) => {
    const isConfirmed = confirm('Sure want to remove this permission');
    if (isConfirmed) await removeRolePermissions({ roleId, permissionId });
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Role List</CardTitle>
        </CardHeader>
        <CardContent>No roles found.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell className='flex gap-2 flex-wrap'>
                  {role.permissions.length > 0 ? (
                    role.permissions.map((permission) => (
                      <Badge
                        key={permission.id}
                        onClick={async () =>
                          await removePermission({
                            roleId: role.id,
                            permissionId: Number(permission.id),
                          })
                        }
                      >
                        {permission.resource} : {permission.action} X
                      </Badge>
                    ))
                  ) : (
                    <span>No permissions</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className='flex gap-2 items-center'>
                    <Button size='sm'>Edit</Button>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleDelete(role.id)}
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

export default RoleTable;
