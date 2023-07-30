import logo from './logo.svg'
import './cssfiles/main.css'
import './App.css'
import MainPage from './components/MainPage'
import { Route, Routes } from 'react-router-dom'
import PostPage from './components/PostPage'
import UserDash from './components/UserDash'
import { useEffect, useState } from 'react'
import { auth } from './firebase'
function App() {
  const [user, setuser] = useState(null)
  useEffect(() => {
    auth.onAuthStateChanged((authuser) => {
      if (authuser) {
        setuser(authuser)
        // console.log(user)
      } else {
        setuser(null)
      }
    })
  }, [])
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<MainPage user={user} setuser={setuser} />} />
        <Route path='/post/:id' element={<PostPage />} />
        <Route path='/user' element={<UserDash />} />
      </Routes>
    </div>
  )
}

export default App
