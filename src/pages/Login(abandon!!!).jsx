import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext.js'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const userUUID = uuidv4()

const Login = () => {
  useEffect(() => {
    // 获取DOM元素的引用
    const switchCtn = document.querySelector('#switch-ctn')
    const switchC1 = document.querySelector('#switch-c1')
    const switchC2 = document.querySelector('#switch-c2')
    const switchCircle = document.querySelectorAll('.switch_circle')
    const switchBtn = document.querySelectorAll('.switch-btn')
    const aContainer = document.querySelector('#a-container')
    const bContainer = document.querySelector('#b-container')
    const allButtons = document.querySelectorAll('.submit')

    // 阻止默认事件的函数
    const getButtons = (e) => e.preventDefault()

    // 切换表单的函数
    const changeForm = () => {
      // 修改类名
      switchCtn.classList.add('is-gx')
      setTimeout(function () {
        switchCtn.classList.remove('is-gx')
      }, 1500)
      switchCtn.classList.toggle('is-txr')
      switchCircle[0].classList.toggle('is-txr')
      switchCircle[1].classList.toggle('is-txr')
      switchC1.classList.toggle('is-hidden')
      switchC2.classList.toggle('is-hidden')
      aContainer.classList.toggle('is-txl')
      bContainer.classList.toggle('is-txl')
      bContainer.classList.toggle('is-z')
    }

    // 给按钮添加事件监听器
    const addEventListeners = () => {
      for (let i = 0; i < allButtons.length; i++) {
        allButtons[i].addEventListener('click', getButtons)
      }
      for (let i = 0; i < switchBtn.length; i++) {
        switchBtn[i].addEventListener('click', changeForm)
      }
    }
    // 在组件加载后执行初始化操作
    addEventListeners()

    return () => {
      for (let i = 0; i < allButtons.length; i++) {
        allButtons[i].removeEventListener('click', getButtons)
      }
      for (let i = 0; i < switchBtn.length; i++) {
        switchBtn[i].removeEventListener('click', changeForm)
      }
    }
  }, []) // 空数组表示只在组件加载和卸载时执行一次

  const [showSuccessDialog, setShowSuccessDialog] = useState(false) //!!!!!!!!!!!!!!!!!!!!!!!!

  const [reginputs, setReginputs] = useState({
    uuid: userUUID,
    username: '',
    password: '',
    img: '0',
  })
  const [loginputs, setLoginputs] = useState({
    username: '',
    password: '',
  })
  const [err, setError] = useState(null)

  const navigate = useNavigate()

  const { login } = useContext(AuthContext)

  const changeForm = () => {
    setError(null)
  }
  const signconfirm = () => {
    setShowSuccessDialog(false)
    window.location.reload()
  }
  const handleChange = (e) => {
    setReginputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    console.log(reginputs)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/auth/register', reginputs)
      console.log(res.data)
      const res1 = await axios.post('/record', res.data)//日志
      setShowSuccessDialog(true)
    } catch (err) {
      setError(err.response.data)
    }
  }
  const handleChange1 = (e) => {
    setLoginputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleSubmit1 = async (e) => {
    e.preventDefault()
    try {
      console.log(123123333)
      console.log(loginputs)
      await login(loginputs)
      navigate('/')
    } catch (err) {
      console.log(err)
      setError(err.response.data)
    }
  }

  return (
    <div className="loginbox">
      {showSuccessDialog
        ? (
        <div className="success-dialog">
          <p>注册成功！！！</p>
          <button onClick={signconfirm}>点击确定</button>
        </div>)
        : (
          ''
        )}
      <div className="shell">
        <div className="containerlo a-container" id="a-container">
          <form method="post" className="form" id="a-form">
            <h2 className="form_title title">登入账号</h2>
            <span className="form_span">xxx</span>
            <input
              required
              type="text"
              placeholder="用户名"
              name="username"
              className="form_input"
              onChange={handleChange1}
            />
            <input
              required
              type="password"
              placeholder="密码"
              name="password"
              className="form_input"
              onChange={handleChange1}
            />
            <a href="/" className="form_link">
              忘记密码？
            </a>
            <button
              className="form_button button submit"
              onClick={handleSubmit1}>
              登 录
            </button>
            {err && <p className="errtext">{err}</p>}
          </form>
        </div>
        <div className="containerlo b-container" id="b-container">
          <form action="" method="post" className="form" id="a-form">
            <h2 className="form_title title">创建账号</h2>
            <span className="form_span">xxx</span>
            <input
              required
              type="text"
              placeholder="用户名"
              name="username"
              className="form_input"
              onChange={handleChange}
            />
            <input
              required
              type="password"
              placeholder="密码"
              name="password"
              className="form_input"
              onChange={handleChange}
            />
            <input
              required
              type="text"
              placeholder="邀请码"
              name="invitecode"
              className="form_input"
              onChange={handleChange}
            />
            <button
              onClick={handleSubmit}
              className="form_button button submit">
              注册
            </button>
            {err && <p className="errtext">{err}</p>}
          </form>
        </div>

        <div className="switch" id="switch-ctn">
          <div className="switch_circle"></div>
          <div className="switch_circle switch_circle-t"></div>

          <div className="switch_container" id="switch-c1">
            <h2 className="switch_title title">战友，你好！</h2>
            <p className="switch_description description">
              还没有账号吗？快来注册！
            </p>
            <button
              className="switch_button button switch-btn"
              onClick={changeForm}>
              注册
            </button>
          </div>

          <div className="switch_container is-hidden" id="switch-c2">
            <h2 className="switch_title title">战友，欢迎你！</h2>
            <p className="switch_description description">已经有账号了吗？</p>
            <button
              className="switch_button button switch-btn"
              onClick={changeForm}>
              登 录
            </button>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Login
