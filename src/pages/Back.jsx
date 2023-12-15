import React, {  useContext, useEffect, useState } from 'react'
import {
  AppstoreOutlined,
  MailOutlined,
  LeftSquareOutlined,
  RightSquareOutlined,
} from '@ant-design/icons'
import micaiLogo from '../static/img/micai.ico'
import { AuthContext } from '../context/authContext'
import {
  Space,
  Menu,
  Alert,
  ConfigProvider,
} from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import 'react-quill/dist/quill.snow.css' //富文本编辑器

import Access_error from '../components/Back/Access_error'
import Art from '../components/Back/Art'
import Daily_record from '../components/Back/Daily_record'
import Invitecode from '../components/Back/Invitecode'
import Mem_art from '../components/Back/Mem_art'
import Mem_pic from '../components/Back/Mem_pic'
import Mem_file from '../components/Back/Mem_file'
import Profile from '../components/Back/Profile'
import Pic from '../components/Back/Pic'
import Statistic_record from '../components/Back/Statistic_record'

var admin_access = false
// const data = [
//   {
//     key: '1',
//     id: 1,
//     name: '熊金童',
//     gender: '男',
//     date: '2000-10',
//     nativePlace: '湖北省',
//     college: '计算机与人工智能学院',
//     major: '计算机科学与技术',
//     QQnumber: '466658435',
//     serviceTime: 2,
//     servicePlace: '福建',
//     station: '舰员',
//     tags: [],
//   },
//   {
//     key: '2',
//     id: 2,
//     name: '熊金童',
//     gender: '女',
//     date: '2000-10',
//     nativePlace: '湖北省',
//     college: '计算机与人工智能学院',
//     major: '计算机科学与技术',
//     QQnumber: '466658435',
//     serviceTime: 2,
//     servicePlace: '福建',
//     station: '舰员',
//     tags: ['developer'],
//   },
//   {
//     key: '3',
//     id: 3,
//     name: '熊金童',
//     gender: '男',
//     date: '2000-10',
//     nativePlace: '湖北省',
//     college: '计算机与人工智能学院',
//     major: '土木工程',
//     QQnumber: '466658435',
//     serviceTime: 2,
//     servicePlace: '福建',
//     station: '舰员',
//     tags: ['nice'],
//   },
//   {
//     key: '4',
//     id: 4,
//     name: '熊xx',
//     gender: '男',
//     date: '2000-10',
//     nativePlace: '湖北省',
//     college: '计算机与人工智能学院',
//     major: '电气工程',
//     QQnumber: '466658435',
//     serviceTime: 2,
//     servicePlace: '福建',
//     station: '舰员',
//     tags: ['nice', 'developer'],
//   },
//   {
//     key: '5',
//     id: 5,
//     name: '熊xx',
//     gender: '男',
//     date: '2000-10',
//     nativePlace: '湖北省',
//     college: '计算机与人工智能学院',
//     major: '电气工程',
//     QQnumber: '466658435',
//     serviceTime: 2,
//     servicePlace: '福建',
//     station: '舰员',
//     tags: ['nice', 'developer'],
//   },
//   {
//     key: '6',
//     id: 6,
//     name: '熊xx',
//     gender: '男',
//     date: '2000-10',
//     nativePlace: '湖北省',
//     college: '计算机与人工智能学院',
//     major: '电气工程',
//     QQnumber: '466658435',
//     serviceTime: 2,
//     servicePlace: '福建',
//     station: '舰员',
//     tags: ['nice', 'developer'],
//   },
//   {
//     key: '7',
//     id: 7,
//     name: '熊xx',
//     gender: '男',
//     date: '2000-10',
//     nativePlace: '湖北省',
//     college: '计算机与人工智能学院',
//     major: '电气工程',
//     QQnumber: '466658435',
//     serviceTime: 2,
//     servicePlace: '福建',
//     station: '舰员',
//     tags: ['nice', 'developer'],
//   },
//   {
//     key: '8',
//     id: 8,
//     name: '熊xx',
//     gender: '男',
//     date: '2000-10',
//     nativePlace: '湖北省',
//     college: '计算机与人工智能学院',
//     major: '电气工程',
//     QQnumber: '466658435',
//     serviceTime: 2,
//     servicePlace: '福建',
//     station: '舰员',
//     tags: ['nice', 'developer'],
//   },
//   {
//     key: '9',
//     name: '熊xx',
//     gender: '男',
//     date: '2000-10',
//     nativePlace: '湖北省',
//     college: '计算机与人工智能学院',
//     major: '电气工程',
//     QQnumber: '466658435',
//     serviceTime: 2,
//     servicePlace: '福建',
//     station: '舰员',
//     tags: ['nice', 'developer'],
//   },
// ]

