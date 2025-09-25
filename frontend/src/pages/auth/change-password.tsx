import ChangePasswordForm from '@/components/forms/change-password-form';

const ChangePassword = () => {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePassword;
