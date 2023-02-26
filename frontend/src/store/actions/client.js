import { notification } from "antd";
import api from "../../api";
import { endpoint } from "../../config";
// import { ADD_CLIENT } from "../constants";

export const AddDraft = async (payload) => {
  try {
    const data = await api.post(endpoint.add_draft, payload);
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
    // console.log(error);
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};
export const deleteDraft = async (payload) => {
  try {
    const data = await api.delete(endpoint.delete_draft, payload);
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
    return data.success;
  } catch (error) {
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};
export const getDraflist = async () => {
  try {
    const data = await api.get(endpoint.draft_list);
    return data?.list || [];
  } catch (error) {
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};
export const addClient = async (payload) => {
  try {
    const data = await api.post(endpoint.add_client, payload);
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

export const onUpdateRemainder = async (payload) => {
  try {
    const data = await api.post(endpoint.update_remainder, payload);
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

export const getClients = async (filterBy) => {
  try {
    const data = await api.get(endpoint.client_list, filterBy);
    if (data.success) {
      return data.list;
      // dispatch({
      //   type: ADD_CLIENT,
      //   payload: data.client,
      // });
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const getAlertList = async () => {
  try {
    const data = await api.get(endpoint.alter_list);
    if (data.success) {
      return data.list;
      // dispatch({
      //   type: ADD_CLIENT,
      //   payload: data.client,
      // });
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    notification.warning({
      message: error?.response?.data?.err || "Something went wrong",
      placement: "bottomRight",
    });
  }
};

export const onDeleteClient = async (id) => {
  try {
    const data = await api.delete(endpoint.delete_client, { id });
    if (data.success) {
      notification.success({
        message: data.message,
        placement: "bottomRight",
      });
      return true;
      // dispatch({
      //   type: ADD_CLIENT,
      //   payload: data.client,
      // });
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

export const onUpdateClientStatus = async (payload) => {
  try {
    const data = await api.post(endpoint.update_client_status, payload);
    if (data.success) {
      notification.success({
        message: data.message,
        placement: "bottomRight",
      });
      return true;
      // dispatch({
      //   type: ADD_CLIENT,
      //   payload: data.client,
      // });
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
