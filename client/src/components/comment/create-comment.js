import React from 'react';
import { withStyles } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import SendIcon from '@material-ui/icons/Send';
import Divider from '@material-ui/core/Divider';

const CreateComment = ({ classes }) => {
  return (
    <>
      <form className="classes.form" style={{ marginTop: '1.5rem' }}>
        <InputBase className={classes.input} placeholder="Add comment" />
        <IconButton className={classes.sendButton}>
          <SendIcon />
        </IconButton>
        <IconButton className={classes.clearButton}>
          <ClearIcon />
        </IconButton>
      </form>
      <Divider />
    </>
  );
};

const styles = theme => ({
  form: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: 2,
    flex: 1,
    width: '70%',
  },
  clearButton: {
    padding: 2,
    color: 'red',
  },
  sendButton: {
    padding: 2,
    color: theme.palette.secondary.dark,
  },
});

export default withStyles(styles)(CreateComment);
