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
      <div>
          <div className="top-section">
            <div className="left-section">
              <div>
                <h1 className="left-section-title-box">The people platform—Where interests become friendships</h1>
                <p className="left-section-paragraph-box">Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—sign up to join the fun.</p>
              </div>
            </div>
    
            <div className="right-section">
              <img src={process.env.PUBLIC_URL + '/MeetupMainPage.png'} alt="Meetup" />
            </div>
          </div>

        <div className="middle-section">
        <div className="how-meetup-works">
              <h3>How Meetup works</h3>
              <p>People use Meetup to meet new people, learn new things, find support, get out of their comfort zones, and pursue their passions, together. Membership is free.</p>
            </div>
        </div>

        <div className="bottom-section">
                    <div className="navigation-tile">
                        <div onClick={handleSeeAllGroups}>
                        <img src={process.env.PUBLIC_URL + '/heart.png'} alt="Groups Icon" />
                        </div>
                        <Link to="/groups">See All Groups</Link>
                        <p>Find a group, local or online to find like-minded individuals</p>
                    </div>
                    <div className="navigation-tile">
                        <div onClick={handleFindAnEvent}>
                        <img src={process.env.PUBLIC_URL + '/heart.png'} alt="Events Icon" />
                        </div>
                        <Link to="/events">Find an Event</Link>
                        <p>See who's hosting local events for all the things you love</p>
                    </div>
                    <div className="navigation-tile">
                        <img src={process.env.PUBLIC_URL + '/heart.png'} alt="New Group Icon" />
                        {sessionUser ? (
                        <Link to="/groups/new">Start a new Group</Link>
                        ) : (
                        <span className="disabled-message">Please log in to start a new group</span>
                        )}
                        <p>Create your own Meetup group, and draw from a community of millions</p>
                     </div>
                </div>
          </div>
    );
  }
  
  export default HomePage;