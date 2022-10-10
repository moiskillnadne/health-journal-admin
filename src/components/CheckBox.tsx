import { Checkbox } from '@mui/material';
import { forwardRef } from 'react';
import { ReactComponent as CheckBoxActiveIcon } from '@assets/icons/checkbox-active.svg';
import { ReactComponent as CheckBoxIcon } from '@assets/icons/checkbox-unchecked.svg';
import { ReactComponent as CheckBoxIndeterminateIcon } from '@assets/icons/checkbox-indeterminate.svg';

const CheckboxField = forwardRef((props, ref) => {
  return (
    <Checkbox
      icon={<CheckBoxIcon />}
      indeterminateIcon={<CheckBoxIndeterminateIcon />}
      checkedIcon={<CheckBoxActiveIcon />}
      {...props}
    />
  );
});

export default CheckboxField;
