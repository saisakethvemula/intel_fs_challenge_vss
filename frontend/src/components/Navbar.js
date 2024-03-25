import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';

import { Link, useLocation } from 'react-router-dom';


export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Button component={Link} to="/" color="inherit" sx={{ flexGrow: 1 }}>
            Intel Challenge
          </Button>
          <Button component={Link} to="/graph" color="inherit">Graph</Button>
          <Button component={Link} to="/table" color="inherit">Table</Button>
          <Button color="inherit">Edit</Button>
          <DownloadForOfflineIcon />
        </Toolbar>
      </AppBar>
    </Box>
  );
}