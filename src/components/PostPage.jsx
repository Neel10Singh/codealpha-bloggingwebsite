import React, { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import bloganim from '../animations/animation_lkjxqk12.json'
import mounts from '../images/mountains.jpg'
import 'font-awesome/css/font-awesome.min.css'
import { Link, useParams } from 'react-router-dom'
import { collection, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

function PostPage() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  useEffect(() => {
    id && getBlogDetails()
  }, [id])
  const getBlogDetails = async () => {
    const docref = doc(db, 'blogs', id)
    const blogDetails = await getDoc(docref)
    setBlog(blogDetails.data())
    console.log(blogDetails)
  }
  return (
    <div className='postpage'>
      <div className='mainpagefullhead'>
        <Lottie animationData={bloganim} className='lottieanimation'></Lottie>
        <div className='mainpageheader'>
          <h1>OurSpace</h1>
          <button className=' headerbutton loginbutton'>Login</button>
          <button className='headerbutton signupbutton'>SignUp</button>
        </div>
      </div>
      <div className='postexpanded'>
        <img src={blog?.imgUrl} className='posteximg'></img>
        <span className='postdets'>
          Blog by: {blog?.author}, Posted on:{' '}
          {blog?.timestamp?.toDate().toDateString()}
        </span>
        <div className='posttags2'>
          {blog?.tags.map((tag) => {
            return <span className='filterbut'>{tag}</span>
          })}
        </div>
        <div className='postexdesc'>{blog?.body}</div>
      </div>
      <button className='backbut'>
        <Link to='/' style={{ textDecoration: 'none', color: '#bcd1ec' }}>
          <i className='fa fa-arrow-left'></i>
        </Link>
      </button>
    </div>
  )
}

export default PostPage
