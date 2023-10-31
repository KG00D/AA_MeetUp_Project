import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch} from "react-router-dom";
import { Modal, ModalProvider } from './context';
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from "./components/Home";
import EventsMain from "./components/EventsMain";
import EventsDetails from "./components/EventsDetails";
import EventsCreateNew from "./components/EventsCreateNew";
import GroupsMain from "./components/GroupsMain";
import GroupsDetails from "./components/GroupsDetails";
import GroupsCreateNew from "./components/GroupsCreateNew";
import GroupsUpdates from "./components/GroupsUpdates";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <ModalProvider>
      <Navigation isLoaded={isLoaded} />
      <Modal />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
           <HomePage />
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
      </ModalProvider>
  );
}

export default App;
