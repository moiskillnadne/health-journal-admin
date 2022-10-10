import { useCallback } from 'react';

import { useConfirmDialog } from '@app/hooks';

import { useBlocker } from './useBlocker';

function useUnsavedDataDialog(when = true) {
  const openConfirmDialog = useConfirmDialog();

  const blocker = useCallback(
    tx => {
      openConfirmDialog({
        title: 'The information on this page will be lost if not saved.',
        onConfirm: () => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          tx.retry();
        },
      });
    },
    [openConfirmDialog],
  );

  useBlocker(blocker, when);
}

export default useUnsavedDataDialog;
