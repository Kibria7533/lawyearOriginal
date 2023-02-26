import { notification } from "antd";
import api from "../../api";
import { endpoint } from "../../config";

export const addComment = async (payload) => {
  try {
    console.log(payload)
    const res = await api.post(endpoint.add_comment, payload);
    if (res.success) {
      return res;
    } else {
      notification.warn({
        message: res.message,
        placement: "bottomRight",
      });
      return res;
    }
  } catch (error) {
    console.log(error.response);
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};
export const deleteComment = async (payload) => {
  try {
    const res = await api.delete(endpoint.delete_comment, payload);
    if (res.success) {
      return res;
    } else {
      notification.warn({
        message: res.message,
        placement: "bottomRight",
      });
      return res;
    }
  } catch (error) {
    console.log(error.response);
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};
export const editComment = async (payload) => {
  try {
    const res = await api.put(endpoint.edit_comment, payload);
    if (res.success) {
      return res;
    } else {
      notification.warn({
        message: res.message,
        placement: "bottomRight",
      });
      return res;
    }
  } catch (error) {
    console.log(error.response);
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};
export const addQustionOnRequest = async (payload) => {
  try {
    const res = await api.post(endpoint.add_ques_on_req, payload);
    if (res.success) {
      notification.success({
        message: res.message,
        placement: "bottomRight",
      });
      return res;
    } else {
      notification.warn({
        message: res.message,
        placement: "bottomRight",
      });
      return res;
    }
  } catch (error) {
    console.log(error.response);
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const addDocumentOnRequest = async (payload) => {
  try {
    const res = await api.post(endpoint.add_doc_on_req, payload);
    if (res.success) {
      notification.success({
        message: res.message,
        placement: "bottomRight",
      });
      return res;
    } else {
      notification.warn({
        message: res.message,
        placement: "bottomRight",
      });
      return res;
    }
  } catch (error) {
    console.log(error.response);
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const submitRequest = async (payload) => {
  try {
    const res = await api.post(endpoint.request_submit, payload);
    if (res.success) {
      notification.success({
        message: res.message,
        placement: "bottomRight",
      });
      return res;
    } else {
      notification.warn({
        message: res.message,
        placement: "bottomRight",
      });
      return res;
    }
  } catch (error) {
    console.log(error.response);
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const fileUploadDoc = async (payload) => {
  try {
    const data = await api.post(endpoint.file_upload, payload);
    if (data.success) {
      // notification.success({
      //   message: data.message,
      //   placement: "bottomRight",
      // });
      return data;
    } else {
      notification.error({
        message: data.message,
        placement: "bottomRight",
      });
      return false;
    }
  } catch (error) {
    console.log(error);
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};
