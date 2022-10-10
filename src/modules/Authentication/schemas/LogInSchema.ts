import { string } from 'yup';

import UserSchema from './UserSchema';

const LogIn = UserSchema.pick(['email']).shape({
  password: string().required(),
});

export default LogIn;
