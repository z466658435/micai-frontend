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

function Mem_file() {
  const { currentUser } = useContext(AuthContext)
  const [members, setMembers] = useState()
  const [totalnum, setTotalnum] = useState()
  const [deleteid, setDeleteid] = useState()
  const onSearch = async (value) => {
    try {
      if (!value) value = null
      const res = await axios.get(`/back/mem/${value}`)
      const modifiedMembers = res.data.map((item, index) => ({
        ...item,
        key: `${index}`, // 使用索引创建唯一的key
      }))
      setMembers(modifiedMembers)
      setTotalnum(res.data.length)
      // console.log(22222)
      // console.log(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const delete_mem_modal = (id) => {
    console.log(id)
    setDeleteid(id)
    showModal()
  }

  //删除按钮模态框
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState('是否删除？')
  const showModal = () => {
    setOpen(true)
  }
  const handleOk = () => {
    const delete_mem = async () => {
      try {
        const res = await axios.delete(`/back/mem/${deleteid}`)
        const recordinputs = {
          operation: 'User 管理员-用户账号删除',
          resource_id: deleteid,
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
    delete_mem()
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
    const init_mem = async () => {
      try {
        const res = await axios.get(`/back/mem/${null}`)
        const modifiedMembers = res.data.map((item, index) => ({
          ...item,
          key: `${index}`, // 使用索引创建唯一的key
        }))
        setMembers(modifiedMembers)
        // console.log(11111)
        // console.log(res.data)
        setTotalnum(res.data.length)
      } catch (err) {
        console.log(err)
      }
    }
    init_mem()
  }, [confirmLoading])
  return (
    <div className="memfilebox">
      <div className="searchbox">
        <span className="num">总共查找到{totalnum}人</span>
        <Search
          placeholder="搜索姓名，为空则搜索全部"
          onSearch={onSearch}
          enterButton
          className="search"
        />
      </div>
      <div className="memfile">
        <Table dataSource={members} pagination={false}>
          <Column title="ID" dataIndex="id" key="id" />
          <Column title="姓名" dataIndex="name" key="name" />
          <Column title="性别" dataIndex="gender" key="gender" />
          <Column title="出生日期" dataIndex="date" key="date" />
          <Column title="籍贯" dataIndex="nativePlace" key="nativePlace" />
          <Column title="学院" dataIndex="college" key="college" />
          <Column title="专业" dataIndex="major" key="major" />
          <Column title="QQ号码" dataIndex="QQnumber" key="QQnumber" />
          <Column title="年限" dataIndex="serviceTime" key="serviceTime" />
          <Column
            title="服役地点"
            dataIndex="servicePlace"
            key="servicePlace"
          />
          <Column title="服役岗位" dataIndex="station" key="station" />
          <Column
            title="操作"
            key="delete"
            render={(_, record) => (
              <Space size="middle">
                <Button onClick={() => delete_mem_modal(record.id)}>
                  删除
                </Button>
              </Space>
            )}
          />
        </Table>
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
  )
}

export default Mem_file