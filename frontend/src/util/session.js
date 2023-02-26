export const JWT_TOKEN = "dossier-auth-token";
export const USER_COOKIE = "dossier-user-auth";
export const CATEGORIES = "categories";
export const CLIENT = "client";

export function getAuthData() {
  // const isUser = getCookie(USER_COOKIE);
  const AuthData = localStorage.getItem(USER_COOKIE);

  if (typeof AuthData === "string") return JSON.parse(AuthData);
  else return {};
}

export function getAllCategories() {
  // const isUser = getCookie(USER_COOKIE);
  const Categories = localStorage.getItem(CATEGORIES);

  if (typeof Categories === "string") return JSON.parse(Categories);
  else return {};
}

export function getClientData() {
  const Categories = localStorage.getItem(CLIENT);
  if (typeof Categories === "string") return JSON.parse(Categories);
  else return {};
}

export function setAuthData(auth) {
  // setCookie(JWT_TOKEN, auth.jwtToken);
  const strState = JSON.stringify(auth);
  // console.log(strState)
  localStorage.setItem(USER_COOKIE, strState);
  // setCookie(USER_COOKIE, JSON.stringify(auth));
}

export function setCategoriesData(categories) {
  // setCookie(JWT_TOKEN, auth.jwtToken);
  const strState = JSON.stringify(categories);
  // console.log(strState)
  localStorage.setItem(CATEGORIES, strState);
  // setCookie(USER_COOKIE, JSON.stringify(auth));
}

export function setClientData(categories) {
  const strState = JSON.stringify(categories);
  localStorage.setItem(CLIENT, strState);
}
