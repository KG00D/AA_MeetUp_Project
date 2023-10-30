import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import GroupsEvents from '../GroupsEvents/GroupsEvents';
import ConfirmationModal from './ConfirmationModal';
import * as groupActions from '../../store/groups';
import { getEventDetail } from '../../store/events';

import './GroupsDetails.css';

const GroupsDetails = () => {
  
  const dispatch = useDispatch();
  const history = useHistory();
  const { groupId } = useParams();

  const group = useSelector((state) => state.groups.currentGroup)[0]; 
  const groupsState = useSelector((state) => state.groups);


  const events = useSelector((state) => state.groups.currentGroupEvents);
  const sessionUser = useSelector(state => state.session?.user);

  const [loaded, setLoaded] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const previewImageUrl = group?.groupImages?.find(img => img.preview)?.url;
  const [userIsOrganizer, setUserIsOrganizer] = useState(false);

  useEffect(() => {
    const isUserOrganizer = sessionUser?.id === group?.Organizer?.id;
    setUserIsOrganizer(isUserOrganizer);
  }, [sessionUser, group]);

  useEffect(() => {
    dispatch(groupActions.getGroupDetail(groupId))
    dispatch(groupActions.getGroupEvents(groupId))
    // dispatch(getEventDetail.getEventDetail())
    setLoaded(true)
  }, [dispatch, groupId])

  const handleJoinGroup = () => {
    alert("Feature Coming Soon");
};

  const handleBreadCrumb = () => {
    history.push(`/groups`);
  };

  const handleCreateEvent = () => {
    history.push(`/groups/${groupId}/events`);
  };


  const handleDelete = async () => {
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    await dispatch(groupActions.removeGroup(groupId));
    history.push(`/groups`);
    setModalOpen(false); 
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleUpdate = () => {
    history.push(`/groups/${groupId}/edit`);
  };

  return (
    loaded && (
      <div className='group-detail-container'>
        <div className='group-main-details'>
          <div className='group-breadcrumb'>
            &lt;
            <div onClick={handleBreadCrumb}>Groups</div>
          </div>
          <div className='group-info'>
          <img src={previewImageUrl || 'https://via.placeholder.com/600x400'} alt='group' />

          <div className='group-info-content'>
            <div className='group-main-text'>
              <h1>{group?.name}</h1>
              <h4>{group?.city}, {group?.state}</h4>
              <h4>{events?.length} events &#8226; {group?.private ? 'Private' : 'Public'}</h4>
              <h4>Organized by {group?.Organizer?.firstName} {group?.Organizer?.lastName}</h4>
            </div>
            {userIsOrganizer ? (
              <div className='group-action-buttons'>
                <button className='create' onClick={handleCreateEvent}>Create event</button>
                <button className='delete' onClick={handleDelete}>Delete</button>
                <button className='update' onClick={handleUpdate}>Update</button>
              </div>
            ) : sessionUser && (
              <div className='group-action-buttons'>
                <button className='join-group-info-buttons' onClick={handleJoinGroup}>Join this Group</button>
              </div>
            )}
          </div>
        </div>

        </div>
  
        <div className='group-sub-details'>
          <h2>Organizer</h2>
          <h4>
            {group?.Organizer?.firstName} {group?.Organizer?.lastName}
          </h4>
          <h2>What we're about</h2>
          <p>{group?.about}</p>
        </div>
  
        <div className='events'>
          <GroupsEvents events={events} />
        </div>
        <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onConfirm={handleConfirmDelete} 
      />
      </div>
    )
  );
  
};

export default GroupsDetails;
