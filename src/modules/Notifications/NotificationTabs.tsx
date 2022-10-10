import { useLocation } from 'react-router-dom';
import { Tab, Box } from '@mui/material';
import { TabContext, TabList } from '@mui/lab';
import { useState } from 'react';
import PredefinedTab from './PredefinedTab';
import CustomTab from './CustomTab';

type Tabs = 'predefined' | 'custom';

const NotificationTabs = () => {
  const location = useLocation();
  const [type, setType] = useState<Tabs>((location.state as Tabs) || 'predefined');
  const changeType = (event: React.SyntheticEvent, newValue: 'predefined' | 'custom') => {
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
          <Tab label="Predefined" value="predefined" />
          <Tab label="Custom" value="custom" />
        </TabList>
      </Box>
      {type === 'predefined' ? <PredefinedTab /> : <CustomTab />}
    </TabContext>
  );
};

export default NotificationTabs;
