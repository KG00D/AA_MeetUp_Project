import React from 'react';
import { useHistory } from 'react-router-dom';

import '../EventsMain/EventsMain.css';

function EventCard({ event, onClick }) {
  const eventDate = new Date(event.startDate);

  return (
    <div className='event-card-2' onClick={onClick}>
      <div className='event-card-container'>
        <div className='event-card-image'>
          <img src={event.previewImage || 'https://via.placeholder.com/400x200'} alt='event' />
        </div>
        <div className='event-details'>
          <h4 className='event-date-time'>
            {eventDate.toLocaleDateString()} &#8226;{' '}
            {eventDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </h4>
          <h2>{event.name}</h2>
          <h4>
            {event.Venue?.city}, {event.Venue?.state}
          </h4>
        </div>
      </div>
      <div className='event-about'>
        <p>{event.description}</p>
      </div>
    </div>
  );
}

function GroupsEvents({ events }) {
  const history = useHistory();

  const now = new Date();
  const upcomingEvents = [];
  const pastEvents = [];

  events.forEach(event => {
    const eventDate = new Date(event?.startDate);

    const eventCard = (
      <EventCard
        key={event.id}
        event={event}
        onClick={() => history.push(`/events/${event.groupId}`)}
      />
    );

    if (eventDate > now) {
      upcomingEvents.push(eventCard);
    } else {
      pastEvents.push(eventCard);
    }
  });

return (
    <>
    {upcomingEvents.length > 0 ? (
      <>
        <h1>Upcoming Events</h1>
        {upcomingEvents}
      </>
    ) : (
      <h1>No Upcoming Events</h1>
    )}

    {pastEvents.length > 0 ? (
      <>
        <h1>Past Events</h1>
        {pastEvents}
      </>
    ) : (
      <h1>No Past Events</h1>
    )}
  </>
  );
}

export default GroupsEvents;
