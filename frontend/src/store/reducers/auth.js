import { LOGOUT_USER, LOGIN_USER } from "../constants";

const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGOUT_USER: {
      return initialState;
    }

    case LOGIN_USER: {
      console.log(payload);
      return {
        ...payload,
      };
    }
    default: {
      return state;
    }
  }
};
