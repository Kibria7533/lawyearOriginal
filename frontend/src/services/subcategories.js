import axios from "axios";
import { BASE_URL } from "../config/constants";

export async function updateRelationCategorySubcategory(data, token) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    const response = await axios.post(
      `${BASE_URL}subcategory/update-relation-category-subcategory`,
      data,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

export async function addQuestionSubcategory(data, token) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    const response = await axios.post(
      `${BASE_URL}subcategory/add-question`,
      data,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

export async function editQuestionSubcategory(data, token) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    const response = await axios.patch(
      `${BASE_URL}subcategory/update-question`,
      data,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

export async function deleteQuestionSubcategory(id, token) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    const response = await axios.delete(
      `${BASE_URL}subcategory/delete-question/${id}`,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

export async function createSubcategory(data, token) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    const response = await axios.post(
      `${BASE_URL}subcategory/create`,
      data,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

export async function updateSubcategory(data, token) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    const response = await axios.post(
      `${BASE_URL}subcategory/update`,
      data,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

export async function updateDocumentNameSubCategory(data, token) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    const response = await axios.put(
      `${BASE_URL}subcategory/update-document`,
      data,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

export async function addDocumentNameSubCategory(data, token) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    const response = await axios.post(
      `${BASE_URL}subcategory/add-document`,
      data,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
}
