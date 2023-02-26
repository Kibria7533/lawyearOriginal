import store from "../store";
import axios from "axios";
import { API_ENDPOINT } from "../config";
import { LogoutUser } from "../store/actions";
// import { useDispatch } from "react-redux";
axios.defaults.baseURL = API_ENDPOINT;

// errorComposer will compose a handleGlobally function
const errorComposer = (error) => {
  const statusCode = error.response ? error.response.status : null;
  if (statusCode === 401) {
    console.log("Please login to access this resource");
    store.dispatch(LogoutUser());
  }
  return () => {
    // const statusCode = error.response ? error.response.status : null;
    // if (statusCode === 404) {
    //   notifier.error(
    //     "The requested resource does not exist or has been deleted"
    //   );
    // }
    // console.log({statusCode})
    //     if (statusCode === 401) {
    //       console.log("Please login to access this resource");
    //     }
  };
};

axios.interceptors.response.use(undefined, function (error) {
  error.handleGlobally = errorComposer(error);
  return Promise.reject(error);
});
// const token = store.getState().auth.token;
class RestAPI {
  get = (url, payload, config = {}) => {
    const token = store.getState().auth.token;
    return new Promise((resolve, reject) => {
      let headers = {};
      if (token) {
        headers.Authorization = token;
      }
      axios
        .get(url, {
          headers,
          params: payload,
          ...config,
        })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  };

  put = (url, payload, config = {}) => {
    const token = store.getState().auth.token;
    return new Promise((resolve, reject) => {
      const headers = {};
      if (token) {
        headers.Authorization = token;
      }
      axios
        .put(url, payload, {
          headers,
          ...config,
        })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  };

  post = (url, payload, config = {}) => {
    const token = store.getState().auth.token;
    return new Promise((resolve, reject) => {
      const headers = {};
      if (token) {
        headers.Authorization = token;
      }
      axios
        .post(url, payload, {
          headers,
          ...config,
        })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  };

  delete = (url, payload, config = {}) => {
    const token = store.getState().auth.token;
    return new Promise((resolve, reject) => {
      const headers = {};
      if (token) {
        headers.Authorization = token;
      }
      axios
        .delete(url, {
          headers,
          data: payload,
          ...config,
        })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  };
}

const api = new RestAPI();

export default api;
