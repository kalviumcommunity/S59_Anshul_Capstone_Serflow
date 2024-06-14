import './App.css'
import Loader from './components/Loader'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Logout from './Pages/Logout'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './Pages/Home/Home'
import Dashboard from './Pages/Dashboard/Dashboard'
import Profile from './Pages/Profile/Profile'
import GoogleSuccess from './components/Auth/GoogleSuccess'


function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path={'/'} element={<Home/>} />
        <Route path={'/login'} element={<Login/>} />
        <Route path={'/signup'} element={<Signup/>} />
        <Route path={'/logout'} element={<Logout/>} />
        <Route path={'/loader'} element={<Loader/>} />
        <Route path={'/Dashboard/*'} element={<Dashboard/>} />
        <Route path={'/oauth'} element={<GoogleSuccess/>} />
        <Route path={'/profile'} element={<Profile/>} />
      </Routes>
    </Router>
    </>
  )
}

export default App
