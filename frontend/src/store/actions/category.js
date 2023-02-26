import { notification } from "antd";
import api from "../../api";
import { endpoint } from "../../config";
import {
  ADD_QUESTION,
  DELETE_CATEGORY,
  DELETE_QUESTION,
  SET_CATEGORY_LIST,
  UPATE_QUESTION,
  UPDATE_CATEGORY_NAME,
  REORDER_QUESTIONS,
} from "../constants";

export const createCategory = async (categoryData) => {
  try {
    const data = await api.post(endpoint.create_category, categoryData);
    if (data.success) {
      notification.success({
        message: data.message,
        placement: "bottomRight",
      });
    } else {
      notification.error({
        message: data.message,
        placement: "bottomRight",
      });
    }
    return data;
  } catch (error) {
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const updateCategoryName = (categoryData) => async (dispatch) => {
  try {
    const data = await api.post(endpoint.update_category, categoryData);
    if (data.success) {
      notification.success({
        message: data.message,
        placement: "bottomRight",
      });
      dispatch({
        type: UPDATE_CATEGORY_NAME,
        payload: categoryData,
      });
    } else {
      notification.error({
        message: data.message,
        placement: "bottomRight",
      });
    }
    return data;
  } catch (error) {
    console.log(error);
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const addQuestion = (addQuestionData) => async (dispatch) => {
  try {
    const data = await api.post(endpoint.add_question, addQuestionData);
    if (data.success) {
      notification.success({
        message: data.message,
        placement: "bottomRight",
      });
      dispatch({
        type: ADD_QUESTION,
        payload: data.question,
      });
    } else {
      notification.error({
        message: data.message,
        placement: "bottomRight",
      });
    }
    return data;
  } catch (error) {
    console.log(error);
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const updateQuestion = (updateQuestionData) => async (dispatch) => {
  try {
    const data = await api.post(endpoint.update_question, updateQuestionData);
    if (data.success) {
      notification.success({
        message: data.message,
        placement: "bottomRight",
      });
      dispatch({
        type: UPATE_QUESTION,
        payload: updateQuestionData,
      });
    } else {
      notification.error({
        message: data.message,
        placement: "bottomRight",
      });
    }
    return data;
  } catch (error) {
    console.log(error);
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};
export const deleteQuestion =
  ({ id, categoryId }) =>
  async (dispatch) => {
    try {
      const data = await api.delete(endpoint.delete_question, { id });
      if (data.success) {
        notification.success({
          message: data.message,
          placement: "bottomRight",
        });
        dispatch({
          type: DELETE_QUESTION,
          payload: { id, categoryId },
        });
      } else {
        notification.error({
          message: data.message,
          placement: "bottomRight",
        });
      }
      return data;
    } catch (error) {
      console.log(error);
      notification.warning({
        message: error?.response?.data?.err || "Something went wrong",
        placement: "bottomRight",
      });
    }
  };

export const fetchCategories = () => async (dispatch) => {
  try {
    const data = await api.get(endpoint.get_category);
    if (data.success) {
      dispatch({
        type: SET_CATEGORY_LIST,
        payload: data.category,
      });
      return data.category;
    }
  } catch (error) {
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const deleteSingleCategory = (categoryId) => async (dispatch) => {
  try {
    const data = await api.delete(endpoint.delete_category, { categoryId });
    if (data.success) {
      dispatch({
        type: DELETE_CATEGORY,
        payload: { id: categoryId },
      });
      notification.success({
        message: data.message,
        placement: "bottomRight",
      });
    } else {
      notification.error({
        message: data.message,
        placement: "bottomRight",
      });
    }
    return;
  } catch (error) {
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
  return;
};

export const fetchQuesSuggestions = async (name) => {
  try {
    const data = await api.get(endpoint.questions_suggestion, name);
    return data.questions;
  } catch (error) {
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const questionPositionUpdate =
  ({ ids, categoryId, items }) =>
  async (dispatch) => {
    try {
      const data = await api.put(endpoint.category_question_serialize, {
        ids: ids,
      });
      if (data.success) {
        notification.success({
          message: data?.message,
          placement: "bottomRight",
        });
        dispatch({
          type: REORDER_QUESTIONS,
          payload: { categoryId, items },
        });
        return true;
      } else {
        notification.warn({
          message: "Something went wrong",
          placement: "bottomRight",
        });
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  };
