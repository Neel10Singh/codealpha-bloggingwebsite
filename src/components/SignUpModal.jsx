import React from 'react'
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebase'

function SignUpModal({ state, setState, setSignupOpen, signupopen }) {
  const signup = async (e) => {
    e.preventDefault()

    if (state.name && state.email && state.password) {
      try {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          state.email,
          state.password
        )
        const name = state.name
        await updateProfile(user, { displayName: name })
        toast.success('Account Created')
        setSignupOpen(false)
      } catch (error) {
        return toast.error(error)
      }
    } else {
      return toast.error("Signup Fields can't be empty")
    }
  }
  const handlechange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  return (
    <div className={signupopen ? 'projectmodal' : 'modalhidden'}>
      <div className='modalcontent'>
        <form className='modalform'>
          <h1>Sign Up</h1>
          <input
            type='text'
            className='modalinput'
            name='name'
            value={state.name}
            placeholder='enter name here..'
            onChange={handlechange}
          ></input>
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
            name='password'
            value={state.password}
            className='modalinput'
            placeholder='enter password here...'
            onChange={handlechange}
          ></input>
          <input
            type='text'
            name='confirmpassword'
            value={state.confirmpassword}
            className='modalinput'
            placeholder='enter password again here...'
            onChange={handlechange}
          ></input>
          <button className='openproject' type='submit' onClick={signup}>
            SignUp
          </button>
        </form>

        <button className='closemodal' onClick={() => setSignupOpen(false)}>
          Close
        </button>
      </div>
    </div>
  )
}
export default SignUpModal
