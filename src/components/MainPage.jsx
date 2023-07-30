import React, { useState, useRef, useEffect } from 'react'
import Lottie from 'lottie-react'
import bloganim from '../animations/animation_lkjxqk12.json'
import loader from '../animations/loader.json'
import 'font-awesome/css/font-awesome.min.css'
import postimg from '../images/mountains.jpg'
import LoginModal from './LoginModal'
import SignUpModal from './SignUpModal'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { storage } from '../firebase'

import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'

function MainPage({ user, setuser }) {
  const navigate = useNavigate()
  const [postfile, setPostFile] = useState(null)
  useEffect(() => {
    const uploadFile = () => {
      const storageRef = ref(storage, postfile.name)
      const uploadTask = uploadBytesResumable(storageRef, postfile)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100

          setProgress(progress)
        },
        (error) => {
          console.log(toast.error('An error occured while uploading'))
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            toast.info('Image uploaded')
            setPostForm((prev) => ({ ...prev, imgUrl: downloadUrl }))
          })
        }
      )
    }
    postfile && uploadFile()
  }, [postfile])
  const userid = user?.uid
  const [posts, setPosts] = useState('Posts')
  const [loginopen, setLoginOpen] = useState(false)
  const [signupopen, setSignupOpen] = useState(false)
  const [progress, setProgress] = useState(null)
  const hiddenFileInput = React.useRef(null)
  const poststate = { body: '', tags: [], imgUrl: '' }
  const [postform, setPostForm] = useState(poststate)
  const [newtag, setNewTag] = useState('')
  const [blogs, setBlogs] = useState([])
  const [tempblogs, setTempBlogs] = useState([])
  const [action, setAction] = useState('Post')
  const [tags, setTags] = useState([])
  const [activetag, setactivetag] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'blogs'),
      (snapshot) => {
        let list = []
        let tags = []
        snapshot.docs.forEach((doc) => {
          tags.push(...doc.get('tags'))
          list.push({ id: doc.id, ...doc.data() })
        })
        const uniqueTags = [...new Set(tags)]
        setTags(uniqueTags)
        setBlogs(list)
        setTempBlogs(list)
        setIsLoading(false)
      },
      (error) => {
        console.log(error)
      }
    )
    return () => unsub()
  }, [])
  useEffect(() => {
    if (progress !== null && progress < 100) {
      const but = document.getElementById('postbut')
      but.classList.add('hidden')
    }
    if (progress === 100) {
      const but = document.getElementById('postbut')
      but.classList.remove('hidden')
    }
  }, [progress])
  const initialstate = {
    email: '',
    password: '',
    name: '',
    confirmpassword: '',
  }
  const [state, setState] = useState(initialstate)

  const Logout = () => {
    signOut(auth).then(() => {
      setuser(null)
      toast.success('Logged out Successfully!')
    })
  }

  const handlepostchange = (e) => {
    setPostForm({ ...postform, body: e.target.value })
  }
  const handletagaddition = (e) => {
    if (newtag == '') {
      return toast.error('Please enter tag name')
    }
    let list = postform.tags

    if (list.length < 3) {
      list = [...list, newtag]
      setPostForm({ ...postform, tags: list })
      setNewTag('')
    } else {
      setNewTag('')
      toast.info('Maximum tag limit reached')
    }
  }
  const removetag = (tag) => {
    let list = postform.tags.filter((each) => {
      return each !== tag
    })
    setPostForm({ ...postform, tags: list })
    setNewTag('')
  }
  const makepost = async () => {
    if (userid) {
      if (postform.body && postform.tags.length !== 0 && postform.imgUrl) {
        if (action === 'Post') {
          try {
            await addDoc(collection(db, 'blogs'), {
              ...postform,
              timestamp: serverTimestamp(),
              author: user.displayName,
              authorid: userid,
            })
            toast.success('Blog Posted;)')
            setPostForm({ ...postform, body: '', tags: [], imgUrl: '' })
          } catch (error) {
            toast.error('error in posting')
            console.log(error)
          }
        } else {
          try {
            await updateDoc(doc(db, 'blogs', postform.id), {
              ...postform,
              timestamp: serverTimestamp(),
              author: user.displayName,
              authorid: userid,
            })
            toast.success(`Blog ${action}ed;)`)
            setAction('Post')
            setPostForm({ ...postform, body: '', tags: [], imgUrl: '' })
          } catch (error) {
            toast.error('error in posting')
            console.log(error)
          }
        }
      } else {
        toast.error('Missing filelds!!')
      }
    } else {
      toast.info('Login please first')
    }
  }
  const handledelete = async (id) => {
    if (window.confirm('Are you Sure?')) {
      try {
        await deleteDoc(doc(db, 'blogs', id))
        toast.info('Blog Succesfully Deleted :(')
        navigate('/')
      } catch (error) {
        toast.error("Can't delete!")
        console.log(error)
      }
    }
  }
  const updateblog = (id) => {
    const currblog = blogs.filter((b) => {
      return b.id == id
    })
    // console.log(currblog[0])
    setAction('Edit')
    setPostForm(currblog[0])
  }
  const filterposts = (tag) => {
    setTempBlogs(
      blogs.filter((blog) => {
        return blog.tags.includes(tag)
      })
    )
    setactivetag(tag)
  }
  const removefilter = () => {
    setactivetag(null)
    setTempBlogs(blogs)
  }
  return (
    <div className='mainpage'>
      <LoginModal
        setLoginOpen={setLoginOpen}
        loginopen={loginopen}
        state={state}
        setState={setState}
      />
      <SignUpModal
        setSignupOpen={setSignupOpen}
        signupopen={signupopen}
        state={state}
        setState={setState}
      />
      <ToastContainer position='top-center' />
      <div className='mainpagefullhead'>
        <Lottie animationData={bloganim} className='lottieanimation'></Lottie>
        <div className='mainpageheader'>
          <h1>OurSpace</h1>

          {!userid ? (
            <button
              className=' headerbutton loginbutton'
              onClick={() => {
                setLoginOpen(true)
              }}
            >
              Login
            </button>
          ) : (
            <button className=' headerbutton loginbutton' onClick={Logout}>
              Logout
            </button>
          )}
          {!userid ? (
            <button
              className='headerbutton signupbutton'
              onClick={() => setSignupOpen(true)}
            >
              SignUp
            </button>
          ) : (
            <button className='headerbutton signupbutton'>MyPosts</button>
          )}
        </div>
      </div>
      <div className='newpostbox'>
        <h2>{action}</h2>
        <div className='divider'></div>
        <textarea
          className='newposttext'
          placeholder="What's on your mind?"
          name='body'
          value={postform.body}
          rows='20'
          onChange={handlepostchange}
        ></textarea>
        <div className='newtagsinput'>
          <input
            type='text'
            className='newtagstext'
            value={newtag}
            onChange={(e) => setNewTag(e.target.value.toLowerCase())}
            placeholder='add tag'
          ></input>
          <button className='newtags'>
            <i className='fa fa-plus' onClick={handletagaddition}></i>
          </button>
          <p className='newpostinfo'>*add maximum upto 3 tags</p>
        </div>
        <div className='showtags'>
          {postform?.tags.map((tag) => {
            return (
              <div className='tag'>
                {tag}
                <button className='crosstag' onClick={() => removetag(tag)}>
                  x
                </button>
              </div>
            )
          })}
        </div>
        {postform.imgUrl !== '' ? (
          <div className='showimg'>
            {
              <img
                src={postform.imgUrl === '' ? '#' : postform.imgUrl}
                className='uploadedimg'
              />
            }
          </div>
        ) : (
          <></>
        )}
        <div className='postbuttons'>
          <input
            type='file'
            className='attachbutton'
            ref={hiddenFileInput}
            onChange={(e) => {
              setPostFile(e.target.files[0])
              console.log(postfile)
            }}
            style={{ display: 'none' }}
          ></input>
          <button
            className='attachbutton'
            onClick={() => {
              hiddenFileInput.current.click()
            }}
          >
            <i className='fa fa-paperclip'></i>
          </button>
          <button
            className='newpostbutton'
            disabled={progress !== null && progress < 100}
            id='postbut'
            onClick={makepost}
          >
            {action}
          </button>
        </div>
      </div>
      <div className='tagsbox'>
        <h2>Apply Filters</h2>
        <div className='divider'></div>
        {activetag ? (
          <button className='filterbut2' onClick={removefilter}>
            Remove Filter
          </button>
        ) : (
          ''
        )}
        {tags.map((tag) => {
          return (
            <button className='filterbut' onClick={() => filterposts(tag)}>
              {tag}
            </button>
          )
        })}
      </div>
      {isLoading ? (
        <Lottie animationData={loader} />
      ) : (
        <div className='postsbigbox'>
          <h2 className='posttitle'>
            {posts}
            <span className='postfiltertitle'>
              {activetag ? <span>&#123; {activetag} &#125;</span> : ''}
            </span>
          </h2>
          <div className='dividermain' />
          <div className='postsbox'>
            {tempblogs?.map((blog) => {
              return (
                <div className='post'>
                  <img src={blog.imgUrl} className='postimg'></img>
                  <div className='postdesc'>
                    <span className='postbody'>{blog.body}</span>
                    <Link
                      to={`/post/${blog.id}`}
                      style={{ textDecoration: 'none', width: '100%' }}
                    >
                      <span className='readmore'>Read More</span>
                    </Link>
                    <div className='postfooter'>
                      <span className='postdets'>
                        Blog by: {blog.author}
                        <br /> Posted on:{' '}
                        {blog?.timestamp?.toDate().toDateString()}
                      </span>
                      {blog.authorid == userid ? (
                        <div className='postbuttons2'>
                          <button
                            className='editbut'
                            onClick={() => updateblog(blog?.id)}
                          >
                            <i className='fa fa-pencil'></i>
                          </button>
                          <button className='deletebut'>
                            <i
                              className='fa fa-trash'
                              onClick={() => handledelete(blog?.id)}
                            ></i>
                          </button>
                        </div>
                      ) : (
                        <></>
                      )}
                      <div className='posttags'>
                        {blog?.tags.map((tag) => {
                          return <span className='filterbut3'>{tag}</span>
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default MainPage
