import { cn } from '@/lib/utils';
import { userSchema } from '@/lib/validationts';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type z from 'zod';
import { useUserStore } from '@/stores/userStore';
import { useRoleStore } from '@/stores/roleStore';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';

const UserForm = () => {
  const { createUser } = useUserStore();
  const { getAllRoles, roles } = useRoleStore();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      await getAllRoles();
    };
    fetchData();
  }, [getAllRoles]);

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    await createUser({
      name: values.name,
      email: values.email,
      password: values.password,
      roleNames: selectedRoles,
    });
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
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter user name' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            placeholder='Enter user email'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='Enter user password'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='Enter user password'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid gap-3'>
                  <Accordion type='single' collapsible>
                    <AccordionItem value='item-1'>
                      <AccordionTrigger className='flex items-start'>
                        Assign Roles
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className='flex gap-10 items-center'>
                          <Select
                            onValueChange={(value: string) => {
                              if (!selectedRoles.includes(value))
                                setSelectedRoles([...selectedRoles, value]);
                            }}
                          >
                            <SelectTrigger className='w-1/2'>
                              <SelectValue placeholder='Select Roles' />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem value={role.name} key={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <div className='flex gap-2 max-w-1/2 flex-wrap'>
                            {selectedRoles.length > 0 ? (
                              selectedRoles.map((role, index) => (
                                <Badge
                                  key={index}
                                  className='cursor-pointer'
                                  onClick={() =>
                                    setSelectedRoles(
                                      selectedRoles.filter((r) => r !== role)
                                    )
                                  }
                                >
                                  {role} ✕
                                </Badge>
                              ))
                            ) : (
                              <span>No role selected</span>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div className='flex flex-col gap-3'>
                  <Button type='submit' className='w-full'>
                    Create User
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

export default UserForm;
