import { useCallback, useState, useEffect } from 'react';
import { SvgIcon, Button, Stack, debounce } from '@mui/material';
import { TabPanel } from '@mui/lab';
import {
  GridColDef,
  GridValueGetterParams,
  GridSortModel,
  GridValueFormatterParams,
} from '@mui/x-data-grid';

import { ONE_MB } from '@app/constants';
import { formatDate } from '@app/utils';
import { ReactComponent as DeleteIcon } from '@assets/icons/ic-delete.svg';
import SearchField from '@app/components/SearchField';
import DataTable from '@app/components/DataTable';

import UploadFile from './UploadFile';
import { useFetchImagesQuery, useDeleteFile } from './hooks';
import { useIsSuperAdmin } from '@app/hooks';

const ImageTab = () => {
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

  const updateFilter = (k: keyof typeof filter, v: string | number | object) =>
    setFilter(prev => ({ ...prev, [k]: v }));

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { data, isLoading, refetch } = useFetchImagesQuery({
    ...filter,
    order: `${filter.order.field} ${filter.order.sort}`,
  });

  const images = data?.data || [];
  const itemCount = data?.meta?.itemCount;

  const deleteFile = useDeleteFile({ files: images, callback: refetch });

  const onSort = (model: GridSortModel) => {
    const {
      order: { field, sort },
    } = filter;
    updateFilter(
      'order',
      model.length ? model[0] : { field, sort: sort === 'asc' ? 'desc' : 'asc' },
    );
  };
  const onSearch = useCallback(
    debounce((newValue: string) => updateFilter('search', newValue.toLocaleLowerCase()), 1000),
    [],
  );

  useEffect(() => {
    setSelectedRows([]);
  }, [filter.page]);

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
      width: 100,
      headerAlign: 'left',
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
      sx={{ backgroundColor: '#fff', display: 'flex', flexDirection: 'column', height: '100%' }}
      value="images">
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
        <UploadFile type="image" onUpload={() => refetch()} />
      </Stack>
      <DataTable
        hasCheckboxSelection={isAdmin}
        loading={isLoading}
        rows={images}
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

export default ImageTab;
