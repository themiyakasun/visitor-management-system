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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { cn } from '@/lib/utils';
import { gateActionSchema } from '@/lib/validationts';
import { useGateStore } from '@/stores/gateStore';
import { usePersonStore } from '@/stores/personStore';
import { useEffect, useState } from 'react';

const GateActionForm = () => {
  const { recordGateAction } = useGateStore();
  const { persons, getAllPersons } = usePersonStore();
  const [personSearch, setPersonSearch] = useState('');

  const form = useForm({
    resolver: zodResolver(gateActionSchema),
    defaultValues: {
      personId: '',
      vehicleId: '',
      gateId: '',
      action: 'in',
      breakType: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      await getAllPersons({
        page: 1,
        limit: 50,
        search: personSearch,
        type: 'all',
      });
    };
    fetchData();
  }, [getAllPersons, personSearch]);

  const selectedAction = form.watch('action');

  const onSubmit = async (values: z.infer<typeof gateActionSchema>) => {
    const payload = { ...values };

    if (payload.action !== 'breakExit') {
      delete payload.breakType;
    }

    console.log(values);

    await recordGateAction(payload);
  };

  return (
    <div className={cn('flex flex-col gap-6')}>
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-6'>
                {/* Person */}
                <FormField
                  control={form.control}
                  name='personId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Person ID</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className='w-full'>
                          <SelectTrigger>
                            <SelectValue placeholder='Select Person' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <Input
                            placeholder='Search...'
                            value={personSearch}
                            onChange={(e) => setPersonSearch(e.target.value)}
                            className='mb-2'
                          />
                          {persons.map((person) => (
                            <SelectItem value={person.id} key={person.id}>
                              {person.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Vehicle */}
                <FormField
                  control={form.control}
                  name='vehicleId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle ID (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter vehicle ID' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gate */}
                <FormField
                  control={form.control}
                  name='gateId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gate ID</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter gate ID' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action */}
                <FormField
                  control={form.control}
                  name='action'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Action</FormLabel>
                      <div className='flex gap-3'>
                        {[
                          { label: 'Entry', value: 'in' },
                          { label: 'Exit', value: 'out' },
                          { label: 'Break Exit', value: 'breakExit' },
                          { label: 'Break Reentry', value: 'breakReentry' },
                        ].map((action) => (
                          <Button
                            key={action.value}
                            type='button'
                            variant={
                              field.value === action.value
                                ? 'default'
                                : 'outline'
                            }
                            onClick={() => field.onChange(action.value)}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Break Type - only if breakExit */}
                {selectedAction === 'breakExit' && (
                  <FormField
                    control={form.control}
                    name='breakType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Break Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl className='w-full'>
                            <SelectTrigger>
                              <SelectValue placeholder='Select break type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='tea'>Tea Break</SelectItem>
                            <SelectItem value='lunch'>Lunch Break</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className='flex flex-col gap-3'>
                  <Button type='submit' className='w-full'>
                    Record Gate Action
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

export default GateActionForm;
