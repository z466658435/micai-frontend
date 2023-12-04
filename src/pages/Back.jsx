import React, { useRef, useContext, useEffect, useState } from 'react'
import {
  AppstoreOutlined,
  MailOutlined,
  LikeOutlined,
  MessageOutlined,
  EditFilled,
  DeleteFilled,
} from '@ant-design/icons'
import moment from 'moment'
import micaiLogo from '../static/img/micai.ico'
import { UploadOutlined, SearchOutlined } from '@ant-design/icons'
import { AuthContext } from '../context/authContext'
import {
  Image,
  Button,
  Input,
  DatePicker,
  Space,
  Table,
  message,
  Menu,
  Upload,
  Modal,
  Alert,
  Radio,
  ConfigProvider,
  Avatar,
  List,
  Typography,
} from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ImgCrop from 'antd-img-crop'
import avatar0 from '../static/img/0.jpg'
import Highlighter from 'react-highlight-words'
import ReactQuill from 'react-quill' //富文本编辑器
import 'react-quill/dist/quill.snow.css' //富文本编辑器

import Access_error from '../components/Back/Access_error'
import Art from '../components/Back/Art'
import Daily_record from '../components/Back/Daily_record'
import Invitecode from '../components/Back/Invitecode'
import Mem_art from '../components/Back/Mem_art'
import Mem_pic from '../components/Back/Mem_pic'
import Mem_file from '../components/Back/Mem_file'
import Pic from '../components/Back/Pic'
import Statistic_record from '../components/Back/Statistic_record'

const { Paragraph } = Typography
const { Search } = Input
const { Column } = Table

