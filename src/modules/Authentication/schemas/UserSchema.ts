import { object, string } from 'yup';

const UserSchema = object({
  username: string().required(),
  email: string().email('Please enter valid email').required('Please Enter your email'),
});

export default UserSchema;
