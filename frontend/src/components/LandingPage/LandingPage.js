import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import GeoLocationDisplay from '../GeoLocationDisplay/GeoLocationDisplay';
import './LandingPage.css';

function LandingPage() {
  const pageHistory = useHistory();
  const sessionUser = useSelector((state) => state.session.user);  // Adding this line to get session user

  const handleSeeAllGroups = () => {
    pageHistory.push('/groups');
  };

  const handleFindAnEvent = () => {
    pageHistory.push('/events')
  }

  return (
    <div className="image-container">
      <div className="animated-background" id="bg1"></div>
      <div className="text-box">
        <h1>The people platform—</h1>
        <p>Where interests become friendships</p>
        <h2>Join Meetup</h2>
      </div>
      
      <div className="tile-container">
        <div className="tile">
          <Link to="/groups" onClick={handleSeeAllGroups}>See All Groups</Link>
        </div>
        <div className="tile">
          <Link to="/events" onClick={handleFindAnEvent}>Find an Event</Link>
        </div>
        <div className="tile">
          { sessionUser ? (
            <Link to="/groups/new">
              Start a new Group
            </Link>
          ) : (
            <span>Please log in to start a new group</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
