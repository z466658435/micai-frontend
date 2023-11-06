import React, { useEffect, useState } from 'react'
import carousel5 from '../static/img/carousel05.png'
import { SmileOutlined, BookOutlined } from '@ant-design/icons'
import { Image } from 'antd'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import avatar0 from '../static/img/0.jpg'

const Single = () => {
  const [proinfo, setProinfo] = useState({})
  const [avatardata, setAvatardata] = useState({})
  const [photos, setPhotos] = useState([])
  const params = useParams()
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
                    console.log(`current index: ${current}, prev index: ${prev}`),
                }}>
                {photos.map((item, index) => (
                  <Image key={index} src={item.imageUrl} className="img" />
                ))}
              </Image.PreviewGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Single
