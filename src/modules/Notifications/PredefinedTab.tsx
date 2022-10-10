import { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Switch, Stack, SvgIcon, Button, debounce } from '@mui/material';
import {
  GridColDef,
  GridValueGetterParams,
  GridSortModel,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import DataTable from '@app/components/DataTable';
import SearchField from '@app/components/SearchField';

import { ReactComponent as EditIcon } from '@assets/icons/ic-edit.svg';

import {
  useFetchPredefinedNotificationsQuery,
  usePatchPredefinedNotificationMutation,
} from './hooks';
import { TabPanel } from '@mui/lab';
import { useIsSuperAdmin } from '@app/hooks';

const PredefinedTab = () => {
  const isAdmin = useIsSuperAdmin();
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

  const [updateStatus, { isLoading: isLoadingUpdate }] = usePatchPredefinedNotificationMutation();

  const { data, isLoading } = useFetchPredefinedNotificationsQuery({
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
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Notification Name',
      flex: 2,
      headerAlign: 'left',
      align: 'left',
      sortable: false,
    },
    {
      field: 'notification_type',
      headerName: 'Notification Type',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      sortable: false,
      renderCell: ({ value }) => {
        return (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          <span style={{ textTransform: 'capitalize' }}>{value?.replaceAll('_', ' ') || ''}</span>
        );
      },
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
            disabled={!isAdmin}
            checked={value}
            onChange={e => {
              onUpdateStatus(id as string, e.target.checked);
            }}
            color="secondary"
          />
        );
      },
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
              onClick={() => navigate('edit-predefined-notification', { state: row })}
              sx={{ cursor: 'pointer' }}
            />
          </>
        );
      },
    },
  ];

  if (!isAdmin) columns.pop();

  return (
    <TabPanel
      sx={{
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      value="predefined">
      <Stack direction="row" spacing={'10px'} mb="20px" sx={{ backgroundColor: '#fff' }}>
        <SearchField onChange={e => onSearch(e.target.value)} />
      </Stack>
      <DataTable
        sx={{ backgroundColor: '#fff' }}
        loading={isLoading || isLoadingUpdate}
        columns={columns}
        rows={data?.data || []}
        serialNumberColumn
        onPageChange={page => updateFilter('page', page)}
        page={filter.page}
        rowCount={itemCount}
      />
    </TabPanel>
  );
};

export default PredefinedTab;
