import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage/SignupFormPage";
import NavBar from "./components/NavBar/NavBar"; 
import * as sessionActions from "./store/session";

function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    isLoaded && (
      <>
        <NavBar /> 
        <Switch>
          {/* <Route exact path='/' component={LandingPage}></Route> */}
          <Route path="/signup" component={SignupFormPage}></Route>
          <Route path="/login" component={LoginFormPage}></Route>
        </Switch>
      </>
    )
  );
}

export default App;
