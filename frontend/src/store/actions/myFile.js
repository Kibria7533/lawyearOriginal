import { notification } from "antd";
import api from "../../api";
import { endpoint } from "../../config";
import {
  SET_MY_FILE_DETAILS,
  UPDATE_SINGLE_DOCUMENT_ANSWER,
  UPDATE_SINGLE_QUESTION_ANSWER,
} from "../constants";

export const FetchSingleFileDetails = (id) => async (dispatch) => {
  const res = await api.get(endpoint.single_request + id);
  dispatch({
    type: SET_MY_FILE_DETAILS,
    payload: res?.request,
  });
};

export const UpdateSingleQuestionAnswer = (data) => async (dispatch) => {
  const params = {
    requestQuestionId: data?.id,
    ans: data?.ans,
    request_id: data?.requestId,
    reAsign: data.reAsign,
  };
  const res = await api.post(endpoint.add_ques_ans, params);
  if (res.success) {
    dispatch({
      type: UPDATE_SINGLE_QUESTION_ANSWER,
      payload: data,
    });
    notification.success({
      message: res.message,
      placement: "bottomRight",
    });
  }
};

export const UpdateSingleDocAnswer = (data) => async (dispatch) => {
  const params = {
    requestDocumentId: data?.id,
    link: data?.fileName,
    request_id: data?.requestId,
    reAsign: data.reAsign,
  };
  const res = await api.post(endpoint.add_doc_upload, params);
  if (res.success) {
    notification.success({
      message: res.message,
      placement: "bottomRight",
    });
    dispatch({
      type: UPDATE_SINGLE_DOCUMENT_ANSWER,
      payload: data,
    });
  }
};
