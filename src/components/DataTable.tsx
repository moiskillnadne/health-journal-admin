import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import CheckboxField from './CheckBox';
import { useLayoutEffect, useMemo, useEffect, useRef } from 'react';

interface StyledDataGridProps extends DataGridProps {
  fullScreen?: boolean;
}
const StyledDataGrid = styled(DataGrid, {
  shouldForwardProp: prop => prop !== 'fullScreen',
})<StyledDataGridProps>(({ theme, fullScreen }) => ({
  border: fullScreen ? '1px solid #ccc' : 'none',
  borderBottom: '1px solid #ccc',
  height: '100%',
  '.MuiDataGrid-columnHeaders': {
    backgroundColor: '#e7ecff',
    '& .MuiDataGrid-columnHeaderTitle': {
      fontSize: '16px',
      fontWight: 600,
    },
    '& .MuiDataGrid-iconSeparator': {
      display: 'none',
    },
  },
}));

type Prop = {
  hasCheckboxSelection?: boolean;
  fullScreen?: boolean;
  serialNumberColumn?: boolean;
} & DataGridProps;

const DataTable = (props: Prop) => {
  const {
    hasCheckboxSelection = false,
    page = 1,
    pageSize = 10,
    onPageChange,
    components,
    fullScreen = true,
    rowCount = 0,
    serialNumberColumn,
    columns,
    rows,
    ...otherProps
  } = props;

  const offset = page === 1 ? 0 : pageSize * (page - 1);

  if (serialNumberColumn) {
    if (!columns?.find(e => e.field === 'index')) {
      columns?.unshift({
        field: 'index',
        headerName: '№',
        width: 50,
        headerAlign: 'left',
        align: 'left',
        sortable: false,
      });
    }
  }

  const rowsWithSerialNumber = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    () => (rows || []).map((el, index) => ({ ...el, index: index + 1 + offset })),
    [rows],
  );

  return (
    <StyledDataGrid
      fullScreen={fullScreen}
      checkboxSelection={hasCheckboxSelection}
      autoHeight={!fullScreen}
      components={
        hasCheckboxSelection
          ? Object.assign({ BaseCheckbox: CheckboxField }, components)
          : components
      }
      columns={columns}
      rows={serialNumberColumn ? rowsWithSerialNumber : rows}
      disableColumnMenu
      disableColumnFilter
      disableSelectionOnClick
      hideFooter={!fullScreen}
      paginationMode="server"
      sortingMode="server"
      onPageChange={(page, details) => onPageChange && onPageChange(page + 1, details)}
      rowCount={rowCount}
      pageSize={pageSize}
      page={page - 1}
      {...otherProps}
    />
  );
};

export default DataTable;
