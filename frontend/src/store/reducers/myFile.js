import {
  SET_MY_FILE_DETAILS,
  UPDATE_SINGLE_DOCUMENT_ANSWER,
  UPDATE_SINGLE_QUESTION_ANSWER,
} from "../constants";

const initialState = {
  request: {},
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  console.log(payload)
  switch (type) {
    case SET_MY_FILE_DETAILS: {
      return { ...state, request: payload };
    }
    case UPDATE_SINGLE_QUESTION_ANSWER: {
      const data = state?.request;
      const questions = data?.request_questions?.map((item) => {
        console.log(item)
        if (item.id === payload.id) {
          item.request_question_answers = [
            payload,
            ...item.request_question_answers,
          ];
        }
        return item;
      });
      return {
        ...state,
        request: {
          ...data,
          request_questions: questions,
          quesFillupCount: data?.reAsign
            ? state?.request?.quesFillupCount
            : state?.request?.quesFillupCount + 1,
        },
      };
    }
    case UPDATE_SINGLE_DOCUMENT_ANSWER: {
      const data = state?.request;
      const documents = data?.request_documents?.map((item) => {
        if (item.id === payload.id) {
          item.request_document_answer = {
            link: payload.fileName,
          };
        }
        return item;
      });
      return {
        ...state,
        request: {
          ...data,
          request_documents: documents,
          docFillupCount: data?.reAsign
            ? state?.request?.docFillupCount
            : state?.request?.docFillupCount + 1,
        },
      };
    }
    default: {
      return state;
    }
  }
};
