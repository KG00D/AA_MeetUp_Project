import React, { useState, useEffect, useRef } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { useModal } from '../../context';
import { Link, useHistory } from 'react-router-dom';

import './Navigation.css';
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import * as sessionActions from "../../store/session";

function Navigation({ isLoaded }) {  
const { setModalContent, closeModal } = useModal();
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);
    const sessionUser = useSelector((state) => state?.session?.user);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogout = async () => { 
        await dispatch(sessionActions.logout());
        history.push('/'); 
    };
    const toggleDropdown = (event) => {
        event.stopPropagation();
        setShowDropdown(!showDropdown);
    };

    const handleClickOutside = (event) => {  
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
    }, [showLogin, showSignUp]);

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

    if (showDropdown) {
        document.addEventListener("click", handleDocumentClick);
    } else {
        document.removeEventListener("click", handleDocumentClick);
    }

    return () => {
        document.removeEventListener("click", handleDocumentClick);
    };
}, [showDropdown]);

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <div className='loggedin-in-buttons'>
                <Link to="/groups/new">Start New Group</Link>
                <div className="user-dropdown-container">
                <button onClick={toggleDropdown} className="icon-button">
                        <img src="https://img.icons8.com/fluency/48/person-male.png" alt="Profile" />
                    </button>
                    {showDropdown && (
                        <div className="dropdown" ref={dropdownRef}>
                            <div className="dropdown-greeting">Hello, {sessionUser.firstName}</div>
                            <div className="dropdown-greeting">{sessionUser.email}</div>
                            <Link to="/groups">Your Groups</Link>
                            <Link to="/events">Your Events</Link>
                            <div>
                                <button className="logout-btn" onClick={handleLogout}>Logout</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    } else {
        sessionLinks = (
            <div className='auth-buttons'>
                <button className="login-btn" onClick={() => {
                    setModalContent(<LoginFormModal onClose={() => setShowLogin(false)} />);
                }}>Log In</button>

                <button className="signup-btn" onClick={() => {
                    setModalContent(<SignupFormModal onClose={() => setShowSignUp(false)} />);
                }}>Sign Up</button>
            </div>
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
                    {isLoaded && sessionLinks}
                </div>
            </div>
        </div>
    );
}

export default Navigation;
