import React, { useEffect, useState } from 'react';
import ReactMapGL, { NavigationControl } from 'react-map-gl';
import { withStyles } from '@material-ui/core/styles';
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const accessToken =
  'pk.eyJ1IjoicmFuZGllIiwiYSI6ImNqdnJ1M29nbDJ5NGw0YW11YTg5cmkyZ24ifQ.T-CIaru7GAEfY6iSTwdRGg';

const initialViewport = {
  latitude: 40.014984,
  longitude: -105.270546,
  zoom: 13,
};

const Map = ({ classes }) => {
  const [viewport, setViewport] = useState(initialViewport);
  const [currentPosition, setCurrentPosition] = useState(null); // user's current position

  useEffect(() => getCurrentPosition(), []);

  const getCurrentPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setCurrentPosition({ latitude, longitude });
      });
    }
  };

  return (
    <div className={classes.root}>
      <ReactMapGL
        {...viewport}
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken={accessToken}
        onViewportChange={newViewport => setViewport(newViewport)}
      >
        <div className={classes.navigationControl}>
          <NavigationControl onViewportChange={newViewport => setViewport(newViewport)} />
        </div>
        <h2 style={{ float: 'right' }}>{JSON.stringify(currentPosition)}</h2>
      </ReactMapGL>
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
  deleteIcon: {
    color: 'red',
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
