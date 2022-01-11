import React, {useState, useContext} from 'react';
import '../styles/login.css';
import { AuthContext } from '../context/authContext';
import { Navigate } from 'react-router-dom';


const LoginPage = () => {
    const authContext = useContext(AuthContext);
    let [username,setUsername] = useState('');
    let [password,setPassword] = useState('');
    let [redirectOnLogin, setRedirectOnLogin] = useState(false);
    // let [countdown, setCountdown] = useState('');

    const submitLoginCredentials = async (e) => {
        e.preventDefault();
        const submitResult = await fetch('/login/auth', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                "content-type": "application/json"
            }
        });

        const data = await submitResult.json();
        console.table(data);
        authContext.setAuthState(data);
        setRedirectOnLogin(true);
    }

    // const redirect = () => {
    //     let count = 3;
    //     setInterval(()=> {
    //         setCountdown(count);
    //         count--;

    //         if(count === 0){
    //             setRedirectOnLogin(true);
    //         }

    //     },1000);        
    // }
    

    return(
        <>
        {redirectOnLogin && <Navigate to="/" />}
            <section id="login-page" className="container">
                {/* <div className="container"> */}
                    <div className="flex-container">

                        <div className="form-container">
                            <form className="login-form">
                                <h2>Token Info</h2>
                                <div className="form-group">
                                    <label>Token</label>
                                    <input type="text" value={authContext.authState.token}  />
                                </div>
                                <div className="form-group">
                                    <label>Expires at</label>
                                    <input type="text" value={authContext.authState.expiresAt} />
                                </div>

                                <button type="submit" className="btn">---</button>
                            </form>
                        </div>

                        <div className="form-container">
                            <form className="login-form">
                                <h2>Log In</h2>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>

                                <button type="submit" className="btn" onClick={(e) => {submitLoginCredentials(e)}}>Login</button>
                            </form>
                        </div>

                    </div>

                {/* </div> */}
            </section>
        </>
    );
}

export default LoginPage;