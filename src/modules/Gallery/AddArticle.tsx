import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

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
  useAddGalleryArticleMutation,
  usePatchGalleryArticleMutation,
} from './hooks';

import { TArticleSchemaForm } from './types';
import { ArticleSchema } from './schemas';

const AddArticle = () => {
  const location = useLocation();
  const editRecord = location.state as TArticleSchemaForm;

  let defaultValues = {};

  if (editRecord) {
    const { conditions, medications, triggers, image, ...other } = editRecord;

    defaultValues = {
      ...other,
      conditions: conditions?.map(transformToOptions('id', 'name')),
      medications: medications?.map(transformToOptions('productId', 'name')) || [],
      triggers: triggers?.map(transformToOptions('id', 'shortName')),
      imageId: image && {
        id: image.id,
        label: image.fileName,
      },
    };
  }

  const [type, setTab] = useState<'english' | 'spanish'>('english');

  const [editArticle] = usePatchGalleryArticleMutation();
  const [addArticle] = useAddGalleryArticleMutation();
  const navigate = useNavigate();

  const { data: triggerOptions = [] } = useFetchTriggersQuery({});
  const { data: conditionsOptions = [] } = useFetchConditionsQuery({});

  const form = useAppForm<TArticleSchemaForm>(
    {
      defaultValues: {
        textEn: '',
        textSp: '',
        medications: [],
        ...defaultValues,
      },
    },
    { schema: ArticleSchema },
  );

  const {
    getValues,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitSuccessful },
  } = form;

  const isDirty = !!Object.keys(dirtyFields).length;

  useUnsavedDataDialog(isDirty && !isSubmitSuccessful);

  useScrollToError(errors);

  const goBack = () => {
    navigate(-1);
  };

  const onSubmit = (isPublished: boolean) => () => {
    const { conditions, medications, triggers, imageId, ...other } = getValues();

    const formData = {
      ...other,
      conditions: conditions?.map(getIds),
      medications: medications?.map(getIds),
      triggers: triggers?.map(getIds),
      imageId: imageId?.id as string,
      isPublished,
    };

    if (editRecord) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      editArticle({ id: editRecord.id as string, body: formData })
        .unwrap()
        .then(() => {
          goBack();
        });
      return;
    }
    addArticle(formData)
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
  const title = (editRecord ? 'Edit' : 'Add') + ' Article';
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
          <TabPanel value="english" title={title}>
            <Grid container alignContent={'flex-start'} spacing={'20px'}>
              <Grid item xs={6}>
                <AddFileFiled type="image" name="imageId" label="Image*" />
              </Grid>
              <Grid item xs={6}>
                <InputField name="titleEn" label="Title*" />
              </Grid>
              <Grid item xs={12}>
                <InputField multiline name="summaryEn" label="Summary*" />
              </Grid>
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
                  label="Text*"
                  name="textEn"
                  toolbarOptions={['inline', 'list', 'remove', 'image', 'link']}
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
              <Grid item xs={12}>
                <InputField multiline name="summarySp" label="Summary" />
              </Grid>
              <Grid item xs={6}>
                <MultipleTagField label="Key words" name="keywordsSp" />
              </Grid>
              <Grid item xs={12}>
                <TextEditorField
                  label="Text"
                  name="textSp"
                  toolbarOptions={['inline', 'list', 'remove', 'image', 'link']}
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

export default AddArticle;
