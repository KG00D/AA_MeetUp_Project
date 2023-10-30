import { csrfFetch } from './csrf';
import { ALL_EVENTS, EVENT_DETAIL, NEW_EVENT, DELETE_EVENT, FETCH_ERROR } from './actionTypes';

export const getAllEvents = () => async (dispatch) => {
  try {
    const res = await csrfFetch('/api/events');
    if (res.ok) {
      const data = await res.json();
      dispatch({ type: ALL_EVENTS, events: data.Events });
    } else {
      dispatch({ type: FETCH_ERROR, error: 'Failed to fetch all events' });
    }
  } catch (error) {
    dispatch({ type: FETCH_ERROR, error });
  }
};

export const getEventDetail = (eventId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/events/${eventId}`);
    const data = await res.json();
    if (res.ok) {
      const structuredData = {
        ...data.event,
        Organizer: {
          id: data.Organizer.id,
          firstName: data.Organizer.firstName,
          lastName: data.Organizer.lastName
        },
        groupImages: data.event.Group?.groupImages,
        eventImages: data.event.eventImages
      };
      dispatch({ type: EVENT_DETAIL, event: structuredData });
    } else {
      dispatch({ type: FETCH_ERROR, error: 'Failed to fetch event detail' });
    }
  } catch (error) {
    dispatch({ type: FETCH_ERROR, error });
  }
};

export const createNewEvent = (groupId, event) => async (dispatch) => {
  try {
    const eventData = {
      ...event,
      venueId: 3,
      capacity: 100
    };

    const res = await csrfFetch(`/api/groups/${groupId}/events`, {
      method: 'POST',
      body: JSON.stringify(eventData)
    });

    if (res.ok) {
      const data = await res.json();
      dispatch({ type: NEW_EVENT, event: data });
      return data;
    } else {
      const errorData = await res.json();  
      dispatch({ type: FETCH_ERROR, error: errorData.message || 'Failed to create new event' });
    }
  } catch (error) {
    dispatch({ type: FETCH_ERROR, error });
  }
};

export const removeEvent = (eventId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/events/${eventId}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      dispatch({ type: DELETE_EVENT, eventId });
    } else {
      dispatch({ type: FETCH_ERROR, error: 'Failed to remove event' });
    }
  } catch (error) {
    dispatch({ type: FETCH_ERROR, error });
  }
};

const initialState = {
  allEvents: [],
  currentEvent: {},
  error: null
};

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALL_EVENTS:
      return { ...state, allEvents: action.events };

    case EVENT_DETAIL:
      return { ...state, currentEvent: action.event };
  
    case NEW_EVENT:
      return { ...state, allEvents: [...state.allEvents, action.event] };

    case DELETE_EVENT:
      const filteredEvents = state.allEvents.filter(event => event.id !== action.eventId);
      return { ...state, allEvents: filteredEvents };

    case FETCH_ERROR:
      return { ...state, error: action.error };

    default:
      return state;
  }
};

export default eventsReducer;
