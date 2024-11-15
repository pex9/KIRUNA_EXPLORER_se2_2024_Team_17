import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'
import "./WelcomePage.css";
import { useState, useEffect } from 'react'
import AppContext from './AppContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login';
import Default from './components/Default';
import Home from './components/Home';
import API from './API';
import ModifyDocument from './components/ModifyDocument';
import MyNavbar from './components/MyNavbar';
import WelcomePage from './components/WelcomePage';

function App() {
  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  const [viewMode, setViewMode] = useState('map');
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Authentication check
  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        setLoggedIn(false);
        setUser(undefined);
      }
    }
    checkAuth();
  }, []);

  function loginSuccessful(user) {
    setUser(user);
    setLoggedIn(true);
  }

  async function doLogout() {
    await API.logout();
    setLoggedIn(false);
    setUser(undefined);
  }

  return (
    <BrowserRouter>
      <AppContext.Provider value={{
        loginState: {
          user: user,
          loggedIn: loggedIn,
          loginSuccessful: loginSuccessful,
          doLogout: doLogout
        },
        viewMode: {
          viewMode: viewMode,
          setViewMode: setViewMode
        },
        selectedDocument: selectedDocument,
        setSelectedDocument: setSelectedDocument,
      }}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<><MyNavbar /><Home /></>} />
          <Route path="/documents/modify-document/:documentId" element={<><MyNavbar /><ModifyDocument /></>} />
          <Route path="/documents/create-document" element={<><MyNavbar /><ModifyDocument /></>} />
          <Route path="/*" element={<><MyNavbar /><Default /></>} />
        </Routes>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
