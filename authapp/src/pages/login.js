import React, {useState, useContext} from 'react';
import '../styles/login.css';
import { AuthContext } from '../context/authContext';





const LoginPage = () => {
    const authContext = useContext(AuthContext);
    let [username,setUsername] = useState('');
    let [password,setPassword] = useState('');

    const submitLoginCredentials = async (e) => {
        e.preventDefault();
        const submitResult = await fetch('http://localhost:4000/login/auth', {
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
        console.log(data);
        authContext.setAuthState(data);
    }

    return(
        <>
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

                                <button type="submit" className="btn">{}</button>
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