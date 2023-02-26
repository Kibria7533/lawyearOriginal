import axios from "axios";

export const fetcher = (url) => axios.get(url).then((res) => res.data);
export const fetcherAuth = (url, token) =>
  axios.get(url, { headers: { Authorization: token } }).then((res) => res.data);
