import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import * as eventActions from '../../store/events';
import ConfirmationModal from './ConfirmationModal';

import './EventsDetails.css';

const EventsDetails = () => {
  console.log("EventsDetails component rendered");
  const dispatch = useDispatch();
  const history = useHistory();
  
  const { eventId } = useParams();
  
  const event = useSelector((state) => state.events?.currentEvent);
  console.log("Event Data:", event);


  console.log(event, 'event here')

  const sessionUser = useSelector((state) => state.session?.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log('Session User:', sessionUser);
  console.log('Event Organizer:', event.Organizer);
  
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

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const confirmDelete = async () => {
    dispatch(eventActions.removeEvent(eventId));
    history.push('/events');
    setIsModalOpen(false);
  };

  // const handleDelete = async () => {
  //   if (window.confirm('Are you sure you want to remove this event?')) {
  //     dispatch(eventActions.removeEvent(eventId));
  //     history.push('/events');
  //   }
  // };

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
          <img src={event.previewImage || 'https://via.placeholder.com/600x400'} alt={event} />
        </div>

        <div className='event-detail-sub'>
          <div className='event-detail-group-crumb' onClick={handleGroupCrumb}>
            <img src={event.Group?.previewImage || 'https://via.placeholder.com/400x300'} alt={'group'} />

            <div className='group-crumb'>
              <h2>{event.Group?.name}</h2>
              {event.Group?.private ? <h4>Private</h4> : <h4>Public</h4>}
            </div>
          </div>

          <div className='event-detail-info'>
            <div className='event-date'>
              <img className='date-icon' src='https://img.icons8.com/color/96/calendar--v1.png' alt='date icon'></img>
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
              <img className='price-icon' src='https://img.icons8.com/color/96/us-dollar-circled--v1.png' alt='price icon'></img>
              <h4>${event.price}</h4>
            </div>

            <div className='event-type'>
                {event.type === 'online' ? (
                  <img className='type-icon' src='https://img.icons8.com/color/96/pc-on-desk.png' alt='online type icon'></img>
                ) : event.type === 'group' ? (
                  <img className='type-icon' src='https://img.icons8.com/fluency/48/map-pin.png' alt='group type icon'></img>
                ) : null}
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
      <ConfirmationModal
      isOpen={isModalOpen}
      onClose={closeModal}
      onConfirm={confirmDelete}
    />
    </div>
    
  );
};

export default EventsDetails;
