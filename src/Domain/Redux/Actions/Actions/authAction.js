import { SET_USER, LOGOUT } from "../ActionsTypes";

export function setUser(user) {
    return {
      type: SET_USER,
      payload: user,
    };
  }

export function logout() {
  return {
    type: LOGOUT,
    payload: null,
  };
}

export function setToken(token, refreshToken) {
  return {
    type: SET_TOKEN,
    payload: { token, refreshToken },
  };
}