import DataTable from '@app/components/DataTable';
import { useCallback, useContext, useMemo } from 'react';
import { SvgIcon, Stack, Switch, TablePagination, Box, LinearProgress } from '@mui/material';

import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useConfirmDialog, useIsSuperAdmin } from '@app/hooks';

import { ReactComponent as DeleteIcon } from '@assets/icons/ic-delete.svg';
import { ReactComponent as EditIcon } from '@assets/icons/ic-edit.svg';

import { TVideo, TArticle, TRecipe } from '../types';
import { useContentGalleryActions } from '../hooks';

import Video from '../components/ContentItem';
import { GalleryContext } from '../components/Layout';

type Props = {
  type: 'video' | 'article' | 'recipe' | 'foodVideo';
  rows: TVideo[] | TArticle[] | TRecipe[];
  rowCount?: number;
  page?: number;
  isLoading: boolean;
  setPage?: (page: number) => void;
};

const ContentView = ({
  type = 'video',
  rows = [],
  rowCount = 0,
  page = 1,
  isLoading = false,
  setPage,
}: Props) => {
  const { view } = useContext(GalleryContext);
  const isAdmin = useIsSuperAdmin();
  const isSearchView = setPage === undefined;

  const {
    publishAction,
    deleteAction,
    editAction,
    isLoading: isLoadingAction,
  } = useContentGalleryActions(type);

  const openConfirm = useConfirmDialog();

  const onPublish = useCallback(
    (id: string, isPublished: boolean) => {
      publishAction({ id, body: { isPublished } });
    },
    [type],
  );

  const onDelete = useCallback(
    (id: string, isPublished: boolean) => {
      if (isPublished) {
        openConfirm({
          title:
            'This content will no longer be available for mobile app user. Please confirm that you want to delete it.',
          onConfirm: () => {
            deleteAction({ id });
          },
        });
      } else {
        deleteAction({ id });
      }
    },
    [type],
  );

  const onEdit = (item: TVideo | TArticle | TRecipe) => {
    editAction(item);
  };

  const columns = useMemo<GridColDef<TVideo | TArticle | TRecipe>[]>(
    () => [
      {
        field: 'previewImagePresignedLink',
        headerName: '',
        width: 80,
        headerAlign: 'left',
        align: 'left',
        sortable: false,
        renderCell: ({ value, id, row }: GridValueGetterParams) => {
          return (
            <>
              <img src={value} style={{ height: '24px', width: '32px', objectFit: 'cover' }} />
            </>
          );
        },
      },
      {
        field: 'index',
        headerName: '№',
        sortable: false,
        width: 80,
        align: 'left',
      },
      {
        field: 'titleEn',
        headerName: 'Name',
        flex: 1,
        headerAlign: 'left',
        align: 'left',
        sortable: false,
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
              onChange={e => {
                onPublish(id as string, e.target.checked);
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
                onClick={() => onEdit(row)}
                sx={{ cursor: 'pointer' }}
              />
              {isAdmin && (
                <SvgIcon
                  component={DeleteIcon}
                  onClick={() => onDelete(value as string, row.isPublished)}
                  sx={{ cursor: 'pointer' }}
                />
              )}
            </>
          );
        },
      },
    ],
    [type],
  );

  return (
    <Box
      sx={{
        flex: 1,
        height: `calc(100% - ${view === 'list' ? 60 : 120}px)`,
      }}>
      {view === 'list' ? (
        <DataTable
          sx={{ mx: '16px' }}
          loading={isLoading || isLoadingAction}
          rows={rows}
          columns={columns}
          fullScreen={!isSearchView}
          serialNumberColumn
          page={page}
          rowCount={rowCount}
          onPageChange={page => setPage && setPage(page)}
        />
      ) : (
        <>
          <Stack
            sx={{
              flex: '1',
              height: '100%',
              flexWrap: 'wrap',
              flexDirection: 'row',
              alignContent: 'flex-start',
              position: 'relative',
              px: '8px',
            }}>
            {(isLoading || isLoadingAction) && (
              <LinearProgress sx={{ width: '100%', position: 'absolute', top: '4px' }} />
            )}
            {rows.map((el, index) => {
              return (
                <Video
                  key={index}
                  type={type}
                  videoType={el?.type}
                  imgSrc={el?.previewImagePresignedLink as string}
                  published={el.isPublished}
                  title={el.titleEn}
                  createdAt={el?.createAt as string}
                  onDelete={() => onDelete(el?.id as string, el.isPublished)}
                  onPublish={() => onPublish(el?.id as string, !el.isPublished)}
                  onEdit={() => onEdit(el)}
                  size={el?.videoPreview?.size}
                />
              );
            })}
          </Stack>
          {!isSearchView && (
            <TablePagination
              count={rowCount}
              page={page - 1}
              rowsPerPage={10}
              sx={{
                px: '16px',
                display: 'flex',
                flex: 1,
                width: '100%',
                justifyContent: 'flex-end',
                '.MuiTablePagination-selectLabel,.MuiInputBase-root': {
                  display: 'none',
                },
              }}
              onPageChange={(event, page) => setPage && setPage(++page)}
            />
          )}
        </>
      )}
    </Box>
  );
};
export default ContentView;
