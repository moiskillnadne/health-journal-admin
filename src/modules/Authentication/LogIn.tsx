import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';

import { Box, Typography, Button, SvgIcon, Alert, Collapse } from '@mui/material';
import { useAppForm } from '@app/hooks';

import { LogInSchema } from './schemas';
import { TLogInForm } from './types';
import { ReactComponent as PasswordIcon } from '@assets/icons/ic-password-show.svg';
import { useLoginMutation } from './hooks';
import Captcha from './Captcha';
import { FormProvider } from 'react-hook-form';
import ErrorAlert from '@app/components/ErrorAlert';
import InputField from './InputField';

const LogIn = () => {
  const [isPasswordShown, setShowPassword] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [isCaptchaShown, setIsCaptchaShown] = useState(false);

  const navigate = useNavigate();

  const form = useAppForm(
    {
      defaultValues: {
        email: '',
        password: '',
      },
    },
    { schema: LogInSchema },
  );

  const { handleSubmit } = form;
  const [login, { isSuccess: successfullyLoggedIn, isLoading, error }] = useLoginMutation();

  const onSubmit = (data: TLogInForm) => {
    login(data)
      .unwrap()
      .catch(() => {
        attemptsCount < 2 ? setAttemptsCount(count => ++count) : setIsCaptchaShown(true);
      });
  };

  const showPassword = () => {
    setShowPassword(state => !state);
  };

  useEffect(() => {
    if (successfullyLoggedIn) {
      navigate('/admin');
    }
  }, [navigate, successfullyLoggedIn]);

  const { REACT_APP_VERSION } = process.env;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}>
      <Typography sx={{ textAlign: 'left', fontWeight: 600 }} variant="h6">
        Log In
      </Typography>
      <FormProvider {...form}>
        <InputField label="E-mail" name="email" />
        <InputField
          label="Password"
          name="password"
          type={isPasswordShown ? 'text' : 'password'}
          rightElement={
            <SvgIcon
              onClick={showPassword}
              sx={{ mt: '7px', cursor: 'pointer' }}
              component={PasswordIcon}
            />
          }
        />
      </FormProvider>
      <Link
        style={{ textAlign: 'left', color: '#3a4364', fontSize: '14px' }}
        to={'/restore-password'}>
        Forgot password?
      </Link>
      <Captcha isOpen={isCaptchaShown} onVerify={() => setIsCaptchaShown(false)} />
      <Button
        disabled={isCaptchaShown || isLoading}
        sx={{ mt: '20px', py: '11px' }}
        onClick={handleSubmit(onSubmit)}
        variant="contained">
        Log In
      </Button>
      {error && <ErrorAlert error={error} />}
      <Typography sx={{ fontSize: '14px', color: '#8f8f8f', mt: '12px', mb: '-32px' }} variant="h6">
        Version {REACT_APP_VERSION}
      </Typography>
    </Box>
  );
};

export default LogIn;
