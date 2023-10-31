import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import * as eventActions from '../../store/events';

import ConfirmationModal from './ConfirmationModal';

import './EventsDetails.css';

const EventsDetails = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  const { eventId } = useParams();
  
  const event = useSelector(state => state.events?.currentEvent);
  const sessionUser = useSelector(state => state.session?.user);

  const eventStart = new Date(event.startDate);
  const eventEnd = new Date(event.endDate);
  const eventFirstName = event?.Organizer?.firstName;
  const eventLastName = event?.Organizer?.lastName;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(eventActions.getEventDetail(eventId));
  }, [dispatch, eventId]);

  const handleBreadCrumb = () => {
    history.push('/events');
  };

  const handleUpdate = () => {
    alert("Feature coming soon");
  };

  const handleGroupCrumb = () => {
    const groupId = event.Group?.id
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
    const groupId = event.Group?.id
    history.push(`/groups/${groupId}`);
    setIsModalOpen(false);

  };

  return (
    <div className='main-event-detail-container'>
      {/* Top Container */}
      <div className='event-detail-header'>
        <div onClick={handleBreadCrumb}>
          Events
        </div>
      </div>
      <div className='event-detail-top-information'>
        <h1>{event.name}</h1>
        <h4>Hosted by {eventFirstName} {eventLastName}</h4>
      </div>
  
      <div className='events-grey-container'>
        <div className='event-detail-main'>
          <div className='event-detail-left'>
            <div className='img-div-bottom'>
              <img src={Array.isArray(event?.eventImages) && event.eventImages.length > 0 ? event.eventImages[0]?.url : 'https://via.placeholder.com/600x400'} alt={event?.name || 'Event'} />
            </div>
  
            <div className='event-detail-about'>
              <h2>Details</h2>
              <p>{event.description}</p>
            </div>
          </div>
  
          <div className='event-detail-right-side-bottom'>
            <div className='group-crumb-container'>
              <div className='event-detail-group-crumb' onClick={handleGroupCrumb}>
                <img src={Array.isArray(event?.eventImages) && event.eventImages.length > 0 ? event.eventImages[0]?.url : 'https://via.placeholder.com/400x400'} alt={event?.name || 'Event'} />
              </div>
            </div>
  
            <div className='event-detail-info'>
              <div className='event-date'>
                <div className='timeSubDiv'>
                  <div className='startDiv flexTest'>
                  <img className='date-icon' src='https://img.icons8.com/color/96/calendar--v1.png' alt='date icon' />
                    <h4>Start:</h4>
                    <h5>{eventStart.toLocaleDateString()} &bull; {eventStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</h5>
                  </div>
                  <div className='endDiv flexTest'>
                    <h4>End:</h4>
                    <h5>{eventEnd.toLocaleDateString()} &bull; {eventEnd.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</h5>
                  </div>
                  <div className='event-price'>
                <img className='price-icon' src='https://img.icons8.com/color/96/us-dollar-circled--v1.png' alt='price icon' />
                <h4>{event.price === 0 ? 'FREE' : `$${event.price}`}</h4>
              </div>
              <div className='event-type-delete-wrapper'>
                </div>
              </div>

                <div className='event-type'>
                  {event.type && event.type.toLowerCase() === 'online' ? (
                    <img className='type-icon' src='https://img.icons8.com/color/96/pc-on-desk.png' alt='online type icon' />
                  ) : event.type && event.type.toLowerCase() === 'in person' ? (
                    <img className='type-icon' src='https://img.icons8.com/fluency/48/map-pin.png' alt='in person type icon' />
                  ) : null}
                  <h4>{event.type}</h4>
                </div>


                {sessionUser?.id === event?.Organizer?.id && (
                    <div className="buttons-container">
                      <button className='delete-button' onClick={handleDelete}>Delete</button>
                      <button className='update-button' onClick={handleUpdate}>Update</button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default EventsDetails;