import { useFormContext, useFieldArray } from 'react-hook-form';

import {
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Button,
  Typography,
  Grid,
  Divider,
} from '@mui/material';

import { SelectField } from '@app/components/form';
import { TrackSheduleOptions } from '@app/constants';
import { ReactComponent as AddIcon } from '@assets/icons/ic-add.svg';

import LineFields from './LineFields';

export default function GroupFields() {
  const { control } = useFormContext();

  const { fields, append } = useFieldArray({
    control,
    name: 'groups',
  });

  return (
    <>
      <Divider
        orientation="horizontal"
        flexItem
        sx={{ ml: '4px', width: '100%', mt: '30px', backgroundColor: ' #e7ecff' }}
      />
      {fields.map((item, index) => {
        return (
          <Grid
            container
            spacing={'20px'}
            alignContent={'flex-start'}
            sx={{ mt: '0px' }}
            key={`${index}-GroupFields`}>
            <Grid item xs={12}>
              <Typography variant="h5">Group {index + 1}</Typography>
            </Grid>

            <Grid item xs={6} sx={{ pl: '20px', pt: '40px', maxWidth: '408px !important' }}>
              <SelectField
                label="Schedule*"
                name={`groups[${index}].schedule`}
                options={TrackSheduleOptions}
              />
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table sx={{ minWidth: 500 }}>
                  <TableHead sx={{ backgroundColor: '#e7ecff' }}>
                    <TableRow sx={{ '&>th': { fontSize: '16px', fontWeight: 600 } }}>
                      <TableCell sx={{ width: '40px' }}>№</TableCell>
                      <TableCell sx={{ width: '40px' }}>Day</TableCell>
                      <TableCell sx={{ width: '25%' }}>Video</TableCell>
                      <TableCell sx={{ width: '25%' }}>Article</TableCell>
                      <TableCell sx={{ width: '25%' }}>Recipe</TableCell>
                      <TableCell sx={{ width: '10%' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <LineFields nestIndex={index} />
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        );
      })}
      <Button
        startIcon={<AddIcon />}
        sx={{ width: '150px', my: '28px', color: '#3a4364' }}
        onClick={() => {
          append({
            order: fields.length + 1,
            lines: [{ video: null, article: null, recipe: null, order: 1 }],
          });
        }}>
        Add Group
      </Button>
    </>
  );
}
