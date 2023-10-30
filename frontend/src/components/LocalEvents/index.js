import React, { useEffect, useState } from 'react';

const LocalEvents = () => {
  const [location, setLocation] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLocation({ latitude, longitude });
        // TODO add some junk
      });
    } else {
    }
  }, []);

  return (
    <div>
      <h2>Events Near {location ? `${location.latitude}, ${location.longitude}` : 'You'}</h2>
      {/* events, static images, serve up the same crap */}
    </div>
  );
};

export default LocalEvents;
