import { useState, useCallback, useEffect } from 'react';
import { SvgIcon, Button, Stack, debounce } from '@mui/material';
import { TabPanel } from '@mui/lab';
import {
  GridColDef,
  GridValueGetterParams,
  GridSortModel,
  GridValueFormatterParams,
} from '@mui/x-data-grid';

import { ONE_MB } from '@app/constants';
import SearchField from '@app/components/SearchField';
import { ReactComponent as DeleteIcon } from '@assets/icons/ic-delete.svg';
import { formatDate } from '@app/utils';
import DataTable from '@app/components/DataTable';

import { useFetchVideosQuery, useDeleteFile } from './hooks';
import { useIsSuperAdmin } from '@app/hooks';

import UploadFile from './UploadFile';

const VideoTab = () => {
  const isAdmin = useIsSuperAdmin();
  const [filter, setFilter] = useState({
    page: 1,
    take: 10,
    search: '',
    order: {
      field: 'createAt',
      sort: 'desc',
    },
  });

  const updateFilter = (k: keyof typeof filter, v: number | string | object) =>
    setFilter(prev => ({ ...prev, [k]: v }));

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const onSearch = useCallback(
    debounce((newValue: string) => updateFilter('search', newValue.toLocaleLowerCase()), 1000),
    [],
  );
  useEffect(() => {
    setSelectedRows([]);
  }, [filter.page]);

  const { data, isLoading, refetch } = useFetchVideosQuery({
    ...filter,
    order: `${filter.order.field} ${filter.order.sort}`,
  });

  const videos = data?.data || [];
  const itemCount = data?.meta?.itemCount;

  const deleteFile = useDeleteFile({ files: videos, callback: refetch });

  const onSort = (model: GridSortModel) => {
    const {
      order: { field, sort },
    } = filter;
    updateFilter(
      'order',
      model.length ? model[0] : { field, sort: sort === 'asc' ? 'desc' : 'asc' },
    );
  };
  const columns: GridColDef[] = [
    {
      field: 'fileName',
      headerName: 'File name',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      sortable: false,
    },
    {
      field: 'format',
      headerName: 'Format',
      headerAlign: 'left',
      align: 'left',
      sortable: false,
    },
    {
      field: 'viewsCount',
      headerName: 'Views',
      headerAlign: 'left',
      width: 80,
      align: 'left',
      sortable: false,
    },
    {
      field: 'size',
      headerName: 'Size',
      type: 'number',
      width: 100,
      headerAlign: 'left',
      align: 'left',

      sortable: false,
      valueFormatter: (params: GridValueFormatterParams) =>
        `${(+params.value / ONE_MB).toFixed(2)} mb`,
    },
    {
      field: 'createAt',
      headerName: 'Date Upload',
      width: 155,
      headerAlign: 'left',
      align: 'left',
      valueFormatter: (params: GridValueFormatterParams) => formatDate(params.value as string),
    },
    {
      field: 'id',
      headerName: 'Action',
      sortable: false,
      width: 80,
      align: 'center',

      renderCell: ({ value }: GridValueGetterParams) => {
        return <SvgIcon onClick={() => deleteFile([value as string])} component={DeleteIcon} />;
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
      value="videos">
      <Stack direction="row" spacing={'10px'} mb="20px">
        <SearchField onChange={e => onSearch(e.target.value)} />
        <Button
          sx={{
            display: !isAdmin ? 'none' : 'inherit',
          }}
          variant="delete"
          disabled={!selectedRows.length}
          onClick={() => deleteFile(selectedRows)}>
          delete
        </Button>
        <UploadFile type="video" onUpload={() => refetch()} />
      </Stack>
      <DataTable
        hasCheckboxSelection={isAdmin}
        loading={isLoading}
        rows={videos}
        columns={columns}
        onSelectionModelChange={ids => setSelectedRows(ids as string[])}
        onPageChange={page => updateFilter('page', page)}
        page={filter.page}
        rowCount={itemCount}
        sortModel={[filter.order] as GridSortModel}
        onSortModelChange={onSort}
      />
    </TabPanel>
  );
};

export default VideoTab;
