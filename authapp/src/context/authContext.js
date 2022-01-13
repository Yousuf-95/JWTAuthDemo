import React, {useState, createContext} from 'react';

const AuthContext = createContext();

const {Provider} = AuthContext;

const AuthProvider = ({children}) => {
    // const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('expiresAt');

    let [authState, setAuthState] = useState({
        token: null,
        expiresAt
    });

    const setAuthInfo = ({token,expiresAt}) => {
        // localStorage.setItem('token',token);
        localStorage.setItem('expiresAt',expiresAt);
        
        setAuthState({
            token,
            expiresAt
        });
    };

    const isAuthenticated = () => {
        if(!authState.token || !authState.expiresAt)
            return false;

        return new Date().getTime() / 1000 < authState.expiresAt
    };

    const logout = () => {
        // localStorage.removeItem('token');
        localStorage.removeItem('expiresAt');
        setAuthState({
            token: null,
            expiresAt: null
        });
    }

    const getNewToken = async () => {
        try{
            const token = await fetch('/api/token/refresh');
            const result = await token.json();
            // console.log(result.token);
            // console.log(result.expiresAt);
            // console.log(authState);
            setAuthState(
                Object.assign({},{token: result.token},{expiresAt:result.expiresAt})
            )
            // console.log(authState);
            
        }
        catch(error){
            console.log(error);
        }
    }

    return(
        <Provider 
            value={{
                authState,
                setAuthState: (authInfo) => setAuthInfo(authInfo),
                isAuthenticated,
                logout,
                getNewToken
            }}
        >
            {children}
        </Provider>
    );
};

export {AuthContext,AuthProvider};
