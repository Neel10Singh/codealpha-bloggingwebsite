import React, { useState, useEffect } from 'react'
import 'font-awesome/css/font-awesome.min.css'

import { Link, useNavigate } from 'react-router-dom'
import postimg from '../images/mountains.jpg'

function UserDash() {
  // const [currentuserdash, setCurrentuserdash] = useState({})

  // const usersRef = collection(db, 'users')
  // useEffect(() => {
  //   const getUserlist = async () => {
  //     const data = await getDocs(usersRef)
  //     let datalist = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  //     datalist = datalist.filter((data) => {
  //       return data.email === auth?.currentUser?.email
  //     })
  //     setCurrentuserdash(datalist[0])
  //   }
  //   getUserlist()
  // }, [])

  // const navigate = useNavigate()
  // const logout = async () => {
  //   try {
  //     await signOut(auth)
  //     if (islogin) {
  //       setisLogin(false)
  //       setIsModalOpen(true)
  //       setModalContent('Sussessfully signed out! Thanks for visiting')
  //       navigate('/')
  //     }
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }
  return (
    <div className='userdashpage'>
      <div className='userinfodash'>
        <span>User:</span>
        <span>Neelaksh Singh</span>
        <button className='logoutbut'>LogOut</button>
      </div>
      <div className='postsbigbox2'>
        <h2 className='posttitle'>My Posts</h2>
        <div className='dividermain' />
        <div className='postsbox'>
          <button className='post'>
            <img src={postimg} className='postimg'></img>
            <div className='postdesc'>
              <span className='postbody'>
                A mountain is an elevated portion of the Earth's crust,
                generally with steep sides that show significant exposed
                bedrock. Although definitions vary, a mountain may differ from a
                plateau in having a limited summit area, and is usually higher
                than a hill, typically rising at least 300 metres (980 ft) above
                the surrounding land.
              </span>
              <div className='posttags'>
                <span className='filterbut'>Nature</span>
                <span className='filterbut'>Photography</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDash
