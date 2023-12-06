import React, { useContext, useEffect, useState } from 'react'
import carousel5 from '../static/img/carousel05.png'
import {
  SmileOutlined,
  BookOutlined,
  MessageOutlined,
  LikeOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { List, Image, Space, Avatar } from 'antd'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import avatar0 from '../static/img/0.jpg'
import articleimg from '../static/img/loading.gif'
import { AuthContext } from '../context/authContext'

const Single = () => {
  const { currentUser } = useContext(AuthContext)
  const [proinfo, setProinfo] = useState({})
  const [avatardata, setAvatardata] = useState({})
  const [photos, setPhotos] = useState([])
  const [aticlePhotos, setarticlePhotos] = useState([])
  const [articledata, setArticledata] = useState([])

  const params = useParams()

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/single_profile/${params.uuid}`)
        const dateObject = new Date(res.data.date)
        res.data.date = new Date().getFullYear() - dateObject.getFullYear()
        setProinfo(res.data)
        if (res.data.img == '0') {
          setAvatardata(avatar0)
        } else {
          const avatar_image = await axios.get(
            `/single_profile/avatar/${res.data.img}`,
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
    const get_photo = async () => {
      try {
        const res = await axios.get(`/back/photo/${params.uuid}`)
        console.log(res.data)
        const tempPhotos = []
        await Promise.all(
          res.data.map(async (item) => {
            const photo_image = await axios.get(
              `/single_profile/photo/${item.img}`,
              {
                responseType: 'blob', // 设置响应类型为 Blob
              }
            )
            const imageUrl = URL.createObjectURL(photo_image.data)
            tempPhotos.push({ imageUrl })
          })
        )
        setPhotos(tempPhotos)
      } catch (err) {
        console.log(err)
      }
    }

    //从back-art移植过来的代码///////////////////////////////////
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

    //拿取文章初始化数据
    const fetchdata1 = async () => {
      const res = await axios.get(`/back/article/${currentUser.uuid}`)
      console.log(res.data)
      if (res.data.length != 0) {
        const tempPhotos = []
        await Promise.all(
          res.data.map(async (item, index) => {
            if (item.img) {
              const photo_image = await axios.get(
                `/picture/article_photo/${item.img}?userid=${currentUser.id}`,
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
        setarticlePhotos(tempPhotos)
        console.log(tempPhotos)
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
              `/picture/image/${user_img}?userid=${user_id}`,
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
          readings: `${Math.floor(item.readings)}`,
        }))
        data.sort((a, b) => new Date(b.date) - new Date(a.date))
        console.log(data)
        setArticledata(data)
      } else {
        console.log(1111111)
        setArticledata([])
      }
    }
    fetchdata1()

    get_photo()
    fetchData()
  }, [])
  console.log(photos)

  return (
    <div className="containersingle">
      <div className="singlebox">
        <div className="head">
          <span className="head_title"> 个 人 简 介</span>
        </div>
        <div className="main">
          <div className="box1">
            <div className="icon">
              <BookOutlined />
            </div>
            <img className="avatar" src={avatardata} />
            <div className="box11">
              <h1>{proinfo.name}</h1>
              <h3>{proinfo.major}</h3>
              <hr className="hr"></hr>
            </div>
            <div className="box12">
              <div className="box121">
                <p>
                  性别：<span>{proinfo.gender == '1' ? '女' : '男'}</span>
                </p>
                <p>
                  籍贯：<span>{proinfo.nativePlace}</span>
                </p>
                <p>
                  年龄：<span>{proinfo.date}</span>
                </p>
                <p>
                  QQ号：<span>*******</span>
                </p>
              </div>
              <div className="box121">
                <p>
                  服役年限：<span>{proinfo.serviceTime} 年</span>
                </p>
                <p>
                  服役地点：<span>{proinfo.servicePlace}</span>
                </p>
                <p>
                  军种：<span>{proinfo.services}</span>
                </p>
                <p>
                  岗位：<span>{proinfo.station}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="box2">
            <div className="box2_title">
              <h2>Photo Wall</h2>
              <hr className="hr"></hr>
            </div>
            <div className="box22">
              <Image.PreviewGroup
                preview={{
                  onChange: (current, prev) =>
                    console.log(
                      `current index: ${current}, prev index: ${prev}`
                    ),
                }}>
                {photos.map((item, index) => (
                  <Image key={index} src={item.imageUrl} className="img" />
                ))}
              </Image.PreviewGroup>
            </div>
          </div>
        </div>
        <div className="main_article">
          <div className="article_title">
            <h2>Article Box</h2>
            <hr className="hr"></hr>
          </div>
          <div className="articleinit">
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
                  ]}
                  extra={
                    <img
                      width={272}
                      height={180}
                      alt="logo"
                      src={aticlePhotos[index].imageUrl}
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
        </div>
      </div>
    </div>
  )
}

export default Single
