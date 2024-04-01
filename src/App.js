import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './userHome'
import Login from './loginPage'
import ListenHome from './listenHome'
import Playlist from './playlist';

import './App.css'
import { useEffect, useState } from 'react'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>



          <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
          <Route path="/loginPage" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />


          <Route>
            <Route path="/listenHome" element={<ListenHome email={email} loggedIn={loggedIn} />} />
            <Route path="/playlist/:playlistId" element={<Playlist />} />
          </Route>



        </Routes>
      </BrowserRouter>
    </div >
  )
}

export default App