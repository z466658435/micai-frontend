import React, { useState, useEffect } from 'react'
import { MailOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import {
  Input,
  Pagination,
  Card,
  Col,
  Row,
  Carousel,
  ConfigProvider,
} from 'antd'
import axios from 'axios'
import avatar0 from '../static/img/0.jpg'
import Footer from '../components/Footer'

const { Meta } = Card
const { Search } = Input

const Picture = () => {
  const [members, setMembers] = useState([])
  const [fresh, setFresh] = useState(false)
  const [imageUrls, setImageUrls] = useState([])

  const demos = [
    {
      division: '安全环境学部',
      college: ['安全科学与工程学院', '环境科学与工程学院', '应急管理学院'],
    },
    { division: '材料科学学部', college: ['材料科学与工程学院'] },
    { division: '化学化工学部', college: ['化工学院', '化学与分子工程学院'] },
    {
      division: '机械控制学部',
      college: [
        '电气工程与控制科学学院',
        '机械与动力工程学院',
        '能源科学与工程学院',
      ],
    },
    { division: '健康科技学部', college: ['药学院'] },
    { division: '建筑艺术学部', college: ['建筑学院', '艺术设计学院'] },
    { division: '经济管理学部', college: ['经济与管理学院'] },
    {
      division: '人文社科学部',
      college: ['法政学院', '马克思主义学院', '外国语言文学学院', '体育学院'],
    },
    {
      division: '生物制造学部',
      college: ['生物与制药工程学院', '食品与轻工学院'],
    },
    {
      division: '数理信息学部',
      college: ['计算机与信息工程学院', '柔性电子学院', '数理科学学院'],
    },
    {
      division: '土木交通学部',
      college: [
        '测绘科学与技术学院',
        '城市建设学院',
        '交通运输工程学院',
        '土木工程学院',
      ],
    },
    {
      division: '其他培养单位',
      college: ['2011学院', '海外教育学院', '浦江学院'],
    },
  ]

  //轮播图
  const contentStyle = {
    height: '300px',
    color: '#fff',
    lineHeight: '300px',
    textAlign: 'center',
    background: '#364d79',
  }

  // 更新图像URL的函数
  const updateImageUrls = (data) => {
    const urls = data.map(async (item) => {
      if (item.img === '0') {
        return avatar0
      } else {
        const avatar_image = await axios.get(
          `/picture/image/${item.img}?userid=${item.id}`,
          {
            responseType: 'blob',
          }
        )
        return URL.createObjectURL(avatar_image.data)
      }
    })
    Promise.all(urls).then((urlArray) => {
      setImageUrls(urlArray)
    })
  }

  function getItem(label, key, icon, children, type) {
    return {
      label,
      key,
      icon,
      children,
      type,
    }
  }

  const items = demos.map((demo, index) => {
    const divisionMenuItem = getItem(
      demo.division,
      `sub${index + 1}`,
      <MailOutlined />,
      [
        // 使用 map 生成 college 选项
        ...demo.college.map((college, collegeIndex) =>
          getItem(college, `${index + 1}-${collegeIndex + 1}`)
        ),
      ]
    )
    return divisionMenuItem
  })
  // console.log(112331)
  // console.log(items)
  const rootSubmenuKeys = items.map((item) => item.key)
  const [openKeys, setOpenKeys] = useState([])

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1)
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys)
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  var totalnumber = members.length
  const [currentPage, setCurrentPage] = useState(1)
  const [searchValue, setSearchValue] = useState('')
  const [chooseCollege, setChooseCollege] = useState('')

  //更新URL
  const currentURL = new URL(window.location.href)
  const updateURL = (page, value, major) => {
    currentURL.searchParams.set('page', page)
    currentURL.searchParams.set('value', value)
    currentURL.searchParams.set('major', major)
    // 更新网址
    window.history.replaceState(null, '', currentURL)
  }

  // onChange 回调函数
  const handlePageChange = (page) => {
    setCurrentPage(page)
    const currentPage1Element = document.querySelector('.ant-pagination-item-1')
    if (page !== 1 && currentPage1Element) {
      currentPage1Element.classList.remove('ant-pagination-item-active')
    }
    updateURL(page, searchValue, chooseCollege)
  }

  const [selectedKeys, setSelectedKeys] = useState([])
  //搜索框
  const onSearch = async (value) => {
    const type = 2
    setSearchValue(value)
    try {
      const res = await axios.get(`/init_data/pic/${value}/${type}`)
      updateImageUrls(res.data)
      setMembers(res.data)
      updateURL(currentPage, value, chooseCollege)
      setOpenKeys('')
      setSelectedKeys('')
      console.log(2222)
    } catch (err) {
      console.log(err)
    }
  }

  //学院选择
  const onClickItem = async (item) => {
    setSelectedKeys(item.keyPath)
    const foundItems = items.find(
      (item0) => item0.key === item.keyPath[1]
    ).children
    const needItem = foundItems.find((item0) => item0.key === item.keyPath[0])
    const college = needItem.label
    setChooseCollege(college)
    const type = 1
    try {
      const res = await axios.get(`/init_data/pic/${college}/${type}`)
      updateImageUrls(res.data)
      setMembers(res.data)
      updateURL(currentPage, searchValue, college)
      console.log(222222)
    } catch (err) {
      console.log(err)
    }
  }

  //数据初始化
  useEffect(() => {
    const type = 0
    const fetchall = async () => {
      try {
        const res = await axios.get(`/init_data/pic/${0}/${type}`)
        const filter_data = res.data.filter((item) => item.img !== '0') //只展示换过初始头像的用户
        updateImageUrls(filter_data)
        setMembers(filter_data)
        // console.log(res.data)
        // console.log(filter_data)
        const currentPage1Element = document.querySelector(
          '.ant-pagination-item-1'
        )
        if (currentPage === 1 && currentPage1Element) {
          currentPage1Element.classList.add('ant-pagination-item-active')
        }
        // console.log(66666)
        // console.log(currentPage)
        // console.log(66666)
      } catch (err) {
        console.log(err)
      }
    }
    fetchall()
    setFresh(false)

    //页面有x轴时初始化居中
    const scrollContainer = document.querySelector('.container')
    if (scrollContainer) {
      const initialScrollLeft =
        (scrollContainer.scrollWidth - scrollContainer.clientWidth) / 2
      scrollContainer.scrollLeft = initialScrollLeft
    }
  }, [fresh])

  const collegetitle = () => {
    setFresh(true)
    const selectedItem = document.querySelectorAll('.ant-menu-item-selected')[0]
    if (selectedItem) selectedItem.classList.remove('ant-menu-item-selected')
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
      <div className="containerpic">
        <div className="picbox">
          <div className="head">
            <span>成员相册</span>
          </div>
          <div className="carousel">
            <Carousel autoplay>
              <div>
                <h3 style={contentStyle}>1</h3>
              </div>
              <div>
                <h3 style={contentStyle}>2</h3>
              </div>
              <div>
                <h3 style={contentStyle}>3</h3>
              </div>
              <div>
                <h3 style={contentStyle}>4</h3>
              </div>
            </Carousel>
          </div>
          <div className="main">
            <div className="box1">
              <div className="division_title" onClick={collegetitle}>
                <p>学 院</p>
              </div>

              {/* 导航 */}
              <ConfigProvider
                theme={{
                  components: {
                    Menu: {
                      algorithm: true, // 启用算法
                    },
                  },
                }}>
                <Menu
                  mode="inline"
                  theme="dark"
                  openKeys={openKeys}
                  onOpenChange={onOpenChange}
                  onClick={onClickItem}
                  style={{ width: 256 }}
                  selectedKeys={selectedKeys}
                  items={items}
                />
              </ConfigProvider>
            </div>

            <div className="box2">
              <div className="box_header">
                <div className="totalnum">
                  <span>查找到</span>
                  <span>{totalnumber}</span>
                  <span>人</span>
                </div>
                <div className="pagination">
                  <Pagination
                    defaultCurrent={1}
                    total={totalnumber}
                    onChange={handlePageChange}
                    hideOnSinglePage={true}
                    pageSize={8}
                  />
                </div>
                <div className="search">
                  <Search
                    placeholder="搜索姓名"
                    onSearch={onSearch}
                    enterButton
                  />
                </div>
              </div>
              <div className="pic">
                {members
                  .slice((currentPage - 1) * 8, (currentPage - 1) * 8 + 8)
                  .map((demo, index) => (
                    <>
                      {index % 4 === 0 && (
                        <Row
                          key={`row-${index / 4}`}
                          gutter={[0, { xs: 8, sm: 16, md: 24, lg: 32 }]}
                          className="row"
                          style={{ margin: 0 }}>
                          {members
                            .slice(
                              index + (currentPage - 1) * 8,
                              index + 4 + (currentPage - 1) * 8
                            )
                            .map((demo, index1) => (
                              <Col
                                className="gutter-row"
                                span={6}
                                key={`col-${index1}`}>
                                <div className="gutter-div">
                                  <Link to={`/singlepic/${demo.uuid}`}>
                                    <Card
                                      hoverable
                                      style={{ width: 200 }}
                                      cover={
                                        <img
                                          alt="avatar loading~"
                                          style={{ height: 180 }}
                                          src={
                                            imageUrls[
                                              index1 +
                                                index +
                                                (currentPage - 1) * 8
                                            ]
                                          }
                                        />
                                      }
                                      className="card">
                                      <Meta
                                        title={demo.name}
                                        description={demo.major}
                                        style={{ height: 70 }}
                                      />
                                    </Card>
                                  </Link>
                                </div>
                              </Col>
                            ))}
                        </Row>
                      )}
                    </>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer ifHome={false} />
    </ConfigProvider>
  )
}

export default Picture
