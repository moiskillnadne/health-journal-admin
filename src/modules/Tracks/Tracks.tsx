import { useMemo, useState, useCallback } from 'react';
import { Box, Switch, Stack, SvgIcon, Button, debounce } from '@mui/material';

import {
  GridColDef,
  GridValueGetterParams,
  GridSortModel,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import DataTable from '@app/components/DataTable';
import SearchField from '@app/components/SearchField';
import { formatDate } from '@app/utils';

import { ReactComponent as AddIcon } from '@assets/icons/ic-add.svg';
import { ReactComponent as EditIcon } from '@assets/icons/ic-edit.svg';

import { TTrack } from './types';
import { useFetchTracksQuery, usePatchTracksMutation } from './hooks';
import { Link, useNavigate } from 'react-router-dom';
import { useConfirmDialog, useIsSuperAdmin } from '@app/hooks';

const Tracks = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState({
    search: '',
    page: 1,
    take: 10,
    order: {
      field: 'updateAt',
      sort: 'desc',
    },
  });

  const updateFilter = (k: keyof typeof filter, v: string | object | number) =>
    setFilter(prev => ({ ...prev, [k]: v }));

  const [updateStatus, { isLoading: isLoadingUpdate }] = usePatchTracksMutation();

  const openConfirmDialog = useConfirmDialog();

  const { data, isLoading } = useFetchTracksQuery({
    ...filter,
    order: `${filter.order.field} ${filter.order.sort}`,
  });

  const onUpdateStatus = (id: string, isPublished: boolean) => {
    updateStatus({ id, body: { isPublished } });
  };

  const onSearch = useCallback(
    debounce((newValue: string) => updateFilter('search', newValue.toLocaleLowerCase()), 1000),
    [],
  );

  const itemCount = data?.meta?.itemCount;

  const columns: GridColDef<TTrack>[] = [
    {
      field: 'titleEn',
      headerName: 'Track Name',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      sortable: false,
    },
    {
      field: 'targetGroups',
      headerName: 'Target Groups',
      flex: 2,
      headerAlign: 'left',
      align: 'left',
      sortable: false,
      valueFormatter: ({ value }: GridValueFormatterParams) => {
        if (Array.isArray(value)) {
          return value?.map((el: { title: string }) => el.title).join();
        }
        return '-';
      },
    },
    {
      field: 'createAt',
      headerName: 'Date Upload',
      width: 155,
      headerAlign: 'left',
      align: 'left',
      sortable: false,
      valueFormatter: (params: GridValueFormatterParams) => formatDate(params.value as string),
    },
    {
      field: 'isPublished',
      headerName: 'Status',
      sortable: false,
      width: 80,
      align: 'center',
      renderCell: ({ value, id }: GridValueGetterParams) => {
        return (
          <Switch
            checked={value}
            onChange={(e, val) => {
              if (!val) {
                openConfirmDialog({
                  title: 'The Track will not be available for users anymore',
                  onConfirm() {
                    onUpdateStatus(id as string, false);
                  },
                });
              } else {
                onUpdateStatus(id as string, e.target.checked);
              }
            }}
            color="secondary"
          />
        );
      },
    },
    {
      field: 'days',
      headerName: 'Days',
      width: 70,
      headerAlign: 'left',
      align: 'left',
      sortable: false,
    },
    {
      field: 'id',
      headerName: 'Action',
      sortable: false,
      width: 80,
      align: 'center',
      renderCell: ({ value, row }) => {
        return (
          <>
            <SvgIcon
              component={EditIcon}
              onClick={() => navigate('edit-track', { state: row })}
              sx={{ cursor: 'pointer' }}
            />
          </>
        );
      },
    },
  ];

  return (
    <>
      <Stack direction="row" spacing={'10px'} mb="20px" sx={{ backgroundColor: '#fff' }}>
        <SearchField onChange={e => onSearch(e.target.value)} />
        <Link style={{ color: '#fff', textDecoration: 'none' }} to="new-track">
          <Button startIcon={<SvgIcon component={AddIcon} />} variant="contained" color="secondary">
            new track
          </Button>
        </Link>
      </Stack>
      <DataTable
        sx={{ backgroundColor: '#fff' }}
        loading={isLoading || isLoadingUpdate}
        columns={columns}
        serialNumberColumn
        rows={data?.data || []}
        onPageChange={page => updateFilter('page', page)}
        page={filter.page}
        rowCount={itemCount}
      />
    </>
  );
};

export default Tracks;
