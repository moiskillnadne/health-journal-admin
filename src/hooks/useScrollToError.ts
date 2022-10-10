import { useEffect } from 'react';

function useScrollToError<T>(errors: T) {
  useEffect(() => {
    const errorsvalues = Object.values(errors);
    if (errorsvalues.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      document.querySelector(`[name=${errorsvalues[0]?.ref?.name as string}]`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  }, [errors]);
}

export default useScrollToError;
