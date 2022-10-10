import { Label } from '@mui/icons-material';
import KeyMirror from 'keymirror';
import { object, string, number } from 'yup';

export const ALLOWED_FILE_FORMATS = KeyMirror({
  JPG: null,
  JPEG: null,
  PNG: null,
  MP4: null,
  OTHER: null,
});

export const ALLOWED_FILE_FORMAT_MIME_TYPES = {
  [ALLOWED_FILE_FORMATS.JPG]: 'image/jpeg',
  [ALLOWED_FILE_FORMATS.JPEG]: 'image/jpeg',
  [ALLOWED_FILE_FORMATS.PNG]: 'image/png',
  [ALLOWED_FILE_FORMATS.MP4]: 'video/mp4',
  [ALLOWED_FILE_FORMATS.OTHER]: null,
};

export const ONE_MB = 1024 * 1024;

export const FileScheme = (maxMB: number, allowedTypes: Array<string>) =>
  object({
    name: string().required(),
    size: number().test({
      name: 'maxSize',
      message: `The maximum file size for uploads is ${maxMB} MB`,
      test(value = 0) {
        return value <= maxMB;
      },
    }),
    type: string().test({
      name: 'allowedTypes',
      message: 'The selected format is not allowed',
      test(value = '') {
        return allowedTypes.includes(value);
      },
    }),
  }).transform((_, value: File) => ({
    name: value?.name,
    size: value ? value.size / ONE_MB : 0,
    type: value?.type,
  }));

export const TrackSheduleOptions = [
  {
    label: 'Daily',
    value: 'daily',
  },
  {
    label: 'Every other day',
    value: 'every_other_day',
  },
  {
    label: 'Once per 3 days',
    value: 'once_per_3_days',
  },
  {
    label: 'Once per 7 days',
    value: 'once_per_7_days',
  },
  {
    label: 'Once per 14 days',
    value: 'once_per_14_days',
  },
  {
    label: 'Once per 30 days',
    value: 'once_per_30_days',
  },
];

export const ROLE_SUPER_ADMIN = 'super_admin';

export const ROLE_CONTENT_MANAGER = 'content_manager';

export const BLOCKED_ROLE_ROUTE = {
  [ROLE_CONTENT_MANAGER]: [
    'edit-predefined-notification',
    'edit-custom-notification',
    'analytics',
    'admin-users',
  ],
  [ROLE_SUPER_ADMIN]: [] as string[],
};
