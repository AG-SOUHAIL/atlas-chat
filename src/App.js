import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useContext, useEffect } from 'react';
import Signup from './pages/signup/Signup';
import { AuthContext } from './context/AuthContext';
import Conversation from './components/conversation/Conversation';


function App() {

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should only happen once
    });
  }, []);

  const { currentUser } = useContext(AuthContext);
  
  const RequireAuth = ({ children }) => {
    return currentUser ? (children) : <Navigate to="/signup" />;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<RequireAuth><Home/></RequireAuth>}/>
          <Route path='/conversation' element={<RequireAuth><Conversation/></RequireAuth>}/>
          <Route path='/signup' element={<Signup/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
