import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import FaceIcon from '@material-ui/icons/Face';
import Context from '../../context';
import CreateComment from '../comment/create-comment';
import Comments from '../comment/comments';

import { Subscription } from 'react-apollo';
import { commentCreatedSubscription } from '../../graphql/subscriptions';

const PinContent = ({ classes }) => {
  const { state, dispatch } = useContext(Context);
  const { title, content, author, createdAt, comments } = state.selectedPin;

  const handleCommentCreated = ({ subscriptionData }) => {
    dispatch({ type: 'CREATE_COMMENT', payload: subscriptionData.data.commentCreated });
  };

  return (
    <div className={classes.root}>
      <Typography component="h2" variant="h4" color="primary" gutterBottom>
        {title}
      </Typography>
      <Typography className={classes.text} component="h3" variant="h6" color="inherit" gutterBottom>
        <FaceIcon className={classes.icon} /> {author.name}
      </Typography>
      <Typography className={classes.text} variant="subtitle2" color="inherit" gutterBottom>
        <AccessTimeIcon className={classes.icon} /> {new Date(Number(createdAt)).toDateString()}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {content}
      </Typography>
      <CreateComment />
      <Comments comments={comments} />
      <Subscription
        subscription={commentCreatedSubscription}
        onSubscriptionData={handleCommentCreated}
      >
        {null}
      </Subscription>
    </div>
  );
};

const styles = theme => ({
  root: {
    padding: '1em 0.5em',
    textAlign: 'center',
    width: '100%',
  },
  icon: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  text: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withStyles(styles)(PinContent);
