import React, {useContext} from 'react';
import '../styles/nav.css';
import {Link} from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const Navbar = () => {
    const authContext = useContext(AuthContext);
    return(
        <>
            <nav id="nav-bar">
                <div className="nav-container">
                    <h1 className="logo">AuthDemo</h1>
                    <ul className="nav-links">
                        <li>
                            <Link className="link" to = "/">Home</Link>
                        </li>
                        {
                            authContext.isAuthenticated() ?
                            <li>
                                <Link className="link" to = "/add-user">Add User</Link>
                            </li> :
                            ''
                        }
                        {
                            authContext.isAuthenticated() ?
                            <li>
                                <Link className="link" to="/" onClick={authContext.logout}>Logout</Link>
                            </li> :
                            <li>
                                <Link className="link" to = "/login">Login</Link>
                            </li>
                        }
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Navbar;