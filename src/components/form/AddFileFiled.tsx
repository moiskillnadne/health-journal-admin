/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useFetchMedicationsQuery, useFetchSearchFileQuery } from '../../modules/Gallery/hooks';
import {
  ALLOWED_FILE_FORMAT_MIME_TYPES,
  ALLOWED_FILE_FORMATS,
  FileScheme,
  ONE_MB,
} from '@app/constants';
import { ValidationError } from 'yup';
import AutocompleteInput from '@app/components/AutocompleteInput';
import { useUploadFileMutation } from '../../modules/ContentStorage/hooks';
import { TFile } from '@app/types';
import { useConfirmDialog, useWarningDialog, useInfiniteScroll } from '@app/hooks';
import { CustomFetchBaseQueryError } from '@app/types';

type Props = {
  type?: 'video' | 'image';
  name: string;
  label?: string;
  defaultValue?: unknown;
  placeholder?: string;
};

const AddFileFiled = ({ type = 'video', name, label, defaultValue, placeholder }: Props) => {
  const MAX_FILE_SIZE = type === 'video' ? 100 : 20;

  const { JPEG, PNG, JPG, MP4 } = ALLOWED_FILE_FORMATS;

  const accept = type === 'video' ? '.mp4' : '.jpeg, .png, .jpg';

  const allowedTypes = (type === 'video' ? [MP4] : [JPEG, PNG, JPG]).map(
    type => ALLOWED_FILE_FORMAT_MIME_TYPES[type],
  );
  const [search, setSearch] = useState('');

  const { data: response } = useFetchMedicationsQuery({ page: 1, take: 10, name: '' });

  const { isFetching, loadMore, data } = useInfiniteScroll(useFetchSearchFileQuery, {
    take: 10,
    search: search,
    type,
  });

  const { control } = useFormContext();

  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  });

  const [uploadFile, { isLoading }] = useUploadFileMutation();

  const openWarning = useWarningDialog();
  const openConfirmDialog = useConfirmDialog();

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>, force = false) => {
    const fileList = e.target.files;
    const formData = new FormData();
    if (force) {
      formData.append('force', 'true');
    }
    if (fileList?.length) {
      try {
        FileScheme(MAX_FILE_SIZE, allowedTypes).validateSync(fileList[0]);
        formData.append('files[]', fileList[0]);
        uploadFile({ form: formData, type: type })
          .unwrap()
          .then(files => {
            if (files.length) {
              const { fileName, id } = files[0];
              onChange({ id, label: fileName });
            }
          })
          .catch((err: CustomFetchBaseQueryError) => {
            if (err.data.code === 'VALIDATION_FAILED_DUPLICATE_STORAGE_FILE') {
              const notPostedFilesNames: string[] = err?.data?.details?.notPostedFilesNames;
              const postedFilesNames: string[] = err?.data?.details?.postedFilesNames;

              const errorsMessagePostedFilesNames = `The file ${postedFilesNames[0]} already exists and posted.`;

              const errorsMessageNotPostedFilesNames = `The file ${notPostedFilesNames[0]} already exists.`;

              openConfirmDialog({
                title: 'File already exists',
                description: (
                  <>
                    {postedFilesNames.length ? (
                      <Alert sx={{ my: '20px' }} severity="error">
                        {errorsMessagePostedFilesNames}
                      </Alert>
                    ) : (
                      <>
                        <Alert sx={{ my: '20px' }} severity="warning">
                          {errorsMessageNotPostedFilesNames}
                        </Alert>
                        <Typography color="#3b4364" variant="subtitle1" component="span">
                          Would you like to replace it?
                        </Typography>
                      </>
                    )}
                  </>
                ),
                onConfirm: () => {
                  if (notPostedFilesNames.length) {
                    onUpload(e, true);
                  }
                },
              });
            }
          });
      } catch (err) {
        if (err instanceof ValidationError) {
          openWarning({
            title: err.message,
          });
        }
      }
    }
  };

  const files: TFile[] = data || [];

  const options = useMemo(
    () => files.map(file => ({ id: file.id, label: file.fileName })),
    [files],
  );

  return (
    <Stack flex={1} direction="row" spacing={1}>
      <AutocompleteInput
        label={label}
        name={name}
        value={value || null}
        options={options}
        loadMore={loadMore}
        onChange={onChange}
        onBlur={onBlur}
        onSearch={setSearch}
        isLoading={isLoading}
        placeholder={placeholder}
        error={error?.message}
      />
      <Button
        sx={{ borderRadius: '8px', marginTop: '24px !important', maxHeight: '44px' }}
        variant="contained"
        color="secondary"
        component="label">
        Upload
        <input type="file" accept={accept} hidden onChange={onUpload} />
      </Button>
    </Stack>
  );
};

export default AddFileFiled;
