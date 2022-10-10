import { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';
import type { History } from 'history';

export function useBlocker(blocker: (value: unknown) => void, when = true) {
  const navigator = useContext(NavigationContext).navigator as History;

  useEffect(() => {
    if (!when) return;

    const unblock = navigator.block((tx: { retry: () => void }) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}
