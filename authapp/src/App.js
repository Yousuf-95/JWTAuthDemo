import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Navbar from './components/nav';
import Home from './pages/home'
import LoginPage from './pages/login';
import {AuthContext,AuthProvider} from './context/authContext';

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
            </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
