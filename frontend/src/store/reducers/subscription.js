import {
  SET_CURRENT_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION
} from "../constants";

const initialState = {
  subscription: {},
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    // PAYLOAD WILL RECEIVE CATEGORY LIST
    case SET_CURRENT_SUBSCRIPTION: {
      return {
        ...payload,
      };
    }

    default: {
      return state;
    }
  }
};
