import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './HomePage.css';

function HomePage() {
  const pageHistory = useHistory();
  const sessionUser = useSelector((state) => state.session.user);

  const handleSeeAllGroups = () => {
    pageHistory.push('/groups');
  };

  const handleFindAnEvent = () => {
    pageHistory.push('/events');
  };

  return (
    <div className="image-container">
        <div className="top-section">
            <div className="left-section">
                <div className="text-box">
                <h1>The people platform—Where interests become friendships</h1>
                <p>Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—sign up to join the fun.</p>
                </div>
            </div>
            <div className="how-meetup-works">
                    <h3>How Meetup works</h3>
                </div>
            <div className="right-section">
                <img src={process.env.PUBLIC_URL + '/MeetupMainPage.png'} alt="Meetup" />
            </div>
        </div>
        <div className="tile-container">
            <div className="tile" onClick={handleSeeAllGroups}>
                <img src={process.env.PUBLIC_URL + '/meetuppurplemain.png'} alt="Groups Icon" />
                <Link to="/groups">See All Groups</Link>
            </div>
            <div className="tile" onClick={handleFindAnEvent}>
                <img src={process.env.PUBLIC_URL + '/heart.png'} alt="Events Icon" />
                <Link to="/events">Find an Event</Link>
            </div>
            <div className="tile">
                <img src={process.env.PUBLIC_URL + '/meetupredmain.png'} alt="New Group Icon" />
                {sessionUser ? (
                    <Link to="/groups/new">Start a new Group</Link>
                ) : (
                    <span className="disabled-message">Please log in to start a new group</span>
                )}
            </div>
        </div>
    </div>
  );
}


export default HomePage;
