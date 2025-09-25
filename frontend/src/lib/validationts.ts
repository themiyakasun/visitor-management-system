import z from 'zod';

export const loginSchema = z.object({
  email: z.email().min(3, { message: 'Email cannot be empty' }),
  password: z.string().min(3, { message: 'Password cannot be emtpy' }),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(3, { message: 'Old Password cannot be empty' }),
    newPassword: z
      .string()
      .min(8, { message: 'New password cannot be empty' })
      .regex(/^(?=.*[A-Z]).{8,}$/, {
        message:
          'Should Contain at least one uppercase letter and have a minimum length of 8 characters.',
      }),
    confirmPassword: z
      .string()
      .min(3, { message: 'Confirm password cannnot be empty' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't mathc",
  });

export const departmentSchema = z.object({
  name: z.string().min(3, { message: 'Name cannot be empty' }),
  description: z.string(),
});
