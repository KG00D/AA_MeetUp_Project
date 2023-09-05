import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllGroups } from '../../store/groups';
import { NavLink } from 'react-router-dom';

import './GroupsMain.css';

const GroupsMain = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const allGroups = useSelector((state) => state.groups.allGroups);

  useEffect(() => {
    dispatch(getAllGroups());
  }, [dispatch]);

  return (
    <div className='groups-list-card'>
      <div className='groups-list-header'>
        <NavLink className='event-link' to='/events'>Events</NavLink>
        <h1>Groups</h1>
      </div>

      <div className='groups-list-header-2'>
        <h4>Groups in Meetup</h4>
      </div>

      <div className='main-group-container'>
        {Object.values(allGroups).map(({ id, previewImage, name, city, state, about, Events }) => (
          <div className='group-card' key={id} onClick={() => { console.log('Clicked on group card', id); history.push(`/groups/${id}`); }}>
            <div className='group-card-img'>
              <img src={'https://via.placeholder.com/600x400'} alt={name} />

            </div>

            <div className='group-card-info'>
              <h1>{name}</h1>
              <h4>{city}, {state}</h4>
              <p>{about}</p>

              <div className='group-card-events'>
                {Events && <h4>{Events?.length} events</h4>}
                <span>&#8226;</span>
                {allGroups[id]?.private ? <h4>Private</h4> : <h4>Public</h4>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsMain;
