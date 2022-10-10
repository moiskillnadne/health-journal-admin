import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Grid, Stack, Tab, Typography } from '@mui/material';
import { useState } from 'react';

type Props = {
  english?: JSX.Element[] | JSX.Element;
  spanish?: JSX.Element[] | JSX.Element;
  buttons?: JSX.Element[] | JSX.Element;
  title: string;
};

const FormTabs = ({ english, spanish, title, buttons }: Props) => {
  const [type, setTab] = useState<'english' | 'spanish'>('english');

  const changeType = (event: React.SyntheticEvent, newValue: 'english' | 'spanish') => {
    setTab(newValue);
  };
  return (
    <TabContext value={type}>
      <Box sx={{ borderBottom: 1, borderColor: 'transparent' }}>
        <TabList
          TabIndicatorProps={{
            style: { height: '0px' },
          }}
          onChange={changeType}>
          <Tab label="English" value="english" />
          <Tab label="Spanish" value="spanish" />
        </TabList>
        <TabPanel value="english" title={title} sx={{ backgroundColor: '#fff' }}>
          <Typography variant="h5" sx={{ mb: '20px' }} component="h2">
            {title}
          </Typography>
          <Box sx={{ maxWidth: '816px', height: '100%', display: 'flex' }}>
            <Grid container alignContent={'flex-start'} spacing={'20px'}>
              {english}
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel value="spanish" title={title} sx={{ backgroundColor: '#fff' }}>
          <Typography variant="h5" sx={{ mb: '20px' }} component="h2">
            {title}
          </Typography>
          <Box sx={{ maxWidth: '816px', height: '100%', display: 'flex' }}>
            <Grid container alignContent={'flex-start'} spacing={'20px'}>
              {spanish}
            </Grid>
          </Box>
        </TabPanel>
        <Box sx={{ backgroundColor: '#ffffff', pb: '20px' }}>
          <Stack
            sx={{
              maxWidth: '816px',
            }}
            direction="row"
            justifyContent={'end'}
            spacing={'16px'}>
            {buttons}
          </Stack>
        </Box>
      </Box>
    </TabContext>
  );
};

export default FormTabs;
