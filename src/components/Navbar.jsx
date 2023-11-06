import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import micaiLogo from '../static/img/micai.ico'
import { AuthContext } from '../context/authContext'
import axios from 'axios'
import avatar0 from '../static/img/0.jpg'

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext)
  const [avatardata, setAvatardata] = useState({})
  // console.log(currentUser)
  // console.log(123)

  //navbar中的animation滑块随着url的变化而变化
  const [initialLeft, setInitialLeft] = useState(0)
  const location = useLocation()
  useEffect(() => {
    if (location.pathname === '/pic') {
      setInitialLeft(120)
    } else if (location.pathname === '/') {
      setInitialLeft(0)
    } else if (location.pathname === '/article') {
      setInitialLeft(240)
    } else {
      setInitialLeft(-120)
    }
  }, [location.pathname])

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          const imageurl = currentUser.img
          const userid = currentUser.id
          if (imageurl == '0') {
            setAvatardata(avatar0)
          } else {
            // console.log(22222)
            // console.log(userid)
            const avatar_image = await axios.get(
              `/image/${imageurl}?userid=${userid}`,
              {
                responseType: 'blob', // 设置响应类型为 Blob
              }
            )
            setAvatardata(URL.createObjectURL(avatar_image.data))
          }
        } catch (err) {
          console.log(err)
        }
      }
    }
    fetchData()
  }, [currentUser])

  return (
    <div className="navbar">
      {/* <div className="logo">
        <Link to='/'>
          <img src={micaiLogo} alt="" />
        </Link>
      </div> */}
      <div className="links">
        <Link className="link" to="/">
          <span>首页</span>
        </Link>
        <Link className="link" to="/pic">
          <span>成员相册</span>
        </Link>
        <Link className="link" to="/article">
          <span>文章专区</span>
        </Link>
        <Link className="link" to="/">
          <span>GPT</span>
        </Link>
        {currentUser ? (
          <Link className="link" onClick={logout}>
            <span>登出</span>
          </Link>
        ) : (
          <Link className="link" to="/login">
            <span>登录</span>
          </Link>
        )}
        <div
          className={`animation ${
            initialLeft === 120
              ? 'hovered'
              : initialLeft === 240
              ? 'hovered1'
              : initialLeft === -120
              ? 'singlehover'
              : ''
          }`}></div>
      </div>
      {currentUser ? (
        <div className="user">
          <a href={`/back`}>
            <img src={avatardata} alt="" className="userimg" />
          </a>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default Navbar
