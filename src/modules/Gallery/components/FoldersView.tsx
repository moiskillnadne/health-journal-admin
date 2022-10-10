import { Box } from '@mui/system';
import { useContext } from 'react';
import { GalleryContext } from './Layout';
import { ReactComponent as FolderBigIcon } from '@assets/icons/ic-folder-big.svg';
import { ReactComponent as FolderIcon } from '@assets/icons/ic-folder.svg';
import { Divider, SvgIcon, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

type Props = {
  folders: {
    to: string;
    title: string;
  }[];
};

const FoldersView = ({ folders }: Props) => {
  const { view } = useContext(GalleryContext);
  const isList = view === 'list';

  const boxStyles = {
    flexWrap: isList ? 'no-wrap' : 'wrap',
    flexDirection: isList ? 'column' : 'row',
  };

  return (
    <Box sx={{ display: 'flex', ...boxStyles }}>
      {folders?.map(folder => (
        <Link
          to={folder?.to}
          key={folder.to}
          style={{
            textDecoration: 'none',
            color: '#3a4364',
          }}>
          <Box
            key={folder.title}
            sx={{
              display: 'flex',
              flexDirection: isList ? 'row' : 'column',
              p: isList ? '16px 12px' : '16px 24px',
              cursor: 'pointer',
            }}>
            {view === 'list' ? <FolderIcon /> : <FolderBigIcon />}
            <Typography
              sx={{
                pl: '12px',
                fontSize: '16px',
                fontWeight: 600,
                mt: isList ? '0px' : '11px',
              }}>
              {folder.title}
            </Typography>
          </Box>
          {isList && <Divider />}
        </Link>
      ))}
    </Box>
  );
};

export default FoldersView;
