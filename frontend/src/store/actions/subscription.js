import {notification} from "antd";
import api from "../../api";
import {endpoint} from "../../config";
import {
    SET_CURRENT_SUBSCRIPTION,
    UPDATE_SUBSCRIPTION
} from "../constants";

export const getCurrentSubscription = (subscriptionId) => async (dispatch) => {
    try {
        const data = await api.get(endpoint.subscriptions+subscriptionId);
        if (data.success) {
            dispatch({
                type: SET_CURRENT_SUBSCRIPTION,
                payload: data.subscription,
            });
            return data.subscription;
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

export const getPaymentMethods = () => async (dispatch) => {
    try {
        const data = await api.get(endpoint.payment_methods_list);
        if (data.success) {
            /*dispatch({
                type: SET_CURRENT_SUBSCRIPTION,
                payload: data.paymentMethods,
            });*/
            return data.paymentMethods;
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
}

export const createPaymentMethod = (body) => async (dispatch) => {
    try {
        const data = await api.post(endpoint.payment_methods_create,body);
        if (data.success) {
            notification.success({
                message: "Successfully Added",
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
}

export const getInvoices = () => async (dispatch) => {
    try {
        const data = await api.get(endpoint.invoice_list);
        if (data.success) {
            /*dispatch({
                type: SET_CURRENT_SUBSCRIPTION,
                payload: data.paymentMethods,
            });*/
            return data.invoices;
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
}

export const detachPaymentMethod = (paymentMethodId) => async (dispatch) => {
    try {
        const data = await api.delete(endpoint.payment_method_delete,paymentMethodId);
        if (data.success) {
            notification.success({
                message: "Successfully deleted",
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
}

export const createPaymentSession = (subscriptionPlan, quantity) => async (dispatch) => {
    try {
        const data = await api.post(endpoint.checkout_session,{
            subscriptionPlan : subscriptionPlan,
            quantity : quantity
        });
        if (data.success) {
            // Redirect to payment link
            window.open(data.session.url, "_blank")
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
}



