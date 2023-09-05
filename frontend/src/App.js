import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation/Navigation";
import LandingPage from "./components/LandingPage/LandingPage";
import SplashPage from "./components/SplashPage/SplashPage";
import EventsMain from "./components/EventsMain/EventsMain";
import EventsDetails from "./components/EventsDetails/EventsDetails";
import EventsCreateNew from "./components/EventsCreateNew/EventsCreateNew";
import GroupsMain from "./components/GroupsMain/GroupsMain";
import GroupsDetails from "./components/GroupsDetails/GroupsDetails";
import GroupsCreateNew from "./components/GroupsCreateNew/GroupsCreateNew";
import GroupsUpdates from "./components/GroupsUpdates/GroupsUpdates";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact exact path="/">
           <LandingPage />
          </Route>
          <Route exact path="/splash">
            <SplashPage />
          </Route>
          <Route exact path="/groups/new">
            <GroupsCreateNew />
          </Route>
          <Route exact path="/groups/:groupId">
            <GroupsDetails />
          </Route>
          <Route exact path="/groups">
            <GroupsMain />
          </Route>
          <Route exact path="/groups/:groupId/edit">
            <GroupsUpdates />
          </Route>
          <Route exact path="/events">
            <EventsMain />
          </Route>
          <Route exact path="/events/:eventId">
            <EventsDetails />
          </Route>
          <Route exact path="/groups/:groupId/events">
            <EventsCreateNew />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
