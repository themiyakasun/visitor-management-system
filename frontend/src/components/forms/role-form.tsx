/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleSchema } from '@/lib/validationts';
import type z from 'zod';
import type { RolePayload } from '@/index';

const RoleForm = ({
  handleSubmit,
  initialData,
}: {
  handleSubmit: (values: RolePayload & { id?: string }) => void;
  initialData?: RolePayload | null;
}) => {
  const form = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: initialData || {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof roleSchema>) => {
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
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter department name'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='flex flex-col gap-3'>
                  <Button type='submit' className='w-full'>
                    {initialData ? 'Update Role' : 'Create Role'}
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

export default RoleForm;
