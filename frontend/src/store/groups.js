import { csrfFetch } from './csrf';
import { GET_GROUPS, GROUP_DETAIL, ADD_NEW_GROUP, UPDATE_GROUP, DELETE_GROUP, GROUP_EVENTS, GET_GROUP_IMAGES } from './actionTypes';

export const getAllGroups = () => async (dispatch) => {
  const res = await csrfFetch('/api/groups');
  if (res.ok) {
    const data = await res.json();
    dispatch({ type: GET_GROUPS, groups: data.Groups });
    dispatch({type: GROUP_EVENTS, events: data.Events});
  } else {
    console.log('Error getting All Groups')
  }
};

export const getGroupImages = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}`);
  if (res.ok) {
    const data = await res.json();
    dispatch({ type: GET_GROUP_IMAGES, groups: data.Groups });
  } else {
    console.log('Error getting Group Images')
  }
};

export const getGroupDetail = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}`);
  if (res.ok) {
    const data = await res.json();
    dispatch({ type: GROUP_DETAIL, group: data });
  } else {
    console.log('Error getting Group Details')
  }
};

export const createNewGroup = (group) => async (dispatch) => {
  const res = await csrfFetch('/api/groups', {
    method: 'POST',
    body: JSON.stringify(group)
  });
  if (res.ok) {
    const data = await res.json();
    dispatch({ type: ADD_NEW_GROUP, group: data });
    return data;
  } else {
    // console.log('Error Creating New Group')
    return null;
  }
};

export const updateGroup = (group, groupId) => async (dispatch) => {
  console.log('GroupId:', groupId);

  try {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(group)
    });

    if (res.ok) {
      const data = await res.json();
      dispatch({ type: UPDATE_GROUP, group: data });
      return data;
    } else {
      const error = await res.json();
      throw new Error(error.message || 'Error Updating Group');
    }
  } catch (error) {
    console.error('Error Updating Group:', error);
    throw error; 
  }
};


export const removeGroup = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'DELETE'
  });
  if (res.ok) {
    dispatch({ type: DELETE_GROUP, groupId });
  } else {
    console.log('Error Removing Group')
  }
};

export const getGroupEvents = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}/events`);
  if (res.ok) {
    const data = await res.json();
    console.log(data, 'getGroupEvents CONSOLE LOG')
    dispatch({ type: GROUP_EVENTS, events: data.Events });
  } else {
    console.log('Error Getting Group Events Data')
  }
};

const initialState = {
  allGroups: [],
  currentGroup: {},
  currentGroupEvents: [],
  getGroupImages: []
};

const groupsReducer = (state = initialState, action) => {
  // console.log('action check ===', action)
  switch (action.type) {
    case GET_GROUPS:
      return { ...state, allGroups: action.groups };

    case GROUP_DETAIL:
      return { ...state, currentGroup: action.group };

    case ADD_NEW_GROUP:
      return { ...state, allGroups: [...state.allGroups, action.group] };

    case UPDATE_GROUP:
      return { ...state, currentGroup: action.group };

    case DELETE_GROUP:
      const filteredGroups = state.allGroups.filter(group => group.id !== action.groupId);
      return { ...state, allGroups: filteredGroups };

    case GROUP_EVENTS:
      return { ...state, currentGroupEvents: action.events };

    case GET_GROUP_IMAGES:
      return { ...state, getGroupImages: action.groups};

    default:
      return state;
  }
};

export default groupsReducer;
