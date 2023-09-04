import React from 'react';
//import LocalEvents from './LocalEvents';
//import UpcomingOnlineEvents from './UpcomingOnlineEvents';
 
const HomePage = () => {
  return (
    <div>
      <Header />
      <main>
        <LocalEvents />
        <UpcomingOnlineEvents />
        {/* Other sections can go here */}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
