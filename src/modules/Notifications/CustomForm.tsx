import { useState, useMemo } from 'react';
import { FormProvider } from 'react-hook-form';
import { useAppForm, useUnsavedDataDialog } from '@app/hooks';

import { TCustomNotificationForm, TCustomNotification } from './types';
import { CustomNotificationSchema } from './schemas';

import FormTabs from './components/FormTabs';
import {
  Button,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  FormControl,
} from '@mui/material';

import { useFetchTargetGroupQuery } from '../Tracks/hooks';
import {
  useAddCustomNotificationMutation,
  usePatchCustomNotificationMutation,
  useFetchGalleryLinkOptionsQuery,
} from './hooks';

import { AutocompleteField, InputField, DatePickerField } from '@app/components/form';
import AddFileFiled from '@app/components/form/AddFileFiled';
import { useLocation, useNavigate } from 'react-router-dom';
import { getIds } from '@app/utils';
import moment from 'moment';

const CustomForm = () => {
  const location = useLocation();
  const editRecord = location.state as TCustomNotification;

  const defaultValues = useMemo(() => {
    if (editRecord) {
      const { link: dirtyLink, image = null, targetGroups, ...other } = editRecord;
      let link = null;

      if (dirtyLink) {
        const linkType =
          dirtyLink.type === 'video'
            ? dirtyLink.value?.type === 'regular'
              ? 'video'
              : 'food video'
            : dirtyLink.type;

        link = {
          id: dirtyLink.value.id,
          label: `${dirtyLink.value.titleEn} (${linkType})`,
        };
      }

      return {
        ...other,
        targetGroups: targetGroups.map((el: { id: string; title: string }) => ({
          id: el.id,
          label: el?.title,
        })),
        image: image && {
          id: image.id,
          label: image.fileName,
        },
        link,
      };
    }
    return {};
  }, [editRecord]);

  const [linkSearch, setLinkSearch] = useState<string>('');

  const { data = [] } = useFetchTargetGroupQuery({});
  const { data: linkList = [] } = useFetchGalleryLinkOptionsQuery(
    { search: linkSearch },
    { refetchOnMountOrArgChange: true },
  );

  const [addCustomNotification, { isLoading }] = useAddCustomNotificationMutation();

  const [editCustomNotification, { isLoading: isLoadingEdit }] =
    usePatchCustomNotificationMutation();

  const navigate = useNavigate();

  const goBack = () => {
    navigate('../', { state: 'custom' });
  };

  const form = useAppForm<TCustomNotificationForm>(
    {
      defaultValues: {
        sending_date: 'now',
        ...defaultValues,
      },
    },
    { schema: CustomNotificationSchema },
  );

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty, isSubmitSuccessful },
  } = form;

  useUnsavedDataDialog(isDirty && !isSubmitSuccessful);

  const onSubmit = (isPublished: boolean) => (data: TCustomNotificationForm) => {
    const { image, link, targetGroups, sending_date, ...other } = data;

    let linkFinal = null;

    if (link?.id) {
      const linkType = link?.label?.split(' ')?.pop()?.replace(/[()]/g, '');
      linkFinal = {
        linkId: link.id,
        type: linkType?.split(' ')?.pop() as string,
      };
    }
    const formData = {
      ...other,
      link: linkFinal,
      imageId: image?.id ?? null,
      targetGroups: targetGroups?.map(getIds),
      isPublished,
      sending_date:
        sending_date === 'now' ? 'now' : moment(sending_date as string).format('YYYY-MM-DD'),
    };

    if (editRecord) {
      editCustomNotification({ id: editRecord.id, body: formData })
        .unwrap()
        .then(() => {
          goBack();
        });
      return;
    }
    addCustomNotification(formData)
      .unwrap()
      .then(() => goBack());
  };

  const onCancel = () => {
    goBack();
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const sending_date = watch('sending_date');
  const disabledDatePicker = sending_date === 'now';

  const title = editRecord ? 'Edit Custom Notification' : 'Add Custom Notification';

  return (
    <FormProvider {...form}>
      <FormTabs
        title={title}
        english={
          <>
            <Grid item xs={6}>
              <AddFileFiled type="image" name="image" label="Image" />
            </Grid>
            <Grid item xs={6}>
              <InputField name="name" label="Name*" />
            </Grid>
            <Grid item xs={6}>
              <AutocompleteField
                label="Target Groups*"
                name="targetGroups"
                multiple
                options={data}
              />
            </Grid>
            <Grid item xs={6}>
              <AutocompleteField
                label="Link"
                name="link"
                onSearch={setLinkSearch}
                options={linkList || []}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ mb: '8px' }}>
                <FormLabel sx={{ color: '#333333 !important', fontWeight: 600 }}>
                  Sending Date*
                </FormLabel>
                <RadioGroup
                  row
                  defaultValue={sending_date === 'now' ? 'now' : 'picker'}
                  onChange={(e, val) => {
                    setValue('sending_date', val === 'now' ? 'now' : null);
                  }}>
                  <FormControlLabel value="now" control={<Radio />} label="Now" />
                  <FormControlLabel
                    value="picker"
                    control={<Radio />}
                    label={
                      <DatePickerField
                        disabled={disabledDatePicker}
                        minDate={tomorrow}
                        name="sending_date"
                      />
                    }
                  />
                </RadioGroup>
              </FormControl>
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
              disabled={isLoading || !disabledDatePicker}
              onClick={handleSubmit(onSubmit(true))}>
              Send
            </Button>
            <Button
              variant="contained"
              disabled={isLoading || disabledDatePicker}
              onClick={handleSubmit(onSubmit(false))}>
              Schedule
            </Button>
          </>
        }
      />
    </FormProvider>
  );
};

export default CustomForm;
