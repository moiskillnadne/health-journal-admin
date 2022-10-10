import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {
  Alert,
  List,
  ListItemButton,
  ListItemIcon,
  Stack,
  SvgIcon,
  TextField,
  LinearProgress,
} from '@mui/material';
import { ReactComponent as AddIcon } from '@assets/icons/ic-add.svg';
import { ReactComponent as CloseIcon } from '@assets/icons/ic-close.svg';
import { useState, ChangeEvent, useRef, useEffect, useCallback } from 'react';
import { useUploadFileMutation } from './hooks';
import {
  ALLOWED_FILE_FORMAT_MIME_TYPES,
  ALLOWED_FILE_FORMATS,
  FileScheme,
  ONE_MB,
} from '@app/constants';
import { ValidationError } from 'yup';
import { CustomFetchBaseQueryError } from '@app/types';
import { useConfirmDialog } from '@app/hooks';

const DUPLICATE_STORAGE_FILE_ERROR = 'VALIDATION_FAILED_DUPLICATE_STORAGE_FILE';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 428,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: '20px 24px',
};

type Props = {
  type: 'video' | 'image';
  onUpload: () => void;
};

const isJPG = (fileName: string) => fileName.includes('jpg') || fileName.includes('jpeg');

const UploadFile = (props: Props) => {
  const MAX_FILE_SIZE = props.type === 'video' ? 100 : 20;

  const { JPEG, PNG, JPG, MP4 } = ALLOWED_FILE_FORMATS;

  const accept = props.type === 'video' ? '.mp4' : '.jpeg, .png, .jpg';

  const allowedTypes = (props.type === 'video' ? [MP4] : [JPEG, PNG, JPG]).map(
    type => ALLOWED_FILE_FORMAT_MIME_TYPES[type],
  );

  const fileInput = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [showUpload, setShowUpload] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<any | string | undefined>();
  const openConfirmDialog = useConfirmDialog();

  const isIncludeFile = (file: File) => {
    return files.map(f => f.name).includes(file.name);
  };

  const onShowUpload = () => {
    setError(null);
    setShowUpload(true);
  };

  const onCloseUpload = () => {
    setShowUpload(false);
    setFiles([]);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files?.length) {
      const arrFiles = [].map.call(files, (file: File) => file);

      arrFiles.forEach(file => {
        try {
          if (!isIncludeFile(file as File)) {
            FileScheme(MAX_FILE_SIZE, allowedTypes).validateSync(file);
            setFiles(state => [...state, file as File]);
          }
        } catch (err) {
          if (err instanceof ValidationError) {
            setError(`${err.message}`);
          }
        }
      });
    }
  };

  const onDeleteFile = (index: number) => {
    setFiles(state => state.filter((_, i) => index !== i));
  };

  const [
    uploadFile,
    {
      isLoading,
      error: uploadingError,
      isSuccess: isSuccessfullyUploaded,
      reset: resetUploadingState,
    },
  ] = useUploadFileMutation();

  const prepareFormData = useCallback((files: File[], force?: boolean) => {
    const formData = new FormData();

    force && formData.append('force', 'true');
    files.forEach(file => formData.append('files[]', file));

    return formData;
  }, []);

  const upload = useCallback(
    (data: FormData) => {
      return uploadFile({ form: data, type: props.type });
    },
    [props.type, uploadFile],
  );

  const onSubmit = useCallback(() => {
    upload(prepareFormData(files));
  }, [files, upload, prepareFormData]);

  useEffect(() => {
    if (isSuccessfullyUploaded) {
      setFiles([]);
      setError(null);
      setShowUpload(false);
    }
  }, [isSuccessfullyUploaded]);

  useEffect(() => {
    if (uploadingError && files.length) {
      const err = uploadingError as CustomFetchBaseQueryError;

      if (err?.data?.code === DUPLICATE_STORAGE_FILE_ERROR) {
        const notPostedFilesNames: string[] = err?.data?.details?.notPostedFilesNames;
        const postedFilesNames: string[] = err?.data?.details?.postedFilesNames;

        const errorsMessagePostedFilesNames =
          postedFilesNames?.length === 1
            ? `The file ${postedFilesNames[0]} already exists and posted.`
            : `The files ${postedFilesNames.join(', ')} already exist and posted.`;

        const errorsMessageNotPostedFilesNames =
          notPostedFilesNames?.length === 1
            ? `The file ${notPostedFilesNames[0]} already exists.`
            : `The files ${notPostedFilesNames.join(', ')} already exist.`;

        setShowUpload(false);

        openConfirmDialog({
          title: 'File already exists',
          description: (
            <>
              {!!postedFilesNames.length && (
                <Alert sx={{ my: '20px' }} severity="error">
                  {errorsMessagePostedFilesNames}
                </Alert>
              )}
              {!!notPostedFilesNames.length && (
                <Alert sx={{ my: '20px' }} severity="warning">
                  {errorsMessageNotPostedFilesNames}
                </Alert>
              )}
              <Typography color="#3b4364" variant="subtitle1" component="span">
                Would you like to replace it?
              </Typography>
            </>
          ),
          onConfirm: () => {
            const reSendFiles = files.filter(({ name }) => !postedFilesNames.includes(name));
            setError(errorsMessagePostedFilesNames);
            upload(prepareFormData(reSendFiles, true));
          },
        }).catch(e => {
          const reSendFiles = files.filter(({ name }) => {
            if (isJPG(name)) {
              const replace = (name: string) => name.replace(/\.(jpg|jpeg)/, '');

              const fileName = replace(name);

              return ![...postedFilesNames, ...notPostedFilesNames].map(replace).includes(fileName);
            }

            return ![...postedFilesNames, ...notPostedFilesNames].includes(name);
          });
          if (reSendFiles.length) {
            upload(prepareFormData(reSendFiles, true));
          } else {
            setError(null);
            setFiles([]);
            resetUploadingState();
          }
        });
      } else {
        setError(error === null ? 'Internal server error' : error);
      }
    }
  }, [error, files, openConfirmDialog, upload, uploadingError]);

  useEffect(() => {
    if (!showUpload) {
      setError(null);
    }
  }, [showUpload]);

  useEffect(() => {
    if (files?.length === 1) {
      fileInput.current.value = files[0].name;
    } else if (files?.length) {
      fileInput.current.value = `files  ${files?.length}`;
    } else if (fileInput.current) {
      fileInput.current.value = '';
    }
  }, [files]);

  return (
    <>
      <Button
        onClick={onShowUpload}
        startIcon={<SvgIcon component={AddIcon} />}
        variant="contained"
        color="secondary">
        add
      </Button>
      <Modal
        key="upload"
        open={showUpload}
        onClose={onCloseUpload}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" sx={{ mb: '20px' }} variant="h6" component="h2">
            Add File
          </Typography>
          <Typography id="modal-modal-title" sx={{ mb: '5px' }} variant="subtitle1" component="h6">
            Select Files*
          </Typography>
          <Stack sx={{ flexDirection: 'row' }}>
            <TextField
              inputRef={fileInput}
              disabled
              sx={{
                flex: 1,
                py: '0px',
                '.MuiInputBase-root': {
                  mr: '10px',
                  pl: '10px',
                },
                '.MuiInputBase-input': {
                  padding: '8.5px 14px 8.5px  0px',
                },
              }}
            />
            <Button
              sx={{ borderRadius: '8px' }}
              variant="contained"
              color="secondary"
              component="label">
              Choose
              <input accept={accept} multiple onChange={onChange} type="file" hidden />
            </Button>
          </Stack>
          {error && (
            <Alert sx={{ mt: '20px' }} severity="error">
              {error}
            </Alert>
          )}
          <List sx={{ maxHeight: '300px', overflow: 'auto', mt: '16px' }}>
            {files?.map((file, i) => {
              return (
                <ListItemButton
                  key={file.name}
                  sx={{ wordWrap: 'break-word', overflowWrap: 'anywhere' }}
                  onClick={() => onDeleteFile(i)}>
                  <ListItemIcon>
                    <CloseIcon />
                  </ListItemIcon>
                  {file.name}
                  {'  '}({(file.size / ONE_MB).toFixed(2)} mb)
                </ListItemButton>
              );
            })}
          </List>
          <Box sx={{ mt: '36px' }}>
            {isLoading && <LinearProgress />}
            <Box
              flexDirection={'row'}
              sx={{
                justifyContent: 'flex-end',
                display: 'flex',
                mt: '8px',
              }}>
              <Button
                variant="tertiary"
                sx={{ borderRadius: '8px', mr: '10px' }}
                onClick={onCloseUpload}>
                Close
              </Button>
              <Button
                variant="contained"
                disabled={isLoading || !files.length}
                sx={{ borderRadius: '8px' }}
                onClick={() => onSubmit()}>
                Upload
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default UploadFile;
