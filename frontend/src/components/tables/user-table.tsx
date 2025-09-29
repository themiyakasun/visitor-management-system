import type { User } from '@/index';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useUserStore } from '@/stores/userStore';
import { Badge } from '../ui/badge';
import { usePermissionStore } from '@/stores/permissionStore';

const UserTable = ({
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
  data: User[];
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const { deleteUser } = useUserStore();
  const { removeUserPermissions } = usePermissionStore();

  const handleDelete = async (id: string) => {
    await deleteUser(id);
  };

  const removePermission = async ({
    userId,
    permissionId,
  }: {
    userId: string;
    permissionId: number;
  }) => {
    const isConfirmed = confirm('Sure want to remove this permission');
    if (isConfirmed) await removeUserPermissions({ userId, permissionId });
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>No users found.</CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <Badge key={role.id} className='mr-2'>
                        {role.name}
                      </Badge>
                    ))
                  ) : (
                    <span>No roles assign</span>
                  )}
                </TableCell>
                <TableCell className='flex gap-2 flex-wrap'>
                  {user.permissions.length > 0 ? (
                    user.permissions.map((permission) => (
                      <Badge
                        key={permission.id}
                        onClick={async () =>
                          await removePermission({
                            userId: user.id,
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
                      onClick={() => handleDelete(user.id)}
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

export default UserTable;
