import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../components/Lobby.css';

function Home() {
    const navigate = useNavigate();
  return (
    <>
        <div>Home</div>
        <button onClick={navigate('/lobby')}>Lobby</button>
        <button onClick={() => {localStorage.removeItem('token'), localStorage.removeItem('userId'), navigate('/login')}}>Logout</button>
    </>
  )
}

export default Home