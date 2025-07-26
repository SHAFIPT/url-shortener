import Joi from 'joi';

// Define TS types manually
export type LoginForm = {
  email: string;
  password: string;
};

export type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

// Joi schemas
export const loginSchema = Joi.object<LoginForm>({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Please enter a valid email',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .pattern(/^[A-Z]/, { name: 'starts with capital letter' })
    .min(6)
    .required()
    .messages({
      'string.pattern.name': 'Password must start with a capital letter',
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
});

export const registerSchema = Joi.object<RegisterForm>({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Please enter a valid email',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .pattern(/^[A-Z]/, { name: 'starts with capital letter' })
    .min(8)
    .required()
    .messages({
      'string.pattern.name': 'Password must start with a capital letter',
      'string.min': 'Password must be at least 8 characters',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
});

// Generic validation function
export function validateJoi<T>(
  schema: Joi.ObjectSchema<T>,
  data: T
): { value: T | undefined; errors: Record<string, string> | null } {
  const { value, error } = schema.validate(data, { abortEarly: false });
  if (!error) return { value, errors: null };

  const errors: Record<string, string> = {};
  for (const d of error.details) {
    const key = d.path.join('.');
    if (!errors[key]) errors[key] = d.message;
  }
  return { value: undefined, errors };
}
