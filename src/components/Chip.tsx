import { Chip as DefaultChip, SvgIcon } from '@mui/material';
import { ReactComponent as CloseIcon } from '@assets/icons/ic-close.svg';

type Props = React.ComponentProps<typeof DefaultChip>;

const Chip = (props: Props) => (
  <DefaultChip
    sx={{
      height: '24px',
      backgroundColor: 'rgba(62, 168, 50, 0.5)',
      color: '#fff',
      fontSize: '14px',
      borderRadius: '4px',
      '.MuiChip-deleteIcon': {
        fontSize: '16px',
        color: '#fff',
      },
      margin: '1px',
    }}
    deleteIcon={<SvgIcon component={CloseIcon} />}
    {...props}
  />
);

export default Chip;
