import React, {useState, useContext} from 'react';
import { AuthContext } from '../context/authContext';

const AddUser = () => {
    const authContext = useContext(AuthContext);
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');
    
    const addUserCredentials = async (e) => {
        e.preventDefault();
        try{
            // console.log(authContext.authState.token);
            const submitResult = await fetch('/api/adduser', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                // "Authorization": 'Bearer ' + authContext.authState.token,
                "content-type": "application/json"
            }
        });

        const data = await submitResult.json();
        console.log(data);
        }
        catch(error){
            console.log(error);
        }
        
    }

    return(
        <>
            <section id="login-page" className="container">
                {/* <div className="container"> */}
                    <div className="flex-container">
                        <div className="form-container">
                            <form className="login-form">
                                <h2>Add User</h2>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>

                                <button type="submit" className="btn" onClick={(e) => addUserCredentials(e)}>Add User</button>
                            </form>
                        </div>

                    </div>

                {/* </div> */}
            </section>
        </>
    );
};

export default AddUser;