export default (state, { type, payload }) => {
  switch (type) {
    case 'LOGIN':
      return {
        ...state,
        currentUser: payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
        isLoggedIn: false,
      };
    case 'SET_IS_LOGGED_IN':
      return {
        ...state,
        isLoggedIn: payload,
      };
    default:
      return state;
  }
};
