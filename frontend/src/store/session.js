import { csrfFetch } from './csrf';

// Action types
const SET_SESSION_USER = 'session/setSessionUser';
const REMOVE_SESSION_USER = 'session/removeSessionUser';

// Action creators
const setSessionUser = (user) => ({
    type: SET_SESSION_USER,
    payload: user,
  });

  const removeSessionUser = () => ({
    type: REMOVE_SESSION_USER,
  });

  // thunks

  // Login Thunk
  export const login = ({ credential, password }) => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
      method: 'POST',
      body: JSON.stringify({ credential, password }),
    });
    const data = await response.json();
    dispatch(setSessionUser(data.user));
  };

 
  // restore user thunk
  export const restoreUser = () => async dispatch => {
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    dispatch(setSessionUser(data.user));
    return response;
  };

 
  // SignUp Thunk 
  export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password,
      }),
    });
    const data = await response.json();
    dispatch(setSessionUser(data));
    return response;
  };

  export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
      method: 'DELETE',
    });
    dispatch(removeSessionUser());
    return response;
  };


// Initial state
const initialState = {
  user: null,
};

// Reducer
const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_SESSION_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_SESSION_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;