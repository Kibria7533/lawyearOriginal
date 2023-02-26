import {
  SET_CATEGORY_WITH_SUBCATEGORY_AND_QUESTION,
  SET_DRAFT_LIST,
  SET_SUBCATEGORY,
  DELETE_CLIENT,
  DELETE_DRAFT_DATA,
} from "../constants";

const initialState = {
  list: [],
  categoryList: [],
  subcategoryList: [],
  draftData: [],
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    // case ADD_CLIENT: {
    //   return { ...state, list: [payload, ...state.list] };
    // }
    case DELETE_CLIENT: {
      return {
        ...state,
        list: state?.list?.filter(({ id }) => id !== payload),
      };
    }
    // PAYLOAD WILL RECEIVE CATEGORY LIST
    case SET_CATEGORY_WITH_SUBCATEGORY_AND_QUESTION: {
      return { ...state, categoryList: payload };
    }
    // PAYLOAD WILL RECEIVE SINGLE CATEGORY ID
    case DELETE_DRAFT_DATA: {
      // console.log(payload)
      const list = state.draftData?.filter(
        ({ tempId }) => tempId !== payload.tempId
      );
      return {
        ...state,
        draftData: [...list],
      };
    }
    case SET_DRAFT_LIST: {
      return {
        ...state,
        draftData: Array.isArray(payload.list) ? [...payload.list] : [],
      };
    }
    case SET_SUBCATEGORY: {
      return {
        ...state,
        subcategoryList: payload,
      };
    }
    default: {
      return state;
    }
  }
};
