import axios from "axios";
import { BASE_URL } from "../config/constants";

export async function uploadProfilePic(data, token) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    const response = await axios.post(`${BASE_URL}user/upload`, data, config);
    return response;
  } catch (error) {
    return error.response;
  }
}
