import SignUpSchema from './SignUpSchema';

const ConfirmNewPasswordSchema = SignUpSchema.pick(['email', 'password', 'confirmPassword']);

export default ConfirmNewPasswordSchema;
