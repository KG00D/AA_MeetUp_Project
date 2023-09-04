import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import * as eventActions from '../../store/events';

import './EventsDetails.css';

const EventDetails = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { eventId } = useParams();
  
  const event = useSelector((state) => state.events?.currentEvent);
  const sessionUser = useSelector((state) => state.session?.user);
  
  useEffect(() => {
    dispatch(eventActions.getEventDetail(eventId));
  }, [dispatch, eventId]);

  if (!event) {
    return <div>Loading...</div>;
  }

  const handleBreadCrumb = () => {
    history.push('/events');
  };

  const handleGroupCrumb = () => {
    const groupId = event.Group?.id;
    history.push(`/groups/${groupId}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to remove this event?')) {
      dispatch(eventActions.removeEvent(eventId));
      history.push('/events');
    }
  };

  const eventStart = new Date(event.startDate);
  const eventEnd = new Date(event.endDate);

  return (
    <div className='main-event-detail-container'>
      <div className='event-detail-header'>
        <div onClick={handleBreadCrumb}>
          Events
        </div>
        <h1>{event.name}</h1>
        <h4>Hosted by {event.Organizer?.firstName} {event.Organizer?.lastName}</h4>
      </div>

      <div className='event-detail-main'>
        <div className='img-div'>
          <img src={event.previewImage} alt='event'></img>
        </div>

        <div className='event-detail-sub'>
          <div className='event-detail-group-crumb' onClick={handleGroupCrumb}>
            <img src={event.Group?.previewImage} alt='group'></img>
            <div className='group-crumb'>
              <h2>{event.Group?.name}</h2>
              {event.Group?.private ? <h4>Private</h4> : <h4>Public</h4>}
            </div>
          </div>

          <div className='event-detail-info'>
            <div className='event-date'>
              <img className='date-icon' src='your_image_url_here' alt='date icon'></img>
              <div className='timeSubDiv'>
                <div className='startDiv'>
                  <h4>Start:</h4>
                  <h5>{eventStart.toLocaleDateString()} &bull; {eventStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</h5>
                </div>
                <div className='endDiv'>
                  <h4>End:</h4>
                  <h5>{eventEnd.toLocaleDateString()} &bull; {eventEnd.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</h5>
                </div>
              </div>
            </div>

            <div className='event-price'>
              <img className='price-icon' src='your_image_url_here' alt='price icon'></img>
              <h4>${event.price}</h4>
            </div>

            <div className='event-type'>
              <img className='type-icon' src='your_image_url_here' alt='type icon'></img>
              <h4>{event.type}</h4>
            </div>

            {sessionUser?.id === event?.Organizer?.id && <button className='delete-button' onClick={handleDelete}>Delete</button>}
          </div>
        </div>
      </div>

      <div className='event-detail-about'>
        <h2>Details</h2>
        <p>{event.description}</p>
      </div>
    </div>
  );
};

export default EventDetails;
