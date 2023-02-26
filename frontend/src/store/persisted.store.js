import {
  getAllCategories,
  getAuthData,
  getClientData,
  setAuthData,
  setCategoriesData,
  setClientData,
} from "../util/session";

export const saveState = (state) => {
  try {
    // Parsing auth data from Redux store
    let stateFilter = state;
    setAuthData(stateFilter.auth);
    setCategoriesData(stateFilter.categories);
    setClientData(state.client);
  } catch (err) {
    // Ignore write error
  }
};

/* Use an IIFE to export the persisted state in a variable */
export const persistedState = (() => {
  try {
    const auth = getAuthData();
    const categories = getAllCategories();
    const client = getClientData();
    // if (Object.keys(auth).length === 0) return undefined;
    return {
      auth,
      categories,
      client,
    };
  } catch (err) {
    return undefined;
  }
})();
