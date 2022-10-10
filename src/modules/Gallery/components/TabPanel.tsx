import { PropsWithChildren } from 'react';
import { TabPanel as TabPanelDefault } from '@mui/lab';
import { Typography, Box } from '@mui/material';

type Props = {
  title: string;
  value: string;
};

const TabPanel = ({ title, value, children }: PropsWithChildren<Props>) => {
  return (
    <TabPanelDefault
      value={value}
      sx={{ flex: 1, backgroundColor: '#ffffff', padding: '20px 16px' }}>
      <Typography variant="h5" sx={{ mb: '20px' }} component="h2">
        {title}
      </Typography>
      <Box sx={{ maxWidth: '816px', height: '100%', display: 'flex' }}>{children}</Box>
    </TabPanelDefault>
  );
};

export default TabPanel;
