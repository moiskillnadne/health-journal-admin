import { useState } from 'react';
import { SerializedError } from '@reduxjs/toolkit';

import { Alert } from '@mui/material';
import { CustomFetchBaseQueryError } from '@app/types';

type Props = {
  error: CustomFetchBaseQueryError | SerializedError | string;
};

function ErrorAlert({ error, ...props }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  function close() {
    setIsOpen(false);
  }

  let message;

  if (typeof error === 'string') {
    message = error;
  } else if ('data' in error) {
    message = error.data.message;
  } else {
    message = error.message;
  }

  return isOpen ? (
    <Alert sx={{ mt: '20px' }} severity="error" onClose={close} {...props}>
      {message}
    </Alert>
  ) : null;
}

export default ErrorAlert;
