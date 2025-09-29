import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { useEffect, useMemo } from 'react';
import type z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePermissionStore } from '@/stores/permissionStore';
import { useRoleStore } from '@/stores/roleStore';
import { rolePermissionSchema } from '@/lib/validationts';

const AssignRolePermissionsForm = () => {
  const { roles, getAllRoles } = useRoleStore();
  const { permissions, getAllPermissions, assignRolePermissions } =
    usePermissionStore();
  const form = useForm({
    resolver: zodResolver(rolePermissionSchema),
    defaultValues: {
      roleId: '',
      resource: '',
      action: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      await getAllRoles();
    };
    fetchData();
  }, [getAllRoles]);

  useEffect(() => {
    const fetchData = async () => {
      await getAllPermissions();
    };
    fetchData();
  }, [getAllPermissions]);

  const resources = useMemo(() => {
    return [...new Set(permissions.map((p) => p.resource))];
  }, [permissions]);

  const watchedResource = form.watch('resource');

  const actions = useMemo(() => {
    if (!watchedResource) return [];
    return permissions
      .filter((p) => p.resource === watchedResource)
      .map((p) => p.action);
  }, [permissions, watchedResource]);

  const onSubmit = async (values: z.infer<typeof rolePermissionSchema>) => {
    const selected = permissions.find(
      (p) => p.resource === values.resource && p.action === values.action
    );

    if (selected) {
      await assignRolePermissions({
        roleId: values.roleId,
        permissionId: selected.id!,
      });
    }
  };

  return (
    <div className={cn('flex flex-col gap-6')}>
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-6'>
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='roleId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select Roles' />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem value={role.id} key={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='flex gap-5 w-full'>
                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='resource'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resource</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select Resource' />
                              </SelectTrigger>
                              <SelectContent>
                                {resources.map((res) => (
                                  <SelectItem key={res} value={res}>
                                    {res}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='w-full'>
                    <FormField
                      control={form.control}
                      name='action'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Action</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!form.watch('resource')}
                            >
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select Action' />
                              </SelectTrigger>
                              <SelectContent>
                                {actions.map((act) => (
                                  <SelectItem key={act} value={act}>
                                    {act}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-3'>
                  <Button type='submit' className='w-full'>
                    Assign Permission
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignRolePermissionsForm;
