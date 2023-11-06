import React, { useRef, useContext, useEffect, useState } from 'react'
import {
  AppstoreOutlined,
  MailOutlined,
  LikeOutlined,
  MessageOutlined,
  EditFilled,
  DeleteFilled,
  EyeOutlined,
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
import articleimg from '../../static/img/loading.gif'
import Highlighter from 'react-highlight-words'
import ReactQuill from 'react-quill' //富文本编辑器
import 'react-quill/dist/quill.snow.css' //富文本编辑器

const { Paragraph } = Typography
const { Search } = Input
const { Column } = Table

function Mem_art() {
  const { currentUser } = useContext(AuthContext)
  const [deleteid, setDeleteid] = useState()
  const [articledata, setArticledata] = useState([])
  const [modaltitle, setModaltitle] = useState()
  const [photos, setPhotos] = useState(null)
  const [memdata, setMemdata] = useState(true)
  const [refresh, setRefresh] = useState(false)
  const [search_value, setSearch_value] = useState(0)

  //删除按钮模态框
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState('是否删除？')
  const showModal = () => {
    setOpen(true)
  }
  const handleOk = () => {
    const deletearticle = async () => {
      try {
        const res = await axios.delete(`/back/article/single/${deleteid}`)
        console.log(res.data)
        console.log(111111)
        setModalText('删除成功!!!')
        setConfirmLoading(true)
        // const recordinputs = {
        //   operation: 'Articledelete 用户文章删除',
        //   resource_id: ,
        //   region: '江苏 南京',
        //   user: currentUser.name,
        //   access: '普通用户',
        //   user_id: currentUser.id,
        // }
        // const res1 = await axios.post('/record', recordinputs) //日志
        setTimeout(() => {
          setOpen(false)
          setConfirmLoading(false)
          setRefresh(true)
        }, 1000)
      } catch (err) {
        console.log(err)
      }
    }
    deletearticle()
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  )

  const delete_article = (id) => {
    //点击删除按钮 弹出对话框
    setDeleteid(id)
    setModaltitle('删除')
    setModalText('是否删除？')
    showModal()
  }

  useEffect(()=>{
    onSearch(search_value)
    setRefresh(false)
  },[refresh])
  
  const onSearch = async (value) => {
    setSearch_value(value)
    try {
      function formatDate(inputDate) {
        //格式化date
        const date = new Date(inputDate)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`
      }
      const res_singlemem = await axios.get(`/back/singlemem/${value}`)
      const user_uuid = res_singlemem.data.uuid
      console.log(res_singlemem.data)
      const fetchdata = async () => {
        const res = await axios.get(`/back/article/${user_uuid}`)
        if (res.data.length != 0) {
          const tempPhotos = []
          await Promise.all(
            res.data.map(async (item, index) => {
              if (item.img) {
                const photo_image = await axios.get(
                  `/article_photo/${item.img}?userid=${value}`,
                  {
                    responseType: 'blob', // 设置响应类型为 Blob
                  }
                )
                const imageUrl = URL.createObjectURL(photo_image.data)
                tempPhotos.push({ imageUrl, date: item.post_date })
              } else {
                tempPhotos.push({ imageUrl: articleimg, date: item.post_date })
              }
            })
          )
          // 降序排序
          tempPhotos.sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return dateB - dateA
          })
          setPhotos(tempPhotos)
          //头像
          var avatar
          await (async () => {
            const user_img = res.data[0].user_img
            const user_id = res.data[0].user_id
            console.log(user_img)
            console.log(user_id)
            if (user_img == '0') {
              avatar = avatar0
            } else {
              const avatar_image = await axios.get(
                `/image/${user_img}?userid=${user_id}`,
                {
                  responseType: 'blob', // 设置响应类型为 Blob
                }
              )
              avatar = URL.createObjectURL(avatar_image.data)
            }
          })()
          //重组数据
          const data = res.data.map((item) => ({
            id: `${item.id}`,
            date: `${item.post_date}`,
            title: `${item.title}`,
            avatar: avatar,
            description: `${item.user_name} ${item.user_major} ${formatDate(
              item.post_date
            )}`,
            content: `${item.content}`,
            likes: `${item.likes ? item.likes.length : '0'}`,
            comments_num: `${
              item.comments ? JSON.parse(item.comments).comments_num : '0'
            }`,
            readings: `${Math.floor(item.readings / 2)}`,
          }))
          data.sort((a, b) => new Date(b.date) - new Date(a.date))
          setArticledata(data)
          console.log(data)
        }else {
          console.log(1111111)
          setArticledata([])
        }
      }

      if (res_singlemem.data) {
        setMemdata(true)
        fetchdata()
      } else {
        setMemdata(false)
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="backarticlebox">
      <div className="articleinit">
        <div className="searchbox">
          <Search
            placeholder={`搜索ID，从"成员信息"拿取`}
            onSearch={onSearch}
            enterButton
            className="search"
          />
          {memdata ? '' : <span className="none">未查找到该成员的文章</span>}
        </div>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={articledata}
          renderItem={(item, index) => (
            <List.Item
              key={item.title}
              actions={[
                <IconText
                  icon={EyeOutlined}
                  text={item.readings}
                  key="list-vertical-like-o"
                />,
                <IconText
                  icon={LikeOutlined}
                  text={item.likes}
                  key="list-vertical-like-o"
                />,
                <IconText
                  icon={MessageOutlined}
                  text={item.comments_num}
                  key="list-vertical-message"
                />,
                <div onClick={() => delete_article(item.id)}>
                  <DeleteFilled className="deletebtn" />
                </div>,
              ]}
              extra={
                <img width={272} alt="logo" src={photos[index].imageUrl} />
              }>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<a href={item.href}>{item.title}</a>}
                description={item.description}
              />
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </List.Item>
          )}
        />
      </div>
      <Modal
        title={modaltitle}
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

export default Mem_art
