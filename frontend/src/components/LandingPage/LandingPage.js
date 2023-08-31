import React, { useEffect, useState } from 'react';
import './LandingPage.css';

function LandingPage() {
  const [ipLocation, setIpLocation] = useState(null);

  useEffect(() => {
    //Such bad practice but, oh well.
    fetch('https://ipinfo.io/json?token=affeb355e2e74de0a3f99121e9b44c5a')
      .then(response => response.json())
      .then(data => {
        setIpLocation(data);
      })
      .catch(error => {
        console.error("Error fetching IP info: ", error);
      });
  }, []);

  return (
    <div className="image-container">
      <div className="animated-background" id="bg1"></div>
      <div className="text-box">
        <h1>The people platform—</h1>
        <p>Where interests become friendships</p>
        <h2>Join Meetup</h2>
        {ipLocation && <p className="geo-location">Events near you: {ipLocation.city}, {ipLocation.region}</p>}
      </div>
    </div>
  );
}

export default LandingPage;
