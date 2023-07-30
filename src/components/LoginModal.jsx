import React from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { toast } from 'react-toastify'
import { auth } from '../firebase'

function LoginModal({ setLoginOpen, loginopen, state, setState }) {
  const signin = async (e) => {
    e.preventDefault()
    if (state.email && state.password) {
      try {
        const { user } = await signInWithEmailAndPassword(
          auth,
          state.email,
          state.password
        )

        toast.success('Signed-in')
        setLoginOpen(false)
      } catch (error) {
        return toast.error(error)
      }
    } else {
      return toast.error("Email and Password can't be empty")
    }
  }
  const handlechange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }
  return (
    <div className={loginopen ? 'projectmodal' : 'modalhidden'}>
      <div className='modalcontent'>
        <form className='modalform'>
          <h1>Sign In</h1>
          <input
            type='text'
            className='modalinput'
            name='email'
            value={state.email}
            placeholder='enter email here..'
            onChange={handlechange}
          ></input>
          <input
            type='password'
            className='modalinput'
            name='password'
            value={state.password}
            placeholder='enter password here...'
            onChange={handlechange}
          ></input>
          <button className='openproject' onClick={signin}>
            SignIn
          </button>
        </form>

        <button className='closemodal' onClick={() => setLoginOpen(false)}>
          Close
        </button>
      </div>
    </div>
  )
}
export default LoginModal
