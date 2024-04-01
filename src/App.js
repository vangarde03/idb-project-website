import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './userHome'
import Login from './loginPage'
import ListenHome from './listenHome'
import Playlist from './playlist';
import AdminPage from './adminHome';
import ArtistHome from './artistHome';
import Podcast from './podcast';
import Album from './album';
import CreatePlaylist from './createPlaylist';
import CreatePodcast from './createPodcast';
import CreateAlbum from './createAlbum';
import FollowArtist from './followArtist';
import FollowListener from './followListener';
import RemoveFoll from './removeFoll';

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
          <Route path="/listenHome" element={<ListenHome email={email} loggedIn={loggedIn} />} />

          <Route path="/ArtistHome" element={<ArtistHome email={email} loggedIn={loggedIn} />} />
          <Route path="/podcast/:podcastId" element={<Podcast />} />
          <Route path="/album/:albumId" element={<Album />} />

          <Route path="/createPodcast/:artistId" element={<CreatePodcast />} />
          <Route path="/createAlbum/:artistId" element={<CreateAlbum />} />







          <Route path="/adminHome" element={<AdminPage />} />
          <Route path="/playlist/:playlistId" element={<Playlist />} />
          <Route path="/createPlaylist/:listenerId" element={<CreatePlaylist />} />
          <Route path="/followArtist/:userId" element={<FollowArtist />} />
          <Route path="/followListener/:userId" element={<FollowListener />} />
          <Route path="/removeFoll/:userId" element={<RemoveFoll />} />



        </Routes>
      </BrowserRouter>
    </div >
  )
}

export default App