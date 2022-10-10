import { useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import { Box } from '@mui/material';

type Props = {
  onVerify: () => void;
  isOpen: boolean;
};

const Captcha = ({ isOpen, onVerify }: Props) => {
  const recaptchaRef = useRef<ReCAPTCHA>();

  useEffect(() => {
    if (!isOpen) {
      recaptchaRef.current?.reset();
    }
  }, [isOpen]);

  const onChange = (token: string | null) => {
    if (token != null) {
      onVerify();
    }
  };

  return (
    <Box
      sx={{
        display: isOpen ? 'flex' : 'none',
        justifyContent: 'center',
        mt: '20px',
      }}>
      <ReCAPTCHA
        ref={recaptchaRef as React.RefObject<ReCAPTCHA>}
        sitekey={process.env.REACT_APP_RECAPTCHA_KEY as string}
        onChange={onChange}
      />
    </Box>
  );
};
export default Captcha;
