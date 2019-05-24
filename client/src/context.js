import { createContext } from 'react';

const Context = createContext({
  currentUser: null,
  isLoggedIn: false,
  draftPin: null,
  pins: [],
});

export default Context;
