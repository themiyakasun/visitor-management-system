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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { permissionSchema } from '@/lib/validationts';
import type z from 'zod';
import { Button } from '../ui/button';
import type { PermissionPayload } from '@/index';

const PermissionForm = ({
  handleSubmit,
  initialData,
}: {
  handleSubmit: (values: PermissionPayload & { id?: number }) => void;
  initialData?: PermissionPayload | null;
}) => {
  const form = useForm<z.infer<typeof permissionSchema>>({
    resolver: zodResolver(permissionSchema),
    defaultValues: initialData || {
      resource: '',
      action: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof permissionSchema>) => {
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
                    name='resource'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resource</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter permission resource (user, role)'
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
                    name='action'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Action</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter permission action (create, update)'
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
                    {initialData ? 'Update Permission' : 'Create Permission'}
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

export default PermissionForm;
