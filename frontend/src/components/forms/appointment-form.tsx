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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';
import { cn } from '@/lib/utils';
import { appointmentSchema } from '@/lib/validationts';
import { usePersonStore } from '@/stores/personStore';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import type { AppointmentPayload, AppointmentUpdatePayload } from '@/index';

const AppointmentForm = ({
  handleSubmit,
  initialData,
}: {
  handleSubmit: (values: AppointmentPayload | AppointmentUpdatePayload) => void;
  initialData?: AppointmentPayload | null;
}) => {
  const { persons, getAllPersons } = usePersonStore();
  const [visitorSearch, setVisitorSearch] = useState('');

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: initialData || {
      datetime: '',
      purpose: '',
      expectedDuration: 30,
      visitorId: '',
      employeeId: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      await getAllPersons({
        page: 1,
        limit: 50,
        search: visitorSearch,
        type: 'visitor',
      });
    };
    fetchData();
  }, [getAllPersons, visitorSearch]);

  const onSubmit = async (values: z.infer<typeof appointmentSchema>) => {
    if (initialData?.id) {
      const payload: AppointmentUpdatePayload & { id: string } = {
        id: initialData.id,
        datetime: values.datetime,
        purpose: values.purpose,
        expectedDuration: values.expectedDuration.toString(),
      };
      await handleSubmit(payload);
    } else {
      const payload: AppointmentPayload = { ...values };
      await handleSubmit(payload);
    }
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
                  name='datetime'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date & Time</FormLabel>
                      <FormControl>
                        <Input type='datetime-local' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <FormField
                  control={form.control}
                  name='expectedDuration'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Enter expected duration'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='visitorId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visitor ID</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl className='w-full'>
                            <SelectTrigger>
                              <SelectValue placeholder='Select visitor' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <Input
                              placeholder='Search...'
                              value={visitorSearch}
                              onChange={(e) => setVisitorSearch(e.target.value)}
                              className='mb-2'
                            />
                            {persons.map((driver) => (
                              <SelectItem value={driver.id} key={driver.id}>
                                {driver.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='employeeId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter employee ID' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex flex-col gap-3'>
                  <Button type='submit' className='w-full'>
                    Create Appointment
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

export default AppointmentForm;
