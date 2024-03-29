import React, { useEffect } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEvents } from '../../store/events';
import './EventsMain.css';

const EventCard = ({ event, onClick }) => {
  const eventDate = new Date(event.startDate);

  return (
    <div className='event-card' onClick={onClick}>
      <div className='event-card-container'>
        <div className='event-card-left'>
          <div className='event-card-image'>
            <img src={event.eventImages[0].url} alt='event' />
          </div>
          <p className='event-description'>{event?.description}</p>
        </div>
        <div className='event-details'>
          <h4>
            {eventDate.toLocaleDateString()} &#8226;{' '}
            {eventDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </h4>
          <h2>{event.name}</h2>
          <h4>{event?.Venue?.city}, {event?.Venue?.state}</h4>
        </div>
      </div>
    </div>
  );
};


const EventsMain = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const events = useSelector(state => state.events.allEvents);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  const sortedEvents = events.slice().sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  return (
    <div className='events-list-card'>
      <div className='events-list-header'>
        <h1>Events</h1>
        <NavLink className='group-link' to='/groups'>
          Groups
        </NavLink>
      </div>
      <div className='events-list-header-2'>
        <h4>Events in Meetup</h4>
      </div>
      <div className='main-event-container'>
        {sortedEvents.map((event, idx) => (
          <EventCard
            key={idx}
            event={event}
            onClick={() => {
              history.push(`/events/${event.id}`)}}
          />
        ))}
      </div>
    </div>
  );
};

export default EventsMain;