function Back() {
  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext)
  const [selectedOption, setSelectedOption] = useState('profile')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [ifBigScreen, setIfBigScreen] = useState(true)

  let content = null

  const onClickItem = (item) => {
    setSelectedOption(item.key)
  }

  if (selectedOption === 'profile') {
    content = <Profile />
  } else if (selectedOption === 'pic') {
    content = <Pic />
  } else if (selectedOption === 'article') {
    content = <Art />
  } else if (selectedOption === 'mem_file') {
    if (admin_access === true) content = <Mem_file />
    else content = <Access_error />
  } else if (selectedOption === 'mem_pic') {
    if (admin_access === true) content = <Mem_pic />
    else content = <Access_error />
  } else if (selectedOption === 'mem_art') {
    if (admin_access === true) content = <Mem_art />
    else content = <Access_error />
  } else if (selectedOption === 'record') {
    if (admin_access === true) content = <Daily_record />
    else content = <Access_error />
  } else if (selectedOption === 'statistics') {
    if (admin_access === true) content = <Statistic_record />
    else content = <Access_error />
  } else if (selectedOption === 'invitecode') {
    if (admin_access === true) content = <Invitecode />
    else content = <Access_error />
  }

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    }
  }
  const items = [
    getItem('普通用户', 'sub1', <MailOutlined />, [
      getItem('个人资料', 'profile'),
      getItem('照片墙', 'pic'),
      getItem('文章', 'article'),
    ]),
    getItem('管理员', 'sub2', <AppstoreOutlined />, [
      getItem('成员信息', 'mem_file'),
      getItem('成员相册', 'mem_pic'),
      getItem('成员文章', 'mem_art'),
      getItem('操作日志', 'record'),
      getItem('访问流量', 'statistics'),
      getItem('邀请码', 'invitecode'),
    ]),
  ]

  // submenu keys of first level
  const rootSubmenuKeys = ['sub1', 'sub2', 'sub4']

  const [openKeys, setOpenKeys] = useState(['sub1'])
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1)
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys)
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  // const location = useLocation()
  useEffect(() => {
    const screenWidth = window.innerWidth
    if (screenWidth <= 900) {
      setIsMenuOpen(false)
      setIfBigScreen(false) // 如果屏幕宽度小于等于900px，自动关闭菜单
    } else {
      setIsMenuOpen(true)
      setIfBigScreen(true)
    }
    if (!currentUser) {
      navigate('/login')
    }
    const access_confirm = async () => {
      try {
        const res = await axios.get(`/back/adminconfirm/${currentUser.uuid}`)
        console.log(res.data)
        if (res.data !== false) {
          console.log('管理员' + res.data.name + '欢迎回来~')
          admin_access = true
        }
      } catch (err) {
        console.log(err)
      }
    }
    access_confirm()

    const handleResize = () => {
      if (screenWidth <= 900) {
        setIsMenuOpen(false)
        setIfBigScreen(false) // 如果屏幕宽度小于等于900px，自动关闭菜单
      } else {
        setIsMenuOpen(true)
        setIfBigScreen(true)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [currentUser])

  const [beadmin, setBeadmin] = useState(0)
  const admin_info = {
    id: currentUser.id,
    uuid: currentUser.uuid,
    username: currentUser.username,
    name: currentUser.name,
    date: new Date(),
  }
  const be_admin = () => {
    setBeadmin(beadmin + 1)
    console.log(beadmin)
    const up_to_admin = async () => {
      try {
        const res = await axios.post(
          `/back/beadmin`,
          JSON.stringify(admin_info),
          {
            headers: {
              'Content-Type': 'application/json', // 设置请求头为JSON格式
            },
          }
        )
        const recordinputs = {
          operation: 'Admin 管理员权限添加',
          resource_id: currentUser.id,
          region: '江苏 南京',
          user: currentUser.name,
          access: '普通用户',
          user_id: currentUser.id,
        }
        const res1 = await axios.post('/record', recordinputs) //日志
        console.log(res1.data)
      } catch (err) {
        console.log(err)
      }
    }
    if (beadmin === 10 && admin_access === false) {
      up_to_admin()
      console.log(11111111)
    }
  }

  return (
    <ConfigProvider
      //antd主题色修改为迷彩绿
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: '#749946',
          borderRadius: 2,
        },
      }}>
      <div className="backbox">
        <div className="header">
          <a href={`/`} className="logobox">
            <img src={micaiLogo} alt="" />
          </a>
          <div className="title">
            <span>迷彩协会后台系统</span>
          </div>
        </div>
        {ifBigScreen ? (
          <div className="backbodybox">
            <div className="navigation0">
              <div>
                <div className="title" onClick={be_admin}>
                  <span>系统菜单栏</span>
                </div>
                <Menu
                  mode="inline"
                  openKeys={openKeys}
                  onOpenChange={onOpenChange}
                  onClick={onClickItem}
                  style={{
                    width: 'auto',
                  }}
                  items={items}
                />
              </div>
            </div>
            <div
              className="backbody"
              style={{
                width: `calc(100vw - 220px)`,
              }}>
              <div className="backcontent">{content}</div>
            </div>
          </div>
        ) : (
          <div className="backbodybox">
            <div
              className={`navigation ${
                isMenuOpen ? 'menu-open' : 'menu-close'
              }`}>
              {isMenuOpen ? (
                <div>
                  <div className="title" onClick={be_admin}>
                    <span>导航栏</span>
                  </div>
                  <Menu
                    mode="inline"
                    openKeys={openKeys}
                    onOpenChange={onOpenChange}
                    onClick={onClickItem}
                    style={{
                      width: 'auto',
                    }}
                    items={items}
                  />
                  <div className="navigation_button0" onClick={toggleMenu}>
                    <LeftSquareOutlined />
                  </div>
                </div>
              ) : (
                <div className="navigation_button" onClick={toggleMenu}>
                  <RightSquareOutlined />
                </div>
              )}
            </div>
            <div
              className="backbody"
              style={{
                width: `calc(100vw - ${isMenuOpen ? '0px' : '0px'})`,
              }}>
              <div className="backcontent">{content}</div>
            </div>
          </div>
        )}
        <Space
          direction="vertical"
          style={{
            width: '100%',
          }}>
          <Alert
            message="Access Error"
            description="无访问权限，请联系管理员"
            type="error"
            showIcon
            closable
          />
        </Space>
      </div>
    </ConfigProvider>
  )
}

export default Back
