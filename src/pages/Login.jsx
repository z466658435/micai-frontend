import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext.js'
import axios from 'axios'
import {
  CloseOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ArrowRightOutlined,
  SwapOutlined,
  RightCircleOutlined,
} from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
import { notification } from 'antd'

const userUUID = uuidv4()
const Register = () => {
  const [login_or_register, setLogin_or_register] = useState(0) //0登录 1注册
  const [err, setError] = useState(null)
  const [isEmailValid, setIsEmailValid] = useState(0)
  const [isEmailCodeValid, setIsEmailCodeValid] = useState(0)
  const [reginputs, setReginputs] = useState({
    uuid: userUUID,
    username: '',
    emailcode: '',
    invitecode: '',
    password: '',
    img: '0',
  })
  const [loginputs, setLoginputs] = useState({
    username: '',
    password: '',
  })
  const [modinputs, setModinputs] = useState({
    //修改密码
    username: '',
    emailcode: '',
    password: '',
    password1: '',
  })

  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  //登录数据
  const handleChange = (e) => {
    setLoginputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    console.log(loginputs)
  }

  //注册数据
  const handleChange1 = (e) => {
    setReginputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    console.log(reginputs)
  }

  //修改密码数据
  const handleChange2 = (e) => {
    setModinputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    console.log(modinputs)
  }

  //邮箱数据
  const emailChange = (e) => {
    setError(null)
    const emailValue = e.target.value
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

    console.log(isEmailValid)
    console.log(emailValue)
    if (!emailRegex.test(emailValue)) {
      setError('邮箱格式有误，请重新输入')
      setIsEmailValid(2)
    } else if (emailValue.trim() === '') {
      //该if未能实现 无法拿到emailValue为空的情况 暂不知道为什么 2023.11.4
      setIsEmailValid(0)
      console.log(5555)
    } else {
      setError(null)
      setIsEmailValid(1)
      setReginputs((prev) => ({ ...prev, ['username']: emailValue }))
      setModinputs((prev) => ({ ...prev, ['username']: emailValue }))
    }
  }

  //邮箱验证码数据
  const emailcodeChange = (e) => {
    setError(null)
    const emailcodeValue = e.target.value
    const emailcodeRegex = /^[a-zA-Z0-9._-]{6}$/
    if (!emailcodeRegex.test(emailcodeValue)) {
      setError('邮箱验证码格式有误，请重新输入')
      setIsEmailCodeValid(2)
    } else if (emailcodeValue === null) setIsEmailCodeValid(0)
    else {
      setError(null)
      setIsEmailCodeValid(1)
      setReginputs((prev) => ({ ...prev, ['emailcode']: emailcodeValue }))
      setModinputs((prev) => ({ ...prev, ['emailcode']: emailcodeValue }))
    }
  }

  //发送邮箱验证码按钮
  const [api, contextHolder] = notification.useNotification()
  const emailCodeSubmit = async () => {
    console.log(111)
    const placement = 'bottomRight'
    // 检查上次发送邮件的时间
    const lastEmailSentTime = localStorage.getItem('emailSentTime')
    if (lastEmailSentTime) {
      // 比较时间间隔，例如，如果在1分钟内再次发送邮件则阻止
      const currentTime = Date.now()
      const timeDifference = currentTime - parseInt(lastEmailSentTime, 10)
      console.log(timeDifference)
      if (timeDifference < 1 * 60 * 1000) {
        // 1分钟的时间限制
        // 阻止用户连续发送邮件
        api.info({
          message: `邮箱验证码`,
          description: `请${
            60 - Math.floor(timeDifference / 1000)
          }秒后再试，不能连续发送邮件。`,
          placement,
          icon: (
            <ExclamationCircleOutlined
              style={{
                color: 'red',
              }}
            />
          ),
        })
        return
      }
    }
    if (isEmailValid == true) {
      try {
        const res = await axios.get(`auth/email_send/${reginputs.username}`)
        console.log(res.data)
        console.log(555)
        const recordinputs = {
          operation: "Email 发送验证码",
          resource_id: 0,
          region: "江苏 南京",
          user: reginputs.username,
          access: "普通用户",
          user_id: 0
        }
        const res1 = await axios.post('/record', recordinputs)//日志
        api.info({
          message: `邮箱验证码`,
          description: `已发送至您的邮箱，注意查收!`,
          placement,
          icon: (
            <CheckCircleOutlined
              style={{
                color: '#73a537',
              }}
            />
          ),
        })
        console.log(666)
        const emailSentTime = Date.now()
        localStorage.setItem('emailSentTime', emailSentTime)
      } catch (err) {
        console.log(err)
        api.info({
          message: `邮箱验证码`,
          description: `不存在的邮箱，请输入正确的邮箱！`,
          placement,
          icon: (
            <CloseCircleOutlined
              style={{
                color: 'red',
              }}
            />
          ),
        })
      }
    } else {
      api.info({
        message: `邮箱验证码`,
        description: `邮箱格式输入错误，无法发送！`,
        placement,
        icon: (
          <CloseCircleOutlined
            style={{
              color: 'red',
            }}
          />
        ),
      })
    }
  }

  //登录按钮
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log(123123333)
      console.log(loginputs)
      await login(loginputs)
      navigate('/')
    } catch (err) {
      console.log(err)
      console.log(err.response)
      console.log(err.response.data)
      setError(err.response.data)
    }
  }

  //注册按钮
  const RegisterSubmit = async (e) => {
    const placement = 'bottomRight'
    console.log(222)
    //先验证 验证码和邀请码 都通过则可以创建
    e.preventDefault()
    if (isEmailCodeValid == 1 && isEmailValid == 1) {
      try {
        console.log(reginputs)
        console.log(reginputs['username'])
        console.log(reginputs.username)
        const res = await axios.post('/auth/register', reginputs)
        console.log(res.data)
        const res1 = await axios.post('/record', res.data) //日志
        api.info({
          message: `新用户注册`,
          description: `账号注册成功!`,
          placement,
          icon: (
            <CheckCircleOutlined
              style={{
                color: '#73a537',
              }}
            />
          ),
        })
        setTimeout(() => {
          setLogin_or_register(0)
        }, 500)
      } catch (err) {
        setError(err.response.data)
      }
    } else {
      setError('请输入正确格式的数据')
    }
  }

  //修改密码确定按钮
  const ModifySubmit = async (e) => {
    const placement = 'bottomRight'
    console.log(222)
    //先验证 验证码和邀请码 都通过则可以创建
    e.preventDefault()
    if (isEmailCodeValid == 1 && isEmailValid == 1) {
      if (modinputs.password && modinputs.password == modinputs.password1) {
        try {
          // console.log(modinputs)
          const res = await axios.post('/auth/modify', modinputs)
          console.log(res.data)
          const res1 = await axios.post('/record', res.data) //日志
          api.info({
            message: `修改&找回密码`,
            description: `密码已成功修改!`,
            placement,
            icon: (
              <CheckCircleOutlined
                style={{
                  color: '#73a537',
                }}
              />
            ),
          })
          setTimeout(() => {
            setLogin_or_register(0)
          }, 500)
        } catch (err) {
          // console.log(err)
          // console.log(err.response)
          // console.log(err.response.data)
          setError(err.response.data)
        }
      } else {
        setError('两次输入的密码不一致')
      }
    } else {
      setError('请输入正确格式的数据')
    }
  }

  //点击切换至登录页
  const switch_to_login = () => {
    setError(null)
    setReginputs({
      uuid: userUUID,
      username: '',
      emailcode: '',
      invitecode: '',
      password: '',
      img: '0',
    })
    setLoginputs({
      username: '',
      password: '',
    })
    setModinputs({
      //修改密码
      username: '',
      emailcode: '',
      password: '',
    })
    setLogin_or_register(0)
  }

  //点击切换至注册页
  const switch_to_register = () => {
    setError(null)
    setReginputs({
      uuid: userUUID,
      username: '',
      emailcode: '',
      invitecode: '',
      password: '',
      img: '0',
    })
    setLoginputs({
      username: '',
      password: '',
    })
    setModinputs({
      //修改密码
      username: '',
      emailcode: '',
      password: '',
    })
    setLogin_or_register(1)
  }

  //点击切换至修改密码页
  const switch_to_modify = () => {
    setError(null)
    setReginputs({
      uuid: userUUID,
      username: '',
      emailcode: '',
      invitecode: '',
      password: '',
      img: '0',
    })
    setLoginputs({
      username: '',
      password: '',
    })
    setModinputs({
      //修改密码
      username: '',
      emailcode: '',
      password: '',
    })
    setLogin_or_register(-1) //修改页
  }

  useEffect(() => {
    //消除父级container的scroll
    const containerElement = document.querySelector('.container')
    containerElement.style.overflow = 'hidden'
  }, [])

  return (
    <div className="Login_OuterBox">
      <div className="part1">
        <span className="p1">南京工业大学</span>
        <span className="p11">迷彩协会</span>
        <p className="p2">NJTECH CAMOUFLAGE ASSOCIATION</p>
        <a href="/" className="button_a">
          <div className="button">
            <span>返回首页</span>
          </div>
        </a>
      </div>
      <div className="part2">
        {login_or_register === 0 && (
          <div className="loginbox">
            <div className="login">
              <h1 className="title">登 录</h1>
              <div className="inputbox">
                <input
                  required
                  type="text"
                  placeholder="邮箱"
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
                <a onClick={switch_to_modify} className="form_link">
                  修改密码 & 忘记密码
                </a>
                <button onClick={handleSubmit} className="login_submit">
                  登 录
                </button>
              </div>
              <div className="err">{err}</div>
            </div>
            <button onClick={switch_to_register} className="switch_to_register">
              转入注册页 <ArrowRightOutlined />
            </button>
          </div>
        )}
        {login_or_register === 1 && (
          <div className="registerbox">
            <div className="register">
              <h1 className="title">注 册</h1>
              <div className="inputbigbox">
                <div className="inputbox">
                  {isEmailValid == 2 ? (
                    <CloseOutlined className="erricon" />
                  ) : (
                    <CloseOutlined className="erricon1" />
                  )}
                  <input
                    required
                    type="text"
                    placeholder="邮箱"
                    name="username"
                    className="form_input"
                    onChange={emailChange}
                  />
                </div>
                <div className="inputbox">
                  {isEmailCodeValid == 2 ? (
                    <CloseOutlined className="erricon" />
                  ) : (
                    <CloseOutlined className="erricon1" />
                  )}
                  <input
                    required
                    type="text"
                    placeholder="邮箱验证码"
                    name="emailcode"
                    className="form_input"
                    onChange={emailcodeChange}
                  />
                </div>
                <div className="inputbox">
                  <CloseOutlined className="erricon1" />
                  <input
                    required
                    type="password"
                    placeholder="密码"
                    name="password"
                    className="form_input"
                    onChange={handleChange1}
                  />
                </div>
                <div className="inputbox">
                  <CloseOutlined className="erricon1" />
                  <input
                    required
                    type="text"
                    placeholder="邀请码"
                    name="invitecode"
                    className="form_input"
                    onChange={handleChange1}
                  />
                </div>
                <div className="regbtn">
                  {contextHolder}
                  <button
                    onClick={emailCodeSubmit}
                    className="reg_submit emailbtn">
                    发送验证码
                  </button>
                  <button onClick={RegisterSubmit} className="reg_submit">
                    注 册
                  </button>
                </div>
                <div className="err">{err}</div>
              </div>
            </div>
            <button onClick={switch_to_login} className="switch_to_login">
              转入登录页 <ArrowRightOutlined />
            </button>
          </div>
        )}
        {login_or_register === -1 && (
          <div className="registerbox">
            <div className="register">
              <div className="backicon" onClick={switch_to_login}>
                <RightCircleOutlined />
              </div>
              <h1 className="title">修改&找回密码</h1>
              <div className="inputbigbox">
                <div className="inputbox">
                  {isEmailValid == 2 ? (
                    <CloseOutlined className="erricon" />
                  ) : (
                    <CloseOutlined className="erricon1" />
                  )}
                  <input
                    required
                    type="text"
                    placeholder="邮箱"
                    name="username"
                    className="form_input"
                    onChange={emailChange}
                  />
                </div>
                <div className="inputbox">
                  {isEmailCodeValid == 2 ? (
                    <CloseOutlined className="erricon" />
                  ) : (
                    <CloseOutlined className="erricon1" />
                  )}
                  <input
                    required
                    type="text"
                    placeholder="邮箱验证码"
                    name="emailcode"
                    className="form_input"
                    onChange={emailcodeChange}
                  />
                </div>
                <div className="inputbox">
                  <CloseOutlined className="erricon1" />
                  <input
                    required
                    type="password"
                    placeholder="输入新密码"
                    name="password"
                    className="form_input"
                    onChange={handleChange2}
                  />
                </div>
                <div className="inputbox">
                  <CloseOutlined className="erricon1" />
                  <input
                    required
                    type="password"
                    placeholder="再次输入新密码"
                    name="password1"
                    className="form_input"
                    onChange={handleChange2}
                  />
                </div>
                <div className="regbtn">
                  {contextHolder}
                  <button
                    onClick={emailCodeSubmit}
                    className="reg_submit emailbtn">
                    发送验证码
                  </button>
                  <button onClick={ModifySubmit} className="reg_submit">
                    确 定
                  </button>
                </div>
                <div className="err">{err}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Register
