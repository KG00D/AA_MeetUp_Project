import React, { useState, useEffect, useRef } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import './Navigation.css';
import MainModal from '../MainModal';
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";

function Navigation({ isLoaded }) {  
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false); 

    const dropdownRef = useRef(null);
    const sessionUser = useSelector((state) => state.session.user);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogout = async () => {  
        await dispatch(sessionActions.logout());
        history.push('/'); 
    };
    const toggleDropdown = () => { 
        setShowDropdown(!showDropdown); 
    };
    const handleClickOutside = (event) => {  
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    };
    useEffect(() => {  
        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);
    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <>
                <li>
                    <Link to="/groups/new">Start New Group</Link> 
                </li>
                <li className="icon-container"> 
                    <button onClick={toggleDropdown} className="icon-button">
                        <img src="https://img.icons8.com/fluency/48/person-male.png" alt="Profile" />
                    </button>
                    {showDropdown && (
                        <div className="dropdown" ref={dropdownRef}>
                            <div>Hello, {sessionUser.username}</div>
                            <div>{sessionUser.email}</div>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </li> 
            </>
        );
    } else {
        sessionLinks = (
            <li className="auth-buttons">
                <button className="login-btn" onClick={() => setShowLogin(true)}>Log In</button>
                <button className="signup-btn" onClick={() => setShowSignUp(true)}>Sign Up</button>
            </li>
        );
    }
    return (
        <div> 
            <div className="navbar">
                    <div className="search-container">
                        <Link to="/">
                            <img src="/logo.png" alt="Logo" className="logo" />
                        </Link>
                        <input className='event-search-input' type="text" placeholder="Search events" />
                        <input className='area-input' type="text" placeholder="City, or zip" />
                    </div>
                <div className="nav-right-section">
                    {sessionLinks}
                </div>
            </div>
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
