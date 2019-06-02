import { createContext } from 'react';

const Context = createContext({
  currentUser: null,
  isLoggedIn: false,
  pins: [],
  selectedPin: null,
  draftPin: null,
});

export default Context;
