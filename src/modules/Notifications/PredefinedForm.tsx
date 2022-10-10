import { FormProvider } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';

import { Button, Grid } from '@mui/material';
import { InputField } from '@app/components/form';

import { useAppForm, useUnsavedDataDialog } from '@app/hooks';
import { usePatchPredefinedNotificationMutation } from './hooks';

import { TPredefinedNotificationForm, TPredefinedNotification } from './types';
import { PredefinedNotificationSchema } from './schemas';

import FormTabs from './components/FormTabs';

const PredefinedForm = () => {
  const location = useLocation();
  const editRecord = location.state as TPredefinedNotification;
  const { contentEn, contentSp, name } = editRecord;

  const [update, { isLoading }] = usePatchPredefinedNotificationMutation();

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  const form = useAppForm<TPredefinedNotificationForm>(
    {
      defaultValues: {
        name,
        contentEn,
        contentSp,
      },
    },
    { schema: PredefinedNotificationSchema },
  );

  const {
    handleSubmit,
    formState: { isDirty, touchedFields, isSubmitSuccessful },
  } = form;

  const formTouched = Object.keys(touchedFields).length !== 0;

  useUnsavedDataDialog(isDirty && !isSubmitSuccessful);

  const onSubmit = (isPublished: boolean) => (data: TPredefinedNotificationForm) => {
    const formData = { ...data, isPublished };

    update({
      id: editRecord.id,
      body: formData,
    })
      .unwrap()
      .then(() => goBack());
  };

  const onCancel = () => {
    goBack();
  };

  return (
    <FormProvider {...form}>
      <FormTabs
        title="Edit Predefined Notification"
        english={
          <>
            <Grid item xs={6}>
              <InputField name="name" disabled label="Title" />
            </Grid>
            <Grid item xs={12}>
              <InputField name="contentEn" multiline label="Notification Content*" />
            </Grid>
          </>
        }
        spanish={
          <Grid item xs={12}>
            <InputField name="contentSp" multiline label="Notification Content" />
          </Grid>
        }
        buttons={
          <>
            <Button variant="tertiary" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="tertiary"
              disabled={editRecord.isPublished}
              onClick={handleSubmit(onSubmit(true))}>
              Save & Publish
            </Button>
            <Button
              variant="contained"
              disabled={isLoading || !formTouched}
              onClick={handleSubmit(onSubmit(false))}>
              Save
            </Button>
          </>
        }
      />
    </FormProvider>
  );
};

export default PredefinedForm;
