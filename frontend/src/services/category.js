import axios from "axios";
import { BASE_URL } from "../config/constants";

export async function createCategoryWithDefaultSubCategory(data, token) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    const response = await axios.post(
      `${BASE_URL}category/create-category-with-default`,
      data,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

export async function deleteCategory(data, token) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    const response = await axios.delete(`${BASE_URL}category/delete`, {
      ...config,
      data,
    });
    return response;
  } catch (error) {
    return error.response;
  }
}

export async function editCategory(data, token) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    const response = await axios.post(
      `${BASE_URL}category/update`,
      data,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
}
