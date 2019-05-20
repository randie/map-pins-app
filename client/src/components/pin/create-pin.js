import React, { useContext, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddAPhotoIcon from '@material-ui/icons/AddAPhotoTwoTone';
import LandscapeIcon from '@material-ui/icons/LandscapeOutlined';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/SaveTwoTone';
import Context from '../../context';

const CreatePin = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');

  const handleDiscard = () => {
    setTitle('');
    setImage('');
    setContent('');
    dispatch({ type: 'DISCARD_DRAFT_PIN' });
  };

  const handleSave = event => {
    event.preventDefault();
    console.log(title, image, content);
  };

  return (
    <form className={classes.form}>
      <Typography className={classes.alignCenter} component="h2" variant="h4" color="secondary">
        <LandscapeIcon className={classes.iconLarge} />
        Pin Location
      </Typography>
      <div>
        <TextField
          name="title"
          label="Title"
          placeholder="Enter pin title"
          onChange={event => setTitle(event.target.value)}
        />
        <input
          accept="image/*"
          id="image"
          type="file"
          className={classes.input}
          onChange={event => setImage(event.target.files[0])}
        />
        <label htmlFor="image">
          <Button
            component="span"
            size="small"
            className={classes.button}
            style={{ color: image && 'green' }}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="Content"
          rows="6"
          margin="normal"
          variant="outlined"
          fullWidth
          multiline
          onChange={event => setContent(event.target.value)}
        />
      </div>
      <div>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleDiscard}
        >
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="secondary"
          disabled={!title.trim() || !content.trim() || !image}
          onClick={handleSave}
        >
          Save
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: theme.spacing.unit,
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '95%',
  },
  input: {
    display: 'none',
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit,
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0,
  },
});

export default withStyles(styles)(CreatePin);
