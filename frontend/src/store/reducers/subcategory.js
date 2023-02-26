import {
  SET_SUBCATEGORY_LIST,
  EDIT_SUBCATEGORY_NAME,
  ADD_SUBCATEGORY_QUES,
  ADD_SUBCATEGORY_DOCU,
  DELETE_SUBCATEGORY,
  UPDATE_DOCUMENT,
  DELETE_QUESTION_SUBCATEGORY,
  DELETE_DOCUMENT,
  // UPATE_QUESTION_SUBCATEGORY,
  UPDATE_QUESTION_SUBCATEGORY,
  REORDER_SUBCATEGORY_QUESTIONS,
} from "../constants";

const initialState = {
  list: [],
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    // PAYLOAD WILL RECEIVE CATEGORY LIST
    case SET_SUBCATEGORY_LIST: {
      return { ...state, list: payload };
    }
    // PAYLOAD WILL RECEIVE SINGLE CATEGORY ID
    case DELETE_SUBCATEGORY: {
      const list = state?.list?.map((item) => {
        if (item.id === payload.categoryId) {
          const subcategory = item.subcategories.filter(
            (sub) => sub.id !== payload.subcategoryId
          );
          item.subcategories = subcategory;
        }
        return item;
      });
      return {
        ...state,
        list,
      };
    }
    // PAYLOAD WILL RECEIVE SINGLE CATEGORY OBJECT
    // case ADD_CATEGORY: {
    //   const list = [...state?.list];
    //   list.shift(payload);
    //   return {
    //     ...state,
    //     list,
    //   };
    // }
    //   // PAYLOAD WILL RECEIVE SINGLE CATEGORY ID AND NAME
    case EDIT_SUBCATEGORY_NAME: {
      const list = state?.list?.map((item) => {
        if (String(item.id) === String(payload.categoryId)) {
          const subcategory = item.subcategories.map((subcategory) => {
            if (String(subcategory.id) === String(payload.id)) {
              subcategory.name = payload.name;
            }
            return subcategory;
          });
          // console.log(item.subcategories, subcategory)
          item.subcategories = subcategory;
        }
        console.log(item);
        return item;
      });
      console.log(list);
      return {
        ...state,
        list,
      };
    }
    case ADD_SUBCATEGORY_QUES: {
      console.log(payload);
      const list = state?.list?.map((item) => {
        if (String(item.id) === String(payload?.categoryId)) {
          const subcategory = item.subcategories.map((subcategory) => {
            if (subcategory.id === payload.subcategoryId) {
              subcategory.questions.push({ ...payload });
            }
            return subcategory;
          });
          console.log(subcategory);
          item.subcategories = subcategory;
        }
        return item;
      });
      return {
        ...state,
        list: [...list],
      };
    }
    case ADD_SUBCATEGORY_DOCU: {
      const list = state?.list?.map((item) => {
        if (String(item.id) === String(payload?.categoryId)) {
          const subcategory = item.subcategories.map((subcategory) => {
            if (subcategory.id === payload.subcategoryId) {
              subcategory.documents.push(payload.document);
            }
            return subcategory;
          });
          item.subcategories = subcategory;
        }
        return item;
      });
      return {
        ...state,
        list,
      };
    }
    case UPDATE_QUESTION_SUBCATEGORY: {
      const list = state?.list?.map((item) => {
        if (String(item.id) === String(payload?.categoryId)) {
          const subcategory = item.subcategories.map((innerItem) => {
            if (String(innerItem.id) === String(payload?.subcategoryId)) {
              const question = innerItem.questions.map((ques) => {
                if (ques.id === payload.id) {
                  ques.ques = payload.ques;
                }
                return ques;
              });
              innerItem.questions = question;
            }
            return innerItem;
          });
          item.subcategories = subcategory;
        }
        return item;
      });
      return {
        ...state,
        list,
      };
    }
    case UPDATE_DOCUMENT: {
      const list = state?.list?.map((item) => {
        if (String(item.id) === String(payload?.categoryId)) {
          const subcategory = item.subcategories.map((innerItem) => {
            if (String(innerItem.id) === String(payload?.subcategoryId)) {
              const document = innerItem.documents.map((doc) => {
                if (doc.id === payload.id) {
                  doc.name = payload.name;
                }
                return doc;
              });
              innerItem.documents = document;
            }
            return innerItem;
          });
          item.subcategories = subcategory;
        }
        return item;
      });
      return {
        ...state,
        list,
      };
    }
    case DELETE_QUESTION_SUBCATEGORY: {
      const list = state?.list?.map((item) => {
        if (String(item.id) === String(payload?.categoryId)) {
          const subcategory = item.subcategories.map((sub) => {
            if (sub.id === payload.subcategoryId) {
              const question = sub.questions.filter(
                (ques) => ques.id !== payload.id
              );
              sub.questions = question;
            }
            return sub;
          });
          item.subcategories = subcategory;
        }
        return item;
      });
      return {
        ...state,
        list,
      };
    }

    case DELETE_DOCUMENT: {
      const list = state?.list?.map((item) => {
        if (String(item.id) === String(payload?.categoryId)) {
          const subcategory = item.subcategories.map((sub) => {
            if (sub.id === payload.subcategoryId) {
              const document = sub.documents.filter(
                (doc) => doc.id !== payload.id
              );
              sub.documents = document;
            }
            return sub;
          });
          item.subcategories = subcategory;
        }
        return item;
      });
      return {
        ...state,
        list,
      };
    }
    case REORDER_SUBCATEGORY_QUESTIONS: {
      const list = state?.list?.map((item) => {
        if (String(item.id) === String(payload?.categoryId)) {
          const subcategory = item.subcategories.map((subcategory) => {
            if (subcategory.id === payload.subcategoryId) {
              subcategory.questions = payload.items;
            }
            return subcategory;
          });
          item.subcategories = subcategory;
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
