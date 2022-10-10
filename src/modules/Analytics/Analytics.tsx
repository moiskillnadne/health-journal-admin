import DataTable from '@app/components/DataTable';
import { useAppForm, useWarningDialog } from '@app/hooks';
import {
  Box,
  FormControl,
  Grid,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Button,
} from '@mui/material';
import { format } from 'date-fns';
import { FormProvider } from 'react-hook-form';
import { GridColDef } from '@mui/x-data-grid';
import { TAnalyticsForm } from './types';
import { AnalyticsSchema } from './schemas';

import { useState } from 'react';
import DatePicker from '@app/components/form/DatePickerField';
import { InputField } from '@app/components/form';
import useDownload from './useDownload';

const AnalyticsRow = [
  {
    id: 'dateOfBirth',
    label: 'Age',
  },
  {
    id: 'gender',
    label: 'Gender',
  },
  {
    id: 'race',
    label: 'Race',
  },
  {
    id: 'location',
    label: 'Location',
  },
  {
    id: 'chronic_diseases',
    label: 'Chronic Diseases',
  },
  {
    id: 'medications',
    label: 'Medications',
  },
  {
    id: 'blood_pressure',
    label: 'Blood Pressure',
  },
  {
    id: 'weight',
    label: 'Weight',
  },
  {
    id: 'ldl',
    label: 'LDL',
  },
  {
    id: 'blood_sugar_after_meal',
    label: 'Blood Sugar After Meal',
  },
  {
    id: 'hba1c',
    label: 'HbA1c',
  },
  {
    id: 'triglyceride',
    label: 'Triglycerides',
  },
  {
    id: 'expectations',
    label: 'Expectations',
  },
  {
    id: 'doctor_appointments',
    label: 'Doctors Appointment',
  },
  {
    id: 'procedures',
    label: 'Procedures',
  },
];

const formatDate = (value: Date) => format(value, "Y-MM-dd'T'HH:mm:ss");

const Analytics = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>(AnalyticsRow.map(({ id }) => id));
  const [radioValue, setRadioValue] = useState<string>('allUsers');
  const openWarningDialog = useWarningDialog();
  const download = useDownload();
  const columns: GridColDef[] = [
    {
      field: 'label',
      headerName: 'Report Data',
      headerAlign: 'left',
      align: 'left',
      flex: 1,
      sortable: false,
    },
  ];

  const form = useAppForm<TAnalyticsForm>(
    {
      defaultValues: {},
    },
    { schema: AnalyticsSchema },
  );
  const onSubmit = (data: TAnalyticsForm) => {
    const params = new URLSearchParams();

    (Object.keys(data) as (keyof typeof data)[]).forEach(k => {
      const value = data[k];

      if (value != null) {
        if (value instanceof Date) {
          params.append(k, formatDate(value));
        } else {
          params.append(k, value);
        }
      }
    });

    params.append('reports', selectedRows.join());
    params.append('userLocalDate', formatDate(new Date()));

    download(params.toString()).catch(e => {
      openWarningDialog({
        title: e,
      });
    });
  };

  const { handleSubmit, watch } = form;

  const endDate = watch('signedup_to') || new Date();

  const gorizontalLabelStyle = { lineHeight: '40px', mr: '9px', color: '#333333', fontWeight: 600 };

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        p: '16px',
      }}>
      <Typography variant="h5" sx={{ mb: '20px' }} component="h2">
        Generate Report
      </Typography>
      <Box sx={{ height: '421px', display: 'flex', mb: '20px' }}>
        <DataTable
          hideFooter
          hasCheckboxSelection
          selectionModel={selectedRows}
          rows={AnalyticsRow}
          columns={columns}
          onSelectionModelChange={ids => setSelectedRows(ids as string[])}
        />
      </Box>
      <FormProvider {...form}>
        <Grid container alignContent={'flex-start'} sx={{ maxWidth: '900px' }} spacing={'20px'}>
          <Grid item lg={4} sm={6} xs={12}>
            <DatePicker name="report_date" maxDate={new Date()} label="Select Date for Report" />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              mb: '-10px',
              fontWeight: 600,
            }}>
            Users signed up between
          </Grid>
          <Grid item sx={{ p: '0px !important' }} xs={12}></Grid>
          <Grid item sx={{ display: 'flex' }} lg={4} sm={6} xs={6}>
            <FormLabel sx={gorizontalLabelStyle}>From</FormLabel>
            <DatePicker name="signedup_from" disableFuture maxDate={endDate} />
          </Grid>
          <Grid item sx={{ display: 'flex' }} lg={4} sm={6} xs={6}>
            <FormLabel sx={gorizontalLabelStyle}>To</FormLabel>
            <DatePicker name="signedup_to" maxDate={new Date()} />
          </Grid>
          <Grid item xs={12}>
            <FormControl sx={{ mb: '8px' }}>
              <RadioGroup defaultValue="allUsers" onChange={(e, val) => setRadioValue(val)}>
                <FormControlLabel
                  value="allUsers"
                  sx={{ '.MuiTypography-root': { fontWeight: 600 } }}
                  control={<Radio />}
                  label="All Users"
                />
                <FormControlLabel
                  value="code"
                  control={<Radio />}
                  label={
                    <InputField
                      disabled={radioValue === 'allUsers'}
                      name="company_code"
                      label="Enter a Code"
                    />
                  }
                  sx={{
                    mt: '-12px',
                    mb: '22px',
                    '& .MuiTypography-root': {
                      position: 'relative',
                      top: '22px',
                    },
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
            <Button
              variant="contained"
              sx={{ px: '32px' }}
              disabled={!selectedRows.length}
              onClick={handleSubmit(onSubmit)}>
              Export
            </Button>
          </Grid>
        </Grid>
      </FormProvider>
    </Box>
  );
};

export default Analytics;
