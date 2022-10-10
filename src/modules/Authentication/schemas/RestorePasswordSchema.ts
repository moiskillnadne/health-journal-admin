import SignUpSchema from './SignUpSchema';

const RestorePasswordSchema = SignUpSchema.pick(['email']);

export default RestorePasswordSchema;
