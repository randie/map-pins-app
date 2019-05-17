import { createContext } from 'react';

const Context = createContext({
  currentUser: null,
  isLoggedIn: false,
});

export default Context;
