import { LOGIN_USER, LOGOUT_USER } from "../constants";
import { notification } from "antd";
import api from "../../api";
import { endpoint, adminendpoint } from "../../config";

const msg = 'Something went wrong!';

// registration
export const RegisterUser = async (userInfo) => {
  try {
    const data = await api.post(endpoint.signup, userInfo);
    if (data.success) {
      // notification.success({
      //   message: data?.message || "Account created successfully",
      //   placement: "bottomRight",
      // });
     return true
    } else {
      notification.error({
        message: data.err.message || msg,
        placement: "bottomRight",
      });
    }
  } catch (error) {
    notification.error({
      message: error?.response?.data?.err || msg,
      placement: "bottomRight",
    });
  }
};


//admin registration
export const adminRegister = async (userInfo) => {
  try {
    const data = await api.post(adminendpoint.admin_register, userInfo);
    if (data.token) {
      notification.success({
        message: "Account created successfully",
        placement: "bottomRight",
      });
     return true
    } else if (!data.status) {
      notification.error({
        message: data.message,
        placement: "bottomRight",
      });
    }
  } catch (error) {
    notification.error({
      message: error?.response?.data?.err || msg,
      placement: "bottomRight",
    });
  }
};

// logout action
export const LogoutUser = () => (dispatch) => {
  dispatch({
    type: LOGOUT_USER,
  });
};

// login action
export const LoginUser = (payload={}) => async (dispatch) => {
  try {
    const data = await api.post(endpoint.login, payload);

    if (data.token) {
      // notification.success({
      //   message: "Login success",
      //   placement: "bottomRight",
      // });
      dispatch({
        type: LOGIN_USER,
        payload: data,
      });
    }
    else{
      notification.warn({
        message: data.message,
        placement: "bottomRight",
      });
    }
  } catch (error) {
    notification.error({
      message: error?.response?.data?.err || msg,
      placement: "bottomRight",
    });
  }
};

// google login
export const googleLoginUser = (payload={}) => async (dispatch) => {
  try {
    const data = await api.post(endpoint.google_auth, payload);
    if (data.token) {
      notification.success({
        message: "Login success",
        placement: "bottomRight",
      });
      dispatch({
        type: LOGIN_USER,
        payload: data,
      });
    }
  } catch (error) {
    notification.error({
      message: error?.response?.data?.err || msg,
      placement: "bottomRight",
    });
  }
};

// facebook login

export const facebookLoginUser = (payload={}) => async (dispatch) => {
  try {
    const data = await api.post(endpoint.facebook_auth, payload);
    if (data.token) {
      notification.success({
        message: "Login success",
        placement: "bottomRight",
      });
      dispatch({
        type: LOGIN_USER,
        payload: data,
      });
    }
  } catch (error) {
    notification.error({
      message: error?.response?.data?.err || msg,
      placement: "bottomRight",
    });
  }
};


//forgot password

export const forgotPassword = async(email)=>{
  try {
    const data = await api.post(endpoint.forgot_password, email);
    if(data.success){
      notification.success({
        message: data.message,
        placement: 'bottomRight'
      })
    }
    else {
      notification.error({
        message: data,
        placement: 'bottomRight'
      })
    }
  } catch (error) {
    notification.warning({
      message: error?.response?.data?.err || 'Something went wrong',
      placement: 'bottomRight'
    })
  }
}


// check existing user
export const checkExistingUser = async(userId)=>{
  try {
    const data = await api.post(endpoint.existsUser, {user_id: userId});
    return data;
  } catch (error) {
    notification.warning({
      message: error?.response?.data?.err || msg,
      placement: 'bottomRight'
    })
  }
} 


// reset password
export const resetPassword = async(payload)=>{
  try {
    const data = await api.put(endpoint.reset_password+`/${payload.token}`, {pass:payload.pass})
    if(data.success){
      notification.success({
        message: data.message,
        placement: 'bottomRight'
      })
      return true
    }
    else {
      notification.error({
        message: data.msg,
        placement: 'bottomRight'
      })
    }
  } catch (error) {
    notification.error({
      message: error?.response?.data?.err || msg,
      placement: "bottomRight",
    });
  }
} 
