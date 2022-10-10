import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import { Box, Typography, Button, SvgIcon } from '@mui/material';

import ErrorAlert from '@app/components/ErrorAlert';
import { useAppForm } from '@app/hooks';
import { ReactComponent as PasswordIcon } from '@assets/icons/ic-password-show.svg';

import { ConfirmNewPasswordSchema } from './schemas';
import { TConfirmNewPasswordForm } from './types';
import { useConfirmNewPasswordRequestMutation } from './hooks';
import InputField from './InputField';

const ConfirmNewPassword = () => {
  const [isPasswordShown, setShowPassword] = useState(false);
  const [isPasswordConfirmShown, setShowPasswordConfirm] = useState(false);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const location = useLocation();
  const code = searchParams.get('code');

  const form = useAppForm(
    {
      defaultValues: {
        email: '',
        confirmPassword: '',
        password: '',
      },
    },
    { schema: ConfirmNewPasswordSchema },
  );

  const { handleSubmit } = form;

  const [confirmPassword, { isSuccess: successfullyRecovered, isLoading, error }] =
    useConfirmNewPasswordRequestMutation();

  const onSubmit = ({ email, password }: TConfirmNewPasswordForm) => {
    confirmPassword({ email, newPassword: password, code });
  };

  useEffect(() => {
    if (successfullyRecovered) {
      navigate('/login');
    }
  }, [navigate, successfullyRecovered]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}>
      <Typography sx={{ textAlign: 'left', fontWeight: 600 }} variant="h6">
        Password recovery
      </Typography>
      <FormProvider {...form}>
        <InputField label="E-mail" name="email" />
        <InputField
          label="New Password"
          name="password"
          type={isPasswordShown ? 'text' : 'password'}
          rightElement={
            <SvgIcon
              onClick={() => setShowPassword(state => !state)}
              sx={{ mt: '7px', cursor: 'pointer' }}
              component={PasswordIcon}
            />
          }
        />
        <InputField
          type={isPasswordConfirmShown ? 'text' : 'password'}
          label="Repeat Password"
          name="confirmPassword"
          rightElement={
            <SvgIcon
              onClick={() => setShowPasswordConfirm(state => !state)}
              sx={{ mt: '7px', cursor: 'pointer' }}
              component={PasswordIcon}
            />
          }
        />
      </FormProvider>
      <Button
        disabled={isLoading}
        sx={{ mt: '20px', py: '11px' }}
        onClick={handleSubmit(onSubmit)}
        variant="contained">
        Change Password
      </Button>
      {error && <ErrorAlert error={error} />}
    </Box>
  );
};

export default ConfirmNewPassword;
