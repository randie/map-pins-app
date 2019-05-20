import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import Context from '../context';
import NoContent from './pin/no-content';
import CreatePin from './pin/create-pin';

const Blog = ({ classes }) => {
  const { draftPin } = useContext(Context).state;

  return <Paper className={classes.root}>{!draftPin ? <NoContent /> : <CreatePin />}</Paper>;
};

const styles = {
  root: {
    minWidth: 350,
    maxWidth: 400,
    maxHeight: 'calc(100vh - 64px)',
    overflowY: 'scroll',
    display: 'flex',
    justifyContent: 'center',
  },
  rootMobile: {
    maxWidth: '100%',
    maxHeight: 300,
    overflowX: 'hidden',
    overflowY: 'scroll',
  },
};

export default withStyles(styles)(Blog);
