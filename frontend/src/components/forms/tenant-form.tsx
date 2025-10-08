import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '../ui/form';
import { z } from 'zod';
import type { TenantPayload } from '@/index';

const tenantSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  slug: z.string().min(2, 'Slug is required'),
});

export default function TenantForm({
  handleSubmit,
  initialData,
}: {
  handleSubmit: (values: TenantPayload) => Promise<void>;
  initialData?: TenantPayload;
}) {
  const form = useForm({
    resolver: zodResolver(tenantSchema),
    defaultValues: initialData || {
      name: '',
      slug: '',
      email: '',
      country: '',
      phone: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof tenantSchema>) => {
    await handleSubmit({
      ...values,
      id: initialData?.id ?? '',
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='grid grid-cols-2 gap-4'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Tenant name' {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='slug'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder='tenant-slug' {...field} />
              </FormControl>
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
                <Input placeholder='tenant@email.com' {...field} />
              </FormControl>
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
                <Input placeholder='+94 71 234 5678' {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='country'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder='Sri Lanka' {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className='col-span-2 flex justify-end'>
          <Button type='submit'>Save</Button>
        </div>
      </form>
    </Form>
  );
}
