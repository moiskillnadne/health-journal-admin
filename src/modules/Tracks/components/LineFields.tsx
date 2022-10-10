import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { TableCell, TableRow, TableBody, Button, SvgIcon } from '@mui/material';

import { ReactComponent as DeleteIcon } from '@assets/icons/ic-delete.svg';
import { ReactComponent as AddIcon } from '@assets/icons/ic-add.svg';

import ContentField from './ContentField';

export default function LineFields({ nestIndex }: { nestIndex: number }) {
  const { control } = useFormContext();

  const { fields, remove, append } = useFieldArray({
    control,
    name: `groups[${nestIndex}].lines`,
  });

  useEffect(() => {
    if (!fields.length) {
      append({ video: null, article: null, recipe: null, order: 1 });
    }
  }, [fields]);

  return (
    <>
      <TableBody>
        {fields.map((item, index) => {
          return (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{`Day ${index + 1}`}</TableCell>
              <TableCell
                sx={{
                  verticalAlign: 'baseline',
                  pt: '24px',
                }}>
                <ContentField name={`groups[${nestIndex}].lines[${index}].video`} type="video" />
              </TableCell>
              <TableCell
                sx={{
                  verticalAlign: 'baseline',
                  pt: '24px',
                }}>
                <ContentField
                  name={`groups[${nestIndex}].lines[${index}].article`}
                  type="article"
                />
              </TableCell>
              <TableCell
                sx={{
                  verticalAlign: 'baseline',
                  pt: '24px',
                }}>
                <ContentField name={`groups[${nestIndex}].lines[${index}].recipe`} type="recipe" />
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <DeleteIcon
                  style={{ cursor: 'pointer' }}
                  type="button"
                  onClick={() => remove(index)}
                />
              </TableCell>
            </TableRow>
          );
        })}
        <TableRow>
          <TableCell colSpan={6} sx={{ textAlign: 'right' }}>
            <Button
              startIcon={<SvgIcon sx={{ color: '#3a4364' }} component={AddIcon} />}
              variant="tertiary"
              sx={{ width: '155px' }}
              onClick={() => {
                append({ video: null, article: null, recipe: null, order: fields.length });
              }}>
              Add Line
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </>
  );
}
