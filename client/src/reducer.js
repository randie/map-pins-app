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
        selectedPin: null,
      };
    case 'DISCARD_DRAFT_PIN':
      return {
        ...state,
        draftPin: null,
      };
    case 'GET_PINS':
      return {
        ...state,
        pins: payload,
      };
    case 'CREATE_PIN': {
      const newPin = payload;
      const pins = state.pins.filter(pin => pin._id !== newPin._id);
      return {
        ...state,
        pins: [...pins, newPin],
      };
    }
    case 'DELETE_PIN': {
      const deletedPin = payload;
      const remainingPins = state.pins.filter(pin => pin._id !== deletedPin._id);
      return {
        ...state,
        pins: remainingPins,
        selectedPin: null,
      };
    }
    case 'SET_SELECTED_PIN':
      return {
        ...state,
        selectedPin: payload,
        draftPin: null,
      };
    case 'CREATE_COMMENT': {
      const pinWithNewComment = payload;
      const pins = state.pins.map(pin =>
        pin._id === pinWithNewComment._id ? pinWithNewComment : pin,
      );
      return {
        ...state,
        pins,
        selectedPin: pinWithNewComment,
      };
    }
    default:
      return state;
  }
};
