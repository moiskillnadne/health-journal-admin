import { SerializedError } from '@reduxjs/toolkit';

import { CustomFetchBaseQueryError, TOption } from '@app/types';
import moment from 'moment';
import { ONE_MB } from '@app/constants';

export function avatarByName(name: string) {
  return {
    sx: {
      backgroundColor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}
export function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

type TimerOptions = {
  onFinish?: () => void;
  onChange?: (seconds: number) => void;
};

export function Timer(seconds = 0, { onFinish, onChange }: TimerOptions = {}) {
  let currentSeconds = seconds;
  let timerId: NodeJS.Timer;

  function start() {
    timerId = setInterval(() => {
      if (currentSeconds) {
        currentSeconds = currentSeconds - 1;
        onChange && onChange(currentSeconds);
      } else {
        stop();
        onFinish && onFinish();
      }
    }, 1000);
  }

  function stop() {
    clearInterval(timerId);
  }

  function reset(second?: number) {
    stop();
    currentSeconds = second || seconds;
    onChange && onChange(currentSeconds);
    start();
  }

  return {
    start,
    stop,
    reset,
  };
}

export function isInvalidCredentialsError(error: CustomFetchBaseQueryError | SerializedError) {
  return 'data' in error && error.data.code === 'INVALID_USER_CREDENTIALS';
}
export const formatDate = (dateString: string) => {
  const day = 86400000;
  const date = moment(dateString);
  const diff = moment().diff(date);
  return diff > 0 && diff < day ? date.fromNow() : date.format('MMMM DD, YYYY');
};

export const getBase64 = (file: Blob): Promise<string> => {
  return new Promise(resolve => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = String(reader?.result) || '';
      resolve(result);
    };
  });
};

export const deleteNullCase = (obj: { [key: string]: string }) => {
  const result: { [key: string]: string } = {};
  for (const key in obj) {
    if (obj[key] != null) {
      result[key] = obj[key];
    }
  }
  return result;
};

export const getIds = (opt: TOption): string => opt.id;

export const formatDataSize = (size: number) => `${(size / ONE_MB).toFixed(2)} mb`;

export const transformToOptions = (id: string, label: string) => (el: { [x: string]: string }) => ({
  id: el[id],
  label: el[label],
});

export const trimHTMLTags = (value: string): string => {
  const regex = /(<([^>]+)>)/gi;
  const result = value.replace(regex, '');
  return result;
};
