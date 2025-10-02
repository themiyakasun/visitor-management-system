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
import type z from 'zod';
import { cn } from '@/lib/utils';
import { vehicleSchema } from '@/lib/validationts';
import { usePersonStore } from '@/stores/personStore';
import { useEffect } from 'react';
import type { VehiclePayload } from '@/index';

const vehicleTypes = ['Car', 'Van', 'Lorry', 'Bike', 'Bus', 'Other'];

const VehicleForm = ({
  handleSubmit,
  initialData,
}: {
  handleSubmit: (values: VehiclePayload & { id?: string }) => void;
  initialData?: VehiclePayload | null;
}) => {
  const { persons, getAllPersons } = usePersonStore();

  const form = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialData || {
      numberPlate: '',
      type: '',
      make: '',
      model: '',
      color: '',
      passExpiryDate: '',
      driverId: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      await getAllPersons({ page: 1, limit: 50, search: '', type: 'all' });
    };
    fetchData();
  }, [getAllPersons]);

  const onSubmit = async (values: z.infer<typeof vehicleSchema>) => {
    const payload = { ...values, id: initialData?.id };
    await handleSubmit(payload);
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
                  name='numberPlate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number Plate</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter vehicle number plate'
                          {...field}
                        />
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
                      <FormLabel>Vehicle Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className='w-full'>
                          <SelectTrigger>
                            <SelectValue placeholder='Select vehicle type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicleTypes.map((v) => (
                            <SelectItem value={v} key={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='make'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter vehicle make' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='model'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter vehicle model' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='color'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter vehicle color' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <FormField
                  control={form.control}
                  name='driverId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign Driver</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className='w-full'>
                          <SelectTrigger>
                            <SelectValue placeholder='Select driver' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {persons.map((driver) => (
                            <SelectItem value={driver.id} key={driver.id}>
                              {driver.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex flex-col gap-3'>
                  <Button type='submit' className='w-full'>
                    {initialData ? 'Update Vehicle' : 'Create Department'}
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

export default VehicleForm;
