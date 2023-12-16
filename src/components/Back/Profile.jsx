import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { UploadOutlined } from '@ant-design/icons'
import { AuthContext } from '../../context/authContext'
import { Image, Button, Input, DatePicker, Upload, Modal, Radio } from 'antd'
import axios from 'axios'
import ImgCrop from 'antd-img-crop'
import avatar0 from '../../static/img/0.jpg'

function Profile() {
  const { setCurrentUser, currentUser } = useContext(AuthContext)
  const [college, setCollege] = useState()
  const [services, setServices] = useState()
  const [proinfo, setProinfo] = useState({})
  const [avatardata, setAvatardata] = useState()
  const [radioValue, setRadioValue] = useState()

  //图片裁剪
  const [uploadedFile, setUploadedFile] = useState(null)

  //性别radio
  const radioOnChange = (e) => {
    setRadioValue(e.target.value)
  }

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
      gender: radioValue,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/back/${currentUser.id}`)
        setProinfo(res.data)
        setRadioValue(res.data.gender)
        console.log(res.data)
        const imageurl = res.data.img
        if (imageurl === '0') {
          setAvatardata(avatar0)
        } else {
          const avatar_image = await axios.get(
            `/picture/image/${imageurl}?userid=${currentUser.id}`,
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
    fetchData()
  }, [currentUser])


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
              <Radio.Group
                className="igender"
                onChange={radioOnChange}
                value={radioValue}>
                <Radio value={'0'}>男</Radio>
                <Radio value={'1'}>女</Radio>
              </Radio.Group>
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
export default Profile
