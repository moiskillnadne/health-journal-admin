import { Tab, Box } from '@mui/material';
import { TabContext, TabList } from '@mui/lab';
import { useState } from 'react';
import ImageTab from './ImageTab';
import VideoTab from './VideoTab';

const ContentStorage = () => {
  const [type, setType] = useState<'videos' | 'images'>('videos');

  const changeType = (event: React.SyntheticEvent, newValue: 'videos' | 'images') => {
    setType(newValue);
  };

  return (
    <TabContext value={type}>
      <Box sx={{ borderBottom: 1, borderColor: 'transparent' }}>
        <TabList
          TabIndicatorProps={{
            style: { height: '0px' },
          }}
          onChange={changeType}
          aria-label="lab API tabs example"
          sx={{
            '.MuiTabs-root.MuiButtonBase-root': {
              textTransform: 'capitalize',
              minWidth: '150px',
            },
          }}>
          <Tab label="Video" value="videos" />
          <Tab label="Image" value="images" />
        </TabList>
      </Box>
      {type === 'videos' && <VideoTab />}
      {type === 'images' && <ImageTab />}
    </TabContext>
  );
};

export default ContentStorage;
