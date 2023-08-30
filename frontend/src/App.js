import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";  // <- added useSelector
import { Route, Switch, Redirect } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation/Navigation";
import LandingPage from "./components/LandingPage/LandingPage";
import SplashPage from "./components/SplashPage/SplashPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);  // <- added this line

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <Switch>
        <Route exact path="/">
          {sessionUser ? <Redirect to="/splash" /> : <LandingPage />}
        </Route>
        <Route path="/splash">
          <SplashPage />
        </Route>
        {isLoaded && (
          <>
          </>
        )}
      </Switch>
    </>
  );
}

export default App;
