import {
  LikeOutlined,
  MessageOutlined,
  EyeOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  Select,
  Avatar,
  List,
  Space,
  Pagination,
  Input,
  notification,
  Button,
  Modal,
  ConfigProvider,
} from 'antd'
import avatar0 from '../static/img/0.jpg'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

const { Search } = Input
const { TextArea } = Input

const Article = () => {
  const { currentUser } = useContext(AuthContext)
  const [api, contextHolder] = notification.useNotification() //antd气泡弹窗

  const [tops, setTops] = useState([])
  const [otherart, setOtherart] = useState([])
  const [singleart, setSingleart] = useState(null)
  const [avatar, setAvatar] = useState()
  const [articleimg, setArticleimg] = useState()
  const [iflike, setIflike] = useState(false)
  const [likesnum, setLikesnum] = useState(0)
  const [commentsnum, setCommentsnum] = useState(0)
  const [reply0, setReply0] = useState(-1) //楼主评论框开关 -1为关 正数则为打开的输入框[index]
  const [reply11, setReply11] = useState(-1) //楼主子评论框的子评论索引
  const [reply10, setReply10] = useState(-1) //楼主子评论框的楼主索引
  const [input0, setInput0] = useState('') //评论输入框值
  const [input1, setInput1] = useState('') //楼主评论输入框值及子评论输入框值（只同时存在一个值 因为归根都为子评论）
  const [comment_data, setComment_data] = useState() //楼主评论数据
  const [comment_child_data, setComment_child_data] = useState() //楼主子评论数据
  const [refresh, setRefresh] = useState(false)
  const [delete_qualification, setDelete_qualification] = useState(false)
  const [open, setOpen] = useState(false) //删评对话框
  const [open1, setOpen1] = useState(false) //删子评对话框
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState('您确认是否删除该评论？')
  const [modalText1, setModalText1] = useState('您确认是否删除该子评论？')
  const [index0_id, setIndex0_id] = useState(0) //删除 选中评论ID值
  const [index1_id, setIndex1_id] = useState(0) //删除 选中子评论ID值
  const [commentAvatar, setCommentAvatar] = useState(avatar0) //评论头像

  const articleContentRef = useRef(null) //floatblock的DOM
  const commentsRef = useRef(null) //评论Box
  // const data11 = [
  //   {
  //     id: 1,
  //     name: '熊金童',
  //     major: '21计算机科学与技术',
  //     date: '2000-10-11 18:56',
  //     title:
  //       '个威尔士光和热给对方半导体和认同和让风格让更多人韩国人特大热的观点如火如荼或过热的观点发红包飞特高压和土壤法半导体个威尔士光和热给对方半导体和认同和让风格让更多人韩国人特大热的观点如火如荼或过热的观点发红包飞特高压和土壤法半导体个威尔士光和热给对方半导体和认同和让风格让更多人韩国人特大热的观点如火如荼或过热的观点发红包飞特高压和土壤法半导体',
  //     child: [
  //       {
  //         id: 1,
  //         name: 'aaa',
  //         major: '21计算机科学与技术',
  //         date: '2000-10-11 18:56',
  //         title:
  //           '个威尔士光和热给对方半导体和认同和让风格让更多人韩国人特大热的观点如火如荼或过热的观点发红包飞特高',
  //       },
  //       {
  //         id: 2,
  //         name: 'aac',
  //         major: '21计算机科学与技术',
  //         date: '2000-10-11 18:56',
  //         title: '个威尔士光和热给对方半导体和认同和让',
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: '熊金童',
  //     major: '21计算机科学与技术',
  //     date: '2000-10-11 18:56',
  //     title: 'Ant Design Title 2',
  //     child: [
  //       {
  //         id: 1,
  //         name: 'aaa',
  //         major: '21计算机科学与技术',
  //         date: '2000-10-11 18:56',
  //         title:
  //           '个威尔士光和热给对方半导体和认同和让风格让更多人韩国人特大热的观点如火如荼或过热的观点发红包飞特高',
  //       },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     name: '熊金童',
  //     major: '21计算机科学与技术',
  //     date: '2000-10-11 18:56',
  //     title: '333333333333333',
  //   },
  //   {
  //     id: 4,
  //     name: '熊金童',
  //     major: '21计算机科学与技术',
  //     date: '2000-10-11 18:56',
  //     title: 'Ant Design Title 4',
  //     child: [
  //       {
  //         id: 1,
  //         name: 'aaa',
  //         major: '21计算机科学与技术',
  //         date: '2000-10-11 18:56',
  //         title:
  //           '个威尔士光和热给对方半导体和认同和让风格让更多人韩国人特大热的观点如火如荼或过热的观点发红包飞特高',
  //       },
  //       {
  //         id: 2,
  //         name: 'aac',
  //         major: '21计算机科学与技术',
  //         date: '2000-10-11 18:56',
  //         title: '个威尔士光和热给对方半导体和认同和让',
  //       },
  //       {
  //         id: 3,
  //         name: 'aac',
  //         major: '21计算机科学与技术',
  //         date: '2000-10-11 18:56',
  //         title: '个威尔士光和热给对方半导体和认同和让',
  //       },
  //     ],
  //   },
  // ]

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  )

  //date日期格式化
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

  //radio类别函数
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

  /////////////////////////////////////////////////////////////////////////////////
  //页面拿到文章数据
  const currentUrl = window.location.href
  const parts = currentUrl.split('/')
  const article_user_uuid = parts[parts.length - 2]
  const article_id = parts[parts.length - 1]
  useEffect(() => {
    const fetchdata = async () => {
      const type = 0
      const res = await axios.get(`/init_data/art/${0}/${type}`)
      console.log(res.data)

      //TOP5文章数据
      const artdata = res.data.map((item) => ({
        id: `${item.id}`,
        user_uuid: `${item.user_uuid}`,
        title: `${item.title}`,
        topdescription: `${item.user_name}`,
        category: `${cate(item.category)}`,
        readings: `${Math.floor(item.readings)}`,
        post_date: `${formatDate(item.post_date)} `,
        author: item.user_uuid,
      }))
      setTops(artdata.sort((a, b) => b.readings - a.readings).slice(0, 10))
      setOtherart(
        artdata
          .filter((item) => item.author == article_user_uuid)
          .sort((a, b) => b.readings - a.readings)
          .slice(0, 5)
      )

      //单个文章数据
      const single_article_data = res.data.find((item) => item.id == article_id)
      console.log(single_article_data)
      console.log(res.data)
      console.log(article_id)
      single_article_data.category = cate(single_article_data.category)
      single_article_data.post_date = formatDate(single_article_data.post_date)
      const likesdata = single_article_data.likes
      const likesnum = likesdata ? JSON.parse(likesdata).length : 0
      setLikesnum(likesnum)
      //likes属性中有currentUser.id值 则该登录用户点赞过 图标状态体现
      if (Array.isArray(likesdata) && likesdata.includes(currentUser.id))
        setIflike(true)
      setSingleart(single_article_data)
      // console.log(JSON.parse(single_article_data.comments).comments_num)
      //拿取头像和封面 两张图
      const article_img = single_article_data.img
      const user_img = single_article_data.user_img
      const user_id = single_article_data.user_id
      // console.log(article_img)
      // console.log(user_img)
      // console.log(user_id)

      //1、文章作者头像
      if (user_img == '0') {
        setAvatar(avatar0)
      } else {
        const avatar_image = await axios.get(
          `/picture/image/${user_img}?userid=${user_id}`,
          {
            responseType: 'blob', // 设置响应类型为 Blob
          }
        )
        setAvatar(URL.createObjectURL(avatar_image.data))
      }

      //2、文章封面图
      if (article_img) {
        const photo_image = await axios.get(
          `/picture/article_photo/${article_img}?userid=${user_id}`,
          {
            responseType: 'blob', // 设置响应类型为 Blob
          }
        )
        const imageUrl = URL.createObjectURL(photo_image.data)
        setArticleimg(imageUrl)
      } else {
        setArticleimg(null)
      }

      //评论输入框头像
      if (currentUser) {
        try {
          const imageurl = currentUser.img
          const userid = currentUser.id
          if (imageurl == '0') {
            setCommentAvatar(avatar0)
          } else {
            // console.log(22222)
            // console.log(userid)
            const avatar_image = await axios.get(
              `/picture/image/${imageurl}?userid=${userid}`,
              {
                responseType: 'blob', // 设置响应类型为 Blob
              }
            )
            setCommentAvatar(URL.createObjectURL(avatar_image.data))
          }
        } catch (err) {
          console.log(err)
        }
      }
    }

    //页面拿到数据的同时阅读量+1
    const readingsADD = async () => {
      try {
        const res = await axios.get(`/single_article/readingsADD/${article_id}`)
        // console.log(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    //获取删评权限
    const if_delete_qualification = async () => {
      setDelete_qualification(false)
      if (currentUser) {
        if (currentUser.uuid == article_user_uuid) {
          //登录人与文章作者是同一人 则有删评权限
          setDelete_qualification(true)
        } else {
          //登录人是管理员之一 则有删评权限
          try {
            const res = await axios.get(
              `/back/adminconfirm/${currentUser.uuid}`
            )
            // console.log(res.data)
            if (res.data != false) {
              console.log('管理员' + res.data.name + '欢迎回来~')
              setDelete_qualification(true)
            }
          } catch (err) {
            console.log(err)
          }
        }
      }
    }

    fetchdata() //拿取文章数据
    readingsADD() //阅读量+1
    if_delete_qualification() //查看是否具有删评权限

    //floatblock初始化宽度
    const onArticleContentLoad = () => {
      const articlecontent = articleContentRef.current
      const floatblock = document.querySelector('.floatblock')
      if (articlecontent) {
        console.log(articlecontent)
        if (window.innerWidth < 1230) {
          console.log(1)
          floatblock.style.position = 'absolute'
        } else {
          console.log(2)
          const articleWidth = articlecontent.offsetWidth
          floatblock.style.width = articleWidth + 'px'
          floatblock.style.position = 'fixed'
        }
      }
    }
    const tryToOperateOnDOM = () => {
      const articleContent = articleContentRef.current
      if (articleContent) {
        onArticleContentLoad() // 如果已经加载完成，立即执行
      } else {
        // articleContentRef.current 尚未准备好，等待下一个渲染周期再尝试
        setTimeout(tryToOperateOnDOM, 100) // 延迟 100 毫秒后再尝试
      }
    }

    //页面有x轴时初始化居中
    const scrollContainer = document.querySelector('.container')
    if (scrollContainer) {
      const initialScrollLeft =
        (scrollContainer.scrollWidth - scrollContainer.clientWidth) / 2
      scrollContainer.scrollLeft = initialScrollLeft
    }
    tryToOperateOnDOM()
  }, [])

  /////////////////////////////////////////////////////////////////////////////////
  //页面拿到评论数据
  function customSort(a, b) {
    //评论排序
    // 如果 a 的 reply_to_id 为 -1，排在前面
    if (a.reply_to_id === -1 && b.reply_to_id !== -1) return -1
    if (a.reply_to_id !== -1 && b.reply_to_id === -1) return 1

    // 如果 a 的 reply_to_id 等于 b 的 id，那么 a 应该排在 b 后面
    if (a.reply_to_id === b.id) return 1
    if (b.reply_to_id === a.id) return -1

    return 0 // 如果所有条件相等，返回 0，表示相等
  }
  useEffect(() => {
    const fetchcomments = async () => {
      try {
        const res = await axios.get(
          `/single_article/get_comments/${article_id}`
        )
        console.log(res.data)
        //评论人头像  await Promise.all不能只是await async函数返回的是promise对象 需要用Promise.all解析
        const data = await Promise.all(
          res.data.map(async (item) => {
            if (item.user_img == '0') {
              item.user_img = avatar0
            } else {
              const avatar_image = await axios.get(
                `/picture/image/${item.user_img}?userid=${item.user_id}`,
                {
                  responseType: 'blob', // 设置响应类型为 Blob
                }
              )
              // console.log(avatar_image.data)
              item.user_img = URL.createObjectURL(avatar_image.data)
            }
            return item
          })
        )
        // console.log(data)
        setCommentsnum(data.length)
        const dataa = data.sort(
          (a, b) => new Date(a.comment_date) - new Date(b.comment_date)
        )
        // console.log(data)
        // console.log(dataa)
        const data0 = dataa.filter((item) => item.father_comment_id == -1)
        const data1 = dataa.filter((item) => item.father_comment_id != -1)
        // console.log(data1)
        const data01 = data0.sort((a, b) => customSort(a, b))
        const data11 = data1.sort((a, b) => customSort(a, b))
        // console.log(data01)
        data01
          .sort((a, b) => new Date(b.comment_date) - new Date(a.comment_date))
          .map((item) => (item.comment_date = formatDate(item.comment_date))) //楼主评论日期新的排上面 子评论日期旧的排上面
        data11.map((item) => {
          item.comment_date = formatDate(item.comment_date)
          if (item.reply_to_id != -1) {
            const reply_to_obj = data11.find(
              (item1) => item1.id == item.reply_to_id
            )
            if (reply_to_obj) item.reply_to_name = reply_to_obj.user_name
          } else {
            item.reply_to_name = '-1'
          }
        })
        // console.log(data01)
        // console.log(data11)
        setComment_data(data01)
        setComment_child_data(data11)
      } catch (err) {
        console.log(err)
      }
    }
    fetchcomments()
    setRefresh(false)
  }, [refresh])

  /////////////////////////////////////////////////////////////////////////////////
  //floatblock fixed的宽度 底部框
  useEffect(() => {
    // 在这里处理滚动事件
    function handleScroll() {
      const articlecontent = document.querySelector('.single_article')
      const floatblock = document.querySelector('.floatblock')
      if (articlecontent) {
        const articleWidth = articlecontent.offsetWidth
        const articleTop =
          articlecontent.offsetTop + articlecontent.clientHeight
        floatblock.style.width = articleWidth + 'px'
        const float_maxtop = window.scrollY + window.innerHeight
        if (float_maxtop < articleTop && window.innerWidth > 1230) {
          floatblock.style.position = 'fixed'
        } else {
          floatblock.style.position = 'absolute'
        }
      }
    }
    // 后续取消这种做法 固定了评论div的高度 内部使用y-scroll
    // function handleScroll1() {
    //   // 在这里处理一次性评论div增高事件 为的是点击回复后弹出来的框 不会使得整个屏幕高度发生变化
    //   const commentsbox_height = document.querySelector('.commentsbox')
    //   if (commentsbox_height) {
    //     commentsbox_height.style.height =
    //       commentsbox_height.offsetHeight + 50 + 'px'
    //     console.log(commentsbox_height.offsetHeight)
    //     window.removeEventListener('scroll', handleScroll1)
    //   }
    // }
    window.addEventListener('scroll', handleScroll)
    // window.addEventListener('scroll', handleScroll1)
    return () => {
      // 在组件卸载时清除事件监听器
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  /////////////////////////////////////////////////////////////////////////////////
  //antd 点赞功能气泡弹窗
  const likesADD = async (placement) => {
    if (currentUser) {
      if (iflike) {
        const res = await axios.delete(
          `/single_article/likesDELETE/${article_id}/${currentUser.id}`
        )
        const recordinputs = {
          operation: 'SingleArt 取消点赞',
          resource_id: article_id,
          region: '江苏 南京',
          user: currentUser.username,
          access: '普通用户',
          user_id: currentUser.id,
        }
        const res1 = await axios.post('/record', recordinputs) //日志
        console.log(res.data)
        setIflike(false)
        setLikesnum(likesnum - 1)
        api.info({
          message: `${currentUser.name}`,
          description: `您已取消对该文章的点赞`,
          placement,
          icon: (
            <CloseCircleOutlined
              style={{
                color: 'rgb(66, 66, 66)',
              }}
            />
          ),
        })
        return
      }
      const res1 = await axios.put(
        `/single_article/likesADD/${article_id}/${currentUser.id}`
      )
      console.log(res1.data)
      setIflike(true)
      setLikesnum(likesnum + 1)
      const recordinputs = {
        operation: 'SingleArt 给文章点赞',
        resource_id: article_id,
        region: '江苏 南京',
        user: currentUser.username,
        access: '普通用户',
        user_id: currentUser.id,
      }
      const res2 = await axios.post('/record', recordinputs) //日志
      api.info({
        message: `${currentUser.name}`,
        description: `您刚刚给该文章点赞了`,
        placement,
        icon: (
          <LikeOutlined
            style={{
              color: '#73a537',
            }}
          />
        ),
      })
    } else {
      api.info({
        message: `无点赞权限`,
        description: `请登录再操作`,
        placement,
        icon: (
          <ExclamationCircleOutlined
            style={{
              color: 'red',
            }}
          />
        ),
      })
    }
  }
  /////////////////////////////////////////////////////////////////////////////////
  //以下为输入框逻辑 reply0为楼主评论 reply10和11为楼主子评论 其中10为楼主索引 11为子评论索引
  //输入框同一时间只存在一个
  const comment_reply = (index0) => {
    if (reply11 != -1 && reply10 != -1) {
      //楼主子输入框打开 则先关闭子输入框
      setReply10(-1)
      setReply11(-1)
      setInput0('')
      setInput1('')
    }
    if (reply0 == index0) {
      setReply0(-1) //为真即该index0索引的输入框在点击前已经打开 需要在此时关闭
      setInput0('')
      setInput1('')
    } else {
      setReply0(index0)
      setInput0('')
      setInput1('')
    }
  }
  const comment_child_reply = (index0, index1) => {
    if (reply0 != -1) {
      setReply0(-1)
      setInput0('')
      setInput1('')
    } //楼主输入框打开 则先关闭楼主输入框
    if (reply11 == index1 && reply10 == index0) {
      //为真即该index1索引的输入框在点击前已经打开 需要在此时关闭
      setReply10(-1)
      setReply11(-1)
      setInput0('')
      setInput1('')
    } else {
      setReply10(index0)
      setReply11(index1)
      setInput0('')
      setInput1('')
    }
  }
  useEffect(() => {
    if (reply0 != -1) {
      const all_reply_dom = document.querySelectorAll(`.inputbox1`)
      all_reply_dom.forEach((ele) => {
        ele.style.display = 'none'
      })
      const reply_dom = document.querySelector(`.comment${reply0} .inputbox1`)
      if (reply_dom) reply_dom.style.display = 'flex'
    } else if (reply0 == -1) {
      const reply_dom1 = document.querySelectorAll(`.inputbox1`)
      if (reply_dom1) {
        reply_dom1.forEach((ele) => {
          ele.style.display = 'none'
        })
      }
    }
  }, [reply0])
  useEffect(() => {
    if (reply11 != -1 && reply10 != -1) {
      const all_reply_dom = document.querySelectorAll(`.inputbox2`)
      all_reply_dom.forEach((ele) => {
        ele.style.display = 'none'
      })
      const reply_dom = document.querySelector(
        `.comment${reply10} .comment_child${reply11} .inputbox2`
      )
      if (reply_dom) reply_dom.style.display = 'flex'
    } else if (reply11 == -1 && reply10 == -1) {
      const reply_dom2 = document.querySelectorAll(`.inputbox2`)
      if (reply_dom2) {
        reply_dom2.forEach((ele) => {
          ele.style.display = 'none'
        })
      }
    }
  }, [reply11])
  /////////////////////////////////////////////////////////////////////////////////
  //评论输入框发表及气泡框
  const text_onChange0 = (e) => {
    //楼主 评论输入框
    // console.log(e.target.value)
    setInput0(e.target.value)
  }

  const text_onChange1 = (e) => {
    //楼主 子评论输入框
    console.log(e.target.value)
    setInput1(e.target.value)
  }

  const text_post0 = async () => {
    //楼主 评论按钮
    if (currentUser) {
      if (input0 != '') {
        const postdata = {
          user_uuid: currentUser.uuid,
          post_id: article_id,
          comment_content: input0,
          comments_num: commentsnum,
        }
        const res = await axios.post(`/single_article/commentsADD`, postdata)
        // console.log(res.data)
        // console.log(input0)
        const recordinputs = {
          operation: 'SingleArt 发表评论',
          resource_id: article_id,
          region: '江苏 南京',
          user: currentUser.username,
          access: '普通用户',
          user_id: currentUser.id,
        }
        const res1 = await axios.post('/record', recordinputs) //日志
        api.info({
          message: `${currentUser.name}`,
          description: `您已对该文章发表评论`,
          placement: 'bottomRight',
          icon: (
            <MessageOutlined
              style={{
                color: 'rgb(66, 66, 66)',
              }}
            />
          ),
        })
        setRefresh(true)
      } else {
        api.info({
          message: `${currentUser.name}`,
          description: `评论不可以为空`,
          placement: 'bottomRight',
          icon: (
            <ExclamationCircleOutlined
              style={{
                color: 'red',
              }}
            />
          ),
        })
      }
    } else {
      api.info({
        message: `无评论权限`,
        description: `请登录再操作`,
        placement: 'bottomRight',
        icon: (
          <ExclamationCircleOutlined
            style={{
              color: 'red',
            }}
          />
        ),
      })
    }
  }

  const text_post1 = async (father_id, reply_id) => {
    //楼主 子评论按钮
    if (currentUser) {
      if (input1 != '') {
        console.log(2222)
        const postdata = {
          user_uuid: currentUser.uuid,
          post_id: article_id,
          comment_content: input1,
          father_comment_id: father_id,
          reply_to_id: reply_id,
          comments_num: commentsnum,
        }
        const res = await axios.post(
          `/single_article/child_commentsADD`,
          postdata
        )
        const recordinputs = {
          operation: 'SingleArt 发表子评论',
          resource_id: article_id,
          region: '江苏 南京',
          user: currentUser.username,
          access: '普通用户',
          user_id: currentUser.id,
        }
        const res1 = await axios.post('/record', recordinputs) //日志
        // console.log(input0)
        // console.log(res.data)
        api.info({
          message: `${currentUser.name}`,
          description: `您已对该评论发表子评论`,
          placement: 'bottomRight',
          icon: (
            <MessageOutlined
              style={{
                color: 'rgb(66, 66, 66)',
              }}
            />
          ),
        })
        setRefresh(true)
      } else {
        api.info({
          message: `${currentUser.name}`,
          description: `评论不可以为空`,
          placement: 'bottomRight',
          icon: (
            <ExclamationCircleOutlined
              style={{
                color: 'red',
              }}
            />
          ),
        })
      }
    } else {
      api.info({
        message: `无评论权限`,
        description: `请登录再操作`,
        placement: 'bottomRight',
        icon: (
          <ExclamationCircleOutlined
            style={{
              color: 'red',
            }}
          />
        ),
      })
    }
  }

  /////////////////////////////////////////////////////////////////////////////////
  //删评按钮操作

  const handleOk = async () => {
    //删除楼主评论对话框
    setModalText('正在删除评论')
    setConfirmLoading(true)
    console.log(comment_child_data)

    const delete_child_num = comment_child_data.filter(
      (item) => item.father_comment_id == index0_id
    ).length
    const res = await axios.delete(
      `/single_article/commentsDELETE/${index0_id}?post_id=${article_id}&comments_num=${
        commentsnum - delete_child_num
      }`
    )
    console.log(res.data)
    const recordinputs = {
      operation: 'SingleArt 删除评论',
      resource_id: article_id,
      region: '江苏 南京',
      user: currentUser.username,
      access: '管理员',
      user_id: currentUser.id,
    }
    const res1 = await axios.post('/record', recordinputs) //日志
    setTimeout(() => {
      setOpen(false)
      setConfirmLoading(false)
      setModalText('您确认是否删除该评论？')
      setRefresh(true)
    }, 1000)
  }
  const handleOk1 = async () => {
    //删除子评论对话框
    setModalText1('正在删除子评论')
    setConfirmLoading(true)
    const res = await axios.delete(
      `/single_article/child_commentsDELETE/${index1_id}?post_id=${article_id}&comments_num=${commentsnum}`
    )
    console.log(res.data)
    setTimeout(() => {
      setOpen1(false)
      setConfirmLoading(false)
      setModalText1('您确认是否删除该子评论？')
      setRefresh(true)
    }, 1000)
  }
  const handleCancel = () => {
    setOpen(false)
    setOpen1(false)
  }
  //评论删除
  const comment_delete = async (index0) => {
    setIndex0_id(index0)
    setOpen(true)
  }

  //子评论删除
  const comment_child_delete = async (index1) => {
    setIndex1_id(index1)
    setOpen1(true)
  }

  //点击评论图标下滑
  const comments_icon_click = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }
  /////////////////////////////////////////////////////////////////////////////////
  return (
    <ConfigProvider
      //antd主题色修改为迷彩绿
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: '#749946',
          borderRadius: 6,
        },
      }}>
      <div className="containerarticle1">
        <Modal
          title="评论删除"
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}>
          <p>{modalText}</p>
        </Modal>
        <Modal
          title="子评论删除"
          open={open1}
          onOk={handleOk1}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}>
          <p>{modalText1}</p>
        </Modal>
        <div className="articlebigbox">
          <div className="articleheader1"></div>
          {singleart ? (
            <div className="articlebox">
              <div className="menu">
                <div className="authorbox">
                  <div className="avatarbox">
                    <img src={avatar} alt="" />
                  </div>
                  <div className="authorfile">
                    <p>{singleart.user_name}</p>
                    <p className="authormajor">{singleart.user_major}</p>
                  </div>
                </div>
                <List
                  header={<h3>该作者的其他文章</h3>}
                  itemLayout="horizontal"
                  dataSource={otherart}
                  className="otherarticles"
                  renderItem={(item, index) => (
                    <a href={`/singleart/${item.user_uuid}/${item.id}`}>
                      <List.Item>
                        <List.Item.Meta
                          title={<span className="s1">{item.title}</span>}
                          description={
                            <span className="s2">
                              {item.topdescription}
                              <span className="eye" style={{ float: 'right' }}>
                                <EyeOutlined /> {Math.floor(item.readings)}
                              </span>
                            </span>
                          }
                        />
                      </List.Item>
                    </a>
                  )}
                />
                <List
                  header={<h3>热门文章 TOP10</h3>}
                  itemLayout="horizontal"
                  dataSource={tops}
                  className="menulist"
                  renderItem={(item, index) => (
                    <a href={`/singleart/${item.user_uuid}/${item.id}`}>
                      <List.Item>
                        <List.Item.Meta
                          title={<span className="s1">{item.title}</span>}
                          description={
                            <span className="s2">
                              {item.topdescription}
                              <span className="eye" style={{ float: 'right' }}>
                                <EyeOutlined /> {Math.floor(item.readings)}
                              </span>
                            </span>
                          }
                        />
                      </List.Item>
                    </a>
                  )}
                />
              </div>
              <div className="single_articlebox">
                <div ref={articleContentRef} className="single_article">
                  <div className="floatblock">
                    <span className="smallimg">
                      <img src={avatar} alt="" />
                    </span>
                    {singleart.user_name}
                    <span className="floatright">
                      {contextHolder}
                      <LikeOutlined
                        className="likesButton"
                        onClick={() => likesADD('bottomRight')}
                        style={
                          iflike
                            ? { fontSize: '22px', color: '#73a537' }
                            : { fontSize: '18px', color: '#ffffff' }
                        }
                      />
                      &nbsp;&nbsp;
                      {likesnum}
                      &nbsp;&nbsp;&nbsp;
                      <MessageOutlined
                        className="commentsButton"
                        onClick={comments_icon_click}
                      />
                      &nbsp;&nbsp;
                      {commentsnum}
                      &nbsp;&nbsp;&nbsp;
                    </span>
                  </div>
                  <div className="single_first">
                    <h1 className="single_title">{singleart.title}</h1>
                    <p className="single_description">
                      <span className="fright">
                        {singleart.category}&nbsp;&nbsp;&nbsp;
                        {singleart.post_date}
                        &nbsp;&nbsp;&nbsp;
                        <EyeOutlined /> {Math.floor(singleart.readings)}
                        &nbsp;&nbsp;&nbsp;
                      </span>
                    </p>
                    <hr className="hr"></hr>
                    <div className="single_imgbox">
                      {articleimg ? <img src={articleimg} alt="" /> : ''}
                    </div>
                  </div>
                  <div className="single_contentbox">
                    <div
                      className="single_content"
                      dangerouslySetInnerHTML={{
                        __html: singleart.content,
                      }}></div>
                  </div>
                </div>
                <div className="commentsbox" ref={commentsRef}>
                  <div className="comments_writebox">
                    <h3 className="write_title">评论 {commentsnum} 条</h3>
                    <div className="comments_write">
                      <img src={commentAvatar} alt="" />
                      <div className="inputbox">
                        <div className="write">
                          <TextArea
                            showCount
                            maxLength={100}
                            style={{
                              height: 80,
                              resize: 'none',
                            }}
                            onChange={text_onChange0}
                            placeholder="请发表您的评论"
                          />
                        </div>
                        <div className="writesec">
                          <Button
                            className="postbtn"
                            onClick={() => text_post0()}>
                            发表
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="comments_content">
                    <div className="commentbox">
                      <List
                        itemLayout="horizontal"
                        dataSource={comment_data}
                        renderItem={(item) => (
                          <List.Item className={`comment comment${item.id}`}>
                            <List.Item.Meta
                              avatar={<Avatar src={item.user_img} />}
                              title={<p>{item.comment_content}</p>}
                              description={`${item.user_name} ${item.user_major} ${item.comment_date}`}
                              className={`landlord landlord${item.id}`}
                            />
                            <div className="reply0">
                              {delete_qualification == true ||
                              (currentUser &&
                                currentUser.uuid == item.user_uuid) ? (
                                <span
                                  className="deletebtn0"
                                  onClick={() => {
                                    comment_delete(item.id)
                                  }}>
                                  <CloseCircleOutlined />
                                  &nbsp; 删除
                                </span>
                              ) : (
                                ''
                              )}
                              <span
                                className="replybtn0"
                                onClick={() => {
                                  comment_reply(item.id)
                                }}>
                                <MessageOutlined />
                                &nbsp; 回复
                              </span>
                            </div>
                            <div className="inputbox1">
                              <div className="write">
                                <TextArea
                                  showCount
                                  maxLength={100}
                                  style={{
                                    height: 80,
                                    resize: 'none',
                                  }}
                                  onChange={text_onChange1}
                                  placeholder="请发表您的评论"
                                />
                              </div>
                              <div className="writesec">
                                <Button
                                  className="postbtn"
                                  onClick={() => text_post1(item.id, -1)}>
                                  发表
                                </Button>
                              </div>
                            </div>
                            <List
                              className="comment_childbox"
                              itemLayout="horizontal"
                              dataSource={comment_child_data.filter(
                                (item1) => item1.father_comment_id === item.id
                              )}
                              renderItem={(item1) => (
                                <List.Item
                                  className={`comment_child comment_child${item1.id}`}>
                                  <List.Item.Meta
                                    avatar={<Avatar src={item1.user_img} />}
                                    title={
                                      item1.reply_to_name === '-1'
                                        ? item1.comment_content
                                        : `回复 ${
                                            item1.reply_to_name === undefined
                                              ? '已删除'
                                              : item1.reply_to_name
                                          }:
                                          ${item1.comment_content}`
                                    }
                                    description={`${item1.user_name} ${item1.user_major} ${item1.comment_date}`}
                                  />
                                  <div className="reply">
                                    {delete_qualification == true ||
                                    (currentUser &&
                                      currentUser.uuid == item1.user_uuid) ? (
                                      <span
                                        className="deletebtn"
                                        onClick={() => {
                                          comment_child_delete(item1.id)
                                        }}>
                                        <CloseCircleOutlined />
                                        &nbsp; 删除
                                      </span>
                                    ) : (
                                      ''
                                    )}
                                    <span
                                      className="replybtn"
                                      onClick={() => {
                                        comment_child_reply(item.id, item1.id)
                                      }}>
                                      <MessageOutlined />
                                      &nbsp; 回复
                                    </span>
                                  </div>
                                  <div className="inputbox2">
                                    <div className="write">
                                      <TextArea
                                        showCount
                                        maxLength={100}
                                        style={{
                                          height: 80,
                                          resize: 'none',
                                        }}
                                        onChange={text_onChange1}
                                        placeholder="disable resize"
                                      />
                                    </div>
                                    <div className="writesec">
                                      <Button
                                        className="postbtn"
                                        onClick={() =>
                                          text_post1(item.id, item1.id)
                                        }>
                                        发表
                                      </Button>
                                    </div>
                                  </div>
                                </List.Item>
                              )}
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </ConfigProvider>
  )
}

export default Article
