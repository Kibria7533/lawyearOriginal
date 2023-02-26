import {
  SET_CATEGORY_LIST,
  DELETE_CATEGORY,
  ADD_CATEGORY,
  UPDATE_CATEGORY_NAME,
  ADD_QUESTION,
  DELETE_QUESTION,
  UPATE_QUESTION,
  REORDER_QUESTIONS,
} from "../constants";

const initialState = {
  list: [],
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    // PAYLOAD WILL RECEIVE CATEGORY LIST
    case SET_CATEGORY_LIST: {
      return { ...state, list: payload };
    }
    // PAYLOAD WILL RECEIVE SINGLE CATEGORY ID
    case DELETE_CATEGORY: {
      const list = state?.list?.filter(
        (item) => String(item.id) !== String(payload.id)
      );
      return {
        ...state,
        list,
      };
    }
    // PAYLOAD WILL RECEIVE SINGLE CATEGORY OBJECT
    case ADD_CATEGORY: {
      const list = [...state?.list];
      list.shift(payload);
      return {
        ...state,
        list,
      };
    }
    // PAYLOAD WILL RECEIVE SINGLE CATEGORY ID AND NAME
    case UPDATE_CATEGORY_NAME: {
      const list = state?.list?.map((item) => {
        if (String(item.id) === String(payload.id)) {
          item.name = payload.name;
        }
        return item;
      });
      return {
        ...state,
        list,
      };
    }
    case ADD_QUESTION: {
      const list = state?.list?.map((item) => {
        if (String(item.id) === String(payload?.categoryId)) {
          item.questions.push(payload);
        }
        return item;
      });
      return {
        ...state,
        list,
      };
    }
    case UPATE_QUESTION: {
      const list = state?.list?.map((item) => {
        if (String(item.id) === String(payload?.categoryId)) {
          const questions = item.questions.map((innerItem) => {
            if (String(innerItem.id) === String(payload?.id)) {
              innerItem.ques = payload.ques;
            }
            return innerItem;
          });
          item.questions = questions;
        }
        return item;
      });
      return {
        ...state,
        list,
      };
    }
    case DELETE_QUESTION: {
      const list = state?.list?.map((item) => {
        if (String(item.id) === String(payload?.categoryId)) {
          const questions = item.questions.filter(
            (innerItem) => String(innerItem.id) !== String(payload?.id)
          );
          item.questions = questions;
        }
        return item;
      });
      return {
        ...state,
        list,
      };
    }
    case REORDER_QUESTIONS: {
      const list = state?.list?.map((item) => {
        if (String(item.id) === String(payload?.categoryId)) {
          item.questions = payload.items;
        }
        return item;
      });
      return {
        ...state,
        list,
      };
    }
    default: {
      return state;
    }
  }
};
