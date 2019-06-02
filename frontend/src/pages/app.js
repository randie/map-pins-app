import React from 'react';
import Header from '../components/header';
import Map from '../components/map';
import withRoot from '../with-root';

const App = () => {
  return (
    <>
      <Header />
      <Map />
    </>
  );
};

export default withRoot(App);
