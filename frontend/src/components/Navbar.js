import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

//Navigation bar component

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
        </Toolbar>
      </AppBar>
    </Box>
  );
}