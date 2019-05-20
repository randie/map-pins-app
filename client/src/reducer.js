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
    case 'CREATE_DRAFT_PIN':
      return {
        ...state,
        draftPin: {
          latitude: 0,
          longitude: 0,
        },
      };
    case 'UPDATE_DRAFT_PIN':
      return {
        ...state,
        draftPin: payload,
      };
    case 'DISCARD_DRAFT_PIN':
      return {
        ...state,
        draftPin: null,
      };
    default:
      return state;
  }
};
