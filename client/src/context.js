import { createContext } from 'react';

const Context = createContext({
  currentUser: null,
  isLoggedIn: false,
  draftPin: null,
});

export default Context;
