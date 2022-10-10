import { useMemo, useState } from 'react';
import { Switch } from '@mui/material';
import {
  GridColDef,
  GridValueGetterParams,
  GridSortModel,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import { formatDate } from '@app/utils';
import { useFetchUsersQuery, useUpdateStatusUserMutation } from './hooks';
import { TUserFull } from '@app/types';
import DataTable from '@app/components/DataTable';

const Users = () => {
  const [updateStatus, { isLoading: isLoadingUpdate }] = useUpdateStatusUserMutation();

  const [filter, setFilter] = useState({
    page: 1,
    take: 10,
    order: {
      field: 'lastLoginAt',
      sort: 'desc',
    },
  });

  const onUpdateStatus = (id: string, isActive: boolean) => {
    updateStatus({ id, isActive })
      .unwrap()
      .then(() => refetch());
  };

  const { data, refetch, isLoading } = useFetchUsersQuery({
    ...filter,
    order: `${filter.order.field} ${filter.order.sort}`,
  });

  const itemCount = data?.meta?.itemCount;

  const columns: GridColDef<TUserFull>[] = [
    {
      field: 'fullName',
      headerName: 'Name',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      sortable: false,
      valueGetter: params => {
        const { firstName = '', lastName = '' } = params.row;
        return `${firstName} ${lastName}`;
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      sortable: false,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      headerAlign: 'left',
      align: 'left',
      sortable: false,
      valueFormatter: (params: GridValueFormatterParams) => {
        const { value = '' } = params;
        if (typeof value === 'string') {
          return value.replaceAll('_', ' ');
        }
      },
    },
    {
      field: 'isActive',
      headerName: 'Status',
      sortable: false,
      width: 80,
      align: 'center',
      renderCell: ({ value, id }: GridValueGetterParams) => {
        return (
          <Switch
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
      field: 'lastLoginAt',
      headerName: 'Last Login',
      width: 155,
      headerAlign: 'left',
      align: 'left',
      valueFormatter: (params: GridValueFormatterParams) =>
        params.value !== null ? formatDate(params.value as string) : '-',
    },
  ];

  const updateFilter = (k: keyof typeof filter, v: string | object | number) =>
    setFilter(prev => ({ ...prev, [k]: v }));

  const onSort = (model: GridSortModel) => {
    const {
      order: { field, sort },
    } = filter;
    updateFilter(
      'order',
      model.length ? model[0] : { field, sort: sort === 'asc' ? 'desc' : 'asc' },
    );
  };

  return (
    <DataTable
      loading={isLoading || isLoadingUpdate}
      columns={columns}
      serialNumberColumn
      rows={data?.data || []}
      onPageChange={page => updateFilter('page', page)}
      page={filter.page}
      rowCount={itemCount}
      sortModel={[filter.order] as GridSortModel}
      onSortModelChange={onSort}
    />
  );
};

export default Users;
