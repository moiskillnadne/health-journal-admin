import { useConfirmDialog as useConfirm } from 'react-mui-confirm';

export const useConfirmWarning = () => {
  const confirm = useConfirm();
  return ({ title }: { title: string }) => {
    return confirm({
      title,
      cancelButtonProps: {
        sx: {
          display: 'none',
        },
      },
      confirmButtonText: 'OK',
      confirmButtonProps: {
        variant: 'contained',
        sx: {
          borderRadius: '8px',
        },
      },
      dialogTitleProps: {
        sx: {
          padding: '0px',
        },
      },
    });
  };
};

export default useConfirmWarning;
