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

export const roleSchema = z.object({
  name: z.string().min(3, { message: 'Name cannot be empty' }),
});

export const userSchema = z
  .object({
    name: z.string().min(3, { message: 'Name cannot be empty' }),
    email: z.email().min(3, { message: 'Email cannot be empty' }),
    password: z.string().min(3, { message: 'Password cannot be emtpy' }),
    confirmPassword: z
      .string()
      .min(3, { message: 'Confirm password cannot be empty' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirm'],
  });

export const userUpdateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.email({ message: 'Invalid email' }),
});

export const permissionSchema = z.object({
  resource: z.string().min(3, { message: 'Resource cannot be empty' }),
  action: z.string().min(3, { message: 'Action cannot be empty' }),
});

export const userPermissionSchema = z.object({
  userId: z.string().min(3, { message: 'User is required' }),
  resource: z.string().min(3, { message: 'Resource is required' }),
  action: z.string().min(3, { message: 'Action is required' }),
});

export const rolePermissionSchema = z.object({
  roleId: z.string().min(3, { message: 'Role is required' }),
  resource: z.string().min(3, { message: 'Resource is required' }),
  action: z.string().min(3, { message: 'Action is required' }),
});

export const vehicleSchema = z.object({
  numberPlate: z.string().min(2, 'Number plate is required'),
  type: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  color: z.string().optional(),
  passExpiryDate: z.string().optional(),
  driverId: z.string().min(1, 'Driver is required'),
});

export const personVehicleSchema = z.object({
  numberPlate: z.string().min(2, 'Number plate is required'),
  type: z.string().optional(),
  color: z.string().optional(),
  model: z.string().optional(),
});

export const personSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  nic: z.string().min(5, 'NIC is required'),
  id: z.string().optional(),
  type: z.enum(['employee', 'driver', 'helper', 'visitor']),
  phone: z
    .string()
    .regex(/^[0-9]{10,15}$/, 'Phone must be 10-15 digits')
    .optional()
    .or(z.literal('')), // allow empty string
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  departmentId: z.string().optional(),
  companyName: z.string().optional(),
  purpose: z.string().optional(),
  passType: z.string().optional(),
  passExpiryDate: z
    .string()
    .optional()
    .refine(
      (date) => !date || new Date(date) > new Date(),
      'Pass expiry must be in the future'
    ),
  vehicleData: z.array(personVehicleSchema).max(3).optional(),
});

export const appointmentSchema = z.object({
  datetime: z.string().min(1, 'Date and time is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  expectedDuration: z
    .number({ message: 'Expected duration must be a number' })
    .min(1, 'Duration must be at least 1 minute'),
  visitorId: z.string().optional(),
  employeeId: z.string().optional().or(z.literal('')).nullable(),
});

export const gateActionSchema = z.object({
  personId: z.string().min(1, 'Person is required'),
  vehicleId: z.string().optional(),
  gateId: z.string().min(1, 'Gate is required'),
  action: z.enum(['in', 'out', 'breakExit', 'breakReentry'], {
    message: 'Action is required',
  }),
  breakType: z.string().optional(),
});
