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

function Mem_pic() {
  const { currentUser } = useContext(AuthContext)
  const [photos, setPhotos] = useState([])
  const [fileList, setFileList] = useState([])
  const [refreshphoto, setRefreshphoto] = useState(false)
  const [deleteimg, setDeleteimg] = useState()
  const [memid, setMemid] = useState()
  const [memname, setMemname] = useState()
  const [searchnum, setSearchnum] = useState(false)

  const props = {
    name: 'file',
    // action: `/upload/avatar/${photo_info}`,
    headers: {
      authorization: 'authorization-text',
    },
    fileList: [...fileList],
    onRemove(info) {
      console.log(info)
      console.log(123123)
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
        const res = await axios.delete(`/back/photo/${memid}/${deleteimg}`)
        const recordinputs = {
          operation: 'Photo 管理员-用户照片删除',
          resource_id: memid,
          region: '江苏 南京',
          user: currentUser.name,
          access: '管理员',
          user_id: currentUser.id,
        }
        const res1 = await axios.post('/record', recordinputs) //日志
        console.log(res1.data)
      } catch (err) {
        console.log(err)
      }
    }
    delete_photo_back()
    setRefreshphoto(true)
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

  const onSearch = async (value) => {
    try {
      setMemid(value)
      const res_singlemem = await axios.get(`/back/singlemem/${value}`)
      const mem_uuid = res_singlemem.data.uuid
      setMemname(res_singlemem.data.name)
      if (mem_uuid) setSearchnum(true)
      else setSearchnum(false)
      const res = await axios.get(`/back/photo/${mem_uuid}`)
      const tempPhotos = []
      const fileList0 = []
      await Promise.all(
        res.data.map(async (item, index) => {
          const photo_image = await axios.get(
            `/photo/${item.img}?userid=${value}`,
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
      setFileList(fileList0)
      setPhotos(tempPhotos)
      setRefreshphoto(false)
    } catch (err) {
      console.log(err)
      console.log(111)
    }
  }

  useEffect(() => {
    if (refreshphoto) {
      onSearch(memid)
    }
  }, [refreshphoto])

  return (
    <div className="backpicbox">
      <div className="searchbox">
        {searchnum ? (
          <span className="num">查找到 {memname} 的相册</span>
        ) : (
          <span className="num">未查找到此人</span>
        )}
        <Search
          placeholder="搜索ID，从“成员信息”拿取"
          onSearch={onSearch}
          enterButton
          className="search"
        />
      </div>
      <div className="uploadbox">
        <Upload {...props} action="" listType="picture"></Upload>
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

export default Mem_pic
