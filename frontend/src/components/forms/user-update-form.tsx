/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils';
import { userUpdateSchema } from '@/lib/validationts';
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
import { useRoleStore } from '@/stores/roleStore';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import type z from 'zod';
import type { UserPayload } from '@/index';

interface UserUpdateFormProps {
  user: UserPayload;
  handleSubmit: (values: UserPayload & { roleNames: string[] }) => void;
}

const UserUpdateForm = ({ user, handleSubmit }: UserUpdateFormProps) => {
  const { getAllRoles, roles } = useRoleStore();
  console.log(user);

  const existingRoles = user.roles?.map((r: any) => r.name) || [];
  const [selectedRoles, setSelectedRoles] = useState<string[]>(existingRoles);

  const form = useForm<z.infer<typeof userUpdateSchema>>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  useEffect(() => {
    getAllRoles();
  }, [getAllRoles]);

  const onSubmit = (values: z.infer<typeof userUpdateSchema>) => {
    const payload: UserPayload & { roleNames: string[] } = {
      ...user,
      ...values,
      roleNames: selectedRoles,
    };
    handleSubmit(payload);
  };

  const availableRoles = roles
    .map((r) => r.name)
    .filter((r) => !selectedRoles.includes(r));

  return (
    <div className={cn('flex flex-col gap-6')}>
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-6'>
                {/* Name */}
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

                {/* Email */}
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

                {/* Roles */}
                <Accordion type='single' collapsible>
                  <AccordionItem value='roles'>
                    <AccordionTrigger>Update Roles</AccordionTrigger>
                    <AccordionContent>
                      <div className='flex gap-10 items-center'>
                        <Select
                          onValueChange={(value: string) => {
                            if (!selectedRoles.includes(value)) {
                              setSelectedRoles([...selectedRoles, value]);
                            }
                          }}
                        >
                          <SelectTrigger className='w-1/2'>
                            <SelectValue placeholder='Select Roles' />
                          </SelectTrigger>
                          <SelectContent>
                            {availableRoles.map((role, idx) => (
                              <SelectItem value={role} key={idx}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className='flex gap-2 max-w-1/2 flex-wrap'>
                          {selectedRoles.map((role, index) => (
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
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Button type='submit' className='w-full'>
                  Update User
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserUpdateForm;
