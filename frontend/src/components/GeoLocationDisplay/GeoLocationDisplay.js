import React from 'react';
import './GeoLocationDisplay.css';

const GeoLocationDisplay = ({ ipLocation }) => {
  return (
    <div className="geo-location">
      {ipLocation && <>Events near you: {ipLocation.city}, {ipLocation.region}</>}
    </div>
  );
};

export default GeoLocationDisplay;
