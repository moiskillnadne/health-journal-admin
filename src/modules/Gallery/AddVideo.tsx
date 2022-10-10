import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';

import { Tab, Box, Grid, Button, Stack } from '@mui/material';
import { TabContext, TabList } from '@mui/lab';
import { useAppForm, useScrollToError, useUnsavedDataDialog } from '@app/hooks';
import { getIds, transformToOptions } from '@app/utils';

import {
  InputField,
  AutocompleteField,
  MultipleTagField,
  TextEditorField,
} from '@app/components/form';

import MedicationsField from './components/MedicationsField';
import TabPanel from './components/TabPanel';
import AddFileFiled from '@app/components/form/AddFileFiled';

import {
  useFetchTriggersQuery,
  useFetchConditionsQuery,
  useAddGalleryVideoMutation,
  usePatchGalleryVideoMutation,
} from './hooks';

import { TVideoSchemaForm } from './types';
import { VideoSchema } from './schemas';

type Props = {
  typeVideo: 'regular' | 'food';
};

const AddVideo = ({ typeVideo }: Props) => {
  const location = useLocation();
  const editRecord = location.state as TVideoSchemaForm;

  let defaultValues = {};

  if (editRecord) {
    const { conditions, medications, triggers, video, videoPreview, ...other } = editRecord;
    defaultValues = {
      ...other,
      conditions: conditions?.map(transformToOptions('id', 'name')),
      medications: medications?.map(transformToOptions('productId', 'name')) || [],
      triggers: triggers?.map(transformToOptions('id', 'shortName')),
      videoId: video && {
        id: video?.id,
        label: video?.fileName,
      },
      videoPreviewId: videoPreview && {
        id: videoPreview?.id,
        label: videoPreview?.fileName,
      },
    };
  }

  const [type, setTab] = useState<'english' | 'spanish'>('english');

  const [addVideo] = useAddGalleryVideoMutation();
  const [editVideo] = usePatchGalleryVideoMutation();

  const navigate = useNavigate();
  const { data: triggerOptions = [] } = useFetchTriggersQuery({});
  const { data: conditionsOptions = [] } = useFetchConditionsQuery({});

  const { pathname } = useLocation();

  const form = useAppForm<TVideoSchemaForm>(
    {
      defaultValues: {
        descriptionEn: '',
        descriptionSp: '',
        medications: [],
        ...defaultValues,
      },
    },
    { schema: VideoSchema },
  );

  const {
    getValues,
    handleSubmit,
    formState: { errors, dirtyFields },
    formState,
  } = form;
  useScrollToError(errors);
  const isDirty = !!Object.keys(dirtyFields).length;

  useUnsavedDataDialog(isDirty && !formState.isSubmitSuccessful);

  const title =
    (editRecord ? 'Edit' : 'Add') + (pathname.includes('food') ? ' Food Video' : ' Video');

  const goBack = () => {
    navigate(-1);
  };

  const onSubmit = (isPublished: boolean) => () => {
    const { conditions, medications, triggers, videoId, videoPreviewId, ...other } = getValues();
    const formData = {
      ...other,
      conditions: conditions?.map(getIds),
      medications: medications?.map(getIds),
      triggers: triggers?.map(getIds),
      videoId: videoId?.id,
      videoPreviewId: videoPreviewId?.id,
      isPublished,
      type: typeVideo,
    };
    if (editRecord) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      editVideo({ id: editRecord.id as string, body: formData })
        .unwrap()
        .then(() => {
          goBack();
        });
      return;
    }
    addVideo(formData)
      .unwrap()
      .then(() => {
        goBack();
      });
  };

  const onCancel = () => {
    goBack();
  };

  const changeType = (event: React.SyntheticEvent, newValue: 'english' | 'spanish') => {
    setTab(newValue);
  };

  return (
    <TabContext value={type}>
      <Box sx={{ borderBottom: 1, borderColor: 'transparent' }}>
        <TabList
          TabIndicatorProps={{
            style: { height: '0px' },
          }}
          onChange={changeType}>
          <Tab label="English" value="english" />
          <Tab label="Spanish" value="spanish" />
        </TabList>
        <FormProvider {...form}>
          <TabPanel title={title} value="english">
            <Grid container alignContent={'flex-start'} spacing={'20px'}>
              <Grid item xs={6}>
                <AddFileFiled type="video" name="videoId" label="Video*" />
              </Grid>
              <Grid item xs={6}>
                <AddFileFiled type="image" name="videoPreviewId" label="VideoPreview*" />
              </Grid>
              <Grid item xs={6}>
                <InputField name="titleEn" label="Title*" />
              </Grid>
              <Grid item xs={6} />
              <Grid item xs={6}>
                <AutocompleteField
                  label="Conditions"
                  options={conditionsOptions}
                  multiple
                  placeholder="Choose Condition"
                  name="conditions"
                />
              </Grid>
              <Grid item xs={6}>
                <MedicationsField
                  label="Medications"
                  placeholder="Choose Medications"
                  name="medications"
                />
              </Grid>
              <Grid item xs={6}>
                <AutocompleteField
                  label="Triggers"
                  options={triggerOptions}
                  multiple
                  placeholder="Choose Triggers"
                  name="triggers"
                />
              </Grid>
              <Grid item xs={6} />
              <Grid item xs={6}>
                <MultipleTagField label="Key words*" name="keywordsEn" />
              </Grid>
              <Grid item xs={12}>
                <TextEditorField
                  label="Description"
                  name="descriptionEn"
                  toolbarOptions={['inline', 'list', 'remove', 'link']}
                />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value="spanish" title={title}>
            <Grid container alignContent={'flex-start'} spacing={'20px'}>
              <Grid item xs={6}>
                <InputField label="Title" name="titleSp" />
              </Grid>
              <Grid item xs={6} />
              <Grid item xs={6}>
                <MultipleTagField label="Key words" name="keywordsSp" />
              </Grid>
              <Grid item xs={12}>
                <TextEditorField
                  label="Description"
                  name="descriptionSp"
                  toolbarOptions={['inline', 'list', 'remove', 'link']}
                />
              </Grid>
            </Grid>
          </TabPanel>
        </FormProvider>
        <Box sx={{ backgroundColor: '#ffffff', pb: '20px' }}>
          <Stack
            sx={{
              maxWidth: '816px',
            }}
            direction="row"
            justifyContent={'end'}
            spacing={'16px'}>
            <Button variant="tertiary" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="tertiary" disabled={!isDirty} onClick={handleSubmit(onSubmit(true))}>
              Save & Publish
            </Button>
            <Button variant="contained" disabled={!isDirty} onClick={handleSubmit(onSubmit(false))}>
              Save
            </Button>
          </Stack>
        </Box>
      </Box>
    </TabContext>
  );
};

export default AddVideo;
