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
import { departmentSchema } from '@/lib/validationts';
import { cn } from '@/lib/utils';
import type z from 'zod';
import { Textarea } from '../ui/textarea';
import type { DepartmentPayload } from '@/index';

const DepartmentForm = ({
  handleSubmit,
  initialData,
}: {
  handleSubmit: (values: DepartmentPayload & { id?: string }) => void;
  initialData?: DepartmentPayload | null;
}) => {
  const form = useForm<z.infer<typeof departmentSchema>>({
    resolver: zodResolver(departmentSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof departmentSchema>) => {
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
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Enter department discription'
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
                    {initialData ? 'Update Department' : 'Create Department'}
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

export default DepartmentForm;
