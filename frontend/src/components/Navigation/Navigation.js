import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import './Navigation.css';
import MainModal from '../MainModal/MainModal';
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import { useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";

function Navigation({ isLoaded }) {  
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const sessionUser = useSelector((state) => state.session.user); 
    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogout = async () => {  
        await dispatch(sessionActions.logout());
        history.push('/'); 
      };
  
    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <li>
                <button onClick={handleLogout}>Logout</button>
            </li>
        );
    } else {
        sessionLinks = (
            <li>
                <button onClick={() => setShowLogin(true)}>Log In</button>
                <button onClick={() => setShowSignUp(true)}>Sign Up</button>
            </li>
        );
    }

    return (
        <div> 
            <ul className="navbar">
                <li>
                <Link to="/">
                        <img src="AA_MeetUp_Project/frontend/public/logo.svg" alt="Logo" className="logo" />
                    </Link>
                    <div className="search-container">
                        <input type="text" placeholder="Search events" />
                        <input type="text" placeholder="Neighborhood, city, or zip" />
                    </div>
                </li>
                <li>
                    {sessionLinks}
                </li>
            </ul>

            <MainModal show={showLogin} onClose={() => setShowLogin(false)}>
                <LoginFormModal onClose={() => setShowLogin(false)} />
            </MainModal>
            <MainModal show={showSignUp} onClose={() => setShowSignUp(false)}>
                <SignupFormModal />
            </MainModal>
        </div>
    );
}

export default Navigation;
