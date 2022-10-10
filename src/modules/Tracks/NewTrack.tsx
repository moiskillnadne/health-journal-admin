import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';

import { Box, Button, Tab, Grid, Stack } from '@mui/material';
import { TabContext, TabList } from '@mui/lab';

import { useAppForm, useUnsavedDataDialog } from '@app/hooks';
import { useFetchTargetGroupQuery, useAddTrackMutation, usePatchTracksMutation } from './hooks';

import { TrackSchema } from './schemas';
import { TTrackSchemaForm, TTrackLineForm } from './types';

import { AutocompleteField, InputField } from '@app/components/form';
import TabPanel from './components/TabPanel';
import GroupFields from './components/GroupFields';

import { getIds } from '@app/utils';

const NewTrack = () => {
  const location = useLocation();

  const editRecord = location.state as TTrackSchemaForm;

  const { data } = useFetchTargetGroupQuery({});

  const [addTrack, { isLoading }] = useAddTrackMutation();

  const [editTrack, { isLoading: isEditLoading }] = usePatchTracksMutation();

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const [type, setTab] = useState<'english' | 'spanish'>('english');

  const changeType = (event: React.SyntheticEvent, newValue: 'english' | 'spanish') => {
    setTab(newValue);
  };

  let defaultValues = {};

  if (editRecord) {
    const { targetGroups, groups, ...other } = editRecord;

    defaultValues = {
      ...other,
      targetGroups: targetGroups.map((el: { id: string; title: string }) => ({
        id: el.id,
        label: el?.title,
      })),
      groups: groups?.map(({ lines, ...other }) => ({
        ...other,
        lines: lines?.map(({ video, recipe, article, ...other }) => ({
          video: video ?? null,
          recipe: recipe ?? null,
          article: article ?? null,
          ...other,
        })),
      })),
    };
  }

  const form = useAppForm<TTrackSchemaForm>(
    {
      defaultValues: {
        groups: [
          {
            order: 1,
          },
        ],
        ...defaultValues,
      },
    },
    { schema: TrackSchema },
  );

  const {
    handleSubmit,
    formState: { isDirty, touchedFields, isSubmitSuccessful },
  } = form;

  useUnsavedDataDialog(isDirty && !isSubmitSuccessful);

  const formTouched = Object.keys(touchedFields).length !== 0;

  const onSubmit = (isPublished: boolean) => (data: TTrackSchemaForm) => {
    const lineTransform = (el: TTrackLineForm, index: number) => {
      const { video, article, recipe } = el;

      return { ...el, order: ++index, recipe: recipe?.id, video: video?.id, article: article?.id };
    };

    const formData = {
      ...data,
      targetGroups: data?.targetGroups?.map(getIds),
      groups: data?.groups?.map(group => ({
        ...group,
        lines: group?.lines.map(lineTransform),
      })),
      isPublished,
    };

    if (editRecord) {
      editTrack({ id: editRecord.id as string, body: formData })
        .unwrap()
        .then(data => {
          goBack();
        });
      return;
    }

    addTrack(formData)
      .unwrap()
      .then(data => {
        goBack();
      });
  };

  const onCancel = () => {
    goBack();
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
          <TabPanel value="english" title="General">
            <Grid container alignContent={'flex-start'} spacing={'20px'} sx={{ maxWidth: '816px' }}>
              <Grid item xs={6}>
                <InputField name="titleEn" label="Track Title*" />
              </Grid>
              <Grid item xs={6}>
                <AutocompleteField
                  label="Target Groups*"
                  name="targetGroups"
                  multiple
                  options={data || []}
                />
              </Grid>
            </Grid>
            <GroupFields />
          </TabPanel>
          <TabPanel value="spanish" title="General">
            <Grid container alignContent={'flex-start'} spacing={'20px'}>
              <Grid item xs={6}>
                <InputField name="titleSp" label="Title" />
              </Grid>
            </Grid>
          </TabPanel>
        </FormProvider>
        <Box sx={{ backgroundColor: '#ffffff', pb: '20px' }}>
          <Stack sx={{ px: '16px' }} direction="row" justifyContent={'end'} spacing={'16px'}>
            <Button variant="tertiary" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="tertiary"
              disabled={isLoading || !isDirty || editRecord?.isPublished}
              onClick={handleSubmit(onSubmit(true))}>
              Save & Publish
            </Button>
            <Button
              variant="contained"
              disabled={isLoading || !isDirty}
              onClick={handleSubmit(onSubmit(editRecord?.isPublished || false))}>
              Submit
            </Button>
          </Stack>
        </Box>
      </Box>
    </TabContext>
  );
};

export default NewTrack;
