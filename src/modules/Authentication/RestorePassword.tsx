import { useEffect, useState, useMemo } from 'react';

import { FormProvider } from 'react-hook-form';
import { Box, Typography, Button } from '@mui/material';

import ErrorAlert from '@app/components/ErrorAlert';
import { useAppForm } from '@app/hooks';
import { Timer } from '@app/utils';

import { RestorePasswordSchema } from './schemas';
import { TRestorePasswordForm } from './types';
import InputField from './InputField';
import { useRestorePasswordMutation } from './hooks';

const RestorePassword = () => {
  const [seconds, setSeconds] = useState(0);

  const timer = useMemo(() => Timer(0, { onChange: setSeconds }), []);

  const form = useAppForm(
    {
      defaultValues: {
        email: '',
      },
    },
    { schema: RestorePasswordSchema },
  );

  const { handleSubmit } = form;

  const [passwordRestore, { isSuccess: successfullyRestored, isLoading, error }] =
    useRestorePasswordMutation();

  useEffect(() => {
    timer.start();

    return () => {
      timer.stop();
    };
  }, [timer]);

  const textWithCounter = seconds
    ? `Send Again 0:${seconds > 9 ? '' : 0}${seconds}`
    : 'Send E-mail';

  const onSubmit = (data: TRestorePasswordForm) => {
    passwordRestore(data);
    timer.reset(59);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}>
      <Typography sx={{ textAlign: 'left', fontWeight: 600 }} variant="h6">
        Restore password
      </Typography>
      <FormProvider {...form}>
        <InputField label="E-mail" name="email" />
      </FormProvider>
      <Button
        disabled={isLoading || !!seconds}
        sx={{ mt: '20px', py: '11px' }}
        onClick={handleSubmit(onSubmit)}
        variant="contained">
        {textWithCounter}
      </Button>
      {error && <ErrorAlert error={error} />}
    </Box>
  );
};

export default RestorePassword;
