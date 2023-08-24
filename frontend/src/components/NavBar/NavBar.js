import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import '../Modal/Modal.css'
import Modal from '../Modal/Modal';


function NavBar() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const handleSignupRedirect = () => {
        setShowLogin(false); 
        setShowSignUp(true); 
    };
    

    return (
        <div className="navbar">
            <div className="navbar-content">
                <div className="search-container"> 
                    <div className="search-section">
                        <input type="text" placeholder="Search events" />
                    </div>
                    <div className="search-location-section">
                        <input type="text" placeholder="Neighborhood, city, or zip" />
                    </div>
                </div>
                <button onClick={() => setShowLogin(true)}>Log in</button> 
                <Link to="/signup" className="signup-btn">Sign Up</Link>
                </div>
                <Modal show={showLogin} onClose={() => setShowLogin(false)}>
    <form className="login-form">
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <Link to="/forgot-password">Forgot password?</Link>
        <button type="submit">Log In</button>
        <div className="alternative-login-methods">
            <button className="facebook-login">Login with Facebook</button>
            <button className="google-login">Login with Google</button>
            <button className="apple-login">Login with Apple</button>
        </div>
        <Link to="/help">Issues with login?</Link>
        <div className="signup-prompt">
            Don't have an account? <button onClick={handleSignupRedirect}>Sign Up</button>
        </div>
    </form>
</Modal>

        </div>
    );
}

export default NavBar;
