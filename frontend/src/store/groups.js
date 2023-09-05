import { csrfFetch } from './csrf';
import { GET_GROUPS, GROUP_DETAIL, ADD_NEW_GROUP, UPDATE_GROUP, DELETE_GROUP, GROUP_EVENTS } from './actionTypes';

export const getAllGroups = () => async (dispatch) => {
  const res = await csrfFetch('/api/groups');
  if (res.ok) {
    const data = await res.json();
    dispatch({ type: GET_GROUPS, groups: data.Groups });
  } else {
    console.log('Error getting All Groups')
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
    console.log('Error Creating New Group')
    return null;
  }
};

export const updateGroup = (group, groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'PUT',
    body: JSON.stringify(group)
  });
  if (res.ok) {
    const data = await res.json();
    dispatch({ type: UPDATE_GROUP, group: data });
  } else {
    console.log('Error Updating Group')
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
    dispatch({ type: GROUP_EVENTS, events: data.Events });
  } else {
    console.log('Error Getting Group')
  }
};

const initialState = {
  allGroups: [],
  currentGroup: {},
  currentGroupEvents: []
};

const groupsReducer = (state = initialState, action) => {
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

    default:
      return state;
  }
};

export default groupsReducer;
