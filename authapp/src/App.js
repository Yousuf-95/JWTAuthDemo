import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import {useContext} from 'react';
import Navbar from './components/nav';
import Home from './pages/home'
import LoginPage from './pages/login';
import {AuthContext,AuthProvider} from './context/authContext';
import AddUser from './pages/add-user';


const RequireAuth = ({children}) => {
  const authContext = useContext(AuthContext);
  return(
    authContext.isAuthenticated() ? children : <Navigate to="/" />
  );
}


function App() {
  // const authContext = useContext(AuthContext);
  return (
    <AuthProvider>
    <Router>
      <div className="App">
          <Navbar/>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/login" element={<LoginPage />} />
              <Route exact path="/add-user" element={
                <RequireAuth><AddUser /></RequireAuth>
              }
              />

              {/* Below routing doesnot work and had to define a new functional component just for this case */}
              {/* <Route path="/add-user" element={() => authContext.isAuthenticated() ? (<AddUser />) : (<Home />)} />
                {
                  () => authContext.isAuthenticated() ? <AddUser /> : <Navigate to="/" />
                }
              </Route> */}
            </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
