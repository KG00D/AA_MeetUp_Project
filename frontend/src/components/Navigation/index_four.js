import React, { useRef } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { Link, useHistory } from 'react-router-dom';

import './Navigation.css';
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal/index_three";
import * as sessionActions from "../../store/session";

function Navigation({ isLoaded }) {  
    const { setModalContent } = useModal();
    const dropdownRef = useRef(null);
    const sessionUser = useSelector((state) => state?.session?.user);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogout = async () => {  
        await dispatch(sessionActions.logout());
        history.push('/'); 
    };
    
    const toggleDropdown = () => { 
    };
    
    const handleClickOutside = (event) => {  
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {

        }
    };

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <>
                <Link to="/groups/new" className="start-a-new-group">Start New Group</Link>
                <div className="user-dropdown-container">
                    <button onClick={toggleDropdown} className="icon-button">
                        <img src="https://img.icons8.com/fluency/48/person-male.png" alt="Profile" />
                    </button>
                    {/* If you need a dropdown for user info */}
                    {/* {showDropdown && (
                        // ... Your dropdown JSX
                    )} */}
                </div>
            </>
        );
    } else {
        sessionLinks = (
            <>
                <button 
                    className="login-btn" 
                    onClick={() => {
                        setModalContent(<LoginFormModal onClose={() => setModalContent(null)} />);
                        console.log('Login clicked');
                    }}
                >
                    Log In
                </button>
                <button 
                    className="signup-btn" 
                    onClick={() => {
                        setModalContent(<SignupFormModal onClose={() => setModalContent(null)} />);
                        console.log('Signup clicked');
                    }}
                >
                    Sign Up
                </button>
            </>
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