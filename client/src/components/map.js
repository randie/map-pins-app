import React, { useContext, useEffect, useState } from 'react';
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';
import { withStyles } from '@material-ui/core/styles';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';
import Context from '../context';
import PinIcon from './pin-icon';
import Blog from './blog';
import { useGraphQLClient } from '../hooks/graphql-client';
import { pinsQuery } from '../graphql/queries';
import { deletePinMutation } from '../graphql/mutations';

// mapbox API access token
const accessToken =
  'pk.eyJ1IjoicmFuZGllIiwiYSI6ImNqdnJ1M29nbDJ5NGw0YW11YTg5cmkyZ24ifQ.T-CIaru7GAEfY6iSTwdRGg';

const initialViewport = {
  latitude: 40.014984,
  longitude: -105.270546,
  zoom: 13,
};

const Map = ({ classes }) => {
  const graphqlClient = useGraphQLClient();
  const { state, dispatch } = useContext(Context);
  const [viewport, setViewport] = useState(initialViewport);
  const [currentPosition, setCurrentPosition] = useState(null); // user's current position
  const [popup, setPopup] = useState(null);

  useEffect(() => getCurrentPosition(), []);
  useEffect(() => {
    getPins();
  }, []);

  const getCurrentPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setCurrentPosition({ latitude, longitude });
      });
    }
  };

  const getPins = async () => {
    const { pins } = await graphqlClient.request(pinsQuery);
    dispatch({ type: 'GET_PINS', payload: pins });
  };

  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    /* TODO: Is this still needed? If not, delete.
    if (!state.draftPin) {
      dispatch({ type: 'CREATE_DRAFT_PIN' });
    }
    */
    const [longitude, latitude] = lngLat;
    dispatch({ type: 'UPDATE_DRAFT_PIN', payload: { longitude, latitude } });
  };

  const handlePinClick = pin => {
    setPopup(pin);
    dispatch({ type: 'SET_SELECTED_PIN', payload: pin });
  };

  const handleDeletePinButtonClick = async pin => {
    const args = { pinId: pin._id };
    const { deletePin } = await graphqlClient.request(deletePinMutation, args);
    dispatch({ type: 'DELETE_PIN', payload: deletePin });
    setPopup(null);
  };

  const highlightNewPin = pin => {
    const isNewPin = differenceInMinutes(Date.now(), new Date(pin.createdAt).getTime()) <= 30;
    return isNewPin ? 'dodgerblue' : 'blueviolet';
  };

  const isPinOwner = () => state.currentUser._id === popup.author._id;

  return (
    <div className={classes.root}>
      <ReactMapGL
        {...viewport}
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken={accessToken}
        onViewportChange={newViewport => setViewport(newViewport)}
        onClick={handleMapClick}
      >
        <div className={classes.navigationControl}>
          <NavigationControl onViewportChange={newViewport => setViewport(newViewport)} />
        </div>
        {currentPosition && (
          <Marker
            latitude={currentPosition.latitude}
            longitude={currentPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="red" />
          </Marker>
        )}
        {state.pins.map(pin => (
          <Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color={highlightNewPin(pin)} onClick={() => handlePinClick(pin)} />
          </Marker>
        ))}
        {popup && (
          <Popup
            anchor="top"
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnclick={false}
            onClose={() => setPopup(null)}
          >
            <img className={classes.popupImage} src={popup.image} alt={popup.title} />
            <div className={classes.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
              </Typography>
              {isPinOwner && (
                <IconButton onClick={() => handleDeletePinButtonClick(popup)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          </Popup>
        )}
        {state.draftPin && (
          <Marker
            latitude={state.draftPin.latitude}
            longitude={state.draftPin.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="fuchsia" />
          </Marker>
        )}
      </ReactMapGL>
      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: 'flex',
  },
  rootMobile: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  navigationControl: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1em',
  },
  popupImage: {
    padding: '0.4em',
    height: 200,
    width: 200,
    objectFit: 'cover',
  },
  popupTab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
};

export default withStyles(styles)(Map);
