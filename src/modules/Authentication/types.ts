import {
  SignUpSchema,
  LogInSchema,
  UserSchema,
  ConfirmNewPasswordSchema,
  RestorePasswordSchema,
} from './schemas';
import { InferType } from 'yup';

export type TUser = InferType<typeof UserSchema>;
export type TSignUp = InferType<typeof SignUpSchema>;
export type TLogInForm = InferType<typeof LogInSchema>;
export type TConfirmNewPasswordForm = InferType<typeof ConfirmNewPasswordSchema>;
export type TRestorePasswordForm = InferType<typeof RestorePasswordSchema>;
