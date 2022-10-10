import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';

import { Tab, Box, Grid, Button, Stack } from '@mui/material';
import { TabContext, TabList } from '@mui/lab';
import { useAppForm, useScrollToError, useUnsavedDataDialog } from '@app/hooks';
import { InputField, MultipleTagField, TextEditorField } from '@app/components/form';

import AddFileFiled from '@app/components/form/AddFileFiled';
import TabPanel from './components/TabPanel';

import { usePatchGalleryRecipeMutation, useAddGalleryRecipeMutation } from './hooks';
import { TRecipeSchemaForm, TRecipe } from './types';
import { RecipeSchema } from './schemas';

const AddRecipe = () => {
  const location = useLocation();
  const editRecord = location.state as TRecipeSchemaForm;

  let defaultValues = {};

  if (editRecord) {
    const { image, ...other } = editRecord;

    defaultValues = {
      ...other,
      imageId: image && {
        id: image.id,
        label: image.fileName,
      },
    };
  }

  const [type, setTab] = useState<'english' | 'spanish'>('english');

  const [editRecipe] = usePatchGalleryRecipeMutation();

  const [addRecipe] = useAddGalleryRecipeMutation();
  const navigate = useNavigate();

  const form = useAppForm<TRecipeSchemaForm>(
    {
      defaultValues: {
        textEn: '',
        textSp: '',
        ...defaultValues,
      },
    },
    { schema: RecipeSchema },
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
    const { imageId, ...other } = getValues();

    const formData: TRecipe = {
      ...other,
      imageId: imageId?.id as string,
      isPublished,
    };

    if (editRecord) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      editRecipe({ id: editRecord.id as string, body: formData })
        .unwrap()
        .then(() => {
          goBack();
        });
      return;
    }
    addRecipe(formData)
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

  const title = (editRecord ? 'Edit' : 'Add') + ' Recipe';

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

export default AddRecipe;
