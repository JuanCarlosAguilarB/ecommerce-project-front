import { LOGOUT, SET_TOKEN, SET_USER } from "../Actions/ActionsTypes";

const initialState = {
  user: null,
  refreshTokenm: localStorage.getItem("refreshToken"),
  accessToken: localStorage.getItem("accessToken"),
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TOKEN:
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("accessToken", action.payload.token);
        return {
            ...state,
            refreshTokenm: action.payload.refreshToken,
            accessToken: action.payload.token,
        };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case LOGOUT:
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      return {
        ...state,
        user: null,
        refreshTokenm: null,
        accessToken: null,
      };
    default:
      return state;
  }
}
