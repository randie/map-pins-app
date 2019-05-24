import React, { useContext, useState } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddAPhotoIcon from '@material-ui/icons/AddAPhotoTwoTone';
import LandscapeIcon from '@material-ui/icons/LandscapeOutlined';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/SaveTwoTone';
import Context from '../../context';
import { createPinMutation } from '../../graphql/mutations';
import { useGraphQLClient } from '../../hooks/graphql-client';

// ref: https://cloudinary.com/documentation/upload_images#uploading_with_a_direct_call_to_the_api
const CLOUDINARY_API = 'https://api.cloudinary.com/v1_1/randie/image/upload';

const CreatePin = ({ classes }) => {
  const graphqlClient = useGraphQLClient();
  const { state, dispatch } = useContext(Context);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const uploadImage = async () => {
    // upload image to cloudinary.com and return an image url
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'rb-map-pins');
    formData.append('cloud_name', 'randie');
    const response = await axios.post(CLOUDINARY_API, formData);
    return response.data.url;
  };

  const handleSave = async event => {
    event.preventDefault();

    try {
      setIsSaving(true);
      const imageUrl = await uploadImage();
      const { latitude, longitude } = state.draftPin;
      const args = { title, image: imageUrl, content, latitude, longitude };
      const { createPin } = await graphqlClient.request(createPinMutation, args);
      console.log('>> pin created:', { createPin });
      handleDiscard(); // delete draft pin
    } catch (error) {
      console.error('ERROR! Failed to create pin', error);
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setTitle('');
    setImage('');
    setContent('');
    dispatch({ type: 'DISCARD_DRAFT_PIN' });
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
          disabled={!title.trim() || !content.trim() || !image || isSaving}
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
