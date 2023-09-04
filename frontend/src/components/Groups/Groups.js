import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllGroups } from '../../store/groups';
import { NavLink } from 'react-router-dom';

import './Groups.css';

const Groups = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const allGroups = useSelector((state) => Object.values(state.groups.allGroups));

  useEffect(() => {
    dispatch(getAllGroups());
  }, [dispatch]);

  return (
    <>
      <div className='groups-list-card'>
          <div className='groups-list-header'>
            <NavLink className='event-link' to='/events'>Events</NavLink>
            <h1>Groups</h1>
          </div>

          <div className='groups-list-header-2'>
            <h4>Groups in Meetup</h4>
          </div>

        <div className='main-group-container'>
          {allGroups.map(({ id, previewImage, name, city, state, about, Events }) => (
              <div className='group-card' key={id} onClick={() => history.push(`/groups/${id}`)}>

                <div className='group-card-img'>
                  <img src={previewImage} alt={name} />
                </div>

                <div className='group-card-info'>
                  <h1>{name}</h1>
                  <h4>{city}, {state}</h4>
                  <p>{about}</p>

                  <div className='group-card-events'>
                    {Events && <h4>{Events?.length} events</h4>}
                    <span>&#8226;</span>
                    {allGroups.private && <h4>Private</h4>}
                    {!allGroups.private && <h4>Public</h4>}
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
    </>
  )
};

export default Groups;