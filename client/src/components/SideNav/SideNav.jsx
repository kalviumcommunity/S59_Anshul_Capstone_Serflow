import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './SideNav.css'
import { useState } from 'react'
import Cookies from 'js-cookie'
import Avatar from '@mui/material/Avatar';

// MUI code for AVATAR GENERATION
function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}


function SideNav() {

  const [active, setActive] = useState(false)
  const [user, setUser] = useState('USER')


  function toggleNav() {
    setActive(!active)
  }

  useEffect(() => {
    Cookies.get('userName') && setUser(Cookies.get('userName'))
    },[])
  


  return (
    <div className={`sidebar ${active ? "active" : null} transition-all ease-in-out`}>
          <div className='top'>
              <div className='logo'>
                <img className='navlogo' src="/icon-red.svg" alt="" />
                <span>Serflow</span>
              </div>
              <i className='bx bx-menu ham-button' id='btn' onClick={()=>{toggleNav()}}></i>
          </div>

          <div className='user'>
              {/* <img src={
                Cookies.get('profileImage') ? Cookies.get('profileImage') : "/profile-picture.jpg"
              } className='user-img' alt="" /> */}

              <Avatar alt={user} src={Cookies.get('profileImage') ? Cookies.get('profileImage') : "/profile-picture.jpg"}/>

              <div>
                <p className='bold'>{user}</p>
                {/* <p>Admin</p> */}
              </div>
          </div>
          <div className='ul-div'>
          <ul>
            <li>
              <Link to='/dashboard' className='a'>
                <i className='bx bx-grid-alt'></i>
                <span className='nav-item'>Dashboard</span>
              </Link>
              <span className='tooltip'>Dashboard</span>
            </li>
            <li>
              <Link to='/dashboard/Tasks' className='a'>
              <i className='bx bx-bookmark-alt'></i>
                <span className='nav-item'>Tasks</span>
              </Link>
              <span className='tooltip'>Tasks</span>
            </li>
            <li>
              <Link to='/dashboard' className='a'>
                <i className='bx bx-bell'></i>
                <span className='nav-item'>Notifications</span>
              </Link>
              <span className='tooltip'>Notifications</span>
            </li>
            <li>
              <Link to='/dashboard' className='a'>
                <i className='bx bx-chat'></i>
                <span className='nav-item'>Messages</span>
              </Link>
              <span className='tooltip'>Messages</span>
            </li>
          </ul>
          <ul className='logout-ul'>
          <li>
              <Link to='/logout' className='a'>
                <i className='bx bx-log-out'></i>
                <span className='nav-item'>Logout</span>
              </Link>
              <span className='tooltip'>Logout</span>
            </li>
          </ul>
          </div>
    </div>
  )
}

export default SideNav