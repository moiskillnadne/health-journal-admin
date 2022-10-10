import { useMemo, useState, useCallback } from 'react';
import { Stack, SvgIcon, Button, debounce } from '@mui/material';
import { GridColDef, GridValueFormatterParams } from '@mui/x-data-grid';
import DataTable from '@app/components/DataTable';
import SearchField from '@app/components/SearchField';
import { formatDate } from '@app/utils';

import { ReactComponent as AddIcon } from '@assets/icons/ic-add.svg';
import { ReactComponent as EditIcon } from '@assets/icons/ic-edit.svg';

import { Link, useNavigate } from 'react-router-dom';
import { useFetchCustomNotificationsQuery } from './hooks';
import { TabPanel } from '@mui/lab';
import { useIsSuperAdmin } from '@app/hooks';

const CustomTab = () => {
  const isAdmin = useIsSuperAdmin();
  const navigate = useNavigate();

  const [filter, setFilter] = useState({
    search: '',
    page: 1,
    take: 10,
    order: 'updateAt DESC',
  });

  const updateFilter = (k: keyof typeof filter, v: string | object | number) =>
    setFilter(prev => ({ ...prev, [k]: v }));

  const { data, isLoading } = useFetchCustomNotificationsQuery({
    ...filter,
  });

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
      field: 'actual_send_date',
      headerName: 'Send Date',
      width: 155,
      headerAlign: 'left',
      align: 'left',
      sortable: false,
      valueFormatter: (params: GridValueFormatterParams) => formatDate(params.value as string),
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: false,
      width: 120,
      align: 'left',
      renderCell: ({ value }) => {
        return <span style={{ textTransform: 'capitalize' }}>{value}</span>;
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
              onClick={() => navigate('edit-custom-notification', { state: row })}
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
      value="custom">
      <Stack direction="row" spacing={'10px'} mb="20px" sx={{ backgroundColor: '#fff' }}>
        <SearchField onChange={e => onSearch(e.target.value)} />
        {isAdmin ? (
          <Link style={{ color: '#fff', textDecoration: 'none' }} to="add-custom-notification">
            <Button
              startIcon={<SvgIcon component={AddIcon} />}
              variant="contained"
              color="secondary">
              add
            </Button>
          </Link>
        ) : null}
      </Stack>
      <DataTable
        sx={{
          backgroundColor: '#fff',
        }}
        loading={isLoading}
        serialNumberColumn
        columns={columns}
        rows={data?.data || []}
        onPageChange={page => updateFilter('page', page)}
        page={filter.page}
        rowCount={itemCount}
      />
    </TabPanel>
  );
};

export default CustomTab;
