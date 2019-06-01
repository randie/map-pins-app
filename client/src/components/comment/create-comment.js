import React, { useState, useContext } from 'react';
import { withStyles } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import SendIcon from '@material-ui/icons/Send';
import Divider from '@material-ui/core/Divider';
import Context from '../../context';
import { useGraphQLClient } from '../../hooks/graphql-client';
import { createCommentMutation } from '../../graphql/mutations';

const CreateComment = ({ classes }) => {
  const graphqlClient = useGraphQLClient();
  const { state, dispatch } = useContext(Context);
  const [comment, setComment] = useState('');

  const handleCommentSubmit = async () => {
    const args = { pinId: state.selectedPin._id, text: comment };
    await graphqlClient.request(createCommentMutation, args);
    setComment('');
  };

  return (
    <>
      <form className="classes.form" style={{ marginTop: '1.5rem' }}>
        <InputBase
          className={classes.input}
          placeholder="Add comment"
          multiline={true}
          value={comment}
          onChange={event => setComment(event.target.value)}
        />
        <IconButton
          className={classes.sendButton}
          disabled={!comment.trim()}
          onClick={handleCommentSubmit}
        >
          <SendIcon />
        </IconButton>
        <IconButton
          className={classes.clearButton}
          disabled={!comment.trim()}
          onClick={() => setComment('')}
        >
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
