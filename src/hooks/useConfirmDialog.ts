import React from 'react';
import { useConfirmDialog as useConfirm } from 'react-mui-confirm';

type Props = {
  title: string;
  onConfirm: () => void;
  description?: string | React.ReactNode;
};

const useConfirmDialog = () => {
  const confirm = useConfirm();
  return (props: Props) => {
    return confirm({
      ...props,
      rejectOnCancel: true,
      cancelButtonProps: {
        variant: 'tertiary',
        sx: {
          borderRadius: '8px',
        },
      },
      confirmButtonProps: {
        variant: 'contained',
        sx: {
          borderRadius: '8px',
        },
      },
      dialogContentProps: {
        sx: {
          padding: '0px 0px 20px 0px',
        },
      },
      dialogTitleProps: {
        sx: {
          padding: '0px',
        },
      },
    }) as unknown as Promise<unknown>;
  };
};
export default useConfirmDialog;
