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
import micaiLogo from '../../static/img/micai.ico'
import { UploadOutlined, SearchOutlined } from '@ant-design/icons'
import { AuthContext } from '../../context/authContext'
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
import avatar0 from '../../static/img/0.jpg'
import Highlighter from 'react-highlight-words'
import ReactQuill from 'react-quill' //富文本编辑器
import 'react-quill/dist/quill.snow.css' //富文本编辑器

const { Paragraph } = Typography
const { Search } = Input
const { Column } = Table

function Pic() {
  const { currentUser } = useContext(AuthContext)
  const [photos, setPhotos] = useState([])
  const [fileList, setFileList] = useState([])
  const [addphoto, setAddphoto] = useState(true)
  const [deleteimg, setDeleteimg] = useState()
  const [limitnum, setLimitnum] = useState(0)

  const photo_info = {
    id: currentUser.id,
    uuid: currentUser.uuid,
    username: currentUser.username,
    name: currentUser.name,
    date: new Date(),
  }

  const uploadFile = async (blob) => {
    try {
      const formData = new FormData()
      formData.append('file', blob)
      formData.append('photo_info', JSON.stringify(photo_info))
      const res = await axios.post(
        `/upload/back_photo/${currentUser.id}`,
        formData
      )
      const recordinputs = {
        operation: 'Photo 用户照片上传',
        resource_id: currentUser.id,
        region: '江苏 南京',
        user: currentUser.name,
        access: '普通用户',
        user_id: currentUser.id,
      }
      const res1 = await axios.post('/record', recordinputs) //日志
      setAddphoto(true)
    } catch (err) {
      console.log(err)
      console.log(123)
    }
  }

  const props = {
    name: 'file',
    // action: `/upload/avatar/${photo_info}`,
    headers: {
      authorization: 'authorization-text',
    },
    fileList: [...fileList],
    beforeUpload: (file) => {
      uploadFile(file)
      return false // 阻止 Upload 组件的默认上传行为
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onRemove(info) {
      // console.log(info)
      setDeleteimg(info.name)
      showModal()
    },
  }
  //删除按钮模态框
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState('是否删除？')
  const showModal = () => {
    setOpen(true)
  }
  const handleOk = () => {
    const delete_photo_back = async () => {
      try {
        const res = await axios.delete(
          `/back/photo/${currentUser.id}/${deleteimg}`
        )
        const recordinputs = {
          operation: 'Photo 用户照片删除',
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
    delete_photo_back()
    setAddphoto(true)
    setModalText('删除成功!!!')
    setConfirmLoading(true)
    setTimeout(() => {
      setOpen(false)
      setConfirmLoading(false)
    }, 1000)
  }
  const handleCancel = () => {
    setOpen(false)
  }

  useEffect(() => {
    const get_photo_back = async () => {
      try {
        const res = await axios.get(`/back/photo/${currentUser.uuid}`)
        // console.log(res.data)
        // console.log(123111213123)
        const tempPhotos = []
        const fileList0 = []
        await Promise.all(
          res.data.map(async (item, index) => {
            const photo_image = await axios.get(
              `/photo/${item.img}?userid=${currentUser.id}`,
              {
                responseType: 'blob', // 设置响应类型为 Blob
              }
            )
            const imageUrl = URL.createObjectURL(photo_image.data)
            tempPhotos.push({ imageUrl, name: item.img })
            fileList0.push({
              uid: '-' + index,
              name: item.img,
              status: 'done',
              url: imageUrl,
              thumbUrl: imageUrl,
            })
          })
        )
        tempPhotos.sort((a, b) => {
          const timestampA = parseInt(a.name.match(/\d+/)[0])
          const timestampB = parseInt(b.name.match(/\d+/)[0])
          return timestampB - timestampA
        })
        fileList0.sort((a, b) => {
          const timestampA = parseInt(a.name.match(/\d+/)[0])
          const timestampB = parseInt(b.name.match(/\d+/)[0])
          return timestampB - timestampA
        })
        setLimitnum(fileList0.length)
        setFileList(fileList0)
        setPhotos(tempPhotos)
        setAddphoto(false)
      } catch (err) {
        console.log(err)
        console.log(11111)
      }
    }
    if (addphoto) get_photo_back()
  }, [addphoto])
  return (
    <div className="backpicbox">
      <div className="uploadbox">
        {limitnum >= 8 ? (
          <div className="limitnum">
            <span>照片上传最多8张，请删除后继续上传</span>
          </div>
        ) : (
          <div></div>
        )}
        <Upload {...props} action="" listType="picture">
          {limitnum < 8 ? (
            <Button icon={<UploadOutlined />} className="uploadbtn">
              上传图片（ 严禁上传涉密图片，请先处理后再上传 ）
            </Button>
          ) : (
            <div></div>
          )}
        </Upload>
      </div>
      <div className="picbox0">
        <Image.PreviewGroup
          preview={{
            onChange: (current, prev) =>
              console.log(`current index: ${current}, prev index: ${prev}`),
          }}>
          {photos.map((photo, index) => (
            <div className="pic" key={index}>
              <Image src={photo.imageUrl} className="img" />
            </div>
          ))}
        </Image.PreviewGroup>
      </div>
      <Modal
        title="删除"
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
  )
}
export default Pic