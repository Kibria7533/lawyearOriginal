import axios from "axios";
import { BASE_URL } from "../config/constants";

export async function uploadMyUserProfile(data, token) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    const response = await axios.patch(
      `${BASE_URL}user/update-user`,
      data,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

export async function uploadMyPassword(data, token) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    const response = await axios.patch(
      `${BASE_URL}user/update-password`,
      data,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
}
