import { string, ref } from 'yup';

import UserSchema from './UserSchema';

const SignUpSchema = UserSchema.pick(['username', 'email']).shape({
  password: string()
    .required()
    .min(8, 'Your password must be longer than 8 characters.')
    .matches(/^(?=.*[a-z])/, 'Must have lowercase letters (a-z)')
    .matches(/^(?=.*[A-Z])/, 'Must have at least one uppercase letter (A-Z)')
    .matches(/^(?=.*[0-9])/, 'Must have at least one number')
    .matches(/^\S*$/, 'Must have no spaces'),
  confirmPassword: string()
    .oneOf([ref('password'), null], 'Passwords must match')
    .required('Please Repeat your password'),
});

export default SignUpSchema;
