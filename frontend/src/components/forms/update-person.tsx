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
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';
import { cn } from '@/lib/utils';
import { personSchema } from '@/lib/validationts';
import type { PersonPayload } from '@/index';

const vehicleTypes = ['Car', 'Van', 'Lorry', 'Bike', 'Bus', 'Other'];

interface PersonUpdateFormProps {
  person: PersonPayload;
  handleSubmit: (values: PersonPayload) => void;
}

const PersonUpdateForm = ({ person, handleSubmit }: PersonUpdateFormProps) => {
  type PersonFormValues = z.infer<typeof personSchema>;

  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      name: person.name,
      nic: person.nic,
      type: person.type,
      id: person.id,
      phone: person.phone,
      email: person.email,
      address: person.address,
      departmentId: person.departmentId,
      companyName: person.companyName,
      purpose: person.purpose,
      passExpiryDate: person.passExpiryDate,
      passType: person.passType,
      vehicleData: person.vehicleData || [],
    },
  });

  const selectedType = form.watch('type');

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'vehicleData',
  });

  const onSubmit = async (values: PersonFormValues) => {
    const payload: PersonPayload = {
      ...person,
      ...values,
    };

    // Set passType dynamically
    if (values.type !== 'employee') {
      payload.passType = `${values.type}Pass`;
    } else {
      payload.passType = undefined;
    }

    await handleSubmit(payload);
  };

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
                        <Input placeholder='Enter full name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* NIC */}
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

                {/* Type */}
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

                {/* Employee only */}
                {selectedType === 'employee' && (
                  <>
                    <FormField
                      control={form.control}
                      name='id'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee ID</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter employee ID' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='departmentId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter department ID'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Visitor only */}
                {selectedType === 'visitor' && (
                  <>
                    <FormField
                      control={form.control}
                      name='companyName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter company name'
                              {...field}
                            />
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
                  </>
                )}

                {/* Phone, Email, Address, Pass Expiry */}
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter phone' {...field} />
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
                        <Input placeholder='Enter email' {...field} />
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

                {/* Vehicles */}
                <div className='flex flex-col gap-4'>
                  <h3 className='font-semibold text-lg'>Vehicles</h3>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end border p-3 rounded-lg'
                    >
                      <FormField
                        control={form.control}
                        name={`vehicleData.${index}.numberPlate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Plate Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Enter plate number'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`vehicleData.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
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
                        name={`vehicleData.${index}.model`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter model' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`vehicleData.${index}.color`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter color' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type='button'
                        variant='destructive'
                        onClick={() => remove(index)}
                        className='mt-2'
                      >
                        Remove
                      </Button>
                    </div>
                  ))}

                  {fields.length < 3 && (
                    <Button
                      type='button'
                      onClick={() =>
                        append({
                          numberPlate: '',
                          type: 'Car',
                          model: '',
                          color: '',
                        })
                      }
                      className='w-fit'
                    >
                      Add Vehicle
                    </Button>
                  )}
                </div>

                <Button type='submit' className='w-full'>
                  Update Person
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonUpdateForm;
