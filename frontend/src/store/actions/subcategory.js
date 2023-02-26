import { notification } from "antd";
import api from "../../api";
import { endpoint } from "../../config";
import {
  EDIT_SUBCATEGORY_NAME,
  ADD_SUBCATEGORY_QUES,
  ADD_SUBCATEGORY_DOCU,
  DELETE_SUBCATEGORY,
  UPDATE_DOCUMENT,
  DELETE_DOCUMENT,
  DELETE_QUESTION_SUBCATEGORY,
  UPDATE_QUESTION_SUBCATEGORY,
  REORDER_SUBCATEGORY_QUESTIONS,
} from "../constants";

export const fetchAllSubcategoryWithCategory = async () => {
  try {
    const data = await api.get(endpoint.fetch_all_subcategory);
    return data;
  } catch (error) {
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const newSubcategory = async (payload) => {
  try {
    const data = await api.post(endpoint.create_subcategory, payload);
    return data;
  } catch (error) {
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const updateSubcateogry = (payload) => async (dispatch) => {
  try {
    const data = await api.post(endpoint.name_subcategory_update, {
      id: payload.id,
      name: payload.name,
    });
    if (data.success) {
      dispatch({
        type: EDIT_SUBCATEGORY_NAME,
        payload: payload,
      });
      notification.success({
        message: data?.message,
        placement: "bottomRight",
      });
    }
  } catch (error) {
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const addQuestionSubcategory = (payload) => async (dispatch) => {
  try {
    const data = await api.post(endpoint.add_question_subcategory, {
      subcategoryId: payload.subcategoryId,
      ques: payload?.ques,
      options: payload?.options,
      type: payload?.type,
      position: payload?.position,
    });
    if (data.success) {
      if (payload.shouldDispatch !== false) {
        dispatch({
          type: ADD_SUBCATEGORY_QUES,
          payload: { ...data.question, categoryId: payload.categoryId },
        });
      }
      notification.success({
        message: data?.message,
        placement: "bottomRight",
      });
      return data.question;
    }
  } catch (error) {
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const addDocumentSubcategory = (payload) => async (dispatch) => {
  try {
    const data = await api.post(endpoint.add_document, {
      subcategoryId: payload.subcategoryId,
      name: payload.name,
    });
    console.log(data);
    if (data.success) {
      if (payload.shouldDispatch !== false) {
        dispatch({
          type: ADD_SUBCATEGORY_DOCU,
          payload: { ...payload, document: data.document },
        });
      }
      notification.success({
        message: data?.message,
        placement: "bottomRight",
      });
      return data.document;
    }
  } catch (error) {
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const deleteSubcategory = (payload) => async (dispatch) => {
  try {
    const data = await api.delete(endpoint.delete_subcategory, {
      subcategoryId: payload.subcategoryId,
    });
    if (data.success) {
      dispatch({
        type: DELETE_SUBCATEGORY,
        payload: payload,
      });
      notification.success({
        message: data?.message,
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

// document
export const updateDocument = (payload) => async (dispatch) => {
  try {
    const data = await api.put(endpoint.update_document, {
      id: payload.id,
      name: payload.name,
    });
    if (data.success) {
      dispatch({
        type: UPDATE_DOCUMENT,
        payload: payload,
      });
      notification.success({
        message: data?.message,
        placement: "bottomRight",
      });
    }
  } catch (error) {
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const deleteDocument = (payload) => async (dispatch) => {
  try {
    const data = await api.delete(endpoint.delete_document, {
      id: payload.id,
    });
    if (data.success) {
      console.log("dfdfdfd");
      notification.success({
        message: data?.message,
        placement: "bottomRight",
      });
      dispatch({
        type: DELETE_DOCUMENT,
        payload: payload,
      });
    }
  } catch (error) {
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const deleteQuestionSubCategory = (payload) => async (dispatch) => {
  try {
    const data = await api.delete(endpoint.delete_question, {
      id: payload.id,
      subcategoryId: payload.subcategoryId,
    });
    if (data.success) {
      notification.success({
        message: data?.message,
        placement: "bottomRight",
      });
      dispatch({
        type: DELETE_QUESTION_SUBCATEGORY,
        payload: payload,
      });
    }
  } catch (error) {
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const updateQuestionSubcategory = (payload) => async (dispatch) => {
  try {
    const data = await api.post(endpoint.update_question, {
      subcategoryId: payload.subcategoryId,
      id: payload.id,
      ques: payload.ques,
    });
    if (data.success) {
      dispatch({
        type: UPDATE_QUESTION_SUBCATEGORY,
        payload: payload,
      });
      notification.success({
        message: data?.message,
        placement: "bottomRight",
      });
    }
  } catch (error) {
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const subcategoryQuestionPositionUpdate =
  ({ ids, categoryId, items, subcategoryId }) =>
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
          type: REORDER_SUBCATEGORY_QUESTIONS,
          payload: { categoryId, items, subcategoryId },
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
