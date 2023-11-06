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

function Article() {
  const { currentUser } = useContext(AuthContext)
  const [editid, setEditid] = useState(0)
  const [deleteid, setDeleteid] = useState()
  const [articledata, setArticledata] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [title, setTitle] = useState('')
  const [art_value, setArt_value] = useState('')
  const [showeditpage, setShoweditpage] = useState(false)
  const [modaltitle, setModaltitle] = useState()
  const [modaltype, setModaltype] = useState(1)
  const [error, setError] = useState(null)
  const [photos, setPhotos] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(articleimg) //编辑页面显示的图片
  const [uploadblob, setUploadblob] = useState(null) //上传的图片
  const [groupvalue, setGroupvalue] = useState(1)
  const [editblobname, setEditblobname] = useState()

  // groupradio选项
  const GrouponChange = (e) => {
    console.log('radio checked', e.target.value)
    setGroupvalue(e.target.value)
  }

  //编辑文章-标题值
  const editortitle = (e) => {
    // console.log(e.target.value)
    setTitle(e.target.value)
  }

  //点击进入发表/编辑页面
  const postarticle = () => {
    // console.log(111)
    setEditid(0)
    setShoweditpage(true)
  }

  //删除按钮模态框
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState('是否删除？')
  const showModal = () => {
    setOpen(true)
  }
  //进入对话框后的逻辑1
  const handleOk = () => {
    //删除文章
    const deletearticle = async () => {
      try {
        const res = await axios.delete(`/back/article/single/${deleteid}`)
        // console.log(res.data)
        setModalText('删除成功!!!')
        setConfirmLoading(true)
        const recordinputs = {
          operation: 'Articledelete 用户文章删除',
          resource_id: deleteid,
          region: '江苏 南京',
          user: currentUser.name,
          access: '普通用户',
          user_id: currentUser.id,
        }
        const res1 = await axios.post('/record', recordinputs) //日志
        setTimeout(() => {
          setOpen(false)
          setConfirmLoading(false)
          setError(null)
          setRefresh(true)
        }, 1000)
      } catch (err) {
        console.log(err)
      }
    }

    //发表文章
    const postarticle = async () => {
      //发表文章的数据
      const postdata = {
        user_uuid: currentUser.uuid,
        title: document.querySelector('.editortitle').value,
        content: art_value,
        img: '',
        category: groupvalue,
      }
      try {
        var article_id
        var type
        if (editid == 0) {
          //发表新文章
          const res = await axios.post(`/back/article/single`, postdata)
          article_id = res.data
          type = 0
        } else {
          //编辑旧文章
          const res = await axios.put(
            `/back/article/single/${editid}`,
            postdata
          )
          article_id = editid
          type = 1
        }
        //如果有上传的图片就上传到服务器
        if (uploadblob) {
          // console.log(uploadblob)// 例：Blob {name: '1697539369793.png', uid: '__AUTO__1697539381675_0__', size: 3277362, type: ''}
          // console.log(uploadblob.name)
          const formData = new FormData()
          formData.append('file', uploadblob)
          if (type == 0) {
            //发表
            const res1 = await axios.post(
              `/upload/article_photo/${article_id}/${currentUser.id}/${uploadblob.name}/${type}`,
              formData
            )
            console.log(res1.data)
          } else if (type == 1) {
            //编辑
            const res1 = await axios.post(
              `/upload/article_photo/${article_id}/${currentUser.id}/${editblobname}/${type}`,
              formData
            )
            console.log(res1.data)
          }
        }
        //文章发表成功
        setModalText('发表成功!!!')
        setConfirmLoading(true)
        const recordinputs = {
          operation: 'Articlepost 用户文章发表',
          resource_id: article_id,
          region: '江苏 南京',
          user: currentUser.name,
          access: '普通用户',
          user_id: currentUser.id,
        }
        //写入日志
        const res2 = await axios.post('/record', recordinputs)
        setTimeout(() => {
          setOpen(false)
          setConfirmLoading(false)
          setShoweditpage(false)
          setError(null)
        }, 1000)
        setRefresh(true)
      } catch (err) {
        setError('输入有误，标题、正文请勿为空')
      }
    }

    if (modaltype == 1) {
      //删除文章
      deletearticle()
    } else if (modaltype == 2) {
      //发表文章
      postarticle()
      setEditblobname(null)
      setTitle('')
      setArt_value('')
      setUploadedFile(articleimg)
      setUploadblob(null)
    }
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

  //点击发表按钮 弹出对话框
  const postconfirm = () => {
    // console.log(111)
    setModaltitle('发表')
    setModalText('是否发表？')
    setModaltype(2)
    showModal()
  }

  //点击删除按钮 弹出对话框
  const delete_article = (id) => {
    setDeleteid(id)
    setModaltitle('删除')
    setModalText('是否删除？')
    setModaltype(1)
    showModal()
  }

  //点击编辑按钮 进入编辑页面
  const edit_article = (id) => {
    setEditid(id)
    const initdata = async () => {
      const res = await axios.get(`/back/article/single/${id}`)
      if (res.data.img) {
        const photo_image = await axios.get(
          `/article_photo/${res.data.img}?userid=${currentUser.id}`,
          {
            responseType: 'blob', // 设置响应类型为 Blob
          }
        )
        const imageUrl = URL.createObjectURL(photo_image.data)
        setUploadedFile(imageUrl)
        const newBlob = new Blob([photo_image.data], { type: photo_image.type })
        newBlob.name = res.data.img
        setUploadblob(newBlob)
        setEditblobname(res.data.img)
        // console.log(555555555)
        // console.log(photo_image)
        // console.log(imageUrl)
        // console.log(photo_image.data)
        // console.log(newBlob)
        // console.log(555555555)
      } else {
        setUploadedFile(articleimg)
        setUploadblob(null)
      }
      console.log(res.data)
      setTitle(res.data.title)
      setArt_value(res.data.content)
    }
    initdata()
    setShoweditpage(true)
  }

  //文章列表初始化
  useEffect(() => {
    //日期格式化
    function formatDate(inputDate) {
      const date = new Date(inputDate) //格式化date
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')

      return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`
    }

    function cate(category) {
      switch (category) {
        case '1':
          return '协会动态'
        case '2':
          return '学习研习'
        case '3':
          return '工作相关'
        case '4':
          return '谈天说地'
      }
    }

    //拿取初始化数据
    const fetchdata = async () => {
      const res = await axios.get(`/back/article/${currentUser.uuid}`)
      console.log(res.data)
      if (res.data.length != 0) {
        const tempPhotos = []
        await Promise.all(
          res.data.map(async (item, index) => {
            if (item.img) {
              const photo_image = await axios.get(
                `/article_photo/${item.img}?userid=${currentUser.id}`,
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
          console.log(res.data)
          const user_img = res.data[0].user_img
          const user_id = res.data[0].user_id
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
          description: `${item.user_name} | ${item.user_major} | ${formatDate(
            item.post_date
          )} | ${cate(item.category)}`,
          content: `${item.content}`,
          likes: `${item.likes ? item.likes.length : '0'}`,
          comments_num: `${
            item.comments ? JSON.parse(item.comments).comments_num : '0'
          }`,
          readings: `${Math.floor(item.readings / 2)}`,
        }))
        data.sort((a, b) => new Date(b.date) - new Date(a.date))
        console.log(data)
        setArticledata(data)
      } else {
        console.log(1111111)
        setArticledata([])
      }
    }
    fetchdata()
    setEditblobname(null)
    setRefresh(false)
  }, [refresh])

  //upload组件 props
  const uploadcover = (file) => {
    // 限制只保留一张图片的信息
    if (file) {
      setUploadedFile(URL.createObjectURL(file))
      setUploadblob(file)
      console.log(file)
      //file 为 blob 例：File {uid: 'rc-upload-1695583564724-11', name: 'khl20220413202606593.png', lastModified: 1649852766755, lastModifiedDate: Wed Apr 13 2022 20:26:06 GMT+0800 (中国标准时间), webkitRelativePath: '', …}
    } else {
      setUploadedFile(articleimg)
      setUploadblob(null)
    }
  }
  const props = {
    showUploadList: false,
    beforeUpload: (file) => {
      uploadcover(file)
      return false
    },
    fileList: uploadblob ? [uploadblob] : [],
  }

  return (
    <div className="backarticlebox">
      {showeditpage ? (
        <div className="editbox">
          <div className="editorbox">
            <input
              type="text"
              placeholder="标题"
              className="editortitle"
              value={title}
              onChange={editortitle}
            />
            <ReactQuill
              theme="snow"
              value={art_value}
              onChange={setArt_value}
              className="editor"
            />
          </div>
          <div className="menu">
            <div className="articleimgbox">
              <div className="articleimg">
                <img src={uploadedFile} className="artimg" />
              </div>
              <Upload {...props}>
                <Button className="articleavatar">上传封面</Button>
              </Upload>
            </div>
            <div className="categories">
              <div className="group">
                <Radio.Group
                  onChange={GrouponChange}
                  value={groupvalue}
                  className="radiogroup"
                  defaultValue={1}>
                  <Space direction="vertical">
                    <Radio value={1}>协会动态</Radio>
                    <Radio value={2}>学习研习</Radio>
                    <Radio value={3}>工作相关</Radio>
                    <Radio value={4}>谈天说地</Radio>
                  </Space>
                </Radio.Group>
                <Button
                  className="articlepost"
                  onClick={() => {
                    postconfirm()
                  }}>
                  文章发表
                </Button>
                {error && <p className="errtext">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="articleinit">
            <Button
              className="articlebtn"
              onClick={() => {
                postarticle()
              }}>
              发布新文章
            </Button>
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
                    <div onClick={() => edit_article(item.id)}>
                      <EditFilled className="editbtn" />
                    </div>,
                    <div onClick={() => delete_article(item.id)}>
                      <DeleteFilled className="deletebtn" />
                    </div>,
                  ]}
                  extra={
                    <img
                      width={272}
                      height={180}
                      alt="logo"
                      src={photos[index].imageUrl}
                    />
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
        </>
      )}
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

export default Article
