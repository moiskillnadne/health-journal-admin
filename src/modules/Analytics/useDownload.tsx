import { useAppSelector } from '@app/hooks';
import { ApiError } from '@app/types';

function useDownload() {
  const token = useAppSelector(store => store.auth.token);

  return function (params: string) {
    const url = `${process.env.REACT_APP_API_URL || ''}/analytic?${params}`;
    return fetch(url, {
      method: 'GET',
      headers: {
        source: 'WEB_ADMIN',
        Authorization: `Bearer ${token ?? ''}`,
        'Access-Control-Expose-Header': '*',
      },
    }).then(async response => {
      if (response.ok) {
        response.blob().then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = response.headers.get('content-disposition')?.split('=')[1] as string;
          a.click();
          a.remove();
        });
      } else {
        const errorMessage =
          (await response.json().then((text: ApiError) => text.message)) || 'Something went wrong.';
        throw errorMessage;
      }
    });
  };
}

export default useDownload;
