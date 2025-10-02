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
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';
import { cn } from '@/lib/utils';
import { personSchema } from '@/lib/validationts';
import { usePersonStore } from '@/stores/personStore';

const PersonAddForm = () => {
  const { createPerson } = usePersonStore();
  const form = useForm({
    resolver: zodResolver(personSchema),
    defaultValues: {
      name: '',
      nic: '',
      type: 'employee',
      phone: '',
      email: '',
      address: '',
      departmentId: '',
      companyName: '',
      purpose: '',
      passExpiryDate: '',
      passType: '',
    },
  });

  const selectedType = form.watch('type');

  const onSubmit = async (values: z.infer<typeof personSchema>) => {
    const payload = { ...values };
    if (values.type !== 'employee') {
      payload.passType = `${values.type}Pass`;
    } else {
      payload.passType = undefined;
    }

    await createPerson(values);
  };

  return (
    <div className={cn('flex flex-col gap-6')}>
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-6'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter full name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='nic'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIC</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter NIC' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className='w-full'>
                          <SelectTrigger>
                            <SelectValue placeholder='Select type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='employee'>Employee</SelectItem>
                          <SelectItem value='driver'>Driver</SelectItem>
                          <SelectItem value='helper'>Helper</SelectItem>
                          <SelectItem value='visitor'>Visitor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter phone number' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter email address' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder='Enter address' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Department (employee only) */}
                {selectedType === 'employee' && (
                  <FormField
                    control={form.control}
                    name='departmentId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter department ID' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Company Name (visitor only) */}
                {selectedType === 'visitor' && (
                  <FormField
                    control={form.control}
                    name='companyName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter company name' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedType === 'visitor' && (
                  <FormField
                    control={form.control}
                    name='purpose'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purpose</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter purpose' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name='passExpiryDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pass Expiry Date</FormLabel>
                      <FormControl>
                        <Input type='date' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex flex-col gap-3'>
                  <Button type='submit' className='w-full'>
                    Create Person
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

export default PersonAddForm;