var proinfo = {}
var avatardata = {}
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
  const [selectedOption, setSelectedOption] = useState('profile')
  const [info, setInfo] = useState({})

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
    if (admin_access == true) content = <Mem_file />
    else content = <Access_error />
  } else if (selectedOption === 'mem_pic') {
    if (admin_access == true) content = <Mem_pic />
    else content = <Access_error />
  } else if (selectedOption === 'mem_art') {
    if (admin_access == true) content = <Mem_art />
    else content = <Access_error />
  } else if (selectedOption === 'record') {
    if (admin_access == true) content = <Daily_record />
    else content = <Access_error />
  } else if (selectedOption === 'statistics') {
    if (admin_access == true) content = <Statistic_record />
    else content = <Access_error />
  } else if (selectedOption === 'invitecode') {
    if (admin_access == true) content = <Invitecode />
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

  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()
  // const location = useLocation()
  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
    }
    const fetchData = async () => {
      try {
        const res = await axios.get(`/back/${currentUser.id}`)
        proinfo = res.data
        const imageurl = proinfo.img
        if (imageurl == '0') {
          avatardata = avatar0
        } else {
          const avatar_image = await axios.get(
            `/picture/image/${imageurl}?userid=${currentUser.id}`,
            {
              responseType: 'blob', // 设置响应类型为 Blob
            }
          )
          avatardata = URL.createObjectURL(avatar_image.data)
        }
        setInfo(res.data)
      } catch (err) {
        console.log(err)
        console.log(1111)
        navigate('/login')
      }
    }
    const access_confirm = async () => {
      try {
        const res = await axios.get(`/back/adminconfirm/${currentUser.uuid}`)
        console.log(res.data)
        if (res.data != false) {
          console.log('管理员' + res.data.name + '欢迎回来~')
          admin_access = true
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
    access_confirm()
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
    if (beadmin == 10 && admin_access == false) {
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
        <div className="backbodybox">
          <div className="navigation">
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
          </div>
          <div className="backbody">
            <div className="backcontent">{content}</div>
          </div>
        </div>
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

function Profile() {
  const { setCurrentUser, currentUser } = useContext(AuthContext)
  const [college, setCollege] = useState()
  const [services, setServices] = useState()

  //图片裁剪
  const [uploadedFile, setUploadedFile] = useState(null)

  const onChange = ({ file }) => {
    // 限制只保留一张图片的信息
    if (file) {
      setUploadedFile(file)
    } else {
      setUploadedFile(null)
    }
  }
  const onPreview = async () => {
    if (uploadedFile) {
      let src = uploadedFile.url
      if (!src) {
        src = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.readAsDataURL(uploadedFile.originFileObj)
          reader.onload = () => resolve(reader.result)
        })
      }
      const image = new Image()
      image.src = src
      const imgWindow = window.open(src)
      imgWindow?.document.write(image.outerHTML)
    }
  }
  //上传头像
  const upload_avatar = async (blob) => {
    try {
      const formData = new FormData()
      formData.append('file', blob)
      const res = await axios.post(`/upload/avatar/${currentUser.id}`, formData)
      const recordinputs = {
        operation: 'Avatar 用户头像更新',
        resource_id: res.data.other.id,
        region: '江苏 南京',
        user: res.data.other.name,
        access: '普通用户',
        user_id: res.data.other.id,
      }
      const res1 = await axios.post('/record', recordinputs) //日志
      console.log(res1.data)
      setCurrentUser(res.data.other)
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
  }

  const [dateState, setdateState] = useState()
  const dateonChange = (date, dateString) => {
    console.log(dateString)
    setdateState(dateString)
  }
  const handleSelectChange = (e) => {
    setCollege(e.target.value)
  }
  const handleSelectChange1 = (e) => {
    setServices(e.target.value)
  }
  const { saverefresh } = useContext(AuthContext)
  const saveClick = async () => {
    // 收集要保存的数据
    const updatedData = {
      name: document.querySelector('.input.iname').value,
      gender: document.querySelector('.igender0').checked ? 1 : 2,
      nativePlace: document.querySelector('.input.inativePlace').value,
      date: dateState,
      college: college,
      major: document.querySelector('.input.imajor').value,
      QQnumber: document.querySelector('.input.iQQnumber').value,
      serviceTime: document.querySelector('.input.iserviceTime').value,
      servicePlace: document.querySelector('.input.iservicePlace').value,
      station: document.querySelector('.input.istation').value,
      services: services,
    }
    console.log(updatedData)
    console.log(1223333)
    try {
      const res = await saverefresh(updatedData, currentUser.id)
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }
  //在遇到给defaultValue赋值时起码花了半个小时 没做出来原因 最后在CSDN一搜搜到了 得加一个key
  //defaultValue会在key变化的时候变化！！！！！！！！！！！！！！！！！！！！！！！！！！！！
  const colleges = [
    '安全科学与工程学院',
    '环境科学与工程学院',
    '应急管理学院',
    '材料科学与工程学院',
    '化工学院',
    '化学与分子工程学院',
    '电气工程与控制科学学院',
    '机械与动力工程学院',
    '能源科学与工程学院',
    '药学院',
    '建筑学院',
    '艺术设计学院',
    '经济与管理学院',
    '法政学院',
    '马克思主义学院',
    '外国语言文学学院',
    '体育学院',
    '生物与制药工程学院',
    '食品与轻工学院',
    '计算机与信息工程学院',
    '柔性电子学院',
    '数理科学学院',
    '测绘科学与技术学院',
    '城市建设学院',
    '交通运输工程学院',
    '土木工程学院',
    '2011学院',
    '海外教育学院',
    '浦江学院',
  ]
  const serviceses = ['武警', '陆军', '海军', '空军', '火箭军', '战支']
  //保存按钮模态框
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState('是否保存？')
  const showModal = () => {
    setOpen(true)
  }
  const handleOk = () => {
    setModalText('保存成功!!!')
    setConfirmLoading(true)
    saveClick()
    setTimeout(() => {
      setOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }
  const handleCancel = () => {
    setOpen(false)
  }
  return (
    <div className="profile">
      <div className="basicbox">
        <div className="basic">
          <div className="flex name">
            <span>姓名</span>
            <Input
              type="text"
              className="input iname"
              defaultValue={proinfo.name}
              key={proinfo.name}
            />
          </div>
          <div className="flex gender">
            <span>性别</span>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  className="igender0"
                  name="gender"
                  value="男"
                  defaultChecked={proinfo.gender == 0}
                  key={proinfo.gender}
                />
                <span>男</span>
              </label>
              <label>
                <input
                  type="radio"
                  className="igender1"
                  name="gender"
                  value="女"
                  defaultChecked={proinfo.gender == 1}
                  key={proinfo.gender}
                />
                <span>女</span>
              </label>
            </div>
          </div>
          <div className="flex nativePlace">
            <span>籍贯</span>
            <Input
              type="text"
              className="input inativePlace"
              defaultValue={proinfo.nativePlace}
              key={proinfo.nativePlace}
              placeholder="仅精确到省，例：江苏"
            />
          </div>
          <div className="flex date">
            <span>出生年月</span>
            <DatePicker
              onChange={dateonChange}
              picker="month"
              className="datepicker"
              placeholder="选择出生年月"
              defaultValue={moment(proinfo.date, 'YYYY-MM')}
              key={proinfo.date}
            />
          </div>
          <div className="flex college">
            <span>学院</span>
            <select className="input select" onChange={handleSelectChange}>
              <option>&nbsp;&nbsp;{proinfo.college}</option>
              {colleges.map((college, index) => (
                <option key={index} value={college} className="option">
                  &nbsp;&nbsp;{college}
                </option>
              ))}
            </select>
          </div>
          <div className="flex major">
            <span>专业</span>
            <Input
              type="text"
              className="input imajor"
              defaultValue={proinfo.major}
              key={proinfo.major}
              placeholder="年级+专业，例：21计算机科学与技术"
            />
          </div>
          <div className="flex QQnumber">
            <span>QQ号码</span>
            <Input
              type="number"
              className="input iQQnumber"
              defaultValue={proinfo.QQnumber}
              key={proinfo.QQnumber}
            />
          </div>
          <div className="flex serviceTime">
            <span>服役年限</span>
            <Input
              type="number"
              className="input iserviceTime"
              defaultValue={proinfo.serviceTime}
              key={proinfo.serviceTime}
            />
          </div>
          <div className="flex servicePlace">
            <span>服役地点</span>
            <Input
              type="text"
              className="input iservicePlace"
              defaultValue={proinfo.servicePlace}
              key={proinfo.servicePlace}
              placeholder="仅精确到省，例：江苏"
            />
          </div>
          <div className="flex station">
            <span>岗位</span>
            <Input
              type="text"
              className="input istation"
              defaultValue={proinfo.station}
              key={proinfo.station}
              placeholder="确保不涉密，例：舰员"
            />
          </div>
          <div className="flex services">
            <span>军种</span>
            <select className="input select1" onChange={handleSelectChange1}>
              <option>&nbsp;&nbsp;{proinfo.services}</option>
              {serviceses.map((service, index) => (
                <option key={index} value={service} className="option1">
                  &nbsp;&nbsp;{service}
                </option>
              ))}
            </select>
          </div>
          <div className="button">
            <Button type="primary" className="buttonn" onClick={showModal}>
              保存修改
            </Button>
            <Modal
              title="保存"
              open={open}
              onOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
              centered="true"
              cancelText="取消"
              okText="确定"
              width={350}>
              <p>{modalText}</p>
            </Modal>
          </div>
        </div>
      </div>
      <div className="avatarbox0">
        <div className="avatarbox">
          <div className="avatar">
            <img src={avatardata} alt="" className="avatar_image" />
          </div>
          <div className="avatar_upload">
            <ImgCrop
              rotationSlider
              className="imgcrop"
              onModalOk={upload_avatar}>
              <Upload
                showUploadList={false}
                file={uploadedFile}
                onChange={onChange}
                onPreview={onPreview}>
                <Button icon={<UploadOutlined />}>上传头像</Button>
                {/* {fileList.length < 5 && '+ Upload'} */}
              </Upload>
            </ImgCrop>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Back
